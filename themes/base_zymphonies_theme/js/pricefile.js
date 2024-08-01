//***************************************************************************
//***** Functions ***********************************************************

//***** Function gets value of named cookie
function getCookie(c_name) {
    if (document.cookie.length>0) {
        c_start=document.cookie.indexOf(c_name + "=");
        if (c_start!=-1) {
            c_start=c_start + c_name.length+1;
            c_end=document.cookie.indexOf(";",c_start);
            if (c_end==-1) c_end=document.cookie.length;
            return unescape(document.cookie.substring(c_start,c_end));
        }
    }
    return "";
}
function setCookie(c_name, value, expDays, expHours, expMins) {
    var expirationDefined = (expDays !== undefined || expHours !== undefined || expMins !== undefined);
    var expDate=new Date();
    if(expDays !== undefined) {
        //expDate.setUTCDate(expDate.getUTCDate() + expDays);
        expDate.setDate(expDate.getDate() + expDays);
    }
    if(expHours !== undefined) {
        //expDate.setUTCHours(expDate.getUTCHours() + expHours);
        expDate.setHours(expDate.getHours() + expHours);
    }
    if(expMins !== undefined) {
        //expDate.setUTCMinutes(expDate.getUTCMinutes() + expMins);
        expDate.setMinutes(expDate.getMinutes() + expMins);
    }
    //expDate.setUTCMinutes(expDate.getUTCMinutes() - expDate.getTimezoneOffset());
    var c_value = escape(value) + ((!expirationDefined) ? "" : "; Expires=" + expDate.toUTCString()) + "; Path=/";
    document.cookie=c_name + "=" + c_value;
}
/*

//!***** Function to get left of string
function Left(str, n){
    if (n <= 0)
        return "";
    else if (n > String(str).length)
        return str;
    else
        return String(str).substring(0,n);
}

//!***** Function unknown
function Go(){return;}
*/
//!***** Function Get Product Price
PriceCode = new Array();
function Price(ThisCode) {
    if (PriceCode[ThisCode] > "") {
        document.write(PriceCode[ThisCode].replace("�", "&pound;"));
    } else {
        document.write("POA");
    }
}

//!***** Function Get Product Stock Status
StockStat = new Array();
function Stock(ThisCode)
{
    if (StockStat[ThisCode] > "")
    { document.write(StockStat[ThisCode]); }
    else
    { document.write("No Stock Info"); }
}
/*
//!***************************************************************************
//!***** Processing **********************************************************

//!***** Declare Vars
var PricelistFileName = Left('pricelist.js?'+new Date().valueOf(),21);
var pricing;
var PriceTag;

//!***** Get pricing scheme from session
pricing = getCookie("accounttype");

//!***** Trade Customer Features
if (pricing == "trade") {
    PricelistFileName = Left('tradepricelist.js?'+new Date().valueOf(),21);
}

//!***** Print appropriate js pricelist
PriceTag = '<SCRIPT type="text/JavaScript" src="';
PriceTag += PricelistFileName;
PriceTag += '\"><\/script>'   ;
document.write(PriceTag);*/
