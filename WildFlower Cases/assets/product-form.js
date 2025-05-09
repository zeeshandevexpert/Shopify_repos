const productThumbnails = () => {
  const productThumbnails = document.querySelectorAll('.product__thumbnail');
  productThumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', event => {
      productThumbnails.forEach(thumbnail => {
        thumbnail.removeAttribute('aria-current');
      });
      const index = parseFloat(thumbnail.getAttribute('data-index'));
      const mainImages = document.querySelector('.product__media-list').swiper;
      thumbnail.setAttribute('aria-current',true);
      mainImages.slideTo(index);
    });
  });
};

const onSwiperChange = () => {
  const mediaList = document.querySelector('.product__media-list.swiper-initialized');
  if(!mediaList) return;
  const mainSwiper = mediaList.swiper;
  const productThumbnails = document.querySelectorAll('.product__thumbnail');

  mainSwiper.on('slideChange', (event) => {
    productThumbnails.forEach(thumbnail => {
      thumbnail.removeAttribute('aria-current');
    });
    let newCurrent = document.querySelector(`.product__thumbnail[data-index="${mainSwiper.activeIndex}"]`);
    newCurrent.setAttribute('aria-current',true);
  });
};
window.addEventListener('DOMContentLoaded', (event) => {
  productThumbnails();
});

window.addEventListener('load', (event) => {
  onSwiperChange();
});


if (!customElements.get('product-form')) {
  customElements.define('product-form', class ProductForm extends HTMLElement {
    constructor() {
      super();

      this.form = this.querySelector('form');
      this.form.querySelector('[name=id]').disabled = false;
      this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
      this.cart = document.querySelector('cart-drawer');
      this.submitButton = this.querySelector('[type="submit"]');
    }

    onSubmitHandler(evt) {
      evt.preventDefault();
      if (this.submitButton.getAttribute('aria-disabled') === 'true') return;

      this.handleErrorMessage();

      this.submitButton.setAttribute('aria-disabled', true);
      this.submitButton.classList.add('loading');
      this.querySelector('.loading-overlay__spinner').classList.remove('hidden');


      let formData = {
        items: [
          {
           id: this.form.querySelector('[name=id]').value,
           quantity: 1,
           properties: {}
          }
        ]
      }

      const properties = this.querySelectorAll('.product__property');

      properties.forEach(property => {
        const propertyName = property.getAttribute('data-name');
        const propertyValue = property.value;
        formData.items[0].properties[propertyName] = propertyValue;
      });

      fetch(`${routes.cart_add_url}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        })
        .then((response) => response.text())
        .then((cart) => {
          document.dispatchEvent(new CustomEvent("addtocart"));
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          this.submitButton.removeAttribute('aria-disabled');
          this.submitButton.classList.remove('loading');
          this.querySelector('.loading-overlay__spinner').classList.add('hidden');
        });
    }

    handleErrorMessage(errorMessage = false) {
      this.errorMessageWrapper = this.errorMessageWrapper || this.querySelector('.product-form__error-message-wrapper');
      if (!this.errorMessageWrapper) return;
      this.errorMessage = this.errorMessage || this.errorMessageWrapper.querySelector('.product-form__error-message');

      this.errorMessageWrapper.toggleAttribute('hidden', !errorMessage);

      if (errorMessage) {
        this.errorMessage.textContent = errorMessage;
      }
    }
  });
}

class VariantSelects extends HTMLElement {
  constructor() {
    super();

    this.currentVariant = window.currentVariant;
    this.addEventListener('change', this.onVariantChange.bind(this));
    this.updateOptions();
    this.updateOtherOptions(true);
  }

  onVariantChange(event) {
    this.updateOptions();
    this.updateMasterId();
    this.toggleAddButton(true, '', false);
    this.removeErrorMessage();

    if (!this.currentVariant) {
      this.toggleAddButton(true, '', true);
      this.setUnavailable();
    } else {
      this.updateCurrentValues();
      this.updateURL();
      this.updateVariantInput();
      this.renderProductInfo();
      this.updateShareUrl();
      this.updatePaymentPlans();
      this.updateOtherOptions();
      this.sendEvent(event);
    }
  }
  sendEvent(event) {
    const product_url = event.target.options[event.target.selectedIndex].dataset.url;

    document.dispatchEvent(new CustomEvent('variant:changed', {
      detail: {
        variant: this.currentVariant,
        product: {
          url: product_url
        }
      }
    }));
  }

  updateOtherOptions(initial = false) {

    const optionIndex = initial ?  0 : parseFloat(event.target.closest('.product-form__input--dropdown').getAttribute('data-option-index'));

    const currentOption = this.options[optionIndex];
    this.options.forEach((option,i) => {
      if(i === optionIndex) return true;
      this.getVariantData().forEach(variant => {
        if(variant.options[optionIndex] === currentOption) {
          let input = document.querySelector(`.product-form__input--dropdown option[value="${variant.options[i]}"]`);
          if(variant.available) {
            input.classList.remove('soldout');
            input.disabled = false;
          } else {
            input.classList.add('soldout');
            input.disabled = true;
          }
        }
      });
    });
  }

  multipleColors() {
    let hasMultipleColors = false;
    window.productJSON.options_with_values.forEach(option => {
      if(option.name === 'Color' && option.values.length > 1) hasMultipleColors = true;
    });
    return hasMultipleColors;
  }

  updateCurrentValues() {
    const currentValues = document.querySelectorAll('.current-value');
    currentValues.forEach((value,i) => {
      value.innerHTML = this.currentVariant.options[i];
    });
  }

  updatePaymentPlans() {
    const paymentPlanAmount = document.querySelector('.payment-plan__amount');
    if(!paymentPlanAmount) return;
    paymentPlanAmount.innerHTML = Shopify.formatMoney(this.currentVariant.price / 4).replace('.00','');
  }

  updateOptions() {
    this.options = Array.from(this.querySelectorAll('select'), (select) => select.value);
  }

  updateMasterId() {
    this.currentVariant = this.getVariantData().find((variant) => {
      return !variant.options.map((option, index) => {
        return this.options[index] === option;
      }).includes(false);
    });
  }

  updateURL() {
    if (!this.currentVariant || this.dataset.updateUrl === 'false') return;
    window.history.replaceState({ }, '', `${this.dataset.url}?variant=${this.currentVariant.id}`);
  }

  updateShareUrl() {
    const shareButton = document.getElementById(`Share-${this.dataset.section}`);
    if (!shareButton || !shareButton.updateUrl) return;
    shareButton.updateUrl(`${window.shopUrl}${this.dataset.url}?variant=${this.currentVariant.id}`);
  }

  updateVariantInput() {
    const productForms = document.querySelectorAll(`#product-form-${this.dataset.section}, #product-form-installment-${this.dataset.section}`);
    productForms.forEach((productForm) => {
      const input = productForm.querySelector('input[name="id"]');
      input.value = this.currentVariant.id;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  removeErrorMessage() {
    const section = this.closest('section');
    if (!section) return;

    const productForm = section.querySelector('product-form');
    if (productForm) productForm.handleErrorMessage();
  }

  getElementsToRender() {
    return [
      '.product__title',
      '.product__price-wrapper',
      '.product-form__submit',
      '.payment-plan',
      '.accordion__content',
      '.product__media-gallery'
    ]
  }

  checkBIS() {
    const available = this.currentVariant.available;
    const addButton = document.querySelector('.product-form__submit');
    const bisButton = document.querySelector('#BIS_trigger');

    if (available) {
      bisButton.style.display = 'none';
      addButton.removeAttribute('disabled');
    } else {
      bisButton.style.display = 'block';
      addButton.setAttribute('disabled','disabled');
    }
  }

  renderProductInfo() {
    const sizeSelect = document.querySelector(`select[name="options[Size]"]`);
    const selectedOption = sizeSelect.options[sizeSelect.selectedIndex];
    const newUrl = selectedOption.getAttribute('data-url');

    if (!newUrl) return;

    window.history.replaceState('', '', `${newUrl}?variant=${this.currentVariant.id}`);

    fetch(`${newUrl}?variant=${this.currentVariant.id}&section_id=${this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section}`)
      .then((response) => response.text())
      .then((responseText) => {
        const html = new DOMParser().parseFromString(responseText, 'text/html');

        this.getElementsToRender().forEach((selector) => {
          const elements = html.querySelectorAll(selector);

          elements.forEach((element) => {
            const destination = document.querySelector(selector);
            const source = html.querySelector(selector);
            if (source && destination) destination.innerHTML = source.innerHTML;
          });
        });

        const price = document.getElementById(`price-${this.dataset.section}`);

        if (price) price.classList.remove('visibility-hidden');

        initSwiper();
        lazyImages();

        this.checkBIS();
        this.toggleAddButton(!this.currentVariant.available, window.variantStrings.backInStock);
      });
  }

  toggleAddButton(disable = true, text, modifyClass = true) {
    const productForm = document.getElementById(`product-form-${this.dataset.section}`);
    if (!productForm) return;
    const addButton = productForm.querySelector('[name="add"]');
    const addButtonText = productForm.querySelector('[name="add"] > span');
    if (!addButton) return;

    if (disable) {
      addButton.setAttribute('disabled', 'disabled');
      if (text) addButtonText.textContent = text;
    } else {
      addButton.removeAttribute('disabled');
      addButtonText.textContent = window.variantStrings.addToCart;
    }

    if (!modifyClass) return;
  }

  setUnavailable() {
    const button = document.getElementById(`product-form-${this.dataset.section}`);
    const addButton = button.querySelector('[name="add"]');
    const addButtonText = button.querySelector('[name="add"] > span');
    const price = document.getElementById(`price-${this.dataset.section}`);
    if (!addButton) return;
    addButtonText.textContent = window.variantStrings.unavailable;
    if (price) price.classList.add('visibility-hidden');
  }

  getVariantData() {
    this.variantData = this.variantData || window.productJSON.variants;
    return this.variantData;
  }
}



class VariantRadios extends VariantSelects {
  constructor() {
    super();
  }

  updateOptions() {
    const fieldsets = Array.from(this.querySelectorAll('fieldset'));
    this.options = fieldsets.map((fieldset) => {
      return Array.from(fieldset.querySelectorAll('input')).find((radio) => radio.checked).value;
    });
  }

  updateOtherOptions(initial = false) {
    const optionIndex = initial ?  0 : parseFloat(event.target.closest('.product-form__option').getAttribute('data-option-index'));
    const currentOption = this.options[optionIndex];
    this.options.forEach((option,i) => {
      if(i === optionIndex) return true;
      this.getVariantData().forEach(variant => {
        if(variant.options[optionIndex] === currentOption) {
          let input = document.querySelector(`.product-form__option input[value="${variant.options[i]}"]`);
          if(variant.available) {
            input.classList.remove('soldout');
          } else {
            input.classList.add('soldout');
          }
        }
      });
    });
  }

}

const otherColors = () => {
  return;
  if(window.productJSON.title.indexOf(' | ') === -1) return;
  const color = window.productJSON.title.split(' | ')[1];
  const style = window.productJSON.title.split(' | ')[0];
  const fetchUrl = `/search?q=title:${style} -title:${color}&view=api`;
  const otherColors = document.querySelector('.other-colors');
  if(!otherColors) return;
  fetch(fetchUrl)
    .then((response) => response.json())
    .then((responseJSON) => {
      responseJSON.forEach((product) => {
        let swatch = document.createElement('a');
        swatch.setAttribute('href',`/products/${product.handle}`);
        swatch.classList.add('other-color');
        let swatchImage = imgUrl(product.featured_image, '80x');
        swatch.innerHTML = `<img class="other-color__image" src="${product.featured_image}" alt="${product.title}"><span class="visually-hidden">${product.title}</span>`;
        otherColors.appendChild(swatch);
      });
    });
};

const nonCaseSizes = (productTitle) => {
  if(productTitle === 'Wildflower Screen Protector') return;
  const fetchUrl = `/search?q=title:${productTitle}&type=product&view=api`;
  fetch(fetchUrl)
  .then((response) => response.json())
  .then((data) => {
    const responseJSON = data;
    responseJSON.forEach((product) => {

      const myTitle = product.title.split(' iPhone ')[0];
      if(myTitle !== productTitle) return;
      window.productJSON.variants.push(...product.variants);
      const sizeIndex = product.options.indexOf('Size');
      const sizeVariant = product.variants[0].options[sizeIndex];
      const option = document.createElement('option');
      option.value = sizeVariant;
      option.textContent = sizeVariant;
      option.setAttribute('data-url', '/products/'+product.handle);

      document.querySelector('.product-form__input select[name="options[Size]"]').appendChild(option);
    });
    customElements.define('variant-selects', VariantSelects);
    customElements.define('variant-radios', VariantRadios);
  })
  .catch((error) => console.log(error));
};

const otherSizes = () => {
  if(window.productJSON === undefined) return;
    // const isCase = window.productJSON.title.indexOf('Case') > -1;
  const isCase = true;
  const productTitle = window.productJSON.title.split(' iPhone ')[0];

  if(productJSON.title === 'Wildflower Screen Protector') {
    customElements.define('variant-selects', VariantSelects);
    customElements.define('variant-radios', VariantRadios);
    return false;
  }

  if(!isCase) {
    customElements.define('variant-selects', VariantSelects);
    customElements.define('variant-radios', VariantRadios);
    return false;
  }

  const fetchUrl = `/search?q=title:${productTitle}&type=product&view=api`;
  const currentSizeIndex = window.productJSON.options.indexOf('Size');
  if(!isCase) {
    nonCaseSizes(productTitle);
    return false;
  }
  if(currentSizeIndex === -1 || isCase !== true ) {
    customElements.define('variant-selects', VariantSelects);
    customElements.define('variant-radios', VariantRadios);
    return;
  }
  let currentSizes = window.productJSON.options_with_values[currentSizeIndex].values;
  let newSizes = [];
  fetch(fetchUrl)
  .then((response) => response.json())
  .then((data) => {
    const responseJSON = data;
    const otherSizes = responseJSON.filter((result) => {
      const resultTitle = result.title.split(' iPhone ')[0];
      return resultTitle === productTitle;
    });
    if(!otherSizes || otherSizes.length === 0) {
      customElements.define('variant-selects', VariantSelects);
      customElements.define('variant-radios', VariantRadios);
      return;
    }
       function checkPhoneSize(phoneSizes, title) {
      for (let i = 0; i < phoneSizes.length; i++) {
          const _size = phoneSizes[i];
          if (title.includes(_size)) {
              return _size;
          }
      }
  }
  
  iPhoneSizeList.forEach((size) => {
      otherSizes.forEach((product) => {
          if (window.productJSON.title === product.title) return true;
          window.productJSON.variants.push(...product.variants);
          const phoneSize = checkPhoneSize(iPhoneSizeList, product.title)
          if (phoneSize !== size) return true;
          const sizeIndex = product.options.indexOf("Size");
          const sizeVariant = product.variants[0].options[sizeIndex];
          const option = document.createElement("option");
          option.value = sizeVariant;
          option.setAttribute("data-phone-size", phoneSize);
          option.textContent = sizeVariant;
          option.setAttribute("data-url", "/products/" + product.handle);
  
          const phoneSizeHandle = phoneSize.replace(/\s+/g, "-").toLowerCase();
          document
              .querySelector(".product-form__input select")
              .appendChild(option);
      });
  });

    selectUserPhoneSize();
    otherColors();

    customElements.define('variant-selects', VariantSelects);
    customElements.define('variant-radios', VariantRadios);
  })
  .catch((error) => {
    console.log(error);
  });

}

const selectUserPhoneSize = () => {
  if(getCookie('iphone-model') == false || getCookie('iphone-model') === 'Not an iPhone') {
    const select = document.querySelector('.product-form__input select');
    const option = select.querySelector(`option[data-phone-size="${getCookie('iphone-model')}"]`);
    if(option) {
      option.selected = true;
      select.dispatchEvent(new Event('change'));
    }
  };
}

otherSizes();

const getPhoneSizeFromTitle = (title) => {
  if(!title) return false;
  if(title.indexOf('iPhone') === -1 || title.indexOf('Case') === -1) return false;
  return title.split(' iPhone ')[1].split(' Case')[0];
};

const productRecommendations = () => {
  const recommendationsList = document.querySelector('.product-recommendations');
  if(!recommendationsList) return;
  fetch(`/recommendations/products.json?product_id=${window.productJSON.id}&limit=50`)
  .then((response) => response.json())
  .then((data) => {
    const productSize = 'iPhone ' + getPhoneSizeFromTitle(window.productJSON.title);
    let totalFound = 0;
    data.products.forEach((product) => {
      const recommendationSize  = 'iPhone ' + getPhoneSizeFromTitle(product.title);
      if(productSize === recommendationSize && totalFound < 2) {
        let content = `<div class="product relative">
          <a target="_blank" class="link--fill-parent" href="${product.url}"><span class="visually-hidden">${product.title}</span></a>
          <div class="flex flex--align-center">
            <div class="one-third">
              <img src="${product.images[0]}" width="100%" title="${product.title}" alt="${product.title}"></a>
            </div>
            <div class="two-thirds">
              <h4 class="h3">${product.title}</h4>
              <h5 class="h4">${Shopify.formatMoney(product.price).replace('.00','')}</h5>
              <div class="btn--arrow">View Details</div>
            </div>
          </div>
        </div>`;
        let div = document.createElement('div');
        div.innerHTML = content;
        recommendationsList.appendChild(div);
        totalFound++;

      }
    });
  })
  .catch(error => console.log(error));

};
productRecommendations();

const foursixtyListener = () => {
  const target = document.querySelector('#foursixty');
  if(!target) return;
  const fsTimeline = document.querySelector('.fs-timeline');
  const observer = new MutationObserver(function() {
    if(!fsTimeline) return;
    if(fsTimeline.childNodes.length > 0) {
      target.style.display = 'block';
      observer.disconnect();
    }
  });
  observer.observe(target, { childList: true });
};
foursixtyListener();



class RecentlyViewed extends HTMLElement {
  constructor() {
    super();
    this.cookie = getCookie('recently-viewed');
    this.maxProducts = 4;
    this.grid = this.querySelector('.grid');
    this.showRecentlyViewed();
    this.recordRecentlyViewed();
  }
  recordRecentlyViewed() {
    if(!this.cookie) {
      this.cookie = window.productJSON.handle;
      setCookie('recently-viewed', this.cookie, 30);
      return;
    }
    const cookieArray = this.cookie.split(',');
    if(cookieArray.indexOf(window.productJSON.handle) !== -1) return;
    if(window.productJSON.title.indexOf('Screen Protector') !== -1) return;
    cookieArray.push(window.productJSON.handle);
    const newCookie = cookieArray.slice(-this.maxProducts).join(',');
    setCookie('recently-viewed', newCookie, 30);
  }
  showRecentlyViewed() {
    if(!this.cookie) return;
    const cookieArray = this.cookie.split(',');
    let products = [];
    cookieArray.forEach((productHandle) => {
      fetch(`/products/${productHandle}?view=card-product`)
      .then((response) => response.text())
      .then((data) => {
        products.push(data);
        if(products.length === cookieArray.length) {
          this.render(products);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    });
  }
  render(products) {
    products.forEach((product) => {
      let li = document.createElement('li');
      li.classList.add('grid__item');
      li.innerHTML = product;
      this.grid.appendChild(li);
      lazyImages();
    });
  }
}
customElements.define('recently-viewed', RecentlyViewed);
