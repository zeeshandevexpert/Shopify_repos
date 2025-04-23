/* Simple donetyping plugin */
(function($) {
  $.fn.donetyping = function(callback){
    var _this = $(this);
    var x_timer;    
    _this.keyup(function (){
      clearTimeout(x_timer);
      x_timer = setTimeout(clear_timer, 250);
    }); 

    function clear_timer(){
      clearTimeout(x_timer);
      callback.call(_this);
    }
  }
})(jQuery);

var wick = {
  init: function() {
    if(Shopify.Checkout.isOrderStatusPage) {
      console.log(Shopify.Checkout);
      return;
    }
    
    if(Shopify.Checkout.step == "payment_method") {
      console.log('payment_method');
      wick.addNoAmex();
    }
      
    $.getJSON('/cart.json',function(data) {
      window.checkout.attributes = data.attributes;
      console.log(window.checkout.attributes);
      wick.addPoInput();
      wick.addTerms();
      wick.backToInfoButton();
      
    });
    this.addCurbsideDeliveryText();
  },
  addNoAmex: function() {
    var txt = window.checkout.noAmex;
    $('.section--payment-method .section__header').append(`<p style="color:#ff5c4e;"><b>${txt}</b></p>`);
  },
  getUrlParameter: function(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
        results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  },
  addTerms: function() {
    $('#terms-text').insertBefore('.step__footer');
  },
  /* This is no longer necessary */
  checkPromoApplied: function() {
    var promoAppliedCookie = Cookies.get('promo-applied'),
        promoCode = Cookies.get('promo-code'),
        $codeSet = $('.reduction-code'),
        $applyBtn = $('button[data-trekkie-id="apply_discount_button"]'),
        $codeInput = $('#checkout_reduction_code');

    if(promoAppliedCookie != 'true' && $codeSet.length == 0 && promoCode != undefined) {
      var applyPromoURL = 'https://'+window.location.hostname+'/discount/'+promoCode;
      console.log(applyPromoURL);
      $.get(applyPromoURL,function(data) {
        console.log('applying-promo...');
        Cookies.set('promo-applied','true');
        location.reload(); 
      }).fail(function(e) {
        console.log(e);
      });
    } else {
      //       console.log('conditions either not met or set');
    }
  },
  addLocalDeliveryText: function() {
    var $el = $('.radio__label__primary[data-shipping-method-label-title="Local Delivery"]'),
        txt = $('.local-delivery__text').text();
    if($el.length) {
      $el.append($('<small>'+txt+'</small>'));
    }
  },
  addCurbsideDeliveryText: function() {
    var $el = $('.radio__label__primary[data-shipping-method-label-title="Standard Freight"]'),
        txt = '(All Shipments are Curbside Delivery)'
    if($el.length) {
      $el.append($('<small>'+txt+'</small>'));
    }
  },
  backToInfoButton: function() {
    previouslink = $('.step__footer__previous-link').attr('href');
    if($('.step__footer__previous-link').length) {
      isPreviousLinkContactInfo = previouslink.indexOf("contact_information") > -1;
      if(isPreviousLinkContactInfo){
        if(Shopify.Checkout.step == 'shipping_method') {
          var txtToAdd = '<br><small>*Go back to select In-Store Pickup</small>';
          $('.step__footer__previous-link-content').append(txtToAdd).parent().addClass("info_msg_checkoutbtn");
        }
        else if(Shopify.Checkout.step == 'payment_method') {
          var txtToAdd = '<br><small>*Go back to select Shipping/Delivery</small>';
          $('.step__footer__previous-link-content').append(txtToAdd).parent().addClass("info_msg_checkoutbtn");
        }
        //     console.log('checkout step:: ',Shopify);
      }
    }
  },
  addPoInput: function() {
    //     if(Shopify.Checkout.step == "contact_information") {
    var poVal = '';
    var extraClasses = '';
    var wrapperClass = '';
    var btnText = 'Add PO Number';
    if(checkout.attributes["PO Number"]) {
      poVal = checkout.attributes["PO Number"]; 
      extraClasses = 'field__label--visible';
      wrapperClass = '';
      btnText = 'Edit PO Number';
//       wick.addPoToTotals(poVal);
//       prependTo('.total-line-table__tbody')
    }
    //<button class="btn btn--primary" id="po-submit">${btnText}</button>
    if($('.po-input__wrapper').length === 0) {
      console.log('no PO yet');
      var $poInput = $(`<div class="po-input__wrapper">
        <div class="field__input-wrapper relative">
        	<label class="field__label ${extraClasses}" for="po-input">PO Number</label>
        	<input id="po-input" type="text" name="po-input" class="po-input field__input" placeholder="PO Number (optional)" value="${poVal}">
			<button class="po-submit btn btn--primary field__input-btn" aria-busy="false">
				<span class="btn__content">Update</span>
				<svg class="icon-svg icon-svg--size-18 btn__spinner icon-svg--spinner-button" aria-hidden="true" focusable="false"> <use xlink:href="#spinner-button"></use> </svg>
			</button>
        </div>
        </div>`).insertBefore('.step__footer');
      var $poTotal = $(`<tr class="total-line total-line__po">
							<th class="total-line__name">PO Number</th>
							<td class="total-line__price"><span class="order-summary__emphasis total__po-value">${poVal}</span></td>
						</tr>`).appendTo('.total-line-table__tbody');
    }
    wick.checkPoVal();
    wick.checkNeedsUpdate();
    $(document).on('click','.po-submit',function() {
      $(this).addClass('btn--loading');
      $('#continue_button').addClass('btn--disabled').prop('disabled',true);
      wick.updatePoValue($('.po-input').val());
      return false;
    });
    $('#po-input').donetyping(function(){
      wick.poLabels();
      wick.checkNeedsUpdate();
    });
    if(Shopify.Checkout.isOrderStatusPage) {
//       $('.po-input').prop('readonly',true);
      $('.po-input__wrapper').hide();
    }
  },
  poLabels: function() {
    var $inpt = $('#po-input');
    var $wrapper = $inpt.closest('.po-input__wrapper');
    if($inpt.val() != '') {
      $wrapper.addClass('field--show-floating-label');
    } else {
      $wrapper.removeClass('field--show-floating-label'); 
    }
  },
  checkNeedsUpdate: function(t) {
    var $inpt = $('#po-input'),
        $btn = $('.po-submit');
    if(checkout.attributes["PO Number"] == $inpt.val() || t) {
      $btn.addClass('btn--disabled').prop('disabled',true);
    } else {
      $btn.removeClass('btn--disabled').prop('disabled',false);
    }
  },
  checkPoVal: function() {
    var $inpt = $('#po-input')
    if($inpt.val() != '') {
      $('.total-line__po').show();
    } else {
      $('.total-line__po').hide();
    }
  },  
  updatePoValue: function(v) {
    var $continueBtn = $('#continue_button');
    var data = {
      attributes: {
        'PO Number': v
      }
    }
    var params = {
      type: 'POST',
      url: '/cart/update.js',
      data: data,
      async: false,
      dataType: 'json',
      success: function(cart) {
        console.log(cart);   
        location.reload();
//         $continueBtn.removeClass('btn--disabled').prop('disabled',false);
//         $('.po-submit').removeClass('btn--loading');
//         $('.total__po-value').text(v);
//         wick.init();
        
//         wick.checkPoVal();
//         wick.checkNeedsUpdate(true);
      },
      error: function(XMLHttpRequest, textStatus) {
        Shopify.api.onError(XMLHttpRequest, textStatus);
      }
    }; 
    $.ajax(params);

    return false;
  }
};


$(document).on(`page:load page:change`, function() {
  wick.init();
//   console.log(Shopify.Checkout);

  //   wick.addLocalDeliveryText();
});

$(function() {

});

