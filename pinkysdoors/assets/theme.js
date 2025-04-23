window.theme = window.theme || {};

// var app = {
//   isAppleDevice: function() {
//     if (navigator.userAgent.match(/(iPhone|iPod|iPad)/) != null) {
//       return true;
//     }
//     return false;
//   }
// }

var waitingForVariants = false;

function Utils() {

}

String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};

Utils.prototype = {
  constructor: Utils,
  isElementInView: function (element, fullyInView) {
    var offset = 100;
    var pageTop = $(window).scrollTop();
    var pageBottom = pageTop + $(window).height();
    var elementTop = $(element).offset().top;
    var elementBottom = elementTop + $(element).height() ;

    if (fullyInView === true) {
      return ((pageTop < elementTop) && (pageBottom > elementBottom));
    } else {
      return ((elementTop <= pageBottom) && (elementBottom >= pageTop));
    }
  }
};

var Utils = new Utils();

var arrowPrev = '<button type="button" class="slick-prev"><svg aria-hidden="true" focusable="false" role="presentation" viewBox="0 0 284.49 498.98"><path class="cls-1" d="M437.67 129.51a35 35 0 0 1 24.75 59.75L272.67 379l189.75 189.74a35 35 0 1 1-49.5 49.5L198.43 403.75a35 35 0 0 1 0-49.5l214.49-214.49a34.89 34.89 0 0 1 24.75-10.25z" transform="translate(-188.18 -129.51)"/></svg></button>',
    arrowNext = '<button type="button" class="slick-next"><svg aria-hidden="true" focusable="false" role="presentation"  viewBox="0 0 284.49 498.98"><path class="cls-1" d="M223.18 628.49a35 35 0 0 1-24.75-59.75L388.17 379 198.43 189.26a35 35 0 0 1 49.5-49.5l214.49 214.49a35 35 0 0 1 0 49.5L247.93 618.24a34.89 34.89 0 0 1-24.75 10.25z" transform="translate(-188.18 -129.51)"/></svg></button>',
    starIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 15.68 14.91"><g data-name="Layer 2"><path fill="#f15d52" stroke="#f15d52" stroke-miterlimit="10" d="M7.84 1.13l2.09 4.24 4.67.67-3.38 3.3.8 4.65-4.18-2.19-4.18 2.19.8-4.65-3.39-3.3 4.68-.67 2.09-4.24z" data-name="Layer 1"/></g></svg>',
    starIconInner = '<g data-name="Layer 2"><path fill="#f15d52" stroke="#f15d52" stroke-miterlimit="10" d="M7.84 1.13l2.09 4.24 4.67.67-3.38 3.3.8 4.65-4.18-2.19-4.18 2.19.8-4.65-3.39-3.3 4.68-.67 2.09-4.24z" data-name="Layer 1"/></g>',
    headerHeightDesktop = 86,
    headerHeightMobile = 75,
    specialOrder = false;

var currentVariantLength = 0,
    currentVariantHeight = 0,
    currentVariantWidth = 0,
    currentVariantWeight = 0;


theme.onCartPage = function() {
  return window.location.href.indexOf("/cart") > -1;
}


/* ================ SLATE ================ */
window.theme = window.theme || {};


theme.Sections = function Sections() {
  this.constructors = {};
  this.instances = [];

  $(document)
  .on('shopify:section:load', this._onSectionLoad.bind(this))
  .on('shopify:section:unload', this._onSectionUnload.bind(this))
  .on('shopify:section:select', this._onSelect.bind(this))
  .on('shopify:section:deselect', this._onDeselect.bind(this))
  .on('shopify:block:select', this._onBlockSelect.bind(this))
  .on('shopify:block:deselect', this._onBlockDeselect.bind(this));
};

theme.Sections.prototype = _.assignIn({}, theme.Sections.prototype, {
  _createInstance: function(container, constructor) {
    var $container = $(container);
    var id = $container.attr('data-section-id');
    var type = $container.attr('data-section-type');

    constructor = constructor || this.constructors[type];

    if (_.isUndefined(constructor)) {
      return;
    }

    var instance = _.assignIn(new constructor(container), {
      id: id,
      type: type,
      container: container
    });

    this.instances.push(instance);
  },

  _onSectionLoad: function(evt) {
    var container = $('[data-section-id]', evt.target)[0];
    if (container) {
      this._createInstance(container);
    }
  },

  _onSectionUnload: function(evt) {
    this.instances = _.filter(this.instances, function(instance) {
      var isEventInstance = instance.id === evt.detail.sectionId;

      if (isEventInstance) {
        if (_.isFunction(instance.onUnload)) {
          instance.onUnload(evt);
        }
      }

      return !isEventInstance;
    });
  },

  _onSelect: function(evt) {
    // eslint-disable-next-line no-shadow
    var instance = _.find(this.instances, function(instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (!_.isUndefined(instance) && _.isFunction(instance.onSelect)) {
      instance.onSelect(evt);
    }
  },

  _onDeselect: function(evt) {
    // eslint-disable-next-line no-shadow
    var instance = _.find(this.instances, function(instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (!_.isUndefined(instance) && _.isFunction(instance.onDeselect)) {
      instance.onDeselect(evt);
    }
  },

  _onBlockSelect: function(evt) {
    // eslint-disable-next-line no-shadow
    var instance = _.find(this.instances, function(instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (!_.isUndefined(instance) && _.isFunction(instance.onBlockSelect)) {
      instance.onBlockSelect(evt);
    }
  },

  _onBlockDeselect: function(evt) {
    // eslint-disable-next-line no-shadow
    var instance = _.find(this.instances, function(instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (!_.isUndefined(instance) && _.isFunction(instance.onBlockDeselect)) {
      instance.onBlockDeselect(evt);
    }
  },

  register: function(type, constructor) {
    this.constructors[type] = constructor;

    $('[data-section-type=' + type + ']').each(
      function(index, container) {
        this._createInstance(container, constructor);
      }.bind(this)
    );
  }
});

window.slate = window.slate || {};

/**
 * Slate utilities
 * -----------------------------------------------------------------------------
 * A collection of useful utilities to help build your theme
 *
 *
 * @namespace utils
 */

slate.utils = {
  /**
   * Get the query params in a Url
   * Ex
   * https://mysite.com/search?q=noodles&b
   * getParameterByName('q') = "noodles"
   * getParameterByName('b') = "" (empty value)
   * getParameterByName('test') = null (absent)
   */
  getParameterByName: function(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  },

  keyboardKeys: {
    TAB: 9,
    ENTER: 13,
    ESCAPE: 27,
    LEFTARROW: 37,
    RIGHTARROW: 39
  }
};

window.slate = window.slate || {};

/**
 * iFrames
 * -----------------------------------------------------------------------------
 * Wrap videos in div to force responsive layout.
 *
 * @namespace iframes
 */

slate.rte = {
  /**
   * Wrap tables in a container div to make them scrollable when needed
   *
   * @param {object} options - Options to be used
   * @param {jquery} options.$tables - jquery object(s) of the table(s) to wrap
   * @param {string} options.tableWrapperClass - table wrapper class name
   */
  wrapTable: function(options) {
    options.$tables.wrap(
      '<div class="' + options.tableWrapperClass + '"></div>'
    );
  },

  /**
   * Wrap iframes in a container div to make them responsive
   *
   * @param {object} options - Options to be used
   * @param {jquery} options.$iframes - jquery object(s) of the iframe(s) to wrap
   * @param {string} options.iframeWrapperClass - class name used on the wrapping div
   */
  wrapIframe: function(options) {
    options.$iframes.each(function() {
      // Add wrapper to make video responsive
      $(this).wrap('<div class="' + options.iframeWrapperClass + '"></div>');

      // Re-set the src attribute on each iframe after page load
      // for Chrome's "incorrect iFrame content on 'back'" bug.
      // https://code.google.com/p/chromium/issues/detail?id=395791
      // Need to specifically target video and admin bar
      this.src = this.src;
    });
  }
};

window.slate = window.slate || {};

/**
 * A11y Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help make your theme more accessible
 * to users with visual impairments.
 *
 *
 * @namespace a11y
 */

slate.a11y = {
  /**
   * For use when focus shifts to a container rather than a link
   * eg for In-page links, after scroll, focus shifts to content area so that
   * next `tab` is where user expects if focusing a link, just $link.focus();
   *
   * @param {JQuery} $element - The element to be acted upon
   */
  pageLinkFocus: function($element) {
    var focusClass = 'js-focus-hidden';

    $element
    .first()
    .attr('tabIndex', '-1')
    .focus()
    .addClass(focusClass)
    .one('blur', callback);

    function callback() {
      $element
      .first()
      .removeClass(focusClass)
      .removeAttr('tabindex');
    }
  },

  /**
   * If there's a hash in the url, focus the appropriate element
   */
  focusHash: function() {
    var hash = window.location.hash;

    // is there a hash in the url? is it an element on the page?
    if (hash && document.getElementById(hash.slice(1))) {
      this.pageLinkFocus($(hash));
    }
  },

  /**
   * When an in-page (url w/hash) link is clicked, focus the appropriate element
   */

  /**
   * Traps the focus in a particular container
   *
   * @param {object} options - Options to be used
   * @param {jQuery} options.$container - Container to trap focus within
   * @param {jQuery} options.$elementToFocus - Element to be focused when focus leaves container
   * @param {string} options.namespace - Namespace used for new focus event handler
   */
  trapFocus: function(options) {
    var eventsName = {
      focusin: options.namespace ? 'focusin.' + options.namespace : 'focusin',
      focusout: options.namespace
      ? 'focusout.' + options.namespace
      : 'focusout',
      keydown: options.namespace
      ? 'keydown.' + options.namespace
      : 'keydown.handleFocus'
    };

    /**
     * Get every possible visible focusable element
     */
    var $focusableElements = options.$container.find(
      $(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex^="-"])'
      ).filter(':visible')
    );
    var firstFocusable = $focusableElements[0];
    var lastFocusable = $focusableElements[$focusableElements.length - 1];

    if (!options.$elementToFocus) {
      options.$elementToFocus = options.$container;
    }

    function _manageFocus(evt) {
      if (evt.keyCode !== slate.utils.keyboardKeys.TAB) return;

      /**
       * On the last focusable element and tab forward,
       * focus the first element.
       */
      if (evt.target === lastFocusable && !evt.shiftKey) {
        evt.preventDefault();
        firstFocusable.focus();
      }
      /**
       * On the first focusable element and tab backward,
       * focus the last element.
       */
      if (evt.target === firstFocusable && evt.shiftKey) {
        evt.preventDefault();
        lastFocusable.focus();
      }
    }

    options.$container.attr('tabindex', '-1');
    options.$elementToFocus.focus();

    $(document).off('focusin');

    $(document).on(eventsName.focusout, function() {
      $(document).off(eventsName.keydown);
    });

    $(document).on(eventsName.focusin, function(evt) {
      if (evt.target !== lastFocusable && evt.target !== firstFocusable) return;

      $(document).on(eventsName.keydown, function(evt) {
        _manageFocus(evt);
      });
    });
  },

  /**
   * Removes the trap of focus in a particular container
   *
   * @param {object} options - Options to be used
   * @param {jQuery} options.$container - Container to trap focus within
   * @param {string} options.namespace - Namespace used for new focus event handler
   */
  removeTrapFocus: function(options) {
    var eventName = options.namespace
    ? 'focusin.' + options.namespace
    : 'focusin';

    if (options.$container && options.$container.length) {
      options.$container.removeAttr('tabindex');
    }

    $(document).off(eventName);
  },

  /**
   * Add aria-describedby attribute to external and new window links
   *
   * @param {object} options - Options to be used
   * @param {object} options.messages - Custom messages to be used
   * @param {jQuery} options.$links - Specific links to be targeted
   */
  accessibleLinks: function(options) {
    var body = document.querySelector('body');

    var idSelectors = {
      newWindow: 'a11y-new-window-message',
      external: 'a11y-external-message',
      newWindowExternal: 'a11y-new-window-external-message'
    };

    /*if (options.$links === undefined || !options.$links.jquery) {
      options.$links = $('a[href]:not([aria-describedby])');
    }*/

    function generateHTML(customMessages) {
      if (typeof customMessages !== 'object') {
        customMessages = {};
      }

      var messages = $.extend(
        {
          newWindow: 'Opens in a new window.',
          external: 'Opens external website.',
          newWindowExternal: 'Opens external website in a new window.'
        },
        customMessages
      );

      var container = document.createElement('ul');
      var htmlMessages = '';

      for (var message in messages) {
        htmlMessages +=
          '<li id=' + idSelectors[message] + '>' + messages[message] + '</li>';
      }

      container.setAttribute('hidden', true);
      container.innerHTML = htmlMessages;

      body.appendChild(container);
    }

    function _externalSite($link) {
      var hostname = window.location.hostname;

      return $link[0].hostname !== hostname;
    }

    $.each(options.$links, function() {
      var $link = $(this);
      var target = $link.attr('target');
      var rel = $link.attr('rel');
      var isExternal = _externalSite($link);
      var isTargetBlank = target === '_blank';

      if (isExternal) {
        $link.attr('aria-describedby', idSelectors.external);
      }
      if (isTargetBlank) {
        if (rel === undefined || rel.indexOf('noopener') === -1) {
          $link.attr('rel', function(i, val) {
            var relValue = val === undefined ? '' : val + ' ';
            return relValue + 'noopener';
          });
        }
        $link.attr('aria-describedby', idSelectors.newWindow);
      }
      if (isExternal && isTargetBlank) {
        $link.attr('aria-describedby', idSelectors.newWindowExternal);
      }
    });

    generateHTML(options.messages);
  }
};


/**
 * Currency Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help with currency formatting
 *
 * Current contents
 * - formatMoney - Takes an amount in cents and returns it as a formatted dollar value.
 *
 * Alternatives
 * - Accounting.js - http://openexchangerates.github.io/accounting.js/
 *
 */

theme.Currency = (function() {
  var moneyFormat = '${{amount}}'; // eslint-disable-line camelcase

  function formatMoney(cents, format) {
    if (typeof cents === 'string') {
      cents = cents.replace('.', '');
    }
    var value = '';
    var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    var formatString = format || moneyFormat;

    function formatWithDelimiters(number, precision, thousands, decimal) {
      thousands = thousands || ',';
      decimal = decimal || '.';

      if (isNaN(number) || number === null) {
        return 0;
      }

      number = (number / 100.0).toFixed(precision);

      var parts = number.split('.');
      var dollarsAmount = parts[0].replace(
        /(\d)(?=(\d\d\d)+(?!\d))/g,
        '$1' + thousands
      );
      var centsAmount = parts[1] ? decimal + parts[1] : '';

      return dollarsAmount + centsAmount;
    }

    switch (formatString.match(placeholderRegex)[1]) {
      case 'amount':
        value = formatWithDelimiters(cents, 2);
        break;
      case 'amount_no_decimals':
        value = formatWithDelimiters(cents, 0);
        break;
      case 'amount_with_comma_separator':
        value = formatWithDelimiters(cents, 2, '.', ',');
        break;
      case 'amount_no_decimals_with_comma_separator':
        value = formatWithDelimiters(cents, 0, '.', ',');
        break;
      case 'amount_no_decimals_with_space_separator':
        value = formatWithDelimiters(cents, 0, ' ');
        break;
      case 'amount_with_apostrophe_separator':
        value = formatWithDelimiters(cents, 2, "'");
        break;
    }

    return formatString.replace(placeholderRegex, value);
  }

  return {
    formatMoney: formatMoney
  };
})();



/* ================ GLOBAL ================ */
/*============================================================================
  Drawer modules
==============================================================================*/
theme.Drawers = (function() {
  function Drawer(id, position, options) {
    var defaults = {
      close: '.js-drawer-close',
      open: '.js-drawer-open-' + position,
      openClass: 'js-drawer-open',
      dirOpenClass: 'js-drawer-open-' + position
    };

    this.nodes = {
      $parent: $('html').add('body'),
      $page: $('#PageContainer')
    };

    this.config = $.extend(defaults, options);
    this.position = position;

    this.$drawer = $('#' + id);

    if (!this.$drawer.length) {
      return false;
    }

    this.drawerIsOpen = false;
    this.init();
  }

  Drawer.prototype.init = function() {
    $(this.config.open).on('click', $.proxy(this.open, this));
    this.$drawer.on('click', this.config.close, $.proxy(this.close, this));
  };

  Drawer.prototype.open = function(evt) {
    // Keep track if drawer was opened from a click, or called by another function
    var externalCall = false;

    // Prevent following href if link is clicked
    if (evt) {
      evt.preventDefault();
    } else {
      externalCall = true;
    }

    // Without this, the drawer opens, the click event bubbles up to nodes.$page
    // which closes the drawer.
    if (evt && evt.stopPropagation) {
      evt.stopPropagation();
      // save the source of the click, we'll focus to this on close
      this.$activeSource = $(evt.currentTarget);
    }

    if (this.drawerIsOpen && !externalCall) {
      return this.close();
    }

    // Add is-transitioning class to moved elements on open so drawer can have
    // transition for close animation
    this.$drawer.prepareTransition();

    this.nodes.$parent.addClass(
      this.config.openClass + ' ' + this.config.dirOpenClass
    );
    this.drawerIsOpen = true;

    // Set focus on drawer
    slate.a11y.trapFocus({
      $container: this.$drawer,
      namespace: 'drawer_focus'
    });

    // Run function when draw opens if set
    if (
      this.config.onDrawerOpen &&
      typeof this.config.onDrawerOpen === 'function'
    ) {
      if (!externalCall) {
        this.config.onDrawerOpen();
      }
    }

    if (this.$activeSource && this.$activeSource.attr('aria-expanded')) {
      this.$activeSource.attr('aria-expanded', 'true');
    }

    this.bindEvents();

    return this;
  };

  Drawer.prototype.close = function() {
    if (!this.drawerIsOpen) {
      // don't close a closed drawer
      return;
    }

    // deselect any focused form elements
    $(document.activeElement).trigger('blur');

    // Ensure closing transition is applied to moved elements, like the nav
    this.$drawer.prepareTransition();

    this.nodes.$parent.removeClass(
      this.config.dirOpenClass + ' ' + this.config.openClass
    );

    if (this.$activeSource && this.$activeSource.attr('aria-expanded')) {
      this.$activeSource.attr('aria-expanded', 'false');
    }

    this.drawerIsOpen = false;

    // Remove focus on drawer
    slate.a11y.removeTrapFocus({
      $container: this.$drawer,
      namespace: 'drawer_focus'
    });

    this.unbindEvents();

    // Run function when draw closes if set
    if (
      this.config.onDrawerClose &&
      typeof this.config.onDrawerClose === 'function'
    ) {
      this.config.onDrawerClose();
    }
  };

  Drawer.prototype.bindEvents = function() {
    this.nodes.$parent.on(
      'keyup.drawer',
      $.proxy(function(evt) {
        // close on 'esc' keypress
        if (evt.keyCode === 27) {
          this.close();
          return false;
        } else {
          return true;
        }
      }, this)
    );

    // Lock scrolling on mobile
    this.nodes.$page.on('touchmove.drawer', function() {
      return false;
    });

    this.nodes.$page.on(
      'click.drawer',
      $.proxy(function() {
        this.close();
        return false;
      }, this)
    );
  };

  Drawer.prototype.unbindEvents = function() {
    this.nodes.$page.off('.drawer');
    this.nodes.$parent.off('.drawer');
  };

  return Drawer;
})();


/* ================ MODULES ================ */
window.theme = window.theme || {};

theme.Header = (function() {
  var selectors = {
    body: 'body',
    multicurrencySelector: '[data-currency-selector]',
    navigation: '#AccessibleNav',
    mainContent: 	'.main-content',
    announcementBar: 	'.announcement-bar',
    fullHeader: '#shopify-section-header',
    siteNavHasDropdown: '[data-has-dropdowns]',
    siteNavChildLinks: '.site-nav__child-link',
    siteNavActiveDropdown: '.site-nav--active-dropdown',
    siteNavHasCenteredDropdown: '.site-nav--has-centered-dropdown',
    siteNavCenteredDropdown: '.site-nav__dropdown--centered',
    siteNavLinkMain: '.site-nav__link--main',
    siteNavChildLink: '.site-nav__link--last',
    siteNavDropdown: '.site-nav__dropdown',
    siteHeader: '.site-header'
  };

  var config = {
    activeClass: 'site-nav--active-dropdown',
    childLinkClass: 'site-nav__child-link',
    rightDropdownClass: 'site-nav__dropdown--right',
    leftDropdownClass: 'site-nav__dropdown--left'
  };

  var cache = {};
  var $headerHeight = $(selectors.fullHeader).outerHeight();

  function init() {
    cacheSelectors();
    styleDropdowns($(selectors.siteNavHasDropdown));
    positionFullWidthDropdowns();

    $(".site-nav__label:contains('Cold')").html(function(_, html) {
      return html.replace(/(Cold)/g, '<span class="blue">$1</span>');
    });

    $(".mobile-nav__label:contains('Cold')").html(function(_, html) {
      return html.replace(/(Cold)/g, '<span class="blue">$1</span>');
    });

    cache.$parents.on('click.siteNav', function() {
      var $el = $(this);
      $el.hasClass(config.activeClass) ? hideDropdown($el) : showDropdown($el);
    });

    // check when we're leaving a dropdown and close the active dropdown
    $(selectors.siteNavChildLink).on('focusout.siteNav', function() {
      setTimeout(function() {
        if (
          $(document.activeElement).hasClass(config.childLinkClass) ||
          !cache.$activeDropdown.length
        ) {
          return;
        }

        hideDropdown(cache.$activeDropdown);
      });
    });
    setHeaderHeight();

    $('.site-header__cart').on('click',function(e) {
      e.preventDefault();
      $('.cart-ajax').toggleClass('cart-ajax--show');
      $(this).toggleClass('cart-ajax--visible');
      e.stopPropagation();
    });

    $(document).on("click", function(event){
      if(!$(event.target).closest(".cart-ajax--show").length){
        $(".cart-ajax").removeClass('cart-ajax--show');
        $('.site-header__cart').removeClass('cart-ajax--visible');
      }
    });


    $(document).on('click','.item-quantity__increment',function(z) {
      z.preventDefault();
      var i = parseInt($(this).siblings('.cart-ajax__quantity-number').val()),
          t = $(this).siblings('.qty-step-count'),
          r = $(this).closest('.qty-step'),
          e = $(this).closest('.cart-ajax__row').attr('data-inventory'),
          v = $(this).closest('.cart-ajax__row').attr('data-variant'),
          u = $(this).data('qty-change'),
          $this = $(this);
      if(u == 'dec') {
        i--;
        theme.updateItem(v, i);
      } else {
        if(i < parseInt(v)) {
          i++;
          theme.incrementCartUp($this);
        } 
      }



    });

    $('.site-nav__link').hover(function() {
      if($(this).data('image')!=undefined) {
        var newImg = $(this).data('image');
        $('.mega-menu__image').css('background-image','url('+newImg+')');
      } else {
        $('.mega-menu__image').css('background-image','none');
      }
    });

    $(document).on('click','.cart-ajax__remove',function(e) {
      e.preventDefault();
      var i = $(this).closest('.cart-ajax__row').data('variant');
      theme.removeSideCartItem(i);
    });


    // close dropdowns when on top level nav
    cache.$topLevel.on('focus.siteNav', function() {
      if (cache.$activeDropdown.length) {
        hideDropdown(cache.$activeDropdown);
      }
    });

    cache.$subMenuLinks.on('click.siteNav', function(evt) {
      // Prevent click on body from firing instead of link
      evt.stopImmediatePropagation();
    });

    $(selectors.multicurrencySelector).on('change', function() {
      $(this)
      .parents('form')
      .submit();
    });

    $(window).resize(
      $.debounce(50, function() {
        styleDropdowns($(selectors.siteNavHasDropdown));
        positionFullWidthDropdowns();
      })
    );
  }
  function setHeaderHeight() {

    //$(selectors.announcementBar).css('height',$(selectors.announcementBar).outerHeight()).attr('data-original-height',$(selectors.announcementBar).outerHeight());
    $(selectors.mainContent).css('padding-top',$headerHeight);
    if($('body').hasClass('template-index') && theme.isMobile() == false) {
      //$(selectors.mainContent).css('margin-top','55px');
    }
    if($(selectors.pageHero).length <= 0 && theme.isMobile() == false && $(selectors.productPage).length <=0  ) {
      //$(selectors.mainContent).css('margin-top','55px');
    }
    if(theme.isMobile() && $('body').hasClass('template-product')) {
      $('.product-form-product-template').addClass('product-form-fixed')
    }
  }

  $(window).on('resize', function(evt) {
    setHeaderHeight();
  });

  function cacheSelectors() {
    cache = {
      $nav: $(selectors.navigation),
      $topLevel: $(selectors.siteNavLinkMain),
      $parents: $(selectors.navigation).find(selectors.siteNavHasDropdown),
      $subMenuLinks: $(selectors.siteNavChildLinks),
      $activeDropdown: $(selectors.siteNavActiveDropdown),
      $siteHeader: $(selectors.siteHeader)
    };
  }

  function showDropdown($el) {
    $el.addClass(config.activeClass);

    // close open dropdowns
    if (cache.$activeDropdown.length) {
      hideDropdown(cache.$activeDropdown);
    }

    cache.$activeDropdown = $el;

    // set expanded on open dropdown
    $el.find(selectors.siteNavLinkMain).attr('aria-expanded', 'true');

    setTimeout(function() {
      $(window).on('keyup.siteNav', function(evt) {
        if (evt.keyCode === 27) {
          hideDropdown($el);
        }
      });

      $(selectors.body).on('click.siteNav', function() {
        hideDropdown($el);
      });
    }, 250);
  }

  function hideDropdown($el) {
    // remove aria on open dropdown
    $el.find(selectors.siteNavLinkMain).attr('aria-expanded', 'false');
    $el.removeClass(config.activeClass);

    // reset active dropdown
    cache.$activeDropdown = $(selectors.siteNavActiveDropdown);

    $(selectors.body).off('click.siteNav');
    $(window).off('keyup.siteNav');
  }

  function styleDropdowns($dropdownListItems) {
    $dropdownListItems.each(function() {
      var $dropdownLi = $(this).find(selectors.siteNavDropdown);
      if (!$dropdownLi.length) {
        return;
      }
      var isRightOfLogo =
          Math.ceil($(this).offset().left) >
          Math.floor(cache.$siteHeader.outerWidth()) / 2
      ? true
      : false;
      if (isRightOfLogo) {
        $dropdownLi
        .removeClass(config.leftDropdownClass)
        .addClass(config.rightDropdownClass);
      } else {
        $dropdownLi
        .removeClass(config.rightDropdownClass)
        .addClass(config.leftDropdownClass);
      }
    });
  }

  function positionFullWidthDropdowns() {
    var $listWithCenteredDropdown = $(selectors.siteNavHasCenteredDropdown);

    $listWithCenteredDropdown.each(function() {
      var $hasCenteredDropdown = $(this);
      var $fullWidthDropdown = $hasCenteredDropdown.find(
        selectors.siteNavCenteredDropdown
      );

      var fullWidthDropdownOffset = $hasCenteredDropdown.position().top + 41;
      //$fullWidthDropdown.css('top', fullWidthDropdownOffset);
    });
  }

  function unload() {
    $(window).off('.siteNav');
    cache.$parents.off('.siteNav');
    cache.$subMenuLinks.off('.siteNav');
    cache.$topLevel.off('.siteNav');
    $(selectors.siteNavChildLink).off('.siteNav');
    $(selectors.body).off('.siteNav');
  }

  return {
    init: init,
    unload: unload
  };
})();

window.theme = window.theme || {};

theme.MobileNav = (function() {
  var classes = {
    mobileNavOpenIcon: 'mobile-nav--open',
    mobileNavCloseIcon: 'mobile-nav--close',
    navLinkWrapper: 'mobile-nav__item',
    navLink: 'mobile-nav__link',
    subNavLink: 'mobile-nav__sublist-link',
    return: 'mobile-nav__return-btn',
    subNavActive: 'is-active',
    subNavClosing: 'is-closing',
    navOpen: 'js-menu--is-open',
    subNavShowing: 'sub-nav--is-open',
    thirdNavShowing: 'third-nav--is-open',
    subNavToggleBtn: 'js-toggle-submenu'
  };
  var cache = {};
  var isTransitioning;
  var $activeSubNav;
  var $activeTrigger;
  var menuLevel = 1;
  // Breakpoints from src/stylesheets/global/variables.scss.liquid
  var mediaQuerySmall = 'screen and (max-width: 749px)';

  function init() {
    cacheSelectors();

    cache.$mobileNavToggle.on('click', toggleMobileNav);
    cache.$subNavToggleBtn.on('click.subNav', toggleSubNav);

    $( ".mobile-nav__label:contains('Sale'),.mobile-nav__label:contains('Clearance')" ).addClass('pink');

    // Close mobile nav when unmatching mobile breakpoint
    enquire.register(mediaQuerySmall, {
      unmatch: function() {
        if (cache.$mobileNavContainer.hasClass(classes.navOpen)) {
          closeMobileNav();
        }
      }
    });
  }

  function toggleMobileNav() {
    if (cache.$mobileNavToggle.hasClass(classes.mobileNavCloseIcon)) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  }

  function cacheSelectors() {
    cache = {
      $pageContainer: $('#PageContainer'),
      $siteHeader: $('.site-header'),
      $mobileNavToggle: $('.js-mobile-nav-toggle'),
      $mobileNavContainer: $('.mobile-nav-wrapper'),
      $mobileNav: $('#MobileNav'),
      $sectionHeader: $('#shopify-section-header'),
      $subNavToggleBtn: $('.' + classes.subNavToggleBtn)
    };
  }

  function openMobileNav() {

    $('body').addClass('overflow-hidden');

    var translateHeaderHeight = cache.$siteHeader.outerHeight();

    cache.$mobileNavContainer.prepareTransition().addClass(classes.navOpen);


    var startupHeight = cache.$mobileNav.outerHeight() ;
    /*cache.$mobileNavContainer.css({
      height: startupHeight
    });*/

    cache.$mobileNavContainer.css({
      transform: 'translateY(' + translateHeaderHeight + 'px)'
    });

    cache.$pageContainer.css({
      opacity: 0.1,
      transform: 'translate3d(0, ' + cache.$mobileNavContainer[0].scrollHeight + 'px, 0)'
    });

    slate.a11y.trapFocus({
      $container: cache.$sectionHeader,
      $elementToFocus: cache.$mobileNavToggle,
      namespace: 'navFocus'
    });

    cache.$mobileNavToggle
    .addClass(classes.mobileNavCloseIcon)
    .removeClass(classes.mobileNavOpenIcon)
    .attr('aria-expanded', true)
    .focus();

    $(window).resize();



    // close on escape
    $(window).on('keyup.mobileNav', function(evt) {
      if (evt.which === 27) {
        closeMobileNav();
      }
    });

    goToSubnav();

        $('body').addClass('no-scroll');
    $('#shopify-section-header').addClass('menu--open');

  }

  function closeMobileNav() {

    // $('body').addClass('overflow-hidden');
        $('body').removeClass('no-scroll');
    $('#shopify-section-header').removeClass('menu--open');
    cache.$mobileNavContainer.prepareTransition().removeClass(classes.navOpen);



    cache.$mobileNavContainer.css({
      transform: 'translateY(-100%)'
    });

    cache.$pageContainer.removeAttr('style');

    slate.a11y.trapFocus({
      $container: $('html'),
      $elementToFocus: $('body')
    });

    cache.$mobileNavContainer.one(
      'TransitionEnd.navToggle webkitTransitionEnd.navToggle transitionend.navToggle oTransitionEnd.navToggle',
      function() {
        slate.a11y.removeTrapFocus({
          $container: cache.$mobileNav,
          namespace: 'navFocus'
        });
      }
    );

    cache.$mobileNavToggle
    .addClass(classes.mobileNavOpenIcon)
    .removeClass(classes.mobileNavCloseIcon)
    .attr('aria-expanded', false)
    .blur();

    $(window).off('keyup.mobileNav');

    //goToSubnav();

    scrollTo(0, 0);
  }

  function toggleSubNav(evt) {
    if (isTransitioning) {
      return;
    }

    var $toggleBtn = $(evt.currentTarget);
    var isReturn = $toggleBtn.hasClass(classes.return);
    isTransitioning = true;

    if (isReturn) {
      // Close all subnavs by removing active class on buttons
      $(
        '.' + classes.subNavToggleBtn + '[data-level="' + (menuLevel - 1) + '"]'
      ).removeClass(classes.subNavActive);

      if ($activeTrigger && $activeTrigger.length) {
        $activeTrigger.removeClass(classes.subNavActive);
      }
    } else {
      $toggleBtn.addClass(classes.subNavActive);
    }

    $activeTrigger = $toggleBtn;

    goToSubnav($toggleBtn.data('target'));
  }

  function goToSubnav(target) {
    /*eslint-disable shopify/jquery-dollar-sign-reference */

    var $targetMenu = target
    ? $('.mobile-nav__dropdown[data-parent="' + target + '"]')
    : cache.$mobileNav;

    menuLevel = $targetMenu.data('level') ? $targetMenu.data('level') : 1;

    if ($activeSubNav && $activeSubNav.length) {
      $activeSubNav.addClass(classes.subNavClosing);
    }

    $activeSubNav = $targetMenu;

    /*eslint-enable shopify/jquery-dollar-sign-reference */

    var translateMenuHeight = $targetMenu.outerHeight() + $('.mobile-nav__secondary-nav__wrapper').outerHeight();
    var newSubnavHeight = $targetMenu.outerHeight();


    /*
    if(!target) {
      newSubnavHeight = $targetMenu.outerHeight() + $('.mobile-nav__secondary-nav__wrapper').outerHeight();
      $('.mobile-nav__secondary-nav__wrapper').show();
    } else {
      $('.mobile-nav__secondary-nav__wrapper').hide();
    }
    */

    var openNavClass =
        menuLevel > 2 ? classes.thirdNavShowing : classes.subNavShowing;

    cache.$mobileNavContainer
    .removeClass(classes.thirdNavShowing)
    .addClass(openNavClass);

  

    if (!target) {
      // Show top level nav
      cache.$mobileNavContainer
      .removeClass(classes.thirdNavShowing)
      .removeClass(classes.subNavShowing);
    }

    /* if going back to first subnav, focus is on whole header */
    var $container = menuLevel === 1 ? cache.$sectionHeader : $targetMenu;

    var $menuTitle = $targetMenu.find('[data-menu-title=' + menuLevel + ']');
    var $elementToFocus = $menuTitle ? $menuTitle : $targetMenu;

    // Focusing an item in the subnav early forces element into view and breaks the animation.
    cache.$mobileNavContainer.one(
      'TransitionEnd.subnavToggle webkitTransitionEnd.subnavToggle transitionend.subnavToggle oTransitionEnd.subnavToggle',
      function() {
        slate.a11y.trapFocus({
          $container: $container,
          $elementToFocus: $elementToFocus,
          namespace: 'subNavFocus'
        });

        cache.$mobileNavContainer.off('.subnavToggle');
        isTransitioning = false;
      }
    );

    // Match height of subnav

    cache.$pageContainer.css({
      transform: 'translateY(' + newSubnavHeight + 'px)'
    });


    $activeSubNav.removeClass(classes.subNavClosing);
  }

  return {
    init: init,
    closeMobileNav: closeMobileNav
  };
})(jQuery);

window.theme = window.theme || {};

theme.Search = (function() {
  var selectors = {
    search: '.search',
    searchSubmit: '.search__submit',
    searchInput: '.search__input',

    siteHeader: '.site-header',
    siteHeaderSearchToggle: '.site-header__search-toggle',
    siteHeaderSearch: '.site-header__search',

    searchDrawer: '.search-bar',
    searchDrawerInput: '.search-bar__input',

    searchHeader: '.search-header',
    searchHeaderInput: '.search-header__input',
    searchHeaderSubmit: '.search-header__submit',

    searchResultSubmit: '#SearchResultSubmit',
    searchResultInput: '#SearchInput',
    searchResultMessage: '[data-search-error-message]',

    mobileNavWrapper: '.mobile-nav-wrapper'
  };

  var classes = {
    focus: 'search--focus',
    hidden: 'hide',
    mobileNavIsOpen: 'js-menu--is-open'
  };

  function init() {
    if (!$(selectors.siteHeader).length) {
      return;
    }

    this.$searchResultInput = $(selectors.searchResultInput);
    this.$searchErrorMessage = $(selectors.searchResultMessage);

    initDrawer();

    var isSearchPage =
        slate.utils.getParameterByName('q') !== null &&
        window.location.pathname === '/search';

    if (isSearchPage) {
      validateSearchResultForm.call(this);
    }

    $(selectors.searchResultSubmit).on(
      'click',
      validateSearchResultForm.bind(this)
    );

    $(selectors.searchHeaderInput)
    .add(selectors.searchHeaderSubmit)
    .on('focus blur', function() {
      $(selectors.searchHeader).toggleClass(classes.focus);
    });

    $(selectors.siteHeaderSearchToggle).on('click', function() {
      var searchHeight = $(selectors.siteHeader).outerHeight();
      var searchOffset = $(selectors.siteHeader).offset().top - searchHeight;
      //$(selectors.searchDrawer).show();

      $(selectors.searchDrawer + ' .search-bar__flex').height(searchHeight);
      $(selectors.searchDrawer).css({
        top: '0px'
      });

    });

    $('.search-page__heading').on('click',function(e) {
      e.preventDefault();
      var myTab = '.'+$(this).data('filter-by');
      $('.search-page__heading').removeClass('active');
      $(this).addClass('active');
      $('.search-page__tab').hide();
      $(myTab).fadeIn();
    });
    $('.search-page__heading').eq(0).trigger('click');


    $('.search-bar__close').on('click',function() {
      //$(selectors.siteHeaderSearchToggle).trigger('click');
      //$(selectors.searchDrawer).fadeOut();
    });

  }

  function initDrawer() {
    // Add required classes to HTML
    $('#PageContainer').addClass('drawer-page-content');
    $('.js-drawer-open-top')
    .attr('aria-controls', 'SearchDrawer')
    .attr('aria-expanded', 'false')
    .attr('aria-haspopup', 'dialog');

    theme.SearchDrawer = new theme.Drawers('SearchDrawer', 'top', {
      onDrawerOpen: searchDrawerFocus,
      onDrawerClose: searchDrawerFocusClose
    });
  }

  function searchDrawerFocus() {
    //searchFocus($(selectors.searchDrawerInput));

    //$( "#SearchDrawer .search-bar__input" ).focus();

    if ($(selectors.mobileNavWrapper).hasClass(classes.mobileNavIsOpen)) {
      theme.MobileNav.closeMobileNav();
    }
  }

  function searchFocus($el) {
    $el.focus();
    // set selection range hack for iOS
    $el[0].setSelectionRange(0, $el[0].value.length);
  }

  function searchDrawerFocusClose() {
    $(selectors.siteHeaderSearchToggle).focus();
  }

  /**
   * Remove the aria-attributes and hide the error messages
   */
  function hideErrorMessage() {
    this.$searchErrorMessage.addClass(classes.hidden);
    this.$searchResultInput
    .removeAttr('aria-describedby')
    .removeAttr('aria-invalid');
  }

  /**
   * Add the aria-attributes and show the error messages
   */
  function showErrorMessage() {
    this.$searchErrorMessage.removeClass(classes.hidden);
    this.$searchResultInput
    .attr('aria-describedby', 'error-search-form')
    .attr('aria-invalid', true);
  }

  function validateSearchResultForm(evt) {
    var isInputValueEmpty = this.$searchResultInput.val().trim().length === 0;

    if (!isInputValueEmpty) {
      hideErrorMessage.call(this);
      return;
    }

    if (typeof evt !== 'undefined') {
      evt.preventDefault();
    }

    searchFocus(this.$searchResultInput);
    showErrorMessage.call(this);
  }

  return {
    init: init
  };
})();

(function() {


  var selectors = {
    backButton: '.return-link'
  };

  var $backButton = $(selectors.backButton);

  if (!document.referrer || !$backButton.length || !window.history.length) {
    return;
  }

  $backButton.one('click', function(evt) {
    evt.preventDefault();

    var referrerDomain = urlDomain(document.referrer);
    var shopDomain = urlDomain(window.location.href);

    if (shopDomain === referrerDomain) {
      history.back();
    }

    return false;
  });

  function urlDomain(url) {
    var anchor = document.createElement('a');
    anchor.ref = url;

    return anchor.hostname;
  }
})();

theme.Slideshow = (function() {
  
  this.$slideshow = null;
  var classes = {
    slideshow: 'slideshow',
    slickActiveMobile: 'slick-active-mobile',
    controlsHover: 'slideshow__controls--hover',
    isPaused: 'is-paused'
  };

  var selectors = {
    section: '.shopify-section',
    wrapper: '#SlideshowWrapper-',
    slides: '.slideshow__slide',
    textWrapperMobile: '.slideshow__text-wrap--mobile',
    textContentMobile: '.slideshow__text-content--mobile',
    controls: '.slideshow__controls',
    pauseButton: '.slideshow__pause',
    dots: '.slick-dots',
    arrows: '.slideshow__arrows',
    arrowsMobile: '.slideshow__arrows--mobile',
    arrowLeft: '.slideshow__arrow-left',
    arrowRight: '.slideshow__arrow-right'
  };

  function slideshow(el, sectionId) {
    var $slideshow = (this.$slideshow = $(el));
    this.adaptHeight = this.$slideshow.data('adapt-height');
    this.$wrapper = this.$slideshow.closest(selectors.wrapper + sectionId);
    this.$section = this.$wrapper.closest(selectors.section);
    this.$controls = this.$wrapper.find(selectors.controls);
    this.$arrows = this.$section.find(selectors.arrows);
    this.$arrowsMobile = this.$section.find(selectors.arrowsMobile);
    this.$pause = this.$controls.find(selectors.pauseButton);
    this.$textWrapperMobile = this.$section.find(selectors.textWrapperMobile);

    this.autorotate = this.$slideshow.data('autorotate');
    var randomize = this.$slideshow.data('randomize') ? true : false;
    var autoplaySpeed = this.$slideshow.data('speed');
    var adaptiveHeightSetting = this.$slideshow.data('adaptive-height') ? true : false;
    var loadSlideA11yString = this.$slideshow.data('slide-nav-a11y');
    //     console.log(randomize);
    if(randomize) {
      //$.randomize(selectors.slides);
      var parent = this.$slideshow;
      var divs = parent.children();
      while (divs.length) {
        parent.append(divs.splice(Math.floor(Math.random() * divs.length), 1)[0]);
      }
    }


    var total = $('.slick-slideshow img').length,
        rand = Math.floor( Math.random() * total );

    this.settings = {
      accessibility: true,
      arrows: true,
      dots: true,
      fade: true,
      rows: 0,
      draggable: false,
      adaptiveHeight: false,
      touchThreshold: 20,
      autoplay: this.autorotate,
      autoplaySpeed: autoplaySpeed,
      prevArrow: '<button type="button" class="slick-prev">'+arrowPrev+'</button>',
      nextArrow: '<button type="button" class="slick-next">'+arrowNext+'</button>',
      responsive: [
        {
          breakpoint: 960,
          settings: {
            draggable: true,
            dots: false,
            arrows: false
          }
        }
      ]
    };

    this.$slideshow.on('beforeChange', beforeChange.bind(this));
    this.$slideshow.on('init', slideshowA11ySetup.bind(this));

    // Add class to style mobile dots & show the correct text content for the
    // first slide on mobile when the slideshow initialises
    this.$slideshow.on(
      'init',
      function() {
        this.$mobileDots
        .find('li:first-of-type')
        .addClass(classes.slickActiveMobile);
        this.showMobileText(0);
      }.bind(this)
    );

    // Stop the autorotate when you scroll past the mobile controls, resume when
    // they are scrolled back into view
    if (this.autorotate) {
      $(document).scroll(
        $.debounce(
          250,
          function() {
            if (
              this.$arrowsMobile.offset().top +
              this.$arrowsMobile.outerHeight() <
              window.pageYOffset
            ) {
              $slideshow.slick('slickPause');
            } else if (!this.$pause.hasClass(classes.isPaused)) {
              $slideshow.slick('slickPlay');
            }
          }.bind(this)
        )
      );
    }

    if (this.adaptHeight) {
      this.setSlideshowHeight();
      $(window).resize($.debounce(50, this.setSlideshowHeight.bind(this)));
    }

    this.$slideshow.slick(this.settings);

    if(window.location.href.indexOf("/blogs/news/tagged/") > -1) {
      var currentTag = window.location.href.split('/tagged/')[1];
      var filterClass = '.'+currentTag
      if($('.slideshow__slide'+filterClass).length) {
        this.$slideshow.slick('slickFilter',filterClass);
      }
    }

    // This can't be called when the slick 'init' event fires due to how slick
    // adds a11y features.
    slideshowPostInitA11ySetup.bind(this)();

    this.$arrows.find(selectors.arrowLeft).on('click', function() {
      $slideshow.slick('slickPrev');
    });
    this.$arrows.find(selectors.arrowRight).on('click', function() {
      $slideshow.slick('slickNext');
    });

    this.$pause.on('click', this.togglePause.bind(this));
  }

  function slideshowA11ySetup(event, obj) {
    var $slider = obj.$slider;
    var $list = obj.$list;
    this.$dots = this.$section.find(selectors.dots);
    this.$mobileDots = this.$dots.eq(1);

    // Remove default Slick aria-live attr until slider is focused
    $list.removeAttr('aria-live');

    this.$wrapper.on('keyup', keyboardNavigation.bind(this));
    this.$controls.on('keyup', keyboardNavigation.bind(this));
    this.$textWrapperMobile.on('keyup', keyboardNavigation.bind(this));

    // When an element in the slider is focused
    // pause slideshow and set aria-live.
    this.$wrapper
    .on(
      'focusin',
      function(evt) {
        if (!this.$wrapper.has(evt.target).length) {
          return;
        }

        $list.attr('aria-live', 'polite');
        if (this.autorotate) {
          $slider.slick('slickPause');
        }
      }.bind(this)
    )
    .on(
      'focusout',
      function(evt) {
        if (!this.$wrapper.has(evt.target).length) {
          return;
        }

        $list.removeAttr('aria-live');
        if (this.autorotate) {
          // Only resume playing if the user hasn't paused using the pause
          // button
          if (!this.$pause.is('.is-paused')) {
            $slider.slick('slickPlay');
          }
        }
      }.bind(this)
    );

    // Add arrow key support when focused
    if (this.$dots) {
      this.$dots
      .find('a')
      .each(function() {
        var $dot = $(this);
        $dot.on('click keyup', function(evt) {
          if (
            evt.type === 'keyup' &&
            evt.which !== slate.utils.keyboardKeys.ENTER
          )
            return;

          evt.preventDefault();

          var slideNumber = $(evt.target).data('slide-number');

          $slider.attr('tabindex', -1).slick('slickGoTo', slideNumber);

          if (evt.type === 'keyup') {
            $slider.focus();
          }
        });
      })
      .eq(0)
      .attr('aria-current', 'true');
    }

    this.$controls
    .on('focusin', highlightControls.bind(this))
    .on('focusout', unhighlightControls.bind(this));
  }

  function slideshowPostInitA11ySetup() {
    var $slides = this.$slideshow.find(selectors.slides);

    $slides.removeAttr('role').removeAttr('aria-labelledby');
    this.$dots
    .removeAttr('role')
    .find('li')
    .removeAttr('role')
    .removeAttr('aria-selected')
    .each(function() {
      var $dot = $(this);
      var ariaControls = $dot.attr('aria-controls');
      $dot
      .removeAttr('aria-controls')
      .find('a')
      .attr('aria-controls', ariaControls);
    });
  }

  function beforeChange(event, slick, currentSlide, nextSlide) {
    var $dotLinks = this.$dots.find('a');
    var $mobileDotLinks = this.$mobileDots.find('li');

    $dotLinks
    .removeAttr('aria-current')
    .eq(nextSlide)
    .attr('aria-current', 'true');

    $mobileDotLinks
    .removeClass(classes.slickActiveMobile)
    .eq(nextSlide)
    .addClass(classes.slickActiveMobile);
    this.showMobileText(nextSlide);
  }

  function keyboardNavigation() {
    if (event.keyCode === slate.utils.keyboardKeys.LEFTARROW) {
      this.$slideshow.slick('slickPrev');
    }
    if (event.keyCode === slate.utils.keyboardKeys.RIGHTARROW) {
      this.$slideshow.slick('slickNext');
    }
  }

  function highlightControls() {
    this.$controls.addClass(classes.controlsHover);
  }

  function unhighlightControls() {
    this.$controls.removeClass(classes.controlsHover);
  }

  slideshow.prototype.togglePause = function() {
    var slideshowSelector = getSlideshowId(this.$pause);
    if (this.$pause.hasClass(classes.isPaused)) {
      this.$pause.removeClass(classes.isPaused).attr('aria-pressed', 'false');
      if (this.autorotate) {
        $(slideshowSelector).slick('slickPlay');
      }
    } else {
      this.$pause.addClass(classes.isPaused).attr('aria-pressed', 'true');
      if (this.autorotate) {
        $(slideshowSelector).slick('slickPause');
      }
    }
  };

  slideshow.prototype.setSlideshowHeight = function() {
    var minAspectRatio = this.$slideshow.data('min-aspect-ratio');
    this.$slideshow.height($(document).width() / minAspectRatio);
  };

  slideshow.prototype.showMobileText = function(slideIndex) {
    var $allTextContent = this.$textWrapperMobile.find(
      selectors.textContentMobile
    );
    var currentTextContentSelector =
        selectors.textContentMobile + '-' + slideIndex;
    var $currentTextContent = this.$textWrapperMobile.find(
      currentTextContentSelector
    );
    if (
      !$currentTextContent.length &&
      this.$slideshow.find(selectors.slides).length === 1
    ) {
      this.$textWrapperMobile.hide();
    } else {
      this.$textWrapperMobile.show();
    }
    $allTextContent.hide();
    $currentTextContent.show();
  };

  function getSlideshowId($el) {
    return '#Slideshow-' + $el.data('id');
  }

  return slideshow;
})();

theme.NewsletterPopup = (function() {
  return;
  var popupWrapper = '#newsletter-popup-wrapper',
      popupDelay = parseInt($(popupWrapper).data('newsletter-popup-delay')) * 1000,
      popupExpiration = parseInt($(popupWrapper).data('newsletter-popup-expiration')),
      urls_to_avoid = ['refer-a-friend','sweeps','checkout','cart','utm_source=klaviyo'];


  function setTheCookie() {
    setCookie('newsletter','hide', {expires: popupExpiration});
  }
  function showThePopup() {


    $.magnificPopup.open({
      items: {
        src: '#newsletter-popup'
      },
      removalDelay: 500,
      showCloseBtn: true,
      closeBtnInside: true,
      mainClass: 'mfp-with-zoom',
      type: 'inline'
    });
    //$('#newsletter-popup').fadeIn();
    setTheCookie();
  }

  function NewsletterPopup(container) {

    if(getCookie('newsletter') == 'hide') {
      return;
    }
    if($('#newsletter-popup-wrapper').data('show-newsletter-popup') != true) {
      return;
    }
    for(var i=0;i<showNewsletterWhere.length; i++) {
      if($('body').hasClass(showNewsletterWhere[i])) {
        if(showNewsletterWhere[i] == 'template-product') {
          var ref = document.referrer;
          //var ref = 'https://instagram.com/something';
          if(ref.match(/^https?:\/\/([^\/]+\.)?facebook\.com(\/|$)/i)) {
          } else if(ref.match(/^https?:\/\/([^\/]+\.)?instagram\.com(\/|$)/i)) {
          } else {
            return;
          }
        }
        setTimeout(showThePopup,popupDelay);
      }
    }
    $('.newsletter__close').on('click',function(e) {
      e.preventDefault();
      setTheCookie();
      $('#newsletter-popup').hide();
    });

  }

  NewsletterPopup.prototype = _.assignIn({}, NewsletterPopup.prototype, {
    onLoad: function() {
      //console.log('load');
    },
    onSelect: function() {
      showThePopup();
    }
  });
  return NewsletterPopup;
})();



window.theme = window.theme || {};

theme.FormStatus = (function() {
  var selectors = {
    statusMessage: '[data-form-status]'
  };

  function init() {
    this.$statusMessage = $(selectors.statusMessage);

    if (!this.$statusMessage) return;

    this.$statusMessage.attr('tabindex', -1).focus();

    this.$statusMessage.on('blur', handleBlur.bind(this));
  }

  function handleBlur() {
    this.$statusMessage.removeAttr('tabindex');
  }

  return {
    init: init
  };
})();


/* ================ TEMPLATES ================ */
(function() {
  var $filterBy = $('#BlogTagFilter');

  if (!$filterBy.length) {
    return;
  }

  $filterBy.on('change', function() {
    location.href = $(this).val();
  });
})();

window.theme = theme || {};

theme.customerTemplates = (function() {
  var selectors = {
    RecoverHeading: '#RecoverHeading',
    RecoverEmail: '#RecoverEmail',
    LoginHeading: '#LoginHeading'
  };

  function initEventListeners() {
    this.$RecoverHeading = $(selectors.RecoverHeading);
    this.$RecoverEmail = $(selectors.RecoverEmail);
    this.$LoginHeading = $(selectors.LoginHeading);

    // Show reset password form
    $('#RecoverPassword').on(
      'click',
      function(evt) {
        evt.preventDefault();
        showRecoverPasswordForm();
        this.$RecoverHeading.attr('tabindex', '-1').focus();
      }.bind(this)
    );

    // Hide reset password form
    $('#HideRecoverPasswordLink').on(
      'click',
      function(evt) {
        evt.preventDefault();
        hideRecoverPasswordForm();
        this.$LoginHeading.attr('tabindex', '-1').focus();
      }.bind(this)
    );

    this.$RecoverHeading.on('blur', function() {
      $(this).removeAttr('tabindex');
    });

    this.$LoginHeading.on('blur', function() {
      $(this).removeAttr('tabindex');
    });
  }

  /**
   *
   *  Show/Hide recover password form
   *
   */

  function showRecoverPasswordForm() {
    $('#RecoverPasswordForm').removeClass('hide');
    $('#CustomerLoginForm').addClass('hide');

    if (this.$RecoverEmail.attr('aria-invalid') === 'true') {
      this.$RecoverEmail.focus();
    }
  }

  function hideRecoverPasswordForm() {
    $('#RecoverPasswordForm').addClass('hide');
    $('#CustomerLoginForm').removeClass('hide');
  }

  /**
   *
   *  Show reset password success message
   *
   */
  function resetPasswordSuccess() {
    var $formState = $('.reset-password-success');

    // check if reset password form was successfully submited.
    if (!$formState.length) {
      return;
    }

    // show success message
    $('#ResetSuccess')
    .removeClass('hide')
    .focus();
  }

  /**
   *
   *  Show/hide customer address forms
   *
   */
  function customerAddressForm() {
    var $newAddressForm = $('#AddressNewForm');
    var $newAddressFormButton = $('#AddressNewButton');

    if (!$newAddressForm.length) {
      return;
    }

    // Initialize observers on address selectors, defined in shopify_common.js
    if (Shopify) {
      // eslint-disable-next-line no-new
      new Shopify.CountryProvinceSelector(
        'AddressCountryNew',
        'AddressProvinceNew',
        {
          hideElement: 'AddressProvinceContainerNew'
        }
      );
    }

    // Initialize each edit form's country/province selector
    $('.address-country-option').each(function() {
      var formId = $(this).data('form-id');
      var countrySelector = 'AddressCountry_' + formId;
      var provinceSelector = 'AddressProvince_' + formId;
      var containerSelector = 'AddressProvinceContainer_' + formId;

      // eslint-disable-next-line no-new
      new Shopify.CountryProvinceSelector(countrySelector, provinceSelector, {
        hideElement: containerSelector
      });
    });

    // Toggle new/edit address forms
    $('.address-new-toggle').on('click', function() {
      var isExpanded = $newAddressFormButton.attr('aria-expanded') === 'true';

      $newAddressForm.toggleClass('hide');
      $newAddressFormButton.attr('aria-expanded', !isExpanded).focus();
    });

    $('.address-edit-toggle').on('click', function() {
      var formId = $(this).data('form-id');
      var $editButton = $('#EditFormButton_' + formId);
      var $editAddress = $('#EditAddress_' + formId);
      var isExpanded = $editButton.attr('aria-expanded') === 'true';

      $editAddress.toggleClass('hide');
      $editButton.attr('aria-expanded', !isExpanded).focus();
    });

    $('.address-delete').on('click', function() {
      var $el = $(this);
      var formId = $el.data('form-id');
      var confirmMessage = $el.data('confirm-message');

      // eslint-disable-next-line no-alert
      if (
        confirm(
          confirmMessage || 'Are you sure you wish to delete this address?'
        )
      ) {
        Shopify.postLink('/account/addresses/' + formId, {
          parameters: { _method: 'delete' }
        });
      }
    });
  }

  /**
   *
   *  Check URL for reset password hash
   *
   */
  function checkUrlHash() {
    var hash = window.location.hash;

    // Allow deep linking to recover password form
    if (hash === '#recover') {
      showRecoverPasswordForm.bind(this)();
    }
  }

  return {
    init: function() {
      initEventListeners();
      checkUrlHash();
      resetPasswordSuccess();
      customerAddressForm();
    }
  };
})();


theme.incrementCartUp = function(obj) {
  var qtyInput = $(obj).siblings('input');

  var current_value = parseInt(qtyInput.val());
  var next_value = current_value;
  var my_max = parseInt(qtyInput.attr('max'));

  var parentProduct = obj.closest('.cart__row').length ? obj.closest('.cart__row') : obj.closest('.cart-ajax__row');
  var variantID = parentProduct.data('variant');

  if(current_value < my_max) {
    var next_value = current_value + 1;
    theme.updateItem(variantID,next_value);
    //theme.updateItem(obj);
  } else {
    var next_value = my_max;
    theme.dealWithStockLimitsCart(obj);
  }


};

/*================ SECTIONS ================*/
window.theme = window.theme || {};

theme.Cart = (function() {
  var selectors = {
    edit: '.js-edit-toggle',
    inputQty: '.cart__qty-input',
    thumbnails: '.cart__image',
    update: '.cart__update',
    item: '.cart__row'
  };

  var config = {
    showClass: 'cart__update--show',
    showEditClass: 'cart__edit--active',
    cartNoCookies: 'cart--no-cookies'
  };


  function QtySubtract(obj) {
    var qtyInput = $(obj).siblings('.cart__qty-input');
    //console.log(qtyInput.val());
    var current_value = parseInt(qtyInput.val());
    var next_value = current_value - 1;
    //console.log(next_value);
    qtyInput.val(next_value);
    $('.cart__update').trigger('click');
    //theme.updateCartPage();
  }

  function QtyAdd(obj) {
    theme.incrementCartUp(obj);

  }

  $(document).on('click','.cart__qty .qty-change', function(e) {
    e.preventDefault();
    //     console.log('.qty-change onClick');
    $('.cart-preloader').fadeIn();
    if($(this).hasClass('qty-minus')) {
      QtySubtract($(this));
    } else {
      QtyAdd($(this));
    }                 
  });

  var AllStepsTaken = false;


  $(document).on('click','.checkoutMethod', function(e) {
    var myMethod = $(this).find('.checkoutMethodName').text();
    switch(myMethod) {
      case 'Shipping': 
        $('#shipping-calculator').show();
        break;
      case 'Local Delivery':
        $('#shipping-calculator').hide();
        break;
      case 'Store Pickup': 
        $('#shipping-calculator').hide();
        break;
    }
    if($('#read-agreed:checked').length) {
      AllStepsTaken = true;
    }
  });

  function Cart(container) {
    this.$container = $(container);
    this.$edit = $(selectors.edit, this.$container);
    this.$inputQuantities = $(selectors.inputQty, this.$container);
    this.$thumbnails = $(selectors.thumbnails, this.$container);


    $('.cart-extra-info__slideshow').slick({
      arrows: false,
      dots: false,
      autoplay: true
    });



    $('#cart-page__form').submit(function(e) {
      //       console.log('#shopify-section-cart-template form submitted');
      if(!$('#read-agreed:checked').length) {
        //$('.read-agreed--wrapper').addClass('error');
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
      }  else {

      }
    });

    $('#cart-page__form').keydown(function (e) {
      if (e.keyCode == 13) {
        e.preventDefault();
        return false;
      }
    });

    $('#read-agreed').change(function(e) {
      enableDisableCheckoutButton();

    });


    function shake(thing) {
      var interval = 100;
      var distance = 10;
      var times = 6;

      for (var i = 0; i < (times + 1); i++) {
        $(thing).animate({
          left:
          (i % 2 == 0 ? distance : distance * -1)
        }, interval);
      }
      $(thing).animate({
        left: 0,
        top: 0
      }, interval);
    }


    $('.checkout-check').on('click',function(e) {
      e.preventDefault();
      //       console.log('boo');
      shake('.checkout-wrapper');
      checkoutChecks();
    });


    if (!this.cookiesEnabled()) {
      this.$container.addClass(config.cartNoCookies);
    }

    this.$edit.on('click', this._onEditClick);
    //this.$inputQuantities.on('change', this._handleInputQty);

    $(document).on('click',selectors.update,function(e) {
      e.preventDefault();
      theme.updateCartFromForm('cart-page__form');
    });

    this.$thumbnails.css('cursor', 'pointer');
    this.$thumbnails.on('click', this._handleThumbnailClick); 

    if($('.cart-related__carousel').length) {
      $('.cart-related__carousel').slick({
        dots: true,
        arrows: true,
        infinite: true,
        speed: 300,
        slidesToShow: 4,
        slidesToScroll: 4,
        prevArrow: '<button type="button" class="slick-prev">'+arrowPrev+'</button>',
        nextArrow: '<button type="button" class="slick-next">'+arrowNext+'</button>',
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]
      });
    }

  }

  Cart.prototype = _.assignIn({}, Cart.prototype, {
    onUnload: function() {
      this.$edit.off('click', this._onEditClick);
    },

    _onEditClick: function(evt) {
      var $evtTarget = $(evt.target);
      var $updateLine = $('.' + $evtTarget.data('target'));
      var isExpanded = $evtTarget.attr('aria-expanded') === 'true';

      $evtTarget
      .toggleClass(config.showEditClass)
      .attr('aria-expanded', !isExpanded);
      $updateLine.toggleClass(config.showClass);
    },

    _handleInputQty: function(evt) {
      var $input = $(evt.target);
      var value = $input.val();
      var itemKey = $input.data('quantity-item');
      var $itemQtyInputs = $('[data-quantity-item=' + itemKey + ']');
      $itemQtyInputs.val(value);
    },

    _handleThumbnailClick: function(evt) {
      var url = $(evt.target).data('item-url');

      window.location.href = url;
    },

    cookiesEnabled: function() {
      var cookieEnabled = navigator.cookieEnabled;

      if (!cookieEnabled) {
        document.cookie = 'testcookie';
        cookieEnabled = document.cookie.indexOf('testcookie') !== -1;
      }
      return cookieEnabled;
    }
  });

  return Cart;
})();

window.theme = window.theme || {};



Array.min = function( array ){
  return Math.min.apply( Math, array );
};

$.fn.hasAttr = function(name) {  
  return this.attr(name) !== undefined;
};

theme.toHandle = function(str) {
  if(str.length <=0) return false;
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '').replace(/^-/, '');

};

theme.multiSearchAnd = function(text,searchWords) {
  var searchExp = new RegExp("("+searchWords.join(")|(")+")","gi");
  var textMatch = text.match(searchExp);
  if(textMatch == null) {
    return false;
  }
  return textMatch.length == searchWords.length;
};


theme.scrollToTop = function() {
  $('html,body').animate({ scrollTop: 0 }, 'slow');
};



window.theme = window.theme || {};

theme.HeaderSection = (function() {
  function Header() {
    theme.Header.init();
    theme.MobileNav.init();
    theme.Search.init();
  }

  Header.prototype = _.assignIn({}, Header.prototype, {
    onUnload: function() {
      theme.Header.unload();
    }
  });

  return Header;
})();


theme.FAQ = function() {
  var selectors = {
    header: '.faq-header.filter',
    all: '.faq-header.all',
    question: '.faq__question',
    openClass: 'faq--open'
  }

  $(document).on('click',selectors.question,function(e) {
    e.preventDefault();
    $(this).parent().toggleClass(selectors.openClass)
    $(this).next().slideToggle('fast');
  });


  $(document).on('click',selectors.header,function(e) {
    e.preventDefault;
    var myCategory = $(this).data('filter-by');
    $('.faq__item').hide();
    $('.'+myCategory).show();
    $('.faq-header').removeClass('active');
    $(this).addClass('active');
    return false;
  });

  $(document).on('click',selectors.all,function(e) {
    e.preventDefault;
    $('.faq__item').show();
    $('.faq-header').removeClass('active');
    $(this).addClass('active');
  });
};

theme.ListProductsSection = (function() {
  function ListProductsSection(container) {
    var $container = (this.$container = $(container));
    var sectionId = $container.attr('data-section-id');
    var enableSlider = parseInt($container.attr('data-slider'));
    if (enableSlider == 1) {
      var slider = $('#list-products-' + sectionId);
      var sliderCount = parseInt($container.attr('data-slider-count'));
      slider.slick({
        dots: false,
        arrows: true,
        infinite: true,
        slidesToShow: sliderCount,
        slidesToScroll: sliderCount > 1 ? sliderCount-1: 1,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
              infinite: true
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]
      });
    }
  }

  ListProductsSection.prototype = _.assignIn({}, ListProductsSection.prototype, {
    onUnload: function() {
      enquire.unregister(config.mediaQuerySmall);
      enquire.unregister(config.mediaQueryMediumUp);

      $(this.slider, this.wrapper).slick('unslick');
    },

    onBlockSelect: function(evt) {
      // Ignore the cloned version
      var $slide = $(
        '.quotes-slide--' + evt.detail.blockId + ':not(.slick-cloned)'
      );
      var slideIndex = $slide.data('slick-index');

      // Go to selected slide, pause autoplay
      $(this.slider, this.wrapper).slick('slickGoTo', slideIndex);
    },

    a11y: function(event, obj) {
      var $list = obj.$list;
      var $wrapper = $(this.wrapper, this.$container);

      // Remove default Slick aria-live attr until slider is focused
      $list.removeAttr('aria-live');

      // When an element in the slider is focused set aria-live
      $wrapper.on('focusin', function(evt) {
        if ($wrapper.has(evt.target).length) {
          $list.attr('aria-live', 'polite');
        }
      });

      // Remove aria-live
      $wrapper.on('focusout', function(evt) {
        if ($wrapper.has(evt.target).length) {
          $list.removeAttr('aria-live');
        }
      });
    }
  });

  return ListProductsSection;
})();

theme.FeaturedCollectionSection = (function() {
  function FeaturedCollectionSection(container) {
    var $container = (this.$container = $(container));
    var sectionId = $container.attr('data-section-id');
    var enableSlider = parseInt($container.attr('data-slider'));
    if (enableSlider == 1) {
      var slider = $('#featured-collection-' + sectionId);
      var sliderCount = parseInt($container.attr('data-slider-count'));
      slider.slick({
        dots: false,
        arrows: true,
        infinite: true,
        slidesToShow: sliderCount,
        slidesToScroll: sliderCount > 1 ? sliderCount-1: 1,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
              dots: true
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]
      });
    }
  }

  FeaturedCollectionSection.prototype = _.assignIn({}, FeaturedCollectionSection.prototype, {
    onUnload: function() {
      enquire.unregister(config.mediaQuerySmall);
      enquire.unregister(config.mediaQueryMediumUp);

      $(this.slider, this.wrapper).slick('unslick');
    },

    onBlockSelect: function(evt) {
      // Ignore the cloned version
      var $slide = $(
        '.quotes-slide--' + evt.detail.blockId + ':not(.slick-cloned)'
      );
      var slideIndex = $slide.data('slick-index');

      // Go to selected slide, pause autoplay
      $(this.slider, this.wrapper).slick('slickGoTo', slideIndex);
    },

    a11y: function(event, obj) {
      var $list = obj.$list;
      var $wrapper = $(this.wrapper, this.$container);

      // Remove default Slick aria-live attr until slider is focused
      $list.removeAttr('aria-live');

      // When an element in the slider is focused set aria-live
      $wrapper.on('focusin', function(evt) {
        if ($wrapper.has(evt.target).length) {
          $list.attr('aria-live', 'polite');
        }
      });

      // Remove aria-live
      $wrapper.on('focusout', function(evt) {
        if ($wrapper.has(evt.target).length) {
          $list.removeAttr('aria-live');
        }
      });
    }
  });

  return FeaturedCollectionSection;
})();

theme.Quotes = (function() {
  //   console.log('theme.Quotes');
  var config = {
    mediaQuerySmall: 'screen and (max-width: 749px)',
    mediaQueryMediumUp: 'screen and (min-width: 750px)',
    slideCount: 0
  };
  var defaults = {
    accessibility: true,
    arrows: false,
    dots: true,
    autoplay: false,
    touchThreshold: 20,
    slidesToShow: 3,
    slidesToScroll: 3
  };

  function Quotes(container) {
    var $container = (this.$container = $(container));
    var sectionId = $container.attr('data-section-id');
    var wrapper = (this.wrapper = '.quotes-wrapper');
    var slider = (this.slider = '#Quotes-' + sectionId);
    var $slider = $(slider, wrapper);
    //     console.log('Quotes');

    var sliderActive = false;
    var mobileOptions = $.extend({}, defaults, {
      slidesToShow: 1,
      slidesToScroll: 1,
      adaptiveHeight: true
    });

    config.slideCount = $slider.data('count');

    // Override slidesToShow/Scroll if there are not enough blocks
    if (config.slideCount < defaults.slidesToShow) {
      defaults.slidesToShow = config.slideCount;
      defaults.slidesToScroll = config.slideCount;
    }

    $slider.on('init', this.a11y.bind(this));

    enquire.register(config.mediaQuerySmall, {
      match: function() {
        initSlider($slider, mobileOptions);
      }
    });

    enquire.register(config.mediaQueryMediumUp, {
      match: function() {
        initSlider($slider, defaults);
      }
    });

    function initSlider(sliderObj, args) {
      if (sliderActive) {
        sliderObj.slick('unslick');
        sliderActive = false;
      }

      sliderObj.slick(args);
      sliderActive = true;
    }
  }

  Quotes.prototype = _.assignIn({}, Quotes.prototype, {
    onUnload: function() {
      enquire.unregister(config.mediaQuerySmall);
      enquire.unregister(config.mediaQueryMediumUp);

      $(this.slider, this.wrapper).slick('unslick');
    },

    onBlockSelect: function(evt) {
      // Ignore the cloned version
      var $slide = $(
        '.quotes-slide--' + evt.detail.blockId + ':not(.slick-cloned)'
      );
      var slideIndex = $slide.data('slick-index');

      // Go to selected slide, pause autoplay
      $(this.slider, this.wrapper).slick('slickGoTo', slideIndex);
    },

    a11y: function(event, obj) {
      var $list = obj.$list;
      var $wrapper = $(this.wrapper, this.$container);

      // Remove default Slick aria-live attr until slider is focused
      $list.removeAttr('aria-live');

      // When an element in the slider is focused set aria-live
      $wrapper.on('focusin', function(evt) {
        if ($wrapper.has(evt.target).length) {
          $list.attr('aria-live', 'polite');
        }
      });

      // Remove aria-live
      $wrapper.on('focusout', function(evt) {
        if ($wrapper.has(evt.target).length) {
          $list.removeAttr('aria-live');
        }
      });
    }
  });

  return Quotes;
})();

theme.slideshows = {};

theme.SlideshowSection = (function() {
  function SlideshowSection(container) {
    var $container = (this.$container = $(container));
    var sectionId = $container.attr('data-section-id');
    var slideshow = (this.slideshow = '#Slideshow-' + sectionId);

    theme.slideshows[slideshow] = new theme.Slideshow(slideshow, sectionId);
  }

  return SlideshowSection;
})();

theme.SlideshowSection.prototype = _.assignIn(
  {},
  theme.SlideshowSection.prototype,
  {
    onUnload: function() {
      delete theme.slideshows[this.slideshow];
    },

    onBlockSelect: function(evt) {
      var $slideshow = $(this.slideshow);
      var adaptHeight = $slideshow.data('adapt-height');

      if (adaptHeight) {
        theme.slideshows[this.slideshow].setSlideshowHeight();
      }

      // Ignore the cloned version
      var $slide = $(
        '.slideshow__slide--' + evt.detail.blockId + ':not(.slick-cloned)'
      );
      var slideIndex = $slide.data('slick-index');

      // Go to selected slide, pause auto-rotate
      $slideshow.slick('slickGoTo', slideIndex).slick('slickPause');
    },

    onBlockDeselect: function() {
      // Resume auto-rotate
      $(this.slideshow).slick('slickPlay');
    }
  }
);

function isMobile() {
  if(document.body.clientWidth <= 970) {
    return true;
  } else {
    return false;
  }
};

theme.slideshows = {};

theme.VideoSection = (function() {
  function VideoSection(container) {
    var $container = (this.$container = $(container));

    $('.video', $container).each(function() {
      var $el = $(this);
      theme.Video.init($el);
      theme.Video.editorLoadVideo($el.attr('id'));
    });
  }

  return VideoSection;
})();

theme.collapsingHeader = function() {

  var headerElement = '#shopify-section-header',
      collapseAfter = $(headerElement).outerHeight();




  if(theme.dev.showAnnouncementBar) {
    $(headerElement).css('top','0px');    
  }
  // If we're above the scroll minimum
  if ($(window).scrollTop() > collapseAfter || $(window).scrollTop() > collapseAfter) {
    $(headerElement).addClass('is-collapsed');
    ///$('.ju_Con').slideUp();
    //$(headerElement).css('top','0px');
    if(theme.dev.showAnnouncementBar) {
      $(headerElement).css('top','0px');    
    }

    //If not
  } else {
    //$('.ju_Con').slideDown();
    //$(headerElement).css('top','35px');
    $(headerElement).removeClass('is-collapsed');
    if(!$('body').hasClass('js-drawer-open-left')) {
      $(headerElement).removeClass('is-collapsed');
    }
  }

  if($(window).scrollTop() < 10) {
    // Just to be sure it all comes back
    $(headerElement).removeClass('is-collapsed');
  }

  if($('body').hasClass('template-article')) {
    var topOfFooter = $('#shopify-section-footer').position().top;
    var scrollDistanceFromTopOfDoc = $(document).scrollTop() + 570;
    var scrollDistanceFromTopOfFooter = scrollDistanceFromTopOfDoc - topOfFooter;
    if (scrollDistanceFromTopOfDoc > topOfFooter) {
      $('.article__btn').hide();
    } else  {
      $('.article__btn').fadeIn();
    }
  }



};



var searchIsPaged = false;

theme.infiniteSearch = function() {
  //   console.log('theme.infiniteSearch()');
  if($('.pagination--wrapper').length == 0) {
    return;
  }

  var preloader = '.next-page-preloader',
      paginationWrapper = '.pagination--wrapper',
      isElementInView = Utils.isElementInView($(preloader), false);


  if(searchIsPaged == false && isElementInView) {
    searchIsPaged = true;
    var ajaxHref = $('.next-page-preloader').data('paginate-next-url');
    //     console.log(ajaxHref);
    var productList = '.search-page__products';
    var $currentProductList = $(productList + ' .search-page__inner');

    $.get(ajaxHref, function(data) {
      //       console.log('getting ' + ajaxHref);
      //       console.log($(data).find('#search-results--wrapper').data('page'));
      //       return false;
      if($(data).find(productList).length) {
        //         console.log('has some stuff...');
        var newProducts = $(data).find('.search-page__products .search-page__inner .product-card');
        newProducts.each(function(i,p) {
          $(p).parent().appendTo($currentProductList);
        });
      }
      if($(data).find(paginationWrapper).length) {
        $(paginationWrapper).html($(data).find(paginationWrapper).html());
        $(preloader).attr('data-paginate-next-url',$(data).find(preloader).data('paginate-next-url'));
        //         console.log('new page URL: ' + $(data).find(preloader).data('paginate-next-url'));
      } else {
        $(paginationWrapper).remove();
        //         console.log('remove the preloader');
      }
      searchIsPaged = false;

    });
  }
};


var blogIsPaged = false;
theme.infiniteBlog = function() {
  if($('.pagination--wrapper').length == 0) return;


  var preloader = '.next-page-preloader',
      paginationWrapper = '.pagination--wrapper',
      isElementInView = Utils.isElementInView($(preloader), false);


  if(blogIsPaged == false && isElementInView) {
    blogIsPaged = true;
    var ajaxHref = $('.next-page-preloader').data('paginate-next-url');
    //     console.log(ajaxHref);
    $.get(ajaxHref, function(data) {
      //       console.log('getting ' + ajaxHref);
      var newProducts = $(data).find('.grid--blog .grid__item');
      newProducts.each(function(i,p) {
        $(p).appendTo('.grid--blog');
      });
      if($(data).find(paginationWrapper).length) {
        $(paginationWrapper).html($(data).find(paginationWrapper).html());
        $(preloader).attr('data-paginate-next-url',$(data).find(preloader).data('paginate-next-url'));
      } else {
        $(paginationWrapper).remove();
        //         console.log('remove the preloader');
      }
      blogIsPaged = false;

    });
  }
};

theme.pauseUnseenVideos = function() {
  //console.log('pauseVimeos');
  var vimeos = $('iframe[src*="vimeo.com"]');
  if(vimeos.length) {
    vimeos.each(function(i,v) {
      var isElementInView = Utils.isElementInView($(v), false);
      var player = new Vimeo.Player(v);
      var playerIsPaused = true;
      if(isElementInView && playerIsPaused) {
        player.play()
        playerIsPaused = false;
      } else {
        playerIsPaused = true;
        player.pause();
      }
    });
  }

  if($('#ProductSection-product-template').data('wistia-id') !== 'undefined') {
    var wistiaVid = $('#ProductSection-product-template').data('wistia-id');
    window._wq = window._wq || [];
    _wq.push({ id: wistiaVid, onReady: function(video) {
      var isElementInView = Utils.isElementInView($('#product-slick'),false);
      if(isElementInView) {
        video.play();
      } else {
        video.pause();
      }
    }});
  }

};


var win = $(window);




theme.windowScrolling = function() {
  var scrollTimeout;
  var throttle = 50;
  function isVisible(t,partial) {
    var $t            = $(t),
        $w            = $(window),
        viewTop       = $w.scrollTop(),
        viewBottom    = viewTop + $w.height(),
        _top          = $t.offset().top,
        _bottom       = _top + $t.height(),
        compareTop    = partial === true ? _bottom : _top,
        compareBottom = partial === true ? _top : _bottom;
    return ((compareBottom <= viewBottom) && (compareTop >= viewTop));
  }

  function stuffOnScroll() {
    theme.collapsingHeader();
    if($('body').hasClass('template-blog')) { 
      theme.infiniteBlog();
    }
    if($('body').hasClass('template-search')) {
      theme.infiniteSearch();
    }
    theme.pauseUnseenVideos();
  }

  $(window).on('scroll', function () {
    if (!scrollTimeout) {
      scrollTimeout = setTimeout(function () {
        //scrollMessage('I am scrolllllling with a throttled scroll!');
        stuffOnScroll();
        scrollTimeout = null;
      }, throttle);
    }
    //console.log('native scroll');
  });
};

theme.FooterSection = (function() {
  function FooterSection(container) {
    var $container = (this.$container = $(container));
    var accordion = '.site-footer__item-inner--link_list h4';
    $(document).on('click',accordion,function(e) {
      e.preventDefault();
      $(this).toggleClass('active').next().slideToggle();
    });
  }

  return FooterSection;
})();




function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return false;
}

function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};


theme.removeCookies = function() {
  if(getUrlParameter('clearcookies') != '') {
    document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
    //     console.log('cookies removed?');
  }
};


theme.addToCartFail = function(obj,variant) { 
  //   console.log('theme.addToCartFail',variant);
  if(obj.status == 422) {
    //theme.addToCartFailOverflow(variant);

  }


  $('.cart-preloader').fadeOut();

};

//var GlassTypes = ['Low-E']

theme.dealWithStockLimitsCart = function(obj) {

  var parentProduct = obj.closest('.cart__row').length ? obj.closest('.cart__row') : obj.closest('.cart-ajax__row');

  if(parentProduct) {
    var handle = parentProduct.data('handle') + '-special-order',
        variantTitle = parentProduct.data('variant-title').split(' / '),
        foundOne = false;
  }

  if(parentProduct.hasClass('special-order--item')) {

    var variantID = parseInt(parentProduct.data('variant'));
    var newQty = parseInt(obj.prev().val()) + 1;
    theme.updateItem(variantID,newQty);

  } else {

    var size = variantTitle[0];
    var options = [];
    // This will always be the base
    var props = {
      'Color':'Oil Rubbed Bronze'
    };

    $.get(`/products/${handle}?view=special-order-shipping-time-json`,function(data) {
      var jsonData = JSON.parse(data);
      // console.log(jsonData);
      props['Ships within'] = jsonData.specialOrderValue;

      if(parentProduct.data('color')) {
        props["Color"] = parentProduct.data('color');
      }

      // See if it's Glass or Swing 
      if(GlassOptions.indexOf(variantTitle[1]) !== -1) {
        props["Glass"] = variantTitle[1]; 
      } else if(GlassOptions.indexOf(variantTitle[2]) !== -1) {
        props["Glass"] = variantTitle[2]; 
      }

      if(SwingOptions.indexOf(variantTitle[1]) !== -1) {
        props["Swing"] = variantTitle[1]; 
      } else if(SwingOptions.indexOf(variantTitle[2]) !== -1) {
        props["Swing"] = variantTitle[2]; 
      }

      //     console.log('something here?');


      $.ajax({
        type: "GET",
        url: "/products/"+handle,
        dataType: 'json',
        success: function(data){
          //console.log('Success!',data,variantTitle);
          var screens = '';
          $.each(data.product.variants,function(i,v) {
            var quoteReplacedTitle = v.title.replaceAll('"','˝');
            if(v.title.indexOf('No Screen') > -1) {
              screens = ' / No Screen';
            }
            var vt = variantTitle[0].replaceAll('"','˝') + ' / 6˝ Jamb' + screens;
            //             if(i==0) {
            //              console.log(quoteReplacedTitle+':'+vt);
            //             }
            if(quoteReplacedTitle.indexOf(vt) > -1) {
              
              var myVariantID = data.product.variants[i].id;
              theme.addItemWithProps(myVariantID,1,props);
              return false;
            }
          });

          //$('.cart__update').trigger('click');
        },
        error: function(a,b,c) {
          console.log('Error :(',a);
        }
      });
    });


  }

};


$(document).ready(function() {
  var sections = new theme.Sections();

  sections.register('cart-template', theme.Cart);
  sections.register('product', theme.Product);
  sections.register('header-section', theme.HeaderSection);
  sections.register('map', theme.Maps);
  sections.register('page-faq',theme.FAQ);
  sections.register('footer-section',theme.FooterSection);
  sections.register('slideshow-section', theme.SlideshowSection);
  sections.register('video-section', theme.VideoSection);
  sections.register('quotes', theme.Quotes);
  sections.register('list-products', theme.ListProductsSection);
  sections.register('featured-collection', theme.FeaturedCollectionSection);
  sections.register('newsletter-popup',theme.NewsletterPopup);

});




theme.getUrlParameter = function(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

theme.checkUrlString = function() {
  return window.location.href.indexOf('?ap=') != -1;
};



theme.showDiscountBar = function(txt) {
  $('.ap-discount-bar span').text(txt);
  $('.ap-discount-bar').slideDown();
}

theme.grabAp = function() {
  var code = theme.getUrlParameter('ap') || false;
  var redirect = theme.getUrlParameter('r') || false;
  if(code) {
    $.get('/discount/'+code,function() {
      if(redirect) {
        window.location.href = redirect;
      }
    }).fail(function(err) {
      console.log(err);
    });
    if(code == 'TAKE5') {
      var take5Text = "Enjoy Your 5% OFF Discount! Applied at Checkout";
      theme.showDiscountBar(take5Text);
    }
  }
};

theme.autoPromos = function() {
  if(!theme.checkUrlString('?ap=')) return;
  theme.grabAp();
};



theme.init = function() {
  theme.customerTemplates.init();
  theme.windowScrolling();
  theme.removeCookies();
  theme.FAQ();
  theme.Popups();
  theme.autoPromos();
  theme.updateCartPrices();

  // Theme-specific selectors to make tables scrollable
  var tableSelectors = '.rte table,' + '.custom__item-inner--html table';

  slate.rte.wrapTable({
    $tables: $(tableSelectors),
    tableWrapperClass: 'scrollable-wrapper'
  });

  if(!theme.isMobile()) {
    theme.autoCompleteSearch();
  }

  $(document).on('click','.quick-add',function(e) {
    e.preventDefault();
    theme.addItem($(this).data('variant-id'));
  });


  // Theme-specific selectors to make iframes responsive
  var iframeSelectors =
      '.rte iframe[src*="youtube.com/embed"],' +
      '.rte iframe[src*="player.vimeo"],' +
      '.custom__item-inner--html iframe[src*="youtube.com/embed"],' +
      '.custom__item-inner--html iframe[src*="player.vimeo"]';

  slate.rte.wrapIframe({
    $iframes: $(iframeSelectors),
    iframeWrapperClass: 'video-wrapper'
  });

  // Common a11y fixes
  slate.a11y.pageLinkFocus($(window.location.hash));

  $('.in-page-link').on('click', function(evt) {
    slate.a11y.pageLinkFocus($(evt.currentTarget.hash));
  });

  $('a[href="#"]').on('click', function(evt) {
    evt.preventDefault();
  });

  $('a[href$=".pdf"]').attr('target','_blank');

  theme.FormStatus.init();

  if(window.location.href.indexOf('?discount=5-off') > -1) {
    setCookie('promo-code','TAKE5', {expires: 5});
  }

  if($('body.page-about-us').length && isMobile() === false) {

    $('.cd-timeline-img').mouseenter(function() {
      var $this = $(this),
          $hoverImg = $('<div class="cd-hover-img" style="display: none;"/>'),
          $img = $this.find('img').clone();

      $hoverImg.append($img);
      $this.parent().append($hoverImg);
      setTimeout(function(){ 
        $hoverImg.addClass('show');
      }, 25);
    })
    .mouseleave(function() {
      var $this = $(this),
          $hoverImg = $('.cd-hover-img');

      $hoverImg.fadeOut('fast',function() {
        $hoverImg.remove();
      });
    });

  }

  function checkReviews() {
    if($('.broadly-reviews').length) {
      $('.broadly-review-aggregate svg').replaceWith(starIcon);
      $('.broadly-review-rating svg').replaceWith(starIcon);
      $('.broadly-review-rating').addClass('showme');
      $('.broadly-review-aggregate').addClass('showme');
      $(".broadly-review-avatar img").each(function() {
        if((typeof this.naturalWidth != "undefined" &&
            this.naturalWidth == 0 ) 
           || this.readyState == 'uninitialized' ) {
          $(this).replaceWith('<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 39.13 39.13"><g data-name="Layer 2"><path d="M19.57 24.27A14.28 14.28 0 0 1 33 33.76a19.57 19.57 0 1 0-26.89 0 14.29 14.29 0 0 1 13.46-9.49z" fill="#f15d52"/><path d="M33 33.76a14.27 14.27 0 0 0-26.89 0 19.52 19.52 0 0 0 26.89 0z" fill="#feeeed"/><circle cx="19.57" cy="15.6" r="6.52" fill="#feeeed"/></g></svg>');
        }
      });
      $('.full-page--preloader').hide();
      $('.broadly-review').fadeIn();
      /*
      $('.broadly-review').each(function(i,v) {
        $(this).delay(50*i).fadeIn(300);
      });
      */
    } else {
      setTimeout(checkReviews, 500);
    }

  }
  if($('body.page-reviews').length) {
    checkReviews();
  }

  $(window).scroll();


};

$(theme.init);

theme.isMobile = function() {
  if(window.screen.width <= 970) {
    return true;
  }
};


theme.Popups = function() {
  $('.mfp-iframe').magnificPopup({
    disableOn: 700,
    type: 'iframe',
    mainClass: 'mfp-fade',
    removalDelay: 300,
    iframe: {
      markup: '<div class="mfp-iframe-scaler">'+
      '<div class="mfp-close"></div>'+
      '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>'+
      '<div class="mfp-title">Some caption</div>'+
      '</div>',
      patterns: {
        youtube: {
          index: 'youtube.com/', 
          id: 'v=',
          src: 'https://www.youtube.com/embed/%id%?rel=0&autoplay=1'
        }
      }
    }
  });
  $('.mfp-inline').magnificPopup({
    removalDelay: 300, //delay removal by X to allow out-animation
    mainClass: 'mfp-with-zoom',
    midClick: true,
    callbacks: {
      open: function() {
        //$('.mfp-content').fitVids();
      }
    }
  });
};


theme.autoCompleteSearch = function() {
  // Current Ajax request.
  var currentAjaxRequest = null;
  var activeInput = $('input[name="q"]:focus');
  // Grabbing all search forms on the page, and adding a .search-results list to each.
  var searchForms = $('form[action="/search"].you-autocomplete-me').each(function() {
    // Grabbing text input.
    var input = $(this).find('input[name="q"]');
    //var activeInput = $(this).find('input[name="q"]:focus');
    var myForm = input.closest('form');
    // Adding a list for showing search results.
    //var offSet = $('#topsearch').position().top + $('#topsearch').innerHeight() + input.position().top + input.innerHeight();
    $('<div class="search-results--full search-results"><div class="search-results__inner"></div></div>').appendTo(myForm);
    // Listening to keyup and change on the text field within these search forms.
    input.attr('autocomplete', 'off').bind('keyup change', function() {
      // What's the search term?
      var term = $(this).val();
      //console.log(term);
      //console.log(term);
      // What's the search form?
      var form = $(this).closest(myForm);
      // What's the search URL?
      var searchURL = '/search?q=' + term;
      // What's the search results list?
      var resultsList = form.find('.search-results__inner');

      var maxProducts = 8,
          maxPages = 4,
          maxCollections = 4,
          maxArticles = 4;

      // If that's a new term and it contains at least 3 characters.
      if (term.length >= 3 && term != $(this).attr('data-old-term')) {
        // Saving old query.
        $(this).attr('data-old-term', term);
        // Killing any Ajax request that's currently being processed.
        if (currentAjaxRequest != null) currentAjaxRequest.abort();
        var ts = new Date().getTime();
        // Pulling results.
        currentAjaxRequest = $.getJSON(searchURL + '&view=json&ts='+ts, function(data) {
          // Reset results.
          //           console.log(data);
          resultsList.empty();
          var productsList = $('<div class="search-results__products"><h4>Products</h4><div class="inner-results flex flex--wrap"></div></div>').appendTo(resultsList);
          var pagesList = $('<div class="search-results__pages"><h4>Pages</h4><div class="inner-results"></div></div>').appendTo(resultsList);
          var collectionsList = $('<div class="search-results__collections"><h4>Collections</h4><div class="inner-results"></div></div>').appendTo(resultsList);
          var articlesList = $('<div class="search-results__articles"><h4>Articles</h4><div class="inner-results"></div></div>').appendTo(resultsList);
          // If we have no results.
          if(data.results_count == 0) {
            // resultsList.html('<li><span class="title">No results.</span></li>');
            // resultsList.fadeIn(200);
            resultsList.parent().hide();
          } else {
            // If we have results.
            var totalPages = 0,
                totalArticles = 0,
                totalCollections = 0,
                totalProducts = 0;
            $.each(data.items, function(index, item) {

              if(item.type == 'page' && totalPages < maxPages) {
                var obj = $('<div class="auto-search__item auto-search__item--page"><a href="'+item.url+'">'+item.title+'</a></div>');
                $('.search-results__pages .inner-results').append(obj);
                totalPages++;
              } 
              if(item.type == 'article' && totalArticles < maxArticles) {
                var obj = $('<div class="auto-search__item auto-search__item--article"><a href="'+item.url+'">'+item.title+'</a></div>');
                $('.search-results__articles .inner-results').append(obj);
                totalArticles++;

              } 
              if(item.type == 'product' && totalProducts < maxProducts) {
                if(item.available) {
                  var min_price = item.price_max;
                  $.each(item.variants,function(i,variant) {
                    if(variant.price <= min_price && variant.available) {
                      //                       console.log(variant.price);
                      min_price = variant.price;
                    }
                  });
                  var obj = $('<div class="auto-search__item flex flex--align-center"></div>');
                  var link = $('<a></a>').attr('href', item.url);
                  obj.append('<div class="thumbnail"><a href="'+item.url+'"><img src="' + item.featured_image + '" /></a></div><div class="auto-search__info"></div>');

                  var info = obj.find('.auto-search__info');
                  var title = $('<a class="auto-search__title" href="'+item.url+'">'+item.title+'</a>').appendTo(info);

                  if(item.color) {
                    var color = $('<a class="auto-search__color" href="'+item.url+'">'+item.color+'</a>').appendTo(info);
                  }
                  //var price = item.price;
                  var price = theme.Currency.formatMoney(
                    min_price,
                    theme.moneyFormat
                  );
                  var thePrice = $('<a class="auto-search__price" href="'+item.url+'">From '+price+'</a>').appendTo(info);
                  //obj.find('.auto-search__info').append();
                  //link.wrap('<div class="auto-search__item medium--one-half large-up--one-third"></div>');
                  $('.search-results__products .inner-results').append(obj);
                  totalProducts++;
                }
              }


            });
            $.each(data.collections, function(index,item) {
              if(totalCollections < maxCollections) {
                var obj = $('<div class="auto-search__item auto-search__item--article"><a href="'+item.url+'">'+item.title+'</a></div>');
                $('.search-results__collections .inner-results').append(obj);
                totalCollections++;
              }
            });
            // The Ajax request will return at the most 10 results.
            // If there are more than 10, let's link to the search results page.
            if(data.results_count > 10) {
              resultsList.append('<div class="one-whole auto-search__view-all text-center"><a href="' + searchURL + '">See all results (' + data.results_count + ')</a></div>');
            }
            resultsList.parent().fadeIn();
            $('.inner-results').each(function() {
              if($(this).html() === '') {
                $(this).parent().hide();
              }
            });
          }
        });

      }
    });
  });
};


var activeShippingCalc = false;
theme.resetCalc = function() {
  $('#shipping-calculator .get-rates').prop('disabled',false).find('.inner-txt').text('Calculate Shipping');
  $('#shipping-calculator .get-rates').find('svg').fadeOut();
}

if(window.location.href.indexOf('/cart') > -1) {

  //console.log('cart page only');
  var provinces = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming','District of Columbia','Puerto Rico','Guam','American Samoa','U.S. Virgin Islands','Northern Mariana Islands'];
  var $shippingProvince = $('#address_province');
  $.each(provinces,function(i,province) {
    $shippingProvince.append('<option value="'+province+'">'+province+'</option>');
  });

  $('#address_country').val('United States');
  $shippingProvince.val('California');

  var $shippingMessage = $('#wrapper-response');
 

  $('#shipping-calculator .get-rates').on('click',function(e) {
    $(this).prop('disabled',true).find('.inner-txt').text('Calculating...');
    $(this).find('svg').fadeIn();
    var freePickup = '<div class="flex flex--space-between"><span>Pick Up (Local)</span><span>Free Local Pick Up</span></div>';
    $shippingMessage.html(freePickup).hide();
    var shipToCountry = $('#address_country').val(),
        shipToState = $('#address_province').val(),
        shipToZip = $('#address_zip').val();
    $.ajax({
      type: "GET",
      url: '/cart/shipping_rates.json',
      data: {
        'shipping_address[country]':shipToCountry,
        'shipping_address[province]':shipToState,
        'shipping_address[zip]':shipToZip
      },
      success: function(d){
        if(d.shipping_rates && d.shipping_rates.length){
          $.each(d.shipping_rates,function(i,shipping_rate) {
            $shippingMessage.append('<div class="flex flex--space-between"><span>'+shipping_rate.name+'</span><span>'+theme.Currency.formatMoney(shipping_rate.price, theme.moneyFormat)+ '</span></div>');
            activeShippingCalc = true;
          });
          theme.resetCalc();
          $shippingMessage.show();
        } else {
          $shippingMessage.html("Something is amiss, no results to show").show();
          theme.resetCalc();
        }
      },
      error: function(e){
        //         console.log(e);
        //         console.log(e.responseJSON);
        $shippingMessage.html(e.responseJSON.error[0]).show();
        theme.resetCalc();
      },
      dataType: 'json'
    });
  });

  
}

document.addEventListener('lazybeforeunveil', function(e){
  var bg = e.target.getAttribute('data-bg');
  if(bg){
    e.target.style.backgroundImage = 'url(' + bg + ')';
  }
});


/*============================================================================
  Override POST to cart/add.js. Returns cart JSON.
    - Allow use of form element instead of just id
    - Allow custom error callback
==============================================================================*/

theme.updateCartFromForm = function(e, t) {
  var n = {
    type: "POST",
    url: "/cart/update.js",
    data: jQuery("#" + e).serialize(),
    dataType: "json",
    success: function(e) {
      "function" == typeof t ? t(e) : theme.updateCartPage(e)
    },
    error: function(e, t) {
      theme.onError(e, t)
    }
  };
  $.ajax(n)
};

theme.onError = function(data) {
  console.log('flesh this out [ theme.onError ]',data);
  if($('#cart-page__form').length) {
  }
  //if(
  //$('.product-single__errors').html('<h4>'+data.responseJSON.message+'</h4><p>'+data.responseJSON.description+'</p>').fadeIn();
};

theme.showSideCartLoader = function() {
  $('.inline-cart--loading').fadeIn();
};
theme.hideSideCartLoader = function() {
  $('.inline-cart--loading').fadeOut();
};
// AJAX cart

theme.removeItem = function(id) {
  //console.log('remove item: '+id);
  $.post('/cart/change.js',{
    quantity: 0,
    id: id,
    success: theme.onCartUpdate,
    error: theme.updateCartFail
  });
};
theme.removeSideCartItem = function(t,r) {
  var e = {
    type: "POST",
    url: "/cart/change.js",
    data: "quantity=0&id=" + t,
    dataType: "json",
    success: function(t) {
      "function" == typeof r ? r(t) : theme.onCartUpdate(t)
    },
    error: function(t, r) {
      theme.onError(t, r)
    }
  };
  jQuery.ajax(e)
};

theme.updateItem = function(t,r,e) {
  theme.showSideCartLoader();
  var a = {
    type: "POST",
    url: "/cart/change.js",
    data: "quantity=" + r + "&id=" + t,
    dataType: "json",
    success: function(t) {
      //console.log(t);
      "function" == typeof e ? e(t) : theme.onCartUpdate(t)
    },
    error: function(t, r) {
      theme.onError(t, r);
    }
  };
  jQuery.ajax(a);
};


theme.updateCartCount = function(e) {
  $.getJSON('/cart.js', function(cart) {
    var total = cart.item_count;
    $('#CartCount span').text(total);
    (total > 0) ? $('#CartCount').addClass('site-header__cart-count--show') : $('#CartCount').removeClass('site-header__cart-count--show')
  });
};

theme.upsellInCart = function(id) {
  var inCart = false;
  $('.cart-ajax__row').each(function(i,r) {
    var myId = parseFloat($(r).data('variant'));
    if(myId == id) {
      inCart = true;
      return true;
    }
  });
  return inCart;
}
theme.addUpsell = function(e) {
  var p = upsellProduct,
      pId = parseFloat(p.variants[0].id);


  if(theme.upsellInCart(pId)) {
    $('.cart-upsell').hide();
    return;
  }  
  $(document).on('click','.cart-upsell__btn',function() {
    var id = $(this).data('variant');
    theme.addItem(id);
    return false;
  });
};

theme.updateCartPrices = function() {
  if(!theme.wholesale.isWholesale) return;
  //   console.log('theme.updateCartPrices');
  //   $('.cart-ajax__price').html('Dealer Price' + theme.getWholesalePrice())
  $('.cart-ajax__price').each(function(i,v) {
    var $t = $(this);
    var p = parseFloat($(this).data('price'));
    var o = parseFloat($(this).data('original-price'));
    $t.html(
      '<span class="pink">Dealer Price: ' +
      theme.Currency.formatMoney(p, theme.moneyFormat) + 
      '</span><br>' +
      '<span>MSRP: '+theme.Currency.formatMoney(o, theme.moneyFormat)+'</span>'
    );
  });
  $('.cart__row').each(function() {
    var $t = $(this);
    var p = $t.data('price');
    var o = $t.data('original-price');
    $t.find('.cart__price-wrapper').html(
      '<span class="pink">Dealer Price: ' +
      theme.Currency.formatMoney(p, theme.moneyFormat) + 
      ' each</span><br>' +
      '<span>MSRP: '+theme.Currency.formatMoney(o, theme.moneyFormat)+' each</span>'
    );
  });
};

theme.onCartUpdate = function(e) {
  $.get('/cart?view=ajax', function(t) {
    $('.cart-ajax').html($(t).find('.cart-ajax').html());
  }).done(function() {
    theme.hideSideCartLoader();
    theme.updateCartCount();
    if(theme.onCartPage()) {
      theme.updateCartPage();

      $('.site-header__cart-count').removeClass('.site-header__cart-count--show');
    }
    theme.addUpsell();
    theme.updateCartPrices();
  });
};
theme.addItemFromForm = function(form_id,e) {
  $.ajax({
    type: 'POST', 
    url: '/cart/add.js',
    dataType: 'json', 
    data: $(form_id).serialize(),
    success: function(t) {
      "function" == typeof e ? e(t) : theme.addToCartOk()
    },
    error: function(t,v) {
      theme.addToCartFail(t,v);
    }
  });
};
theme.addFromAddBar = function(form_id,e) {
  $.ajax({
    type: 'POST', 
    url: '/cart/add.js',
    dataType: 'json', 
    data: $('#'+form_id).serialize(),
    success: theme.addToCartOk,
    error: function(t,v) {
      theme.addToCartFail(t,v);
    }
  });
};
theme.addItem = function(t, r, e) {
  var variant_id = t;
  theme.showSideCartLoader();

  //var $props = $(this).closest('form').find('[name^="properties"]');
  var r = r || 1,
      a = {
        type: "POST",
        url: "/cart/add.js",
        data: "quantity=" + r + "&id=" + t ,
        dataType: "json",
        success: function(t) {
          "function" == typeof e ? e(t) : theme.addToCartOk(t)
        },
        error: function(t, r) {
          //theme.onError(t, r)
          console.log('addItem Fail...theme.dealWithStockLimitsPDP');
          console.log(t,r);
          //theme.dealWithStockLimitsPDP(t,r);
          //theme.addToCartFail(t,r,variant_id);
        }
      };
  jQuery.ajax(a);
};

theme.isCartPage = function() {
  if (window.location.href.indexOf("/cart") > -1) {
    return true;
  } else {
    return false;
  }
};

theme.addToCartDisable = function() {
  $('#AddToCart-product-template').prop('disabled',true).addClass('is--loading');
};

theme.addToCartEnable = function() {
  $('#AddToCart-product-template').prop('disabled',false).removeClass('is--loading');
}

theme.addToCartOk = function(product) {
  $.get('/cart?view=ajax', function(t) {

    $('.cart-ajax').html($(t).find('.cart-ajax').html());
    if(theme.isCartPage()) {
      //alert("your url contains the name franky");
      theme.updateCartPage();
      $('.cart-ajax').removeClass('cart-ajax--show');
    } else {
      $('.cart-ajax').addClass('cart-ajax--show');
      setTimeout(function() {
        $('.cart-ajax').removeClass('cart-ajax--show');
      },5000);
    }

  }).done(function() {
    $('.product-single__errors').empty().hide();
    theme.updateCartCount();
    theme.addUpsell();
    theme.addToCartEnable();

  });
};

theme.productPageAdded = function() {
  $.get( "/cart?view=ajax", function(t) {
    //console.log('product added from add-bar!');
    $('.inline-cart--container').html(t);
    $('.site-header__cart').html($(t).find('.site-header__cart').html());

  }).done(function() {
    var completeTheSet = '#complete-the-set';
    if($(completeTheSet).length) {
      theme.RightDrawer.open();
      $.magnificPopup.close();
    } else {
      theme.RightDrawer.open();
      $.magnificPopup.close();
    }
    $('.btn--small-add').addClass('ready-to-add').text(addToCart);
    if(preOrder) {
      $('#AddToCart-product-template').text(preOrderText).addClass('ready-to-add');

    } else {
      $('#AddToCart-product-template').text(addToCart).addClass('ready-to-add');

    }
    if(theme.dev.showMultipleCurrencies) {
      //theme.currencySwitcher.ajaxrefresh();
    }

  });
};

theme.replaceContent = function(data,el) {
  $(el).html($(data).find(el).html());
};


theme.updateCartPage = function (cart) {
  $.get( "/cart", function( data ) {
    theme.replaceContent(data,'#shopify-section-cart-template table');
    theme.replaceContent(data,'.cart__subtotal-summary');
    //     $('#shopify-section-cart-template table').html($(data).find('#shopify-section-cart-template table').html());
    //     $('#shopify-section-cart-template table').html($(data).find('#shopify-section-cart-template table').html());
    theme.updateCartCount();
    //     console.log('theme.updateCartPage');

  }).done(function() {
    $('.cart-preloader').fadeOut();
    if(activeShippingCalc) {
      $('#shipping-calculator .get-rates').trigger('click');
    }
    if (window.Shopify && Shopify.StorefrontExpressButtons) {
      Shopify.StorefrontExpressButtons.initialize();
    }
    theme.updateCartPrices();
    theme.addUpsell();

  });
};


function getTimeRemaining(endtime) {
  var t = Date.parse(endtime) - Date.parse(new Date());
  var seconds = Math.floor( (t/1000) % 60 );
  var minutes = Math.floor( (t/1000/60) % 60 );
  var hours = Math.floor( (t/(1000*60*60)) % 24 );
  var days = Math.floor( t/(1000*60*60*24) );
  return {
    'total': t,
    'days': days,
    'hours': hours,
    'minutes': minutes,
    'seconds': seconds
  };
};

/* Pre Order Stuff */
var preorderClockSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 97 97"><path fill="#4a100b" d="M48.58 0C21.793 0 0 21.793 0 48.58s21.793 48.58 48.58 48.58 48.58-21.793 48.58-48.58S75.367 0 48.58 0zm0 86.823c-21.087 0-38.244-17.155-38.244-38.243S27.493 10.337 48.58 10.337 86.824 27.492 86.824 48.58 69.667 86.823 48.58 86.823z"/><path fill="#4a100b" d="M73.898 47.08H52.066V20.83a4 4 0 0 0-8 0v30.25a4 4 0 0 0 4 4h25.832a4 4 0 0 0 0-8z"/></svg>';


var presaleInterval;
theme.preorderProducts = function() {
  var hasPreorders = false;
  presaleInterval = setInterval(function() {
    $('.presale-clock').each(function(i,v) {
      var my = $(this);
      var $this = $(this);
      var countdownDate = new Date(my.data('end-date')).getTime();

      var now = new Date().getTime();
      var distance = countdownDate - now;

      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      days = ("0" + days).slice(-2);
      hours = ("0" + hours).slice(-2);
      minutes = ("0" + minutes).slice(-2);
      seconds = ("0" + seconds).slice(-2);

      $this.find('.days').text(days);
      $this.find('.hours').text(hours);
      $this.find('.minutes').text(minutes);
      $this.find('.seconds').text(seconds);


      // If the count down is finished, write some text 
      if (distance < 0) {
        var zeros = '00';
        //         $this.remove();
        $this.find('.days').text(zeros);
        $this.find('.hours').text(zeros);
        $this.find('.minutes').text(zeros);
        $this.find('.seconds').text(zeros);
      }
      $this.fadeTo('fast',1).addClass('presale-clock--running');

    });
  }, 1000);
};
theme.tweakPdpShippingBanner = function() {
  // Ships within 1-2 working days. Product is ready to be picked up 
  if($('body').hasClass('template-product')) {
    var newHTML = $('.product-single__presale-clock').html();
    $('.pdp-shipping-banner').html(newHTML).addClass('pdp-shipping-banner--pre-sale');
  }
}

if($('.presale-clock').length) {
  theme.tweakPdpShippingBanner();
  theme.preorderProducts();
}

theme.articlePrevNextShowHide = function() {
  $('.article__btn').each(function(i,v) {
    var $t = $(this);
    if($t.attr('href') == window.location.href || $t.attr('href') == '') {
      $t.addClass('hidden');
    } else {
      $t.removeClass('hidden');
    }
  });
}

theme.articleLinks = function() {
  //   console.log('theme.articleLinks');
  theme.articlePrevNextShowHide();
  $(document).on('click','.article__btn',function(e) {
    e.preventDefault();
    var $t = $(this),
        ajaxHref = $t.attr('href')+"?view=nolayout",
        $preloader = $('.page-preloader');
    $preloader.fadeIn('fast');
    $.get(ajaxHref,function(data) {
      var articleElement = '.article--main';
      $(articleElement).html($(data).find(articleElement).html());
      var title = $(data).filter('title').text();
      document.title = title;
      window.history.pushState({url: "" + ajaxHref + ""}, title, ajaxHref);
      theme.articlePrevNextShowHide();
      $preloader.fadeOut('fast');

    });
    return false;
  });
};

theme.PressPage = function() {
  if($('#shopify-section-press-template').length == 0) return; 
  var pressGrid = $('.press-grid').masonry({
    // set itemSelector so .grid-sizer is not used in layout
    itemSelector: '.press-grid__item',
    // use element for option
    columnWidth: '.press-grid__sizer',
    percentPosition: true,
    gutter: 60,
    stagger: 30
  });

  pressGrid.imagesLoaded().progress( function() {
    pressGrid.masonry('layout');
  });
  var moreBtn = '.press--load-more';
  $(document).on('click', moreBtn, function(e) {
    e.preventDefault();
    var ajaxhref = $(this).attr('href');
    //$('.pagination').remove();
    $(moreBtn).fadeOut();
    $.get(ajaxhref, function(data) {
      var newPressItems = $(data).find('.press-grid__item');
      var newPagination = $(data).find(moreBtn);
      $('.press-grid').append(newPressItems).masonry('appended', newPressItems);
      if(newPagination.length) {
        $(moreBtn).attr('href',newPagination.attr('href')).fadeIn();
      } else {
        //console.log('no mas pages');
        $(moreBtn).hide().remove();
      }
    }).done(function() {

    });

  });
};

theme.discountPages = function() {
  var activeClass = 'active';
  if($('.discount-page').length == 0) return;
  $('.accordion-heading').on('click',function() {
    var $t = $(this),
        $target = $('#'+$t.attr('aria-controls'));

    if($t.parent().hasClass(activeClass)) {
      $t.parent().removeClass(activeClass);
      $t.attr('aria-expanded',false);

    } else {
      $('.accordion-item').removeClass(activeClass);
      $('.accordion-heading').attr('aria-expanded',false);

      $t.parent().addClass(activeClass);
      $t.attr('aria-expanded',true);
    }


  });
}


theme.cookiesPopup = function() {
  var cookieCookie = getCookie('cookies'),
      $cookiesPopup = $('#cookies-popup');
  if(!cookieCookie) {
    setTimeout(function() {
      $cookiesPopup.fadeIn('fast');
      setCookie('cookies',1, {expires: theme.cookesPopupExpiration});
      setTimeout(function() {
        $cookiesPopup.fadeOut('slow');
      },6000);
    }, theme.cookesPopupDelay);
  }
};

theme.announcementBarSlider = function() {
  var announcementBarSlider = $('.announcement-bar__slider');
  announcementBarSlider.on('init', function(slick){
    $('.announcement-bar__message').fadeIn();
  });
  announcementBarSlider.slick({
    arrows: true,
    dots: false,
    autoplay: true
  });
};

theme.contactFormTweaks = function() {
  var descriptionInput = $('#ContactForm textarea');
  $('#ContactForm textarea').on({
    keydown: function(e) {
        if(e.key === ":") { // disallow semicolon
            return false;
        }
    }
  });
  
};

$(function() {
  theme.PressPage();
  theme.articleLinks();
  theme.cookiesPopup();
  theme.contactFormTweaks();

  theme.announcementBarSlider();

  $("img").mousedown(function(e){
    e.preventDefault()
  });
  $('a[href*="#"]:not([href="#"])').click(function(e) {
    //     console.log('click');
    e.preventDefault();
    var target = $(this).attr('href');
    if($(target).length) {
      $('html,body').animate({
        scrollTop: $(target).offset().top - $('#shopify-section-header').height()
      }, 250);
      return false;
    }
  });
  theme.discountPages();
  $('.fancy-select').select2({
    minimumResultsForSearch: 10
  }).css('opacity',0);

  $('#contact-selector').on('change',function(e) {
    var $t = $(this);
    var form = `#${$t.val()}`;
    $('.contact-forms__form').hide();
    $(form).fadeIn();
  });

});
$(window).load(function() {
  $(window).scroll();
  theme.addUpsell();
});




theme.capitalizeSentences = function(capText, capLock) {

  if(capLock == 1 || capLock == true){
    capText = capText.toLowerCase();
  }

  capText = capText.replace(/.n/g,".[-<br>-]. ");
  capText = capText.replace(/.sn/g,". [-<br>-]. ");
  var wordSplit = '. ';

  var wordArray = capText.split(wordSplit);

  var numWords = wordArray.length;

  for(x=0;x<numWords;x++) {
    wordArray[x] = wordArray[x].replace(wordArray[x].charAt(0),wordArray[x].charAt(0).toUpperCase());
    if(x==0) {
      capText = wordArray[x]+". ";
    }else if(x != numWords -1){
      capText = capText+wordArray[x]+". ";
    }else if(x == numWords -1){
      capText = capText+wordArray[x];
    }
  }
  capText = capText.replace(/[-<br>-].s/g,"n");
  capText = capText.replace(/sis/g," I ");
  return capText;
}


theme.findMySpecialOrderProduct = function(handle,qty,props,variantTitle) {
  $.get("/products/"+handle, function( data ) {
    $.each(data.product.variants,function(i,v) {
      var vt = variantTitle[0] + ' / 6˝ Jamb / No Screen';
      if(v.title.indexOf(vt) !== -1) {
        var myVariantID = data.product.variants[i].id;

      }
    });
  }).done(function() {
    return myVariantID;
  });;
};

theme.getAvailableQuantity = function(variantID) {
  var n = -1;
  $(cartJSON.results).each(function(i,v) {
    // If this variant is already in the cart tell us 
    if(variantID == v.variant_id && v.qty_total > 0) {
      n =  v.qty_available;
    } 
  });
  return n;
};


var itemAdded = false;

theme.addItemWithProps = function(v,q,p,c) {
  var q = q || 1
  p = p || {},
    a = {
    type: 'POST',
    url: '/cart/add.js',
    data: {
      id: v, 
      quantity: q, 
      properties: p
    },
    dataType: 'json',
    success: function(t) {
      itemAdded = true;
      "function" == typeof e ? e(t) : theme.addToCartOk(t)
    },
    error: function(t,r) {
      //           console.log(t,r);
    }
  };
  jQuery.ajax(a);

};

theme.getWholesalePrice = function(regularPrice) {
  return regularPrice * theme.wholesale.percentOff;
};
theme.getWholesaleDollarsSaved = function(salePrice,regularPrice) {
  return Math.abs(regularPrice - salePrice);

};
theme.getWholesalePercentageSaved = function(p,a) {
  return theme.wholesale.discount;
};

function enableDisableCheckoutButton() {
  if($('#read-agreed:checked').length) {
    $('#big-checkout-button').prop('disabled',false).removeClass('disabled');
    $('.checkout-check').fadeOut();
    $('.read-agreed--wrapper').removeClass('error');
    //     $('#zapietDuplicate').removeClass('error');
    checkoutChecks();
  } else {
    checkoutChecks();
    $('#big-checkout-button').addClass('disabled',true);
    $('.checkout-check').fadeIn();
  }
}

function checkoutChecks() {
  $('#read-agreed:checked').length ? $('.read-agreed--wrapper').removeClass('error') : $('.read-agreed--wrapper').addClass('error');
  $('#read-agreed:checked').length ? $('.complete-step2').hide() : $('.complete-step2').show();
}

$(function(){
  var countdown_timer = $('.count_down-timer');
  if (countdown_timer.length) {
    countdown_timer.each(function(index, item){
      var siCountDown = setInterval(function(){
        var time = $(item).data('count_down-time');
        const startDate = new Date();
        const endDate = new Date(`${time} 00:00:00`);
        var seconds = (endDate.getTime() - startDate.getTime());
        if (seconds/1000 > 0) {
          var Difference_In_Days = seconds / (1000 * 3600 * 24);
          seconds = seconds/1000;
          var day = Math.floor(seconds/60/60/24);
          var hour = Math.floor((seconds - day*60*60*24)/60/60);
          var minute = Math.floor((seconds - day*60*60*24 - hour*60*60)/60);
          var second = Math.floor((seconds - day*60*60*24 - hour*60*60 - minute*60));
          $(item).text(`${day}d : ${hour}h : ${minute}m : ${second}s`);
        }
      },1000);
    });
  }
});
