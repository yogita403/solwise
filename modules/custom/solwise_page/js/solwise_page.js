
(function ($, Drupal, drupalSettings) {
  Drupal.behaviors.address_by_postalcode = {
  attach: function (context, settings) {

    // Overwrite beforeSubmit
    /*Drupal.ajax[].options.beforeSubmit = function (form_values, element, options) {
        // check the textfield isn't blank then return false;
    }*/
  }
};

  var postcode_element_id = drupalSettings.element_id;
  var api_key = drupalSettings.api_key;
  $.each(postcode_element_id, function( index, value ) {
     $('#'+value).on('keyup', function(){
      var text = $(this).val();
       if (text.trim()) {
         Capture_Interactive_Find_v1_00(api_key, text, '', '', 'GB,US,CA', '10', '', value);
       }
     });
  });

  if (Drupal.Ajax){
    // $(document).ajaxComplete(function(){
    //   $.each(postcode_element_id, function( index, value ) {
    //      $('#'+value).on('keyup', function(){
    //       var text = $(this).val();
    //        if (text.trim()) {
    //          Capture_Interactive_Find_v1_00(api_key, text, '', '', 'GB,US,CA', '10', '', value);
    //        }
    //      });
    //   });
    // });
  };

})(jQuery, Drupal, drupalSettings);

function Capture_Interactive_Find_v1_00(Key, Text, Container, Origin, Countries, Limit, Language, value) {
  var field_id = value;
  jQuery.getJSON("https://api.addressy.com/Capture/Interactive/Find/v1.00/json3.ws?callback=?",
  {
    Key: Key,
    Text: Text,
    Container: Container,
    Origin: Origin,
    Countries: Countries,
    Limit: Limit,
    Language: Language
  },
  function (data) {
    //console.log(data);
    if (data.Items.length == 1 && typeof(data.Items[0].Error) != "undefined") {
          //alert(data.Items[0].Description);            
    }
    else {
      if (data.Items.length === 0)
       alert("Sorry, there were no results");
      else {
        if(data.Items[0].Id && data.Items[0].Type == "Postcode" && data.Items[0].Type == "BuildingName") {
          var add_arr = {};
          for (var i = 0; i < data.Items.length; i++) {
            add_arr[data.Items[i].Id +'_' + data.Items[i].Type] = data.Items[i].Description;
          }
          var get_length = data.Items.length;
          autocomplete(document.getElementById(field_id), add_arr,get_length);
        }
        else{
          len = data.Items.length; 
          if(data.Items.length){
            var add_arrs = {};
            var addmulti_arr = {};
            for (var j = 0; j < data.Items.length; j++) {
              addmulti_arr[data.Items[j].Id +'_' + data.Items[j].Type] = data.Items[j].Text;
            }
            autocomplete(document.getElementById(field_id), addmulti_arr, len, Key); 
          }
          else{
            var add = {};
            for (var k = 0; k < data.Items.length; k++) {
              add[data.Items[k].Id +'_' + data.Items[k].Type] = data.Items[k].Text;
            }
            autocomplete(document.getElementById(field_id), add, len, Key); 
          }
        } 
      }
    }
  });
}

function autocomplete(inp, arr, len, api_key) {
  var currentId = jQuery(inp).attr('id');
  jQuery('#'+currentId+ "autocomplete-list").remove();
  var currentFocus;
  if(len){
    c = document.createElement("DIV");
    c.setAttribute("id", currentId + "autocomplete-list");
    c.setAttribute("class", "autocomplete-items");
    inp.parentNode.appendChild(c);
    var p_id = '#'+currentId;

    jQuery.each(arr,function(key,value){
      var split_key = key.split('_');
      var type = split_key.pop();
      var id = split_key.join('_')
      console.log(key);
      console.log(type);
      d = document.createElement("DIV");
      d.innerHTML = "<strong>" + value + "</strong>";
      d.innerHTML += "<input type='hidden' class='aa' value='" + id + "'>";
      d.addEventListener("click", function(e) {
      var output = this.getElementsByTagName("input")[0].value;
      if(type == 'Address'){
        Capture_Interactive_Retrieve_v1_00(api_key, output, p_id);
      }
      else{
        Capture_Interactive_Find_v1_00(api_key, '', output,'', 'GB,US,CA', '1','', currentId);
      }
      closeAllLists();      
    });
      c.appendChild(d);
    }); 
  }
    
  function closeAllLists(elmnt) {
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}


function Capture_Interactive_Retrieve_v1_00(Key, Id, p_id) {
 var pid = p_id.split('-postal-code-element');
 var cpde_result = pid[0].replace('#', '');
 jQuery.getJSON("https://api.addressy.com/Capture/Interactive/Retrieve/v1.00/json3.ws?callback=?",
  {
    Key: Key,
    Id: Id
  },
  function (data) {
    if (typeof(data.Items[0].Error) == "undefined") {
      var city = data.Items[0].City;
      var postcode = data.Items[0].PostalCode;
      var country = data.Items[0].CountryName;
      var CountryIso2 = data.Items[0].CountryIso2;
      var proviance = data.Items[0].Province;
      var company = data.Items[0].Company;
      var address_1 = data.Items[0].Line1;
      var address_2 = data.Items[0].Line2;
      var address_3 = data.Items[0].Line3;
      var address = company + ' ' +address_1;
      address_2 = address_2 + ' ' +address_3;

      jQuery('input[id^='+cpde_result + '-address]').val(address);
      jQuery('input[id^='+cpde_result + '-address-2]').val(address_2);
      jQuery('input[id^='+cpde_result +'-city]').val(city);
      jQuery('input[id^='+cpde_result + '-postal-code]').val(postcode);
      jQuery('select[id^='+cpde_result + '-country]').val(country);
      jQuery('select[id^='+cpde_result + '-state-province]').val(proviance);
      jQuery('input[id^='+cpde_result +'-locality]').val(city);
      jQuery('input[id^='+cpde_result + '-organization]').val(company);
      jQuery('input[id^='+cpde_result + '-address-line1]').val(address);
      jQuery('input[id^='+cpde_result + '-address-line2]').val(address_2);
      jQuery('select[id^='+cpde_result + '-country-code]').val(CountryIso2);
    }
  });
}