//settings
window.paywhirl.paywhirlContainer = '.paywhirl-options';
window.paywhirl.spDescription = '.selling-plan__description';
window.paywhirl.spAllocation = '.selling-plans-allocation';
window.paywhirl.spOptionSelect = '.selling-plan-option__select';
var Shopify = Shopify || {},
    whrl = window.paywhirl;

function init() {
    whrl.productForm = $(whrl.paywhirlContainer).closest('form');
    if ($(whrl.paywhirlContainer).is('*')) {

        $(whrl.paywhirlContainer).find('input').change(function () {
            $('.selling-plan').addClass('selling-plan--inactive');
            var p = $(this).closest('.selling-plan');
            p.removeClass('selling-plan--inactive').find(whrl.spOptionSelect).change();
            if (!p.find(whrl.spOptionSelect).is('*')) {
                var variant = get_varint() || $(whrl.spAllocation).find('optgroup:first').data('variant-id');
                var variants_input = whrl.productForm.find('input[type!="hidden"]:not(' + whrl.paywhirlContainer + ' input), select:not(' + whrl.paywhirlContainer + ' select)');
                if (variants_input.is('*')) {
                    setPrice(whrl.variants[variant]);
                } else {
                    setPrice(whrl.defaultPrice);
                }

                setDescription('');
                $(whrl.spAllocation).val('');
                updateHistoryState('');
            }
        });

        if (!tryFindPriceContainer()) return 0;

        if (whrl.productPriceSale) {
            $(whrl.spOptionSelect).change(function () {
                chosePlan(this);
            });

            $(whrl.productForm).change(function (e) {
                if (!$(e.target).closest(whrl.paywhirlContainer).is('*')) {
                    var selling_plan = $.urlParam('selling_plan');
                    setTimeout(function () {
                        updateHistoryState(selling_plan, get_varint());
                        set_plan(selling_plan);
                        triggerOpenedPlan();
                    }, 0)
                }
            });
        }

        if (get_plan() || get_varint()) {
            triggerOpenedPlan();
        }
    }

    if (whrl.ajaxCartContainer) {
        $(document).ajaxComplete(function (event, xhr, settings) {
            if (settings.type == 'GET' && settings.url === "/cart.js") {
                var subscription_plas = {};
                var r = JSON.parse(xhr.responseText);
                $.each(r.items, function (i, item) {
                    if ($.isEmptyObject(item.selling_plan_allocation) || !('selling_plan' in item.selling_plan_allocation)) return;
                    subscription_plas[i] = item.selling_plan_allocation.selling_plan.name;
                });
                setTimeout(function () {
                    сhangeAjaxCart(subscription_plas);
                }, 0);
            }
        });

        function сhangeAjaxCart(subscription_plas) { 
            $(whrl.ajaxCartContainer).find('.subscription-plan-new').remove();
            if ($.isEmptyObject(subscription_plas)) return;
            $.each(subscription_plas, function (eq, plan) {
                var el = $(whrl.ajaxCartContainer).find(whrl.ajaxCartProductName).eq(eq);
                el.after('<div class="subscription-plan-new">' + plan + '</div>');
            });
        }
    }

    function tryFindPriceContainer(option = 0) {
        if (whrl.productPriceSale && $(whrl.productPriceSale).is('*')) return 1;
        var sp = (whrl.formatedDefaultPrice).split(".");

        if ($(option = $('[itemprop="price"]').first()).is('*') || $(option = $('main *').findByContentText(whrl.formatedDefaultPrice)).is('*') || $(option = $('main *').findByContentText(sp[0])).is('*')) {
            whrl.productPriceSale = option;
            return 1;
        } else {
            console.error('Paywhirl could not found Product Price Sale container automatically, set it mannualy.');
        }
        return 0;
    }

    function set_plan(plan_id) {
        $(whrl.paywhirlContainer).find('input:checked').closest('.selling-plan').find(whrl.spOptionSelect).find('option[data-selling-plan-id="' + plan_id + '"]').prop('selected', true)
    }

    function get_varint() {
		var variant = $(whrl.productForm).find('input[name=id], select[name=id]').first().val();
		if(!variant) {
			variant = $.urlParam('variant')
		}
        return variant;
    }

    function get_plan() {
        return $(whrl.paywhirlContainer).find('input:checked:not(#sellingPlan-One-time)').closest('.selling-plan').find(whrl.spOptionSelect).find(":selected").data('selling-plan-id')
    }

    function triggerOpenedPlan() {
		chosePlan($(whrl.paywhirlContainer).find('input:checked:not(#sellingPlan-One-time)').closest('.selling-plan').find(whrl.spOptionSelect));

		if(window.paywhirl.prod_id in whrl.allow_product_variants) {
			var variant = $('.single-option-selector__radio').val();
			var allow_variants = whrl.allow_product_variants[window.paywhirl.prod_id];
		
			if(allow_variants.includes(variant)) {
				$('.paywhirl-options').show();
			} else {
				$('#sellingPlan-One-time-purchase').prop( "checked", true ).change();
				$('.paywhirl-options').hide();
			}
		}
    }

    function chosePlan(that) {
        if (!$(that).is('*')) return;

        var sp_id = $(that).find(":selected").data('selling-plan-id');
        var variant = get_varint() || $(whrl.spAllocation).find('optgroup:first').data('variant-id');
        var selected = $(whrl.spAllocation).find('option[data-value=' + variant + '-' + sp_id + ']');
        selected.prop('selected', true);
        updateHistoryState(sp_id);
        setPrice(selected.data('price'));
        setDescription(selected.data('description'));
    }

    function setPrice(price, to = '') {
		to = to ? to : whrl.productPriceSale;

		if($('#ComparePrice').text()) {
			var floats = $('#ComparePrice').text().match(/[+-]?\d+(\.\d+)?/g).map(function(v) { return parseFloat(v); });
			var comparePrice = floats[0];
				comparePrice = comparePrice.toString().replace(/\./, '');
			var save = Math.round(comparePrice - price);

			$('#DiscountSaved span').hide();
			$('#DiscountSaved .subscription-saves').remove();
			$('#DiscountSaved').append('<span class="number-discount_saved subscription-saves">SAVE '+(Shopify.formatMoney(save, theme.money_format))+'</span>')
		} 
		
        var price = Shopify.formatMoney(price, theme.money_format);
        if ($(whrl.productPriceSale).find('sup').is('*')) {
            p = price.split(".");
            $(whrl.productPriceSale).html(p[0] + '<sup>' + p[1] + '</sup>');
        } else {
            $(whrl.productPriceSale).text(price);
		}
		
    }

    function setDescription(text) {
        $(whrl.spDescription).text(text);
    }

    function updateHistoryState(sp_id = 0, cur_var = 0) {
        if (!history.replaceState) {
            return;
        }
        var newurl =
            window.location.protocol +
            '//' +
            window.location.host +
            window.location.pathname +
            '?';
        if (sp_id) {
            newurl += 'selling_plan=' + sp_id;
        }
        if ((cur_var = cur_var ? cur_var : get_varint())) {
            if (sp_id) newurl += '&';
            newurl += 'variant=' + cur_var;

        }
        setTimeout(function () {
            window.history.replaceState({
                path: newurl
            }, '', newurl);
        }, 30)
    }
}

function JQueryAnyway() {
    var $ = jQuery;
    $(function () {
        $.fn.findByContentText = function (text) {
            var r = [];
            $(this).contents().filter(function () {
                if ($(this).text().trim() == text.trim() && $(this).get(0).nodeName == '#text') {
                    r.push($(this).parent().get(0));
                }
            });
            return $(r);
        };
        $.urlParam = function (name) {
            var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
            if (results == null) {
                return null;
            }
            return decodeURI(results[1]) || 0;
        }
        setTimeout(function () {
            init();
        }, 0);

    });
}
if (typeof jQuery == 'undefined') {
    console.log('load requred jquery');
    var headTag = document.getElementsByTagName("head")[0];
    var jqTag = document.createElement('script');
    jqTag.type = 'text/javascript';
    jqTag.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js';
    jqTag.onload = JQueryAnyway;
    headTag.appendChild(jqTag);
} else {
    JQueryAnyway();
}

// ---------------------------------------------------------------------------
// Money format handler
// ---------------------------------------------------------------------------
Shopify.money_format = window.paywhirl.money_format || "${{amount}}";
if (!('formatMoney' in Shopify)) {
    console.log('redefine formatMoney');
    Shopify.formatMoney = function (cents, format) {
        if (typeof cents == 'string') {
            cents = cents.replace('.', '');
        }
        var value = '';
        var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
        var formatString = (format || this.money_format);

        function defaultOption(opt, def) {
            return (typeof opt == 'undefined' ? def : opt);
        }

        function formatWithDelimiters(number, precision, thousands, decimal) {
            precision = defaultOption(precision, 2);
            thousands = defaultOption(thousands, ',');
            decimal = defaultOption(decimal, '.');

            if (isNaN(number) || number == null) {
                return 0;
            }

            number = (number / 100.0).toFixed(precision);

            var parts = number.split('.'),
                dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands),
                cents = parts[1] ? (decimal + parts[1]) : '';

            return dollars + cents;
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
        }

        return formatString.replace(placeholderRegex, value);
    };
}
