window.theme = window.theme || {};

theme.config = {
  isTouch:
    "ontouchstart" in window ||
    (window.DocumentTouch && window.document instanceof DocumentTouch) ||
    window.navigator.maxTouchPoints ||
    window.navigator.msMaxTouchPoints
      ? true
      : false,
};

if (theme.config.isTouch) {
  document.documentElement.className += " supports-touch";
}

/* ================ Theme Editor API ================ */
window.theme = window.theme || {};

theme.delegate = {
  on: function (event, callback, options) {
    if (!this.namespaces)
      // save the namespaces on the DOM element itself
      this.namespaces = {};

    this.namespaces[event] = callback;
    options = options || false;

    this.addEventListener(event.split(".")[0], callback, options);
    return this;
  },
  off: function (event) {
    if (!this.namespaces) {
      return;
    }
    this.removeEventListener(event.split(".")[0], this.namespaces[event]);
    delete this.namespaces[event];
    return this;
  },
};

// Extend the DOM with these above custom methods
window.on = Element.prototype.on = theme.delegate.on;
window.off = Element.prototype.off = theme.delegate.off;

theme.utils = {
  defaultTo: function (value, defaultValue) {
    return value == null || value !== value ? defaultValue : value;
  },

  wrap: function (el, wrapper) {
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
  },

  debounce: function (wait, callback, immediate) {
    var timeout;
    return function () {
      var context = this,
        args = arguments;
      var later = function () {
        timeout = null;
        if (!immediate) callback.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) callback.apply(context, args);
    };
  },

  throttle: function (limit, callback) {
    var waiting = false;
    return function () {
      if (!waiting) {
        callback.apply(this, arguments);
        waiting = true;
        setTimeout(function () {
          waiting = false;
        }, limit);
      }
    };
  },

  prepareTransition: function (el, callback) {
    el.addEventListener("transitionend", removeClass);

    function removeClass(evt) {
      el.classList.remove("is-transitioning");
      el.removeEventListener("transitionend", removeClass);
    }

    el.classList.add("is-transitioning");
    el.offsetWidth; // check offsetWidth to force the style rendering

    if (typeof callback === "function") {
      callback();
    }
  },

  // _.compact from lodash
  // Creates an array with all falsey values removed. The values `false`, `null`,
  // `0`, `""`, `undefined`, and `NaN` are falsey.
  // _.compact([0, 1, false, 2, '', 3]);
  // => [1, 2, 3]
  compact: function (array) {
    var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

    while (++index < length) {
      var value = array[index];
      if (value) {
        result[resIndex++] = value;
      }
    }
    return result;
  },

  serialize: function (form) {
    var arr = [];
    Array.prototype.slice.call(form.elements).forEach(function (field) {
      if (
        !field.name ||
        field.disabled ||
        ["file", "reset", "submit", "button"].indexOf(field.type) > -1
      )
        return;
      if (field.type === "select-multiple") {
        Array.prototype.slice.call(field.options).forEach(function (option) {
          if (!option.selected) return;
          arr.push(
            encodeURIComponent(field.name) +
              "=" +
              encodeURIComponent(option.value)
          );
        });
        return;
      }
      if (["checkbox", "radio"].indexOf(field.type) > -1 && !field.checked)
        return;
      arr.push(
        encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value)
      );
    });
    return arr.join("&");
  },
};

theme.a11y = {
  trapFocus: function (options) {
    var eventsName = {
      focusin: options.namespace ? "focusin." + options.namespace : "focusin",
      focusout: options.namespace
        ? "focusout." + options.namespace
        : "focusout",
      keydown: options.namespace
        ? "keydown." + options.namespace
        : "keydown.handleFocus",
    };

    // Get every possible visible focusable element
    var focusableEls = options.container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex^="-"])'
    );
    var elArray = [].slice.call(focusableEls);
    var focusableElements = elArray.filter((el) => el.offsetParent !== null);

    var firstFocusable = focusableElements[0];
    var lastFocusable = focusableElements[focusableElements.length - 1];

    if (!options.elementToFocus) {
      options.elementToFocus = options.container;
    }

    options.container.setAttribute("tabindex", "-1");
    options.elementToFocus.focus();

    document.documentElement.off("focusin");
    document.documentElement.on(eventsName.focusout, function () {
      document.documentElement.off(eventsName.keydown);
    });

    document.documentElement.on(eventsName.focusin, function (evt) {
      if (evt.target !== lastFocusable && evt.target !== firstFocusable) return;

      document.documentElement.on(eventsName.keydown, function (evt) {
        _manageFocus(evt);
      });
    });

    function _manageFocus(evt) {
      if (evt.keyCode !== 9) return;
      /**
       * On the first focusable element and tab backward,
       * focus the last element
       */
      if (evt.target === firstFocusable && evt.shiftKey) {
        evt.preventDefault();
        lastFocusable.focus();
      }
    }
  },
  removeTrapFocus: function (options) {
    var eventName = options.namespace
      ? "focusin." + options.namespace
      : "focusin";

    if (options.container) {
      options.container.removeAttribute("tabindex");
    }

    document.documentElement.off(eventName);
  },

  lockMobileScrolling: function (namespace, element) {
    var el = element ? element : document.documentElement;
    document.documentElement.classList.add("lock-scroll");
    el.on("touchmove" + namespace, function () {
      return true;
    });
  },

  unlockMobileScrolling: function (namespace, element) {
    document.documentElement.classList.remove("lock-scroll");
    var el = element ? element : document.documentElement;
    el.off("touchmove" + namespace);
  },
};

theme.Sections = function Sections() {
  this.constructors = {};
  this.instances = [];

  document.addEventListener(
    "shopify:section:load",
    this._onSectionLoad.bind(this)
  );
  document.addEventListener(
    "shopify:section:unload",
    this._onSectionUnload.bind(this)
  );
  document.addEventListener(
    "shopify:section:select",
    this._onSelect.bind(this)
  );
  document.addEventListener(
    "shopify:section:deselect",
    this._onDeselect.bind(this)
  );
  document.addEventListener(
    "shopify:block:select",
    this._onBlockSelect.bind(this)
  );
  document.addEventListener(
    "shopify:block:deselect",
    this._onBlockDeselect.bind(this)
  );
};

theme.Sections.prototype = Object.assign({}, theme.Sections.prototype, {
  _createInstance: function (container, constructor) {
    var id = container.getAttribute("data-section-id");
    var type = container.getAttribute("data-section-type");

    constructor = constructor || this.constructors[type];

    if (typeof constructor === "undefined") {
      return;
    }

    var instance = Object.assign(new constructor(container), {
      id: id,
      type: type,
      container: container,
    });

    this.instances.push(instance);
  },

  _onSectionLoad: function (evt) {
    var container = document.querySelector(
      '[data-section-id="' + evt.detail.sectionId + '"]'
    );

    if (container) {
      this._createInstance(container);
    }
  },

  _onSectionUnload: function (evt) {
    this.instances = this.instances.filter(function (instance) {
      var isEventInstance = instance.id === evt.detail.sectionId;

      if (isEventInstance) {
        if (typeof instance.onUnload === "function") {
          instance.onUnload(evt);
        }
      }

      return !isEventInstance;
    });
  },

  _onSelect: function (evt) {
    // eslint-disable-next-line no-shadow
    var instance = this.instances.find(function (instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (
      typeof instance !== "undefined" &&
      typeof instance.onSelect === "function"
    ) {
      instance.onSelect(evt);
    }
  },

  _onDeselect: function (evt) {
    // eslint-disable-next-line no-shadow
    var instance = this.instances.find(function (instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (
      typeof instance !== "undefined" &&
      typeof instance.onDeselect === "function"
    ) {
      instance.onDeselect(evt);
    }
  },

  _onBlockSelect: function (evt) {
    // eslint-disable-next-line no-shadow
    var instance = this.instances.find(function (instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (
      typeof instance !== "undefined" &&
      typeof instance.onBlockSelect === "function"
    ) {
      instance.onBlockSelect(evt);
    }
  },

  _onBlockDeselect: function (evt) {
    // eslint-disable-next-line no-shadow
    var instance = this.instances.find(function (instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (
      typeof instance !== "undefined" &&
      typeof instance.onBlockDeselect === "function"
    ) {
      instance.onBlockDeselect(evt);
    }
  },

  register: function (type, constructor) {
    this.constructors[type] = constructor;

    document.querySelectorAll('[data-section-type="' + type + '"]').forEach(
      function (container) {
        this._createInstance(container, constructor);
      }.bind(this)
    );
  },
});

// Utilities
const serializeForm = (form) => {
  const obj = {};
  const formData = new FormData(form);

  for (const key of formData.keys()) {
    const regex = /(?:^(properties\[))(.*?)(?:\]$)/;

    if (regex.test(key)) {
      obj.properties = obj.properties || {};
      obj.properties[regex.exec(key)[2]] = formData.get(key);
    } else {
      obj[key] = formData.get(key);
    }
  }

  return JSON.stringify(obj);
};

function fetchConfig(type = "json") {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: `application/${type}`,
    },
  };
}

theme.Dom = (function() {
  /**
   * Get all the previous and next siblings, optionally filtered by a selector
  */
  function getSiblings(element, filter) {
    var includeSelf = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var siblings = [];
    var currentElement = element; // Do the previous first

    while (currentElement = currentElement.previousElementSibling) {
      if (!filter || currentElement.matches(filter)) {
        siblings.push(currentElement);
      }
    }

    if (includeSelf) {
      siblings.push(element);
    } // Then the next side


    currentElement = element;

    while (currentElement = currentElement.nextElementSibling) {
      if (!filter || currentElement.matches(filter)) {
        siblings.push(currentElement);
      }
    }

    return siblings;
  }

  /**
     * By default, NodeList object are only iterable with forEach on newest browsers. To support it cross-browser,
     * we need to normalize it
     */
  function nodeListToArray(nodeList, filter) {
    var items = [];

    for (var i = 0; i !== nodeList.length; ++i) {
      if (!filter || nodeList[i].matches(filter)) {
        items.push(nodeList[i]);
      }
    }

    return items;
  }

  /**
     * Calculate an element width with its margin
     */
  function outerWidthWithMargin(element) {
    var width = element.offsetWidth,
        style = getComputedStyle(element);
    width += parseInt(style.marginLeft) + parseInt(style.marginRight);
    return width;
  }

  /**
   * Calculate an element height with its margin
   */
  function outerHeightWithMargin(element) {
    var height = element.offsetHeight,
        style = getComputedStyle(element);
    height += parseInt(style.marginTop) + parseInt(style.marginBottom);
    return height;
  }

  return {
    getSiblings: getSiblings,
    nodeListToArray: nodeListToArray,
    outerWidthWithMargin: outerWidthWithMargin,
    outerHeightWithMargin: outerHeightWithMargin
  };
})();


theme.Drawers = (function () {
  function Drawers(id, name) {
    this.config = {
      id: id,
      close: ".js-drawer-close",
      open: ".js-drawer-open-" + name,
      openClass: "js-drawer-open",
      closingClass: "js-drawer-closing",
      activeDrawer: "drawer--is-open",
      namespace: ".drawer-" + name,
    };

    this.nodes = {
      page: document.querySelector("#main"),
    };

    this.drawer = document.querySelector("#" + id);
    this.isOpen = false;

    if (!this.drawer) {
      return;
    }

    this.init();
  }

  Drawers.prototype = Object.assign({}, Drawers.prototype, {
    init: function () {
      // Setup open button(s)
      document.querySelectorAll(this.config.open).forEach((openBtn) => {
        openBtn.setAttribute("aria-expanded", "false");
        openBtn.addEventListener("click", this.open.bind(this));
      });

      this.drawer
        .querySelector(this.config.close)
        .addEventListener("click", this.close.bind(this));

      // Close modal if a drawer is opened
      document.addEventListener(
        "modalOpen",
        function () {
          this.close();
        }.bind(this)
      );
    },

    open: function (evt, returnFocusEl) {
      if (evt) {
        evt.preventDefault();
      }

      if (this.isOpen) {
        return;
      }

      // Without this the drawer opens, the click event bubbles up to $nodes.page which closes the drawer.
      if (evt && evt.stopPropagation) {
        evt.stopPropagation();
        // save the source of the click, we'll focus to this on close
        evt.currentTarget.setAttribute("aria-expanded", "true");
        this.activeSource = evt.currentTarget;
      } else if (returnFocusEl) {
        returnFocusEl.setAttribute("aria-expanded", "true");
        this.activeSource = returnFocusEl;
      }

      theme.utils.prepareTransition(
        this.drawer,
        function () {
          this.drawer.classList.add(this.config.activeDrawer);
        }.bind(this)
      );

      document.documentElement.classList.add(this.config.openClass);
      this.isOpen = true;

      theme.a11y.trapFocus({
        container: this.drawer,
        namespace: "drawer_focus",
      });

      document.dispatchEvent(new CustomEvent("drawerOpen"));
      document.dispatchEvent(new CustomEvent("drawerOpen." + this.config.id));

      this.bindEvents();
    },

    close: function (evt) {
      if (!this.isOpen) {
        return;
      }

      // Do not close if click event came from inside drawer
      if (evt) {
        if (evt.target.closest(".js-drawer-close")) {
          // Do not close if using the drawer close button
        } else if (evt.target.closest(".drawer")) {
          return;
        }
      }

      // deselect any focused form elements
      document.activeElement.blur();

      theme.utils.prepareTransition(
        this.drawer,
        function () {
          this.drawer.classList.remove(this.config.activeDrawer);
        }.bind(this)
      );

      document.documentElement.classList.remove(this.config.openClass);
      document.documentElement.classList.add(this.config.closingClass);

      window.setTimeout(
        function () {
          document.documentElement.classList.remove(this.config.closingClass);
          if (
            this.activeSource &&
            this.activeSource.getAttribute("aria-expanded")
          ) {
            this.activeSource.setAttribute("aria-expanded", "false");
            this.activeSource.focus();
          }
        }.bind(this),
        500
      );

      this.isOpen = false;

      theme.a11y.removeTrapFocus({
        container: this.drawer,
        namespace: "drawer_focus",
      });

      this.unbindEvents();
    },

    bindEvents: function () {
      // Clicking out of drawer closes it
      window.on(
        "click" + this.config.namespace,
        function (evt) {
          this.close(evt);
          return;
        }.bind(this)
      );

      // Pressing escape closes drawer
      window.on(
        "keyup" + this.config.namespace,
        function (evt) {
          if (evt.keyCode === 27) {
            this.close();
          }
        }.bind(this)
      );

      theme.a11y.lockMobileScrolling(this.config.namespace, this.nodes.page);
    },

    unbindEvents: function () {
      window.off("click" + this.config.namespace);
      window.off("keyup" + this.config.namespace);

      theme.a11y.unlockMobileScrolling(this.config.namespace, this.nodes.page);
    },
  });

  return Drawers;
})();

theme.CartDrawer = (function () {
  var selectors = {
    drawer: "#CartDrawer",
    form: "#CartDrawerForm",
  };

  function CartDrawer() {
    this.form = document.querySelector(selectors.form);
    this.drawer = new theme.Drawers("CartDrawer", "cart");

    this.init();
  }

  CartDrawer.prototype = Object.assign({}, CartDrawer.prototype, {
    init: function () {
      document.addEventListener(
        "product:added",
        function (evt) {
          this.open();
        }.bind(this)
      );

      // Dev-friendly way to open cart
      document.addEventListener("cart:open", this.open.bind(this));
      document.addEventListener("cart:close", this.close.bind(this));
    },

    open: function () {
      this.drawer.open();
    },

    close: function () {
      this.drawer.close();
    },
  });

  return CartDrawer;
})();

theme.CartDrawerAjax = /*#__PURE__*/ (function () {
  function CartDrawerAjax(container) {
    this.element = container;
    this.delegateElement = new Delegate(this.element);
    this.documentDelegate = new Delegate(document.documentElement);
    this.options = JSON.parse(
      this.element.getAttribute("data-section-settings")
    );
    this.itemCount = this.options["itemCount"];

    if (this.options["drawer"]) {
      if (!document.body.classList.contains("template-cart")) {
        this.sidebarDrawer = new theme.CartDrawer();
      }
    }

    this._attachListeners();
  }

  CartDrawerAjax.prototype = Object.assign({}, CartDrawerAjax.prototype, {
    onUnload: function onUnload() {
      this.delegateElement.off();
      document.removeEventListener(
        "product:added",
        this._onProductAddedListener
      );
    },

    _attachListeners: function _attachListeners() {
      this._onProductAddedListener = this._onProductAdded.bind(this);

      if (this.options["type"] === "flyout") {
        this.delegateElement.on(
          "click",
          '[data-action="update-item-quantity"], [data-action="remove-item"]',
          this._updateItemQuantity.bind(this)
        );
        this.delegateElement.on(
          "change",
          ".QuantitySelector__CurrentQuantity",
          this._updateItemQuantity.bind(this)
        );
      } else {
        this.delegateElement.on(
          "change",
          ".QuantitySelector__CurrentQuantity",
          this._reloadPageWithQuantity.bind(this)
        );
      } // We have some listeners that are specific to the fact it's a drawer or the dedicated cart page

      document.addEventListener("product:added", this._onProductAddedListener); // We attach a listener at page level which allows to re-render the cart

      this.documentDelegate.on(
        "cart:refresh",
        this._rerenderCart.bind(this, false)
      );
    },

    _updateItemQuantity: function _updateItemQuantity(event, target) {
      var _this2 = this;

      document.dispatchEvent(new CustomEvent("theme:loading:start"));
      var quantity = null,
        elementToAnimate = null;

      if (target.tagName === "INPUT") {
        quantity = parseInt(Math.max(parseInt(target.value) || 1, 1));
      } else {
        quantity = parseInt(target.getAttribute("data-quantity"));
      } // If the quantity is 0, then we will animate the product with a removal effect

      if (quantity === 0) {
        elementToAnimate = target.closest(".CartItemWrapper");
      }

      fetch("".concat(window.routes.cart_change_url, ".js"), {
        body: JSON.stringify({
          line: target.getAttribute("data-line"),
          quantity: quantity,
        }),
        credentials: "same-origin",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest", // This is needed as currently there is a bug in Shopify that assumes this header
        },
      }).then(function (cart) {
        cart.json().then(function (content) {
          _this2.itemCount = content["item_count"];

          _this2._rerenderCart(elementToAnimate);

          document.dispatchEvent(new CustomEvent("theme:loading:end"));
        });
      });
      event.preventDefault();
    },

    _reloadPageWithQuantity: function _reloadPageWithQuantity(event, target) {
      window.location.href = ""
        .concat(window.routes.cart_change_url, "?quantity=")
        .concat(parseInt(target.value), "&line=")
        .concat(target.getAttribute("data-line"));
    },

    _onProductAdded: function _onProductAdded(event) {
      var _this3 = this;

      this.itemCount += event.detail.quantity;

      this._rerenderCart().then(function () {
        _this3.sidebarDrawer.open();
      });
    },

    /**
     * This method is called internally to rerender the cart, based on the content returned by Shopify Ajax API.
     * We could save some performance by updating directly in JavaScript instead of doing a GET call to get the HTML
     * from Shopify, but by experience, this allows for easier app integration as it allows the Liquid to re-run
     * all the time and hence having easier logic.
     */

    _rerenderCart: function _rerenderCart(elementToAnimate) {
      var _this4 = this;

      // Note: appending a timestamp is necessary as the polyfill on IE11 and lower does not support the "cache" property
      return fetch(
        ""
          .concat(window.routes.cartUrl, "?section_id=")
          .concat(
            this.options["drawer"] && window.theme.pageType !== "cart"
              ? "cart-drawer"
              : "template--cart"
          ),
        {
          credentials: "same-origin",
          method: "GET",
        }
      ).then(function (content) {
        content.text().then(function (html) {
          _this4._replaceContent(html);
        });
      });
    },

    _replaceContent: function _replaceContent(html) {
      var _this5 = this;

      var tempElement = document.createElement("div");
      tempElement.innerHTML = html;
      var cartNodeParent = this.element.querySelector(".Cart").parentNode;

      if (this.options["drawer"] && window.theme.pageType !== "cart") {
        var currentScrollPosition =
          this.element.querySelector(".Drawer__Main").scrollTop;
        cartNodeParent.replaceChild(
          tempElement.querySelector(".Cart"),
          this.element.querySelector(".Cart")
        );
        this.element.querySelector(".Drawer__Main").scrollTop =
          currentScrollPosition;
      }

      // We can also update the dot and the quantity
      var cartResult = JSON.parse(
        tempElement
          .querySelector('[data-section-type="cart-drawer"]')
          .getAttribute("data-section-settings")
      );
      var cartDot = theme.Dom.nodeListToArray(
        document.querySelectorAll(".cart-item-count-header")
      );

      this.itemCount = cartResult["itemCount"];
      
      cartDot.forEach(function (item) {
        item.textContent = _this5.itemCount;
      });
    },
  });

  return CartDrawerAjax;
})();

if (!customElements.get("product-form")) {
  customElements.define(
    "product-form",
    class ProductForm extends HTMLElement {
      constructor() {
        super();

        this.form = this.querySelector("form");
        this.form.addEventListener("submit", this.onSubmitHandler.bind(this));
      }

      onSubmitHandler(evt) {
        evt.preventDefault();
        const submitButton = this.querySelector('[type="submit"]');
        if (submitButton.classList.contains("loading")) return;

        this.handleErrorMessage();

        submitButton.setAttribute("aria-disabled", true);
        submitButton.classList.add("loading");

        const config = fetchConfig('javascript');
        config.headers['X-Requested-With'] = 'XMLHttpRequest';
        delete config.headers['Content-Type'];

        const formData = new FormData(this.form);
        formData.append('sections_url', window.location.pathname);
        config.body = formData;

        fetch(`${routes.cart_add_url}`, config)
          .then((response) => response.json())
          .then((response) => {
            if (response.status) {
              this.handleErrorMessage(response.description);
              return;
            }

            if (window.theme.cartType === "flyout") {
              var quantityElement =
                this.form.querySelector('[name="quantity"]');
              // We simply trigger an event so the mini-cart can re-render
              this.dispatchEvent(
                new CustomEvent("product:added", {
                  bubbles: true,
                  detail: {
                    quantity: quantityElement
                      ? parseInt(quantityElement.value)
                      : 1,
                  },
                })
              );
            }

            // We manually trigger popup close.
            document.dispatchEvent(new CustomEvent("productmodal:close"));
          })
          .catch((e) => {
            console.error(e);
          })
          .finally(() => {
            submitButton.classList.remove("loading");
            submitButton.removeAttribute("aria-disabled");

            // We manually trigger popup close.
            document.dispatchEvent(new CustomEvent("productmodal:close"));
          });
      }

      handleErrorMessage(errorMessage = false) {
        this.errorMessageWrapper =
          this.errorMessageWrapper ||
          this.querySelector(".product-form__error-message-wrapper");
        this.errorMessage =
          this.errorMessage ||
          this.errorMessageWrapper.querySelector(
            ".product-form__error-message"
          );

        this.errorMessageWrapper.toggleAttribute("hidden", !errorMessage);

        if (errorMessage) {
          this.errorMessage.textContent = errorMessage;
        }
      }
    }
  );
}

// Intialize all function on DOMLoaded
document.addEventListener("DOMContentLoaded", function () {
  var sections = new theme.Sections();

  sections.register("cart-drawer", theme.CartDrawerAjax);

  // Page Loaded Event
  document.dispatchEvent(new CustomEvent("page:loaded"));
});
