// Integration theme script generated at Sun Nov 15 2020 20:38:42 GMT+0000 (Greenwich Mean Time)
if (BIS.urlIsProductPage() === true) {
  BIS.popup.ready.then(function () {
    // Exit script if product has no sold out variants.
    if (BIS.popup.variants.length < 1) {
      return;
    }

    // Build button that will be inserted in the product page.
    var button = document.createElement("button");
    button.setAttribute("id", "BIS_trigger");
    button.setAttribute("type", "button");
    button.setAttribute("class", "btn");
    button.style.cssText = "margin-top: 5px";
    button.textContent = BIS.Config.button.caption;

    // Insert the button into the product page.
    BIS.inlineButtonAnchor = ".shopify-payment-button";
    var anchor = document.querySelector(BIS.inlineButtonAnchor);
    anchor.insertAdjacentElement("beforebegin", button);

    // Control button visibility
    var variantId;
    var originalDisplay = button.style.display;
    BIS.refreshInlineButton = function () {
      try {
        var variant = BIS.detectVariant(BIS.popup);

        if (variant && BIS.popup.variantIsUnavailable(variant)) {
          variantId = variant.id;
          button.style.display = originalDisplay;
        } else {
          button.style.display = "none";
        }
      } catch (e) {
        console.log(e);
      }
    };

    BIS.refreshInlineButton();

    BIS.delayedRefreshInlineButton = function () {
      setTimeout(function () {
        BIS.refreshInlineButton();
      }, 15);
    };

    // Refresh button visibility on document change.
    document.addEventListener("change", BIS.delayedRefreshInlineButton);

    // Select the variant in popup form.
    button.addEventListener("click", function () {
      BIS.popup.form.selectVariant(variantId);
    });
  });
}
