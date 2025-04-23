class CartDrawer extends HTMLElement {
  constructor() {
    super();

    const component = this;

    if (new URLSearchParams(window.location.search).get("cart")) {
      this.open();
    }

    document.addEventListener("addtocart", function (event) {
      component.render().then(() => component.open());
    });

    document.addEventListener('keyup', function (event) {
      if (event.code === 'Escape') {
        component.close();
      }
    });

    document.addEventListener("cartlink:click", function (event) {
      component.open();
    });

    document.addEventListener("cart:change", function (event) {
      component.render();
    });

    document.addEventListener("cartupsell:addtocart", function (event) {
      component.render();
    });
  }

  open() {
    // here the animation doesn't seem to always get triggered. A timeout seem to help
    setTimeout(() => {this.classList.add('animate', 'active')});

    this.addEventListener('transitionend', () => {
      const containerToTrapFocusOn = document.getElementById('CartDrawer');
      const focusElement = this.querySelector('.drawer__inner') || this.querySelector('.drawer__close');
      trapFocus(containerToTrapFocusOn, focusElement);
    }, { once: true });

    document.body.classList.add('overflow-hidden');
  }

  close() {
    this.classList.remove('active');

    document.body.classList.remove('overflow-hidden');

    var params = new URLSearchParams(window.location.search);

    if (params.get("cart")) {
      window.history.replaceState({}, document.title, "/");
    }
  }

  render() {
    const elements = {
      cart_drawer: document.getElementById("CartDrawer")
    };

    return fetch("/?sections=cart-drawer")
      .then((response) => response.text())
      .then((response) => {
        const string = JSON.parse(response)["cart-drawer"];
        const parser = new DOMParser();
        const doc = parser.parseFromString(string, "text/html");
        const section = doc.getElementById("CartDrawer");

        elements.cart_drawer.replaceWith(section);
      });
  }
}

customElements.define('cart-drawer', CartDrawer);

class CartLink extends HTMLElement {
  constructor() {
    super();

    const component = this;

    component.elements = {
      link: component.querySelector("a"),
      count: component.querySelector("[data-local-count]")
    };

    component.elements.link.addEventListener("click", function (event) {
      event.preventDefault();
      document.dispatchEvent(new CustomEvent("cartlink:click"));
    });

    document.addEventListener("cart:change", function (event) {
      component.update(event.detail.cart.item_count);
    });

    document.addEventListener("addtocart", function (event) {
      component.increment();
    });
  }

  update(count) {
    this.elements.count.textContent = count > 0 ? count : "";
  }

  increment() {
    const count = parseInt(this.elements.count.textContent) || 0;
    this.elements.count.textContent = count + 1;
  }
}

customElements.define("cart-link", CartLink);

class CartRemoveButton extends HTMLElement {
  constructor() {
    super();

    this.addEventListener('click', function (event) {
      event.preventDefault();
      const cartItems = this.closest('cart-items');
      cartItems.updateQuantity(this.dataset.index, 0, false, event.target);
    });
  }
}

customElements.define('cart-remove-button', CartRemoveButton);

class CartItems extends HTMLElement {
  constructor() {
    super();

    this.currentItemCount = Array.from(this.querySelectorAll('[name="updates[]"]'))
      .reduce((total, quantityInput) => total + parseInt(quantityInput.value), 0);

    this.debouncedOnChange = debounce((event) => {
      this.onChange(event);
    }, 300);

    this.addEventListener('change', this.debouncedOnChange.bind(this));
  }

  onChange(event) {
    this.updateQuantity(event.target.dataset.index, event.target.value, document.activeElement.getAttribute('name'),event.target);
  }

  updateQuantity(line, quantity, name, element) {
    const cartJson = JSON.parse(this.querySelector('.cart-items').getAttribute('data-json'));

    this.enableLoading(line);

    let updatesObj = {
      updates: {}
    };

    const baseKey = element.closest('.cart-item').dataset.key;
    updatesObj.updates[baseKey] = quantity;

    const body = JSON.stringify({
      updates: updatesObj.updates
    });

    fetch(`${routes.cart_update_url}`, {...fetchConfig(), ...{ body }})
      .then((response) => {
        return response.json();
      })
      .then((cart) => {
        document.dispatchEvent(new CustomEvent("cart:change", {
          detail: {
            cart: cart
          }
        }));
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        this.disableLoading();
      });
  }

  enableLoading(line) {
    const mainCartItems = document.getElementById('CartDrawer-CartItems');
    mainCartItems.classList.add('cart__items--disabled');

    const cartItemElements = this.querySelectorAll(`#CartItem-${line} .loading-overlay`);
    const cartDrawerItemElements = this.querySelectorAll(`#CartDrawer-Item-${line} .loading-overlay`);

    [...cartItemElements, ...cartDrawerItemElements].forEach((overlay) => overlay.classList.remove('hidden'));

    document.activeElement.blur();
  }

  disableLoading() {
    const mainCartItems = document.getElementById('CartDrawer-CartItems');
    mainCartItems.classList.remove('cart__items--disabled');
  }
}

customElements.define('cart-items', CartItems);

class CartUpsell extends HTMLElement {
  constructor() {
    super();

    const component = this;

    component.elements = {
      button: component.querySelector("[data-local-button]")
    };

    component.data = JSON.parse(component.querySelector(":scope > script").innerHTML);

    component.elements.button.addEventListener("click", function (event) {
      event.preventDefault();

      component.elements.button.querySelector(".cart-upsell-button-icon").textContent = "✓";
      component.elements.button.querySelector(".cart-upsell-button-text").textContent = "Added!";

      addToCart(component.data.id, component.data.quantity, {}, function () {
        document.dispatchEvent(new CustomEvent("cartupsell:addtocart"));
      });
    });
  }
}

customElements.define("cart-upsell", CartUpsell);
