var rsPath = "https://secure.solwise.co.uk/remotesite/";
var re = new RegExp("^(www.){0,1}solwise.co.uk", "i");
if(!re.test(window.location.host)) {
	rsPath = "http://10.0.10.211/trolley2022/www/remotesite/";
}
var rsEnabled = cookiesEnabled();
//Disable for IE--Does not handle CORS properly
var isIE = false;
/*if(/MSIE (\d+\.\d+);/.test(navigator.userAgent)) { //test for MSIE x.x;
	//rsEnabled = false;
	isIE = true;
} else if(navigator.appName === 'Netscape') { //Test for IE 11+
	re = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
	if(re.exec(navigator.userAgent) !== null) {
		isIE = true;
	}
}*/


/*
 * Get stock data
 **/
var std_ts = parseInt(new Date().valueOf() / 1000); //Max expire approx 15mins
document.write("<script type='text/javascript' src='includes/stdata.js?" + std_ts + "'></" + "script>");


/*
 * Page configuration
 */
var page = new pageConfiguration();
function pageConfiguration() {
	//Load Singleton?
	if(arguments.callee._rsInstance) {
		return arguments.callee._rsInstance;
	} else {
/*
 * 
 * @type ArrayAssociated stock
 */
		//Array of stock code(s) this page is associated with (if any)
		var _associatedStockCode = null;
		//Returns the array of associated stock code(s)
		var _getAssociatedStockArray = function() {
			return _associatedStockCode;
		};
		//Returns the associated stock code as a string (first stock code if there are multiple)
		var _getAssociatedStockCode = function() {
			if($.isArray(_associatedStockCode)) {
				return _associatedStockCode[0];
			} else {
				return null;
			}
		};
		//Defines the page's associated stock (accepts single or comma-delimited stockcodes)
		var _setAssociatedStockCode = function(stockCode) {
			if(stockCode !== undefined && stockCode !== null && stockData !== undefined) {
				var terms = stockCode.split(",");
				_associatedStockCode = [];
				$.each(terms, function(key, val) {
					if(stockData[val] !== undefined) {
						_associatedStockCode.push(val);
					}
				});
				if(_associatedStockCode.length < 1) {
					_associatedStockCode = null;
				}
			}
		};
		
		//Public interface
		return {
			associateWithStock: _setAssociatedStockCode,
			associatedStock: _getAssociatedStockArray,
			associatedStockCode: _getAssociatedStockCode
		};
	}
}

/*
 * Remote site status
 */
/**
 * jQuery method extension to help retrieve GET vars.
 * ************************************************** This is also in the solwise_functions file which loads AFTER sol_data so funtionality is not available here.
 */
/* //undefined $
$.extend({
	getUrlVars: function() {
		var vars = [], hash;
		var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
		for(var i = 0; i < hashes.length; i++) {
			hash = hashes[i].split('=');
			vars.push(hash[0]);
			vars[hash[0]] = hash[1];
		}
		return vars;
	},
	getUrlVar: function(name) {
		return $.getUrlVars()[name];
	}
});//*/
var rsToken;
function rs() {
	//Load Singleton?
	if(arguments.callee._rsInstance) {
		return arguments.callee._rsInstance;
	} else {
		//Object def for rs reg
		function _rsReg() {
			var _rst;
			var _rsa;
			var _defined = false;
			var _isDefined = function() { return _defined; };
			var _set = function(rst, rsa) {
				if(_rst === undefined && typeof rst === "string") {
					if(rst.length === 40) {
						_rst = rst;
						setCookie("rs_rst", rst, 0, 0, 30);
						_defined = true;
						if(_rsa === undefined && typeof rsa === "string") {
							if(rsa.length === 40) {
								_rsa = rsa;
								setCookie("rs_rsa", rsa, 0, 0, 30);
							}
						}
					}
				}
			};
			var _get = function() {
				var ret = {
					__rst: _rst
				};
				if(_rsa !== undefined) ret.__rsa = _rsa;
				return {
					__rst: _rst,
					__rsa: _rsa
				};
			};
			var _add = function(obj) {
				obj.__rst = _rst;
				obj.__rsa = _rsa;
				return obj;
			};
			return {
				defined: _isDefined,
				set: function(rst,rsa) {_set(rst,rsa);return this;},
				get: _get,
				add: _add
			};
		}
		
//Private
		var _rsCheckedPreVerify = false;
		var _verified = false;
		var _rsLoaded = false;
		var _rsValid = false;
		var _loggedIn = false;
		var _accountType = "retail";
		var _contactName = null;
		var _verifyTStamp;
		var _rst = new _rsReg();
		
		var _defineRSToken = function(rst, rsa) {
			if(!_rst.defined()) {
				_rst.set(rst, rsa);
			}
		};
		
		var _getSignInString = function() {
			if(_loggedIn) {
				return "Log out";
			} else {
				return "Sign-in <small>(optional)</small>";
			}
		};
		
		var _setLogIn = function(newValue) {
			if(newValue === true) {
				_loggedIn = true;
				$(".rs_signin").html(_getSignInString());
				$("a.rs_signin").attr("href", "https://secure.solwise.co.uk/logout.php");
			} else {
				_loggedIn = false;
				_accountType = "retail";
				$(".rs_signin").html(_getSignInString());
				$("a.rs_signin").attr("href", "https://secure.solwise.co.uk/login.php");
			}
			_showAccountLinks();
		};
		
		var _showAccountLinks = function() {
			var html = "";
			if(_loggedIn) {
				html = "<a href='https://secure.solwise.co.uk/welcome.php'>Account</a> |";
			}
			$(function() {
				$(".rs_accountlinks").html(html);
			});
		};
		
		var _setContactName = function(contactName) {
			var welcomeMessage = "";
			if(contactName === undefined || contactName === null || contactName === "") {
				_contactName = null;
				welcomeMessage = "";
				
			} else {
				_contactName = contactName;
				welcomeMessage = "Welcome back, <strong>" + contactName + "</strong>";
			}
			$(function() {
				$(".rs_welcomemessage").html(welcomeMessage);
			});
		};
		
		//Determines if rs communication is valid and not spawning new sessions on every request (stupid MSIE)
		var _isRsValid = function() {
			return _rsValid === true;
		};
		
		//Mark as verified, trigger OnVerify event immediately
		var _verifiedNow = function() {
			_verified = true;
			_onVerify_Handler();
		};
		//Mark as verified, defer OnVerify event trigger until after callable function has completed
		var _verifiedAfter = function(callable) {
			_verified = true;
			if(typeof callable === 'function') {
				callable();
			}
			_onVerify_Handler();
		};
		//On Verify callbacks
		var _onVerify = [];
		//On Verify event handler
		var _onVerify_Handler = function() {
			$.each(_onVerify, function(i, routine) {
				if(typeof routine === 'function') {
					routine();
				}
			});
			rsToken_registerEvents();
		};
		//On Verify event callback registration
		var _onVerify_Register = function(callable) {
			if(typeof callable === 'function') {
				_onVerify.push(callable);
			}
		};
		
		var _verify_cookies = function() {
			var rs_rst = getCookie("rs_rst");
			var rs_rsa = getCookie("rs_rsa");
			var rs_lgi = getCookie("rs_lgi");
			var rs_act = getCookie("rs_act");
			var rs_name = getCookie("rs_name");
			if(rs_rst !== "") _defineRSToken(rs_rst, rs_rsa);
			if(rs_lgi !== "" && rs_act !== "") {
				_setContactName(rs_name);
				_setLogIn(rs_lgi === "true");
				_rsValid = true;
				if(rs_act === "trade" || rs_act === "educational" || rs_act === "retail") {
					_accountType = rs_act;
				}
				_verifiedNow();
			}
		};
		
		var _verify_token = function(token) {
			if(token !== undefined) {
				if(token.loggedIn !== undefined && token.accountType !== undefined && token.tStamp !== undefined && token.__rst !== undefined) {
					if(token.tStamp === _verifyTStamp) {
						_rst = new _rsReg();
						_defineRSToken(token.__rst, token.__rsa);
						_setLogIn(token.loggedIn === true && token.__rst !== undefined && token.__rsa !== undefined);
						if(token.accountType === "trade" || token.accountType === "educational" || token.accountType === "retail") {
							_accountType = token.accountType;
						}
						if(_loggedIn) {
							_setContactName(token.contactName);
							setCookie("rs_lgi", _loggedIn, 0, 0, 30);
							setCookie("rs_act", _accountType, 0, 0, 30);
							setCookie("rs_name", _contactName, 0, 0, 30);
							//If rs state has been checked pre-verification, trigger a quick reload to reflect new state
							if(_rsCheckedPreVerify === true) {
								if(window.location.protocol === "https:" || window.location.protocol === "http:") {
									location.reload();
								}
							}
						}
					}
				}
			}
		};
		
		var _validate_token = function(token) {
			if(!_verified && token !== undefined) {
				if(token.__rst !== undefined) {
					if(window.location.protocol === "https:" || window.location.protocol === "http:") {
						var valTStamp = new Date().getTime();
						_setCallback(function(valResponse) {
							//Response present?
							if(valResponse !== undefined) {
								//Process response
								if(valResponse.tStamp === valTStamp && valResponse.validity === true) {
									_rsValid = true;
								}
								_verifiedAfter(function() {
									_verify_token(token);
								});
							}
						});

						var po = document.createElement("script");
						po.type = "text/javascript";
						po.async = "false";
						po.src = rsPath + "jsonp_validatetoken.php?"+$.param({
							timestamp: valTStamp,
							token: token.__rst
						});
						var s = document.getElementsByTagName("script")[0];
						s.parentNode.insertBefore(po, s);
					}
				}
			}
		};
		
		var _verify = function() {
			if(!_verified) {
				//Check cookie
				_verify_cookies();
				
				//Token provided?
				/*if(!_verified && token !== undefined) {
					_verifiedAfter(function() {
						_verify_token(token);
					});
				}*/
				
				//Get token
				if(!_verified && !_rsLoaded) {
					if(window.location.protocol === "https:" || window.location.protocol === "http:") {
						_rsLoaded = true;
						_verifyTStamp = new Date().getTime();
						_setCallback(function(token) {
							//Token provided?
							if(!_verified && token !== undefined) {
								_validate_token(token);
								/*_verifiedAfter(function() {
									_verify_token(token);
								});*/
							}
						});
						var po = document.createElement("script");
						po.type = "text/javascript";
						po.async = "false";
						po.src = rsPath + "jsonp_remotesite.php?timestamp=" + _verifyTStamp;
						var s = document.getElementsByTagName("script")[0];
						s.parentNode.insertBefore(po, s);
					} else {
						//Cannot set cookies on local file protocol so there is little point in loading remote session
						//_verifiedNow();
					}
				}
			}
			return _verified;
		};
		
		//Stores a callback function when needed
		var _callbackFunction = null;
		//Sets the callback function
		var _setCallback = function(callback) {
			if(typeof callback === "function") _callbackFunction = callback;
		};
		//Performs and unsets the callback
		var _callback = function(data) {
			var cbf = _callbackFunction;
			_callbackFunction = null;
			if(typeof cbf === "function") {
				cbf(data);
			}
		};
		
		var _rememberUser = function(username) {
			setCookie("rs_user", username, 30, 0, 0);
		};
		var _forgetUser = function() {
			setCookie("rs_user", "", -30, 0, 0);
		};
		
		var _logIn = function(username, password, persist) {
			//Validate
			if(username === undefined || password === undefined || username.length < 3 || password.length < 3) {
				$("#rs_signin_error").text("Please enter your username (or email) and password in the text boxes below.");
			} else {
				//Clear error box
				$("#rs_signin_error").text("");
				//Display loader graphic
				$("#rs_signin_form .preloader").fadeIn(200);
				
				//Attempt login
				_rsCheckedPreVerify = true;
				_verifyTStamp = new Date().getTime();
				var logInToken = {
					timestamp: _verifyTStamp,
					format: "JSONP",	
					rs_user: username,
					rs_pass: password,
					rs_persist: persist
				};
				//$.getJSON(rsPath + "jsonp_remotesite.php", _rst.add(logInToken)).done(function(signResponse) {
				_setCallback(function(signResponse) {
					//Remove loader graphic
					$("#rs_signin_form .preloader").css("display", "none");
					
					//Handle response
					if(signResponse.response === undefined) {
						$("#rs_signin_error").html("There was a problem signing you in.<br />Please try again later.");
					} else {
						if(signResponse.response.success) {
							//Verify token
							_verify_token(signResponse);
							
							//Handle remember me option
							if(persist == "1") {
								_rememberUser(username);
							} else {
								_forgetUser();
							}
						} else {
							$("#rs_signin_error").text(signResponse.response.error);
						}
					}
				});
				var po = document.createElement("script");
				po.type = "text/javascript";
				po.async = "false";
				po.src = rsPath + "jsonp_remotesite.php?"+$.param(_rst.add(logInToken));
				var s = document.getElementsByTagName("script")[0];
				s.parentNode.insertBefore(po, s);
			}
		};
		
		var _logOut = function() {
			//Clear error box
			$("#rs_signin_error").text("");

			//Log out
			_rsCheckedPreVerify = true;
			_verifyTStamp = new Date().getTime();
			var logOutToken = {
				timestamp: _verifyTStamp,
				format: "JSONP",	
				rs_signout: true
			};
			_setCallback(function(logoutResponse) {
			//$.getJSON(rsPath + "jsonp_remotesite.php", _rst.add(logOutToken)).done(function(logoutResponse) {
				_setLogIn(false);
				setCookie("rs_lgi", _loggedIn, -1, -1, -1);
				setCookie("rs_act", _accountType, -1, -1, -1);
				if(window.location.protocol === "https:" || window.location.protocol === "http:") {
					location.reload();
				}
			});
			var po = document.createElement("script");
			po.type = "text/javascript";
			po.async = "false";
			po.src = rsPath + "jsonp_remotesite.php?"+$.param(_rst.add(logOutToken));
			var s = document.getElementsByTagName("script")[0];
			s.parentNode.insertBefore(po, s);
		};
		
//Construct
		
		//Register on verify routines
		_onVerify_Register(function() {
			//Instantiate objects that need registering for rs
			if(_isRsValid() && !isIE) {
				trolley = new rsTrolley(_rst);
			}
			
			//Recall remembered user
			if(getCookie("rs_user") != "") {
				$(function() {
					$("#rs_signin_username").val(getCookie("rs_user"));
				});
			}
		});
		
		//Only load if user agent is compatible
		if(rsEnabled) {
			//Auto-verify
			_verify();
		}
		
		//Should we prompt users about the IE CORS issue?
		if(isIE) {
			$(function() {
				var iePrompt = $("<p></p>");
				iePrompt.addClass("ieprompt");
				iePrompt.html("<img src='images/ie56.png'>For those using Internet Explorer, you may find that you'll need to log-in again at checkout.");
				$("#rs_signin_form").append(iePrompt);
			});
		}
	
//Public
		var iPublic = {
			callback: function(data) {
				_callback(data);
			},
			verify: function(token) {
				return _verify(token);
			},
			loggedIn: function() {
				if(!_verified) _rsCheckedPreVerify = true;
				return _loggedIn;
			},
			accountType: function() {
				return _accountType;
			},
			getSignInString: function() {
				return _getSignInString();/*
				if(this.loggedIn()) {
					return "Log out";
				} else {
					return "Sign-in <small>(optional)</small>";
				}*/
			},
			logIn: function() {
				_logIn($("#rs_signin_username").val(), $("#rs_signin_password").val(), $("#rs_signin_persist:checked").val());
			},
			logOut: function() {
				_logOut();
			}
		};
		
		//Store singleton
		arguments.callee._rsInstance = iPublic;
		//Return public interface
		return iPublic;
	}
};
rsToken = new rs();
function rsToken_registerEvents() {
	$(function() {
		/*
		 * Sign-in form
		 */
		//Click to display the sign-in window
		$("#rs_signin_link, a.rs_signin").click(function() {
			$("#rs_signin_form").appendTo($(this).parent());
			if(rsToken !== undefined && rsToken.loggedIn()) {
				rsToken.logOut();
			} else {
				if($("#rs_signin_form").is(":visible")) {
					$("#rs_signin_form").fadeOut("slow", function() {
						$("#rs_signin_error").text("");
					});
				} else {
					$("#rs_signin_error").text("");
					$("#rs_signin_form").fadeIn("slow");
				}
			}
			return false;
		});

		//Click to exit sign-in form
		$("#rs_signin_exit").click(function() {
			$("#rs_signin_form").fadeOut("slow", function() {
				$("#rs_signin_error").text("");
			});
			return false;
		});
		//Click away to exit sign-in form
		$("#rs_signin_form").click(function(event) {
			event.stopPropagation();
		});
		$(document).click(function(event) {
			if($("#rs_signin_form").is(":visible")) {
				$("#rs_signin_form").fadeOut("slow", function() {
					$("#rs_signin_error").text("");
				});
			}
		});
		//Sign-in button
		$("#rs_signin_submit").click(function() {
			rsToken.logIn();
			return false;
		});
	});
}

/*
 * Trolley functions
 */
var trolley;
var trolleyAvailable = false;
function rsTrolley(reg) {
	//Load Singleton?
	if(arguments.callee._rsTrolleyInstance) {
		return arguments.callee._rsTrolleyInstance;
	} else {
		
//Private
		var _rst = reg;
		var _data; //Holds the trolley session data
		var _readyHandlerDefined = false; //Records if a document ready handler has been used

		var _construct = function() {
			$(function() {
				_load();
				_registerAddHandlers();
			});
		};

		//Loads latest trolley data
		var _load = function() {
			const query = window.location.search;
			const queryParams = new URLSearchParams(query);
			var data = {..._rst.get(), ...{"referrer" : queryParams.get("referrer")}};
			$.getJSON(rsPath + "json_trolley.php", data).done(function(trolleyData) {
				trolleyAvailable = true;
				_data = trolleyData;
				$(function() {
					_updatePreview();
					//_registerAddHandlers();
				});
			});
		};
		
		//Deploys asynch behaviour to all 'add to trolley' links
		var _registerAddHandlers = function() {
			//Process each anchor element pointing to trolley
			$("a[href*='/trolley.php?']").each(function() {
				var eachElement = this;
				$(eachElement).addClass("addinteractive");
				var ops = eachElement.search.substr(1).split("&");
				$.each(ops, function(i, val) {
					var op_split = val.split("=");
					if(op_split.length === 2) {
						var op_name = op_split[0];
						var op_val = op_split[1];
						//Add item?
						if(op_name.substring(0, 12) === "NewStockCode") {
							//alert("Need to add: " + op_val);
							$(eachElement).click(function() {
								return $.proxy(_addHandler, eachElement, op_val)();
							});
						}
					}
				});
			});
		};
		//The event handler that is invoked on click of the 'add to trolley' links
		var _addHandler = function(stockItem) {
			//Add processing message overlay
			var procMsg = $("<p />");
			procMsg.addClass("trolley_status");
			procMsg.text("Processing...");
			procMsg.appendTo($(this));
			procMsg.fadeIn(50);
			
			_add(stockItem, function(status, msg) {
				if(status) {
					_displayHint();
					procMsg.addClass("green");
					procMsg.text("Success!");
					procMsg.delay(1500).fadeOut(1000, function() {
						$(this).remove();
					});
				} else {
					procMsg.addClass("red");
					procMsg.html("There was a problem!<br />" + msg);
					procMsg.delay(3000).fadeOut(1000, function() {
						$(this).remove();
					});
				}
			});
			
			return false;
		};
		var _displayTimer;
		var _displayHint = function() {
			var hint = $("#trolley_hint");
			if(hint.is(":visible")) {
				window.clearTimeout(_displayTimer);
				hint.clearQueue();
				hint.stop();
			} else {
				hint.css({
					top: "+=10px",
					opacity: "0",
					display: "block"
				});
			}
			hint.animate({
				top: "32px",
				opacity: "1"
			}, 250);
			
			_displayTimer = setTimeout(function() {
				hint.fadeOut(1000);
			}, 1500);
			/*hint.delay(1500).fadeOut(1000, function() {
				//$(this).remove();
			});*/
		};
		
		var _remove = function(stockCode) {
			//Clear any errors
			_displayError("");
			
			//Display loader graphic
			$("#trolleycontents .preloader").fadeIn(200);
			
			//Perform request
			var removeToken = {
				remove: stockCode
			};
			$.getJSON(rsPath + "json_trolley.php", _rst.add(removeToken)).done(function(trolleyData) {
				//Store response
				_data = trolleyData;
				
				//Handle response
				if(!trolleyData.response.remove.success) {
					alert(trolleyData.response.remove.error);
					_displayError(trolleyData.response.remove.error);
				}
				
				//Update display
				_updatePreview();
				
				//Remove loader graphic
				$("#trolleycontents .preloader").stop().css("display", "none");
			});
		};
		
		var _add = function(stockCode, statusCallback) {
			//Clear any errors
			_displayError("");
			
			//Validate stockCode
			if(stockCode === "") {
				_displayError("Please enter a part code.");
				return false;
			}
			/*if(stockData[stockCode] === undefined) {
				_displayError("Invalid part code.");
				//return false;
			}*/
			
			//Display loader graphic
			$("#trolleycontents .preloader").fadeIn(200);
			
			//Perform request
			var addToken = {
				add: stockCode
			};
			$.getJSON(rsPath + "json_trolley.php", _rst.add(addToken)).done(function(trolleyData) {
				//Store response
				_data = trolleyData;
				
				//Handle response
				if(!trolleyData.response.add.success) {
					_displayError(trolleyData.response.add.error);
					if(typeof statusCallback === "function") {
						statusCallback(false, trolleyData.response.add.error);
					}
				} else {
					if(typeof statusCallback === "function") {
						statusCallback(true);
					}
				}
				
				//Update display
				_updatePreview();
				
				//Remove loader graphic
				//$("#trolleycontents .preloader").css("display", "none");
				$("#trolleycontents .preloader").stop().fadeOut(0);
			});
		};
		
		//Updates the trolley preview with the current data
		var _updatePreview = function() {
			
			//If item count is different to previous count, animate trolley icon
			var prevCount = $(".rs_trolley_itemcount").filter(":first").text();
			if(prevCount != _data.itemCount) {
				$(".trolleycount").hide(100, function() {
					$(".rs_trolley_itemcount").text(_data.itemCount);
					$(".rs_trolley_itemcount").attr("length", _data.itemCount.toString().length);
					$(".trolleycount").show(100);
				});
			}
			
			$(".rs_trolley_subtotal").html("&pound;"+commaSeparateNumber(_data.subTotal.toFixed(2)));
			if(_data.VATIncluded && _data.VATRate > 0) {
				$(".rs_trolley_incvat").text("(inc. VAT)");
			} else {
				$(".rs_trolley_incvat").text("(ex. VAT)");
			}
			$("#trolley_shippingprompt").html(_data.shippingPrompt);

			var oHTML = "";
			if(_data.orderlines.length < 1) {
				oHTML = "\n<p class='trolley_orderlines_empty'>Your trolley appears to be empty at the moment!</p>\n";
			} else {
				//for(var orderlineIndex in _data.orderlines) {
				for(var orderlineIndex = 0; orderlineIndex < _data.orderlines.length; orderlineIndex++) {
					var orderline = _data.orderlines[orderlineIndex];
					var stockItem = stockData[orderline.stockCode];

					oHTML += "\n<div class='trolley_line selfclearfix'>\n";
						oHTML += "<div class='trolley_line_price'>\n";
							if(_data.VATIncluded && _data.VATRate > 0) {
								oHTML += "<p class='price'>&pound;" + (orderline.unitPrice + orderline.unitVAT).toFixed(2) + "</p>\n";
							} else {
								oHTML += "<p class='price'>&pound;" + orderline.unitPrice.toFixed(2) + "</p>\n";
							}
							oHTML += "<p class='note rs_trolley_incvat'>";
							if(_data.VATIncluded && _data.VATRate > 0) {
								oHTML += "(inc. VAT)";
							} else {
								oHTML += "(ex. VAT)";
							}
							oHTML += "</p>\n";
							oHTML += "<a href='#' " +
									"class='trolley_line_remove' " +
									"stockCode='"+orderline.stockCode+"'>Remove</a>\n";
								
						oHTML += "</div>\n";
						oHTML += "<img src='" + getStockImageURL(orderline.stockCode) + "' />\n";
						/*if(stockItem === undefined) {
							oHTML += "<img src='images/imageplaceholder.png' />\n";
						} else if(stockItem.imageURL === null) {
							oHTML += "<img src='images/imageplaceholder.png' />\n";
						} else {
							oHTML += "<img src='" + stockItem.imageURL + "' />\n";
						}*/
						oHTML += "<h4><span class='trolley_line_quantity'>" + orderline.qty + "</span>";
						if(stockItem === undefined || stockItem.URL === null) {
							oHTML += orderline.stockCode;
						} else {
							oHTML += "<a href='" + stockItem.URL + "'>" + orderline.stockCode + "</a>";
						}
						oHTML += "</h4>\n";
						if(stockItem !== undefined) {
							oHTML += "<p class='trolley_line_description'>\n" + stockItem.description + "\n</p>\n";
						} else {
							oHTML += "<p class='trolley_line_description'>&nbsp;</p>\n";
						}
					oHTML += "</div>\n";
				}
			}
			$("#trolley_orderlines").html(oHTML);
			
			//Register events
			$(".trolley_line_remove").click(function() {
				trolley.remove($(this).attr("stockCode"));
				return false;
			});
		};
		
		var _displayError = function(message) {
			if(message === "") {
				$("#rs_trolley_error").slideUp(100);
				$("#rs_trolley_error").text(message);
			} else {
				$("#rs_trolley_error").text(message);
				$("#rs_trolley_error").slideDown(400);
			}
		};
		
//Construct
		//_load();
		_construct();
		trolley_registerEvents();
		
//Public
		var iPublic = {
			refresh: function() {
				_load();
			},
			setOrderlinesHeight: function() {
				/*var topCompensate = 0;
				if($(window).scrollTop() < 189) {
					topCompensate = 189 - $(window).scrollTop();
				}
				var maxOrderlinesHeight = (window.innerHeight - topCompensate - 291);
				if(maxOrderlinesHeight < 160) maxOrderlinesHeight = 160;
				$("#trolley_orderlines").css("max-height", maxOrderlinesHeight + "px");*/
				
				var topCompensate = $("#pageHeader").offset().top - $(window).scrollTop();
				if(topCompensate < 0) topCompensate = 0;
				/*var nonLinesHeight = $("#trolley_itemcount").outerHeight(false) + 
						$("#trolley_quickadd").outerHeight(false) + 
						$("#trolley_subtotal").outerHeight(false) + 
						$("#trolley_checkout").outerHeight(true);*/
				var nonLinesHeight = 250;
				var maxOrderlinesHeight = 
						window.innerHeight - 
						topCompensate - 80 -
						nonLinesHeight -
						70;
				if(maxOrderlinesHeight < 160) maxOrderlinesHeight = 160;
				$("#trolley_orderlines").css("max-height", maxOrderlinesHeight + "px");
			},
			remove: function(stockCode) {
				_remove(stockCode);
			},
			add: function(stockCode) {
				_add(stockCode);
			},
			clearError: function() {
				_displayError("");
			}
		};
		
		//Store singleton
		arguments.callee._rsTrolleyInstance = iPublic;
		//Return public interface
		return iPublic;
	}
}
//Handle the situation where trolley integration is not available
function trolley_handleAvailability() {
	$(function() {
		if(!trolleyAvailable) {
			$("#trolleypreview").hide(600);
		}
	});
}
//Defer handling until some time after the document has loaded
$(function() {
	setTimeout(trolley_handleAvailability, 2000);
});
function trolley_registerEvents() {
	/*
	 * Trolley Preview
	 */
	$(function() {
		//Click to display trolley preview
		$("#trolley_summary").click(function(event) {
			event.stopPropagation();
			trolley.clearError();
			trolley.refresh();
			trolley.setOrderlinesHeight();
			$("#trolleycontents").fadeToggle("slow");
		});
		//Click away to exit trolley preview
		$("#trolleypreview").click(function(event) {
			event.stopPropagation();
		});
		$(document).click(function(event) {
			if($("#trolleycontents").is(":visible")) {
				trolley.clearError();
				trolley.refresh();
				trolley.setOrderlinesHeight();
				$("#trolleycontents").fadeOut("slow");
			}
		});
		//Click to exit trolley preview form
		$("#rs_trolley_exit").click(function() {
			trolley.clearError();
			trolley.refresh();
			trolley.setOrderlinesHeight();
			$("#trolleycontents").fadeOut("slow");
			return false;
		});
		//Hide suggestions when user clicks away from the text field
		$("#trolley_quickadd_textfield").focusout(function() {
			$("#trolley_quickadd_suggestions").slideUp(400, function() {
				$("#trolley_quickadd_suggestions ul").empty();
				$("#trolley_quickadd_suggestions_count").text("0");
			});
		});
		//On quick add form submit: 
		// - Hide suggestions
		// - Attempt to add item to trolley
		// - Prevent submission going through to actual trolley
		$("#trolley_quickadd_form").submit(function() {
			$("#trolley_quickadd_suggestions").slideUp(400, function() {
				$("#trolley_quickadd_suggestions ul").empty();
				$("#trolley_quickadd_suggestions_count").text("0");
			});
			trolley.add($("#trolley_quickadd_code").val());
			return false;
		});
		//Quick add auto-complete
		$("#trolley_quickadd_code").keyup(function() {
			var searchTerm = $(this).val().toUpperCase();
			var elemSuggestions = $("#trolley_quickadd_suggestions");
			var elemSuggestionsList = $("#trolley_quickadd_suggestions ul");
			var elemSuggestionsCount = $("#trolley_quickadd_suggestions_count");
			if(searchTerm.length < 2) {
				elemSuggestions.slideUp(200, function() {
					elemSuggestionsList.empty();
					elemSuggestionsCount.text("0");
				});
			} else {
				var results = searchStock(searchTerm);
				elemSuggestionsList.empty();
				elemSuggestionsCount.text(results.length);
				$.each(results, function(i, code) {
					$('<li/>').text(code).click(function() {
						//Click event triggered when suggested item is selected
						$("#trolley_quickadd_code").val($(this).text());
						$("#trolley_quickadd_code").focus();
						elemSuggestions.slideUp(200, function() {
							elemSuggestionsList.empty();
							elemSuggestionsCount.text("0");
						});
					}).appendTo(elemSuggestionsList);
				});
				if(elemSuggestions.is(":hidden")) {
					elemSuggestions.slideDown(400);
				}
			}
		});
		//Auto resize trolley preview's orderlines to adapt to user's viewport
		$(window).resize(function() {
			trolley.setOrderlinesHeight();
		});
		$(window).scroll(function() {
			trolley.setOrderlinesHeight();
		});
	});
}


/*
 * Legacy functions
 */
function Price(stockCode, thin) {
	if(thin !== true) thin = false;
	var priceInfo = getPriceInfo(stockCode, true, thin);
	document.write(priceInfo);
	return getPriceFor(stockCode);
}
function getPriceInfo(stockCode, comprehensiveInfo, thin) {
	if(thin !== true) thin = false;
	var thePrice = getPriceFor(stockCode);
	var priceInfo = "";
	if(thePrice === undefined) {
		priceInfo = "POA";
	} else {
		if(rsToken !== undefined && rsToken.loggedIn() && rsToken.accountType() === "trade") {
			priceInfo = "&pound;" + thePrice.toFixed(2) + " ex. VAT\n";
			if(comprehensiveInfo === undefined || comprehensiveInfo === true) {
				priceInfo += "<br /><span class='retailpricemark'>(Retail: &pound;" + stockData[stockCode].price.toFixed(2) + " ex. VAT)</span>";
				priceInfo += getQtyBreaksTable(stockCode, thin);
			}
		} else if(rsToken !== undefined && rsToken.loggedIn() && rsToken.accountType() === "educational") {
			priceInfo = "&pound;" + (Math.round((1.2 * thePrice) * 100) / 100).toFixed(2);
			if(comprehensiveInfo === undefined || comprehensiveInfo === true) {
				priceInfo += "<span class='price_inclusive'>inc. VAT</span>";
			}
		} else { //Retail
			priceInfo = "&pound;" + (Math.round((1.2 * thePrice) * 100) / 100).toFixed(2);
			if(comprehensiveInfo === undefined || comprehensiveInfo === true) {
				if((1.2 * thePrice) >= sysParams.superSaverThreshold) {
					//priceInfo += " <br /><span class='price_inclusive'>inc. <strong>Free UK Delivery</strong> &amp; VAT</span>";
					priceInfo += "<br /><span class='price_inclusive'>inc. VAT &amp; <strong>Free UK Delivery</strong></span>";
				} else {
					//thePrice = thePrice + " <br /><span class='price_inclusive'>inc. del &amp; VAT</span>";
					priceInfo += "<br /><span class='price_inclusive'>inc. VAT</span>";
				}
			}
		}
	}
	return priceInfo;
}
function KitPrice(JSONStockCodes) {
	var priceInfo = getKitPriceInfo(JSONStockCodes, true);
	document.write(priceInfo);
	return getKitPriceFor(JSONStockCodes);
}
function getKitPriceInfo(JSONStockCodes, comprehensiveInfo) {
	var thePrice = getKitPriceFor(JSONStockCodes);
	var readablePrice = '';
	if(thePrice === undefined) {
        readablePrice = "POA";
	} else {
		if(rsToken !== undefined && rsToken.loggedIn() && rsToken.accountType() === "trade") {
            readablePrice = "&pound;" + thePrice.toFixed(2) + " ex. VAT\n";
			if(comprehensiveInfo === undefined || comprehensiveInfo === true) {
				/*
				 * Needs rewriting
				 */
				//thePrice += "<br /><p class='retailpricemark'>(Retail: &pound;" + stockData[stockCode].price.toFixed(2) + " ex. VAT)</p>";
				//thePrice += getQtyBreaksTable(stockCode);
			}
		} else if(rsToken !== undefined && rsToken.loggedIn() && rsToken.accountType() === "educational") {
			readablePrice = "&pound;" + (Math.round((1.2 * thePrice) * 100) / 100).toFixed(2);
			if(comprehensiveInfo === undefined || comprehensiveInfo === true) {
                readablePrice += "<p class='price_inclusive'>inc. VAT</p>";
			}
		} else { //Retail
            readablePrice = "&pound;" + (Math.round((1.2 * thePrice) * 100) / 100).toFixed(2);
			if(comprehensiveInfo === undefined || comprehensiveInfo === true) {
				if((1.2 * thePrice) >= sysParams.superSaverThreshold) {
                    readablePrice += " <br /><span class='price_inclusive'>inc. del &amp; VAT</span>";
				} else {
                    readablePrice += " <br /><span class='price_inclusive'>inc. VAT</span>";
				}

			}
		}
	}
	return readablePrice;
}
function getKitPriceFor(JSONStockCodes) {
	var totalPrice = 0;
	$.each(JSONStockCodes, function(key, stockItem) {
		if(typeof stockItem === "object") {
			totalPrice = totalPrice + getPriceFor(stockItem.code, stockItem.qty);
		} else {
			totalPrice = totalPrice + getPriceFor(stockItem, 1);
		}
	});
	return totalPrice;
}
function getProfileKitPriceFor(kit, profile) {
	var totalPrice = 0;
	$.each(kit, function(key, stockItem) {
		if(typeof stockItem === "object") {
			totalPrice = totalPrice + getProfilePriceFor(stockItem.code, stockItem.qty, profile);
		} else {
			totalPrice = totalPrice + getProfilePriceFor(stockItem, 1, profile);
		}
	});
	return totalPrice;
}
function Stock(stockCode) {
	if(stockData[stockCode] === undefined) {
		document.write("<p class='stockOut'>No Stock Info</p>");
	} else {
		if(stockData[stockCode].status === "In Stock") {
			document.write("<p class='status stockIn'>"+stockData[stockCode].status+"</p>");
		} else {
			document.write("<p class='status stockOut'>"+stockData[stockCode].status+"</p>");
		}
	}
}
function KitStatus(JSONStockCodes) {
	var isAvailable = true;
	var worstAvailDate = new Date();
	var worstStatus = "In Stock"; //Default to In Stock
	var worstReached = false;
	var eachStockCode = "";
	var eachAvailDate;
	
	
	$.each(JSONStockCodes, function(key, stockItem) {
		if(typeof stockItem === "object") {
			eachStockCode = stockItem.code;
		} else {
			eachStockCode = stockItem;
		}
		//Have we reached the worst possible status?
		if(!worstReached) {
			//Does an item in the kit not exist in the stock data?
			if(stockData[eachStockCode] === undefined) {
				//Worst possible status!
				isAvailable = false;
				worstReached = true;
				worstStatus = "No Stock Info";
			} else {
				//Is each item in stock?
				if(stockData[eachStockCode].status !== "In Stock") {
					//No, record this fact and ...
					isAvailable = false;
					worstStatus = (worstStatus == "In Stock" ? "Out of stock" : worstStatus);
					//Is it going to be longer before this item is in stock to the previous worse?
					eachAvailDate = new Date(stockData[eachStockCode].availabilityDate);
					if(eachAvailDate > worstAvailDate) {
						//Yes, update the status.
						worstAvailDate = eachAvailDate;
						worstStatus = stockData[eachStockCode].status;
					}
				}
			}
		}
	});
	//Now print the worst status
	if(isAvailable) {
		document.write("<p class='status stockIn'>"+worstStatus+"</p>");
	} else {
		document.write("<p class='status stockOut'>"+worstStatus+"</p>");
	}
}
function isNumber(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

/*
 * Stock functions
 */
function searchStock(searchTerm) {
	searchTerm = searchTerm.toUpperCase();
	var termLength = searchTerm.length;
	//Search Results
	var results = [];
	//Exact
	var results1 = [];
	//Begins with
	var results2 = [];
	//Ends in
	var results3 = [];
	//Contains
	var results4 = [];
	
	//Search through stock data
	$.each(stockData, function(code, obj) {
		if(code === searchTerm) {
			results1.push(code);
		} else {
			var codeLength = code.length;
			if(termLength < codeLength) {
				var strBegin = code.substring(0, termLength);
				var strEnd = code.substring(termLength - codeLength);
				
				if(strBegin === searchTerm) {
					results2.push(code);
				} else if(strEnd === searchTerm) {
					results3.push(code);
				} else {
					var patt = new RegExp(searchTerm);
					if(patt.test(code)) {
						results4.push(code);
					}
				}
			}
		}
	});
	results = $.merge($.merge($.merge($.merge([], results1), results2), results3), results4);
	return results;
}
function getPriceFor(stockCode, qty) {
	if(qty === undefined || !isNumber(qty)) {
		qty = 1;
	}
	if(stockData[stockCode] === undefined) {
		return undefined;
	}

	//Determine account type
	if(rsToken !== undefined && rsToken.loggedIn()) {
		return getProfilePriceFor(stockCode, qty, rsToken.accountType());
	} else {
		//Default retail
		return getProfilePriceFor(stockCode, qty, 'retail');
	}
}
function getProfilePriceFor(stockCode, qty, profile) {
	if(qty === undefined || !isNumber(qty)) {
		qty = 1;
	}
	if(profile === undefined || ['retail', 'trade', 'educational'].indexOf(profile) == -1) {
		profile = 'retail';
	}
	var unitPrice = 0;
	if(stockData[stockCode] === undefined) {
		return undefined;
	}
	//Determine account type
	switch(profile) {
		case 'trade':
			var q;
			for(q = 0; q < stockData[stockCode].breaks.length; q++) {
				if(stockData[stockCode].breaks[q].qty > qty) break;
			}
			if(q === 0) {
				unitPrice = stockData[stockCode].tprice;
			} else {
				unitPrice = stockData[stockCode].breaks[q-1].price;
			}
			break;
		case 'educational':
			unitPrice = stockData[stockCode].eprice;
			break;
		default:
			unitPrice = stockData[stockCode].price;
	}
	return qty * unitPrice;
}
function getQtyBreaksTable(stockCode, oneLineTable) {
	var html = undefined;
	var firstLineLimit = 8;
	if(oneLineTable !== true) {
		oneLineTable = false;
		firstLineLimit = 4;
	}
	
	
	if(stockData[stockCode] !== undefined) {
		//Determine account type
		if(rsToken.loggedIn() && rsToken.accountType() === "trade") {
			var q;
			html = "<table class='pricebreaks'>\n";
			
			html += "<tr>\n";
			for(q = 0; q < firstLineLimit; q++) { html += "<th>"+stockData[stockCode].breaks[q].qty+"+</th>\n"; }
			html += "</tr>\n<tr>\n";
			for(q = 0; q < firstLineLimit; q++) { html += "<td>&pound;"+stockData[stockCode].breaks[q].price.toFixed(2)+"</td>\n"; }
			html += "</tr>\n";
			
			if(!oneLineTable) {
				html += "<tr>\n";
				for(q = 4; q < 8; q++) { html += "<th>"+stockData[stockCode].breaks[q].qty+"+</th>\n"; }
				html += "</tr>\n<tr>\n";
				for(q = 4; q < 8; q++) { html += "<td>&pound;"+stockData[stockCode].breaks[q].price.toFixed(2)+"</td>\n"; }
				html += "</tr>\n";
			}
			
			html += "</table>\n";
		}
	}
	
	return html;
}
function getStockImageURL(stockCode) {
	var stockItem = stockData[stockCode];
	var url;
	if(stockItem === undefined) {
		url = "images/imageplaceholder.png";
	} else if(stockItem.imageURL === null) {
		url = "images/imageplaceholder.png";
	} else {
		url = stockItem.imageURL;
	}
	return url;
}
function getStockImages(stockCode) {
	var stockItem = stockData[stockCode];
	var returnArray = [];
	
	if(stockItem === undefined) {
		//returnArray[0] = "images/imageplaceholder.png";
	} else if(stockItem.images === undefined) {
		//returnArray[0] = "images/imageplaceholder.png";
	} else {
		$.each(stockItem.images, function(index, url) {
			returnArray.push({
				url: url,
				alt: stockItem.code
			});
		});
	}
	return returnArray;
}
function getRelatedImages(imageURL) {
	var relatedImages = [];
	var searchLength = imageURL.length;
	var imageUCaseURL = imageURL.toUpperCase();
	
	$.each(stockData, function(index, stockItem) {
		if(stockItem.imageURL !== undefined && stockItem.imageURL !== null) {
			if(stockItem.imageURL.toUpperCase().substring(stockItem.imageURL.length - searchLength) === imageUCaseURL) {
				relatedImages.push({
					url: stockItem.imageURL,
					alt: stockItem.code
				});
				relatedImages = relatedImages.concat(getStockImages(stockItem.code));
			}
		}
	});
	if(relatedImages.length === 0) {
		relatedImages = [
			{
				url: imageURL,
				alt: ""
			}
		];
	}
	
	var uniqueRelatedImages = [];
	relatedImages = $.map(relatedImages, function(img, i) {
		if($.inArray(img.url, uniqueRelatedImages) === -1) {
			uniqueRelatedImages.push(img.url);
			return img;
		} else {
			return null;
		}
	});
	return relatedImages;
}
function printKeyAccessories(stockCodes) {
	if(stockCodes === undefined) {
		stockCodes = page.associatedStock();
	} else {
		stockCodes = [stockCodes];
	}
	var html = getKeyAccessories(stockCodes);
	if(html !== undefined) {
		document.write(html);
	}
}
function getKeyAccessories(stockCodesArray) {
	if(stockCodesArray === undefined) {
		stockCodesArray = page.associatedStock();
	}
	var keyAccessoriesHeading = "You may also want to consider...";
	var html = undefined;
	var keyAccessories = [];
	
	$.each(stockCodesArray, function(key, stockCode) {
		if(stockData[stockCode] !== undefined) {
			if(stockData[stockCode].accessories !== undefined) {
				$.each(stockData[stockCode].accessories, function(index, objAccessory) {
					if(objAccessory.keyItem === true) {
						if(!($.inArray(objAccessory.code, keyAccessories) >= 0)) {
							keyAccessories.push(objAccessory.code);
						}
					}
				});

				if(keyAccessories.length > 0) {
					html = "<div class='keyaccessory_container selfclearfix'>\n" + 
							"	<h4>"+keyAccessoriesHeading+"</h4>\n" + 
							"	<div class='keyaccessory_viewport'>\n" + 
							"		<p class='keyaccessory_left'><img src='images/button_small_left.png' /></p>\n" + 
							//"		<p class='keyaccessory_left'>&lt;</p>\n" + 
							"		<p class='keyaccessory_right'><img src='images/button_small_right.png' /></p>\n" + 
							//"		<p class='keyaccessory_right'>&gt;</p>\n" + 
							"		<div class='keyaccessory_slider selfclearfix'>\n";
					$.each(keyAccessories, function(index, partCode) {
						var stockCard = getStockCard(partCode, 1);
						if(stockCard !== undefined) {
							html += stockCard + "\n";
						}
					});
					html +=	"		</div>\n" +
							"	</div>\n" +
							"</div>\n";
				}
			}
		}
	});
	return html;
}

function printStockCard(stockCode) {
	var html = getStockCard(stockCode);
	if(html !== undefined) {
		document.write(html);
	}
}
function getStockCard(stockCode, relevancy) {
	var cardType = "";
	switch(relevancy) {
		case 1: //Key accessory
			cardType = " keyaccessory";
			break;
		case 2: //Trending item
			cardType = " alsobought";
			break;
	}
	var html = undefined;
	var stockItem = stockData[stockCode];
	
	if(stockItem !== undefined) {
		html = "<div class='stockcard" + cardType + "'>\n" + 
				"	<a href='" + stockItem.URL + "' class='stockcard_thumbnail'><img src='" + getStockImageURL(stockItem.code) + "' /></a>\n" + 
				"	<p>" + stockItem.description + "</p>\n" + 
				"	<p class='stockcard_stockstatus'>" + stockItem.status + "</p>\n" + 
				"	<p class='stockcard_price'>" + getPriceInfo(stockItem.code, false) + "</p>\n" + 
				"	<div class='stockcard_buyinfo'>\n" + 
				"		<a href='" + stockItem.URL + "' class='stockcard_partcode'>" + stockItem.code + "</a>\n" + 
				"		<a href='https://secure.solwise.co.uk/trolley.php?NewStockCode=" + stockItem.code + "' target='_new' class='stockcard_buynow'>Buy Now</a>\n" +
				"	</div>\n" + 
				"</div>";
	}
	
	return html;
}

function cookiesEnabled() {
	var cookieEnabled = (navigator.cookieEnabled) ? true : false;
	if(typeof navigator.cookieEnabled === "undefined" && !cookieEnabled) {
		document.cookie="testcookie";
		cookieEnabled = (document.cookie.indexOf("testcookie") != -1) ? true : false;
	}
	return cookieEnabled;
}

//Web Master email buffer
function lightbox_open(html) {
	$("#lightbox_contents").html(html);
	$("#lightbox").fadeIn(600);
}
function lightbox_close() {
	$("#lightbox").fadeOut(300, function() {
		$("#lightbox_contents").html("");
	});
}
$(function() {
	$("a.email_webmaster").click(function() {
		lightbox_open("<h2>Are you sure?!</h2>\n" +
			"<p>Messages sent to this address are monitored only by the systems developers and so should only contain: </p>\n" + 
			"<ul>\n" + 
			"	<li>Queries or requests relating to the operation of this website (or other Solwise maintained websites)</li>\n" + 
			"	<li>Or reports of any issues you may have encountered</li>\n" + 
			"</ul>\n" + 
			"<p>Any sales/technical enquiries or marketing materials sent to this address may not get processed.</p>\n" + 
			"<p>If you still wish to send an email to this address, <a href='mailto:servermaintenance@solwise.co.uk' onclick='lightbox_close();'>Click here for the Web Master</a>.</p>");
		return false;
	});
	$(".lightbox_exit").click(function() {
		lightbox_close();
		return false;
	});
});

//Key accessories slider
$(function() {
	if($(".keyaccessory_container").length > 0) {
		$(".keyaccessory_container").each(function() {
			var elemViewport = $(this).children(".keyaccessory_viewport").first();
			var elemSlider = elemViewport.children(".keyaccessory_slider").first();
			var elemLeft = elemViewport.children(".keyaccessory_left").first();
			var elemRight = elemViewport.children(".keyaccessory_right").first();
			var childCount = elemSlider.children("div").length;
			var childWidths = elemSlider.children("div").first().width() + 20 + 2;
			elemSlider.css("width", (childCount * childWidths) + 20 + "px");
			
			//Add interactivity
			var maxDisplay = 3;
			var shiftSteps = 2;
			var currentPosition = 0;
			elemSlider.attr("pos", 0);
			elemLeft.click(function() {
				var toMove = shiftSteps;
				if(currentPosition < toMove) toMove = currentPosition;
				if(toMove < 0) toMove = 0;
				elemSlider.animate({
					marginLeft: "+="+(toMove*childWidths)
				});
				currentPosition = currentPosition - toMove;
				elemSlider.attr("pos", currentPosition);
				handleArrowVisibility();
			});
			elemRight.first().click(function() {
				var maxSteps = childCount - maxDisplay - currentPosition;
				var toMove = shiftSteps;
				if(maxSteps < toMove) toMove = maxSteps;
				if(toMove < 0) toMove = 0;
				elemSlider.animate({
					marginLeft: "-="+(toMove*childWidths)
				});
				currentPosition = currentPosition + toMove;
				elemSlider.attr("pos", currentPosition);
				handleArrowVisibility();
			});
			function handleArrowVisibility() {
				if(currentPosition + maxDisplay >= childCount) {
					elemRight.fadeOut();
				} else {
					elemRight.fadeIn();
				}
				if(currentPosition <= 0) {
					elemLeft.fadeOut();
				} else {
					elemLeft.fadeIn();
				}
			}
			handleArrowVisibility();
		});
	}
});

/*
 * Event handlers/Page Processing
 */
$(function() {
	//Keep the dashboard in the user's viewport
	$(window).scroll(function() {
		var dashElem = $("#pageHeader");
		if(window.pageYOffset > 188 && window.innerWidth >= 1250) {
			if(document.height - window.pageYOffset <= 718) {
				//Bottom of document main content
				dashElem.css("position", "absolute");
				dashElem.css("top", "auto");
				dashElem.css("bottom", "0px");
			} else {
				//Within the document main content
				dashElem.css("position", "fixed");
				dashElem.css("top", "0px");
				dashElem.css("bottom", "auto");
			}
		} else {
			//At the top of the document
			dashElem.css("position", "absolute");
			dashElem.css("top", "1px");
			dashElem.css("bottom", "auto");
		}
	});
	
	//Neatly stack product info divs when multiple are on screen
	$("section.main>.productInfo").each(function() {
		var sibs = $(this).siblings(".productInfo");
		if(sibs.length > 0) {
			sibs.addClass("multi");
		}
	});
});

function trackOrder(orderRef) {
	$.getJSON(rsPath + "json_trackorder.php", {orderref: orderRef}).done(function(resp) {
		var html = "<h2>Your order status</h2>\n";
		if(resp.response.success) {
			html += "<h3>" + resp.state + "</h3>\n\
				<strong class='key'>Status:</strong> " + resp.state + "<br />\n\
				<strong class='key'>Updated:</strong> " + resp.lastUpdated + "<br />\n";
			if(resp.recType === "I") {
				html += "<p>\n\
					<strong class='key'>Carrier:</strong> " + resp.carrier + "<br />\n\
					<strong class='key'>Delivery Method:</strong> " + resp.deliveryService + "\n";
				if(resp.consignmentNumber !== null) {
					html += "<br />\n<strong class='key'>Your tracking number:</strong> " + resp.consignmentNumber + "\n\
						</p>";
					if(resp.trackingURL !== null) {
						html += "<p>You can track your parcel with the carrier by <a href="+resp.trackingURL+" target='_blank'>clicking here!</a></p>\n";
					}
					
				} else {
					html += "<br />Unfortunately, there is no tracking information for your order.\n\
						</p>";
				}
			}
			//$(resultElem).html(html);
		} else {
			html += "<h3>There was a problem getting your order status</h3>\n\
				<p class='error'>" + resp.response.message + "</p>";
			//$(resultElem).text(resp.response.message);
		}
		lightbox_open(html);
	});
}

function registerInterest(form) {
	$.getJSON(rsPath + "json_registerinterest.php", $(form).serialize()).done(function(resp) {
		var html = "";
		if(resp.response.success) {
			//Success!
			html = "<h4 class='success'>Thank you for your interest!</h4>";
			$(form).html(html);
		} else {
			//Error!
			$(form).find(".feedback").remove();
			
			html = "<h4 class='feedback'>There was a problem registering your interest:</h4>\n\
				<p class='feedback error'>" + resp.response.message.join("<br />") + "</p>";
			$(form).prepend(html);
			//$(form).html(html);
		}
		
	});
	return false;
}