class VariantSelects extends HTMLElement {
    constructor() {
      super();
      this.addEventListener('change', this.onVariantChange);
    }
  
    onVariantChange() {
      this.updateOptions();
      this.updateMasterId();
      this.toggleAddButton(true, '', false);
  
      if (!this.currentVariant) {
        this.toggleAddButton(true, '', true);
        this.setUnavailable();
      } else {
        this.updateMedia();
        this.updateURL();
        this.updateVariantInput();
        this.renderProductInfo();
      }
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
    
    updateMedia() {
      if (!this.currentVariant) return;
      if (!this.currentVariant.featured_media) return;
      const newMedia = document.querySelector(
        `[data-media-id="${this.dataset.section}-${this.currentVariant.featured_media.id}"]`
      );
  
    //   if (!newMedia) return;
    //   const mediaSlideshow = document.getElementById(
    //     `MediaSlideshow-${this.dataset.section}`
    //   );
    //   mediaSlideshow.setActiveMedia(
    //     `${this.dataset.section}-${this.currentVariant.featured_media.id}`
    //   );
    }
  
    updateURL() {
      if (!this.currentVariant) return;
      window.history.replaceState({ }, '', this.dataset.url+'?variant='+this.currentVariant.id);
    }
  
    updateVariantInput() {
      const productForms = document.querySelectorAll('#add-to-cart-form');
      productForms.forEach((productForm) => {
        const input = productForm.querySelector('input[name="id"]');
        input.value = this.currentVariant.id;
        input.dispatchEvent(new Event('change', { bubbles: true }));
        
        //Variant selection changed
        const currentVariant = this.currentVariant;
        document.dispatchEvent(new CustomEvent('variant:changed', {
          bubbles: true,
          detail: {
            variant: currentVariant
          }
        }));
      });
      const addButton = document.querySelector('[name="add"]');
      if(addButton) addButton.dataset.variantId = this.currentVariant.id;
    }
  
    updatePickupAvailability() {
      const pickUpAvailability = document.querySelector('pickup-availability');
      if (!pickUpAvailability) return;
  
      if (this.currentVariant?.available) {
        pickUpAvailability.fetchAvailability(this.currentVariant.id);
      } else {
        pickUpAvailability.removeAttribute('available');
        pickUpAvailability.innerHTML = '';
      }
    }
  
    renderProductInfo() {
      fetch(this.dataset.url+'?variant='+this.currentVariant.id+'&section_id='+this.dataset.section)
        .then((response) => response.text())
        .then((responseText) => {
          const id = "price-"+this.dataset.section;
          const html = new DOMParser().parseFromString(responseText, 'text/html')
          const destination = document.getElementById(id);
          const source = html.getElementById(id);
  
          if (source && destination) destination.innerHTML = source.innerHTML;
          
          document.getElementById('price-'+this.dataset.section)?.classList.remove('visibility-hidden');
          this.toggleAddButton(!this.currentVariant.available, window.variantStrings.soldOut);
          
        });
    }
  
    toggleAddButton(disable = true, text, modifyClass = true) {
      const addButton = document.querySelector('[name="add"]');
      const btnText = addButton.querySelector('.Btn_Text');
          
      if (!addButton) return;
  
      if (disable) {
        addButton.setAttribute('disabled', true);
        if (text) btnText.textContent = text;
        
      } else {
        addButton.removeAttribute('disabled');
        btnText.textContent = window.variantStrings.addToCart;
      }
  
      if (!modifyClass) return;
    }      
  
    setUnavailable() {
      const addButton = document.querySelector('[name="add"]');
      const btnText = addButton.querySelector('.Btn_Text');
      if (!addButton) return;
      btnText.textContent = window.variantStrings.unavailable;
      document.getElementById('price-'+this.dataset.section)?.classList.add('visibility-hidden');
    }
  
    getVariantData() {
      this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent);
      return this.variantData;
    }
  }
  
  customElements.define('variant-selects', VariantSelects);
  
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
  }
  
  customElements.define('variant-radios', VariantRadios);


/* modal popup code */

const modalBtn = document.querySelector('.subscriptionModal'); 
const modalPopup = document.querySelector('.subscriptionModalPopup');
const subscriptionitem = document.querySelector('.subscription-item');
const subscriptionpastry = document.querySelector('.subscription-pastry');
const spinner = document.querySelector('.spinner-border');
const closeBtn = document.querySelector('.close');
const outerLayer = document.querySelector('.modalLayer');
  if (modalBtn) {
  modalBtn.addEventListener('click', function(){
    modalPopup.classList.add('show');     
    outerLayer.classList.add('show');
  });
    }
    // if (subscriptionitem) {
    //   subscriptionitem.addEventListener('click', function(){
    //   spinner.style.display = 'inline-block';
    //   });
    // }
  // if (subscriptionpastry) {
  //   subscriptionpastry.addEventListener('click', function(){
  //   spinner.style.display = 'inline-block';
  // });
  // }
if (closeBtn) {
closeBtn.addEventListener('click', function(){
    modalPopup.classList.remove('show');     
    outerLayer.classList.remove('show');
});
}

document.addEventListener("productmodal:close", function (evt) {
  if (closeBtn) {
    closeBtn.click();
  }
});