if (!customElements.get('quick-add')) {
  customElements.define('quick-add', class QuickAdd extends HTMLElement {
    constructor() {
      super();

      this.querySelector('.quick-add__add-button').addEventListener('click', this.onButtonClick.bind(this));
      this.card = this.closest('.card');
      this.cardLink = this.card.querySelector('.card__heading.h4 a');
      this.productUrl = this.cardLink.getAttribute('data-product-url');
      this.json = JSON.parse(this.card.getAttribute('data-json'));
      this.variants = this.json.variants;
      this.colorButtons = this.card.querySelectorAll('.quick-add__button--color');

      this.colorButtons.forEach(
        (button) => button.addEventListener('click', this.onColorButtonClick.bind(this))
      );

      this.colorIndex = this.json.options.indexOf('Color');
      this.sizeIndex = this.json.options.indexOf('Size');
      this.selectedColor = this.card.querySelector('.quick-add__button--color[selected]');
      this.addButton = this.querySelector('.quick-add__add-button');
      this.init();

    }
    onButtonClick(event) {
      if (this.addButton && this.addButton.classList.contains('BIS_trigger')) return;
      const variantId = event.target.getAttribute('data-variant-id');;
      const properties = event.target.getAttribute('data-properties') ? JSON.parse(event.target.getAttribute('data-properties')) : {};

      addToCart(variantId, 1, properties, function (event) {
        document.dispatchEvent(new CustomEvent("addtocart"));
      });
    }
    updateUrl() {
      let foundOne = false;
      this.json.variants.forEach((variant) => {
        if(variant.options[this.colorIndex] === this.selectedColor.value && !foundOne) {
          this.cardLink.setAttribute('href',`${this.productUrl}?variant=${variant.id}`);
          foundOne = true;
        };
      });
    }
    onColorButtonClick() {
      this.card.querySelectorAll('.quick-add__button--color').forEach(
        (button) => button.removeAttribute('selected')
      )
      event.target.setAttribute('selected',true);
      this.selectedColor = event.target;
      this.changeImage();
      this.updateUrl();
      this.sizeAvailabilities();
      this.updateSelectedSize();
    }
    init() {
      if(!this.selectedColor) return;
      this.sizeAvailabilities();
    }
    updateSelectedSize() {
      if(!this.selectedColor) return;
      const selectedColorEl = this.card.querySelector('.card__selected-color');
      if(!selectedColorEl) return;
      selectedColorEl.innerHTML = this.selectedColor.value;

    }
    sizeAvailabilities() {
      if(!this.selectedColor) return;
      this.variants.forEach((variant) => {
        if(variant.options[this.colorIndex] !== this.selectedColor.value) return true;
        let sizeButton = this.querySelector(`button[value="${variant.options[this.sizeIndex]}"]`);
        if(sizeButton) sizeButton.disabled = !variant.available;
      });
    }
    changeImage() {
      let foundOne = false;
      const thisImage = this.card.querySelector('.card__media img');
      this.variants.forEach((variant) => {
        if(variant.options[this.colorIndex] !== this.selectedColor.value) return true;
        if(!foundOne) {
          updateSrcSet(thisImage,variant.featured_image.src);
          foundOne = true;
          return;
          thisImage.setAttribute('src',variant.featured_image.src);
          thisImage.setAttribute('srcset',variant.featured_image.src);
          foundOne = true;
        };
      });
    }
  })
}