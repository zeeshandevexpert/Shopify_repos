function slugify(text) {
  return text.toString().toLowerCase()
  .replace(/\s+/g, '-')           // Replace spaces with -
  .replace('-quot','')
  .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
  .replace(/\-\-+/g, '-')         // Replace multiple - with single -
  .replace(/^-+/, '')             // Trim - from start of text
  .replace(/-+$/, '');            // Trim - from end of text
}

var Shopify = Shopify || {};

Shopify.optionsMap = {};

Shopify.updateOptionsInSelector = function(selectorIndex) {
  switch (selectorIndex) {
    case 0:
      var key = 'root';
      var selector = jQuery('.single-option-selector:eq(0)');
      break;
    case 1:
      var key = jQuery('.single-option-selector:eq(0)').val();
      var selector = jQuery('.single-option-selector:eq(1)');
      break;
    case 2:
      var key = jQuery('.single-option-selector:eq(0)').val();  
      key += ' / ' + jQuery('.single-option-selector:eq(1)').val();
      var selector = jQuery('.single-option-selector:eq(2)');
  }

  var initialValue = selector.val();

  selector.empty();    
  var availableOptions = Shopify.optionsMap[key];
  if(availableOptions) {
    for (var i=0; i<availableOptions.length; i++) {
      var option = availableOptions[i];
      var newOption = jQuery('<option></option>').val(option).html(option);
      selector.append(newOption);
    }
  }
//   console.log(initialValue,availableOptions);

  if (jQuery.inArray(initialValue, availableOptions) !== -1) {
    selector.val(initialValue);
  }

//   selector.trigger('change');  

};

Shopify.linkOptionSelectors = function(product) {
  // Building our mapping object.
  for (var i=0; i<product.variants.length; i++) {
    var variant = product.variants[i];

    if (variant.available) {
      // Gathering values for the 1st drop-down.
      Shopify.optionsMap['root'] = Shopify.optionsMap['root'] || [];
      Shopify.optionsMap['root'].push(variant.option1);
      Shopify.optionsMap['root'] = jQuery.unique(Shopify.optionsMap['root']);


      // Gathering values for the 2nd drop-down.
      if (product.options.length > 1) {
        var key = variant.option1;
        Shopify.optionsMap[key] = Shopify.optionsMap[key] || [];
        Shopify.optionsMap[key].push(variant.option2);
        Shopify.optionsMap[key] = jQuery.unique(Shopify.optionsMap[key]);
        //console.log(variant);
      }
      // Gathering values for the 3rd drop-down.
      if (product.options.length === 3) {
        var key = variant.option1 + ' / ' + variant.option2;
        Shopify.optionsMap[key] = Shopify.optionsMap[key] || [];
        Shopify.optionsMap[key].push(variant.option3);
        Shopify.optionsMap[key] = jQuery.unique(Shopify.optionsMap[key]);
      }
    }
  }
  // Update options right away.
  Shopify.updateOptionsInSelector(0);
  if (product.options.length > 1) Shopify.updateOptionsInSelector(1);
  if (product.options.length === 3) Shopify.updateOptionsInSelector(2);
  // When there is an update in the first dropdown.
  jQuery(".single-option-selector:eq(0)").change(function() {
    Shopify.updateOptionsInSelector(1);
    if (product.options.length === 3) Shopify.updateOptionsInSelector(2);
    return true;
  });
  // When there is an update in the second dropdown.
  jQuery(".single-option-selector:eq(1)").change(function() {
    if (product.options.length === 3) Shopify.updateOptionsInSelector(2);
    return true;
  });  
};

var wick = wick || {};

wick.wholesalePricing = function() {
  if(!window.theme.wholesale.isWholesale) return false;
  $.each(currentProduct.variants,function(i,variant) {
    variant.price = theme.getWholesalePrice(variant.price);
  });
  console.log('wholesale!');
};

wick.onOptionChange = function() {
  var realOptionSelector = '.real-option-selector';
  $(document).on('change',realOptionSelector,function() {
    var $t = $(this);
    var selectedOptions = $(realOptionSelector).map(function(i,v) {
      return $(v).val();
    });
    var selectedText = $.makeArray(selectedOptions).join(' / ');
    $('#ProductSelect-product-template option').filter(function() {
      return $.trim($(this).text()) == selectedText;
    }).prop('selected',true).trigger('change');
  });
};

wick.onMasterChange = function() {
  $(document).on('change','#ProductSelect-product-template',function(i,v) {
    var selectedText = $(this).find('option:selected').text();
    console.log(selectedText);
    var variant = false;
    $.each(currentProduct.variants,function(i,v) {
      if(v.title === selectedText) {
        variant = v;
        return false;
      }
    });
    wick.updateProductPage(variant);
  });
};

wick.formatMoney = function(price) {
  return theme.Currency.formatMoney(price, theme.moneyFormat);
}
  

wick.updateProductPage = function(variant) {
  $('.variant-inventory').text(inv_qty[variant.id]);
  var percentageSaved = ((variant.compare_at_price - variant.price) * 100)/variant.compare_at_price;
  $('.price').addClass('show');
  $('.price-item--sale').text(wick.formatMoney(variant.price));
  $('.price-item--regular').text(wick.formatMoney(variant.compare_at_price));
  $('.price-savings--dollars').text(wick.formatMoney(variant.compare_at_price - variant.price));
  $('.price-savings--percentage').text(`(${Math.round(percentageSaved)}%)`);
  
  
};

wick.productSlick = function() {
  $('#product-slick').slick();
};

$(function() {
  wick.productSlick();
  wick.wholesalePricing();
  wick.onOptionChange();
  wick.onMasterChange();
  $('#ProductSelect-product-template').trigger('change');


});