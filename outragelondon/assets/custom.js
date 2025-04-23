  $(document).on("click", ".custom-rec-btn", function(){
    let variantId = $(this).parent().find(".custom-rec-variants").val();
    let arr = [];
    arr.push({'id': variantId, 'quantity': 1});
    ATCtoCartDrawer(arr, $(this));
  });
    function ATCtoCartDrawer(productsArr, $this){
        $this.addClass("active");
        let formData = {
            'items': productsArr
        };
        fetch(window.Shopify.routes.root + 'cart/add.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'xmlhttprequest'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            return response.json();
        })
        .then(res => {
            if(res.status){
              toastr.error(res.description);
            }
            else{
              document.dispatchEvent(new CustomEvent('cart:build'));
              $this.parents("swiper-slide").hide();
            }
        })
        .catch((error) => {
            console.error('Error test:', error);
        })
        .finally(() => {
            $this.removeClass("active");
        });
    }

$(document).ready(function() {
  setTimeout(function() {
          $('.template-product .product-block.product-variants-block').css('opacity',1);
        },1000);
  $('.template-product .product-variants-block .variant-wrapper').each(function() {
    var $gridContainer = $(this).find('.variant-input');
        var itemCount = $gridContainer.length;
        var columns;
    if (itemCount % 2 === 0) {
            columns = itemCount / 2;
        } else {
            columns = Math.ceil(itemCount / 2);
        }
            
    // console.log('columns = '+columns);
        $(this).find('fieldset.variant-input-wrap').css('grid-template-columns', 'repeat(' + columns + ', 1fr)');
  });
});