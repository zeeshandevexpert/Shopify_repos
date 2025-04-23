window.KlarnaOnsiteService = window.KlarnaOnsiteService || [];
var patternSize = /([0-9]+)" x ([0-9]+)"/;
function slugify(text) {
  return text.toString().toLowerCase().replace(/\s+/g, "-").replace("-quot", "").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-").replace(/^-+/, "").replace(/-+$/, "")
}
function changeSizeDropDown(selectorIndex) {
  var key = 'root';
  var selector = jQuery(".single-option-selector:eq(0)");
  var initialValue = selector.val();
  selector.empty();
  availableOptions = Shopify.optionsMap[key];
  if (availableOptions) {
    for (var i = 0; i < availableOptions.length; i++) {
      var arrival_date_label = '';
      var option = availableOptions[i];
      /*
      for (var j = 0; j < Shopify.product.variants.length; j++) {
        var variant = Shopify.product.variants[j];
        if (variant.available && 
            variant.option1 == option && 
            variant.option2 == jQuery(".single-option-selector:eq(1)").val() && 
            variant.option3 == jQuery(".single-option-selector:eq(2)").val()) 
        {
          var arrival_date = arrivalDates[variant.id];
          if (arrival_date != null) {
            arrival_date_label = `<span>&nbsp;&nbsp;&nbsp;(${arrival_date})</span>`;
          }
        }
      }
      */
      for (var j = 0; j < Shopify.product.variants.length; j++) {
        var variant = Shopify.product.variants[j];
        if (variant.available && variant.option1 == option) { 
          if (variant.option2 == jQuery(".single-option-selector:eq(1)").val()) {
            var arrival_date = arrivalDates[variant.id];
            if (arrival_date != null) {
              arrival_date_label = `<span>&nbsp;&nbsp;&nbsp;(${arrival_date})</span>`;
            }
            if (variant.option3 == jQuery(".single-option-selector:eq(2)").val()) {
              var arrival_date = arrivalDates[variant.id];
              if (arrival_date != null) {
                arrival_date_label = `<span>&nbsp;&nbsp;&nbsp;(${arrival_date})</span>`;
                break;
              }
            }
          }
        }
      }
      
      if (!patternSize.test(option) && arrival_date_label == '') {
        for (var j = 0; j < Shopify.product.variants.length; j++) {
          var variant = Shopify.product.variants[j];
          if (variant.available && variant.option1 == option) {
            var arrival_date = arrivalDates[variant.id];
            if (arrival_date != null) {
              arrival_date_label = `<span>&nbsp;&nbsp;&nbsp;(${arrival_date})</span>`;
            }
          }
        }
        var newOption = jQuery("<option></option>").val(option).html(option+arrival_date_label);
        selector.append(newOption);
      } else {
        var newOption = jQuery("<option></option>").val(option).html(option+arrival_date_label);
        selector.append(newOption);
      }
    }
  }
  selector.val(initialValue);
}
function changeOption2DropDown(selectorIndex) {
  var selector = jQuery(".single-option-selector:eq(2)");
  var initialValue = selector.val();
  selector.empty();
  
  var key = jQuery(".single-option-selector:eq(0)").val();
  key = key.replace(/ /g, '').replace(/x/g, ' x ');
  var availableOptions = Shopify.optionsMap[key];
  if (availableOptions) {
    for (var i = 0; i < availableOptions.length; i++) {
      var _key = availableOptions[i];
      _key = key + " / " + _key;
      
      availableOptions = Shopify.optionsMap[_key];
      if (availableOptions) {
        for (var i = 0; i < availableOptions.length; i++) {
          var option = availableOptions[i];
          var newOption = jQuery("<option></option>").val(option).html(option);
          selector.append(newOption)
        }
      }
    }
  }

  if (jQuery.inArray(initialValue, availableOptions) !== -1) selector.val(initialValue);
  selector.trigger("change");
  changeSizeDropDown(selectorIndex);
}
var Shopify = Shopify || {};
Shopify.optionsMap = {};
Shopify.updateOptionsInSelector = function (selectorIndex) {
  switch (selectorIndex) {
    case 0:
      var key = "root";
      var selector = jQuery(".single-option-selector:eq(0)");
      break;
    case 1:
      var key = jQuery(".single-option-selector:eq(0)").val();
      var selector = jQuery(".single-option-selector:eq(1)");
      /*
      if (!patternSize.test(key)) {
        key = key.replace(/ /g, '').replace(/x/g, ' x ');
      }*/
      break;
    case 2:
      var key = jQuery(".single-option-selector:eq(0)").val();
      key += " / " + jQuery(".single-option-selector:eq(1)").val();
      /*
      if (!patternSize.test(key)) {
        changeOption2DropDown();
        return;
      }*/
      var selector = jQuery(".single-option-selector:eq(2)");
  }

  var initialValue = selector.val();
  selector.empty();
  var availableOptions = Shopify.optionsMap[key];
  if (availableOptions) {
    for (var i = 0; i < availableOptions.length; i++) {
      var option = availableOptions[i];
      var newOption = jQuery("<option></option>").val(option).html(option);
      selector.append(newOption)
    }
  }
  if (jQuery.inArray(initialValue, availableOptions) !== -1) selector.val(initialValue);
  selector.trigger("change");
  changeSizeDropDown(selectorIndex);
};
Shopify.linkOptionSelectors = function (product) {
  for (var i = 0; i < product.variants.length; i++) {
    var variant = product.variants[i];
    if (variant.available) {
      Shopify.optionsMap["root"] = Shopify.optionsMap["root"] || [];
      Shopify.optionsMap["root"].push(variant.option1);
      Shopify.optionsMap["root"] = jQuery.unique(Shopify.optionsMap["root"]);
      if (product.options.length > 1) {
        var key = variant.option1;
        Shopify.optionsMap[key] = Shopify.optionsMap[key] || [];
        Shopify.optionsMap[key].push(variant.option2);
        Shopify.optionsMap[key] = jQuery.unique(Shopify.optionsMap[key])
      }
      if (product.options.length ===
        3) {
        var key = variant.option1 + " / " + variant.option2;
        Shopify.optionsMap[key] = Shopify.optionsMap[key] || [];
        Shopify.optionsMap[key].push(variant.option3);
        Shopify.optionsMap[key] = jQuery.unique(Shopify.optionsMap[key])
      }
    }
  }
  Shopify.product = product;
  Shopify.updateOptionsInSelector(0);
  if (product.options.length > 1) Shopify.updateOptionsInSelector(1);
  if (product.options.length === 3) Shopify.updateOptionsInSelector(2);
  jQuery(".single-option-selector:eq(0)").change(function () {
    Shopify.updateOptionsInSelector(1);
    if (product.options.length === 3) Shopify.updateOptionsInSelector(2);
    return true
  });
  jQuery(".single-option-selector:eq(1)").change(function () {
    if (product.options.length === 3) Shopify.updateOptionsInSelector(2);
    return true
  })
};
theme.Product = function () {
  function Product(container) {
    var $container = this.$container = $(container);
    var sectionId = $container.attr("data-section-id");
    var z = 0;
    specialOrder = false;
    this.settings = {
      mediaQueryMediumUp: "screen and (min-width: 750px)",
      mediaQuerySmall: "screen and (max-width: 749px)",
      bpSmall: false,
      enableHistoryState: $container.data("enable-history-state") || false,
      namespace: ".slideshow-" + sectionId,
      sectionId: sectionId,
      sliderActive: false,
      zoomEnabled: false
    };
    this.selectors = {
      addToCart: "#AddToCart-" + sectionId,
      addToCartText: "#AddToCartText-" + sectionId,
      errorQuantityMessage: "#error-quantity-" + sectionId,
      quantity: "#Quantity-" + sectionId,
      SKU: ".variant-sku",
      variantInventory: ".variant-inventory",
      productStatus: "[data-product-status]",
      originalSelectorId: "#ProductSelect-" + sectionId,
      productImageWraps: ".product-single__photo",
      productThumbImages: ".product-single__thumbnail--" + sectionId,
      productSlick: "#product-slick",
      productThumbs: ".product-single__thumbnails-" + sectionId,
      productThumbListItem: ".product-single__thumbnails-item",
      productFeaturedImage: ".product-featured-img",
      productThumbsWrapper: ".thumbnails-wrapper",
      saleLabel: ".product-price__sale-label-" + sectionId,
      section: "#ProductSection-product-template",
      singleOptionSelector: ".single-option-selector-" + sectionId,
      shopifyPaymentButton: ".shopify-payment-button",
      priceContainer: "[data-price]",
      regularPrice: "[data-regular-price]",
      salePrice: "[data-sale-price]"
    };
    this.classes = {
      hidden: "hide",
      productOnSale: "price--on-sale",
      productUnavailable: "price--unavailable",
      activeClass: "active-thumb"
    };
    if ($(".product-single__special-order").length) {
      var specialOrder = true;
      if (getCookie("normalDoor")) $(this.selectors.section).attr("data-normal-version", getCookie("normalDoor"))
    }
    if (!$("#ProductJson-" + sectionId).html()) return;
    this.productSingleObject = window.currentProduct;
    this.settings.zoomEnabled = $(this.selectors.productImageWraps).hasClass("js-zoom-enabled");
    theme.pdpShippingCalculator();
    var productArrows = isMobile();
    var myProductSlick = $(this.selectors.productSlick);
    myProductSlick.on("init", function (a,
      b, c) {
      theme.Popups()
    });
    var ps = myProductSlick.slick({
      infinite: true,
      dots: false,
      prevArrow: '<button type="button" class="slick-prev"><svg aria-hidden="true" focusable="false" role="presentation" class="icon-chevron-left" width="20" height="20" viewBox="0 0 284.49 498.98"><defs><style>.cls-1{fill:#231f20}</style></defs><path class="cls-1" d="M437.67 129.51a35 35 0 0 1 24.75 59.75L272.67 379l189.75 189.74a35 35 0 1 1-49.5 49.5L198.43 403.75a35 35 0 0 1 0-49.5l214.49-214.49a34.89 34.89 0 0 1 24.75-10.25z" transform="translate(-188.18 -129.51)" fill="#000000"/></svg></button>',
      nextArrow: '<button type="button" class="slick-next"><svg aria-hidden="true" focusable="false" role="presentation" class="icon-chevron-right" width="20" height="20" viewBox="0 0 284.49 498.98"><defs><style>.cls-1{fill:#231f20}</style></defs><path class="cls-1" d="M223.18 628.49a35 35 0 0 1-24.75-59.75L388.17 379 198.43 189.26a35 35 0 0 1 49.5-49.5l214.49 214.49a35 35 0 0 1 0 49.5L247.93 618.24a34.89 34.89 0 0 1-24.75 10.25z" transform="translate(-188.18 -129.51)" fill="#000000"/></svg></button>'
    }).fadeIn();
    
    if (!isMobile()) $(".js-zoom-enabled").each(function () {
      _enableZoom($(this))
    });
    $(".pdp-lifestyle-images").slick({
      dots: false,
      arrows: true,
      infinite: true,
      arrows: true,
      prevArrow: arrowPrev,
      nextArrow: arrowNext
    });
    $(".product-single__thumbnails-item a").on("click", function (e) {
      e.preventDefault();
      var myIndex = $(this).data("slide-index");
      myProductSlick.slick("slickGoTo", myIndex)
    });
    $(".select-type input").on("change", function () {
      if ($(this).val() == "in-stock") {
        specialOrder = false;
        var goTo = $("#ProductSection-product-template").attr("data-normal-version")
      } else {
        specialOrder =
          true;
        setCookie("normalDoor", $("#ProductSection-product-template").attr("data-product-handle"));
        var goTo = $("#ProductSection-product-template").attr("data-special-version")
      }
      window.location.href = goTo
    });
    this._initBreakpoints();
    this._stringOverrides();
    this._initVariants();
    this._initImageSwitch();
    this._initAddToCart();
    this._setActiveThumbnail();
    
    Shopify.duplicatedOptions = [];
    for (var j = 0; j < this.productSingleObject.variants.length; j++) {
      var variant = this.productSingleObject.variants[j];
      if (variant.available) { 
        if (!patternSize.test(variant.option1)) {
          var option = variant.option1.replace(/ /g, '').replace(/x/g, ' x ');
          Shopify.duplicatedOptions.push(option);
        }
      }
    }
    Shopify.duplicatedOptions = jQuery.unique(Shopify.duplicatedOptions);
    
    var items = $(".product-form-product-template .swatch");
    items.sort(function (a, b) {
      return +$(a).data("reorder-index") - +$(b).data("reorder-index")
    });
    items.appendTo(".product-single__swatches");
    var sItems = $(".product-form-product-template .selector-wrapper");
    sItems.sort(function (a, b) {
      return +$(a).data("reorder-index") - +$(b).data("reorder-index")
    });
    sItems.appendTo(".product-single__swatches")
  }
  Product.prototype = _.assignIn({}, Product.prototype, {
    _stringOverrides: function () {
      theme.productStrings = theme.productStrings || {};
      $.extend(theme.strings, theme.productStrings)
    },
    _initBreakpoints: function () {
      var self = this;
      enquire.register(this.settings.mediaQuerySmall, {
        match: function () {
          if ($(self.selectors.productThumbImages).length >
            3) self._initThumbnailSlider();
          if (self.settings.zoomEnabled) $(self.selectors.productImageWraps).each(function () {
            _destroyZoom(this)
          });
          self.settings.bpSmall = true
        },
        unmatch: function () {
          if (self.settings.sliderActive) self._destroyThumbnailSlider();
          self.settings.bpSmall = false
        }
      });
      enquire.register(this.settings.mediaQueryMediumUp, {
        match: function () {
          if (self.settings.zoomEnabled) $(self.selectors.productImageWraps).each(function () {
            _enableZoom(this)
          })
        }
      })
    },
    _initVariants: function () {
      var options = {
        $container: this.$container,
        enableHistoryState: this.$container.data("enable-history-state") || false,
        singleOptionSelector: this.selectors.singleOptionSelector,
        originalSelectorId: this.selectors.originalSelectorId,
        product: this.productSingleObject
      };
      this.variants = new slate.Variants(options);
      this.$container.on("variantChange" + this.settings.namespace, this._updateAvailability.bind(this));
      this.$container.on("variantImageChange" + this.settings.namespace, this._updateImages.bind(this));
      this.$container.on("variantPriceChange" + this.settings.namespace,
        this._updatePrice.bind(this));
      this.$container.on("variantSKUChange" + this.settings.namespace, this._updateSKU.bind(this))
    },
    _initImageSwitch: function () {
      if (!$(this.selectors.productThumbImages).length) return;
      var self = this;
      $(this.selectors.productThumbImages).on("click", function (evt) {
        evt.preventDefault();
        var $el = $(this);
        var imageId = $el.data("thumbnail-id");
        self._switchImage(imageId);
        self._setActiveThumbnail(imageId)
      }).on("keyup", self._handleImageFocus.bind(self))
    },
    _initAddToCart: function () {
      var self = this;
      var $quantityInput = $(self.selectors.quantity);
      if ($quantityInput.length === 0) return;
      $(self.selectors.addToCart).on("click", function (evt) {
        var isInvalidQuantity = $quantityInput.val() <= 0;
        $(self.selectors.errorQuantityMessage).toggleClass(self.classes.hidden, !isInvalidQuantity);
        if (isInvalidQuantity) {
          $quantityInput.attr("aria-describedby", "error-quantity-" + self.settings.sectionId).attr("aria-invalid", true);
          $(self.selectors.errorQuantityMessage).focus();
          evt.preventDefault()
        } else $quantityInput.removeAttr("aria-describedby").removeAttr("aria-invalid")
      })
    },
    _setActiveThumbnail: function (imageId) {
      if (typeof imageId === "undefined") imageId = $(this.selectors.productImageWraps + ":not(.hide)", this.$container).data("image-id");
      var $thumbnailWrappers = $(this.selectors.productThumbListItem + ":not(.slick-cloned)", this.$container);
      var $activeThumbnail = $thumbnailWrappers.find(this.selectors.productThumbImages + "[data-thumbnail-id='" + imageId + "']");
      $(this.selectors.productThumbImages).removeClass(this.classes.activeClass).removeAttr("aria-current");
      $activeThumbnail.addClass(this.classes.activeClass);
      $activeThumbnail.attr("aria-current", true);
      if (!$thumbnailWrappers.hasClass("slick-slide")) return
    },
    _switchImage: function (imageId) {
      var $newImage = $(this.selectors.productImageWraps + "[data-image-id='" + imageId + "']", this.$container);
      var $otherImages = $(this.selectors.productImageWraps + ":not([data-image-id='" + imageId + "'])", this.$container);
      $newImage.removeClass(this.classes.hidden);
      $otherImages.addClass(this.classes.hidden)
    },
    _handleImageFocus: function (evt) {
      if (evt.keyCode !== slate.utils.keyboardKeys.ENTER) return;
      $(this.selectors.productFeaturedImage + ":visible").focus()
    },
    _initThumbnailSlider: function () {
      var options = {
        slidesToShow: 4,
        slidesToScroll: 3,
        infinite: false,
        prevArrow: ".thumbnails-slider__prev--" + this.settings.sectionId,
        nextArrow: ".thumbnails-slider__next--" + this.settings.sectionId,
        responsive: [{
          breakpoint: 321,
          settings: {
            slidesToShow: 3
          }
        }]
      };
      $(this.selectors.productThumbs).slick(options);
      $(this.selectors.productThumbsWrapper, this.$container).find(".slick-list").removeAttr("aria-live");
      $(this.selectors.productThumbsWrapper,
        this.$container).find(".slick-disabled").removeAttr("aria-disabled");
      this.settings.sliderActive = true
    },
    _destroyThumbnailSlider: function () {
      $(this.selectors.productThumbs).slick("unslick");
      this.settings.sliderActive = false;
      $(this.selectors.productThumbsWrapper, this.$container).find('[tabindex="-1"]').removeAttr("tabindex")
    },
    _liveRegionText: function (variant) {
      var liveRegionText = "[Availability] [Regular] [$$] [Sale] [$]";
      if (!variant) {
        liveRegionText = theme.strings.unavailable;
        return liveRegionText
      }
      var availability =
        variant.available ? "" : theme.strings.soldOut + ",";
      liveRegionText = liveRegionText.replace("[Availability]", availability);
      var regularLabel = "";
      var regularPrice = theme.Currency.formatMoney(variant.price, theme.moneyFormat);
      var saleLabel = "";
      var salePrice = "";
      if (variant.compare_at_price > variant.price) {
        regularLabel = theme.strings.regularPrice;
        regularPrice = theme.Currency.formatMoney(variant.compare_at_price, theme.moneyFormat) + ",";
        saleLabel = theme.strings.sale;
        salePrice = theme.Currency.formatMoney(variant.price, theme.moneyFormat)
      }
      if (theme.wholesale.isWholesale) regularPrice =
        regularPrice;
      liveRegionText = liveRegionText.replace("[Regular]", regularLabel).replace("[$$]", regularPrice).replace("[Sale]", saleLabel).replace("[$]", salePrice).trim();
      return liveRegionText
    },
    _updateLiveRegion: function (evt) {
      var variant = evt.variant;
      var liveRegion = this.container.querySelector(this.selectors.productStatus);
      liveRegion.textContent = this._liveRegionText(variant);
      liveRegion.setAttribute("aria-hidden", false);
      setTimeout(function () {
        liveRegion.setAttribute("aria-hidden", true)
      }, 1E3)
    },
    _updateAddToCart: function (evt) {
      var variant =
        evt.variant;
      if (variant) {
        window.currentVariant = variant;
        var variantQty = $("#ProductSelect-product-template option:selected").attr("data-quantity");
        $(this.selectors.addToCart).attr("data-variant-id", variant.id);
        
        if (variant.ships_in) {
          let ships_in = variant.ships_in;
          const regExp = /\(([^)]+)\)/g;
          const matches = [...ships_in.match(regExp)];

          ships_in = ships_in
            .replace(/\./g, '<span class="point">.</span>')
            .replace(/\(/g, '<span class="bracket">(</span>')
            .replace(/\)/g, '<span class="bracket">)</span>');
          
          let ships_in_1 = ships_in, ships_in_2 = '', ships_in_3 = '';
          
          if (ships_in.indexOf('after arrival') != -1) {
            ships_in = ships_in.split('after arrival');
            ships_in_1 = ships_in[0] + 'after arrival';
            ships_in_2 = ships_in[1];
          } else if (ships_in.indexOf('days') != -1) {
            ships_in = ships_in.split('days');
            ships_in_1 = ships_in[0] + 'days';
            ships_in_2 = ships_in[1];
          }
            
          if (ships_in_2.indexOf('Based') != -1) {
            ships_in = ships_in_2.split('Based');
            ships_in_2 = ships_in[0];
            ships_in_3 = 'Based' + ships_in[1];
          }
          ships_in_1 = ships_in_1.trim();
          ships_in_2 = ships_in_2.trim();
          ships_in_3 = ships_in_3.trim();
          
          $(".shipping-time").val(variant.ships_in.replace("Ships within", ""));
          $(".shipping-text").html(`<span>${ships_in_1}</span><span>${ships_in_2}</span><span>${ships_in_3}</span>`);
        }
        if (variant.available) {
          $(this.selectors.addToCart).prop("disabled", false);
          $(this.selectors.addToCartText).text(theme.strings.addToCart);
          $(this.selectors.shopifyPaymentButton,
            this.$container).show();
          theme.forceVariants()
        } else {
          $(this.selectors.addToCart).prop("disabled", true);
          $(this.selectors.addToCartText).text(theme.strings.soldOut);
          $(this.selectors.shopifyPaymentButton, this.$container).hide();
          theme.forceVariants()
        }
      } else {
        $(this.selectors.addToCart).prop("disabled", true);
        $(this.selectors.addToCartText).text(theme.strings.unavailable);
        theme.forceVariants()
      }
      $("[data-price]").addClass("show")
    },
    _findAVariant: function () {
      var findMe = "";
      $(".real-option-selector option:selected").each(function (i,
        v) {
        if (i === 0) findMe = $(this).text().trim();
        else findMe += " / " + $(this).text().trim()
      });
      var findMeEncoded = encodeURIComponent(findMe);
      $("#ProductSelect-product-template").show();
      var newVal = $('#ProductSelect-product-template option[data-title="' + findMeEncoded + '"]').val()
    },
    _updateAvailability: function (evt) {
      this._updateAddToCart(evt);
      this._updateLiveRegion(evt);
      this._updatePrice(evt);
      this._updateStockNotice(evt)
    },
    _updateStockNotice: function (evt) {
      var variant = evt.variant;
      if (variant) {
        var availableStock = theme.getAvailableQuantity(variant.id) >
          0 ? theme.getAvailableQuantity(variant.id) : 0;
        $(this.selectors.addToCart).attr("data-variant-qty", availableStock)
      }
    },
    _updateImages: function (evt) {
      var variant = evt.variant;
      var imageId = variant.featured_image.id;
      this._switchImage(imageId);
      this._setActiveThumbnail(imageId)
    },
    _updatePrice: function (evt) {
      if (!evt.variant) return;
      var regularPrice = theme.Currency.formatMoney(evt.variant.price, theme.moneyFormat);
      $(".price-item--sale").html(regularPrice);
      $('.price-item--sale').attr('sale_price', theme.Currency.formatMoney(evt.variant.price, theme.moneyWithCurrencyFormat));
    },
    _updateSKU: function (evt) {
      var variant = evt.variant;
      $(this.selectors.SKU).html(variant.sku)
    },
    onUnload: function () {
      this.$container.off(this.settings.namespace)
    }
  });

  function _enableZoom(el) {
    var zoomUrl = $(el).data("zoom");
    $(el).zoom({
      on: "click",
      url: zoomUrl
    });
    //console.log(zoomUrl);
    $(".product-single__zoom").on("click", function (e) {
      e.preventDefault();
      $(el).zoom({
        url: zoomUrl
      })
    })
  }

  function _destroyZoom(el) {
    $(el).trigger("zoom.destroy")
  }
  return Product
}();
theme.pdpShippingCalculator = function () {
  var log = function (a) {
    if (!debug) return
  };
  var debug = true;
  var cartCookie;
  var productSection = document.getElementsByClassName("product-single__shipping-wrapper");
  if (!productSection.length) {
    log("Could not find the element");
    return
  }
  var productSelect = document.getElementById("ProductSelect-product-template");
  if (!productSelect) {
    log("Could not find the main select element");
    return
  }
  var shippingMessage = document.getElementById("shipping-response");
  var shippingCountry = document.getElementById("shipping-country");
  var shippingProvince = document.getElementById("shipping-state");
  var shippingZip = document.getElementById("shipping-zip");
  var shippingCalcWrapper = document.querySelector(".shipping-calc-wrapper");
  var shippingCalcButton = document.querySelector(".shipping-submit");
  var initShippingFields = function () {
    var countries = ["United States"];
    for (var i = 0; i < countries.length; i++) shippingCountry.add(new Option(countries[i], countries[i], i === 0));
    var provinces = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
      "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming",
      "District of Columbia", "Puerto Rico", "Guam", "American Samoa", "U.S. Virgin Islands", "Northern Mariana Islands"
    ];
    for (var i = 0; i < provinces.length; i++) shippingProvince.add(new Option(provinces[i], provinces[i], i === 0));
    shippingProvince.value = "California";
    shippingCalcButton.onclick = function () {
      $(".shipping-submit svg").fadeIn();
      this.disabled = true;
      $(this).find(".inner-txt").text("Getting Rates...");
      if (!productSelect.value.length) return false;
      cartCookie = getCookie("cart");
      var tempCookieValue = tempCookieValue ||
        "temp-cart-cookie___" + Date.now();
      var fakeCookieValue = fakeCookieValue || "fake-cart-cookie___" + Date.now();
      if (!cartCookie) {
        log("no cookie found");
        updateCartCookie(tempCookieValue);
        cartCookie = getCookie("cart")
      } else log("cookie found");
      if (cartCookie.length < 32) {
        log("cart ID not valid");
        return
      }
      updateCartCookie(fakeCookieValue);
      log(getCookie("cart"));
      getRates(parseInt(productSelect.value));
      return false
    }
  };
  var getCookie = function (name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length ==
      2) return parts.pop().split(";").shift()
  };
  var updateCartCookie = function (a) {
    log("changing cart cookie value to: " + a);
    var date = new Date;
    date.setTime(date.getTime() + 14 * 864E5);
    var expires = "; expires=" + date.toGMTString();
    document.cookie = "cart=" + a + expires + "; path=/"
  };
  var resetCartCookie = function () {
    updateCartCookie(cartCookie);
    $(".shipping-submit").prop("disabled", false);
    $(".shipping-submit .inner-txt").text("Get Rates");
    $(".shipping-submit svg").fadeOut();
    log(getCookie("cart"))
  };
  var getRates = function (variantId) {
    shippingMessage.innerHTML =
      "";
    log("getRates");
    if (typeof variantId === "undefined") return;
    var productQuantity = document.getElementById("Quantity-product-template");
    var quantity = productQuantity ? parseInt(productQuantity.value) : 1;
    var addData = {
      "id": variantId,
      "quantity": quantity
    };
    fetch("/cart/add.js", {
      body: JSON.stringify(addData),
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "xmlhttprequest"
      },
      method: "POST"
    }).then(function (response) {
      return response.json()
    }).then(function (json) {
      log(json);
      $.ajax({
        type: "GET",
        url: "/cart/shipping_rates.json",
        data: {
          "shipping_address[country]": shippingCountry.value,
          "shipping_address[province]": shippingProvince.value,
          "shipping_address[zip]": shippingZip.value
        },
        success: function (d) {
          if (d.shipping_rates && d.shipping_rates.length) {
            shippingMessage.innerHTML = "";
            $.each(d.shipping_rates, function (i, shipping_rate) {
              shippingMessage.innerHTML += '<div class="flex flex--space-between"><span>' + shipping_rate.name + "</span><span>" + theme.Currency.formatMoney(shipping_rate.price, theme.moneyFormat) +
                "</span></div>"
            })
          }
          resetCartCookie()
        },
        error: function (e) {
          resetCartCookie();
          shippingMessage.innerHTML = e.responseJSON.error
        },
        dataType: "json"
      })
    }).catch(function (err) {
      console.error(err);
      resetCartCookie()
    })
  };
  initShippingFields()
};
theme.fancyStockChecks = function (obj, variantID, quantityRequested) {
  var specialProps = {
    "Color": "Oil Rubbed Bronze"
  };
  if ($("#color-option").length) specialProps["Color"] = $("#color-option").val();
  var normalProps = {};
  $(".line-item--selector").each(function (i, v) {
    var $this = $(this),
      property = $this.prev().text().trim(),
      val = $this.text().trim()
  });
  $(".item-property").each(function (i, v) {
    var itemName = $(v).attr("name");
    normalProps[itemName] = val
  });
  var $shippingTime = $(".shipping-time");
  if ($shippingTime.length && $shippingTime.val() !=
    "") {
    normalProps["Ships within"] = $shippingTime.val();
    specialProps["Ships within"] = window.shippingTimeSpecial
  }
  var parentProduct = $(".product-template__container"),
    handle = parentProduct.data("product-handle") + "-special-order",
    variantTitle = $("#ProductSelect-product-template option:selected").text().split(" / "),
    foundOne = false,
    specialID = $("#SpecialSelect-product-template").val();
  var quantityAvailable = theme.getAvailableQuantity(variantID) != -1 ? theme.getAvailableQuantity(variantID) : parseInt($("#AddToCart-product-template").attr("data-variant-qty"));
  console.log(quantityAvailable);
  if (GlassOptions.indexOf(variantTitle[1]) !== -1) specialProps["Glass"] = variantTitle[1];
  else if (GlassOptions.indexOf(variantTitle[2]) !== -1) specialProps["Glass"] = variantTitle[2];
  if (SwingOptions.indexOf(variantTitle[1]) !== -1) specialProps["Swing"] = variantTitle[1];
  else if (SwingOptions.indexOf(variantTitle[2]) !== -1) specialProps["Swing"] = variantTitle[2];
  if (SwingOptions.indexOf(variantTitle[1]) !== -1) specialProps["Swing"] = variantTitle[1];
  else if (SwingOptions.indexOf(variantTitle[2]) !==
    -1) specialProps["Swing"] = variantTitle[2];
  if (quantityAvailable >= quantityRequested) theme.addItemWithProps(variantID, quantityRequested, normalProps);
  else if (quantityAvailable === 0) theme.addItemWithProps(specialID, quantityRequested, specialProps);
  else {
    var quantityRemaining = quantityRequested - quantityAvailable;
    var mySpecialOrderVersion = false;
    theme.addItemWithProps(variantID, quantityAvailable, normalProps);
    var timer = setInterval(function () {
      if (itemAdded == true) {
        clearInterval(timer);
        itemAdded = false;
        theme.addItemWithProps(specialID,
          quantityRemaining, specialProps)
      }
    }, 100)
  }
};
theme.forceVariants = function () {
  var mainSelector = "#ProductSelect-product-template",
    addBtn = "#AddToCart-product-template",
    addTxt = "#AddToCartText-product-template";
  setTimeout(function () {
    var findMe = "";
    var vfoa = [];
    $(".real-option-selector option:selected").each(function (i, v) {
      var txt = $(this).val().trim();
      vfoa.push($(this).val());
      if (i === 0) findMe = txt;
      else findMe += " / " + txt
    });
    var variantFromOptionArray = Shopify.theme.product.getVariantFromOptionArray(currentProduct, vfoa);
    var findMeEncoded = findMe.replaceAll('"',"$");
    var newVal = $(mainSelector + ' option[data-title="' + findMeEncoded + '"]').val();
    $(mainSelector).val(newVal).trigger("change");
    var title = $(mainSelector + " option:selected").text().split(" / ")[0];
    $("#SpecialSelect-product-template option:contains(" + title + ")").prop("selected", true);
    var currentURL = window.location.href;
    var newURL = currentURL.split("?variant=")[0] + "?variant=" + newVal;
    if (typeof newVal != 'undefined') {
      $(addBtn).attr("data-variant-id", newVal);
      $(addBtn).prop("disabled", false);
      $(addTxt).text(theme.strings.addToCart);
    }
    var compareAtPrice = $(mainSelector + ' option[data-title="' + findMeEncoded + '"]').data("compare-at-price"),
      salePrice = $(mainSelector + ' option[data-title="' + findMeEncoded + '"]').data("price"),
      inventoryQuantity = $(mainSelector + ' option[data-title="' + findMeEncoded + '"]').data("quantity"),
      $regularPrice = "[data-regular-price]",
      $salePrice = ".price-item--sale",
      $priceContainer = "[data-price]",
      $savingsDollars = ".price-savings--dollars",
      $savingsPercentage = ".price-savings--percentage";
    var inventoryQuantity = $(mainSelector).find(":selected").data("quantity");
    var availableStock = theme.getAvailableQuantity(newVal) > 0 ? theme.getAvailableQuantity(newVal) : inventoryQuantity;
    var dollarsSaved = "";
    var percentageSaved = "";
    var originalSalePrice = salePrice;
    var originalPercentage = (compareAtPrice - salePrice) / salePrice;
    $(addBtn).attr("data-variant-qty", availableStock);
    if (theme.wholesale.isWholesale) {
      compareAtPrice = salePrice;
      salePrice = theme.getWholesalePrice(salePrice)
    }
    $(".variant-inventory").text(availableStock);
    
    if ($($regularPrice).hasClass('product-once_in_alifetime_sale_collection-price')) {
      compareAtPrice = salePrice;
      salePrice = compareAtPrice*0.8;
    }
    if (compareAtPrice > salePrice) {
      var compareAt = compareAtPrice ? compareAtPrice : false;
      if (compareAt) {
        if (theme.wholesale.isWholesale) {
          dollarsSaved = theme.getWholesaleDollarsSaved(originalSalePrice, salePrice);
          percentageSaved = theme.wholesale.discount
        } else {
          dollarsSaved = compareAt - salePrice;
          percentageSaved = (compareAt - salePrice) * 100 / compareAt
        }
        $($regularPrice).html(theme.Currency.formatMoney(compareAtPrice, theme.moneyFormat))
      } else $($regularPrice).html(theme.Currency.formatMoney(salePrice, theme.moneyFormat));
      $(addBtn).attr("data-variant-qty", availableStock);
      if (theme.wholesale.isWholesale) {
        $(".price__sale").html("Dealer Price: " +
          theme.Currency.formatMoney(salePrice, theme.moneyFormat));
        $(".price__regular").html("MSRP: " + theme.Currency.formatMoney(originalSalePrice, theme.moneyFormat))
      } else {
        $($salePrice).html(theme.Currency.formatMoney(salePrice, theme.moneyFormat));
        $($priceContainer).addClass("price--on-sale");
        $($savingsDollars).html(theme.Currency.formatMoney(dollarsSaved, theme.moneyFormat));
        $($savingsPercentage).html("(" + Math.round(percentageSaved) + "%)")
      }
    } else {
      if (theme.wholesale.isWholesale) salePrice = originalSalePrice;
      $("[data-regular-price]").html(theme.Currency.formatMoney(salePrice,
        theme.moneyFormat))
    }
    $("[data-price]").addClass("show");
    $(".affirm-price").html(theme.Currency.formatMoney(salePrice / 4, theme.moneyFormat));
    var klarnaPrice = theme.getKlarnaPrice(salePrice);
    $(".klarna-price").html(theme.Currency.formatMoney(klarnaPrice, theme.moneyFormat));
    affirm.ui.ready(function () {
      $(".affirm-as-low-as").attr("data-amount", salePrice);
      affirm.ui.refresh()
    })
  }, 250)
};
theme.getKlarnaPrice = function (price) {
  var newPrice = price;
  if (price > 15E3) newPrice = price / 6;
  if (price > 3E4) newPrice = price / 12;
  if (price > 1E5) newPrice = price / 18;
  if (price > 2E5) newPrice = price / 24;
  if (price > 3E5) newPrice = price / 36;
  return newPrice
};
window.slate = window.slate || {};
slate.Variants = function () {
  function Variants(options) {
    this.$container = options.$container;
    this.product = options.product;
    this.singleOptionSelector = options.singleOptionSelector;
    this.originalSelectorId = options.originalSelectorId;
    this.enableHistoryState = options.enableHistoryState;
    this.currentVariant = this._getVariantFromOptions();
    $(this.singleOptionSelector, this.$container).on("change", this._onSelectChange.bind(this))
  }
  Variants.prototype = _.assignIn({}, Variants.prototype, {
    _getCurrentOptions: function () {
      var currentOptions =
        _.map($(this.singleOptionSelector, this.$container), function (element) {
          var $element = $(element);
          var type = $element.attr("type");
          var currentOption = {};
          if (type === "radio" || type === "checkbox")
            if ($element[0].checked) {
              currentOption.value = $element.data("real-value");
              currentOption.index = $element.data("index");
              return currentOption
            } else return false;
          else {
            currentOption.value = $element.val();
            currentOption.index = $element.data("index");
            return currentOption
          }
        });
      currentOptions = _.compact(currentOptions);
      return currentOptions
    },
    _getVariantFromOptions: function () {
      var selectedValues = this._getCurrentOptions();
      var variants = this.product.variants;
      var found = _.find(variants, function (variant) {
        return selectedValues.every(function (values) {
          return _.isEqual(variant[values.index], values.value)
        })
      });
      return found
    },
    _onSelectChange: function () {
      var variant = this._getVariantFromOptions();
      this.$container.trigger({
        type: "variantChange",
        variant: variant
      });
      if (!variant) return;
      this.currentVariant = variant;
      this._updateMasterSelect(variant);
      this._updateSKU(variant);
      currentVariantWeight = variant.weight;
      currentVariantWidth = variant.option1.split(" x ")[0];
      currentVariantHeight = variant.option1.split(" x ")[1];
      //# tony 2024-01-09 pre sale
      if (hasArrvialDate) {
        $('.product-single__presale-clock__wrapper').addClass('hide');
        $('.product-single__presale-clock-'+variant.id).removeClass('hide');
      }
      
      if ($('.product-single__presale-clock-'+variant.id).length) {
        var endDate = $('.product-single__presale-clock-'+variant.id).find('.presale-clock').attr('data-end-date');
        $('[sale_price_effective_date]').attr('sale_price_effective_date', endDate+'T23:59-0800');
      } else {
        $('[sale_price_effective_date]').attr('sale_price_effective_date', '');
      }
      if (this.enableHistoryState) this._updateHistoryState(variant);
    },
    _updateImages: function (variant) {
      var variantImage = variant.featured_image || {};
      var currentVariantImage = this.currentVariant.featured_image || {};
      if (!variant.featured_image || variantImage.src === currentVariantImage.src) return;
      this.$container.trigger({
        type: "variantImageChange",
        variant: variant
      })
    },
    _updatePrice: function (variant) {
      if (variant.price === this.currentVariant.price) return;
      affirm.ui.ready(function () {
        $(".affirm-as-low-as").attr("data-amount", variant.price);
        affirm.ui.refresh()
      });
      this.$container.trigger({
        type: "variantPriceChange",
        variant: variant
      })
    },
    _updateSKU: function (variant) {
      if (variant.sku === this.currentVariant.sku) return;
      this.$container.trigger({
        type: "variantSKUChange",
        variant: variant
      })
    },
    _updateHistoryState: function (variant) {
      if (!history.replaceState || !variant) return;
      var newurl = window.location.protocol +
        "//" + window.location.host + window.location.pathname + "?variant=" + variant.id;
      window.history.replaceState({
        path: newurl
      }, "", newurl)
    },
    _updateMasterSelect: function (variant) {
      $(this.originalSelectorId, this.$container).val(variant.id)
    },
    _updateSpecialSelect: function (variant) {
      if (variant) {
        var myTitle = variant.title.split(" / ")[0];
        $("#SpecialSelect-product-template option:contains(" + myTitle.replace("$", '"') + ")").prop("selected", true)
      }
    }
  });
  return Variants
}();
theme.findSpecialVersion = function (variant) {
  var size = false;
  var properties = {};
  var match = ["false", "No Screen"];
  var specialVariant = {
    id: false,
    quantity: false,
    properties: {}
  };
  $.each(window.currentVariant.options, function (i, option) {
    if (window.currentProduct.options[0] == "Size" && i == 0) match[0] = option;
    else {
      properties[window.currentProduct.options[i]] = option;
      specialVariant.properties[`${window.currentProduct.options[i]}`] = option
    }
  });
  var matchString = match.join(" / ");
  console.log(matchString);
  if ($("#color-option").length) {
    properties["Color"] =
      $("#color-option").val();
    specialVariant.properties.Color = $("#color-option").val()
  }
  $.each(window.specialVersion.variants, function (i, variant) {
    if (variant.title == matchString) specialVariant.id = variant.id
  });
  return specialVariant
};
theme.addSpecial = function (data, remaining) {
  console.log(data);
  var size = false;
  var properties = {};
  var match = ["false", '6" Jamb', "No Screen"];
  var specialVariant = false;
  $.each(data.options_with_values, function (i, option) {
    if (option.name == "Size") {
      size = option.value;
      match[0] = size
    } else properties[option.name] = option.value
  });
  var matchString = match.join(" / ");
  properties["Color"] = data.properties["Color"];
  console.log(match);
  $.each(window.specialVersion.variants, function (i, variant) {
    if (variant.title == matchString) {
      specialVariant =
        variant.id;
      console.log(specialVariant)
    }
  });
  if (!specialVariant) return;
  var item = [{
    quantity: remaining,
    id: specialVariant,
    properties: properties
  }];
  $.post("/cart/add.js", {
    items: item
  }, function (data) {
    console.log(data);
    theme.addToCartOk()
  }, "json").done(function (data) {
    console.log(data);
    theme.addToCartOk()
  })
};
theme.popupLinks = function () {};
theme.newAddToCart = function (form) {
  let variantID = $(form).find("#ProductSelect-product-template").val();
  let quantityRequested = parseFloat($("#Quantity-product-template").val());
  let quantityAvailable = parseFloat(inv_qty[variantID]);
  let remaining = false;
  var itemsArr = [];
  var itemsInCart = 0;
  $(".cart-ajax .cart-ajax__row").each(function (i, cartItem) {
    if (parseFloat($(cartItem).data("variant")) == variantID) itemsInCart = parseFloat($(cartItem).find(".item-quantity__input").val())
  });
  quantityAvailable = quantityAvailable -
    itemsInCart;
  remaining = quantityRequested - quantityAvailable;
  var qty = quantityRequested > quantityAvailable ? quantityAvailable : quantityRequested;
  var formData = JSON.parse(JSON.stringify($(form).serializeArray()));
  var mainItem = {
    quantity: qty,
    id: variantID,
    properties: {}
  };
  $.each(formData, function (i, obj) {
    if (obj.name.indexOf("properties") > -1) {
      var prop = obj.name.split("[")[1].split("]")[0];
      mainItem.properties[prop] = obj.value
    }
  });
  if (currentProduct.title.indexOf("Special Order") > -1) {
    mainItem.quantity = quantityRequested;
    itemsArr.push(mainItem)
  } else {
    var specialItem = theme.findSpecialVersion(variantID);
    if (quantityAvailable == 0) {
      if (specialItem.id) {
        specialItem.quantity = quantityRequested;
        itemsArr.push(specialItem)
      }
    } else if (quantityRequested > quantityAvailable) {
      itemsArr.push(mainItem);
      if (specialItem.id) {
        specialItem.quantity = remaining;
        itemsArr.push(specialItem)
      }
    } else itemsArr.push(mainItem)
  }
  console.log(itemsArr);
  $.post("/cart/add.js", {
    items: itemsArr
  }, function (data) {
    theme.addToCartOk()
  }, "json").fail(function (err) {
    theme.addToCartEnable();
    console.log(err)
  })
};
$("#AddToCart-product-template").on("click", function (e) {
  e.preventDefault();
  theme.addToCartDisable();
  var addToCartForm = document.querySelector('form[action="/cart/add"]');
  theme.newAddToCart(addToCartForm)
});

function imgURL(src, size) {
  return src.replace(/_(pico|icon|thumb|small|compact|medium|large|grande|original|1024x1024|2048x2048|master)+\./g, ".").replace(/\.jpg|\.png|\.gif|\.jpeg/g, function (match) {
    return "_" + size + match
  })
}
$(".regular-mfp-popup img").each(function () {});
theme.lazySections = function () {
  const sections = Array.from(document.querySelectorAll(".section.lazy"));
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const section = entry.target;
          const sectionId = section.getAttribute("id");
          fetch(`/?section_id=${sectionId}`).then(function (response) {
            return response.text()
          }).then(function (html) {
            console.log(section);
            section.innerHTML = html
          }).catch(function (err) {
            console.warn("Something went wrong.",
              err)
          });
          sectionObserver.unobserve(section)
        }
      })
    });
    sections.forEach(section => sectionObserver.observe(section))
  }
};
this.Shopify = this.Shopify || {};
this.Shopify.theme = this.Shopify.theme || {};
this.Shopify.theme.product = function (exports) {
  function getProductJson(handle) {
    return fetch("/products/" + handle + ".js").then(function (response) {
      return response.json()
    })
  }

  function getVariantFromId(product, value) {
    _validateProductStructure(product);
    if (typeof value !== "number") throw new TypeError(value + " is not a Number.");
    var result = product.variants.filter(function (variant) {
      return variant.id === value
    });
    return result[0] || null
  }

  function getVariantFromSerializedArray(product, collection) {
    _validateProductStructure(product);
    var optionArray = _createOptionArrayFromOptionCollection(product, collection);
    return getVariantFromOptionArray(product, optionArray)
  }

  function getVariantFromOptionArray(product, options) {
    _validateProductStructure(product);
    _validateOptionsArray(options);
    var result = product.variants.filter(function (variant) {
      return options.every(function (option, index) {
        return variant.options[index] === option
      })
    });
    return result[0] || null
  }

  function _createOptionArrayFromOptionCollection(product, collection) {
    _validateProductStructure(product);
    _validateSerializedArray(collection);
    var optionArray = [];
    collection.forEach(function (option) {
      for (var i = 0; i < product.options.length; i++)
        if (product.options[i].name.toLowerCase() === option.name.toLowerCase()) {
          optionArray[i] = option.value;
          break
        }
    });
    return optionArray
  }

  function _validateProductStructure(product) {
    if (typeof product !== "object") throw new TypeError(product + " is not an object.");
    if (Object.keys(product).length === 0 && product.constructor === Object) throw new Error(product + " is empty.");
  }

  function _validateSerializedArray(collection) {
    if (!Array.isArray(collection)) throw new TypeError(collection +
      " is not an array.");
    if (collection.length === 0) throw new Error(collection + " is empty.");
    if (collection[0].hasOwnProperty("name")) {
      if (typeof collection[0].name !== "string") throw new TypeError("Invalid value type passed for name of option " + collection[0].name + ". Value should be string.");
    } else throw new Error(collection[0] + "does not contain name key.");
  }

  function _validateOptionsArray(options) {
    if (Array.isArray(options) && typeof options[0] === "object") throw new Error(options + "is not a valid array of options.");
  }
  exports.getProductJson = getProductJson;
  exports.getVariantFromId = getVariantFromId;
  exports.getVariantFromSerializedArray = getVariantFromSerializedArray;
  exports.getVariantFromOptionArray = getVariantFromOptionArray;
  return exports
}({});
$(function () {
  theme.popupLinks();
  if (currentProduct.type == "Dutch Doors") $("#lock-compatibility-popup .handleMain").hide();
  $(".selector-box select").select2({
    minimumResultsForSearch: 10
  }).css("opacity", 0).on('change', function(evt){
    //changeSizeDropDown();
  });
  $(".product-form .learn-more--link").each(function (i, link) {
    var text = $(link).text(),
      url = $(link).attr("href"),
      div = $(link).data("div"),
      txt = $(link).data("alt-text");
    $(".links-below-add-button").append(`<a data-div="${div}" class="mfp-ajax" href="${url}">${txt}</a>`)
  });
  $(".mfp-inline").magnificPopup({
    removalDelay: 300,
    mainClass: "mfp-with-zoom",
    midClick: true,
    callbacks: {
      open: function () {}
    }
  });
  $(".mfp-ajax").on("click", function (e) {
    e.preventDefault();
    var $t = $(this),
      myEl = "#" + $t.data("div"),
      href = $t.attr("href");
    $.get(href, function (data) {
      var result = $(data).find(myEl);
      console.log(result);
      $.magnificPopup.open({
        items: {
          src: result
        },
        type: "inline"
      }, 0)
    }, "html")
  });
  theme.lazySections()
});