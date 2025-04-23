/*

  Quick JS by Jason @ freakdesign.
  Questions? Ping me on twitter: @freakdesign

  Relates to blog post:
  https://freakdesign.com.au/blogs/news/get-shipping-estimates-on-a-product-page

  Example:
  https://jasons-experiments.myshopify.com/products/alex-twill-pant-mariner

*/
(function(){

  "use strict";

  /* A console logging function */
  var log = function(a){
    if(!debug){ return }
    console.log(a);
  };

  /* In case you want to output a bunch of things to the debug console */
  var debug = true;
  var cartCookie;

  /* The ID of the element that you want to add the shipping fields into */
  var productSection = document.getElementsByClassName('product-single__shipping-wrapper');
  if(!productSection.length){ log('Could not find the element'); return }

  /* the main product select element */
  var productSelect = document.getElementById('ProductSelect-product-template');
  if(!productSelect){ log('Could not find the main select element'); return }

  /* create a message box */
  var shippingMessage = document.createElement('p');
  var shippingCountry = document.createElement('select');
  var shippingProvince = document.createElement('select');
  var shippingZip = document.createElement('input');

  /* We are just adding some dummy fields for example only. There's better ways to handle this */
  var initShippingFields = function(){

    /* create the country picker */
    var countries = ['United States'];
    for (var i = 0; i < countries.length; i++) {
      shippingCountry.add(new Option(countries[i], countries[i], i===0));
    };
    shippingCountry.name = 'shipping_address[country]';

    /* create the province state picker */

    var provinces = ['Queensland', 'Northern Territory', 'South Australia', 'Tasmania', 'Victoria', 'Western Australia'];
    var provinces = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming','District of Columbia','Puerto Rico','Guam','American Samoa','U.S. Virgin Islands','Northern Mariana Islands'];
    for (var i = 0; i < provinces.length; i++) {
      shippingProvince.add(new Option(provinces[i], provinces[i], i===0));
    };
    shippingProvince.name = 'shipping_address[province]';

    /* create the zip / postcode field */
    shippingZip.type = 'text';
    shippingZip.name = 'shipping_address[zip]';
    shippingZip.value = '90025';

    /* create a wrapper for the fields */
    var shippingCalcWrapper = document.createElement('div');
    shippingCalcWrapper.className = 'shipping-calc-wrapper';

    /* create a title */
    var shippingCalcTitle = document.createElement('p');
    shippingCalcTitle.innerText = 'Shipping Calculator';

    /* create a get rates button */
    var shippingCalcButton = document.createElement('button');
    shippingCalcButton.innerText = 'Get Rates';
    shippingCalcButton.className = 'btn';
    shippingCalcButton.onclick=function(){
      if(!productSelect.value.length){ return false }
      cartCookie = getCookie('cart');
      var tempCookieValue = tempCookieValue || "temp-cart-cookie___" + Date.now();
      var fakeCookieValue = fakeCookieValue || "fake-cart-cookie___" + Date.now();

      /* if not found, make a new temp cookie */
      if(!cartCookie){ 
        log('no cookie found');
        updateCartCookie(tempCookieValue);
        cartCookie = getCookie('cart');
      }else{
        log('cookie found');
      }

      /* if found but has a weird length, bail */
      if(cartCookie.length < 32){ log('cart ID not valid');return }

      /* Change the cookie value to a new 32 character value */
      updateCartCookie(fakeCookieValue);
      log(getCookie('cart'));

      getRates(parseInt(productSelect.value));
      return false;
    };

    /* create some labels for the fields */
    var labelNames = ['Country','State','Postcode'];
    var labels = [];
    for (var i = 0; i < labelNames.length; i++) {
      var label = document.createElement('label');
      label.innerText = labelNames[i];
      labels.push(label);
    };

    shippingCalcWrapper.appendChild(shippingCalcTitle);
    shippingCalcWrapper.appendChild(labels[0]);
    shippingCalcWrapper.appendChild(shippingCountry);
    shippingCalcWrapper.appendChild(labels[1]);
    shippingCalcWrapper.appendChild(shippingProvince);
    shippingCalcWrapper.appendChild(labels[2]);
    shippingCalcWrapper.appendChild(shippingZip);
    shippingCalcWrapper.appendChild(shippingCalcButton);
    shippingCalcWrapper.appendChild(shippingMessage);

    /* add to the page */
    productSection[0].appendChild(shippingCalcWrapper);

  };



  /* get cookie by name */
  var getCookie = function(name) {
    var value = "; " + document.cookie;
    var parts = value.split('; '+name+'=');
    if (parts.length == 2) return parts.pop().split(";").shift();
  };

  /* update the cart cookie value */
  var updateCartCookie = function(a) {
    log('changing cart cookie value to: '+a);
    var date = new Date();
    date.setTime(date.getTime()+(14*86400000));
    var expires = '; expires='+date.toGMTString();
    document.cookie = 'cart='+a+expires+'; path=/';
  };

  /* reset the cart cookie value */
  var resetCartCookie = function(){
    updateCartCookie(cartCookie);
    log(getCookie('cart'));
  };

  /* get the rates */
  var getRates = function(variantId){

    /* add whatever sanity checks you need in addition to the one below */
    if(typeof variantId === 'undefined'){ return }

    /* the main quantity element */
    var productQuantity = document.getElementById('Quantity-product-template');

    var quantity = productQuantity ? parseInt(productQuantity.value):1;
    var addData = {
      'id':variantId,
      'quantity':quantity
    };

    fetch('/cart/add.js', {
      body: JSON.stringify(addData),
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With':'xmlhttprequest' /* XMLHttpRequest is ok too, it's case insensitive */
      },
      method: 'POST'
    }).then(function(response) {
      return response.json();
    }).then(function(json) {
      /* we have JSON */
      console.log(json);
      /* Change the cookie value back to what it was */

      $.ajax({
        type: "GET",
        url: '/cart/shipping_rates.json',
        data: {
          'shipping_address[country]':shippingCountry.value,
          'shipping_address[province]':shippingProvince.value,
          'shipping_address[zip]':shippingZip.value
        },
        success: function(d){
          console.log('success');
          if(d.shipping_rates && d.shipping_rates.length){
            shippingMessage.innerHTML = 'First rate = '+d.shipping_rates[0].name+'<br>Price = '+Shopify.formatMoney(d.shipping_rates[0].price);
          }
          resetCartCookie()
        },
        error: function(a,b,c){
          console.log('error');
          resetCartCookie();
          shippingMessage.innerHTML = a;
        },
        dataType: 'json'
      });


    }).catch(function(err) {
      /* uh oh, we have error. */
      console.error(err);
      resetCartCookie()
    });

  };

  initShippingFields();

})();