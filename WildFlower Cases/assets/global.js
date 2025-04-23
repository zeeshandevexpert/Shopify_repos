var Shopify = Shopify || {};
(Shopify.money_format = "${{amount}}"),
  (Shopify.formatMoney = function (a, o) {
    "string" == typeof a && (a = a.replace(".", ""));
    var e = "",
      t = /\{\{\s*(\w+)\s*\}\}/,
      o = o || this.money_format;
    function r(a, o) {
      return void 0 === a ? o : a;
    }
    function n(a, o, e, t) {
      if (
        ((o = r(o, 2)), (e = r(e, ",")), (t = r(t, ".")), isNaN(a) || null == a)
      )
        return 0;
      a = (a = (a / 100).toFixed(o)).split(".");
      return (
        a[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + e) +
        (a[1] ? t + a[1] : "")
      );
    }
    switch (o.match(t)[1]) {
      case "amount":
        e = n(a, 2);
        break;
      case "amount_no_decimals":
        e = n(a, 0);
        break;
      case "amount_with_comma_separator":
        e = n(a, 2, ".", ",");
        break;
      case "amount_no_decimals_with_comma_separator":
        e = n(a, 0, ".", ",");
    }
    return o.replace(t, e);
  });

function getFocusableElements(container) {
  return Array.from(
    container.querySelectorAll(
      "summary, a[href], button:enabled, [tabindex]:not([tabindex^='-']), [draggable], area, input:not([type=hidden]):enabled, select:enabled, textarea:enabled, object, iframe"
    )
  );
}
let megaMenuOpen = false;
document.querySelectorAll('[id^="Details-"] summary').forEach((summary) => {
  summary.setAttribute("role", "button");
  summary.setAttribute(
    "aria-expanded",
    summary.parentNode.hasAttribute("open")
  );

  if (summary.nextElementSibling.getAttribute("id")) {
    summary.setAttribute("aria-controls", summary.nextElementSibling.id);
  }

  summary.addEventListener("click", (event) => {
    event.currentTarget.setAttribute(
      "aria-expanded",
      !event.currentTarget.closest("details").hasAttribute("open")
    );
  });

  if (summary.closest("header-drawer")) return;
  summary.parentElement.addEventListener("keyup", onKeyUpEscape);
});

const setHeaderHeight = () => {
  document
    .getElementsByTagName("html")[0]
    .style.setProperty(
      "--header-height",
      document.getElementById("shopify-section-header").offsetHeight + "px"
    );
};
setHeaderHeight();

const replaceAll = (string, search, replace) => {
  return string.split(search).join(replace);
};

const imgUrl = (src, size) => {
  return src
    .replace(
      /_(pico|icon|thumb|small|compact|medium|large|grande|original|1024x1024|2048x2048|master)+\./g,
      "."
    )
    .replace(/\.jpg|\.png|\.gif|\.jpeg/g, function (match) {
      return "_" + size + match;
    });
};

const updateSrcSet = (img, newSrc) => {
  const srcset = img.getAttribute("srcset");
  const src = img.getAttribute("src");
  const filename = srcset.split(",")[0].split("/").pop().split("?")[0];
  const newFilename = newSrc.split("/").pop().split("?")[0];
  const newSrcSet = srcset.replaceAll(filename, newFilename);
  const newSrcVal = src.replace(filename, newFilename);
  img.setAttribute("src", newSrcVal);
  img.setAttribute("srcset", newSrcSet);
};

const trapFocusHandlers = {};

const getCookie = (name) => {
  var v = document.cookie.match("(^|;) ?" + name + "=([^;]*)(;|$)");
  return v ? v[2] : false;
};

const setCookie = (name, value, days) => {
  var d = new Date();
  d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days);
  document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
};

function trapFocus(container, elementToFocus = container) {
  var elements = getFocusableElements(container);
  var first = elements[0];
  var last = elements[elements.length - 1];

  removeTrapFocus();

  trapFocusHandlers.focusin = (event) => {
    if (
      event.target !== container &&
      event.target !== last &&
      event.target !== first
    )
      return;

    document.addEventListener("keydown", trapFocusHandlers.keydown);
  };

  trapFocusHandlers.focusout = function () {
    document.removeEventListener("keydown", trapFocusHandlers.keydown);
  };

  trapFocusHandlers.keydown = function (event) {
    if (event.code.toUpperCase() !== "TAB") return; // If not TAB key
    // On the last focusable element and tab forward, focus the first element.
    if (event.target === last && !event.shiftKey) {
      event.preventDefault();
      first.focus();
    }

    //  On the first focusable element and tab backward, focus the last element.
    if (
      (event.target === container || event.target === first) &&
      event.shiftKey
    ) {
      event.preventDefault();
      last.focus();
    }
  };

  document.addEventListener("focusout", trapFocusHandlers.focusout);
  document.addEventListener("focusin", trapFocusHandlers.focusin);

  elementToFocus.focus();
}

// Here run the querySelector to figure out if the browser supports :focus-visible or not and run code based on it.
try {
  document.querySelector(":focus-visible");
} catch (e) {
  focusVisiblePolyfill();
}

function focusVisiblePolyfill() {
  const navKeys = [
    "ARROWUP",
    "ARROWDOWN",
    "ARROWLEFT",
    "ARROWRIGHT",
    "TAB",
    "ENTER",
    "SPACE",
    "ESCAPE",
    "HOME",
    "END",
    "PAGEUP",
    "PAGEDOWN",
  ];
  let currentFocusedElement = null;
  let mouseClick = null;

  window.addEventListener("keydown", (event) => {
    if (navKeys.includes(event.code.toUpperCase())) {
      mouseClick = false;
    }
  });

  window.addEventListener("mousedown", (event) => {
    mouseClick = true;
  });

  window.addEventListener(
    "focus",
    () => {
      if (currentFocusedElement)
        currentFocusedElement.classList.remove("focused");

      if (mouseClick) return;

      currentFocusedElement = document.activeElement;
      currentFocusedElement.classList.add("focused");
    },
    true
  );
}

function pauseAllMedia() {
  document.querySelectorAll(".js-youtube").forEach((video) => {
    video.contentWindow.postMessage(
      '{"event":"command","func":"' + "pauseVideo" + '","args":""}',
      "*"
    );
  });
  document.querySelectorAll(".js-vimeo").forEach((video) => {
    video.contentWindow.postMessage('{"method":"pause"}', "*");
  });
  document.querySelectorAll("video").forEach((video) => video.pause());
  document.querySelectorAll("product-model").forEach((model) => {
    if (model.modelViewerUI) model.modelViewerUI.pause();
  });
}

function removeTrapFocus(elementToFocus = null) {
  document.removeEventListener("focusin", trapFocusHandlers.focusin);
  document.removeEventListener("focusout", trapFocusHandlers.focusout);
  document.removeEventListener("keydown", trapFocusHandlers.keydown);

  if (elementToFocus) elementToFocus.focus();
}

function onKeyUpEscape(event) {
  if (event.code.toUpperCase() !== "ESCAPE") return;

  const openDetailsElement = event.target.closest("details[open]");
  if (!openDetailsElement) return;

  const summaryElement = openDetailsElement.querySelector("summary");
  openDetailsElement.removeAttribute("open");
  summaryElement.setAttribute("aria-expanded", false);
  summaryElement.focus();
}

class QuantityInput extends HTMLElement {
  constructor() {
    super();
    this.input = this.querySelector("input");
    this.changeEvent = new Event("change", { bubbles: true });

    this.querySelectorAll("button").forEach((button) =>
      button.addEventListener("click", this.onButtonClick.bind(this))
    );
  }

  onButtonClick(event) {
    event.preventDefault();
    const previousValue = this.input.value;

    event.target.name === "plus" ? this.input.stepUp() : this.input.stepDown();
    if (previousValue !== this.input.value)
      this.input.dispatchEvent(this.changeEvent);
  }
}

customElements.define("quantity-input", QuantityInput);

function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

function fetchConfig(type = "json") {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: `application/${type}`,
    },
  };
}

/*
 * Shopify Common JS
 *
 */
if (typeof window.Shopify == "undefined") {
  window.Shopify = {};
}

Shopify.bind = function (fn, scope) {
  return function () {
    return fn.apply(scope, arguments);
  };
};

Shopify.setSelectorByValue = function (selector, value) {
  for (var i = 0, count = selector.options.length; i < count; i++) {
    var option = selector.options[i];
    if (value == option.value || value == option.innerHTML) {
      selector.selectedIndex = i;
      return i;
    }
  }
};

Shopify.addListener = function (target, eventName, callback) {
  target.addEventListener
    ? target.addEventListener(eventName, callback, false)
    : target.attachEvent("on" + eventName, callback);
};

Shopify.postLink = function (path, options) {
  options = options || {};
  var method = options["method"] || "post";
  var params = options["parameters"] || {};

  var form = document.createElement("form");
  form.setAttribute("method", method);
  form.setAttribute("action", path);

  for (var key in params) {
    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", key);
    hiddenField.setAttribute("value", params[key]);
    form.appendChild(hiddenField);
  }
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
};

Shopify.CountryProvinceSelector = function (
  country_domid,
  province_domid,
  options
) {
  this.countryEl = document.getElementById(country_domid);
  this.provinceEl = document.getElementById(province_domid);
  this.provinceContainer = document.getElementById(
    options["hideElement"] || province_domid
  );

  Shopify.addListener(
    this.countryEl,
    "change",
    Shopify.bind(this.countryHandler, this)
  );

  this.initCountry();
  this.initProvince();
};

Shopify.CountryProvinceSelector.prototype = {
  initCountry: function () {
    var value = this.countryEl.getAttribute("data-default");
    Shopify.setSelectorByValue(this.countryEl, value);
    this.countryHandler();
  },

  initProvince: function () {
    var value = this.provinceEl.getAttribute("data-default");
    if (value && this.provinceEl.options.length > 0) {
      Shopify.setSelectorByValue(this.provinceEl, value);
    }
  },

  countryHandler: function (e) {
    var opt = this.countryEl.options[this.countryEl.selectedIndex];
    var raw = opt.getAttribute("data-provinces");
    var provinces = JSON.parse(raw);

    this.clearOptions(this.provinceEl);
    if (provinces && provinces.length == 0) {
      this.provinceContainer.style.display = "none";
    } else {
      for (var i = 0; i < provinces.length; i++) {
        var opt = document.createElement("option");
        opt.value = provinces[i][0];
        opt.innerHTML = provinces[i][1];
        this.provinceEl.appendChild(opt);
      }

      this.provinceContainer.style.display = "";
    }
  },

  clearOptions: function (selector) {
    while (selector.firstChild) {
      selector.removeChild(selector.firstChild);
    }
  },

  setOptions: function (selector, values) {
    for (var i = 0, count = values.length; i < values.length; i++) {
      var opt = document.createElement("option");
      opt.value = values[i];
      opt.innerHTML = values[i];
      selector.appendChild(opt);
    }
  },
};

class MenuDrawer extends HTMLElement {
  constructor() {
    super();

    this.mainDetailsToggle = this.querySelector("details");

    if (navigator.platform === "iPhone")
      document.documentElement.style.setProperty(
        "--viewport-height",
        `${window.innerHeight}px`
      );

    this.addEventListener("keyup", this.onKeyUp.bind(this));
    this.addEventListener("focusout", this.onFocusOut.bind(this));
    this.bindEvents();
  }

  bindEvents() {
    this.querySelectorAll("summary").forEach((summary) =>
      summary.addEventListener("click", this.onSummaryClick.bind(this))
    );
    this.querySelectorAll("button").forEach((button) =>
      button.addEventListener("click", this.onCloseButtonClick.bind(this))
    );
  }

  onKeyUp(event) {
    if (event.code.toUpperCase() !== "ESCAPE") return;

    const openDetailsElement = event.target.closest("details[open]");
    if (!openDetailsElement) return;

    openDetailsElement === this.mainDetailsToggle
      ? this.closeMenuDrawer(
          event,
          this.mainDetailsToggle.querySelector("summary")
        )
      : this.closeSubmenu(openDetailsElement);
  }

  onSummaryClick(event) {
    const summaryElement = event.currentTarget;
    const detailsElement = summaryElement.parentNode;
    const parentMenuElement = detailsElement.closest(".has-submenu");
    const isOpen = detailsElement.hasAttribute("open");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    function addTrapFocus() {
      trapFocus(
        summaryElement.nextElementSibling,
        detailsElement.querySelector("button")
      );
      summaryElement.nextElementSibling.removeEventListener(
        "transitionend",
        addTrapFocus
      );
    }

    if (detailsElement === this.mainDetailsToggle) {
      if (isOpen) event.preventDefault();
      isOpen
        ? this.closeMenuDrawer(event, summaryElement)
        : this.openMenuDrawer(summaryElement);
    } else {
      setTimeout(() => {
        detailsElement.classList.add("menu-opening");
        summaryElement.setAttribute("aria-expanded", true);
        parentMenuElement && parentMenuElement.classList.add("submenu-open");
        !reducedMotion || reducedMotion.matches
          ? addTrapFocus()
          : summaryElement.nextElementSibling.addEventListener(
              "transitionend",
              addTrapFocus
            );
      }, 100);
    }
  }

  openMenuDrawer(summaryElement) {
    setTimeout(() => {
      this.mainDetailsToggle.classList.add("menu-opening");
    });
    summaryElement.setAttribute("aria-expanded", true);
    trapFocus(this.mainDetailsToggle, summaryElement);
    document.body.classList.add(`overflow-hidden-${this.dataset.breakpoint}`);
  }

  closeMenuDrawer(event, elementToFocus = false) {
    if (event === undefined) return;

    this.mainDetailsToggle.classList.remove("menu-opening");
    this.mainDetailsToggle.querySelectorAll("details").forEach((details) => {
      details.removeAttribute("open");
      details.classList.remove("menu-opening");
    });
    this.mainDetailsToggle
      .querySelectorAll(".submenu-open")
      .forEach((submenu) => {
        submenu.classList.remove("submenu-open");
      });
    document.body.classList.remove(
      `overflow-hidden-${this.dataset.breakpoint}`
    );
    removeTrapFocus(elementToFocus);
    this.closeAnimation(this.mainDetailsToggle);
  }

  onFocusOut(event) {
    setTimeout(() => {
      if (
        this.mainDetailsToggle.hasAttribute("open") &&
        !this.mainDetailsToggle.contains(document.activeElement)
      )
        this.closeMenuDrawer();
    });
  }

  onCloseButtonClick(event) {
    const detailsElement = event.currentTarget.closest("details");
    this.closeSubmenu(detailsElement);
  }

  closeSubmenu(detailsElement) {
    const parentMenuElement = detailsElement.closest(".submenu-open");
    parentMenuElement && parentMenuElement.classList.remove("submenu-open");
    detailsElement.classList.remove("menu-opening");
    detailsElement
      .querySelector("summary")
      .setAttribute("aria-expanded", false);
    removeTrapFocus(detailsElement.querySelector("summary"));
    this.closeAnimation(detailsElement);
  }

  closeAnimation(detailsElement) {
    let animationStart;

    const handleAnimation = (time) => {
      if (animationStart === undefined) {
        animationStart = time;
      }

      const elapsedTime = time - animationStart;

      if (elapsedTime < 400) {
        window.requestAnimationFrame(handleAnimation);
      } else {
        detailsElement.removeAttribute("open");
        if (detailsElement.closest("details[open]")) {
          trapFocus(
            detailsElement.closest("details[open]"),
            detailsElement.querySelector("summary")
          );
        }
      }
    };

    window.requestAnimationFrame(handleAnimation);
  }
}

customElements.define("menu-drawer", MenuDrawer);

class HeaderDrawer extends MenuDrawer {
  constructor() {
    super();
  }

  openMenuDrawer(summaryElement) {
    this.header =
      this.header || document.getElementById("shopify-section-header");
    this.borderOffset =
      this.borderOffset ||
      this.closest(".header-wrapper").classList.contains(
        "header-wrapper--border-bottom"
      )
        ? 1
        : 0;
    document.documentElement.style.setProperty(
      "--header-bottom-position",
      `${parseInt(
        this.header.getBoundingClientRect().bottom - this.borderOffset
      )}px`
    );
    this.header.classList.add("menu-open");

    setTimeout(() => {
      this.mainDetailsToggle.classList.add("menu-opening");
    });

    summaryElement.setAttribute("aria-expanded", true);
    trapFocus(this.mainDetailsToggle, summaryElement);
    document.body.classList.add(`overflow-hidden-${this.dataset.breakpoint}`);
  }

  closeMenuDrawer(event, elementToFocus) {
    super.closeMenuDrawer(event, elementToFocus);
    this.header.classList.remove("menu-open");
  }
}

customElements.define("header-drawer", HeaderDrawer);

class ModalDialog extends HTMLElement {
  constructor() {
    super();
    this.querySelector('[id^="ModalClose-"]').addEventListener(
      "click",
      this.hide.bind(this, false)
    );
    this.addEventListener("keyup", (event) => {
      if (event.code.toUpperCase() === "ESCAPE") this.hide();
    });
    if (this.classList.contains("media-modal")) {
      this.addEventListener("pointerup", (event) => {
        if (
          event.pointerType === "mouse" &&
          !event.target.closest("deferred-media, product-model")
        )
          this.hide();
      });
    } else {
      this.addEventListener("click", (event) => {
        if (event.target === this) this.hide();
      });
    }
  }

  connectedCallback() {
    if (this.moved) return;
    this.moved = true;
    document.body.appendChild(this);
  }

  show(opener) {
    this.openedBy = opener;
    const popup = this.querySelector(".template-popup");
    document.body.classList.add("overflow-hidden");
    this.setAttribute("open", "");
    if (popup) popup.loadContent();
    trapFocus(this, this.querySelector('[role="dialog"]'));
    window.pauseAllMedia();
  }

  hide() {
    document.body.classList.remove("overflow-hidden");
    document.body.dispatchEvent(new CustomEvent("modalClosed"));
    this.removeAttribute("open");
    removeTrapFocus(this.openedBy);
    window.pauseAllMedia();
  }
}
customElements.define("modal-dialog", ModalDialog);

class ModalOpener extends HTMLElement {
  constructor() {
    super();

    const button = this.querySelector("button");

    if (!button) return;
    button.addEventListener("click", () => {
      const modal = document.querySelector(this.getAttribute("data-modal"));
      if (modal) modal.show(button);
    });
  }
}
customElements.define("modal-opener", ModalOpener);

class DeferredMedia extends HTMLElement {
  constructor() {
    super();
    const poster = this.querySelector('[id^="Deferred-Poster-"]');
    if (!poster) return;
    poster.addEventListener("click", this.loadContent.bind(this));
  }

  loadContent(focus = true) {
    window.pauseAllMedia();
    if (!this.getAttribute("loaded")) {
      const content = document.createElement("div");
      content.appendChild(
        this.querySelector("template").content.firstElementChild.cloneNode(true)
      );

      this.setAttribute("loaded", true);
      const deferredElement = this.appendChild(
        content.querySelector("video, model-viewer, iframe")
      );
      if (focus) deferredElement.focus();
    }
  }
}

customElements.define("deferred-media", DeferredMedia);

class ChooseSize extends HTMLElement {
  constructor() {
    super();

    this.button = this.querySelector(".choose-size__button");
    this.addButton = this.querySelector(".choose-size__add-button");
    this.addButtonText = this.addButton.querySelector(
      ".choose-size__add-button-text"
    );
    this.spinner = this.querySelector(".spinner");
    this.addButtonPrice = this.addButton.querySelector(".choose-size__price");
    this.dropdown = this.querySelector(".choose-size__dropdown");
    this.list = this.querySelector(".choose-size__ul");
    this.productTitle = this.getAttribute("data-title");
    this.id = this.getAttribute("data-id");
    this.productPrefix = this.productTitle.split(" iPhone ")[0];

    this.openClass = "choose-size--open";

    this.button.addEventListener("click", this.onButtonClick.bind(this));
    this.addButton.addEventListener("click", this.onAddButtonClick.bind(this));
  }

  onDocumentClick(event) {
    const isClosest = event.target.closest("choose-size");
    if (!isClosest && this.classList.contains(this.openClass)) {
      this.classList.remove(this.openClass);
    }
  }

  startLoading() {
    this.classList.add("loading");
  }

  finishLoading() {
    this.classList.remove("loading");
  }

  buildList() {
    this.startLoading();
    fetch(`/search?q=title:${this.productPrefix}&view=api&type=product`)
      .then((response) => response.json())
      .then((data) => {
        if (this.productTitle.indexOf("Bling") > -1) {
          window.blingSizeList.forEach((size) => {
            data.forEach((product) => {
              if (product.title.indexOf("iPhone") === -1) return;
              const phoneSize = 'iPhone ' + product.title
                .split(" iPhone ")[1]
                .replace(" Case", "");
              console.log(phoneSize, size);
              if (phoneSize !== size) return true;
              const disabled = product.variants[0].available ? "" : "disabled";
              const productTitle = phoneSize;
              let li = document.createElement("li");
              li.classList.add(
                `choose-size__li`,
                `size-available--${product.available}`
              );
              const productJSON = {
                id: product.id,
                handle: product.handle,
                available: product.available,
                tags: product.tags,
                variants: product.variants,
              };
              li.setAttribute("data-json", JSON.stringify(productJSON));
              li.innerHTML = `<input name="size-${this.id}" type="radio" id="size-${product.id}" value="${product.variants[0].id}" data-price="${product.price}" class="choose-size__radio" data-available="${product.available}">
              <label for="size-${product.id}">
                <span class="choose-size__label">${productTitle}</span>
              </label>`;
              this.list.appendChild(li);
            });
          });
        } else {
          console.log(window.iPhoneSizeList);
          window.iPhoneSizeList.forEach((size) => {
            data.forEach((product) => {
              if (product.title.indexOf("iPhone") === -1) return;
              const phoneSize = product.title
                .split(" iPhone ")[1]
                .replace(" Case", "");

              if (phoneSize !== size) return true;
              console.log(phoneSize, size);
              const disabled = product.variants[0].available ? "" : "disabled";
              const productTitle = "iPhone " + phoneSize;
              const dataString = encodeURIComponent(JSON.stringify(product));
              let li = document.createElement("li");
              li.classList.add(
                `choose-size__li`,
                `size-available--${product.available}`
              );
              const productJSON = {
                id: product.id,
                handle: product.handle,
                available: product.available,
                tags: product.tags,
                variants: product.variants,
              };
              li.setAttribute("data-json", JSON.stringify(productJSON));
              li.innerHTML = `<input name="size-${this.id}" type="radio" id="size-${product.id}" value="${product.variants[0].id}" data-price="${product.price}" class="choose-size__radio" data-available="${product.available}">
            <label for="size-${product.id}">
              <span class="choose-size__label">${productTitle}</span>
            </label>`;
              this.list.appendChild(li);
            });
          });
        }
        this.classList.add(this.openClass);
        this.finishLoading();
        this.querySelectorAll(".choose-size__radio").forEach((radio) => {
          radio.addEventListener("change", this.onRadioChange.bind(this));
        });
        document.addEventListener("click", this.onDocumentClick.bind(this));
      });
  }
  checkBIS(event) {
    if (event.target.type !== "radio") return;
    const available = event.target.getAttribute("data-available") === "true";
    if (available) {
      this.addButtonText.textContent = window.variantStrings.addToCart;
      this.addButton.classList.remove("BIS_trigger");
      this.addButton.removeAttribute("data-product-data");
    } else {
      const json = event.target.parentNode.getAttribute("data-json");
      this.addButton.setAttribute("data-product-data", json);
      this.addButton.classList.add("BIS_trigger");
      this.addButtonText.textContent = window.variantStrings.backInStock;
    }
  }
  onRadioChange(event) {
    this.addButton.removeAttribute("disabled");
    const price = Shopify.formatMoney(
      parseFloat(event.target.getAttribute("data-price"))
    ).replace(".00", "");
    this.addButtonPrice.innerHTML = price;
    this.checkBIS(event);
  }
  showList() {
    this.classList.add(this.openClass);
    trapFocus(this, this.dropdown);
    document.addEventListener("click", this.onDocumentClick.bind(this));
  }
  hideList() {
    this.classList.remove(this.openClass);
    let swiperParent = this.closest(".swiper");
    if (swiperParent) {
      swiperParent.classList.remove("choose-size--open");
    }
  }
  hideAllLists() {
    document.querySelectorAll("choose-size").forEach((chooseSize) => {
      chooseSize.hideList();
    });
  }
  onAddButtonClick(event) {
    event.preventDefault();
    if (this.addButton.classList.contains("BIS_trigger")) {
      return;
    }
    const selectedRadio = this.querySelector(".choose-size__radio:checked");

    this.addButton.setAttribute("disabled", true);

    if (selectedRadio) {
      const variantId = selectedRadio.value;
      const quantity = 1;

      addToCart(variantId, quantity, {}, function () {
        document.dispatchEvent(new CustomEvent("addtocart"));
      });

      setTimeout(() => {
        this.addButton.removeAttribute("disabled");
      }, 2000);
    }
  }
  onButtonClick(event) {
    event.preventDefault();
    this.hideAllLists();
    if (this.list.children.length === 0) {
      this.buildList();
      return;
    } else {
      this.showList();
    }
    let swiperParent = this.closest(".swiper");

    if (swiperParent) {
      swiperParent.classList.add("choose-size--open");
    }
  }
}

customElements.define("choose-size", ChooseSize);

class SliderComponent extends HTMLElement {
  constructor() {
    super();
    this.slider = this.querySelectorAll(".slider")[0];
    if (!this.slider) return;
    this.sliderItems = this.slider.querySelectorAll(".slider__slide");
    this.enableSliderLooping = false;
    this.currentPageElement = this.querySelector(".slider-counter--current");
    this.pageTotalElement = this.querySelector(".slider-counter--total");
    this.prevButton = this.querySelector(`button[name="previous"]`);
    this.nextButton = this.querySelector(`button[name="next"]`);

    if (!this.slider || !this.nextButton) return;

    this.initPages();
    const resizeObserver = new ResizeObserver((entries) => this.initPages());
    resizeObserver.observe(this.slider);

    this.slider.addEventListener("scroll", this.update.bind(this));
    this.prevButton.addEventListener("click", this.onButtonClick.bind(this));
    this.nextButton.addEventListener("click", this.onButtonClick.bind(this));

    this.toggleButtons = this.querySelectorAll(".featured-collection__toggle");
    this.toggleButtons.forEach((button) =>
      button.addEventListener("click", this.toggleCollection.bind(this))
    );
  }

  initPages() {
    this.sliderItemsToShow = Array.from(this.sliderItems).filter(
      (element) => element.clientWidth > 0
    );
    if (this.sliderItemsToShow.length < 2) return;
    this.sliderItemOffset =
      this.sliderItemsToShow[1].offsetLeft -
      this.sliderItemsToShow[0].offsetLeft;
    this.slidesPerPage = Math.floor(
      (this.slider.clientWidth - this.sliderItemsToShow[0].offsetLeft) /
        this.sliderItemOffset
    );
    this.totalPages = this.sliderItemsToShow.length - this.slidesPerPage + 1;
    this.update();
  }

  resetPages() {
    this.sliderItems = this.slider.querySelectorAll(".slider__slide");
    this.initPages();
  }

  toggleCollection(event) {
    let allSliders = this.querySelectorAll(".slider");
    let allToggles = this.querySelectorAll(".featured-collection__toggle");
    this.slider = document.getElementById(
      event.target.getAttribute("aria-controls")
    );
    this.sliderItems = this.slider.querySelectorAll(".slider__slide");

    allSliders.forEach((slider) => {
      slider.style.display = "none";
    });
    this.slider.style.display = "flex";

    allToggles.forEach((toggle) => {
      toggle.setAttribute("aria-expanded", false);
    });
    event.target.setAttribute("aria-expanded", true);
    this.udpate();
  }

  update() {
    const previousPage = this.currentPage;
    this.currentPage =
      Math.round(this.slider.scrollLeft / this.sliderItemOffset) + 1;

    if (this.currentPageElement && this.pageTotalElement) {
      this.currentPageElement.textContent = this.currentPage;
      this.pageTotalElement.textContent = this.totalPages;
    }

    if (this.currentPage != previousPage) {
      this.dispatchEvent(
        new CustomEvent("slideChanged", {
          detail: {
            currentPage: this.currentPage,
            currentElement: this.sliderItemsToShow[this.currentPage - 1],
          },
        })
      );
    }

    if (this.enableSliderLooping) return;

    if (
      this.isSlideVisible(this.sliderItemsToShow[0]) &&
      this.slider.scrollLeft === 0
    ) {
      this.prevButton.setAttribute("disabled", "disabled");
    } else {
      this.prevButton.removeAttribute("disabled");
    }

    if (
      this.isSlideVisible(
        this.sliderItemsToShow[this.sliderItemsToShow.length - 1]
      )
    ) {
      this.nextButton.setAttribute("disabled", "disabled");
    } else {
      this.nextButton.removeAttribute("disabled");
    }
  }

  isSlideVisible(element, offset = 0) {
    const lastVisibleSlide =
      this.slider.clientWidth + this.slider.scrollLeft - offset;
    return (
      element.offsetLeft + element.clientWidth <= lastVisibleSlide &&
      element.offsetLeft >= this.slider.scrollLeft
    );
  }

  onButtonClick(event) {
    event.preventDefault();

    const step = event.currentTarget.dataset.step || 1;
    this.slideScrollPosition =
      event.currentTarget.name === "next"
        ? this.slider.scrollLeft + step * this.sliderItemOffset
        : this.slider.scrollLeft - step * this.sliderItemOffset;
    this.slider.scrollTo({
      left: this.slideScrollPosition,
    });
  }
}

customElements.define("slider-component", SliderComponent);

class SlideshowComponent extends SliderComponent {
  constructor() {
    super();
    this.sliderControlWrapper = this.querySelector(".slider-buttons");
    this.enableSliderLooping = true;

    if (!this.sliderControlWrapper) return;

    this.sliderFirstItemNode = this.slider.querySelector(".slideshow__slide");
    if (this.sliderItemsToShow.length > 0) this.currentPage = 1;

    this.sliderControlLinksArray = Array.from(
      this.sliderControlWrapper.querySelectorAll(".slider-counter__link")
    );
    this.sliderControlLinksArray.forEach((link) =>
      link.addEventListener("click", this.linkToSlide.bind(this))
    );
    this.slider.addEventListener("scroll", this.setSlideVisibility.bind(this));
    this.setSlideVisibility();

    if (this.slider.getAttribute("data-autoplay") === "true")
      this.setAutoPlay();
  }

  setAutoPlay() {
    this.sliderAutoplayButton = this.querySelector(".slideshow__autoplay");
    this.autoplaySpeed = this.slider.dataset.speed * 1000;

    this.sliderAutoplayButton.addEventListener(
      "click",
      this.autoPlayToggle.bind(this)
    );
    this.addEventListener("mouseover", this.focusInHandling.bind(this));
    this.addEventListener("mouseleave", this.focusOutHandling.bind(this));
    this.addEventListener("focusin", this.focusInHandling.bind(this));
    this.addEventListener("focusout", this.focusOutHandling.bind(this));

    this.play();
    this.autoplayButtonIsSetToPlay = true;
  }

  onButtonClick(event) {
    super.onButtonClick(event);
    const isFirstSlide = this.currentPage === 1;
    const isLastSlide = this.currentPage === this.sliderItemsToShow.length;

    if (!isFirstSlide && !isLastSlide) return;

    if (isFirstSlide && event.currentTarget.name === "previous") {
      this.slideScrollPosition =
        this.slider.scrollLeft +
        this.sliderFirstItemNode.clientWidth * this.sliderItemsToShow.length;
    } else if (isLastSlide && event.currentTarget.name === "next") {
      this.slideScrollPosition = 0;
    }
    this.slider.scrollTo({
      left: this.slideScrollPosition,
    });
  }

  update() {
    super.update();
    this.sliderControlButtons = this.querySelectorAll(".slider-counter__link");
    this.prevButton.removeAttribute("disabled");

    if (!this.sliderControlButtons.length) return;

    this.sliderControlButtons.forEach((link) => {
      link.classList.remove("slider-counter__link--active");
      link.removeAttribute("aria-current");
    });
    this.sliderControlButtons[this.currentPage - 1].classList.add(
      "slider-counter__link--active"
    );
    this.sliderControlButtons[this.currentPage - 1].setAttribute(
      "aria-current",
      true
    );
  }

  autoPlayToggle() {
    this.togglePlayButtonState(this.autoplayButtonIsSetToPlay);
    this.autoplayButtonIsSetToPlay ? this.pause() : this.play();
    this.autoplayButtonIsSetToPlay = !this.autoplayButtonIsSetToPlay;
  }

  focusOutHandling(event) {
    const focusedOnAutoplayButton =
      event.target === this.sliderAutoplayButton ||
      this.sliderAutoplayButton.contains(event.target);
    if (!this.autoplayButtonIsSetToPlay || focusedOnAutoplayButton) return;
    this.play();
  }

  focusInHandling(event) {
    const focusedOnAutoplayButton =
      event.target === this.sliderAutoplayButton ||
      this.sliderAutoplayButton.contains(event.target);
    if (focusedOnAutoplayButton && this.autoplayButtonIsSetToPlay) {
      this.play();
    } else if (this.autoplayButtonIsSetToPlay) {
      this.pause();
    }
  }

  play() {
    this.slider.setAttribute("aria-live", "off");
    clearInterval(this.autoplay);
    this.autoplay = setInterval(
      this.autoRotateSlides.bind(this),
      this.autoplaySpeed
    );
  }

  pause() {
    this.slider.setAttribute("aria-live", "polite");
    clearInterval(this.autoplay);
  }

  togglePlayButtonState(pauseAutoplay) {
    if (pauseAutoplay) {
      this.sliderAutoplayButton.classList.add("slideshow__autoplay--paused");
      this.sliderAutoplayButton.setAttribute(
        "aria-label",
        window.accessibilityStrings.playSlideshow
      );
    } else {
      this.sliderAutoplayButton.classList.remove("slideshow__autoplay--paused");
      this.sliderAutoplayButton.setAttribute(
        "aria-label",
        window.accessibilityStrings.pauseSlideshow
      );
    }
  }

  autoRotateSlides() {
    const slideScrollPosition =
      this.currentPage === this.sliderItems.length
        ? 0
        : this.slider.scrollLeft +
          this.slider.querySelector(".slideshow__slide").clientWidth;
    this.slider.scrollTo({
      left: slideScrollPosition,
    });
  }

  setSlideVisibility() {
    this.sliderItemsToShow.forEach((item, index) => {
      const button = item.querySelector("a");
      if (index === this.currentPage - 1) {
        if (button) button.removeAttribute("tabindex");
        item.setAttribute("aria-hidden", "false");
        item.removeAttribute("tabindex");
      } else {
        if (button) button.setAttribute("tabindex", "-1");
        item.setAttribute("aria-hidden", "true");
        item.setAttribute("tabindex", "-1");
      }
    });
  }

  linkToSlide(event) {
    event.preventDefault();
    const slideScrollPosition =
      this.slider.scrollLeft +
      this.sliderFirstItemNode.clientWidth *
        (this.sliderControlLinksArray.indexOf(event.currentTarget) +
          1 -
          this.currentPage);
    this.slider.scrollTo({
      left: slideScrollPosition,
    });
  }
}

customElements.define("slideshow-component", SlideshowComponent);

const videoControls = (v) => {
  const buttons = document.querySelectorAll(".playpause");
  buttons.forEach((button) => {
    const playIcon = button.querySelector(".play");
    const pauseIcon = button.querySelector(".pause");
    button.addEventListener("click", (event) => {
      const myVideo = document.getElementById(
        button.getAttribute("aria-labelledby")
      );
      if (myVideo.paused) {
        myVideo.play();
        playIcon.style.display = "none";
        pauseIcon.style.display = "block";
      } else {
        myVideo.pause();
        playIcon.style.display = "block";
        pauseIcon.style.display = "none";
      }
    });
  });
};
videoControls();

const playPauseVideos = () => {
  let videos = document.querySelectorAll("video");
  videos.forEach((video) => {
    video.muted = true;
    video.playsInline = true;
    let playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.then((_) => {
        let observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.intersectionRatio !== 1 && !video.paused) {
                video.pause();
              } else if (video.paused) {
                video.play();
              }
            });
          },
          { threshold: 0.3 }
        );
        observer.observe(video);
      });
    }
  });
};

// playPauseVideos();

const addToCart = (id, qty, properties = false, callback = false) => {
  let formData = {
    items: [
      {
        id: id,
        quantity: qty,
        properties: {},
      },
    ],
  };

  const cartDrawer = document.querySelector("cart-drawer");

  if (properties) {
    formData.items[0].properties = properties;
  }

  fetch(window.Shopify.routes.root + "cart/add.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
    .then((response) => {
      return response.json();
    })
    .then((cart) => {
      console.log("callback", callback);
      if (callback && typeof callback === "function") {
        callback();
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

const lazyImages = () => {
  if (
    "loading" in HTMLImageElement.prototype &&
    "IntersectionObserver" in window
  ) {
    var lazyImages = document.querySelectorAll(".media img");

    const imageObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const image = entry.target;
            let loadedSuccessfully = image.complete && image.naturalWidth !== 0;
            if (loadedSuccessfully) {
              image.parentNode.classList.add("loaded");
            } else {
              setTimeout(function () {
                image.parentNode.classList.add("loaded");
              }, 250);
            }
            imageObserver.unobserve(image);
          }
        });
      },
      {
        threshold: 0.25,
      }
    );

    lazyImages.forEach((img) => imageObserver.observe(img));
  }
};

const lazyIframes = () => {
  if (
    "loading" in HTMLImageElement.prototype &&
    "IntersectionObserver" in window
  ) {
    var lazyIframes = document.querySelectorAll("iframe[data-src]");

    const imageObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const iframe = entry.target;
            iframe.src = iframe.dataset.src;
            iframe.parentNode.classList.add("loaded");
            imageObserver.unobserve(iframe);
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    lazyIframes.forEach((iframe) => imageObserver.observe(iframe));
  }
};

const scrollToLinks = () => {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      if (event.target.href === "#") return;
      event.preventDefault();

      document.querySelector(event.target.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    });
  });
};

document.addEventListener("DOMContentLoaded", () => {
  lazyImages();
  lazyIframes();
  scrollToLinks();
  marketingTileHeights();
  klaviyoForms();
});

document.addEventListener("shopify:section:load", () => {
  lazyImages();
  lazyIframes();
  scrollToLinks();
  marketingTileHeights();
  klaviyoForms();
});

window.addEventListener(
  "resize",
  debounce(() => {
    marketingTileHeights();
  }, 250)
);

const footerCollapseMobile = () => {
  const footerHeadings = document.querySelectorAll(".footer-block__heading");
  footerHeadings.forEach((button) => {
    button.addEventListener("click", (event) => {
      let myEl = document.getElementById(button.getAttribute("aria-controls"));
      let isOpen = event.target.getAttribute("aria-expanded") === "true";
      if (isOpen) {
        myEl.style.display = "none";
      } else {
        myEl.style.display = "block";
      }
      button.setAttribute("aria-expanded", !isOpen);
    });
  });
};
footerCollapseMobile();

const marketingTileHeights = () => {
  const tiles = document.querySelectorAll(".marketing-tile__inner");
  const firstGridItem = document.querySelector(
    "#product-grid .grid__item:first-child"
  );
  if (!firstGridItem) return;
  const firstGridItemHeight = firstGridItem.offsetHeight;
  tiles.forEach((tile) => {
    if (tile.closest(".marketing-tile__quote")) return;
    tile.style.height = firstGridItemHeight + "px";
  });
};

const klaviyoSubscribe = (form, callback) => {
  const email = form.querySelector('input[name="email"]').value;
  const listId = form.querySelector('input[name="g"]').value;
  const successMessage = form.getAttribute("data-success-message");
  const messages = form.querySelector(".messages");
  const subscribeUrl = "//manage.kmail-lists.com/ajax/subscriptions/subscribe";

  if (email === "") {
    messages.textContent = "Please enter a valid email address";
    messages.classList.remove("hidden");
    return false;
  }

  const bodyContent = {
    g: listId,
    email: email,
  };

  fetch(subscribeUrl, {
    body: new URLSearchParams(bodyContent),
    method: "POST",
  })
    .then((response) => response.json())
    .then((response) => {
      if (response.success) {
        messages.textContent = successMessage;
      } else {
        messages.textContent = response.errors;
      }

      messages.classList.remove("hidden");
      if (callback && typeof callback === "function") {
        callback();
      }
    })
    .catch((err) => {
      console.error(err);
    });
};

const klaviyoForms = () => {
  const subscribeForms = document.querySelectorAll(".klaviyo-subscribe");
  subscribeForms.forEach((form) => {
    const button = form.querySelector(".newsletter-form__button");
    button.addEventListener("click", function (e) {
      e.preventDefault();
      klaviyoSubscribe(form);
    });
  });
};

// iPhone model checks.
const getiPhoneModel = () => {
  // Create a canvas element which can be used to retrieve information about the GPU.
  var canvas = document.createElement("canvas");
  if (canvas) {
    var context =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (context) {
      var info = context.getExtension("WEBGL_debug_renderer_info");
      if (info) {
        var renderer = context.getParameter(info.UNMASKED_RENDERER_WEBGL);
      }
    }
  }

  // iPhone X
  if (
    window.screen.height / window.screen.width == 812 / 375 &&
    window.devicePixelRatio == 3
  ) {
    return "iPhone X";
    // iPhone 6+/6s+/7+ and 8+
  } else if (
    window.screen.height / window.screen.width == 736 / 414 &&
    window.devicePixelRatio == 3
  ) {
    switch (renderer) {
      default:
        return "iPhone 6 Plus, 6s Plus, 7 Plus or 8 Plus";
      case "Apple A8 GPU":
        return "iPhone 6 Plus";
      case "Apple A9 GPU":
        return "iPhone 6s Plus";
      case "Apple A10 GPU":
        return "iPhone 7 Plus";
      case "Apple A11 GPU":
        return "iPhone 8 Plus";
    }
    // iPhone 6+/6s+/7+ and 8+ in zoom mode
  } else if (
    window.screen.height / window.screen.width == 667 / 375 &&
    window.devicePixelRatio == 3
  ) {
    switch (renderer) {
      default:
        return "iPhone 6 Plus, 6s Plus, 7 Plus or 8 Plus (display zoom)";
      case "Apple A8 GPU":
        return "iPhone 6 Plus (display zoom)";
      case "Apple A9 GPU":
        return "iPhone 6s Plus (display zoom)";
      case "Apple A10 GPU":
        return "iPhone 7 Plus (display zoom)";
      case "Apple A11 GPU":
        return "iPhone 8 Plus (display zoom)";
    }
    // iPhone 6/6s/7 and 8
  } else if (
    window.screen.height / window.screen.width == 667 / 375 &&
    window.devicePixelRatio == 2
  ) {
    switch (renderer) {
      default:
        return "iPhone 6, 6s, 7 or 8";
      case "Apple A8 GPU":
        return "iPhone 6";
      case "Apple A9 GPU":
        return "iPhone 6s";
      case "Apple A10 GPU":
        return "iPhone 7";
      case "Apple A11 GPU":
        return "iPhone 8";
    }
    // iPhone 5/5C/5s/SE or 6/6s/7 and 8 in zoom mode
  } else if (
    window.screen.height / window.screen.width == 1.775 &&
    window.devicePixelRatio == 2
  ) {
    switch (renderer) {
      default:
        return "iPhone 5, 5C, 5S, SE or 6, 6s, 7 and 8 (display zoom)";
      case "PowerVR SGX 543":
        return "iPhone 5 or 5c";
      case "Apple A7 GPU":
        return "iPhone 5s";
      case "Apple A8 GPU":
        return "iPhone 6 (display zoom)";
      case "Apple A9 GPU":
        return "iPhone SE or 6s (display zoom)";
      case "Apple A10 GPU":
        return "iPhone 7 (display zoom)";
      case "Apple A11 GPU":
        return "iPhone 8 (display zoom)";
    }
    // iPhone 4/4s
  } else if (
    window.screen.height / window.screen.width == 1.5 &&
    window.devicePixelRatio == 2
  ) {
    switch (renderer) {
      default:
        return "iPhone 4 or 4s";
      case "PowerVR SGX 535":
        return "iPhone 4";
      case "PowerVR SGX 543":
        return "iPhone 4s";
    }
    // iPhone 1/3G/3GS
  } else if (
    window.screen.height / window.screen.width == 1.5 &&
    window.devicePixelRatio == 1
  ) {
    switch (renderer) {
      default:
        return "iPhone 1, 3G or 3GS";
      case "ALP0298C05":
        return "iPhone 3GS";
      case "S5L8900":
        return "iPhone 1, 3G";
    }
  } else {
    return "Not an iPhone";
  }
};

(function () {
  if (!getCookie("iphone-model")) {
    const iPhoneModel = getiPhoneModel();
    setCookie("iphone-model", iPhoneModel, 100);
  }
})();

window.onFoursixtyCartAdded = function () {
  console.log("window.onFoursixtyCartAdded()");
};

const seoTextElements = () => {
  const seoText = document.querySelectorAll(".seo-text");
  seoText.forEach((element) => {
    if (element.offsetHeight > 300) {
      element.classList.add("seo-text--collapsed");
      element
        .querySelector(".page-width")
        .insertAdjacentHTML(
          "beforeend",
          '<button class="seo-text__button button button--primary" aria-expanded="false" aria-controls="seo-text">Read more</button>'
        );

      const button = element.querySelector(".seo-text__button");
      button.addEventListener("click", (e) => {
        e.preventDefault();
        const expanded =
          button.getAttribute("aria-expanded") === "true" || false;
        button.setAttribute("aria-expanded", !expanded);
        element.classList.toggle("seo-text--collapsed");
        button.textContent = expanded ? "Read more" : "Read less";
      });
    }
  });
};

seoTextElements();

window.addEventListener("cartItemAdd", function (data) {
  addToCart(data.detail.id, data.detail.quantity);
});
