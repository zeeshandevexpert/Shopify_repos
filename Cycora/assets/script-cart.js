$( document ).ready(function() {
    loadCart();
    initCart();
    initButtonChangeQuantityOnProductPage();
    initUpdateQuantityOnCartPage();
    initPromoCodeForm();

});

async function doesDiscountCodeExist(discountCode) {
    const result = await fetch(`/admin/discount_codes/lookup.json?code=${discountCode}`);

    if (result.status == 200) {
        setCookie("discount_code", discountCode, 10);
        document.location.href=document.location.origin + '/discount/' + discountCode + '?redirect=/checkout';
    }
}

function initPromoCodeForm(){
    $('#apply_promo_code').on('click', function(){
        var customer_promo_code = $('#customer_promo_code').val();
        doesDiscountCodeExist(customer_promo_code);
    });

    var res_cookie = getCookie('discount_code');
    if(res_cookie!='' && res_cookie!=null){
        $('#customer_promo_code_res').text(res_cookie);
        $('#apply_promo_code').hide();
        $('#promo_code_fixed, .discount-active').show();
        $('#customer_promo_code').hide();
    }
}

function loadCart() {
    jQuery.ajax({
        type: 'GET',
        url: '/cart.json',
        dataType: 'jsonp',
        success: function(data) {



            var item_count = data['item_count'];
            var total_price = data['total_price']/100;
            var cart_has_subscibe_product = 0;

            //If there are items in cart
            if ( item_count > 0 ) {

                // cart count
                jQuery('.cart-count').text(item_count);

                // mini cart data
                jQuery('.mini-cart').attr('id','mini-cart');
                jQuery('.mini-cart-subtotal').text( '$ ' + total_price.toFixed(2));
                jQuery('.cart-page-subtotal').text( '$ ' + total_price.toFixed(0) + ' usd');

                var cart_list_small = [];
                var cart_list = [];
                var cart_list_cart_page = [];

                for( var i = 0; i < item_count; i++ ){


                    if(data['items'][i]) {
                        if (data['items'][i]['id']) {

                            var item_id = data['items'][i]['id'];
                            var product_title = data['items'][i]['title'];
                            var variant_title = data['items'][i]['variant_title'];
                            var product_handle = data['items'][i]['handle'];
                            var quantity = data['items'][i]['quantity'];
                            var line_price = data['items'][i]['final_line_price'] / 100;
                            var product_url = data['items'][i]['url'];
                            var image_url = data['items'][i]['image'];
                            var variants = data['items'][i]['variant_options'];
                            var product_oz = Math.ceil(data['items'][i]['grams']/28.34952);

                            var options = [];
                            for (var o = 0; o < variants.length; o++) {
                                var selected = data['items'][i]['variant_options'][o];
                                if (selected !== 'Default Title') {
                                    options.push(selected + '<br>');
                                }
                            }
                            var selected_options = options.join('');

                            var min_quantity = 1;

                            var html_small_cart = '<div class="cart-menu-hover-product">' +
                                                    '<span>' + product_title + '</span>' +
                                                    '<span>$' + line_price.toFixed(2) + '</span>' +
                                                    '</div>'

                            var options_quantity = '';
                            var j = 0;
                            var selected = '';
                            while(j<11){
                                if(j==quantity){
                                    selected = 'selected';
                                }else{
                                    selected = '';
                                }
                                options_quantity = options_quantity + '<option value="' + j + '" ' + selected + '>' + j + '</option>';
                                j++;
                            }

                            var html = '<div class="cart-menu-modal-row">' +
                                '            <div class="cart-menu-modal-col cart-menu-modal-col-1">' +
                                '                <a href="' + product_url + '"><span>' + product_title + '</span></a>' +
                                '            </div>' +
                                '            <div class="cart-menu-modal-col cart-menu-modal-col-2">' +
                                '                <span>' + variant_title + '<u class="remove-item-from-cart" data-productId="' + item_id + '">remove</u></span>' +
                                '            </div>' +
                                '            <div class="cart-menu-modal-col cart-menu-modal-col-3">' +
                                '                <div class="select-style1">' +
                                '                    <select class="change-quantity-selector" data-productId="' + item_id + '">' + options_quantity + '</select>' +
                                '                </div>' +
                                '            </div>' +
                                '            <div class="cart-menu-modal-col cart-menu-modal-col-4">' +
                                '                <span>$' + line_price.toFixed(2) + '</span>' +
                                '            </div>' +
                                '        </div>';

                            var html_cart_page = '<div class="cart-main-row">' +
                                '      <div class="cart-main-col cart-main-col-1">' +
                                '        <a href="' + product_url + '"><span>' + product_title + '</span></a>' +
                                '      </div>' +
                                '      <div class="cart-main-col cart-main-col-2">' +
                                '        <span>' + variant_title + '<u class="remove-item-from-cart" data-productId="' + item_id + '">remove</u></span>' +
                                '      </div>' +
                                '      <div class="cart-main-col cart-main-col-3">' +
                                '        <div class="select-style2">' +
                                '         <select class="change-quantity-selector" data-productId="' + item_id + '">' + options_quantity + '</select>' +
                                '        </div>' +
                                '      </div>' +
                                '      <div class="cart-main-col cart-main-col-4">' +
                                '        <span>$' + line_price.toFixed(2) + '</span>' +
                                '      </div>' +
                                '    </div>';

                            cart_list_cart_page.push(html_cart_page);
                            cart_list_small.push(html_small_cart);
                            cart_list.push(html);

                        } //endif
                    }
                } // endfor

                jQuery('.cart-items-list').html( cart_list_cart_page.join('') );
                jQuery('.small-cart-on-hover').html( cart_list_small.join('') );
                jQuery('.mini-products-list').html( cart_list.join('') );

                $('.no-items-in-cart').hide();

                jQuery('.remove-item-from-cart').on('click',function(){
                    var product_variant_id = $(this).attr('data-productId');
                    $(this).parent().parent().parent().parent().parent().remove();
                    removeItemCountInCart(product_variant_id,0);
                });

                jQuery('.change-quantity-selector').on('change', function(){
                    $('.mini-products-list, .cart-items-list').hide();
                    $('.loadingCart').show();

                    var product_variant_id = $(this).attr('data-productId');
                    var new_element_quantity = parseInt($(this).val());

                    updateItemCountInCart(product_variant_id, new_element_quantity);

                });

                $('.mini-products-list, .hide-if-no-items, .cart-items-list').show();
                $('.loadingCart').hide();
            }else{
                $('.loadingCart, .hide-if-no-items').hide();
                $('.mini-products-list, .small-cart-on-hover, .cart-items-list').empty().show();
                $('.no-items-in-cart').show();
                $('.mini-cart-subtotal, .cart-page-subtotal').text('');
            }
        }
    });
}

function initCart() {
    jQuery.ajax({
        type: 'GET',
        url: '/cart.js',
        dataType: 'json',
        success: function(data) {

            var item_counts_in_cart = data.items.length;
            var total_items_in_cart = data.item_count;

            $('#case_1_text, #case_2_text').hide();
            $('.custom-progress-bar').removeClass('case-1').removeClass('case-2').removeClass('case-3');
            if(total_items_in_cart==1){
                $('#case_1_text').show();
                $('.custom-progress-bar').addClass('case-1');
            }else if(total_items_in_cart==2){
                $('#case_2_text').show();
                $('.custom-progress-bar').addClass('case-2');
            }else if(total_items_in_cart>2){
                $('.custom-progress-bar').addClass('case-3');
            }

            if(item_counts_in_cart>0) {
                 var products_in_cart = data.items.length;
                 if(products_in_cart<10){
                     products_in_cart = '0'+ products_in_cart;
                 }

                 $('#header_cart_quantity').show().text('('+data.items.length+')');
                 $('.cart-page-count').show().text(data.item_count+' items');
                 $('.cart_wrapper').find('span').text(data.item_count);
                 $('#small_cart_elements_count').text(products_in_cart);
                 $('.no-items-in-cart, .small-cart-empty').hide();
                 $('.small-cart-checkout-button, .mini-cart-block').show();
                 $('.cart-menu').addClass('cart-menu-with-products');
            }else{
                 $('.no-items-in-cart, .small-cart-empty').show();
                 $('.cart-menu').removeClass('cart-menu-with-products');
                 $('.cart_wrapper').find('span').text(data.item_count);
                 $('#header_cart_quantity, .cart-page-count').text('');
                 $('.mini-products-list, .small-cart-on-hover, .cart-items-list').empty();
                 $('#small_cart_elements_count, .mini-cart-subtotal, .cart-page-subtotal').text('');
                 $('.mini-cart-block, .small-cart-checkout-button').hide();
            }
        }
    });
}

function initButtonChangeQuantityOnProductPage() {
    $('.icon-minus').addClass('no-active');

    $('.button-quantity-change').on('click', function(){

        var product_id = $(this).data('product_id');
        var selected_qty = parseInt($('#product_selected_quantity_' + product_id).val());
        var max_qty = parseInt($('#product_max_quantity_' + product_id).val());
        var min_qty = $('#product_min_quantity_' + product_id).val();

        var new_qty = selected_qty * 1;

        if($(this).hasClass('icon-plus')) {
            if(max_qty>selected_qty) {
                new_qty++;
            }
        }else{
            if(new_qty>1) {
                new_qty--;
            }
        }
        new_qty = (isNaN(new_qty))?1:new_qty;

        if(new_qty<min_qty){
            new_qty = min_qty;
        }

        if(new_qty==min_qty){
            $('.icon-minus').addClass('no-active');
        }else{
            $('.icon-minus').removeClass('no-active');
        }

        if(new_qty<10){
            new_qty = '0' + new_qty
        }

        $('#product_selected_quantity_' + product_id).val(new_qty);

        if(max_qty==new_qty) {
            $('.icon-plus').hide();
        }else{
            $('.icon-plus').show();
        }
    });
}

function removeItemCountInCart(variant_id,new_count, reload) {

    var data = {
        'id': variant_id,
        'quantity': new_count
    }
    jQuery.ajax({
        type: 'POST',
        url: '/cart/change.js',
        data: data,
        dataType: 'json',
        success: function(data) {
            initCart();
            loadCart();
            if(reload == 1 || document.location.pathname=='/cart'){
                document.location.reload();
            }
        },
        error: function(error) {
            alert(error.responseJSON.message + '\r\n' + error.responseJSON.description);
            initCart();
            loadCart();
        }

    });
}

function initUpdateQuantityOnCartPage(){
    $('.cart-quantity-update').on('click', function(){
        $('.cart-loading').show();
        $('.product-cart-row').hide();

        var product_id = $(this).data('product_id');
        var variant_id = $('#cart_product_variant_id_' + product_id).val();

        var current_element_quantity = parseInt($('#product_selected_quantity_' + product_id).val());

        if($(this).hasClass('icon-plus')) {
            updateItemCountInCart(variant_id, current_element_quantity, '', '', 1);
        }else{
            if($(this).hasClass('delete-item-from-cart')){
                current_element_quantity = 0;
            }
            console.log(current_element_quantity);
            removeItemCountInCart(variant_id, current_element_quantity, 1);
        }

    });
}

function updateItemCountInCart(variant_id,new_count) {

        var data = {
            "id": variant_id,
            "quantity": new_count
        }

        jQuery.ajax({
            type: 'POST',
            url: '/cart/change.js',
            data: data,
            dataType: 'json',
            success: function(data) {
                initCart();
                loadCart();
            },
            error: function(error) {
                alert(error.responseJSON.message + '\r\n' + error.responseJSON.description);
                initCart();
                loadCart();
            }
        });

}

function showSmallCart(){
    $('.cart-menu').click();
}

function addItemToCartRecharge(product_id) {

    var qty = parseInt($('.product_selected_quantity').val());
    var order_type = '';

    $('#product_form_' + product_id + ' input[name="purchase_type"]').each(function(i,elem) {
        if($(elem).is(":checked")){
            order_type = $(elem).val();
        }
    });

     if(order_type=='onetime') {
         var variant_id = $('#selected_or_first_available_variant_' + product_id).val();
     }else{
         var variant_id = $('#subscribe_variant_id_' + product_id).val();
     }

    if(qty>0 && variant_id) {

        if (order_type == 'onetime') {
            data = {
                "id": variant_id,
                "quantity": qty
            }
        } else {
            data = {
                "id": variant_id,
                "quantity": qty,
                "properties[subscribe]":1
            }
        }

        jQuery.ajax({
            type: 'POST',
            url: '/cart/add.js',
            data: data,
            dataType: 'json',
            success: function (e) {
                initCart();
                loadCart();
                showSmallCart();
            },error:function(error){
                alert(error.responseJSON.message + '\r\n' + error.responseJSON.description);
            }
        });
    }else{
        alert('Error. Can\'t add this product to cart!')
    }

}

function addItemToCart() {

    var variant_id = $('#active_variant_id').val();

    var data = {
        "id": variant_id,
        "quantity": 1
    }

        jQuery.ajax({
            type: 'POST',
            url: '/cart/add.js',
            data: data,
            dataType: 'json',
            success: function () {
                initCart();
                loadCart();
                showSmallCart();
                var body = $("html, body");
                body.stop().animate({scrollTop:0}, 1500, 'swing', function() {
                    //showSmallCart();
                });
            },
            error: function (error) {
                alert(error.responseJSON.message + '\r\n' + error.responseJSON.description);
            }
        });

}
function addSubscribeItemToCart(variant_id, product_id) {

    if(product_id>0){
        var qty = parseInt($('#product_block_index_' + product_id + ' .product_selected_quantity').val());
        var properties = $('#product_block_index_' + product_id + ' .product_extra_properties').val();
        var selling_plan = $('#product_block_index_' + product_id + ' input[name="selling_plan"]').val();
        var min_quantity = $('#product_min_quantity_' + product_id).val();
    }else {
        var qty = parseInt($('#product_selected_quantity').val());
        var properties = $('.product_extra_properties').val();
        var selling_plan = $('input[name="selling_plan"]').val();
        var min_quantity = $('.product_min_quantity').val();
    }

    if(!qty){
        qty = 1;
    }

    if(qty<min_quantity){
        qty = min_quantity;
    }

    setTimeout(function() {
        if(properties!='') {
            var data = {
                "id": variant_id,
                "quantity": qty,
                "selling_plan": selling_plan,
                "properties": { properties }
            }
        }else{
            var data = {
                "id": variant_id,
                "quantity": qty,
                "selling_plan": selling_plan
            }
        }

        jQuery.ajax({
            type: 'POST',
            url: '/cart/add.js',
            data: data,
            dataType: 'json',
            success: function () {
                initCart();
                loadCart();
                showSmallCart();
            },
            error: function(error) {
                alert(error.responseJSON.message + '\r\n' + error.responseJSON.description);
            }
        });
    }, 100);

}

function quickAddItemToCart(variant_id, product_id) {

    if(product_id>0){
        var quantity = parseInt($('#product_selected_quantity_' + product_id).val());
    }else{
        var quantity = 1;
    }

    var data = {
        "id": variant_id,
        "quantity": quantity
    }

    jQuery.ajax({
        type: 'POST',
        url: '/cart/add.js',
        data: data,
        dataType: 'json',
        success: function() {
            if(document.location.pathname=='/cart'){
                document.location.reload();
            }else{
                initCart();
                loadCart();
                showSmallCart();
            }
        },
        error: function(error) {
            alert(error.responseJSON.message + '\r\n' + error.responseJSON.description);
        }
    });
}

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}


function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');

    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

