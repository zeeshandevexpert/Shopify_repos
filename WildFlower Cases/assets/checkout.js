function GEShopifyCheckout() {
    this.elementsConfig = null;
    this.ContinueToShippingButton = null;
    this.SetContainerRetries = 150;
    this.SetContainerIntervalMS = 100;
    this.originalShopifyButton = null;
    this.glbeCompleteOrderButton = null;
    this.glbeContinueToShippingButton = null;
    this.paymentBoxContainerId = "glbe-paymentBox-container";
    this.injectedContainerId = "glbe-secureContainer";
    this.msgContainerClass = "glbe-payments-msg";
    this.msgContainer = null;
    this.cardHintContainer = null;
    this.activePaymentTab = null;
    this.activePaymentId = null;
    this.activePaymentForm = null;
    this.baseCurrency = null;
    this.checkoutId = null;
    this.globalePaymentSelected = false;
    this.clientLogsEnabled = true;
    this.isShopifyIntegrationV2 = false;
    this.duplicatedTrxPopupResources = null;
    this.showCustomerIdField = false;
    this.isCustomerIdMandatoryField = false;
    this.modalPopupLoaded = false;
    this.paymentsBoxHtml = null;
    this.previousUIAmount = null;
    this.taxMessagesInformation = null;
    this.termsAndConditionsInformation = null;
    this.pmList = [];
    this.tabContentContainerClassName = "glbe-tab-content";
    this.duplicateTrxConfirm = false;
    this.tabsInfo = [];
    this.intervalTime = 100;
    this.maximumIntervalAmounts = 150;
    this.shippingMethodsIntervalCount = 0;
    this.dutiesAndTaxesIntervalCount = 0;
    this.termsAndConditionIntervalCount = 0;
    this.taxMessageIntervalCount = 0;
    this.shippingMethodsInterval = null;
    this.dutiesAndTaxesInterval = null;
    this.termsAndConditionsInterval = null;
    this.taxMessageInterval = null;
    this.customValidations = null;
    this.merchantValidationRegexSettings = null;
    this.shippingOptionsInputs = null;
    this.selectedShippingOption = null;
    this.paymentBoxReloadIsInProgress = false;
    this.IsGECompleteOrderButtonCloneProcessInprogress = false;
    this.shippingMethodsData = null;
    this.enableDisplayNoteForShippingMethods = false;
    this.intervalForGetShippingOptions = 0;
    this.SetCardType = null;
    this.minAlternativeCCLength = 16;
    this.maxAlternativeCCLength = 24;
    this.currencyCode = null;
    this.UseClientSideFixer = false;
    this.OOSScenarioQueryParam = "stock_problems";
    this.MaxAmountPercentageChange = 0.05;
    this.InvokeDataOnCountryChanged = false;
    this.additionalPopupData = { isTransactionAuthorized: false, additionalModalOpened: false, timerPooling: null, qrCodeImg: null };
    this.AdditionalDataErrorMessage = null;
    this.customValidationErrorMessages = [];
    this.GE_CLIENT_COOKIE_NAME = "GLBE_SESS_ID";
    this.GE_DATA_COOKIE_EXP = 365 * 2; //(DAYS) Data cookie expiration for client id (as it sets on the platform side)
    this.raffleProductTagName = "raffle_product";
    this.PaymentErrors = [];
    this.GE_CONSENT_COOKIE = "GlobalE_Consent";
    
    this.cardTypes = {
        "visa": 1,
        "mastercard": 2,
        "americanexpress": 3,
        "maestro": 23,
        "jcb": 33,
        "unionpay": 38,
        "diners": 51,
        "discover": 52,
        "mistercashcard": 78,
        "mir": 79
    }

    this.paymentTypes = {
        1: "visa",
        2: "mastercard",
        3: "americanexpress",
        23: "maestro",
        33: "jcb",
        38: "unionpay",
        51: "diners",
        52: "discover",
        78: "mistercashcard",
        79: "mir"
    }

    this.LogTypes = {
        "Exception": "exception",
        "Info": "info"
    }

    this.GELogEventIDs = {
        Error: 'CheckoutClientSideError',
        Info: 'CheckoutClientSideInfo'
    }
    
    this.PaymentErrorTypes = {
        DefaultError: "DefaultError",
        OOSError: "OOSError" 
    }

    this.MandatoryConsentGroups = {
        Essentials: 1,
        Analytics: 2,
        Marketing: 3,
    }

    this.ConsentPermissions = {
        NotAllowed: 0,
        Allowed: 1
    }

    this.Init();
}

//SET ENUMS
GEShopifyCheckout.enums = {
    forms: {
        "AFTERPAY": "glbe-form-afterpay",
        "CREDITCARDS": "glbe-form-creditcards",
        "KLARNA": "glbe-form-klarna",
        "VIRTUALPAYMENT": "glbe-form-virtual-payment",
        "CASHONDELIVERY": "glbe-form-cashondelivery-payment",
        "MISTERCASHCARD": "glbe-form-сс-mistercashcard",
        "UNIONPAY": "glbe-form-сс-unionpay"
    },
    payments: {
        "CREDITCARDS": "creditcards",
        "AFTERPAY": "afterpay",
        "APPLEPAY": "applepay",
        "KLARNA": "klarna",
        "PAYPAL": "paypal",
        "VIRTUALPAYMENT": "virtual-payment",
        "CASHONDELIVERY": "cashondelivery-payment",
        "MISTERCASHCARD": "mistercashcard",
        "UNIONPAY": "unionpay",
    },
    actionTypes: {
        "URL": "url",
        "POPUP": "popup"
    }
}

GEShopifyCheckout.alternativeCreditCards = ["mistercashcard", "unionpay"];

GEShopifyCheckout.CreditCardTabData = {
    type: GEShopifyCheckout.enums.payments.CREDITCARDS,
    paymentMethodElement: '#glbe-cc-pm-id',
    numberElement: '#glbe-cc-number',
    cvcElement: '#glbe-cc-cvc',
    expYearElement: '#glbe-cc-exp-year',
    expMonthElement: '#glbe-cc-exp-month',
    dataTab: "creditcards",
    cardHintElement: "#glbe-cardtype-hint",
    currencyConvertedElement: "#currencyConvertedText",
    SetCardType: null,
    form: GEShopifyCheckout.enums.forms.CREDITCARDS,
    defaultPaymentMethodIdElement: null
};

GEShopifyCheckout.CreditCardForms = [];
GEShopifyCheckout.CreditCardForms.push(GEShopifyCheckout.CreditCardTabData);

GEShopifyCheckout.alternativeCreditCards.forEach(paymentMethodName => {
    GEShopifyCheckout.CreditCardForms.push({
        type: paymentMethodName,
        paymentMethodElement: "#glbe-" + paymentMethodName + "-cc-pm-id",
        numberElement: "#glbe-" + paymentMethodName + "-cc-number",
        cvcElement: "#glbe-" + paymentMethodName + "-cc-cvc",
        expYearElement: "#glbe-" + paymentMethodName + "-cc-exp-year",
        expMonthElement: "#glbe-" + paymentMethodName + "-cc-exp-month",
        dataTab: paymentMethodName,
        cardHintElement: "#glbe-" + paymentMethodName + "-hint",
        currencyConvertedElement: "#currencyConvertedText-" + paymentMethodName,
        SetCardType: null,
        form: "glbe-form-сс-" + paymentMethodName,
        defaultPaymentMethodIdElement: "#glbe-" + paymentMethodName + "-default-pm-id"
    });
});


//A callback invokder that is used to identify when the DOM is ready for interaction
GEShopifyCheckout.prototype.OnDocumentReady = function (callback) {
    // in case the document is already rendered
    if (document.readyState != 'loading') callback.call(this);
    // modern browsers
    else if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', callback.bind(this), false);
    }
    // IE <= 8
    else document.attachEvent('onreadystatechange', function () {
        if (document.readyState == 'complete') callback.call(this);
    });

    //Core-43999 preventing shopify form submiting from Personal Customs Code control
    try {
        document.querySelectorAll("[id*='checkout_localized_fields_shipping_credential_']").forEach(item => {
            item.addEventListener('keydown', event => {
                if (event.keyCode == 13) {
                    event.preventDefault();
                    return false;
                }
            })
        });
    }
    catch (ex) { }
}


GEShopifyCheckout.prototype.GetCheckoutId = function () {
    //TODO: GET Shopify checkout id

    if (typeof Shopify != "undefined" && Shopify.Checkout) {
        return Shopify.Checkout.token;
    }

    //this is for shopify demo site
    if (typeof GLBE_PARAMS !== "undefined") {
        var token = GLBE_PARAMS.checkoutId;
        if (token !== "")
            return token;
    }
    return "73e99df7-fabd-4bd7-a6ae-03c6ed98044b";
};


GEShopifyCheckout.prototype.ShowErrorMessage = function (glbeResponse, ignoreFieldName, ignoreDescription) {
    if (this.msgContainer == null) {
        this.msgContainer = document.querySelector("." + this.msgContainerClass);
    }

    this.ShowPostPaymentLoading(false);
    this.msgContainer.style.display = "block";

    if (glbeResponse.errors) {
        errorsStr = "";
        logStr = "";
        for (var i = 0; i < glbeResponse.errors.length; i++) {
            curStr = "";
            let curError = glbeResponse.errors[i];

            //highlight error field
            let fieldInput = ignoreFieldName ? null : document.querySelector("[name='" + curError.Error + "']");
            if (fieldInput) {
                fieldInput.classList.add("invalid");
            }
            var prefix = (i + 1) + ". ";
            if (glbeResponse.errors.length > 1) {
                curStr += prefix;
            }

            curStr += curError.Error;
            if (curError.Description != '' && !ignoreDescription) {
                curStr += ", " + curError.Description;
            }
            errorsStr += curStr + "<br />";
            logStr += curStr + " | ";
        }

        //in case of generic errors which is return as single
        this.msgContainer.innerHTML = errorsStr.replaceAll('\r\n', '<br />');

        if (typeof GESHOP != "undefined" && GESHOP != null) {
            GESHOP.Log(GESHOP.LogTypes.Info, "ShowErrorMessage - " + logStr);
        }
    }
}

GEShopifyCheckout.prototype.ShowPaymentStepLoading = function (isShow) {
    try {
        var container = document.querySelector("[data-step='payment_method']");

        if (container == null) {
            container = document.querySelector("body");
        }
        if (container != null) {
            if (isShow) {
                container.style.position = "relative";
                var loaderContainer = document.createElement("div");
                loaderContainer.className = "glbe-loading-container";

                var innerLoader = document.createElement("div");
                innerLoader.className = "glbe-loading glbe-loading-absolute";

                loaderContainer.appendChild(innerLoader);
                container.appendChild(loaderContainer);
            }
            else {
                var geLoadingContainer = container.querySelector(".glbe-loading-container");
                if (geLoadingContainer != null) {
                    geLoadingContainer.remove();
                }
                container.style.position = "static";
            }
            this.Log(this.LogTypes.Info, "ShowPaymentStepLoading. isShow = " + isShow);
        }
    }
    catch (err) {
        this.Log(this.LogTypes.Exception, "ShowPaymentStepLoading was failed" + err + ".");
    }
}

//Generate new GUID/UUID
GEShopifyCheckout.prototype.GenerateNewGuid = function (merchantId) {
    var generator = function (min, max) { // min and max included
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    var maxGen = 999999999;
    var minGen = 100000000;
    var leftPart = generator(minGen, maxGen);
    var rightPart = generator(minGen, maxGen);
    var uid = leftPart + "." + rightPart;

    if (merchantId != null) {
        uid += "." + merchantId;
    }

    return uid;
}

//Gets a client cookie, if isJson is true, the cookie content is return after json deserialization
GEShopifyCheckout.prototype.GetCookie = function (c_name, isJson) {
    try {
        var c_value = document.cookie;
        var c_start = c_value.indexOf(" " + c_name + "=");
        if (c_start == -1) {
            c_start = c_value.indexOf(c_name + "=");
        }
        if (c_start == -1) {
            c_value = null;
        }
        else {
            c_start = c_value.indexOf("=", c_start) + 1;
            var c_end = c_value.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = c_value.length;
            }
            c_value = unescape(c_value.substring(c_start, c_end));
        }

        if (this.IsDefined(isJson) && isJson) {
            return JSON.parse(c_value);
        }

        return c_value;
    }
    catch (ex) {
        this.Log(this.LogTypes.Exception, "GetCookie:" + ex + ".");
    }
}

//Sets a cookie, if isJson is true, the value is serialized to json
GEShopifyCheckout.prototype.SetCookie = function (c_name, value, expire, isJson, isMinutes, setExpireAsSession) {
    try {
        if (!this.IsDefined(isJson) && isJson) {
            value = JSON.stringify(value);
        }
        var c_value = "";
        if (!setExpireAsSession) {
            var exdate = new Date();
            if (!isMinutes)
                exdate.setDate(exdate.getDate() + expire);
            else
                exdate.setTime(exdate.getTime() + expire * 60 * 1000);

            c_value = escape(value) + ((expire == null) ? "" : "; expires=" + exdate.toUTCString()) + ";domain=" + document.domain + ";path=/";
        } else {
            c_value = escape(value) + ";domain=" + document.domain + ";path=/";
        }
        c_value += ";SameSite=Lax";

        document.cookie = c_name + "=" + c_value;
    }
    catch (ex) {
        this.Log(this.LogTypes.Exception, "SetCookie:" + ex + ".");
    }
}

//Show loader after a payment form has been submited
GEShopifyCheckout.prototype.ShowPostPaymentLoading = function (isShow) {
    var container = document.querySelector("#" + this.injectedContainerId);
    if (container != null) {
        if (!isShow) {
            //hide
            var loaderContainer = container.querySelector(".glbe-loading-container");
            if (this.IsDefined(loaderContainer)) {
                loaderContainer.remove();
                this.HideModalOverlay();
            }
        }
        else {
            var loaderContainer = document.createElement("div");
            loaderContainer.className = "glbe-loading-container";
            var innerLoader = document.createElement("div");
            innerLoader.className = "glbe-loading glbe-loading-absolute";

            loaderContainer.appendChild(innerLoader);
            container.appendChild(loaderContainer);
            this.ShowModalOverlay();
        }

        if (typeof GESHOP != "undefined" && GESHOP != null) {
            GESHOP.Log(GESHOP.LogTypes.Info, "ShowPostPaymentLoading. isShow = " + isShow);
        }
    }
}

GEShopifyCheckout.prototype.Log = function (logType, message) {
    try {

        messagePrefix = "SPYCHECKOUT> ";
        var args = [];
        if (arguments.length > 2) {
            args += Array.prototype.slice.call(arguments, 2).map(a => '&arg=' + encodeURIComponent(a)).join('');
        }

        messageContext = " | (MerchantId = {MerchantId}, CountryCode = {CountryCode}, WebStoreCode = {WebStoreCode}, CheckoutId = {CheckoutId}, CheckoutStep = {CheckoutStep}) |";
        args += [this.parameters.merchantId, this.parameters.billingCountry, this.parameters.webStoreCode, this.checkoutId, Shopify.Checkout.step].map(a => '&arg=' + a).join('');

        var eventId = null;
        if (logType == this.LogTypes.Exception) {
            console.log(message);
            eventId = this.GELogEventIDs.Error;
        } else {
            eventId = this.GELogEventIDs.Info;
        }

        var src = this.parameters.environment + '/platforms/shopify/checkout/log/' + logType + '?message=' + encodeURIComponent(messagePrefix + message + messageContext) + args + "&eventId=" + eventId;

        if (this.clientLogsEnabled) {
            this.LoadScript(src);
        }
    }
    catch (err) {
        console.log(err);
    }
}

//This action call the JSONP action that will render and push the payment forms box into the container element
GEShopifyCheckout.prototype.InvokePaymentBox = function () {
    if (this.IsPaymentStep() && this.IsDefined(this.parameters.billingCountry)) {
        this.Log(this.LogTypes.Info, "InvokePaymentBox");
        var url = this.parameters.environment + '/platforms/shopify/checkout/payments/' + this.GetCheckoutStep() + '/' +
            this.parameters.billingCountry + '/' + this.parameters.shippingCountry + '/' + this.parameters.cultureCode + '/' +
            this.parameters.merchantId + '/' + this.parameters.webStoreCode + '/' + this.checkoutId + '/' +
            this.parameters.applePay + '/' + this.GetUIAmount() + '/' + this.isRaffleOrder() + '/' + this.parameters.shippingStateCode;

        var queryParams = '';
        var checkoutCurrency = Shopify?.Checkout?.currency;
        if (checkoutCurrency) {
            queryParams += ("currencyCode=" + checkoutCurrency);
        }
        if (queryParams) {
            url += ('?' + queryParams);
        }

        this.LoadScript(url);
    }
}

GEShopifyCheckout.prototype.InvokeAdditionalData = function () {
    if (this.parameters.isOperatedCountry) {
        var applyValidation = false;
        if (this.IsPaymentStep()) {
            applyValidation = sessionStorage.getItem("GEApplyContactInformationValidation");
            if (applyValidation == null) {
                applyValidation = true;
            }
        }

        if (this.IsDefined(this.parameters.shippingCountry)) {
            this.LoadScript(this.parameters.environment + '/platforms/shopify/checkout/additionalData/' +
                this.parameters.merchantId + '/' +
                this.parameters.shippingCountry + '/' +
                this.parameters.cultureCode + '/' +
                Shopify.Checkout.currency + '/' +
                this.checkoutId + '/' +
                encodeURIComponent(this.parameters.clientId) + '/' +
                this.parameters.webStoreCode + '/' +
                applyValidation + '/' +
                this.GetUIAmountAsDecimal() + '/' +
                this.GetProductsAmount() + '/' +
                this.IsAnalyticsAllowed() + '/' +
                this.parameters.shippingStateCode
            );
        }
    }
}

GEShopifyCheckout.prototype.InitRaygunScript = function () {
    if (this.parameters.isOperatedCountry) {
                if (this.IsDefined(this.parameters.merchantId) && this.IsDefined(this.checkoutId)) {
                    this.LoadScript(this.parameters.environment + '/platforms/shopify/checkout/InitRaygunScript/' + this.parameters.merchantId + '/' + this.checkoutId);
                }
     }
}

GEShopifyCheckout.prototype.InitGoogleAnalyticsLogger = function () {
    if (this.parameters.isOperatedCountry) {
        this.LoadScript(this.parameters.environment + '/Scripts/Platforms/Shopify/checkout.analytics.js');
    }

    var numOfEnteredInputs = 0;
    var shippingInputs = document.querySelectorAll('input.field__input:not(#checkout_reduction_code)');
    shippingInputs?.forEach((input) => {
        input.addEventListener('blur', () => {
            if (input.value) {
                numOfEnteredInputs++;
            }

            if (numOfEnteredInputs == 2) {
                if (input.id.includes("checkout_billing_address")) {
                    ShopifyGALogger?.SendEvent("BillingAddress", "Started");
                }
                else {
                    ShopifyGALogger?.SendEvent("ShippingAddress", "Started");
                }
            }
        });
    });

    document.getElementById('continue_button')?.addEventListener('click', (event) => {
        if (event.currentTarget.innerText.includes('Continue to payment')) {
            if (this.selectedShippingOption) {
                var action = "";
                if (this.shippingOptionsInputs[0].checked) {
                    action = "def-"
                }

                var serivesIdx = this.selectedShippingOption.value.indexOf('Service-') + 'Service-'.length;
                var shippingMethodId = this.selectedShippingOption.value.substring(serivesIdx, this.selectedShippingOption.value.indexOf('_', serivesIdx));
                action += "ship-opt-" + this.shippingOptionsInputs.length + '-' + shippingMethodId;

                var shippingCost = this.selectedShippingOption.getAttribute("data-checkout-total-shipping");
                var label = shippingCost.toLowerCase() === 'free' ? shippingCost : Shopify.Checkout.currency + ' ' + shippingCost.replace(/[^a-zA-Z0-9\s.,]/g, '');

                //ShopifyGALogger?.SendEvent("ShippingMethodSelected", action, label);
            }
        }
        if (event.currentTarget.innerText.includes('Complete order') && this.IsDifferentBillingAddress()) {
            ShopifyGALogger?.SendEvent("BillingAddress", "Completed");
        }
    });
};

GEShopifyCheckout.prototype.GetProductsAmount = function () {
    var response = 0;
    try {
        var productCounters = document.querySelectorAll('.product-thumbnail__quantity');
        if (productCounters.length > 0) {
            productCounters.forEach(function (productCounter) {
                var quantity = parseInt(productCounter.innerHTML);
                if (!isNaN(quantity)) {
                    response += quantity;
                }
            });
        }
        return response;
    }
    catch (ex) {
        this.Log(this.LogTypes.Exception, "SPY Client-side GetProductsAmount failed: " + ex);
        return response;
    }
}

GEShopifyCheckout.prototype.LoadScript = function (src, onload) {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';

    if (typeof onload != "undefined") {
        script.onload = onload;
    }
    script.src = src;
    head.appendChild(script);
}

GEShopifyCheckout.prototype.LoadIntegrationScript = function (intgScript, onload) {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');

    script.type = 'text/javascript';

    if (typeof onload != "undefined") {
        script.onload = onload;
    }
    script.innerHTML = intgScript;

    head.appendChild(script);
}

//This action injects the iframe that we are going to use to silently post the payment form
GEShopifyCheckout.prototype.InsertFormTargetIframe = function () {
    var iframe = document.createElement("iframe");
    iframe.id = "glbe-iframe-target";
    iframe.name = "glbe-iframe-target";
    iframe.width = "5px";
    iframe.height = "5px";
    iframe.style.display = "none";
    document.body.appendChild(iframe);
}

//This action is called after we've submited the payment form to Global-e and got a response back
//at the end of this action we'll submit the original Shopify complete order button
//this button will fire the Shopify payment app call and redirect the customer into Global-e redirect page
GEShopifyCheckout.prototype.SubmitToIframeCompleted = function (glbeResponse) {
    try {
        //need to submit original shopify button
        var errorsObj = {
            errors: [
                {
                    Error: "Something went wrong with your payment",
                    Description: ""
                }
            ]
        };

        // in case payment failed with Klarna
        if (this.activePaymentForm == GEShopifyCheckout.enums.forms.KLARNA && !glbeResponse.success) {
            //we will clear the authResponse field to allow klarna pop show up again after first attempt
            let klarnaForm = document.querySelector('#' + GEShopifyCheckout.enums.forms['KLARNA']);
            let authResponseInput = klarnaForm.querySelector('input[name="AuthResponse"]');
            authResponseInput.value = '';

            //to not show the above default error message in case of canceled and declined
            this.ShowPostPaymentLoading(false);
            if (glbeResponse.isOOS) {
                this.Log(this.LogTypes.Info, "Click on original shopify complete button is going to be triggered. Button identifier = " + this.originalShopifyButton.id + ".");
                _geFixer.SetOriginalButtonClickedState();
                this.originalShopifyButton.click();
                this.Log(this.LogTypes.Info, "Click on original shopify complete button was triggered.");
                return;
            }
            return;
        }

        if (glbeResponse.isValidationFailed === true) {
            errorsObj = glbeResponse;
        }
        var isResponseError = typeof glbeResponse.success === "undefined" ||
            !glbeResponse.success;

        if (isResponseError && !glbeResponse.isOOS) {
            this.ShowErrorMessage(errorsObj);
            return;
        }


        if (this.isShopifyIntegrationV2 && glbeResponse.success != null && glbeResponse.success) {
            this.Log(this.LogTypes.Info, "SubmitToIframeCompleted. ShopifyFlowV2 - Click on original shopify complete button is going to be triggered");
            _geFixer.SetOriginalButtonClickedState();
            this.originalShopifyButton.click();
            this.Log(this.LogTypes.Info, "SubmitToIframeCompleted. ShopifyFlowV2 - Click on original shopify complete button was triggered.");
        }
        else if((glbeResponse.cartToken != null && glbeResponse.cartToken != '')
            || glbeResponse.isOOS)
        {
            this.Log(this.LogTypes.Info, "Click on original shopify complete button is going to be triggered. Button identifier = " + this.originalShopifyButton.id + ".");
            _geFixer.SetOriginalButtonClickedState();
            this.originalShopifyButton.click();
            this.Log(this.LogTypes.Info, "Click on original shopify complete button was triggered.");
        }
        else {
            this.ShowErrorMessage(glbeResponse);
        }
    } catch (ex) {
        this.Log(this.LogTypes.Exception, "SubmitToIframeCompleted was failed. " + ex + ".");
    }
}

// Start payment 3DS2 pre-enrollment (DDC). Curently there is DDC proccess only with WorldPay 3DS2 in shopify checkout page. 
GEShopifyCheckout.prototype.StartPayment3DS2PreEnrollment = function (eventInfo) {
    try {
        if (typeof GESHOP != "undefined" && GESHOP != null) {
            GESHOP.Log(GESHOP.LogTypes.Info, "StartPayment3DS2PreEnrollment");
        }
        document.getElementById("glbe-cc-pm-td-handle-data").value = eventInfo.Data.PreEnroll3DSInfo.ResponseData;
        var worldPayPreEnrollManager = new WorldPayPreEnrollManager({
            OrderId: eventInfo.Data.PreEnroll3DSInfo.ActionData.OrderId,
            ScriptDomain: eventInfo.Data.PreEnroll3DSInfo.ActionData.ScriptDomain,
            ScriptURL: eventInfo.Data.PreEnroll3DSInfo.ActionData.ScriptURL,
            MaxAPICallAttempts: eventInfo.Data.PreEnroll3DSInfo.ActionData.MaxAPICallAttempts,
            APICallAttemptsInterval: eventInfo.Data.PreEnroll3DSInfo.ActionData.APICallAttemptsInterval,
            Bin: eventInfo.Data.PreEnroll3DSInfo.ActionData.Bin,
            JWT: eventInfo.Data.PreEnroll3DSInfo.ActionData.JWT,
            ElementsIds: {
                GlobalEPaymentFormId: GEShopifyCheckout.enums.forms.CREDITCARDS,
                PreEnrollIframeId: "glbe-cc-pm-pre-enroll-container",
                ResponseInputId: "glbe-cc-pm-td-response"
            }
        });

        document.getElementById("glbe-cc-pm-td-order").value = eventInfo.Data.PreEnroll3DSInfo.ActionData.OrderId;
        document.getElementById("glbe-cc-pm-td-ddc-url").value = eventInfo.Data.PreEnroll3DSInfo.ActionData.ScriptURL;
        document.getElementById("glbe-cc-pm-td-ddc-request").value = JSON.stringify({
            Bin: "XXXXXX",
            JWT: eventInfo.Data.PreEnroll3DSInfo.ActionData.JWT
        });

        worldPayPreEnrollManager.PerformPreAuthentication();
    } catch (ex) {
        this.Log(this.LogTypes.Exception, "3DS2PreEnrollment was failed. " + ex + ".");
    }
};

//checks if the payment box exists on the page
GEShopifyCheckout.prototype.IsGiftCardError = function () {
    var errorContainer = document.querySelector("#error-for-reduction_code");
    if (errorContainer != null) {
        //need to hide payment box    
        return true;
    }
    else {
        return false;
    }

}

GEShopifyCheckout.prototype.IsInformationStep = function () {
    if (typeof Shopify != "undefined") {
        try {
            if (Shopify.Checkout.step == "contact_information") {
                return true;
            }
            else {
                return false;
            }
        }
        catch (ex) {
            this.Log(this.LogTypes.Exception, "IsInformationStep was failed. " + ex + ".");
            return false;
        }
    }

    return false;
}

GEShopifyCheckout.prototype.IsPaymentStep = function () {
    if (typeof Shopify != "undefined") {
        try {
            if (Shopify.Checkout.step == "payment_method") {
                return true;
            }
            else {
                return false;
            }
        }
        catch (ex) {
            this.Log(this.LogTypes.Exception, "IsPaymentStep was failed. " + ex + ".");
            return false;
        }
    }

    return false;
}

GEShopifyCheckout.prototype.IsConfirmationStep = function () {
    if (typeof Shopify != "undefined") {
        try {
            if (Shopify.Checkout.step == "thank_you") {
                return true;
            }
            else {
                return false;
            }
        }
        catch (ex) {
            this.Log(this.LogTypes.Exception, "IsConfirmationStep was failed. " + ex + ".");
            return false;
        }
    }

    return false;
}

GEShopifyCheckout.prototype.isRaffleOrder = function () {
     var self = this;
     var isRaffleOrder = false;
     try {
          if (typeof _line_items !== "undefined" && _line_items !== null) {
              _line_items.forEach(function (product) {
                  product.Tags.forEach(function (tag) {
                     if(tag === self.raffleProductTagName) {
                         isRaffleOrder = true;
                     }
                  });
              });
          }
          return isRaffleOrder;
    }
    catch (ex) {
          self.Log(self.LogTypes.Exception, "isRaffleOrder was failed for Shopify native checkout. " + ex + ".");
          return isRaffleOrder;
    }
}

GEShopifyCheckout.prototype.StartClientSideFixer = function () {
    _geFixer.Init();
}

GEShopifyCheckout.prototype.WriteHeapOrderCompleted = function () {
    try {
        this.LoadScript(this.parameters.environment + '/platforms/shopify/checkout/WriteHeapOrderCompleted/' +
            this.parameters.merchantId + '/' +
            this.checkoutId + '/' +
            this.parameters.cultureCode);
    } catch (ex) { }
}


GEShopifyCheckout.prototype.GetFullStoryOrderCompletedData = function () {
    try {
        this.LoadScript(this.parameters.environment + '/platforms/shopify/checkout/GetFullStoryOrderCompletedData/' +
            this.parameters.merchantId + '/' +
            this.checkoutId + '/' +
            this.parameters.shippingCountry + '/'+ 
            this.parameters.shippingStateCode);
    } catch (ex) { }
}

GEShopifyCheckout.prototype.OnGetFullStoryOrderCompletedDataReceived = function (obj) {
    var self = this;
    if (!window['_fs_namespace'] || !self.IsDefined(obj)) {
         return;
    }
    
    FS.event('Order Completed', obj);
}

GEShopifyCheckout.prototype.WriteGARaffleOrderEvents = function () {
    var self = this;
    try {
        if(self.isRaffleOrder() && self.IsInformationStep()) {
            ShopifyGALogger?.SendEvent("Raffle Product", "Visible");
        }
    }
    catch (ex) {
         self.Log(self.LogTypes.Exception, "WriteGARaffleOrderEvents failed for Shopify native checkout. " + ex + ".");
    }
}

GEShopifyCheckout.prototype.IsShippingStep = function () {
    if (typeof Shopify != "undefined") {
        try {
            if (Shopify.Checkout.step == "shipping_method") {
                return true;
            }
            else {
                return false;
            }
        }
        catch (ex) {
            this.Log(this.LogTypes.Exception, "IsShippingStep was failed. " + ex + ".");
            return false;
        }
    }

    return false;
}

GEShopifyCheckout.prototype.ReloadPaymentBox = function (dueToGiftCardError) {
    if (this.IsPaymentStep()) {
        this.paymentBoxReloadIsInProgress = true;
        this.ShowPaymentStepLoading(true);
        var triggerDelay = 0;
        if (dueToGiftCardError) {
            triggerDelay = 3000;
            if (typeof GESHOP != "undefined" && GESHOP != null) {
                GESHOP.Log(GESHOP.LogTypes.Info, "ReloadPaymentBox due to GiftCard error.");
            }
        }
        setTimeout(function () {
            //MVP - Hard reload when amount changes
            document.location.href = document.location.href;
        }, triggerDelay);

    }
}

GEShopifyCheckout.prototype.HandleCompleteButton = function (jsonpEventInfo) {
    if (typeof GESHOP != "undefined" && GESHOP != null) {
        GESHOP.Log(GESHOP.LogTypes.Info, "HandleCompleteButton");
    }
    if (typeof jsonpEventInfo.success != "undefined" && !jsonpEventInfo.success) {
        //re-enable complete order button in case of failure unless the tab prohibit of doing so
        if (!this.tabsInfo[this.activePaymentName].disableCompleteButton) { //tab does not have it's own logic for disabling complete order button
            //enable the complete order button
            this.DisableCompleteOrderButton(false);
        }
        this.ModifyFieldsDisabledProperty(false);
    }
}
GEShopifyCheckout.prototype.IsWinMessageValid = function (message) {
    var ret = {};
    try {
        ret.message = JSON.parse(message.data);
        if (ret.message.hasOwnProperty("Key")) {
            ret.valid = true;
        }
        else {
            ret.valid = false;
        }
    }
    catch (err) {
        ret.valid = false;
    }

    return ret;
}

GEShopifyCheckout.prototype.WriteWinMessageLog = function (message) {
    if (this.IsDefined(message.Data) && this.IsDefined(message.Data.Log)) {
        try {

            var data = message.Data.Log;
            this.Log(this.LogTypes.Info, "WinMessageIsError={WinMessageIsError} WinMessageFormName={WinMessageFormName} WinMessageScope={WinMessageScope}", data.IsError, data.FormName, data.Scope);

        } catch (e) {
            console.log("WriteLog error." + e);
        }
    }
}

GEShopifyCheckout.prototype.SubmitPaymentCompleted = function (eventData) {
    try {
        if (GESHOP) {
            GESHOP.Log(GESHOP.LogTypes.Info, "SubmitPaymentCompleted");
        }

        var eventInfo = JSON.parse(eventData);
        this.HandleCompleteButton(eventInfo.Data);
        var glbeResponse= eventInfo.Data;

        if (GESHOP && this.originalShopifyButton && glbeResponse.success) {
            this.Log(this.LogTypes.Info, "SubmitPaymentCompleted. ShopifyFlowV2 - Click on original shopify complete button is going to be triggered");
            _geFixer.SetOriginalButtonClickedState();
            this.originalShopifyButton.click();
            this.Log(this.LogTypes.Info, "SubmitPaymentCompleted. ShopifyFlowV2 - Click on original shopify complete button was triggered.");
            }
            else {
                if (glbeResponse.errors && glbeResponse.errors.length) {
                    this.ShowErrorMessage(glbeResponse, true, true);
                } else {
                    this.ShowErrorMessage(this.GetDefaultError());
                }
            }
        }
    catch (err) {
        this.Log(this.LogTypes.Exception, "SubmitPaymentCompleted was failed." + err + ".");
    }
}

GEShopifyCheckout.prototype.ProcessPaymentCompleted = function (eventData) {
    try {

        if (typeof GESHOP != "undefined" && GESHOP != null) {
            GESHOP.Log(GESHOP.LogTypes.Info, "ProcessPaymentCompleted");
        }

        // parse json
        var eventInfo = JSON.parse(eventData);

        if (this.IsDefined(eventInfo.Data.PaymentAdditionalData)) {

            this.additionalPopupData.qrCodeImg = eventInfo.Data.PaymentAdditionalData.QrCode;
            this.additionalPopupData.paymentData = eventInfo.Data.PaymentAdditionalData.PaymentData;
            this.additionalPopupData.qrCodeScript = eventInfo.Data.PaymentAdditionalData.QrCodeScriptUrl;

            if (this.additionalPopupData.qrCodeImg != null && this.additionalPopupData.qrCodeScript != null) {
                this.LoadScript(this.additionalPopupData.qrCodeScript);
            }

            this.LoadScript(this.parameters.environment + '/platforms/shopify/checkout/additionalpopupdata/' +
                this.checkoutId + '/' +
                this.parameters.merchantId + '/' +
                (this.additionalPopupData.qrCodeImg != null));
        } else {

            this.HandleCompleteButton(eventInfo.Data);

            if (eventInfo.Data.isPreEnroll3DSRequired && eventInfo.Data.PreEnroll3DSInfo.GatewayType == 11) {
                this.StartPayment3DS2PreEnrollment(eventInfo);
            }
            else if (eventInfo.Data.IsApplePayVoid) {
                document.querySelector("#IsApplePayVoid").value = "false";
            }
            else if (eventInfo.Data.IsApplePayStartSession && !(eventInfo.Data.ActionType === GEShopifyCheckout.enums.actionTypes.URL)) {
                // Handle start Apple Pay sessions response
                this.ProcessStartApplePayResponse(eventInfo);
            }
            else if (eventInfo.Data.IsApplePayProcess) {
                // Handle Apple Pay process response
                this.ProcessApplePayResponse(eventInfo);
            }
            else if (eventInfo.Data.IsClientAuthorizationRequired) {
                // Handle client authorization
                this.StartClientAuthorization(eventInfo);
            }
            else if (eventInfo.Data.ActionType === GEShopifyCheckout.enums.actionTypes.URL) {
                document.location.href = eventInfo.Data.ActionData;
            }
            else if (eventInfo.Data.ActionType === GEShopifyCheckout.enums.actionTypes.POPUP) {
                //Handle popups
                this.HandlePopup(eventInfo.Data.ActionData);
            }
            else {
                if (typeof GESHOP != "undefined" && GESHOP != null) {
                    GESHOP.SubmitToIframeCompleted(eventInfo.Data);
                }
            }
        }
    }
    catch (err) {
        this.Log(this.LogTypes.Exception, "RegisterListeners was failed." + err + ".");
        // this.DebugProcess(e);
    }
}

//Register listener for message from the Global-e iframe
GEShopifyCheckout.prototype.RegisterListeners = function () {
    window.addEventListener("message", (event) => {

        // Do we trust the sender of this message?
        if (event.origin.indexOf(GESHOP.parameters.tld) == -1)
            return;

        var response = this.IsWinMessageValid(event);

        if (response.valid) {
            this.WriteWinMessageLog(response.message);
        }

        if (response.valid && response.message.Key == 'PaymentSubmitted') {
            this.SubmitPaymentCompleted(event.data);
        }
        else if (response.valid && response.message.Key != 'PaymentCompletedError') {
            this.ProcessPaymentCompleted(event.data);
        }
    }, false);


    this.InitiateObserver('.order-summary__sections', function () {
        if (GESHOP != null && typeof GESHOP != "undefined") {
            var giftCardError = GESHOP.IsGiftCardError();
            if (giftCardError) {
                ShopifyGALogger?.OnCouponApplied(false);
            }
            if (GESHOP.IsUIAmountChanged() || giftCardError) {
                return true;
            }
        }
        return false;

    }, function () {
        if (GESHOP != null && typeof GESHOP != "undefined") {
            // in case enableNewLogicOfReloadGEPaymentBoxWhenDisappearInSPY is false will run the old logic (ReloadPaymentBox was called before for GiftCardError)
            var giftCardError = GESHOP.IsGiftCardError();
            if (!this.enableNewLogicOfReloadGEPaymentBoxWhenDisappearInSPY) {
           
                GESHOP.ReloadPaymentBox(giftCardError);
            }

            GESHOP.HandleCouponChangeInInformationStep(giftCardError);
        }
    });
}

GEShopifyCheckout.prototype.HandleCouponChangeInInformationStep = function (giftCardError) {
    // first need to make sure we do it only in information step
    if (this.IsInformationStep()) {
        // our indication for wether we need to register our validations rely on the existence of the continue button duplication
        if (!this.IsElementExistInDocument(this.glbeContinueToShippingButton)) {
            this.RegisterInputValidations();
        }
    }

    if (!giftCardError) {
        ShopifyGALogger?.OnCouponApplied(true);
    }
}

GEShopifyCheckout.prototype.IsElementExistInDocument = function (element) {
    var response = false;

    try {
        response = document.body.contains(element)
    }
    catch (ex) {
        this.Log(this.LogTypes.Exception, "IsElementExistInDocument was failed." + ex + ".");
    }

    return response;
}

GEShopifyCheckout.prototype.HandlePopup = function (popupType) {
    try {
        //this.ShowPostPaymentLoading(true);
        this.ShowDuplicateTrxPopup();

    } catch (e) {
        this.Log(this.LogTypes.Exception, "HandlePopup was failed." + e + ".");
        // this.DebugProcess(e);
    }
}
GEShopifyCheckout.prototype.ProcessApplePayResponse = function (eventInfo) {
    try {
        var status = null;

        //this.DebugProcess("begin ProcessApplePayResponse");

        if (eventInfo.Data.success && eventInfo.Data.success === true) {
            status = ApplePaySession.STATUS_SUCCESS;
        }
        else {
            status = ApplePaySession.STATUS_FAILURE;
        }

        try {
            if (typeof GESHOP != "undefined" && GESHOP != null) {
                GESHOP.Log(GESHOP.LogTypes.Info, "ProcessApplePayResponse - status = " + (eventInfo.Data.success && eventInfo.Data.success === true) ? true : false);
            }
            applePaySession.completePayment(status);
        }
        catch (e) {
            this.Log(this.LogTypes.Exception, "ApplePay complete payment was failed. " + e + ".");
            // this.DebugProcess(e);
        }

        if (typeof GESHOP != "undefined" && GESHOP != null) {
            GESHOP.SubmitToIframeCompleted(eventInfo.Data);
        }
        var container = document.querySelector("#" + this.injectedContainerId);
        if (container) {
            container.querySelector(".glbe-loading-container").remove();
        }
    }
    catch (e) {
        this.Log(this.LogTypes.Exception, "ProcessApplePayResponse was failed. " + e + ".");
        //this.DebugProcess(e);
    }

}

GEShopifyCheckout.prototype.ProcessStartApplePayResponse = function (eventInfo) {
    if (typeof GESHOP != "undefined" && GESHOP != null) {
        GESHOP.Log(GESHOP.LogTypes.Info, "ProcessStartApplePayResponse - status = " + (eventInfo.Data.success && eventInfo.Data.success === true) ? true : false);
    }

    if (eventInfo.Data.success && eventInfo.Data.success === true) {

        document.querySelector("#GEData").value = eventInfo.Data.GEData;
        document.querySelector("#ApplePayCartToken").value = eventInfo.Data.cartToken;

        try {
            var merchantSession = JSON.parse(eventInfo.Data.MerchantSessionJson);

            applePaySession.completeMerchantValidation(merchantSession);
        }
        catch (e) {
            this.Log(this.LogTypes.Exception, "ProcessStartApplePayResponse - merchant validation was failed. " + e + ".");
            //this.DebugProcess(e);
        }
    }
    else {
        var status = ApplePaySession.STATUS_FAILURE;

        try {
            applePaySession.completePayment(status);
        }
        catch (e) {
            this.Log(this.LogTypes.Exception, "ProcessStartApplePayResponse - ApplePay complete payment was failed. " + e + ".");
        }

        // Temp - show alert error
        alert("Error - the payment was not processed");
    }
}

GEShopifyCheckout.prototype.StartClientAuthorization = function (eventInfo) {
    try {
        if (typeof GESHOP != "undefined" && GESHOP != null) {
            GESHOP.Log(GESHOP.LogTypes.Info, "StartClientAuthorization");
        }
        var klarnaForm = document.querySelector('#' + GEShopifyCheckout.enums.forms['KLARNA']);
        var cartTokenInput = klarnaForm.querySelector('input[name="CartToken"]');
        cartTokenInput.value = eventInfo.Data.cartToken;
        var authorizationRequest = KlarnaDirectManager.GetKlarnaDirectAuthorizationRequest(eventInfo);

        var klarnaAuthorizationSettings = {
            payment_method_category: eventInfo.Data.PaymentMethodCode,
            auto_finalize: true
        };

        Klarna.Payments.authorize(klarnaAuthorizationSettings, authorizationRequest, function (authorizationResponse) {
            // Prepare auth request and response for saving
            var authorizationRequestJson = JSON.stringify(authorizationRequest);
            var authorizationResponseJson = JSON.stringify(authorizationResponse);

            var authRequestInput = klarnaForm.querySelector('input[name="AuthRequest"]');
            var authResponseInput = klarnaForm.querySelector('input[name="AuthResponse"]');

            authRequestInput.value = authorizationRequestJson;
            authResponseInput.value = authorizationResponseJson;

            // Submit Klarna payment form
            klarnaForm.submit();
            if (typeof GESHOP != "undefined" && GESHOP != null) {
                GESHOP.Log(GESHOP.LogTypes.Info, "Submit Klarna payment form");
            }
        });
    }
    catch (e) {
        this.Log(this.LogTypes.Exception, "StartClientAuthorization was failed. " + e + ".");
        //this.DebugProcess(e);
    }
}

GEShopifyCheckout.prototype.DisableCompleteOrderButton = function (isDisable) {
    isDisable = typeof (isDisable) != "undefined" ? isDisable : false;
    if (isDisable) {
        this.glbeCompleteOrderButton.setAttribute("disabled", "disabled");
        this.glbeCompleteOrderButton.classList.add("glbe-btnDisabled");
    }
    else {
        this.glbeCompleteOrderButton.removeAttribute("disabled");
        this.glbeCompleteOrderButton.classList.remove("glbe-btnDisabled");
    }
}

GEShopifyCheckout.prototype.IsCompleteOrderButtonDisabled = function () {
    try {
        return this.glbeCompleteOrderButton.getAttribute('disabled') == 'disabled';
    } catch (er) {
        return false;
    }
}

GEShopifyCheckout.prototype.ModifyFieldsDisabledProperty = function (isDisable) {
    isDisable = typeof (isDisable) != "undefined" ? isDisable : false;
    try {
        // modify links disabled property
        var links = document.getElementsByTagName('a');
        for (i = 0; i < links.length; i++) {
            if (isDisable) {
                links[i].setAttribute("disabled", "disabled");
                links[i].classList.add("glbe-linkDisabled");
            }
            else {
                links[i].removeAttribute("disabled");
                links[i].classList.remove("glbe-linkDisabled");
            }
        }
        //modify Apply button and use different billing adress radio button
        var applyDiscountButton = document.querySelector("#checkout_submit");
        var differentBillingRadio = document.querySelector("#checkout_different_billing_address_true");
        if (isDisable) {
            if (applyDiscountButton != null) {
                applyDiscountButton.setAttribute("disabled", "disabled");
            }
            if (differentBillingRadio != null) {
                differentBillingRadio.setAttribute("disabled", "disabled");
            }
        }
        else {
            if (applyDiscountButton != null) {
                applyDiscountButton.removeAttribute("disabled");
            }
            if (differentBillingRadio != null) {
                differentBillingRadio.removeAttribute("disabled");
            }
        }
    }
    catch (ex) {
        this.Log(this.LogTypes.Exception, "ModifyFieldsDisabledProperty was failed. " + ex + ".");
    }
}
//This action replaced Shopify original complete order button with Global-e one
//And registeres the click event to submit the payment
GEShopifyCheckout.prototype.InterceptCompleteOrderButton = function () {
    var searchSymbol = this.elementsConfig.CompleteOrderButton.IdentifierType == 1 ? "#" : ".";
    this.originalShopifyButton = document.querySelector(searchSymbol + this.elementsConfig.CompleteOrderButton.ElementIdentifier);

    if (this.originalShopifyButton != null) {
        this.IsGECompleteOrderButtonCloneProcessInprogress = true;

        this.glbeCompleteOrderButton = this.originalShopifyButton.cloneNode(true);
        this.glbeCompleteOrderButton.setAttribute("type", "button");
        this.glbeCompleteOrderButton.setAttribute("is-glbe-custom", "true");
        //hide shopify button
        this.originalShopifyButton.style.display = "none";

        //replace elements
        this.originalShopifyButton.parentNode.insertBefore(this.glbeCompleteOrderButton, this.originalShopifyButton);

        //set global-e button action
        this.glbeCompleteOrderButton.onclick = function () {
            ShopifyGALogger?.SendEvent("ButtonPayClicked", "true");
            this.SubmitPayment();
        }.bind(this);
        if (this.doFinishOrderButtonCloneProgressInMethod) {
            this.IsGECompleteOrderButtonCloneProcessInprogress = false;
        }
    }
    else {
        //Shopify complete order button was not found
        this.Log(this.LogTypes.Exception, "Shopify Complete Order button was not found for merchant id " + this.parameters.merchantId);
    }
}

GEShopifyCheckout.prototype.IsValidForm = function () {
    var response = true;

    var checkboxesAreChecked = this.ValidateTnCConsent();
    var customValidationsAreValid = this.ValidateCustomFields();
    var paymentmethodSelected = this.ValidatePaymentMethod();
    var isCustomerIDValid = this.IsCustomerIDValid();

    if (checkboxesAreChecked === false ||
        customValidationsAreValid === false ||
        paymentmethodSelected === false ||
        isCustomerIDValid === false) {
        response = false;
    }

    return response;
}

//This action is invoked after clicking the global-e complete order button, this
//button is the one replacing the original Shopify button
//The action is performing the active form submit into Global-e using the hidden iframe
GEShopifyCheckout.prototype.SubmitPayment = function () {
    if (typeof GESHOP != "undefined" && GESHOP != null) {
        GESHOP.Log(GESHOP.LogTypes.Info, "On SubmitPayment");
    }

    if (this.IsValidForm()) {

        //disable all links and some fields
        this.ModifyFieldsDisabledProperty(true);

        //show loader
        this.ShowPostPaymentLoading(true);
        var form = document.querySelector("#" + this.activePaymentForm);

        //inject billing address
        this.InjectBillingAddress(form);

        if (this.activePaymentId) {
            ShopifyGALogger?.SendPageview("/Checkout/PaymentAttempt/" + this.activePaymentId);
        }

        if (this.enforceGlobalePaymentBeforeOriginalButton || this.globalePaymentSelected === false) {
            this.AutoSelectGEPaymentMethod();
        }

        if (!this.IsCompleteOrderButtonDisabled()) {
            //disable complete order button
            this.DisableCompleteOrderButton(true);
            form.dispatchEvent(new Event('submit', { cancelable: true }));
        }
    }
}

//this action gathers base parameters from the page 
//e.g. billing country , culture, merchant, etc.
GEShopifyCheckout.prototype.SetParams = function () {
    if (typeof GLBE_PARAMS != "undefined") {
        var domain = this.IsDefined(GLBE_PARAMS.environment) ? GLBE_PARAMS.environment : "web.global-e.com";

        this.parameters = {
            environment: "https://" + domain,
            billingCountry: GLBE_PARAMS.billingCountry,
            shippingCountry: GLBE_PARAMS.shippingCountry,
            shippingStateCode: GLBE_PARAMS.shippingStateCode,
            cultureCode: GLBE_PARAMS.culture,
            merchantId: GLBE_PARAMS.merchantId,
            amount: this.GetUIAmount(),// GLBE_PARAMS.amount,
            webStoreCode: GLBE_PARAMS.shop,
            applePay: window.ApplePaySession && ApplePaySession.canMakePayments() ? true : false,
            siteId: GLBE_PARAMS.siteId,
            isTokenEnabled: GLBE_PARAMS.isTokenEnabled,
            status: GLBE_PARAMS.status,
            isOperatedCountry: (typeof GLBE_PARAMS.isOperatedCountry == "undefined") ? false : GLBE_PARAMS.isOperatedCountry(),
        };

        var cookieClientId = this.GetCookie(this.GE_CLIENT_COOKIE_NAME);
        if (!this.IsDefined(cookieClientId)) {
            cookieClientId = this.GenerateNewGuid(this.parameters.merchantId);
            this.SetCookie(this.GE_CLIENT_COOKIE_NAME, cookieClientId, this.GE_DATA_COOKIE_EXP, false);
        }

        this.parameters.clientId = cookieClientId;
        this.parameters.tld = this.parameters.environment.split(/\./).slice(-2).join('.');
    }
}
 
GEShopifyCheckout.prototype.HandleChangeCountry = function () {
    var self = this;
    document.querySelectorAll('#checkout_shipping_address_country').forEach(item => {
        item.addEventListener('change', event => {
            self.OnCountryChange(event);
        })
    }); 
}
GEShopifyCheckout.prototype.RunForterTag = function () {
    if (!this.parameters.isTokenEnabled) {
        return;
    }

    document.addEventListener('ftr:tokenReady', function (evt) {
        if (typeof GESHOP != "undefined" && GESHOP != null) {
            GESHOP.SetForter(evt.detail);
        }
    });

    // provide Forter your cartId
    window.oid_d496a0824fa6 = this.checkoutId;

    var siteId = this.parameters.siteId;
    function t(t, e) { for (var n = t.split(""), r = 0; r < n.length; ++r)n[r] = String.fromCharCode(n[r].charCodeAt(0) + e); return n.join("") } function e(e) { return t(e, -l).replace(/%SN%/g, siteId) } function n(t) { try { S.ex = t, g(S) } catch (e) { } } function r(t, e, n) { var r = document.createElement("script"); r.onerror = n, r.onload = e, r.type = "text/javascript", r.id = "ftr__script", r.async = !0, r.src = "https://" + t; var o = document.getElementsByTagName("script")[0]; o.parentNode.insertBefore(r, o) } function o() { k(T.uAL), setTimeout(i, v, T.uAL) } function i(t) { try { var e = t === T.uDF ? h : m; r(e, function () { try { U(), n(t + T.uS) } catch (e) { } }, function () { try { U(), S.td = 1 * new Date - S.ts, n(t + T.uF), t === T.uDF && o() } catch (e) { n(T.eUoe) } }) } catch (i) { n(t + T.eTlu) } } var a = { write: function (t, e, n, r) { void 0 === r && (r = !0); var o, i; if (n ? (o = new Date, o.setTime(o.getTime() + 24 * n * 60 * 60 * 1e3), i = "; expires=" + o.toGMTString()) : i = "", !r) return void (document.cookie = escape(t) + "=" + escape(e) + i + "; path=/"); var a, c, u; if (u = location.host, 1 === u.split(".").length) document.cookie = escape(t) + "=" + escape(e) + i + "; path=/"; else { c = u.split("."), c.shift(), a = "." + c.join("."), document.cookie = escape(t) + "=" + escape(e) + i + "; path=/; domain=" + a; var s = this.read(t); null != s && s == e || (a = "." + u, document.cookie = escape(t) + "=" + escape(e) + i + "; path=/; domain=" + a) } }, read: function (t) { for (var e = escape(t) + "=", n = document.cookie.split(";"), r = 0; r < n.length; r++) { for (var o = n[r]; " " == o.charAt(0);)o = o.substring(1, o.length); if (0 === o.indexOf(e)) return unescape(o.substring(e.length, o.length)) } return null } }, c = "fort", u = "erTo", s = "ken", d = c + u + s, f = "9"; f += "ck"; var l = 3, h = e("(VQ(1fgq71iruwhu1frp2vq2(VQ(2vfulsw1mv"), m = e("g68x4yj4t5;e6z1forxgiurqw1qhw2vq2(VQ(2vfulsw1mv"), v = 10; window.ftr__startScriptLoad = 1 * new Date; var g = function (t) { var e = function (t) { return t || "" }, n = e(t.id) + "_" + e(t.ts) + "_" + e(t.td) + "_" + e(t.ex) + "_" + e(f); a.write(d, n, 1825, !0) }, p = function () { var t = a.read(d) || "", e = t.split("_"), n = function (t) { return e[t] || void 0 }; return { id: n(0), ts: n(1), td: n(2), ex: n(3), vr: n(4) } }, w = function () { for (var t = {}, e = "fgu", n = [], r = 0; r < 256; r++)n[r] = (r < 16 ? "0" : "") + r.toString(16); var o = function (t, e, r, o, i) { var a = i ? "-" : ""; return n[255 & t] + n[t >> 8 & 255] + n[t >> 16 & 255] + n[t >> 24 & 255] + a + n[255 & e] + n[e >> 8 & 255] + a + n[e >> 16 & 15 | 64] + n[e >> 24 & 255] + a + n[63 & r | 128] + n[r >> 8 & 255] + a + n[r >> 16 & 255] + n[r >> 24 & 255] + n[255 & o] + n[o >> 8 & 255] + n[o >> 16 & 255] + n[o >> 24 & 255] }, i = function () { if (window.Uint32Array && window.crypto && window.crypto.getRandomValues) { var t = new window.Uint32Array(4); return window.crypto.getRandomValues(t), { d0: t[0], d1: t[1], d2: t[2], d3: t[3] } } return { d0: 4294967296 * Math.random() >>> 0, d1: 4294967296 * Math.random() >>> 0, d2: 4294967296 * Math.random() >>> 0, d3: 4294967296 * Math.random() >>> 0 } }, a = function () { var t = "", e = function (t, e) { for (var n = "", r = t; r > 0; --r)n += e.charAt(1e3 * Math.random() % e.length); return n }; return t += e(2, "0123456789"), t += e(1, "123456789"), t += e(8, "0123456789") }; return t.safeGenerateNoDash = function () { try { var t = i(); return o(t.d0, t.d1, t.d2, t.d3, !1) } catch (n) { try { return e + a() } catch (n) { } } }, t.isValidNumericalToken = function (t) { return t && t.toString().length <= 11 && t.length >= 9 && parseInt(t, 10).toString().length <= 11 && parseInt(t, 10).toString().length >= 9 }, t.isValidUUIDToken = function (t) { return t && 32 === t.toString().length && /^[a-z0-9]+$/.test(t) }, t.isValidFGUToken = function (t) { return 0 == t.indexOf(e) && t.length >= 12 }, t }(), T = { uDF: "UDF", uAL: "UAL", mLd: "1", eTlu: "2", eUoe: "3", uS: "4", uF: "9", tmos: ["T5", "T10", "T15", "T30", "T60"], tmosSecs: [5, 10, 15, 30, 60], bIR: "43" }, y = function (t, e) { for (var n = T.tmos, r = 0; r < n.length; r++)if (t + n[r] === e) return !0; return !1 }; try { var S = p(); try { S.id && (w.isValidNumericalToken(S.id) || w.isValidUUIDToken(S.id) || w.isValidFGUToken(S.id)) || (S.id = w.safeGenerateNoDash()), S.ts = window.ftr__startScriptLoad, g(S); var D = new Array(T.tmosSecs.length), k = function (t) { for (var e = 0; e < T.tmosSecs.length; e++)D[e] = setTimeout(n, 1e3 * T.tmosSecs[e], t + T.tmos[e]) }, U = function () { for (var t = 0; t < T.tmosSecs.length; t++)clearTimeout(D[t]) }; y(T.uDF, S.ex) ? o() : (k(T.uDF), setTimeout(i, v, T.uDF)) } catch (F) { n(T.mLd) } } catch (F) { }
}

GEShopifyCheckout.prototype.SetForter = function (token) {
    if (token) {
        this.ftrToken = token;
    }
    if (this.ftrToken && this.isFtrTokenSet === undefined) {
        document.querySelectorAll("[glbe-payment-form]").forEach(function (form) {
            if (typeof GESHOP != "undefined" && GESHOP != null) {
                GESHOP.InjectAdditionalParams(form, "FtrToken", GESHOP.ftrToken);
                GESHOP.InjectAdditionalParams(form, "FtrEnabled", GESHOP.parameters.isTokenEnabled);
                GESHOP.InjectAdditionalParams(form, "FtrSiteId", GESHOP.parameters.siteId);
                GESHOP.isFtrTokenSet = true;
            }
        });
    }
}

GEShopifyCheckout.prototype.AutoSelectGEPaymentMethod = function () {
    var geClicked = false;
    document.querySelectorAll("[data-gateway-group]").forEach((row) => {
        if (this.IsGlobalEPaymentMethod(row)) {
            if (row.querySelector("input[type='radio']") != null) {
                row.querySelector("input[type='radio']").click();
                geClicked = true;
            }
            this.globalePaymentSelected = true;
        }
    });
    if (!geClicked) {
        this.Log(this.LogTypes.Info, "AutoSelectGEPaymentMethod failed.");
    }

    if (!this.globalePaymentSelected) {
        //native form was not ready, retry
        setTimeout(function () {
            this.AutoSelectGEPaymentMethod();
        }.bind(this), 100);
    }
}

GEShopifyCheckout.prototype.IsGlobalEPaymentMethod = function (row) {
    return row.querySelector(".radio__label__primary").innerText.toLowerCase().indexOf("global-e") > -1;
}

GEShopifyCheckout.prototype.HideGEPaymentMethodForShopifyCheckout = function () {
    var paymentMethods = document.querySelectorAll("[data-gateway-group]");

    //Hide and disable Global-E payment methods
    paymentMethods.forEach((row) => {
        if (this.IsGlobalEPaymentMethod(row)) {
            if (row.querySelector("input[type='radio']") != null) {
                row.querySelector("input[type='radio']").disabled = true;
            }
            row.style.display = "none";
        }
    });

    //Select first non Global-E payment method
    var nonGlobalEPaymentMethodFound = false;
    paymentMethods.forEach((row) => {
        if (nonGlobalEPaymentMethodFound) {
            return;
        }

        if (!this.IsGlobalEPaymentMethod(row)) {
            if (row.querySelector("input[type='radio']") != null) {
                row.querySelector("input[type='radio']").click();
            }
            nonGlobalEPaymentMethodFound = true;
        }
    });
}

//This action invokes all init actions
GEShopifyCheckout.prototype.Init = function () {
    this.SetParams();
    if (this.parameters.isOperatedCountry) {
        this.OnDocumentReady.call(this, function () {

            //get checkout id (when doc ready)
            this.checkoutId = this.GetCheckoutId();

            if (this.IsPaymentStep()) {
                this.ShowPaymentStepLoading(true);
                this.AutoSelectGEPaymentMethod();
                this.previousUIAmount = this.GetUIAmount();
            }

            if (this.IsInformationStep()) {
                this.previousUIAmount = this.GetUIAmount();
            }

            //register listeners
            this.RegisterListeners();

            if (this.IsAnalyticsAllowed()) {
                this.InitRaygunScript();
            }

            this.InitGoogleAnalyticsLogger();

            //show loader 
            //this.ShowLoading();

            //insert target iframe 
            this.InsertFormTargetIframe();

            //JSONP to render payment box
            this.InvokePaymentBox();

            //Add forter support
            this.RunForterTag();

            // Initialize event listeners
            this.InitEventListeners();

            //JSONP to render tax message box
            this.InvokeAdditionalData();

            //Check if order completed
            if (this.IsConfirmationStep()) {
                this.Log(this.LogTypes.Info, "Order created successfully on Shopify side");
                this.WriteHeapOrderCompleted();
            }

            //TODO Zili : remove when we have full integration with payment app. Shows the payment result in a popup
            //if (this.parameters.status !== null && this.parameters.status !== "undefined" && this.parameters.status !== "")
            //alert(this.parameters.status);            

            this.Log(this.LogTypes.Info, "GlobalE checkout is initialized.");
        });
    }
    else {
        this.clientLogsEnabled = false;
    }
}

GEShopifyCheckout.prototype.GetQueryParam = function (q, optUrl) {
    var url = !this.IsDefined(optUrl) ? window.location.search : optUrl;
    var match = RegExp('[?&]' + q + '=([^&]*)').exec(url);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

GEShopifyCheckout.prototype.GetDefaultError = function () {
    return {
        errors: [
            {
                Error: "There was a problem processing the payment. Try refreshing this page or check your internet connection.",
                Description: ""
            }
        ]
    };
}

GEShopifyCheckout.prototype.GetPaymentError = function (type) {
    var self = this;
    try {
        var error = self.PaymentErrors.find(function(err) { return err.Type === type});
        if (self.IsDefined(error)){
            return error;
        }
        return  self.PaymentErrors.find(function(err) { return err.Type === self.PaymentErrorTypes.DefaultError});
    }
    catch (ex) {
        self.Log(self.LogTypes.Exception, "Failed in GetPaymentError: " + ex);
        return  self.PaymentErrors.find(function(err) { return err.Type === self.PaymentErrorTypes.DefaultError});
    }
}

GEShopifyCheckout.prototype.SetPaymentError = function (error, type) {
    var self = this;
    try {
        self.PaymentErrors.push({
            Error: error,
            Description: "",
            Type: type
        });
    }
    catch (ex) {
        self.Log(self.LogTypes.Exception, "Failed in SetPaymentError: " + ex);
    }
}

GEShopifyCheckout.prototype.SetDeclineMessageIfNeeded = function () {
    var self = this;
    var showError = this.GetQueryParam("show_error");
    if (showError == '1') {        
        if (typeof GESHOP != "undefined" && GESHOP != null) {
            const errorObj = this.GetPaymentError(this.PaymentErrorTypes.DefaultError);
            const res = { errors: [errorObj]}
            GESHOP.ShowErrorMessage(res);
        }
    }
    if (showError == '2') {
        if (document.getElementsByClassName("glbe-oos-error").length == 0) {
            const errorObj = this.GetPaymentError(this.PaymentErrorTypes.OOSError);
            const res = { errors: [errorObj] }
            self.ShowOOSErrorMessage(res);
        }
    }
}

GEShopifyCheckout.prototype.ShowOOSErrorMessage = function (glbeResponse) {
    var self = this;
    try {
        var container = document.querySelector(".step__sections");
        var errorElement = document.createElement("div");
        errorElement.className = "glbe-oos-error";
        errorElement.innerText = glbeResponse.errors[0].Error;
        
        var shopifyDescription = container.querySelectorAll(".section")[1];
        container.insertBefore(errorElement, shopifyDescription);
    }
    catch (ex) {
        self.Log(self.LogTypes.Exception, "Failed in ShowOOSErrorMessage: " + ex);
    }
}

//This action purpose is to inject additional inputs into all forms
//from values that are gathered from the client side.
GEShopifyCheckout.prototype.InjectAdditionalParams = function (form, name, value) {
    var previousField = form.querySelector("[name='" + name + "']");

    if (previousField != null) {
        //update existing field
        previousField.value = value;
    }
    else {
        //create new field
        var hel = document.createElement("input");
        hel.type = "hidden";
        hel.name = name;
        hel.value = value;
        form.appendChild(hel);
    }
}

GEShopifyCheckout.prototype.RemoveAdditionalParams = function (form, name) {
    var previousField = form.querySelector("[name='" + name + "']");
    if (previousField != null) {
        form.removeChild(previousField);
    }
}

//This action sets the valication rules for the credit card form
GEShopifyCheckout.prototype.SetupForms = function () {
    //iterate payment forms and invoke the validation functions relevant for the form
    //the validator function are set at the bottom of this class and they are defined
    //only for payment options that requires validation
    document.querySelectorAll("[glbe-payment-form]").forEach(function (form) {
        this.InjectAdditionalParams(form, "MerchantId", this.parameters.merchantId);
        this.InjectAdditionalParams(form, "CheckoutId", this.checkoutId);
        if (this.isShopifyIntegrationV2 && this.useShippingCountryForCountryCode && this.IsDefined(this.parameters.shippingCountry)) {
            this.InjectAdditionalParams(form, "CountryCode", this.parameters.shippingCountry);
        } else {
            //later it should be fixed for V1
            this.InjectAdditionalParams(form, "CountryCode", this.parameters.billingCountry);
        }
        this.InjectAdditionalParams(form, "WebStoreCode", this.parameters.webStoreCode);
        if (this.IsDefined(Shopify.Checkout.currency)) {
            this.InjectAdditionalParams(form, "CurrencyCode", Shopify.Checkout.currency);
        }
        else {
            this.InjectAdditionalParams(form, "CurrencyCode", this.currencyCode);
            GESHOP.Log(GESHOP.LogTypes.Error, "We do not use Shopify currency, instead we used Country Currency");
        }

        if (GEShopifyCheckout.Validators[form.id] != undefined) {
            GEShopifyCheckout.Validators[form.id].bind(this)(form);
        }
        else {
            //register default on submit
            form.onsubmit = function (e) {
                e.target.submit();
            };
        }
    }.bind(this));
    // inject browser info fields needed for credit card payment flow
    var browserInfo = this.GetBrowserInfo();

    GEShopifyCheckout.CreditCardForms.forEach(data => {
        var creditCardForm = document.querySelector('#' + data.form);
        if (creditCardForm == null) {
            return;
        }
        for (var browserInfoPropertyName in browserInfo) {
            if (browserInfo.hasOwnProperty(browserInfoPropertyName)) {
                this.InjectAdditionalParams(creditCardForm, 'ClientInfo.' + browserInfoPropertyName, browserInfo[browserInfoPropertyName]);
            }
        }
    }
    );
}
//This action is here to check if a tab header was clicked or one of its child elements, 
//this action is used in order to determinte if the OnTabLoaded callback should be called
GEShopifyCheckout.prototype.IsParentContainsClass = function (node, className) {
    if (typeof node != "undefined") {
        if (node.classList.contains("glbe-radio")) {
            return false;
        }
        var p = node;
        if (p.classList.contains(className)) {
            return true;
        }
        while (typeof (p = p.parentNode) != "undefined") {
            if (p.classList.contains(this.tabContentContainerClassName)) {
                //we've reached tab content container, this means we didnt click on a tab but on a child control
                return false;
            }
            if (p.classList.contains(className)) {
                return true;
            }
        }
    }

    return false;
}

//This action registers the payment tab clicks in order to set the 
//active payment method on the class instance 
GEShopifyCheckout.prototype.RegisterTabClick = function () {

    //set cash on delivery payment
    if (this.isCashOnDeliveryPayment) {
        this.activePaymentName = GEShopifyCheckout.enums.payments.CASHONDELIVERY;
        this.activePaymentForm = GEShopifyCheckout.enums.forms.CASHONDELIVERY;
    }
    else if (this.isVirtualPayment) {
        //set default virtual payment
        this.activePaymentName = GEShopifyCheckout.enums.payments.VIRTUALPAYMENT;
        this.activePaymentForm = GEShopifyCheckout.enums.forms.VIRTUALPAYMENT;
    } else {
        //set default credit cards
        this.activePaymentName = GEShopifyCheckout.enums.payments.CREDITCARDS;
        this.activePaymentForm = GEShopifyCheckout.enums.forms.CREDITCARDS;
    }

    document.querySelectorAll("[data-tab-name]").forEach(function (x) {
        x.onclick = function (e) {
            //if selected shipping option is COD, payment COD is selected automaticaly and we do not allow the customer to change it.
            //if (this.isCashOnDeliveryPayment || x.getAttribute("data-tab-name") == GEShopifyCheckout.enums.payments.CASHONDELIVERY)
            //    return;

            if (x.getElementsByClassName("glbe-radio")[0] != null && x.getElementsByClassName("glbe-radio")[0].disabled)
                return;

            //check if event target requested to bubble
            var eventShouldBubble = typeof e.triggerTabClick != "undefined" && e.triggerTabClick == true;
            //check if event triggered by a tab
            if (eventShouldBubble || (e.target.parentNode != null
                && (this.IsParentContainsClass(e.target, "glbe-tab")))) {
                //e.preventDefault();           
                this.activePaymentName = x.getAttribute("data-tab-name");
                this.activePaymentId = x.getAttribute("data-pm-id");
                var isAlternativeCreditCardForm = this.IsDefined(GEShopifyCheckout.alternativeCreditCards)
                    && GEShopifyCheckout.alternativeCreditCards.indexOf(this.activePaymentName) >= 0
                    && document.querySelector("#" + "glbe-form-сс-" + this.activePaymentName) != null;
                this.activePaymentForm = isAlternativeCreditCardForm ? "glbe-form-сс-" + this.activePaymentName : "glbe-form-" + this.activePaymentName;
                //need to invoke on tab loaded callback if such are registered
                if (typeof GEShopifyCheckout.OnPaymentTabLoaded[this.activePaymentName] != "undefined") {
                    //click was registered
                    var resp = GEShopifyCheckout.OnPaymentTabLoaded[this.activePaymentName].bind(this)();
                    this.tabsInfo[this.activePaymentName] = { disableCompleteButton: resp.disableCompleteButton };
                    this.DisableCompleteOrderButton(resp.disableCompleteButton);

                }
                else {
                    this.tabsInfo[this.activePaymentName] = { disableCompleteButton: false };     //default
                    this.DisableCompleteOrderButton(false);
                }

            }
        }.bind(this);

        var curActivePaymentName = x.getAttribute("data-tab-name");
        if (curActivePaymentName == this.activePaymentName) {
            //trigger default tab click 
            x.click();
        }

    }.bind(this));
}
GEShopifyCheckout.prototype.SetPaymentBoxContainer = function (html, renderRequired, callback) {
    var searchSymbol = this.elementsConfig.InsertBeforeElement.IdentifierType == 1 ? "#" : ".";
    var self = this;
    switch (this.elementsConfig.InsertBeforeElement.IdentifierType) {
        case 1: searchSymbol = "#"; break;
        case 2: searchSymbol = "."; break;
        case 3: searchSymbol = "attribute"; break;
    }

    var div = document.createElement("div");
    div.id = self.paymentBoxContainerId;
    if (!renderRequired) {
        //div.style.display = "none";
    }
    div.innerHTML = html;
    var element = null;
    if (searchSymbol == "attribute") {
        element = document.querySelectorAll('[' + this.elementsConfig.InsertBeforeElement.ElementIdentifier + ']')[0];
    }
    else {
        element = document.querySelector(searchSymbol + this.elementsConfig.InsertBeforeElement.ElementIdentifier);
    }

    // before injecting our payment box we must verify if it already exist in DOM
    var paymentBoxContainerElement = document.getElementById(self.paymentBoxContainerId);
    var paymentBoxExistInDOM = self.IsDefined(paymentBoxContainerElement) && paymentBoxContainerElement != null;

    if (!paymentBoxExistInDOM) {
        if (typeof element != "undefined" && typeof element.parentNode != "undefined") {
            element.parentNode.insertBefore(div, element);
            callback(true);
        }
        else {
            this.SetContainerRetries--;
            if (this.SetContainerRetries >= 0) {
                setTimeout(function () {
                    self.SetPaymentBoxContainer(html, renderRequired, callback);
                }, this.SetContainerIntervalMS);
            }
            else {
                console.log("Payment box was not found after" + this.SetContainerRetries + " x " + this.SetContainerIntervalMS);
                callback(false);
            }
        }
    }
}
GEShopifyCheckout.prototype.LoadModalPopup = function (onload) {
    if (typeof tingle == "undefined") {
        var src = this.parameters.environment + '/content/tingle/tingle.js';
        this.LoadScript(src, onload);
    }
    else {
        //already loaded
        onload();
    }

}
GEShopifyCheckout.prototype.ShowDuplicateTrxPopup = function () {
    this.ShowModalPopup({
        content: this.duplicatedTrxPopupResources.PopupMessage,
        okButtonText: this.duplicatedTrxPopupResources.ApproveButton,
        cancelButtonText: this.duplicatedTrxPopupResources.CancelButton,
        showOK: true,
        showCancel: true,
        onOk: function () {
            if (typeof GESHOP != "undefined" && GESHOP != null) {
                GESHOP.ShowPostPaymentLoading(true);
                document.querySelectorAll("[glbe-payment-form]").forEach(function (form) {
                    GESHOP.InjectAdditionalParams(form, "DiscardOpenPayment", true);
                }.bind(this));

                GESHOP.SubmitPayment();
            }
        },
        onCancel: function () {
            if (typeof GESHOP != "undefined" && GESHOP != null) {
                GESHOP.ShowPostPaymentLoading(false);
            }
        }
    });
}
GEShopifyCheckout.prototype.ShowModalPopup = function (obj) {
    //obj.content
    //obj.okButtonText
    //obj.cancelButtonText
    //obj.onOk
    //obj.onCancel
    //obj.showOK
    //obj.showCancel

    var showOK = typeof obj.showOK == "undefined" ? false : obj.showOK;
    var showCancel = typeof obj.showCancel == "undefined" ? false : obj.showCancel;
    this.LoadModalPopup(function () {
        var modal = new tingle.modal({
            footer: true,
            stickyFooter: false,
            closeMethods: ['overlay', 'button', 'escape'],
            closeLabel: "Close",
            cssClass: ['custom-class-1', 'custom-class-2'],
            onOpen: function () {
                if (typeof GESHOP != "undefined" && GESHOP != null) {
                    GESHOP.Log(GESHOP.LogTypes.Info, "ModalPopup - Open -" + obj.content);
                }
                console.log('modal open');
            },
            onClose: function () {
                console.log('modal closed');
                if (obj.onCloseModal != undefined) {
                    obj.onCloseModal(modal);
                }
            },
            beforeClose: function () {
                // here's goes some logic
                // e.g. save content before closing the modal
                return true; // close the modal
            },
            beforeOpen: function () {
                if (obj.onOpenModal != undefined) {
                    obj.onOpenModal();
                }
            }
        });
        modal.setContent(obj.content);

        if (showOK) {
            modal.addFooterBtn(obj.okButtonText, 'tingle-btn glbe-popup-button tingle-btn--primary', function () {
                // here goes some logic
                if (typeof obj.onOk != "undefined") {
                    obj.onOk();
                }
                modal.close();
                if (typeof GESHOP != 'undefined' && GESHOP != null) {
                    GESHOP.Log(GESHOP.LogTypes.Info, "ModalPopup - Closed with OK -" + obj.content);
                }
            });
        }
        if (showCancel) {
            // add another button
            modal.addFooterBtn(obj.cancelButtonText, 'tingle-btn glbe-popup-button tingle-btn--danger', function () {
                // here goes some logic
                if (typeof obj.onCancel != "undefined") {
                    modal.destroy();
                    obj.onCancel(modal);
                }

                modal.close();
                if (typeof GESHOP != "undefined" && GESHOP != null) {
                    GESHOP.Log(GESHOP.LogTypes.Info, "ModalPopup - Closed with Cancel -" + obj.content);
                }
            });
        }
        // open modal
        modal.open();

    }.bind(this));

}
GEShopifyCheckout.prototype.GetUIAmountAsDecimal = function () {
    try {
        var amountSpen = document.querySelector("[data-checkout-payment-due-target]");
        if (amountSpen != null) {
            return amountSpen.textContent.replace(/[^0-9.]+/g, "");
        }
        return 0;
    }
    catch (ex) {
        this.Log(this.LogTypes.Exception, "SPY Client-side GetUIAmountAsDecimal failed: " + ex);
        return 0;
    }
}
GEShopifyCheckout.prototype.GetUIAmount = function () {
    var amountSpen = document.querySelector("[data-checkout-payment-due-target]");
    if (amountSpen != null) {
        var amount = amountSpen.getAttribute("data-checkout-payment-due-target");
        return amount;
    }
    else {
        if (typeof GLBE_PARAMS.amount != "undefined") {
            return GLBE_PARAMS.amount;
        }
    }
    return null;
}
GEShopifyCheckout.prototype.IsUIAmountChanged = function () {
    var amount = this.GetUIAmount();
    if (amount != null) {
        if (this.IsDefined(this.previousUIAmount) && amount != this.previousUIAmount) {
            this.previousUIAmount = amount;
            return true;
        }
        else {
            return false;
        }
    }
}

GEShopifyCheckout.prototype.SetUpCustomerID = function () {
    var shopifyCustomerIdExist = this.IsShopifyCustomerIdExist();
    if (this.showCustomerIdField && !shopifyCustomerIdExist) {
        var container = document.querySelector(".glbe-customerid-container");
        container.style.display = "block";

        //validation onblur
        var input = document.querySelector("#glbe_customer_id");
        input.onblur = function () {
            this.IsCustomerIDValid();
        }.bind(this);
    }
}

GEShopifyCheckout.prototype.IsShopifyCustomerIdExist = function () {
    var response = false;

    var element = this.GetShopifyCustomerIdElement();
    if (this.IsDefined(element)) {
        response = true;
    }

    return response;
}

GEShopifyCheckout.prototype.GetShopifyCustomerIdElement = function () {
    var dynamicIdentifier = "checkout_localized_fields_shipping_credential_";
    var countryCode = this.parameters.shippingCountry.toLowerCase();

    var queryString = "#" + dynamicIdentifier + countryCode;

    return document.querySelector(queryString);
}

GEShopifyCheckout.prototype.InjectCustomerID = function (customerId) {
    document.querySelectorAll("[glbe-payment-form]").forEach(function (form) {
        if (typeof GESHOP != "undefined" && GESHOP != null) {
            GESHOP.InjectAdditionalParams(form, "CustomerID", customerId);
        }
    });
}

GEShopifyCheckout.prototype.RemoveCustomerID = function () {
    document.querySelectorAll("[glbe-payment-form]").forEach(function (form) {
        if (typeof GESHOP != "undefined" && GESHOP != null) {
            GESHOP.RemoveAdditionalParams(form, "CustomerID");
        }
    });
}

GEShopifyCheckout.prototype.ValidateRegex = function (input) {
    var regEx = input.getAttribute("data-validationregex");
    var validationMessage = input.getAttribute("data-validationmessage");
    var value = input.value;

    const regex = new RegExp(regEx);
    var isValid = regex.test(value);

    return isValid;
}
GEShopifyCheckout.prototype.IsCustomerIDValid = function () {
    var response = true;

    if (this.showCustomerIdField) {
        var customerIdInput = document.querySelector("#glbe_customer_id");

        // in case Shopify customer id exist in the DOM we need to hide ours and fill it the value according to Shopify one
        var shopifyCustomerIdExist = this.IsShopifyCustomerIdExist();
        var shopifyCustomerIdElement = null;

        if (shopifyCustomerIdExist) {
            shopifyCustomerIdElement = this.GetShopifyCustomerIdElement();
            customerIdInput.value = shopifyCustomerIdElement.value;
        }

        if (customerIdInput.value != "") {
            var isValidValue = this.ValidateRegex(customerIdInput);
            if (isValidValue) {
                customerIdInput.classList.remove("invalid");
                this.InjectCustomerID(customerIdInput.value);
            }
            else {
                response = false;
            }
        }
        else if (this.isCustomerIdMandatoryField) {
            response = false;
            //report validation error
            ShopifyGALogger?.ReportValidationError({"element":"customer_id", "message" : "Customer ID Required"});
        }
        else {
            //remove existing field injected
            this.RemoveCustomerID();
        }
    }

    if (!response) {
        if (shopifyCustomerIdExist && this.IsDefined(shopifyCustomerIdElement)) {
            this.AddMessageBasedOnElement(shopifyCustomerIdElement);
        }
        else {
            customerIdInput.classList.add("invalid");
        }
    }

    return response;
}

GEShopifyCheckout.prototype.IsDifferentBillingAddress = function () {
    var radio = document.querySelector("#checkout_different_billing_address_true")
    return radio.checked;
}

GEShopifyCheckout.prototype.InjectBillingAddress = function (activeForm) {

    try {
        if (!this.IsDifferentBillingAddress()) {
            //remove previously added fields
            var billingFields = activeForm.querySelectorAll("input[type='hidden'][name^='BillingAddress']");
            for (var i = 0; i < billingFields.length; i++) {
                this.RemoveAdditionalParams(activeForm, billingFields[i].name);
            }

            return;
        }
        var firstName = document.querySelector("#checkout_billing_address_first_name").value;
        var lastName = document.querySelector("#checkout_billing_address_last_name").value;
        var address1 = document.querySelector("#checkout_billing_address_address1").value;
        var address2 = document.querySelector("#checkout_billing_address_address2").value;
        var zip = document.querySelector("#checkout_billing_address_zip").value;
        var city = document.querySelector("#checkout_billing_address_city").value;
        var countryCombo = document.querySelector("#checkout_billing_address_country");
        var countryISO = countryCombo.options[countryCombo.selectedIndex].getAttribute("data-code");
        var state = document.querySelector("#checkout_billing_address_province").value;
        var phone = document.querySelector("#checkout_billing_address_phone").value;
        var stateOrProvince = "";
        var stateOrProvinceElement = document.querySelector("#checkout_billing_address_province");
        if (!stateOrProvinceElement.hidden &&
            this.IsDefined(stateOrProvinceElement.selectedOptions) &&
            stateOrProvinceElement.selectedOptions.length > 0) {
            stateOrProvince = stateOrProvinceElement.selectedOptions[0].innerText;
        }

        if (typeof GESHOP != "undefined" && GESHOP != null) {
            GESHOP.InjectAdditionalParams(activeForm, "BillingAddress.FirstName", firstName);
            GESHOP.InjectAdditionalParams(activeForm, "BillingAddress.LastName", lastName);
            GESHOP.InjectAdditionalParams(activeForm, "BillingAddress.Address1", address1);
            GESHOP.InjectAdditionalParams(activeForm, "BillingAddress.Address2", address2);
            GESHOP.InjectAdditionalParams(activeForm, "BillingAddress.Zip", zip);
            GESHOP.InjectAdditionalParams(activeForm, "BillingAddress.City", city);
            GESHOP.InjectAdditionalParams(activeForm, "BillingAddress.CountryCode", countryISO);
            GESHOP.InjectAdditionalParams(activeForm, "BillingAddress.StateCode", state);
            GESHOP.InjectAdditionalParams(activeForm, "BillingAddress.Phone1", phone);
            if (GESHOP.IsDefined(stateOrProvince)) {
                GESHOP.InjectAdditionalParams(activeForm, "BillingAddress.StateOrProvince", stateOrProvince);
            }
        }
    }
    catch (err) {
        //handle errors
    }
}

//This action is the JSON callback function, it is invoked from the JSONP script at the end
//of the server processing in method "GetKlarnaPaymentOptions" and renders the html returned from the server into the page.
GEShopifyCheckout.prototype.OnAvailableKlarnaPaymentOptionsLoaded = function (obj) {
    var klarnaElement = document.querySelectorAll('.glbe-payment-method-groups')[0];
    klarnaElement.innerHTML = obj.html;
    this.KlarnaOptionsLoaded = true;
    this.ShowPaymentStepLoading(false);
    if (!obj.isKlarnaAvailable) {
        var errorDiv = document.querySelector("#klarnaShowFormError div").innerHTML;
        klarnaWidgetContainer.innerHTML = errorDiv;
    }
    else {
        var paymentMethodIdInput = document.querySelector("#" + GEShopifyCheckout.enums.forms.KLARNA + " input[name='PaymentMethodId']");
        var paymentMethodCodeInput = document.querySelector("#" + GEShopifyCheckout.enums.forms.KLARNA + " input[name='PaymentMethodCode']");
        var klarnaWidgetElement = document.querySelector("#klarna-widget-element");

        if (this.IsDefined(klarnaWidgetElement) && klarnaWidgetElement.getAttribute("data-init-widget") === "true") {
            this.HandleKlarnaDirectWidgetElement(klarnaWidgetElement, paymentMethodIdInput, paymentMethodCodeInput);
        }
        else {
            this.HandleWidgetForKlarnaGroupPaymentMethodBox(paymentMethodIdInput, paymentMethodCodeInput);
        }
    }
}

GEShopifyCheckout.prototype.HandleKlarnaDirectWidgetElement = function (klarnaElement, paymentMethodIdInput, paymentMethodCodeInput) {
    var paymentMethodId = klarnaElement.getAttribute("data-pm-id");
    var paymentMethodCode = klarnaElement.getAttribute("data-pm-code");
    var clientToken = klarnaElement.getAttribute("data-client-token");

    // Set relevant payment method id and code in Klarna payment form
    paymentMethodIdInput.value = paymentMethodId;
    paymentMethodCodeInput.value = paymentMethodCode;

    // Load Klarna JS Widget
    var klarnaDirectManager = new KlarnaDirectManager({
        ClientToken: clientToken,
        PaymentMethodCategory: paymentMethodCode
    });
    klarnaDirectManager.LoadWidget();
    this.activePaymentId = paymentMethodId;
}

GEShopifyCheckout.prototype.HandleWidgetForKlarnaGroupPaymentMethodBox = function (paymentMethodIdInput, paymentMethodCodeInput) {
    document.querySelectorAll(".glbe-group-pm-box").forEach(function (pm_box) {
        pm_box.onclick = function (e) {
            var paymentMethodId = pm_box.getAttribute("pm-id");
            var paymentMethodCode = pm_box.getAttribute("pm-code");
            var clientToken = pm_box.getAttribute("client-token");
            this.activePaymentId = paymentMethodId;

            if (typeof GESHOP != "undefined" && GESHOP != null) {
                GESHOP.Log(GESHOP.LogTypes.Info, "Payment methos click paymentMethodId={paymentMethodId}, paymentMethodCode={paymentMethodCode}", paymentMethodId, paymentMethodCode);
            }

            // Active one of Klarna payment methods
            var activePaymentBox = document.querySelector(".glbe-tab-" + GEShopifyCheckout.enums.payments.KLARNA + " .glbe-group-pm-box.active");
            if (activePaymentBox) {
                activePaymentBox.classList.remove("active");
            }
            pm_box.classList.add("active");

            // Set relevant payment method id and code in Klarna payment form
            paymentMethodIdInput.value = paymentMethodId;
            paymentMethodCodeInput.value = paymentMethodCode;

            // Load Klarna JS Widget
            var klarnaDirectManager = new KlarnaDirectManager({
                ClientToken: clientToken,
                PaymentMethodCategory: paymentMethodCode
            });
            klarnaDirectManager.LoadWidget();
        }
    });
}

GEShopifyCheckout.prototype.ShouldUseShopifyCheckout = function () {
    if (!this.IsPaymentStep()) {
        return false;
    }

    var deliveryMethod = document.querySelector("div#order-summary tr.total-line--shipping th.total-line__name span")?.textContent?.trim();
    if (deliveryMethod !== "Pickup") {
        return false;
    }

    return true;
}

//This action is the JSON callback function, it is invoked from the JSONP script at the end
//of the server processing and renders the html returned from the server into the page.
GEShopifyCheckout.prototype.OnPaymentsBoxIntiated = function (obj) {
    
    this.ShowPaymentStepLoading(false);

    //check is operated
    if (typeof obj.isCountryOperatedByGE != "undefined" && !obj.isCountryOperatedByGE) {
        return;
    }

    this.duplicatedTrxPopupResources = obj.duplicatedTrxPopupResources;
    this.shopifyCheckoutResources = obj.shopifyCheckoutResources;
    this.elementsConfig = obj.domConfig;
    this.showCustomerIdField = obj.customerIdRequired;
    this.gettingBrowserInfoEnabled = obj.enableGettingBrowserInfo;
    this.paymentsBoxHtml = obj.html;
    this.isVirtualPayment = !obj.renderRequired;
    this.isApplePayFullRedirectMode = obj.isApplePayFullRedirectMode;
    this.isCashOnDeliveryPayment = obj.isCashOnDeliveryPayment;
    this.useCCValidationV2 = obj.useCCValidationV2;
    this.allowKlarnaCreateSessionOnShopifyCheckoutLoad = obj.allowKlarnaCreateSessionOnShopifyCheckoutLoad;
    this.enableNewLogicOfReloadGEPaymentBoxWhenDisappearInSPY = obj.enableNewLogicOfReloadGEPaymentBoxWhenDisappearInSPY;
    this.enforceGlobalePaymentBeforeOriginalButton = obj.enforceGlobalePaymentBeforeOriginalButton;
    this.doFinishOrderButtonCloneProgressInMethod = obj.doFinishOrderButtonCloneProgressInMethod;

    if (obj.enableClientLogs != null) {
        this.clientLogsEnabled = obj.enableClientLogs;
    }

    if (obj.isShopifyIntegrationV2 != null) {
        this.isShopifyIntegrationV2 = obj.isShopifyIntegrationV2;
    }

    if (obj.useShippingCountryForCountryCode != null) {
        this.useShippingCountryForCountryCode = obj.useShippingCountryForCountryCode;
    }

    if (obj.enableAddGECompleteOrderButtonIfNotExist != null) {
        this.enableAddGECompleteOrderButtonIfNotExist = obj.enableAddGECompleteOrderButtonIfNotExist;
    }

    if (obj.useLazyLoadInShopifyCheckoutPaymentBox != null) {
        this.useLazyLoadInShopifyCheckoutPaymentBox = obj.useLazyLoadInShopifyCheckoutPaymentBox;
    }

    if (obj.currency != null) {
        this.currencyCode = obj.currency;
    }
    if (this.elementsConfig.Success == false) {
        alert(this.elementsConfig.Error);
        return;
    }

    if (obj.useShopifyPickUpDeliveryMethod && this.ShouldUseShopifyCheckout()) {
        this.HideGEPaymentMethodForShopifyCheckout();
        var shopifyPaymentBox = document.getElementsByClassName("section section--payment-method")[0];
        if (this.IsDefined(shopifyPaymentBox)) {
            shopifyPaymentBox.classList.remove("section--payment-method");
        }
        return;
    }
    //check amount

    //set container element
    this.SetPaymentBoxContainer(obj.html, obj.renderRequired, function (paymentBoxFound) {
        if (paymentBoxFound) {

            if (this.enableNewLogicOfReloadGEPaymentBoxWhenDisappearInSPY) {
                this.InitiateObserver('[data-step="payment_method"]', function () {
                    var paymentBox = document.querySelector('#glbe-paymentBox-container');
                    if (GESHOP != null && typeof GESHOP != "undefined") {
                        if (paymentBox == null && !GESHOP.paymentBoxReloadIsInProgress) {
                            return true;
                        }
                    }
                    return false;
                }, function () {
                    if (GESHOP != null && typeof GESHOP != "undefined") {
                        GESHOP.ReloadPaymentBox();
                    }
                });
            }

            if (this.isShopifyIntegrationV2 && this.enableAddGECompleteOrderButtonIfNotExist) {
                this.InitiateObserver('[data-step="payment_method"]', function () {
                    var geButton = document.querySelector('#continue_button[is-glbe-custom=true]');
                    if (GESHOP != null && typeof GESHOP != "undefined") {
                        if (geButton == null && !GESHOP.IsGECompleteOrderButtonCloneProcessInprogress) {
                            return true;
                        }
                    }
                    return false;
                }, function () {
                    if (GESHOP != null && typeof GESHOP != "undefined") {
                        GESHOP.InterceptCompleteOrderButton();
                    }
                });
            }

            // Client-side monitoring scripts init
            try {
                var geCsmDiv = document.getElementById("globale-csm-scripts");
                if (geCsmDiv) {
                    var geCsmScripts = geCsmDiv.getElementsByTagName("script");
                    for (var s = 0; s < geCsmScripts.length; s++) eval(geCsmScripts[s].innerHTML);
                }
            }
            catch (ex) {
                this.Log(this.LogTypes.Exception, "SPY Client-side monitoring script init failed: " + ex);
                // if it fails- just ignore
            }

            //Register Button 
            this.InterceptCompleteOrderButton();

            //Customer ID logic
            this.SetUpCustomerID();

            this.baseCurrency = obj.currency;

            this.parameters.amount = obj.amount;

            //lazy load images
            if (this.useLazyLoadInShopifyCheckoutPaymentBox) {
                var myLazyLoad = new LazyLoad();
                myLazyLoad.update();
            }

            this.SetupForms();
            this.RegisterTabClick();

            this.SetForter();

            //If Shopify decline message appears on the page, we need to show it
            this.SetDeclineMessageIfNeeded();

            this.paymentBoxReloadIsInProgress = false;
            if (!this.doFinishOrderButtonCloneProgressInMethod) {
                this.IsGECompleteOrderButtonCloneProcessInprogress = false;
            }
        }
    }.bind(this));
    if (ShopifyGALogger) {
        ShopifyGALogger?.OnPaymentBoxInitiated(obj.paymentOptions);
    }
}

GEShopifyCheckout.prototype.InitiateObserver = function (identifier, validationToCheck, callback) {
    try {
        //register MutationObserver
        const targetNode = document.querySelector(identifier);

        if (targetNode != null) {
            // Options for the observer (which mutations to observe)
            const config = { attributes: true, childList: true, subtree: true };

            // Callback function to execute when mutations are observed
            const observerCallback = function (mutationsList, observer) {
                for (let mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        if (validationToCheck()) {
                            callback();
                        }
                    }
                }
            };

            // Create an observer instance linked to the callback function
            const observer = new MutationObserver(observerCallback);

            // Start observing the target node for configured mutations
            observer.observe(targetNode, config);
        }
    }
    catch (ex) {
        this.Log(this.LogTypes.Exception, "InitiateObserver:" + ex + ".");
    }
}

GEShopifyCheckout.prototype.InitEventListeners = function () {
    this.HandleChangeCountry(); 

    if (Shopify.Checkout.step === 'shipping_method') {
        this.SetEventListenerIntervalForShippingOptions();
        this.SetEventListenerIntervalForDutiesOptions();
    }

    if (Shopify.Checkout.step === 'payment_method') {
        this.SetTermsAndConditionsLoadInterval();
        this.SetTaxMessageLoadInterval();
    }
}
//** country change region **
GEShopifyCheckout.prototype.OnCountryChange = function (event) {
    try 
    {
      if (this.InvokeDataOnCountryChanged) {
          //find selected country code
          var selectElement = document.getElementById('checkout_shipping_address_country'); 
          var optionElement = selectElement.querySelector('option[value="'+event.target.value+'"]'); 
          var countryCode = optionElement.dataset.code; 
          if (countryCode != '' && this.parameters.shippingCountry != countryCode) {
            this.parameters.shippingCountry = countryCode;
            //remove validation zip error
            var zipcodeElement  = document.getElementById('checkout_shipping_address_zip');
            if (zipcodeElement != undefined) {
                this.RemoveErrorMessageBasedOnElement(zipcodeElement);
            }  
            this.InvokeDataOnCountryChange();
          }   
      }
    }
    catch (ex) {
        this.Log(this.LogTypes.Exception, "[CHECKOUT TEAM] OnCountryChange was failed " + ex );
    }
}
GEShopifyCheckout.prototype.RemoveErrorMessageBasedOnElement = function (input) {
    try 
    {
        var container = input.closest('.field__input-wrapper');
        if (container != null) {
            container.closest('.field--error').classList.remove('field--error');
        }
    }
    catch (ex) { }
}
GEShopifyCheckout.prototype.InvokeDataOnCountryChange = function () {
    if (this.IsDefined(this.parameters.shippingCountry)) {
        this.LoadScript(this.parameters.environment + '/platforms/shopify/checkout/initdataoncountrychanged/' +
            this.parameters.merchantId + '/' +
            this.parameters.shippingCountry  + '/' +
            this.parameters.cultureCode + '/' +
            this.checkoutId 
        );
    }
}

GEShopifyCheckout.prototype.OnDataOnCountryChangedIntiated = function (obj) {
    if (this.IsDefined(obj)) 
    {
        if (this.IsDefined(obj.merchantValidationRegexSettings) && this.IsDefined(this.merchantValidationRegexSettings.FieldValidationConfig) ) {
            this.merchantValidationRegexSettings = obj.merchantValidationRegexSettings;
             if (typeof (this.merchantValidationRegexSettings.FieldValidationConfig) === 'string') {
                        this.merchantValidationRegexSettings.FieldValidationConfig = JSON.parse(this.merchantValidationRegexSettings.FieldValidationConfig);
                    }
        }
    }
}

GEShopifyCheckout.prototype.GetCheckoutStep = function () {
    if (this.IsDefined(Shopify.Checkout.step)) {
        return Shopify.Checkout.step;
    }

    return "Unknown";
}

GEShopifyCheckout.prototype.SetTermsAndConditionsLoadInterval = function () {
    var self = this;
    self.termsAndConditionsInterval = setInterval(self.DisplayTermsAndConditionIntervalHandler.bind(this), self.intervalTime, function () {
        clearInterval(self.termsAndConditionsInterval);
    });
}

GEShopifyCheckout.prototype.SetTaxMessageLoadInterval = function () {
    var self = this;
    self.taxMessageInterval = setInterval(self.DisplayTaxMessageIntervalHandler.bind(this), self.intervalTime, function () {
        clearInterval(self.taxMessageInterval);
    });
}

GEShopifyCheckout.prototype.SetEventListenerIntervalForShippingOptions = function () {
    var self = this;
    self.shippingMethodsInterval = setInterval(self.RegisterShippingOptionsEventListeners.bind(this), self.intervalTime, function () {
        clearInterval(self.shippingMethodsInterval);
    });
}

GEShopifyCheckout.prototype.SetEventListenerIntervalForDutiesOptions = function () {
    var self = this;
    self.dutiesAndTaxesInterval = setInterval(self.RegisterPrepayDutiesOptionsEventListeners.bind(this), self.intervalTime, function () {
        clearInterval(self.dutiesAndTaxesInterval);
    });
}


GEShopifyCheckout.prototype.RegisterCheckoutLinksEventListeners = function () {
    var self = this;
    document.querySelectorAll('.formLink').forEach(item => {
        item.addEventListener('click', event => {
            self.CheckoutLinkOnClick(event);
        })
    })
}

GEShopifyCheckout.prototype.RegisterTnCConsentEventListeners = function () {
    var self = this;
    document.querySelectorAll('.terms-and-conditions input').forEach(item => {
        item.addEventListener('change', event => {
            self.TnCConsentOnChange(event);
        })
    });
}

GEShopifyCheckout.prototype.TnCConsentOnChange = function (event) {
    if (event.target.checked && event.target.dataset.checkall.toLowerCase() == 'true') {
        document.querySelectorAll('.terms-and-conditions input').forEach(item => {
            item.checked = 'true'
        });
    }

    // in case error already visible need to remove it in case that all checkboxes are checked
    if (this.IsTnCConsentVisible()) {
        if (this.ValidateTnCConsent()) {
            this.DisplayTnCConsentError(false);
        }
    }
}

GEShopifyCheckout.prototype.ValidateTnCConsent = function () {
    var response = true;

    if (this.IsDefined(this.termsAndConditionsInformation) && this.IsDefined(this.termsAndConditionsInformation.IsTnCConsentEnabled) && this.termsAndConditionsInformation.IsTnCConsentEnabled) {
        document.querySelectorAll('.terms-and-conditions input').forEach(item => {

            if (item.dataset.checkall.toLowerCase() == 'false' && response) {
                if (!item.checked) {
                    response = false;
                }
            }
        });

        if (!response) {
            this.DisplayTnCConsentError(true);
        }
    }

    return response;
}

GEShopifyCheckout.prototype.ValidateCustomFields = function () {
    var self = this;
    var response = true;

    try {
        if (self.IsDefined(self.customValidations)) {
            self.customValidations.forEach(function (customValidation) {
                if (self.IsDefined(customValidation.Identifier) && self.IsDefined(customValidation.Regex)) {
                    var element = document.querySelector(customValidation.Identifier);
                    if (self.IsDefined(element)) {
                        var regex = new RegExp(customValidation.Regex);
                        if (!regex.test(element.value)) {
                            response = false;
                            var wrapperFieldElement = element.closest('.field');
                            if (self.IsDefined(wrapperFieldElement)) {
                                if (!wrapperFieldElement.classList.contains('field--error')) {
                                    self.AddMessageBasedOnElement(element);
                                    ShopifyGALogger?.ReportValidationError();
                                }

                                element.scrollIntoView();
                            }
                        }
                    }
                }
            });
        }
    }
    catch (ex) {
        this.Log(this.LogTypes.Exception, "ValidateCustomFields was failed. " + ex + ".");
    }

    return response;
}

GEShopifyCheckout.prototype.ValidatePaymentMethod = function () {
    var self = this;
    var response = true;
    if (!self.IsDefined(self.activePaymentId)) {
        try {
            var message = "Please choose payment method";
            if (self.IsDefined(self.shopifyCheckoutResources.PaymentMethodNotSelected)) {
                message = self.shopifyCheckoutResources.PaymentMethodNotSelected;
            }
            var paymentErrorsObj = {
                errors: [
                    {
                        Error: message, //"Please choose payment method",
                        Description: ""
                    }
                ]
            };
            self.ShowErrorMessage(paymentErrorsObj);
            response = false;
        } catch (ex) {
            this.Log(this.LogTypes.Exception, "ValidatePaymentMethod was failed. " + ex + ".");
        }
    }

    return response;
}


GEShopifyCheckout.prototype.AddMessageBasedOnElement = function (input, optionalText) {
    var container = input.closest('.field__input-wrapper');
    var errorElement = document.createElement('p');
    errorElement.className = 'field__message field__message--error';
    errorElement.id = input.id + "_ErrorMessage";

    if (this.IsDefined(optionalText)) {
        errorElement.innerText = optionalText;
    }
    else {
        errorElement.innerText = "Enter a valid " + input.placeholder;
    }

    var existingErrorElement = document.getElementById(errorElement.id);

    if (this.IsDefined(container)) {
        if (existingErrorElement == null) {
            container.insertBefore(errorElement, input.nextSibling);
        }
        else {
            existingErrorElement.innerText = errorElement.innerText;
        }

        container.classList.add('field--error');
    }

}

GEShopifyCheckout.prototype.RemoveMessageBasedOnElement = function (input) {
    try {
        var container = input.closest('.field__input-wrapper');
        container.classList.remove('field--error');
    }
    catch (ex) { }
}

GEShopifyCheckout.prototype.AddTnCConsentToForm = function (form) {
    if (this.termsAndConditionsInformation.IsTnCConsentEnabled) {
        GESHOP.InjectAdditionalParams(form, "TnCConsent", true);
    }
}

GEShopifyCheckout.prototype.DisplayTnCConsentError = function (state) {
    var errorElement = document.querySelector('.glbe-consent-error');
    if (this.IsDefined(errorElement)) {
        errorElement.hidden = !state;
    }
}

GEShopifyCheckout.prototype.IsTnCConsentVisible = function (state) {
    var response = false;
    var errorElement = document.querySelector('.glbe-consent-error');
    if (this.IsDefined(errorElement)) {
        response = !errorElement.hidden;
    }

    return response;
}

GEShopifyCheckout.prototype.CheckoutLinkOnClick = function (event) {
    event.preventDefault();
    var linkElement = event.target;
    var openInNewWindow = linkElement.dataset.openNewWindow.toLowerCase() === "true";
    var link = linkElement.dataset.link;

    //report to GA
    ShopifyGALogger?.ReportLinkClicked("CheckoutLink", linkElement.innerText);


    if (openInNewWindow) {
        window.open(link);
    }
    else {
        this.OpenWindowPopup(link);
    }
}

GEShopifyCheckout.prototype.DisplayTermsAndConditionIntervalHandler = function (clearIntervalCallback) {
    var self = this;
    var clearInterval = false;

    self.termsAndConditionIntervalCount += 1;

    if (this.CanInjectTermsAndConditions() || self.termsAndConditionIntervalCount > self.maximumIntervalAmounts) {
        clearInterval = true;
    }

    if (clearInterval) {
        self.UpdateTermsAndCondition();
        clearIntervalCallback();
    }
}

GEShopifyCheckout.prototype.DisplayTaxMessageIntervalHandler = function (clearIntervalCallback) {
    var self = this;
    var clearInterval = false;

    self.taxMessageIntervalCount += 1;

    if (this.CanInjectTaxMessage() || self.taxMessageIntervalCount > self.maximumIntervalAmounts) {
        clearInterval = true;
    }

    if (clearInterval) {
        self.UpdateTaxMessage();
        clearIntervalCallback();
    }
}

GEShopifyCheckout.prototype.RegisterShippingOptionsEventListeners = function (clearIntervalCallback) {
    var self = this;
    var clearInterval = false;

    self.shippingMethodsIntervalCount += 1;

    document.querySelectorAll('[data-shipping-methods] input').forEach(item => {
        clearInterval = true;
        item.addEventListener('change', event => {
            var taxMessage = document.querySelector(".ge-tax-message-container");
            if(self.IsDefined(taxMessage))
            {
                taxMessage.innerHTML = "";
            }
            self.UpdateTaxMessage();
        });
    });

    if (self.shippingMethodsIntervalCount > self.maximumIntervalAmounts) {
        clearInterval = true;
    }

    if (clearInterval) {
        self.UpdateTaxMessage();
        self.DisplayShippingMethodsNotes();
        clearIntervalCallback();
    }
}

GEShopifyCheckout.prototype.RegisterPrepayDutiesOptionsEventListeners = function (clearIntervalCallback) {
    var self = this;
    var clearInterval = false;

    self.dutiesAndTaxesIntervalCount += 1;

    document.querySelectorAll('[data-duties-options] input').forEach(item => {
        clearInterval = true;
        item.addEventListener('change', event => {
            self.UpdateTaxMessage();
        });
    });

    if (self.dutiesAndTaxesIntervalCount > self.maximumIntervalAmounts) {
        clearInterval = true;
    }

    if (clearInterval) {
        self.UpdateTaxMessage();
        clearIntervalCallback();
    }
}

//This action is the JSON callback function, it is invoked from the JSONP script at the end point InitRaygunScript
GEShopifyCheckout.prototype.OnInitRaygunScript = function (obj) {
    if (this.IsDefined(obj)) {

        // Better to load it first for it report us if other scripts throw un cought errors
        if (this.IsDefined(obj.rayGunScript) && obj.rayGunScript != null) {
             try {
                  var scriptsArray = obj.rayGunScript.split('<script').slice(1).map(x => "<script"+x);
                  scriptsArray.forEach(function (script) {
                      // Remove the scripts tags from string
                      // Handle diffrent <script prefixes.
                      script = script.replace(script.substring(script.indexOf('<script'), script.indexOf('>') + 1), '');
                      script = script.replace('</script>', '');
                      // Inject the script body to script html tag and to the head.
                      GEShopifyCheckout.prototype.LoadIntegrationScript(script);
                  });
             } 
             catch(ex){
                 this.Log(this.LogTypes.Exception, "Error in loading Raygun script.");
             }
        }
    }
}

//This action is the JSON callback function, it is invoked from the JSONP script at the end
//of the server processing and renders the html returned from the server into the page.
GEShopifyCheckout.prototype.OnAdditionalDataIntiated = function (obj) {
    var self = this;

    if (this.IsDefined(obj) && (!obj.useShopifyPickUpDeliveryMethod || !this.ShouldUseShopifyCheckout())) {
        if (obj.enableClientLogs != null) {
            this.clientLogsEnabled = obj.enableClientLogs;
        }

        if (this.IsDefined(obj.dutiesAndTaxesInformation))
            this.dutiesAndTaxesInformation = obj.dutiesAndTaxesInformation;
        

        if (this.IsDefined(obj.taxMessageInformation)) {
            this.SetTaxMessageInformation(obj.taxMessageInformation);
            this.UpdateTaxMessage();
        }

        if (this.IsDefined(obj.termsAndConditionData)) {
            this.SetTermsAndConditionInformation(obj.termsAndConditionData);
            this.UpdateTermsAndCondition();
        }

        if (this.IsDefined(obj.customValidations)) {
            this.customValidations = obj.customValidations;
        }

        if (this.IsDefined(obj.merchantValidationRegexSettings)) {
            this.merchantValidationRegexSettings = obj.merchantValidationRegexSettings;
            this.RegisterInputValidations();
        }

        if (obj.genericErrorMessageOnPaymentFailed != null) {
            this.SetPaymentError(obj.genericErrorMessageOnPaymentFailed, this.PaymentErrorTypes.DefaultError);
        }

        if (obj.oosMessageOnPaymentFailed != null) {
            this.SetPaymentError(obj.oosMessageOnPaymentFailed, this.PaymentErrorTypes.OOSError);
        }

        if (this.IsDefined(obj.marketingOffersInformation)) {
            this.SetMarketingOffersInformation(obj.marketingOffersInformation);
        }

        //If Shopify decline message appears on the page, we need to show it
        this.SetDeclineMessageIfNeeded();

        var previousStepApplyValidation = sessionStorage.getItem("GEApplyContactInformationValidation");
        if (!obj.isValidContactInformationCheckoutFields && this.IsDefined(obj.redirectUrl)) {
            this.Log(this.LogTypes.Info, "Invalid Contact Information Checkout Fields");
            sessionStorage.setItem("GEApplyContactInformationValidation", true);

            if (!this.IsInformationStep()) {
                this.Log(this.LogTypes.Info, "Invalid Contact Information Checkout Fields - redirect to contact_information step")
                location.href = obj.redirectUrl;
            }
        }
        else if (this.IsPaymentStep()) {
            sessionStorage.setItem("GEApplyContactInformationValidation", false);
        }

        if (this.IsInformationStep() && previousStepApplyValidation != null && previousStepApplyValidation) {
            this.Log(this.LogTypes.Info, "Invalid Contact Information Checkout Fields - trigger glbeContinueToShippingButton click event")
            this.ValidateCustomerInformationFields();
        }

        try {
            if (this.IsDefined(obj.googleAnalyticsSettings) && this.IsDefined(ShopifyGALogger)) {
                ShopifyGALogger(obj.googleAnalyticsSettings, this.parameters);
            }
        } catch (ex) { }


        if (this.IsDefined(obj.cultureSelector) && obj.cultureSelector != null) {
            this.AddCultureSelector(obj.cultureSelector);
        }

        if (this.IsDefined(obj.heapIntegrationScript) && obj.heapIntegrationScript != null) {
            var script = obj.heapIntegrationScript;
            script = script.replace('<script type="text/javascript">', '');
            script = script.replace('</script>', '');
            this.LoadIntegrationScript(script);
            this.InitHeapAnalytics();
        }
        if (this.IsDefined(obj.fullStoryIntegrationScript) && obj.fullStoryIntegrationScript != null) {
            var script = obj.fullStoryIntegrationScript;
            script = script.replace('<script>', '');
            script = script.replace('</script>', '');
            this.LoadIntegrationScript(script);
            this.InitFullStoryAnalytics(obj.merchantName);
        }
        
        if (this.IsShippingStep()) {
            this.enableDisplayNoteForShippingMethods = obj.enableDisplayNoteForShippingMethods;
            this.intervalForGetShippingOptions = parseInt(obj.intervalForGetShippingOptions) * 1000;

            if (this.IsDefined(obj.shippingMethods) && obj.shippingMethods != null) {
                this.shippingMethodsData = obj.shippingMethods.ShopifyShippingMethodOptions;
                this.DisplayShippingMethodsNotes();
            } else if (this.enableDisplayNoteForShippingMethods) {
                setTimeout(function () {
                    self.GetShippingMethodsDataFromCache();
                }, this.intervalForGetShippingOptions);
            }
        }

        if (this.IsDefined(obj.useClientSideFixer) && obj.useClientSideFixer) {
            if (this.IsConfirmationStep() || _geFixer.IsOOSScenario()) {
                _geFixer.RemoveCookieIfNeeded(true);
                this.Log(this.LogTypes.Info, "Client-Side Fixer diasbled!");        
            }

            this.UseClientSideFixer = true;
            this.Log(this.LogTypes.Info, "GEFixer UseClientSideFixer set to true");

            // Check if we are in payment step and if the merchant works with client side fixer
            if (this.IsPaymentStep() || this.IsShippingStep()) {
                this.StartClientSideFixer();
                this.Log(this.LogTypes.Info, "GEFixer Client-Side Fixer enabled!!!");
            }
        }

        if (this.IsDefined(obj.oosScenarioQueryParam)) {
            GESHOP.OOSScenarioQueryParam = obj.oosScenarioQueryParam;
        }
        if (this.IsDefined(obj.shopifyPercentageAmountChangeValue)) {
            GESHOP.MaxAmountPercentageChange = obj.shopifyPercentageAmountChangeValue;
        }

        if (Shopify.Checkout.step == "thank_you") {
            sessionStorage.removeItem("GEApplyContactInformationValidation");
            if (this.IsDefined(obj.fullStoryIntegrationScript)) {
                this.GetFullStoryOrderCompletedData();
            }
        }

        if (this.IsDefined(obj.invokeDataOnCountryChanged) && obj.invokeDataOnCountryChanged) {
            this.InvokeDataOnCountryChanged = obj.invokeDataOnCountryChanged;
        }

        this.WriteGARaffleOrderEvents();
    }
    else {
        // error
        if (typeof GESHOP != "undefined" && GESHOP != null) {
            GESHOP.Log(GESHOP.LogTypes.Info, "OnAdditionalDataIntiated error");
        }
    }
}

GEShopifyCheckout.prototype.OnAdditionalDataPopupIntiated = function (obj) {
    var self = this;

    if (self.additionalPopupData.additionalModalOpened == false) {
        self.additionalPopupData.additionalModalOpened = true;
        GESHOP.ShowPostPaymentLoading(false);
        this.ShowModalPopup({
            content: obj.html,
            okButtonText: 'Ok',
            cancelButtonText: 'Cancel',
            showOK: false,
            showCancel: true,
            onOk: function () {

            },
            onCancel: function (modal) {
                self.additionalPopupData.additionalModalOpened = false;
                if (self.paymentProcessPollStopped == false) {
                    self.TimeFnished(self.additionalPopupData.timerPooling);
                    if (typeof GESHOP != "undefined" && GESHOP != null) {
                        GESHOP.ShowPostPaymentLoading(false);
                    }
                }
                self.paymentProcessPollStopped = true;
                if (modal != undefined) {
                    modal.destroy();
                }
            },
            onCloseModal: function (modal) {
                self.additionalPopupData.additionalModalOpened = false;
                if (self.paymentProcessPollStopped == false) {
                    self.TimeFnished(self.additionalPopupData.timerPooling);
                    if (typeof GESHOP != "undefined" && GESHOP != null) {
                        GESHOP.ShowPostPaymentLoading(false);
                    }
                }
                self.paymentProcessPollStopped = true;
                if (modal != undefined) {
                    modal.destroy();
                }
            },
            onOpenModal: function () {
                self.additionalPopupData.additionalModalOpened = true;
                var duration = document.getElementById('duration');
                self.AdditionalDataErrorMessage = document.getElementById('popuperrormessage');
                self.paymentProcessPollStopped = false;
                self.StartTimer(parseInt(duration.innerText) * 60);
                self.PaymentProcessPoll(self.checkoutId);
            }
        });
    }
}

GEShopifyCheckout.prototype.DisplayQRCode = function (qrCodeImg) {
    try {
        var qrCodeSettings = JSON.parse(document.getElementById('qrCodeSettings').innerText);
        qrCodeSettings.text = qrCodeImg;
        new QRCode(document.getElementById('qrCodeDiv'), qrCodeSettings);
    }
    catch (ex) {
        this.Log(this.LogTypes.Exception, "Display QrCode failed.");
    }
}

GEShopifyCheckout.prototype.StartTimer = function (duration) {
    var self = this;
    var timer = duration, minutes, seconds;

    if (self.additionalPopupData.qrCodeImg != null) {
        self.DisplayQRCode(self.additionalPopupData.qrCodeImg);
    }

    self.additionalPopupData.timerPooling = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        var display = document.getElementById('time');
        display.innerHTML = minutes + ":" + seconds;

        if (--timer < 0) {
            timer = duration;

        }
        if (minutes == 0 && seconds == 0) {
            self.isCancelation = true;

            self.LoadScript(self.parameters.environment + '/platforms/shopify/checkout/canceltransaction/' +
                self.checkoutId + '/' +
                self.parameters.merchantId);
            self.TimeFnished(self.additionalPopupData.timerPooling);
        }
    }, 1000);
}

GEShopifyCheckout.prototype.TimeFnished = function (interval) {
    if (typeof GESHOP != "undefined" && GESHOP != null) {
        GESHOP.ShowPostPaymentLoading(true);
    }

    var self = this;
    self.additionalPopupData.additionalModalOpened = false;
    self.paymentProcessPollStopped = true;
    clearInterval(interval);
    document.querySelector(".tingle-modal__close").click();
    self.DisableCompleteOrderButton(false);
}

GEShopifyCheckout.prototype.PaymentProcessPoll = function (checkoutId) {
    var self = this;
    var poolingInterval = document.getElementById('poolinginterval');
    if (self.paymentProcessPollStopped) return;
    this.LoadScript(self.parameters.environment + '/platforms/shopify/checkout/checktransactionstatus/' +
        self.checkoutId + '/' +
        self.parameters.merchantId);

    setTimeout(function () {
        self.PaymentProcessPoll(checkoutId);
    }, parseInt(poolingInterval.innerText) * 1000);

}

GEShopifyCheckout.prototype.OnCancelTransactionInitiated = function (obj) {

    var self = this;
    if (obj.IsSuccess) {
        var errormessage = document.getElementById('popuperrormessage');

        var errorObj = {
            errors: [
                {
                    Error: self.AdditionalDataErrorMessage.innerText,
                    Description: ""
                }
            ]
        };

        if (typeof GESHOP != "undefined" && GESHOP != null) {
            GESHOP.ShowErrorMessage(errorObj);
            // alert(errormessage.innerText);
        }
    }
}


GEShopifyCheckout.prototype.OnTransactionStatusChecked = function (obj) {

    var self = this;
    if (obj.StatusChanged) {
        if (typeof GESHOP != "undefined" && GESHOP != null) {
            GESHOP.Log(GESHOP.LogTypes.Info, "OnTransactionStatusChecked IsAuthorized = " + obj.IsAuthorized);
        }
        if (obj.IsAuthorized) {
            self.additionalPopupData.isTransactionAuthorized = true;
            self.TimeFnished(self.additionalPopupData.timerPooling);
            _geFixer.SetOriginalButtonClickedState();
            self.originalShopifyButton.click();
        } else {
            this.LoadScript(self.parameters.environment + '/platforms/shopify/checkout/canceltransaction/' +
                self.checkoutId + '/' +
                self.parameters.merchantId);
            self.TimeFnished(self.additionalPopupData.timerPooling);
        }
    }
}


GEShopifyCheckout.prototype.AddCultureSelector = function (cultureSelectorModel) {
    try {
        if (Shopify.Checkout.step == "contact_information") {
            var self = this;
            // need to inject culture selector in two places
            var element = self.GetElementFromHTML(cultureSelectorModel);
            var originalClassName = element.className;
            var container = document.querySelector('.main__header');
            var displayedCulture = self.parameters.cultureCode;

            if (this.IsDefined(container) && container != null) {
                element.className += " shown-on-desktop";
                var alreadyAdded = container.querySelector('.ge-culture-container.shown-on-desktop');
                if (!alreadyAdded) {
                    container.insertBefore(element, container.firstChild);
                }
            }

            var container = document.querySelector('.banner .wrap');
            if (this.IsDefined(container) && container != null) {
                var copyElement = element.cloneNode(true);
                copyElement.className = originalClassName + " hidden-on-desktop";
                var alreadyAdded = container.querySelector('.ge-culture-container.hidden-on-desktop');
                if (!alreadyAdded) {
                    container.insertBefore(copyElement, container.firstChild);
                }
            }

            self.RegisterCultureSelectorEventListener();
        }
    }
    catch (ex) {
        this.Log(this.LogTypes.Exception, "AddCultureSelector was failed.");
    }
}

GEShopifyCheckout.prototype.RegisterCultureSelectorEventListener = function () {
    try {
        var cultureSelectors = document.querySelectorAll('.ge-culture-selector');
        if (cultureSelectors != null) {
            cultureSelectors.forEach(function (cultureSelector) {
                cultureSelector.addEventListener("change", function (event) {
                    var selectedCulture = event.target[event.target.selectedIndex];
                    var cultureCode = selectedCulture.dataset.culture;

                    if ('URLSearchParams' in window) {
                        var searchParams = new URLSearchParams(window.location.search);
                        searchParams.set("locale", cultureCode);
                        window.location.search = searchParams.toString();
                    }
                });
            });
        }
    }
    catch (ex) {
        this.Log(this.LogTypes.Exception, "RegisterCultureSelectorEventListener got error");
    }
}

GEShopifyCheckout.prototype.InterceptContinueToShippingButton = function () {
    var self = this;
    if (Shopify.Checkout.step == "contact_information") {

        var searchSymbol = self.ContinueToShippingButton.IdentifierType == 1 ? "#" : ".";
        self.originalShopifyButton = document.querySelector(searchSymbol + self.ContinueToShippingButton.ElementIdentifier);

        if (self.originalShopifyButton != null) {

            self.glbeContinueToShippingButton = self.originalShopifyButton.cloneNode(true);
            self.glbeContinueToShippingButton.setAttribute("type", "button");
            self.glbeContinueToShippingButton.setAttribute("is-glbe-custom", "true");
            self.glbeContinueToShippingButton.setAttribute("id", "continue_button_1");
            //hide shopify button
            self.originalShopifyButton.style.display = "none";

            //replace elements
            self.originalShopifyButton.parentNode.insertBefore(self.glbeContinueToShippingButton, self.originalShopifyButton);

            // apply maxlen attr
            var inputs = document.querySelectorAll('input.field__input:not(#checkout_email_or_phone, #checkout_email, #checkout_reduction_code)');
            inputs.forEach(function (input) {
                if (self.IsInputVisible(input)) {
                    try {
                        var valobj = self.merchantValidationRegexSettings.FieldValidationConfig.fieldvalidations[input.id];
                         if (valobj != undefined) {
                             input.setAttribute("maxlength", valobj["maxlen"]);
                         }
                    }
                    catch (e) {
                        self.Log(self.LogTypes.Exception, "InterceptContinueToShippingButton was failed. maxlen attr " + e);
                    }

                    if (self.IsDefined(self.merchantValidationRegexSettings.AllowedCharsRegex) &&
                        self.IsDefined(self.merchantValidationRegexSettings.CharsRegexToReplace)) {
                        input.addEventListener('blur', function (e) {
                            self.OnInputBlur({
                                allow: new RegExp(self.merchantValidationRegexSettings.AllowedCharsRegex),
                                toReplace: new RegExp(self.merchantValidationRegexSettings.CharsRegexToReplace),
                                toConvert: self.merchantValidationRegexSettings.CharsToConvertMap,
                                nonEnglishMessage: self.merchantValidationRegexSettings.NonEnglishMessage,
                                replaceMessage: self.merchantValidationRegexSettings.NonEnglishCharactersReplacedMessage,
                                input: input
                            });
                        });
                    }
                }
            });


            //set global-e button action
            self.glbeContinueToShippingButton.onclick = function () {
                if (typeof GESHOP != "undefined" && GESHOP != null) {
                    GESHOP.Log(GESHOP.LogTypes.Info, "ContinueToShippingButton clicked.");
                }
                // validate fields
                var inputs = document.querySelectorAll('input.field__input:not(#checkout_email_or_phone, #checkout_email, #checkout_reduction_code)');
                var allValidationsPassedOk = true;
                inputs.forEach(function (input) {
                    if (self.IsInputVisible(input)) {
                        try {
                            //handle unsupported (special) characters
                            if (self.IsDefined(self.merchantValidationRegexSettings.AllowedCharsRegex) &&
                                self.IsDefined(self.merchantValidationRegexSettings.CharsRegexToReplace)) {
                                self.OnInputBlur({
                                    allow: new RegExp(self.merchantValidationRegexSettings.AllowedCharsRegex),
                                    toReplace: new RegExp(self.merchantValidationRegexSettings.CharsRegexToReplace),
                                    toConvert: self.merchantValidationRegexSettings.CharsToConvertMap,
                                    nonEnglishMessage: self.merchantValidationRegexSettings.NonEnglishMessage,
                                    replaceMessage: self.merchantValidationRegexSettings.NonEnglishCharactersReplacedMessage,
                                    input: input
                                });
                            }
                            
                            var valobj = self.merchantValidationRegexSettings.FieldValidationConfig.fieldvalidations[input.id];
                            if (valobj != undefined) {
                                var nonblankcontent = input.value != null && input.value != '';
                                if (!nonblankcontent && valobj.isrequired) {
                                    allValidationsPassedOk = false;
                                    self.AddMessageBasedOnElement(input, self.merchantValidationRegexSettings.FieldValidationConfig.errors['fieldrequirederrormessage']);
                                }

                                allValidationsPassedOk = self.ValidateAddressMaxLength(input, valobj, allValidationsPassedOk);

                                if (self.IsDefined(valobj.regex) && Array.isArray(valobj.regex) && nonblankcontent) {
                                    var errmsgs = self.merchantValidationRegexSettings.FieldValidationConfig.errors;
                                    var regexsettings = self.merchantValidationRegexSettings.FieldValidationConfig.regexsettings;
                                    var regexarr = valobj.regex;
                                    regexarr.forEach(function (regexname) {
                                        if (self.IsDefined(self.merchantValidationRegexSettings[regexname])) {
                                            var rx = regexname === 'POBoxRegex'
                                                ? new RegExp(self.merchantValidationRegexSettings[regexname], 'i')
                                                : new RegExp(self.merchantValidationRegexSettings[regexname]);
                                            
                                            var negateregex = regexsettings[regexname];
                                            var res = rx.test(input.value);
                                            res = negateregex ? !res : res;
                                            if (!res) {
                                                allValidationsPassedOk = false;
                                                errorMessage = errmsgs[regexname];
                                                self.AddMessageBasedOnElement(input, errorMessage);
                                            }
                                        }

                                    });

                                }
                            }   
                        }
                        catch (e) {
                            self.Log(self.LogTypes.Exception, "InterceptContinueToShippingButton was failed. glbeContinueToShippingButton.onclick - field validation failed for " + input.id + "; err:" + e);
                        }
                    }
                });

                // validate TnCConsent checkboxes
                var checkboxesAreChecked = self.ValidateTnCConsent();
                if (checkboxesAreChecked && (Shopify.Checkout.pickUpInStore || allValidationsPassedOk)) {
                    // continue with default SPY validation flow
                    if (typeof GESHOP != "undefined" && GESHOP != null) {
                        GESHOP.Log(GESHOP.LogTypes.Info, "OriginalShopifyButton.click.");
                    }
                    self.originalShopifyButton.click();
                }
                else {
                    //validation errors, push to GA
                    ShopifyGALogger?.ReportValidationError();
                }

                // get values for SaveCheckoutExtraData request
                var customerEmail = document.querySelector('#checkout_email')?.value;
                if (!customerEmail && self.marketingOffersInformation?.EmailValidationRegex) {
                    // If there is no value in the #checkout_email, the email value might be in the 
                    var emailOrPhone = document.querySelector('#checkout_email_or_phone')?.value;
                    var emailRegex = new RegExp(self.marketingOffersInformation.EmailValidationRegex);
                    if (emailRegex.test(emailOrPhone)) {
                        customerEmail = emailOrPhone;
                    }
                }

                if (self.IsDefined(customerEmail)) { // don't send this request if we don't have the email
                    var tncConsent = checkboxesAreChecked;
                    var customerAcceptsGlobaleEmails = document.querySelector('#checkout_buyer_accepts_globale_emails')?.checked;

                    var saveCheckoutExtraDataUrl = self.parameters.environment + '/platforms/shopify/checkout/SaveCheckoutExtraData/' + self.parameters.merchantId;
                    var saveCheckoutExtraDataModel = {
                        CustomerEmail: customerEmail,
                        IsOptInToMailsFromGlobale: customerAcceptsGlobaleEmails,
                        TnCConcent: tncConsent
                    };

                    fetch(saveCheckoutExtraDataUrl, { // use fetch for this call to make POST request
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(saveCheckoutExtraDataModel)
                    });
                }
            }.bind(this);
        }
        else {
            //Shopify complete order button was not found
            self.Log(self.LogTypes.Exception, "Shopify ContinueToShipping button was not found for merchant id " + this.parameters.merchantId);
        }
    }
}

GEShopifyCheckout.prototype.ValidateCustomerInformationFields = function () {
    var self = this;
    var inputs = document.querySelectorAll('input.field__input:not(#checkout_email_or_phone, #checkout_email, #checkout_reduction_code)');
    var allValidationsPassedOk = true;
    inputs.forEach(function (input) {
        if (self.IsInputVisible(input)) {
            try {
                var valobj = self.merchantValidationRegexSettings.FieldValidationConfig.fieldvalidations[input.id];
                if (valobj != undefined) {
                    // CORE - 41816 - if only digital products in cart no shipping section just billing
                    if (valobj == null && input.id === 'checkout_billing_address_phone') {
                        var valobj = self.merchantValidationRegexSettings.FieldValidationConfig.fieldvalidations['checkout_shipping_address_phone'];
                    }

                     allValidationsPassedOk = self.ValidateAddressMaxLength(input, valobj, allValidationsPassedOk);

                    var nonblankcontent = input.value != null && input.value != '';
                    if (!nonblankcontent && valobj.isrequired) {
                        allValidationsPassedOk = false;
                        self.AddMessageBasedOnElement(input, self.merchantValidationRegexSettings.FieldValidationConfig.errors['fieldrequirederrormessage']);
                    }
                    if (self.IsDefined(valobj.regex) && Array.isArray(valobj.regex) && nonblankcontent) {
                        var errmsgs = self.merchantValidationRegexSettings.FieldValidationConfig.errors;
                        var regexsettings = self.merchantValidationRegexSettings.FieldValidationConfig.regexsettings;
                        var regexarr = valobj.regex;
                        regexarr.forEach(function (regexname) {
                            if (self.IsDefined(self.merchantValidationRegexSettings[regexname])) {
                                var rx = regexname === 'POBoxRegex'
                                    ? new RegExp(self.merchantValidationRegexSettings[regexname], 'i')
                                    : new RegExp(self.merchantValidationRegexSettings[regexname]);

                                var negateregex = regexsettings[regexname];
                                var res = rx.test(input.value);
                                res = negateregex ? !res : res;
                                if (!res) {
                                    allValidationsPassedOk = false;
                                    errorMessage = errmsgs[regexname];
                                    self.AddMessageBasedOnElement(input, errorMessage);
                                }
                            }
                        });
                    }
                }                
            }
            catch (e) {
                self.Log(self.LogTypes.Exception, "InterceptContinueToShippingButton was failed. glbeContinueToShippingButton.onclick - field validation failed for " + input.id + "; err:" + e);
            }
        }
    });

    return allValidationsPassedOk;
};

// Validate the max length of given input and show error message if needed
GEShopifyCheckout.prototype.ValidateAddressMaxLength = function (input, valobj, allValidationsPassedOk) {
    var self = this;
    try 
    {
      if (valobj != null && valobj.maxlen != null) {
          if (input.value.length > valobj.maxlen) {
              allValidationsPassedOk = false;
              self.AddMessageBasedOnElement(input, self.merchantValidationRegexSettings.FieldValidationConfig.maxLengthErrors[input.id]);
          }
      }
     
      return allValidationsPassedOk;
    }
    catch
    {
      self.Log(self.LogTypes.Exception, "[CHECKOUT TEAM] ValidateAddressMaxLength was failed. field validation failed for " + input.id + "; err:" + e);
      return allValidationsPassedOk;
    }
}

GEShopifyCheckout.prototype.RegisterInputValidations = function () {
    var self = this;
    try {
        if (Shopify.Checkout.step == "contact_information") {

            var enableShopifyClientValidationOnSubmit = self.IsDefined(self.merchantValidationRegexSettings) && self.IsDefined(self.merchantValidationRegexSettings.FieldValidationConfig);
            try {
                if (enableShopifyClientValidationOnSubmit) {
                    // we get FieldValidationConfig as string JSON so need to parse it to object
                    // in case of attempt to load this function again we have to make sure we are not trying to parse it again
                    if (typeof (self.merchantValidationRegexSettings.FieldValidationConfig) === 'string') {
                        self.merchantValidationRegexSettings.FieldValidationConfig = JSON.parse(self.merchantValidationRegexSettings.FieldValidationConfig);
                    }

                    self.ContinueToShippingButton = self.merchantValidationRegexSettings.FieldValidationConfig.continuetoshippingbutton;
                }
            } catch (e) {
                enableShopifyClientValidationOnSubmit = false;
            }

            if (enableShopifyClientValidationOnSubmit) {
                self.InterceptContinueToShippingButton();
            }
        }
    }
    catch (ex) {
        this.Log(this.LogTypes.Exception, "RegisterInputValidations was failed. " + ex + ".");
    }
}

GEShopifyCheckout.prototype.IsInputVisible = function (input) {
    var response = true;

    if (!this.IsDefined(input)) {
        response = false;
    }
    else {
        var inputWrapper = input.closest('.field');
        if (this.IsDefined(inputWrapper)) {
            if (inputWrapper.classList.contains('hidden')) {
                response = false;
            }
            else {
                response = true;
            }
        }
        else {
            response = false;
        }
    }

    return response;
};

GEShopifyCheckout.prototype.OnInputBlur = function (data) {
    try {
        if (!data.allow.test(data.input.value)) {
            // if the input contains unsupported (special) characters, try firstly to
            // convert them into Latin counterparts. And then do validation again.
            if (data.toConvert) {
                try {
                    var isConverted = false;
                    var charsMap = JSON.parse(data.toConvert);
                    var text = data.input.value;
                    var response = this.ReplaceUnsupportedChars(text, charsMap);
                    isConverted = response.isConverted;
                    text = response.output;
                    if (isConverted) {
                        data.input.value = text;
                        if (data.replaceMessage) {
                            this.AddMessageBasedOnElement(data.input, data.replaceMessage);
                            ShopifyGALogger?.ReportValidationError();
                        }
                    }

                } catch (e) {
                    this.Log(this.LogTypes.Exception, "OnInputBlur - converting unsupported characters was failed. " + e + ".");
                }
            }

            if (!data.allow.test(data.input.value)) {
                var valueBeforeRemove = data.input.value;
                data.input.value = this.RemoveUnsupportedCharacters(data.input.value, data.toReplace);

                if (valueBeforeRemove !== data.input.value) {
                    errorMessage = data.nonEnglishMessage;
                    this.AddMessageBasedOnElement(data.input, errorMessage);
                    ShopifyGALogger?.ReportValidationError();
                }
            }
        }
        else {
            //ok
            this.RemoveMessageBasedOnElement(data.input);
        }
    }
    catch (ex) {
        this.Log(this.LogTypes.Exception, "OnInputBlur was failed. " + ex + ".");
    }
};

GEShopifyCheckout.prototype.ReplaceUnsupportedChars = function (text, charsMapToConvert) {
    var isConverted = false;
    for (var i = 0; i < text.length; i++) {
        var c = text.charAt(i);
        if (charsMapToConvert.hasOwnProperty(c)) {
            var val = charsMapToConvert[c];
            text = text.replace(new RegExp(c, 'g'), val);
            isConverted = true;
        }
    }

    return { isConverted: isConverted, output: text };
}

GEShopifyCheckout.prototype.RemoveUnsupportedCharacters = function (text, regex) {
    var response = text;

    do {
        beforeIterationText = response;
        response = beforeIterationText.replace(regex, '');
    }
    while (beforeIterationText != response)

    return response;
}

GEShopifyCheckout.prototype.GetSelectedShippingOptionData = function () {
    var response = null;
    var selectedShippingOption = null;
    this.shippingOptionsInputs = document.querySelectorAll("[data-shipping-methods] .input-radio");

    this.shippingOptionsInputs.forEach(function (shippingOptionInput) {
        if (shippingOptionInput.checked) {
            response = shippingOptionInput.value;
            selectedShippingOption = shippingOptionInput;
        }
    });

    if (response == null) {
        response = this.GetSelectedShippingMethodDataFromSessionStorage();
    }

    if (response) {
        this.UpdateSelectedShippingMethodDataInSessionStorage(response);
        this.selectedShippingOption = selectedShippingOption;
    }

    return response;
}

GEShopifyCheckout.prototype.GetIsPrepayDutiesSelected = function () {
    var response = null;
    var prepapayDutiesInputs = document.querySelectorAll("[data-duties-options] .input-radio");

    prepapayDutiesInputs.forEach(function (prepayDutiesInput) {
        if (prepayDutiesInput.checked) {
            if (prepayDutiesInput.dataset.buyerRefusesDuties.toLowerCase() === 'true') {
                response = false;
            }
            else {
                response = true;
            }
        }
    });

    if (response == null) {
        response = this.GetIsPrepayDutiesSelectedFromSessionStorage();
    }

    if (response == null) {
        response = false;
    }

    this.UpdateIsPrepayDutiesSelectedFromSessionStorage(response);

    return response;
}

GEShopifyCheckout.prototype.UpdateSelectedShippingMethodDataInSessionStorage = function (data) {
    sessionStorage.setItem("GESelectedShippingMethodData", data);
}

GEShopifyCheckout.prototype.GetSelectedShippingMethodDataFromSessionStorage = function () {
    return sessionStorage.getItem("GESelectedShippingMethodData");
}

GEShopifyCheckout.prototype.UpdateIsPrepayDutiesSelectedFromSessionStorage = function (data) {
    sessionStorage.setItem("GEIsPrepayDutiesSelected", data);
}

GEShopifyCheckout.prototype.GetIsPrepayDutiesSelectedFromSessionStorage = function () {
    var response = false;
    var valueFromSessionStorage = sessionStorage.getItem("GEIsPrepayDutiesSelected");

    if (this.IsDefined(valueFromSessionStorage)) {
        response = valueFromSessionStorage.toLowerCase() == 'true';
    }

    return response;
}



GEShopifyCheckout.prototype.GetTotalAmount = function () {
    var response = null;

    var totalPriceElement = document.querySelector("[data-checkout-payment-due-target]");
    if (this.IsDefined(totalPriceElement) && this.IsDefined(totalPriceElement.dataset.checkoutPaymentDueTarget)) {
        response = parseInt(totalPriceElement.dataset.checkoutPaymentDueTarget);
    }

    return response;
}

GEShopifyCheckout.prototype.UpdateTaxMessage = function () {
    var self = this;

    if (Shopify.Checkout.step != "contact_information") {
        try {
            var taxMessage = self.GetTaxMessage();
            if (self.IsDefined(taxMessage)) {
                var container = document.querySelector(self.taxMessagesInformation.TaxMessageElementToInject);

                if (self.IsDefined(container)) {
                    var taxMessagHtmlElement = self.GetElementFromHTML(taxMessage);
                    if (self.IsDefined(taxMessagHtmlElement)) {
                        // check if message already exist, if yes we have to update it, else inject it
                        var classNameForQuery = this.GetClassNameQueryStringFromExistingObject(taxMessagHtmlElement);
                        var existingMessages = document.querySelectorAll(classNameForQuery);
                        if (existingMessages.length > 0) {
                            existingMessages.forEach(function (messageElement) {
                                messageElement.innerHTML = taxMessagHtmlElement.innerHTML;
                            });
                        }
                        else {
                            container.lastChild.parentNode.insertBefore(taxMessagHtmlElement, container.lastChild.nextSibling);
                        }
                    }
                }
            }
        }
        catch (ex) {
            this.Log(this.LogTypes.Exception, "UpdateTaxMessage was failed. " + ex + ".");
        }
    }

    self.UpdateDutiesAndTaxesTotals();
}

//We hide elements with style.display = "none". 'hidden' class is not used because Shopify or another code operates
//with it and can add / remove 'hidden' class independently from this code.
GEShopifyCheckout.prototype.UpdateDutiesAndTaxesTotals = function () {
    var self = this;
    try {
        if (self.IsDefined(self.dutiesAndTaxesInformation)) {
            var dutiesAndTaxes = null;
            var duties = null;
            var taxes = null;
            var dutiesStringNumberContainer = null;
            var dutiesVal = null;
            var dutiesText = null;
            var dutiesQuestionMark = null;
            var taxesStringNumberContainer = null;
            var taxesVal = null;
            var dutiesAndTaxesQuestionMark = null;

            var container = document.querySelector(self.dutiesAndTaxesInformation.ElementToInject); //total-line-table__tbody
            if (self.IsDefined(container)) {
                dutiesAndTaxes = container.querySelector("[data-checkout-duties-error-target]");
                duties = container.querySelector("[data-checkout-duties-target]");
                taxes = container.querySelector("[data-checkout-taxes-target]");
                if (self.IsDefined(duties)) {
                    dutiesStringNumberContainer = duties.querySelector("[data-checkout-total-duties-target]");
                    if (self.IsDefined(dutiesStringNumberContainer)) {
                        dutiesVal = Number(dutiesStringNumberContainer.textContent.replace(/[^0-9.-]+/g, ""));
                    }
                    dutiesText = duties.querySelector(".total-line__name");
                    dutiesQuestionMark = duties.querySelector("#duties-tooltip");
                }
                if (self.IsDefined(taxes)) {
                    taxesStringNumberContainer = taxes.querySelector("[data-checkout-total-taxes-target]");
                    if (self.IsDefined(taxesStringNumberContainer)) {
                        taxesVal = Number(taxesStringNumberContainer.textContent.replace(/[^0-9.-]+/g, ""));
                    }
                }
                if (self.IsDefined(dutiesAndTaxes)) {
                    dutiesAndTaxesQuestionMark = dutiesAndTaxes.querySelector("#duties-error-tooltip");
                }


                var zeroVal = Number(0);

                if (self.dutiesAndTaxesInformation.HideDuties
                    && self.IsDefined(duties)) {
                    duties.style.display = "none";
                }
                else if (self.dutiesAndTaxesInformation.IsPartial
                    && !self.dutiesAndTaxesInformation.HasDuties
                    && self.IsDefined(dutiesStringNumberContainer)
                    && self.IsDefined(dutiesVal)
                    && dutiesVal == zeroVal
                    && self.IsDefined(duties)) {
                    duties.style.display = "none";
                }
                else {
                    //Change the text of the Duties element
                    if (self.IsDefined(dutiesText))
                        dutiesText.firstChild.data = self.dutiesAndTaxesInformation.DutiesText;

                    //Hide question mark for Duties;
                    if (self.IsDefined(dutiesQuestionMark))
                        dutiesQuestionMark.style.display = "none";
                }

                if (self.dutiesAndTaxesInformation.HideTaxes
                    && self.IsDefined(taxes)) {
                    taxes.style.display = "none";
                } else if (self.dutiesAndTaxesInformation.IsPartial
                    && !self.dutiesAndTaxesInformation.HasTaxes
                    && self.IsDefined(taxesStringNumberContainer)
                    && self.IsDefined(taxesVal)
                    && taxesVal == zeroVal
                    && self.IsDefined(taxes)) {
                    taxes.style.display = "none";
                }

                if (self.dutiesAndTaxesInformation.HideDuties &&
                    self.dutiesAndTaxesInformation.HideTaxes &&
                    self.IsDefined(dutiesAndTaxes)) {
                    dutiesAndTaxes.style.display = "none";
                } else if (self.dutiesAndTaxesInformation.IsPartial
                    && !self.dutiesAndTaxesInformation.HasDuties
                    && !self.dutiesAndTaxesInformation.HasTaxes
                    && self.IsDefined(taxesStringNumberContainer)
                    && self.IsDefined(taxesVal)
                    && taxesVal == zeroVal
                    && self.IsDefined(dutiesStringNumberContainer)
                    && self.IsDefined(dutiesVal)
                    && dutiesVal == zeroVal
                    && self.IsDefined(dutiesAndTaxes)) {
                    dutiesAndTaxes.style.display = "none";
                }
                else {
                    //Hide question mark for DutiesAndTaxes;
                    if (self.IsDefined(dutiesAndTaxesQuestionMark))
                        dutiesAndTaxesQuestionMark.style.display = "none";
                }
            }
        }
    }
    catch (ex) {
        this.Log(this.LogTypes.Exception, "UpdateDutiesAndTaxesTotals was failed. " + ex + ".");
    }
}

GEShopifyCheckout.prototype.GetClassNameQueryStringFromExistingObject = function (obj) {
    if (this.IsDefined(obj)) {
        var classes = obj.className.split(/\s+(?=[a-z0-9])/i);
        return '.' + classes.join(".");
    }
}

GEShopifyCheckout.prototype.GetTermsAndConditionCheckoutStep = function () {
    return this.IsDefined(this.termsAndConditionsInformation) && this.IsDefined(this.termsAndConditionsInformation.StepName) ? this.termsAndConditionsInformation.StepName : "payment_method";
}

GEShopifyCheckout.prototype.UpdateTermsAndCondition = function () {
    if (Shopify.Checkout.step === this.GetTermsAndConditionCheckoutStep()) {
        if (this.IsDefined(this.termsAndConditionsInformation) &&
            this.IsDefined(this.termsAndConditionsInformation.Container) &&
            this.IsDefined(this.termsAndConditionsInformation.Layout)) {
            var container = document.querySelector(this.termsAndConditionsInformation.Container);
            if (this.IsDefined(container)) {
                var messageElement = this.GetElementFromHTML(this.termsAndConditionsInformation.Layout);
                if (this.IsDefined(messageElement)) {
                    // check if message already exist, if yes we have to update it, else inject it
                    var classForQuery = this.GetClassNameQueryStringFromExistingObject(messageElement);
                    var existingMessages = document.querySelectorAll(classForQuery);
                    if (existingMessages.length > 0) {
                        existingMessages.forEach(function (termsAndConditionElement) {
                            termsAndConditionElement.innerHTML = messageElement.innerHTML;
                        });
                    }
                    else {
                        container.parentNode.insertBefore(messageElement, container);
                    }

                    this.RegisterCheckoutLinksEventListeners();

                    if (this.IsDefined(this.termsAndConditionsInformation.IsTnCConsentEnabled)) {
                        this.RegisterTnCConsentEventListeners();
                    }
                }
            }
        }
    }
}

GEShopifyCheckout.prototype.CanInjectTermsAndConditions = function () {
    var response = false;

    if (Shopify.Checkout.step === 'payment_method') {
        if (this.IsDefined(this.termsAndConditionsInformation) &&
            this.IsDefined(this.termsAndConditionsInformation.Container) &&
            this.IsDefined(this.termsAndConditionsInformation.Layout)) {
            var container = document.querySelector(this.termsAndConditionsInformation.Container);
            if (this.IsDefined(container)) {
                response = true;
            }
        }
    }

    return response;
}

GEShopifyCheckout.prototype.CanInjectTaxMessage = function () {
    var self = this;
    var response = false;

    if (this.IsDefined(self.taxMessagesInformation) && this.IsDefined(self.taxMessagesInformation.TaxMessageElementToInject)) {
        var container = document.querySelector(self.taxMessagesInformation.TaxMessageElementToInject);
        if (self.IsDefined(container)) {
            response = true;
        }
    }

    return response;
}

GEShopifyCheckout.prototype.GetElementFromHTML = function (html) {
    var template = document.createElement('template');
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild;
}

GEShopifyCheckout.prototype.GetTaxMessage = function () {
    var self = this;
    var response = null;

    if (this.taxMessagesInformation) {
        var threshold = this.taxMessagesInformation.Threshold;
        var totalAmount = this.GetTotalAmount();
        var productAmount = this.GetProductsAmount();
        var selectedShippingOptionData = this.GetSelectedShippingOptionData();
        var isPrepayDutiesSelected = self.GetIsPrepayDutiesSelected();

        var isOverThreshold = totalAmount > threshold;
        if (this.IsDefined(selectedShippingOptionData)) {
            this.taxMessagesInformation.TaxMessageInformationNodes.forEach(function (taxMessage, index) {
                if (taxMessage.OrderValueThreshold || taxMessage.ItemsAmountThreshold) {
                    if (taxMessage.OrderValueThreshold) {
                        if (taxMessage.OrderValueThreshold < totalAmount) {
                            if (selectedShippingOptionData.indexOf(taxMessage.SupportedShippingMethodSuffix) != -1) {
                                response = taxMessage.Layout;
                            }
                        }
                    }
                    else if (taxMessage.ItemsAmountThreshold) {
                        if (taxMessage.ItemsAmountThreshold < productAmount) {
                            if (selectedShippingOptionData.indexOf(taxMessage.SupportedShippingMethodSuffix) != -1) {
                                response = taxMessage.Layout;
                            }
                        }
                    }
                }

                if (response == null) {
                    // check threshold
                    if (taxMessage.IsAboveThreshold == isOverThreshold) {
                        // check supported shipping option
                        if (selectedShippingOptionData.indexOf(taxMessage.SupportedShippingMethodSuffix) != -1) {
                            if (taxMessage.IsOptionalDDP) {
                                if (isPrepayDutiesSelected == taxMessage.IsSelectedDDPTaxOptionIsRequired) {
                                    response = taxMessage.Layout;
                                }
                            }
                            else {
                                response = taxMessage.Layout;
                            }
                        }
                    }
                    if (taxMessage.IsPartial) {
                        response = taxMessage.Layout;
                    }
                }
            });
        }
    }

    return response;
}

GEShopifyCheckout.prototype.SetTaxMessageInformation = function (taxMessageInformation) {
    taxMessageInformation.Threshold = parseInt(taxMessageInformation.Threshold);
    this.taxMessagesInformation = taxMessageInformation;
}

GEShopifyCheckout.prototype.SetTermsAndConditionInformation = function (termsAndConditionInformation) {
    this.termsAndConditionsInformation = termsAndConditionInformation;
}

GEShopifyCheckout.prototype.SetMarketingOffersInformation = function (marketingOffersInformation) {
    this.marketingOffersInformation = marketingOffersInformation;

    const marketingOffersContainer = document.querySelector('div[data-buyer-accepts-marketing]');
    if (marketingOffersInformation.AllowOffersFromGlobale
        && this.IsDefined(marketingOffersContainer)
        && this.IsDefined(marketingOffersInformation.Layout)) {
            marketingOffersContainer.insertAdjacentHTML('beforeend', marketingOffersInformation.Layout);
    }
}

GEShopifyCheckout.prototype.GetTaxMessageInformation = function () {
    return this.taxMessagesInformation;
}

GEShopifyCheckout.prototype.IsDefined = function (object) {
    if (typeof object != "undefined" && object != "" && object != null)
        return true;
    else
        return false;
};

//This function detect a card type from its number/partial number
GEShopifyCheckout.prototype.DetectCardType = function (cur_val) {
    var cardType = payment.fns.cardType(cur_val);
    if (cardType != null) {
        //get card id from dictionary
        var cardId = this.cardTypes[cardType];
        return { cardId, cardType };
    }
}

//This function detect a card type from its number/partial number
GEShopifyCheckout.prototype.DetectCardTypeV2 = function (cur_val) {
    var paymentTypeId = payment.V2.fns.paymentTypeByCardNumber(cur_val);
    if (paymentTypeId != 0) {
        //get payment type id from dictionary
        var paymentTypeName = this.paymentTypes[paymentTypeId];
        return { paymentTypeId, paymentTypeName };
    }
}

GEShopifyCheckout.prototype.PostPaymentFormSubmitFailOperations = function () {
    //scroll into view first invlid element
    var firstFInvalidElement = document.querySelector(".invalid");
    const yOffset = -130;
    const y = firstFInvalidElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });

    //re-enable complete order button
    this.DisableCompleteOrderButton(false);
    //re-enable all links and some fields
    this.ModifyFieldsDisabledProperty(false);
}

GEShopifyCheckout.prototype.OnFormSubmit = function (form, callback) {
    form.onsubmit = function (e) {
        callback(e, function () {
            //onvalidationerror
            this.PostPaymentFormSubmitFailOperations();
        }.bind(this)); //only failed will be returned as boolean as on success the form submits       
    }.bind(this);
}

//SET PAYMENT FORM VALIDATORS
GEShopifyCheckout.Validators = [];
GEShopifyCheckout.Validators[GEShopifyCheckout.enums.forms.AFTERPAY] = function (form) {

    this.OnFormSubmit(form, function (e, onValidationError) {
        e.preventDefault();

        form.querySelectorAll(".form-control").forEach(el => el.classList.remove('invalid'))
        var formValid = true;
        //check that all combo boxes were selected
        form.querySelectorAll("select").forEach(function (e) {
            if (e.value == "") {
                formValid = false;
                e.classList.add("invalid");
            }
        }.bind(this));

        if (!formValid) {
            //failed
            this.ShowPostPaymentLoading(false);
            onValidationError();
            //return false;
        } else {
            e.target.submit();
        }
    }.bind(this))

}

GEShopifyCheckout.CreditCardForms.forEach((f) =>
    GEShopifyCheckout.Validators[f.form] = function (form) {
        var J = payment.J;
        var paymentMethod = document.querySelector(f.paymentMethodElement);
        var number = document.querySelector(f.numberElement);
        if (!this.IsDefined(number)) {
            this.Log(this.LogTypes.Exception, "GEShopifyCheckout.CreditCardForms.Validation failed. CCnumber element is not defined. CheckoutId:" + this.checkoutId);
            return;
        }
        var cvc = document.querySelector(f.cvcElement);
        var expYearSelect = document.querySelector(f.expYearElement);
        var expMonthSelect = document.querySelector(f.expMonthElement);
        var defaultPaymentMethodId = f.defaultPaymentMethodIdElement == null ? 0 : document.querySelector(f.defaultPaymentMethodIdElement).value;

        var supportedCardsStr = document.querySelector("[data-tab-name='" + f.dataTab + "']").getAttribute("data-supported-cards");
        var supportCardsArr = JSON.parse(supportedCardsStr);

        // Set currency conversion data
        var currencyConversionDataStr = document.querySelector("[data-tab-name='" + f.dataTab + "']").getAttribute("data-currency-converted-cards");
        var currencyConversionDataArr = JSON.parse(currencyConversionDataStr);

        if (this.useCCValidationV2 === true) {
            Payment.V2.formatCardNumber(number, defaultPaymentMethodId == 0 ? null : 24, paymentMethod, this.paymentTypes);
            Payment.V2.formatCardCVC(cvc);
        } else {
            Payment.formatCardNumber(number, defaultPaymentMethodId == 0 ? null : 24);
            Payment.formatCardCVC(cvc);
        }

        var cardHintContainer = document.querySelector(f.cardHintElement);


        f.SetCardType = function (e) {
            if (typeof GESHOP == "undefined" || GESHOP == null) {
                return;
            }
            if (this.useCCValidationV2 === true) {
                var cardInfo = GESHOP.DetectCardTypeV2(number.value);
                if (cardInfo != null && cardInfo.paymentTypeId) {
                    //verify against supprted cards first 
                    if (supportCardsArr.indexOf(cardInfo.paymentTypeId.toString()) != -1) {
                        //card entered is supported for this billing country
                        //show hint
                        cardHintContainer.className = GESHOP.getCardHintSpecificClass(cardHintContainer, cardInfo.paymentTypeName);
                        number.removeAttribute("glbe-cardinput-invalid");
                        paymentMethod.value = cardInfo.paymentTypeId;
                        GESHOP.activePaymentId = cardInfo.paymentTypeId;

                        // Check if we need to show coversion text
                        for (var i = 0; i < currencyConversionDataArr.length; i++) {
                            if (parseInt(currencyConversionDataArr[i].PaymentMethodId) === cardInfo.paymentTypeId) {
                                if (document.querySelector(f.currencyConvertedElement)) {
                                    document.querySelector(f.currencyConvertedElement).innerHTML = currencyConversionDataArr[i].CurrencyConversionData;
                                }
                                break;
                            }
                        }
                    }
                    else {
                        //card not valid for this billing country
                        if (defaultPaymentMethodId == 0) {
                            number.setAttribute("glbe-cardinput-invalid", "true");
                        }
                        paymentMethod.value = defaultPaymentMethodId;
                        cardHintContainer.className = GESHOP.getCardHintDefaultClass(cardHintContainer);

                        // Clear conversion text area.
                        if (document.querySelector(f.currencyConvertedElement)) {
                            document.querySelector(f.currencyConvertedElement).innerHTML = "";
                        }
                    }

                    //TODO: SAVE CARD
                }
                else {
                    //set default
                    cardHintContainer.className = GESHOP.getCardHintDefaultClass(cardHintContainer);
                    paymentMethod.value = defaultPaymentMethodId;

                    // Clear conversion text area.
                    if (document.querySelector(f.currencyConvertedElement)) {
                        document.querySelector(f.currencyConvertedElement).innerHTML = "";
                    }
                }
            } else {
                var cardInfo = GESHOP.DetectCardType(number.value);
                if (cardInfo != null && cardInfo.cardId) {
                    //verify against supprted cards first 
                    if (supportCardsArr.indexOf(cardInfo.cardId.toString()) != -1) {
                        //card entered is supported for this billing country
                        //show hint
                        cardHintContainer.className = GESHOP.getCardHintSpecificClass(cardHintContainer, cardInfo.cardType);
                        number.removeAttribute("glbe-cardinput-invalid");
                        paymentMethod.value = cardInfo.cardId;
                        GESHOP.activePaymentId = cardInfo.cardId;

                        // Check if we need to show coversion text
                        for (var i = 0; i < currencyConversionDataArr.length; i++) {
                            if (parseInt(currencyConversionDataArr[i].PaymentMethodId) === cardInfo.cardId) {
                                if (document.querySelector(f.currencyConvertedElement)) {
                                    document.querySelector(f.currencyConvertedElement).innerHTML = currencyConversionDataArr[i].CurrencyConversionData;
                                }
                            }
                        }
                    }
                    else {
                        //card not valid for this billing country
                        if (defaultPaymentMethodId == 0) {
                            number.setAttribute("glbe-cardinput-invalid", "true");
                        }
                        paymentMethod.value = defaultPaymentMethodId;
                        cardHintContainer.className = GESHOP.getCardHintDefaultClass(cardHintContainer);
                        // Clear conversion text area.
                        if (document.querySelector(f.currencyConvertedElement)) {
                            document.querySelector(f.currencyConvertedElement).innerHTML = "";
                        }
                    }

                    //TODO: SAVE CARD          
                }
                else {
                    //set default
                    cardHintContainer.className = GESHOP.getCardHintDefaultClass(cardHintContainer);
                    paymentMethod.value = defaultPaymentMethodId;

                    // Clear conversion text area.
                    if (document.querySelector(f.currencyConvertedElement)) {
                        document.querySelector(f.currencyConvertedElement).innerHTML = "";
                    }
                }
            }
        }

        //register card input for card type identification
        number.addEventListener('input', f.SetCardType.bind(this));

        this.validateAlternativeCreditCardsForm = function (number, cvc) {
            var cardNumber = (J.val(number) + '').replace(/\s+|-/g, '');
            var isInvalidCardType = number.getAttribute("glbe-cardinput-invalid") != null;
            J.toggleClass(number, 'invalid', !(cardNumber.length >= this.minAlternativeCCLength && cardNumber.length <= this.maxAlternativeCCLength) || isInvalidCardType);
            var ignoreCvv = cvc.getAttribute("ignorecvv") == "true";
            var cvvValue = J.val(cvc);
            J.toggleClass(cvc, 'invalid', !ignoreCvv && !(cvvValue.length == 3 || cvvValue.length == 4));
        }

        this.OnFormSubmit(form, function (e, onValidationError) {
            e.preventDefault();

            form.querySelectorAll(".form-control").forEach(el => el.classList.remove('invalid'))

            J.toggleClass(document.querySelectorAll('input'), 'invalid');
            //J.removeClass(validation, 'passed failed');

            if (this.useCCValidationV2 === true) {
                //alternative credit cards flow
                if (this.IsDefined(paymentMethod) && this.IsDefined(defaultPaymentMethodId) && defaultPaymentMethodId != 0) {
                    this.validateAlternativeCreditCardsForm(number, cvc);
                }
                else {
                    var paymentTypeName;
                    if (paymentMethod.value != '0') {
                        var paymentTypeId = parseInt(paymentMethod.value, 10);
                        if (this.IsDefined(this.paymentTypes[paymentTypeId])) {
                            paymentTypeName = this.paymentTypes[paymentTypeId];
                        }
                    };

                    if (this.IsDefined(paymentTypeName)) {
                        cardType = Payment.V2.fns.paymentType(paymentTypeName);
                    } else {
                        // If payment type is not detected for some reasons - detect payment type by card number to be on safe side.
                        var paymentTypeId = Payment.V2.fns.paymentTypeByCardNumber(number.value);
                        if (paymentTypeId != 0) {
                            //get payment type id from dictionary
                            var paymentTypeName = this.paymentTypes[paymentTypeId];
                            cardType = { paymentTypeId, paymentTypeName };
                        }
                    }

                    var isInvalidCardType = number.getAttribute("glbe-cardinput-invalid") != null || !this.IsDefined(paymentTypeName);
                    J.toggleClass(number, 'invalid', (!Payment.V2.fns.validateCardNumber(J.val(number), paymentTypeName) || isInvalidCardType));
                    J.toggleClass(cvc, 'invalid', !Payment.V2.fns.validateCardCVC(J.val(cvc), cardType));
                }
            } else {
                if (this.IsDefined(paymentMethod) && this.IsDefined(defaultPaymentMethodId) && defaultPaymentMethodId != 0) {
                    this.validateAlternativeCreditCardsForm(number, cvc);
                }
                else {
                    var cardType = Payment.fns.cardType(J.val(number));
                    var isInvalidCardType = number.getAttribute("glbe-cardinput-invalid") != null;
                    J.toggleClass(number, 'invalid', (!Payment.fns.validateCardNumber(J.val(number)) || isInvalidCardType));
                    J.toggleClass(cvc, 'invalid', !Payment.fns.validateCardCVC(J.val(cvc), cardType));
                }
            }

            var expMonth = expMonthSelect.value;
            var expYear = expYearSelect.value;

            var today = new Date();
            var todayMonth = today.getMonth() + 1;
            var todayYear = today.getFullYear();

            if (expMonth == "" && expYear == "") {
                expMonthSelect.classList.add("invalid");
                expYearSelect.classList.add("invalid");
            }
            else if (expMonth == "") {
                expMonthSelect.classList.add("invalid");
            }
            else if (expYear == "") {
                expYearSelect.classList.add("invalid");
            }
            else if (todayYear == expYear) {
                //check month 
                if (todayMonth > expMonth) {
                    //failed
                    expMonthSelect.classList.add("invalid");
                }
            }

            if (form.querySelectorAll('.invalid').length) {
                //failed            
                this.ShowPostPaymentLoading(false);
                onValidationError();
                //return false;
            } else {
                e.target.submit();
            }
        }.bind(this));

        this.isCardHintContainerRtl = function (cardHintContainer) {
            try {
                return cardHintContainer.dataset.rtl.toLowerCase() == 'true' ? true : false;
            } catch (e) {
                return false;
            }
        }

        this.getCardHintDefaultClass = function (cardHintContainer) {
            return (this.isCardHintContainerRtl(cardHintContainer) ? "glbe-cardtype-hint-rtl " : "") + "glbe-display-block-impr card-hint-default";
        }

        this.getCardHintSpecificClass = function (cardHintContainer, cardType) {
            return (this.isCardHintContainerRtl(cardHintContainer) ? "glbe-cardtype-hint-rtl " : "") + "glbe-display-block-impr card-hint-" + cardType;
        }

    });

GEShopifyCheckout.OnPaymentTabLoaded = [];

GEShopifyCheckout.CreditCardForms.forEach(data => {
    GEShopifyCheckout.OnPaymentTabLoaded[data.type] = function () {
        if (typeof GESHOP != "undefined" && GESHOP != null) {
            GESHOP.Log(GESHOP.LogTypes.Info, "OnPaymentTabLoaded CREDITCARDS.");
        }
        if (data.SetCardType != null) {
            data.SetCardType();
        }
        return {
            disableCompleteButton: false
        };
    }
});

GEShopifyCheckout.OnPaymentTabLoaded[GEShopifyCheckout.enums.payments.PAYPAL] = function () {
    if (typeof GESHOP != "undefined" && GESHOP != null) {
        GESHOP.Log(GESHOP.LogTypes.Info, "OnPaymentTabLoaded PAYPAL.");
    }
    //REMOVE THE BELOW IF NOT NEEDED
    //console.log("afterpay");
    //var btn = document.querySelector("#eden");
    //btn.onclick = function (e) {
    //    e.triggerTabClick = false;
    //    console.log("button");
    //}

    return {
        disableCompleteButton: false
    };
}


GEShopifyCheckout.OnPaymentTabLoaded[GEShopifyCheckout.enums.payments.CASHONDELIVERY] = function () {
    if (typeof GESHOP != "undefined" && GESHOP != null) {
        GESHOP.Log(GESHOP.LogTypes.Info, "OnPaymentTabLoaded CASHONDELIVERY.");
    }
    //REMOVE THE BELOW IF NOT NEEDED
    //console.log("afterpay");
    //var btn = document.querySelector("#eden");
    //btn.onclick = function (e) {
    //    e.triggerTabClick = false;
    //    console.log("button");
    //}

    return {
        disableCompleteButton: false
    };
}

GEShopifyCheckout.OnPaymentTabLoaded[GEShopifyCheckout.enums.payments.AFTERPAY] = function () {
    if (typeof GESHOP != "undefined" && GESHOP != null) {
        GESHOP.Log(GESHOP.LogTypes.Info, "OnPaymentTabLoaded AFTERPAY.");
    }
    //REMOVE THE BELOW IF NOT NEEDED
    //console.log("afterpay");
    //var btn = document.querySelector("#eden");
    //btn.onclick = function (e) {
    //    e.triggerTabClick = false;
    //    console.log("button");
    //}
    return {
        disableCompleteButton: false
    };
}

GEShopifyCheckout.OnPaymentTabLoaded[GEShopifyCheckout.enums.payments.APPLEPAY] = function () {
    if (typeof GESHOP != "undefined" && GESHOP != null) {
        GESHOP.Log(GESHOP.LogTypes.Info, "OnPaymentTabLoaded APPLEPAY.");
    }
    if (this.isApplePayFullRedirectMode) {
        return {
            disableCompleteButton: false
        };
    }

    var btnPay = document.querySelector("#btnPay");

    //set global-e button action
    btnPay.onclick = function () {
        if (typeof GESHOP != "undefined" && GESHOP != null) {
            GESHOP.HandleApplePayProcess();
        }
    }.bind(this);

    return {
        disableCompleteButton: true
    };
}

GEShopifyCheckout.OnPaymentTabLoaded[GEShopifyCheckout.enums.payments.KLARNA] = function () {
    try {
        if (typeof GESHOP != "undefined" && GESHOP != null) {
            GESHOP.Log(GESHOP.LogTypes.Info, "OnPaymentTabLoaded KLARNA.");
        }
        var self = this;
        var klarnaTab = document.querySelector(".glbe-tab-" + GEShopifyCheckout.enums.payments.KLARNA);

        // Set empty Klarna payment method id
        var paymentMethodIdInput = document.querySelector("#" + GEShopifyCheckout.enums.forms.KLARNA + " input[name='PaymentMethodId']");
        var paymentMethodCodeInput = document.querySelector("#" + GEShopifyCheckout.enums.forms.KLARNA + " input[name='PaymentMethodCode']");

        // Should not continue with this process when Klarna is Klarna HPP
        if (paymentMethodIdInput.value == '116') {
            if (GESHOP != null) GESHOP.Log(GESHOP.LogTypes.Info, "OnPaymentTabLoaded KLARNA is skipped, KLARNA HPP Tab is loaded.");
            return {
                disableCompleteButton: false
            }
        }

        paymentMethodIdInput.value = '';
        paymentMethodCodeInput.value = '';

        // Prevent new callings of OnPaymentTabLoaded
        klarnaTab.onclick = function (e) {
            var activePaymentBox = document.querySelector(".glbe-tab-" + GEShopifyCheckout.enums.payments.KLARNA + " .glbe-group-pm-box.active");
            var paymentMethodIdInput = document.querySelector("#" + GEShopifyCheckout.enums.forms.KLARNA + " input[name='PaymentMethodId']");
            self.activePaymentName = this.getAttribute("data-tab-name");
            self.activePaymentForm = "glbe-form-" + self.activePaymentName;
            if (!self.IsDefined(activePaymentBox) && self.IsDefined(paymentMethodIdInput)) {
                var paymentMethodId = paymentMethodIdInput.value;
                if (self.IsDefined(paymentMethodId) && paymentMethodId != '') {
                    self.activePaymentId = paymentMethodId;
                    self.activePaymentForm = "glbe-form-" + self.activePaymentName;
                }
                else {
                    self.activePaymentId = null;
                }
            }
            else {
                self.activePaymentId = activePaymentBox.getAttribute("pm-id");
            }

            if (!self.allowKlarnaCreateSessionOnShopifyCheckoutLoad && !self.KlarnaOptionsLoaded) {
                self.ShowPaymentStepLoading(true);
                self.GetKlarnaOptions();
            }
            e.triggerTabClick = false;
        };

        if (self.allowKlarnaCreateSessionOnShopifyCheckoutLoad) {
            var initWidget = klarnaTab.getAttribute("data-init-widget");

            if (initWidget === "true") {
                self.HandleKlarnaDirectWidgetElement(klarnaTab, paymentMethodIdInput, paymentMethodCodeInput);
            } else {
                self.HandleWidgetForKlarnaGroupPaymentMethodBox(paymentMethodIdInput, paymentMethodCodeInput);
            }
        }
        return {
            disableCompleteButton: false
        };
    }
    catch (ex) {
        this.Log(this.LogTypes.Exception, "Klarna OnPaymentTabLoaded was failed. " + ex + ".");
    }
}

GEShopifyCheckout.prototype.GetKlarnaOptions = function () {
    this.LoadScript(this.parameters.environment + '/platforms/shopify/checkout/KlarnaPaymentOptions/' + this.parameters.billingCountry + '/' +
        this.parameters.shippingCountry + '/' + this.checkoutId + '/' + this.parameters.merchantId + '/' + this.parameters.cultureCode + '/' +
        this.parameters.webStoreCode + '/' + this.GetUIAmount() + '/' + this.parameters.shippingStateCode);
}

GEShopifyCheckout.prototype.HandleApplePayProcess = function () {

    try {
        if (typeof GESHOP != "undefined" && GESHOP != null) {
            GESHOP.Log(GESHOP.LogTypes.Info, "On HandleApplePayProcess");
        }
        var self = this;

        var paymentRequest = {
            currencyCode: self.baseCurrency,
            countryCode: self.parameters.billingCountry,
            total: {
                label: 'Total For Your Order',
                amount: self.parameters.amount
            },
            supportedNetworks: ['amex', 'masterCard', 'visa'],
            merchantCapabilities: ['supports3DS']
        };

        // Initialize process.
        document.querySelector("#IsApplePayStartSession").value = "false";
        document.querySelector("#URL").value = '';
        document.querySelector("#GEData").value = '';
        document.querySelector("#TokenData").value = '';
        document.querySelector("#ApplePayCartToken").value = '';
        document.querySelector("#IsApplePayVoid").value = "false";

        // Get curren version for paymentRequest
        var version = document.querySelector("#applePayVersion").value;

        // initiate the apple pay session
        applePaySession = new ApplePaySession(version, paymentRequest);
    }
    catch (e) {
        this.Log(this.LogTypes.Exception, "HandleApplePayProcess was failed. " + e + ".");
        //self.DebugProcess(e);
    }


    // Merchant Validation and GE initial proceess - start session.
    applePaySession.onvalidatemerchant = function (event) {

        document.querySelector("#URL").value = event.validationURL;
        document.querySelector("#IsApplePayStartSession").value = "true";

        self.SubmitPayment();
    }

    applePaySession.onpaymentmethodselected = function (event) {

        var newTotal = paymentRequest["total"];

        var newLineItems = [];

        applePaySession.completePaymentMethodSelection(newTotal, newLineItems);
    }

    // End and payment apple pay payment flow 
    applePaySession.onpaymentauthorized = function (event) {

        document.querySelector("#IsApplePayStartSession").value = "false";
        document.querySelector("#TokenData").value = JSON.stringify(event.payment.token);

        self.SubmitPayment();
    }

    applePaySession.oncancel = function (event) {

        //hide
        var container = document.querySelector("#" + self.injectedContainerId);
        container.querySelector(".glbe-loading-container").remove();

        document.querySelector("#IsApplePayVoid").value = "true";

        self.VoidApplePay(self, applePaySession, container);
    }

    applePaySession.begin();
}

GEShopifyCheckout.prototype.DebugProcess = function (data) {

    if (document.querySelector("#divDebug")) {
        document.querySelector("#divDebug").innerHTML += "<br/>" + data;
    }
}

// Cancel and void the payment
GEShopifyCheckout.prototype.VoidApplePay = function (self, applePaySession, container) {

    if (!document.querySelector("#GEData") || document.querySelector("#GEData").value === '') {
        document.querySelector("#IsApplePayVoid").value = "false";
        return;
    }

    // Cancel the payment, if we have one - anyway.
    try {
        if (typeof GESHOP != "undefined" && GESHOP != null) {
            GESHOP.Log(GESHOP.LogTypes.Info, "VoidApplePay");
        }
        applePaySession.abort();
    }
    catch (e) {
        this.Log(this.LogTypes.Exception, "VoidApplePay - Abort ApplePay session was failed. " + e + ".");
    }

    try {
        self.SubmitPayment();

        container.querySelector(".glbe-loading-container").remove();
    }
    catch (e) {
        this.Log(this.LogTypes.Exception, "VoidApplePay - payment submit was failed. " + e + ".");
        // self.DebugProcess(e);
    }

    document.querySelector("#IsApplePayVoid").value = "false";
}

GEShopifyCheckout.prototype.GetBrowserInfo = function () {
    var browserInfo = {};

    try {
        if (this.gettingBrowserInfoEnabled) {
            browserInfo.CustomerScreenColorDepth = screen.colorDepth;
            browserInfo.CustomerScreenWidth = screen.width;
            browserInfo.CustomerScreenHeight = screen.height;
            browserInfo.CustomerTimeZoneOffset = new Date().getTimezoneOffset();
            browserInfo.CustomerLanguage = navigator.language;
        }
    }
    catch (e) {
        this.Log(this.LogTypes.Exception, "GetBrowserInfo was failed. " + e + ".");
    }

    return browserInfo;
};


GEShopifyCheckout.prototype.OpenWindowPopup = function (url) {
    var self = this;
    var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        winWidth = w.innerWidth || e.clientWidth || g.clientWidth,
        winHeight = w.innerHeight || e.clientHeight || g.clientHeight;

    var popupWidth = 0;
    var popupHeight = 0;
    var MARGIN = 30;

    popupWidth = winWidth - MARGIN * 2;
    popupHeight = winHeight - MARGIN * 2;

    var popupWrapper = document.createElement("div");
    popupWrapper.setAttribute("class", "GEWindowPopupWrapper");
    popupWrapper.setAttribute("id", "GEWindowPopupWrapper");
    popupWrapper.style.left = (winWidth / 2 - popupWidth / 2) + "px";
    var pTop = (winHeight / 2 - popupHeight / 2);
    pTop = pTop < 0 ? 10 : pTop;
    popupWrapper.style.top = pTop + "px";
    popupWrapper.style.width = popupWidth + "px";
    popupWrapper.style.height = popupHeight + "px";


    var header = document.createElement("div");
    header.setAttribute("class", "GEWindowPopupHeader");

    var closer = document.createElement("div");
    closer.setAttribute("class", "GEWindowPopupCloser");

    header.appendChild(closer);

    var iframe = this.CreateFrame(url);
    iframe.setAttribute("class", "GEWindowPopupFrame");
    iframe.setAttribute("frameborder", "0");
    iframe.style.height = (popupHeight - 30) + "px";

    popupWrapper.appendChild(header);
    popupWrapper.appendChild(iframe);

    var overlay = document.createElement("div");
    overlay.setAttribute("class", "GEWindowPopupOverlay");
    overlay.setAttribute("id", "GEWindowPopupOverlay");
    var fnClose = function () {
        document.getElementsByTagName("body")[0].removeChild(overlay);
        document.getElementsByTagName("body")[0].removeChild(popupWrapper);
        //window.history.go(-1);
    };

    document.getElementsByTagName("body")[0].appendChild(popupWrapper);
    document.getElementsByTagName("body")[0].appendChild(overlay);

    try {
        if (iframe != null) {
            window.setTimeout(function () {
                try {
                    iframe.src = url;
                }
                catch (e) {
                    this.Log(this.LogTypes.Exception, "Load iframe was failed. " + e + ".");
                }
            }, 10);
        }
    } catch (e) {
        this.Log(this.LogTypes.Exception, "OpenWindowPopup ValidateCustomFields was failed. " + e + ".");
    }

    closer.onclick = fnClose;
    overlay.onclick = fnClose;

    self.Fade("GEWindowPopupOverlay", 0, 80, 500, function () {
        self.Fade("GEWindowPopupWrapper", 0, 100, 500);
    });
};

GEShopifyCheckout.prototype.CreateFrame = function (src) {
    var iframe = document.createElement("iframe");
    iframe.setAttribute("src", src);
    return iframe;
}

GEShopifyCheckout.prototype.Fade = function (eID, startOpacity, stopOpacity, duration, optCallback) {
    if (!document.getElementById(eID)) return;
    var speed = Math.round(duration / 100);
    var timer = 0;
    var self = this;
    if (startOpacity < stopOpacity) { // fade in
        for (var i = startOpacity; i <= stopOpacity; i++) {
            this.FadeProc(eID, i, timer, speed, stopOpacity, optCallback);
            timer++;
        } return;
    }
    for (var i = startOpacity; i >= stopOpacity; i--) { // fade out
        this.FadeProc(eID, i, timer, speed, stopOpacity, optCallback);
        timer++;
    }
}

GEShopifyCheckout.prototype.FadeProc = function (eID, i, timer, speed, stopOpacity, optCallback) {
    var self = this;
    setTimeout(function () {
        self.SetOpacity(eID, i);
    }, timer * speed);

    if (i == stopOpacity) {
        setTimeout(function () {
            //done
            if (optCallback) {
                optCallback();
            };
        }, timer * speed);
    }
}

GEShopifyCheckout.prototype.SetOpacity = function (elementId, opacity) {
    var element = document.getElementById(elementId);
    if (element) {
        element.style.opacity = opacity / 100;
        element.style.filter = 'alpha(opacity=' + opacity + ')';
    }
}

GEShopifyCheckout.prototype.ShowModalOverlay = function () {
    try {
        var overlay = document.createElement("div");
        overlay.setAttribute("class", "GEWindowPopupOverlay");
        overlay.setAttribute("id", "GEWindowPopupOverlay");

        document.getElementsByTagName("body")[0].appendChild(overlay);
        this.Fade("GEWindowPopupOverlay", 0, 80, 500);
    }
    catch (ex) {
        if (typeof GESHOP != "undefined" && GESHOP != null) {
            GESHOP.Log(GESHOP.LogTypes.Exception, "ShowModalOverlay failed " + ex.message + ".");
        }
    }
}

GEShopifyCheckout.prototype.HideModalOverlay = function () {
    try {
        var overlay = document.getElementById('GEWindowPopupOverlay');
        if (this.IsDefined(overlay)) {
            document.getElementsByTagName("body")[0].removeChild(overlay);
        }
    }
    catch (ex) {
        if (typeof GESHOP != "undefined" && GESHOP != null) {
            GESHOP.Log(GESHOP.LogTypes.Exception, "HideModalOverlay failed " + ex.message + ".");
        }
    }
}

GEShopifyCheckout.prototype.InitFullStoryAnalytics = function (merchantName) {
    try {
        if (!window['_fs_namespace'])
            return;

        var cookieClientId = this.GetCookie(this.GE_CLIENT_COOKIE_NAME);
        if (!this.IsDefined(cookieClientId)) {
            cookieClientId = this.GenerateNewGuid(this.parameters.merchantId);
            this.SetCookie(this.GE_CLIENT_COOKIE_NAME, cookieClientId, this.GE_DATA_COOKIE_EXP, false);
        }
        FS.identify(cookieClientId);
        FS.setUserVars({
            "MerchantId_str": this.parameters?.merchantId,
            "MerchantName_str": merchantName,
            "CheckoutId_str": this.checkoutId
        });
    }
    catch (ex) {
    }
}

GEShopifyCheckout.prototype.InitHeapAnalytics = function () {
    try {
        if (!window['heap'])
            return;

        heap.identify(this.checkoutId);
        heap.addUserProperties(
            {
                GAClientId: this.parameters.clientId,
                UserAgent: navigator.userAgent,
                MerchantId: this.parameters.merchantId,
                ClientId: this.parameters.clientId,
                CountryName: this.parameters.shippingCountry,
                CultureName: this.parameters.cultureCode,
            });
    }
    catch (ex) {
    }
}

GEShopifyCheckout.prototype.DisplayShippingMethodsNotes = function () {
    try {
        var self = this;
        if (self.shippingMethodsData == null || self.shippingMethodsData.length == 0) {
            return;
        }

        document.querySelectorAll(".shipping-method-note").forEach(el => el.remove());

        var shippingOptionsWrappers = document.querySelectorAll("[data-shipping-methods] .radio-wrapper");
        shippingOptionsWrappers.forEach(function (shippingOptionWrapper) {
            var shippingMethodFromCache = self.shippingMethodsData.find(x =>
                shippingOptionWrapper.dataset.shippingMethod.indexOf('-' + x.ShippingMethodId + '_') != -1);
            if (shippingMethodFromCache != null && shippingMethodFromCache.Note != null) {
                var shippingMethodLabel = shippingOptionWrapper.querySelector(".radio__label");
                shippingMethodLabel.innerHTML = shippingMethodLabel.innerHTML + "<span class='shipping-method-note'>" + shippingMethodFromCache.Note + "</span>";
            }
            else {
                var shippingMethodFromCacheAlternative = self.shippingMethodsData.find(x =>
                    shippingOptionWrapper.dataset.shippingMethod.indexOf('-' + x.ServiceCode + '-') != -1);
                if (shippingMethodFromCacheAlternative != null && shippingMethodFromCacheAlternative.Note != null) {
                    var shippingMethodLabel = shippingOptionWrapper.querySelector(".radio__label");
                    shippingMethodLabel.innerHTML = shippingMethodLabel.innerHTML + "<span class='shipping-method-note'>" + shippingMethodFromCacheAlternative.Note + "</span>";
                }
            }

        });
    } catch (ex) {

    }
}

GEShopifyCheckout.prototype.GetShippingMethodsDataFromCache = function () {
    try {
        this.LoadScript(this.parameters.environment + '/platforms/shopify/checkout/GetShippingMethodsData/' +
            this.parameters.merchantId + '/' +
            this.checkoutId + '/' +
            this.parameters.cultureCode);
    } catch (ex) { }
}

GEShopifyCheckout.prototype.OnShippingMethodsDataReceived = function (obj) {
    var self = this;

    if (obj != null) {
        self.shippingMethodsData = obj.ShopifyShippingMethodOptions;
        self.DisplayShippingMethodsNotes();
    }
}

// Cookie Consent ===>
GEShopifyCheckout.prototype.GetAllowedGroupIds = function () {
    var self = this;
    var allowedGroups = [];

    try {
        var groups = this.GetConsentGroupsFromCookie();

        if (Object.keys(groups).length !== 0) {

            Object.keys(groups).forEach(function (key) {
                if (groups[key] == self.ConsentPermissions.Allowed) {
                    allowedGroups.push(key);
                }
            });
        }

        return allowedGroups;

    } catch (ex) {
        return allowedGroups;
    }
}

GEShopifyCheckout.prototype.GetConsentGroupsFromCookie = function () {
    var groups = {};

    try {
        var cookieValue = GESHOP.GetCookie(this.GE_CONSENT_COOKIE, true);

        if (typeof cookieValue != undefined &&
            cookieValue != null &&
            cookieValue != "" &&
            cookieValue.groups != null) {
            Object.keys(cookieValue.groups).forEach(function (key) {
                groups[key] = cookieValue.groups[key];
            });
        }

        return groups;
    } catch (ex) {
        return groups;
    }
}

GEShopifyCheckout.prototype.IsAnalyticsAllowed = function () {
    return this.IsGroupAllowed(this.MandatoryConsentGroups.Analytics);
}

GEShopifyCheckout.prototype.IsMarketingAllowed = function () {
    return this.IsGroupAllowed(this.MandatoryConsentGroups.Marketing);
}

GEShopifyCheckout.prototype.IsGroupAllowed = function (groupId) {
    if (groupId == this.MandatoryConsentGroups.Essentials) {
        return true;
    }

    try {
        var groups = this.GetConsentGroupsFromCookie();
        if (Object.keys(groups).length === 0) {
            return true;
        }

        var groupPermission = groups[groupId];

        if (groupPermission != null && groupPermission == this.ConsentPermissions.Allowed) {
            return true;
        }
        return false;

    } catch (ex) {
        return true;
    }
}

GEShopifyCheckout.prototype.IsOnlyEssentialsEnabled = function () {
    try {
        var groups = this.GetAllowedGroupIds();
        if (groups.length === 0) {
            return false;
        }

        if (groups.length === 1 && groups[0] == this.MandatoryConsentGroups.Essentials) {
            return true;
        }

    } catch (ex) {
        return false;
    }
}
//  <=== Cookie Consent

var applePaySession = null;

var GESHOP = new GEShopifyCheckout();

// #region WorldPay 3DS2 pre-enrollment

function WorldPayPreEnrollManager(setting) {
    this.Init(setting);
}

WorldPayPreEnrollManager.prototype.Init = function (settings) {
    try {
        var self = this;

        this.Settings = settings;
        this.APICallAttemptIndex = 0;
        this.GlobalEPaymentForm = document.getElementById(settings.ElementsIds.GlobalEPaymentFormId);
        this.PreEnrollIframe = document.getElementById(settings.ElementsIds.PreEnrollIframeId);
        this.IntervalIdentifier = null;

        window.addEventListener("message", function (event) {
            if (event.origin === self.Settings.ScriptDomain) {
                var preEnrollResponse = JSON.parse(event.data);
                if (preEnrollResponse !== undefined && preEnrollResponse.Status) {
                    var preEnrollResponseStr = JSON.stringify(preEnrollResponse);
                    document.getElementById(self.Settings.ElementsIds.ResponseInputId).value = preEnrollResponseStr;

                    if (self.intervalIdentifier !== null)
                        clearInterval(self.IntervalIdentifier);

                    self.GlobalEPaymentForm.submit();
                }
            }
        }, false);
    } catch (ex) {
        if (typeof GESHOP != "undefined" && GESHOP != null) {
            GESHOP.Log(GESHOP.LogTypes.Exception, "WorldPay 3Ds pre-enrollment initialization was failed. " + ex + ".");
        }
    }
};

WorldPayPreEnrollManager.prototype.RenderPreEnrollForm = function (parentElm, preEnrollFormData) {
    try {
        if (typeof GESHOP != "undefined" && GESHOP != null) {
            GESHOP.Log(GESHOP.LogTypes.Info, "RenderPreEnrollForm");
        }
        var preEnrollForm = document.createElement('form');
        preEnrollForm.setAttribute('method', 'POST');
        preEnrollForm.setAttribute('action', preEnrollFormData.ScriptURL);
        preEnrollForm.setAttribute('target', 'glbe-cc-pm-pre-enroll-container');

        var binInput = document.createElement('input');
        binInput.setAttribute('type', 'hidden');
        binInput.setAttribute('name', 'Bin');
        binInput.setAttribute('value', preEnrollFormData.Bin);

        var jwtInput = document.createElement('input');
        jwtInput.setAttribute('type', 'hidden');
        jwtInput.setAttribute('name', 'JWT');
        jwtInput.setAttribute('value', preEnrollFormData.JWT);

        preEnrollForm.appendChild(binInput);
        preEnrollForm.appendChild(jwtInput);

        document.getElementsByTagName('body')[0].appendChild(preEnrollForm);

        return preEnrollForm;
    } catch (ex) {
        if (typeof GESHOP != "undefined" && GESHOP != null) {
            GESHOP.Log(GESHOP.LogTypes.Exception, "WorldPay RenderPreEnrollForm was failed. " + ex + ".");
        }
    }
};

WorldPayPreEnrollManager.prototype.SubmitPreEnrollForm = function () {
    try {

        if (typeof GESHOP != "undefined" && GESHOP != null) {
            GESHOP.Log(GESHOP.LogTypes.Info, "SubmitPreEnrollForm");
        }

        this.PreEnrollForm.submit();
    }
    catch (e) {
        if (typeof GESHOP != "undefined" && GESHOP != null) {
            GESHOP.Log(GESHOP.LogTypes.Exception, "WorldPay SubmitPreEnrollForm was failed. " + e + ".");
        }
    }

    this.APICallAttemptIndex++;
};

WorldPayPreEnrollManager.prototype.PerformPreAuthentication = function () {
    try {
        var self = this;

        this.PreEnrollForm = this.RenderPreEnrollForm(this.Settings.ElementsIds.PreEnrollIframeId, {
            ScriptURL: this.Settings.ScriptURL,
            Bin: this.Settings.Bin,
            JWT: this.Settings.JWT
        });

        this.IntervalIdentifier = setInterval(function () {
            if (self.APICallAttemptIndex >= self.Settings.MaxAPICallAttempts) {
                if (self.IntervalIdentifier !== null)
                    clearInterval(self.IntervalIdentifier);
                self.GlobalEPaymentForm.submit();
            }
            else {
                self.SubmitPreEnrollForm();
            }
        }, this.Settings.APICallAttemptsInterval);
    } catch (ex) {
        if (typeof GESHOP != "undefined" && GESHOP != null) {
            GESHOP.Log(GESHOP.LogTypes.Exception, "WorldPay PerformPreAuthentication was failed. " + ex + ".");
        }
    }
};

// #endregion WorldPay 3DS2 pre-enrollment

// #region Klarna Direct

function KlarnaDirectManager(settings) {
    this.ClientToken = settings.ClientToken;
    this.PaymentMethodCategory = settings.PaymentMethodCategory;
};

KlarnaDirectManager.prototype.LoadWidget = function () {
    try {
        var self = this;

        var DoLoadWidget = function () {
            try {
                // Clear widget container
                var klarnaWidgetContainer = document.querySelector("#klarnaWidgetContainer");
                klarnaWidgetContainer.innerHTML = "";

                // Load widget
                Klarna.Payments.load({
                    container: "#" + klarnaWidgetContainer.id,
                    payment_method_category: self.PaymentMethodCategory
                }, function (res) {
                    initKlarnaEventHandlers(res);
                });
            }
            catch (err) {
                if (typeof GESHOP != "undefined" && GESHOP != null) {
                    GESHOP.Log(GESHOP.LogTypes.Exception, "Klarna DoLoadWidget was failed. " + err + ".");
                }
                // this.DebugProcess(e);
            }
        };

        var initKlarnaEventHandlers = function (res) {
            if (!res.show_form) {
                disableKlarnaForm();
            }
        };

        var disableKlarnaForm = function () {
            var errorDiv = document.querySelector("#klarnaShowFormError div").innerHTML;
            klarnaWidgetContainer.innerHTML = errorDiv;
            if (typeof GESHOP != "undefined" && GESHOP != null) {
                GESHOP.DisableCompleteOrderButton(true);
            }
        }

        // Load and initiate Klarna JS SDK if it was not loaded before
        if (typeof Klarna === 'undefined') {
            // Load SDK
            var script = document.createElement('script');
            script.src = "https://x.klarnacdn.net/kp/lib/v1/api.js";
            script.async = "true";
            document.head.appendChild(script);

            // Initiate SDK
            window.klarnaAsyncCallback = function () {
                try {
                    Klarna.Payments.init({
                        client_token: self.ClientToken
                    });
                    DoLoadWidget();
                }
                catch (err) {
                    if (typeof GESHOP != "undefined" && GESHOP != null) {
                        GESHOP.Log(GESHOP.LogTypes.Exception, "Klarna widget initialization was failed. " + err + ".");
                    }
                    // this.DebugProcess(e);
                }
            };

        }
        else {
            DoLoadWidget();
        }
    } catch (ex) {
        this.Log(this.LogTypes.Exception, "Klarna LoadWidget was failed. " + ex + ".");
    }
};

KlarnaDirectManager.GetKlarnaDirectAuthorizationRequest = function (eventInfo) {
    var authorizationRequest = {
        billing_address: {
            given_name: eventInfo.Data.BillingDetails.FirstName,
            family_name: eventInfo.Data.BillingDetails.LastName,
            email: eventInfo.Data.BillingDetails.Email,
            phone: eventInfo.Data.BillingDetails.Phone1,
            country: eventInfo.Data.BillingDetails.CountryCode,
            region: eventInfo.Data.BillingDetails.StateCode,
            city: eventInfo.Data.BillingDetails.City,
            postal_code: eventInfo.Data.BillingDetails.Zip,
            street_address: eventInfo.Data.BillingDetails.Address1,
            street_address2: eventInfo.Data.BillingDetails.Address2,
        },
        shipping_address: {
            given_name: eventInfo.Data.ShippingDetails.FirstName,
            family_name: eventInfo.Data.ShippingDetails.LastName,
            email: eventInfo.Data.ShippingDetails.Email,
            phone: eventInfo.Data.ShippingDetails.Phone1,
            country: eventInfo.Data.ShippingDetails.CountryCode,
            region: eventInfo.Data.ShippingDetails.StateCode,
            city: eventInfo.Data.ShippingDetails.City,
            postal_code: eventInfo.Data.ShippingDetails.Zip,
            street_address: eventInfo.Data.ShippingDetails.Address1,
            street_address2: eventInfo.Data.ShippingDetails.Address2,
        }
    };

    // Add attachment to authorization request
    if (eventInfo.Data.MerchantName) {
        var merchantNamePlaceHolder = "{MerchantName}";
        var productCategoryPlaceHolder = "{ProductCategory}";
        var body = "{\"marketplace_seller_info\":[{\"sub_merchant_id\":\"{MerchantName}\",\"product_category\":\"{ProductCategory}\"}]}";
        body = body.replace(merchantNamePlaceHolder, eventInfo.Data.MerchantName);
        body = body.replace(productCategoryPlaceHolder, eventInfo.Data.PaymentGatewayCategoryCodeName);
        authorizationRequest.attachment = {
            content_type: "application/vnd.klarna.internal.emd-v2+json",
            body: body
        };

        authorizationRequest.merchant_reference2 = eventInfo.Data.MerchantName;
    }

    return authorizationRequest;
};

// #endregion Klarna Direct

// #region Lazy Load Lib
!function (t, n) { "object" == typeof exports && "undefined" != typeof module ? module.exports = n() : "function" == typeof define && define.amd ? define(n) : (t = "undefined" != typeof globalThis ? globalThis : t || self).LazyLoad = n() }(this, (function () { "use strict"; function t() { return (t = Object.assign || function (t) { for (var n = 1; n < arguments.length; n++) { var e = arguments[n]; for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]) } return t }).apply(this, arguments) } var n = "undefined" != typeof window, e = n && !("onscroll" in window) || "undefined" != typeof navigator && /(gle|ing|ro)bot|crawl|spider/i.test(navigator.userAgent), i = n && "IntersectionObserver" in window, o = n && "classList" in document.createElement("p"), r = n && window.devicePixelRatio > 1, a = { elements_selector: ".lazy", container: e || n ? document : null, threshold: 300, thresholds: null, data_src: "src", data_srcset: "srcset", data_sizes: "sizes", data_bg: "bg", data_bg_hidpi: "bg-hidpi", data_bg_multi: "bg-multi", data_bg_multi_hidpi: "bg-multi-hidpi", data_poster: "poster", class_applied: "applied", class_loading: "loading", class_loaded: "loaded", class_error: "error", class_entered: "entered", class_exited: "exited", unobserve_completed: !0, unobserve_entered: !1, cancel_on_exit: !0, callback_enter: null, callback_exit: null, callback_applied: null, callback_loading: null, callback_loaded: null, callback_error: null, callback_finish: null, callback_cancel: null, use_native: !1 }, c = function (n) { return t({}, a, n) }, s = function (t, n) { var e, i = "LazyLoad::Initialized", o = new t(n); try { e = new CustomEvent(i, { detail: { instance: o } }) } catch (t) { (e = document.createEvent("CustomEvent")).initCustomEvent(i, !1, !1, { instance: o }) } window.dispatchEvent(e) }, l = "loading", u = "loaded", d = "applied", f = "error", _ = "native", g = "data-", v = "ll-status", b = function (t, n) { return t.getAttribute(g + n) }, p = function (t) { return b(t, v) }, h = function (t, n) { return function (t, n, e) { var i = "data-ll-status"; null !== e ? t.setAttribute(i, e) : t.removeAttribute(i) }(t, 0, n) }, m = function (t) { return h(t, null) }, E = function (t) { return null === p(t) }, y = function (t) { return p(t) === _ }, A = [l, u, d, f], I = function (t, n, e, i) { t && (void 0 === i ? void 0 === e ? t(n) : t(n, e) : t(n, e, i)) }, L = function (t, n) { o ? t.classList.add(n) : t.className += (t.className ? " " : "") + n }, w = function (t, n) { o ? t.classList.remove(n) : t.className = t.className.replace(new RegExp("(^|\\s+)" + n + "(\\s+|$)"), " ").replace(/^\s+/, "").replace(/\s+$/, "") }, k = function (t) { return t.llTempImage }, O = function (t, n) { if (n) { var e = n._observer; e && e.unobserve(t) } }, x = function (t, n) { t && (t.loadingCount += n) }, z = function (t, n) { t && (t.toLoadCount = n) }, C = function (t) { for (var n, e = [], i = 0; n = t.children[i]; i += 1)"SOURCE" === n.tagName && e.push(n); return e }, N = function (t, n, e) { e && t.setAttribute(n, e) }, M = function (t, n) { t.removeAttribute(n) }, R = function (t) { return !!t.llOriginalAttrs }, T = function (t) { if (!R(t)) { var n = {}; n.src = t.getAttribute("src"), n.srcset = t.getAttribute("srcset"), n.sizes = t.getAttribute("sizes"), t.llOriginalAttrs = n } }, G = function (t) { if (R(t)) { var n = t.llOriginalAttrs; N(t, "src", n.src), N(t, "srcset", n.srcset), N(t, "sizes", n.sizes) } }, j = function (t, n) { N(t, "sizes", b(t, n.data_sizes)), N(t, "srcset", b(t, n.data_srcset)), N(t, "src", b(t, n.data_src)) }, D = function (t) { M(t, "src"), M(t, "srcset"), M(t, "sizes") }, F = function (t, n) { var e = t.parentNode; e && "PICTURE" === e.tagName && C(e).forEach(n) }, P = { IMG: function (t, n) { F(t, (function (t) { T(t), j(t, n) })), T(t), j(t, n) }, IFRAME: function (t, n) { N(t, "src", b(t, n.data_src)) }, VIDEO: function (t, n) { !function (t, e) { C(t).forEach((function (t) { N(t, "src", b(t, n.data_src)) })) }(t), N(t, "poster", b(t, n.data_poster)), N(t, "src", b(t, n.data_src)), t.load() } }, S = function (t, n) { var e = P[t.tagName]; e && e(t, n) }, V = function (t, n, e) { x(e, 1), L(t, n.class_loading), h(t, l), I(n.callback_loading, t, e) }, U = ["IMG", "IFRAME", "VIDEO"], $ = function (t, n) { !n || function (t) { return t.loadingCount > 0 }(n) || function (t) { return t.toLoadCount > 0 }(n) || I(t.callback_finish, n) }, q = function (t, n, e) { t.addEventListener(n, e), t.llEvLisnrs[n] = e }, H = function (t, n, e) { t.removeEventListener(n, e) }, B = function (t) { return !!t.llEvLisnrs }, J = function (t) { if (B(t)) { var n = t.llEvLisnrs; for (var e in n) { var i = n[e]; H(t, e, i) } delete t.llEvLisnrs } }, K = function (t, n, e) { !function (t) { delete t.llTempImage }(t), x(e, -1), function (t) { t && (t.toLoadCount -= 1) }(e), w(t, n.class_loading), n.unobserve_completed && O(t, e) }, Q = function (t, n, e) { var i = k(t) || t; B(i) || function (t, n, e) { B(t) || (t.llEvLisnrs = {}); var i = "VIDEO" === t.tagName ? "loadeddata" : "load"; q(t, i, n), q(t, "error", e) }(i, (function (o) { !function (t, n, e, i) { var o = y(n); K(n, e, i), L(n, e.class_loaded), h(n, u), I(e.callback_loaded, n, i), o || $(e, i) }(0, t, n, e), J(i) }), (function (o) { !function (t, n, e, i) { var o = y(n); K(n, e, i), L(n, e.class_error), h(n, f), I(e.callback_error, n, i), o || $(e, i) }(0, t, n, e), J(i) })) }, W = function (t, n, e) { !function (t) { t.llTempImage = document.createElement("IMG") }(t), Q(t, n, e), function (t, n, e) { var i = b(t, n.data_bg), o = b(t, n.data_bg_hidpi), a = r && o ? o : i; a && (t.style.backgroundImage = 'url("'.concat(a, '")'), k(t).setAttribute("src", a), V(t, n, e)) }(t, n, e), function (t, n, e) { var i = b(t, n.data_bg_multi), o = b(t, n.data_bg_multi_hidpi), a = r && o ? o : i; a && (t.style.backgroundImage = a, function (t, n, e) { L(t, n.class_applied), h(t, d), n.unobserve_completed && O(t, n), I(n.callback_applied, t, e) }(t, n, e)) }(t, n, e) }, X = function (t, n, e) { !function (t) { return U.indexOf(t.tagName) > -1 }(t) ? W(t, n, e) : function (t, n, e) { Q(t, n, e), S(t, n), V(t, n, e) }(t, n, e) }, Y = ["IMG", "IFRAME"], Z = function (t) { return t.use_native && "loading" in HTMLImageElement.prototype }, tt = function (t, n, e) { t.forEach((function (t) { return function (t) { return t.isIntersecting || t.intersectionRatio > 0 }(t) ? function (t, n, e, i) { var o = function (t) { return A.indexOf(p(t)) >= 0 }(t); h(t, "entered"), L(t, e.class_entered), w(t, e.class_exited), function (t, n, e) { n.unobserve_entered && O(t, e) }(t, e, i), I(e.callback_enter, t, n, i), o || X(t, e, i) }(t.target, t, n, e) : function (t, n, e, i) { E(t) || (L(t, e.class_exited), function (t, n, e, i) { e.cancel_on_exit && function (t) { return p(t) === l }(t) && "IMG" === t.tagName && (J(t), function (t) { F(t, (function (t) { D(t) })), D(t) }(t), function (t) { F(t, (function (t) { G(t) })), G(t) }(t), w(t, e.class_loading), x(i, -1), m(t), I(e.callback_cancel, t, n, i)) }(t, n, e, i), I(e.callback_exit, t, n, i)) }(t.target, t, n, e) })) }, nt = function (t) { return Array.prototype.slice.call(t) }, et = function (t) { return t.container.querySelectorAll(t.elements_selector) }, it = function (t) { return function (t) { return p(t) === f }(t) }, ot = function (t, n) { return function (t) { return nt(t).filter(E) }(t || et(n)) }, rt = function (t, e) { var o = c(t); this._settings = o, this.loadingCount = 0, function (t, n) { i && !Z(t) && (n._observer = new IntersectionObserver((function (e) { tt(e, t, n) }), function (t) { return { root: t.container === document ? null : t.container, rootMargin: t.thresholds || t.threshold + "px" } }(t))) }(o, this), function (t, e) { n && window.addEventListener("online", (function () { !function (t, n) { var e; (e = et(t), nt(e).filter(it)).forEach((function (n) { w(n, t.class_error), m(n) })), n.update() }(t, e) })) }(o, this), this.update(e) }; return rt.prototype = { update: function (t) { var n, o, r = this._settings, a = ot(t, r); z(this, a.length), !e && i ? Z(r) ? function (t, n, e) { t.forEach((function (t) { -1 !== Y.indexOf(t.tagName) && (t.setAttribute("loading", "lazy"), function (t, n, e) { Q(t, n, e), S(t, n), h(t, _) }(t, n, e)) })), z(e, 0) }(a, r, this) : (o = a, function (t) { t.disconnect() }(n = this._observer), function (t, n) { n.forEach((function (n) { t.observe(n) })) }(n, o)) : this.loadAll(a) }, destroy: function () { this._observer && this._observer.disconnect(), et(this._settings).forEach((function (t) { delete t.llOriginalAttrs })), delete this._observer, delete this._settings, delete this.loadingCount, delete this.toLoadCount }, loadAll: function (t) { var n = this, e = this._settings; ot(t, e).forEach((function (t) { O(t, n), X(t, e, n) })) } }, rt.load = function (t, n) { var e = c(n); X(t, e) }, rt.resetStatus = function (t) { m(t) }, n && function (t, n) { if (n) if (n.length) for (var e, i = 0; e = n[i]; i += 1)s(t, e); else s(t, n) }(rt, window.lazyLoadOptions), rt }));
// #endregion

// #region Payments Validation core Lib

/*VALIDATION PAYMENTS*/
var payment =
/******/ (function (modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if (installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
                /******/
            }
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
                /******/
            };
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
            /******/
        }
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function (exports, name, getter) {
/******/ 		if (!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
                /******/
            }
            /******/
        };
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function (exports) {
/******/ 		if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
                /******/
            }
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
            /******/
        };
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function (value, mode) {
/******/ 		if (mode & 1) value = __webpack_require__(value);
/******/ 		if (mode & 8) return value;
/******/ 		if ((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if (mode & 2 && typeof value != 'string') for (var key in value) __webpack_require__.d(ns, key, function (key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
            /******/
        };
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function (module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
            /******/
        };
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function (object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
        /******/
    })
/************************************************************************/
/******/([
/* 0 */
/***/ (function (module, exports, __webpack_require__) {

            var Payment, QJ, V2, cardFromNumber, cardFromType, cards, cursorSafeAssignValue, defaultFormat, formatBackCardNumber, formatBackExpiry, formatCardNumber, formatExpiry, formatForwardExpiry, formatForwardSlash, formatMonthExpiry, globalThis, hasTextSelected, luhnCheck, reFormatCardNumber, restrictCVC, restrictCardNumber, restrictCombinedExpiry, restrictExpiry, restrictMonthExpiry, restrictNumeric, restrictYearExpiry, setCardType,
                indexOf = [].indexOf || function (item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

            globalThis = __webpack_require__(1)();

            QJ = __webpack_require__(4);

            V2 = __webpack_require__(5);

            defaultFormat = /(\d{1,4})/g;

            cards = [
                {
                    type: 'americanexpress',
                    pattern: /^3[47]/,
                    format: /(\d{1,4})(\d{1,6})?(\d{1,5})?/,
                    length: [15],
                    cvcLength: [4],
                    luhn: true
                }, {
                    type: 'dankort',
                    pattern: /^5019/,
                    format: defaultFormat,
                    length: [16],
                    cvcLength: [3],
                    luhn: true
                }, {
                    type: 'diners',
                    pattern: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/, //FROM GE CHECKOUT
                    format: /(\d{1,4})(\d{1,6})?(\d{1,4})?/,
                    length: [14],
                    cvcLength: [3],
                    luhn: true
                }, {
                    type: 'discover',
                    pattern: /^(6011|64[4-9]|65)/,//FROM GE CHECKOUT
                    format: defaultFormat,
                    length: [16],
                    cvcLength: [3],
                    luhn: true
                }, {
                    type: 'elo',
                    pattern: /^401178|^401179|^431274|^438935|^451416|^457393|^457631|^457632|^504175|^627780|^636297|^636369|^636368|^(506699|5067[0-6]\d|50677[0-8])|^(50900\d|5090[1-9]\d|509[1-9]\d{2})|^65003[1-3]|^(65003[5-9]|65004\d|65005[0-1])|^(65040[5-9]|6504[1-3]\d)|^(65048[5-9]|65049\d|6505[0-2]\d|65053[0-8])|^(65054[1-9]|6505[5-8]\d|65059[0-8])|^(65070\d|65071[0-8])|^65072[0-7]|^(65090[1-9]|65091\d|650920)|^(65165[2-9]|6516[6-7]\d)|^(65500\d|65501\d)|^(65502[1-9]|6550[3-4]\d|65505[0-8])|^(65092[1-9]|65097[0-8])/,
                    format: defaultFormat,
                    length: [16],
                    cvcLength: [3],
                    luhn: true
                }, {
                    type: 'hipercard',
                    pattern: /^(384100|384140|384160|606282|637095|637568|60(?!11))/,
                    format: defaultFormat,
                    length: [14, 15, 16, 17, 18, 19],
                    cvcLength: [3],
                    luhn: true
                }, {
                    type: 'jcb',
                    pattern: /^35(2[89]|[3-8][0-9])/, //FROM GE CHECKOUT
                    format: defaultFormat,
                    length: [16, 19],
                    cvcLength: [3],
                    luhn: true
                }, {
                    type: 'laser',
                    pattern: /^(6304|670[69]|6771)/, //FROM GE CHECKOUT
                    format: defaultFormat,
                    length: [16, 17, 18, 19],
                    cvcLength: [3],
                    luhn: true
                }, {
                    type: 'maestro',
                    pattern: /^(5018|5020|5038|6304|6759|676[1-3])/, //FROM GE CHECKOUT
                    format: defaultFormat,
                    length: [12, 13, 14, 15, 16, 17, 18, 19],
                    cvcLength: [3],
                    luhn: true
                }, {
                    type: 'mastercard',
                    pattern: /^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$/, //FROM GE CHECKOUT
                    format: defaultFormat,
                    length: [16],
                    cvcLength: [3],
                    luhn: true
                }, {
                    type: 'troy',
                    pattern: /^9792/,
                    format: defaultFormat,
                    length: [16],
                    cvcLength: [3],
                    luhn: true
                }, {
                    type: 'unionpay',
                    pattern: /^62/,
                    format: defaultFormat,
                    length: [16, 17, 18, 19],
                    cvcLength: [3],
                    luhn: false
                }, {
                    type: 'visaelectron',
                    pattern: /^(4026|417500|4508|4844|491(3|7))/, //FROM GE CHECKOUT
                    format: defaultFormat,
                    length: [16],
                    cvcLength: [3],
                    luhn: true
                }, {
                    type: 'visa',
                    pattern: /^4/, //FROM GE CHECKOUT
                    format: defaultFormat,
                    length: [13, 16],
                    cvcLength: [3],
                    luhn: true
                }, {
                    type: 'mir',
                    pattern: /^220[0-4][0-9]{0,12}$/, //FROM GE CHECKOUT
                    format: defaultFormat,
                    length: [16, 19],
                    cvcLength: [3],
                    luhn: true
                }
            ];

            cardFromNumber = function (num) {
                var card, foundCard, j, len, match;
                num = (num + '').replace(/\D/g, '');
                foundCard = void 0;
                for (j = 0, len = cards.length; j < len; j++) {
                    card = cards[j];
                    if (match = num.match(card.pattern)) {
                        if (!foundCard || match[0].length > foundCard[1][0].length) {
                            foundCard = [card, match];
                        }
                    }
                }
                return foundCard && foundCard[0];
            };

            cardFromType = function (type) {
                var card, j, len;
                for (j = 0, len = cards.length; j < len; j++) {
                    card = cards[j];
                    if (card.type === type) {
                        return card;
                    }
                }
            };

            luhnCheck = function (num) {
                var digit, digits, j, len, odd, sum;
                odd = true;
                sum = 0;
                digits = (num + '').split('').reverse();
                for (j = 0, len = digits.length; j < len; j++) {
                    digit = digits[j];
                    digit = parseInt(digit, 10);
                    if ((odd = !odd)) {
                        digit *= 2;
                    }
                    if (digit > 9) {
                        digit -= 9;
                    }
                    sum += digit;
                }
                return sum % 10 === 0;
            };

            hasTextSelected = function (target) {
                var e, ref;
                try {
                    if ((target.selectionStart != null) && target.selectionStart !== target.selectionEnd) {
                        return true;
                    }
                    if ((typeof document !== "undefined" && document !== null ? (ref = document.selection) != null ? ref.createRange : void 0 : void 0) != null) {
                        if (document.selection.createRange().text) {
                            return true;
                        }
                    }
                } catch (error) {
                    e = error;
                }
                return false;
            };

            reFormatCardNumber = function (e) {
                return setTimeout((function (_this) {
                    return function () {
                        var target, value;
                        target = e.target;
                        value = QJ.val(target);
                        value = Payment.fns.formatCardNumber(value);
                        cursorSafeAssignValue(target, value);
                        return QJ.trigger(target, 'change');
                    };
                })(this));
            };

            formatCardNumber = function (maxLength) {
                return function (e) {
                    var card, digit, i, j, len, length, re, target, upperLength, upperLengths, value;
                    if (e.which > 0) {
                        digit = String.fromCharCode(e.which);
                        value = QJ.val(e.target) + digit;
                    } else {
                        digit = e.data;
                        value = QJ.val(e.target);
                    }
                    if (!/^\d+$/.test(digit)) {
                        return;
                    }
                    target = e.target;
                    card = cardFromNumber(value);
                    length = (value.replace(/\D/g, '')).length;
                    upperLengths = [16];
                    if (card) {
                        upperLengths = card.length;
                    }
                    if (maxLength) {
                        upperLengths = upperLengths.filter(function (x) {
                            return x <= maxLength;
                        });
                    }
                    for (i = j = 0, len = upperLengths.length; j < len; i = ++j) {
                        upperLength = upperLengths[i];
                        if (length >= upperLength && upperLengths[i + 1]) {
                            continue;
                        }
                        if (length >= upperLength) {
                            return;
                        }
                    }
                    if (hasTextSelected(target)) {
                        return;
                    }
                    if (card && card.type === 'americanexpress') {
                        re = /^(\d{4}|\d{4}\s\d{6})$/;
                    } else {
                        re = /(?:^|\s)(\d{4})$/;
                    }
                    value = value.substring(0, value.length - 1);
                    if (re.test(value)) {
                        e.preventDefault();
                        QJ.val(target, value + ' ' + digit);
                        return QJ.trigger(target, 'change');
                    }
                };
            };

            formatBackCardNumber = function (e) {
                var target, value;
                target = e.target;
                value = QJ.val(target);
                if (e.meta) {
                    return;
                }
                if (e.which !== 8) {
                    return;
                }
                if (hasTextSelected(target)) {
                    return;
                }
                if (/\d\s$/.test(value)) {
                    e.preventDefault();
                    QJ.val(target, value.replace(/\d\s$/, ''));
                    return QJ.trigger(target, 'change');
                } else if (/\s\d?$/.test(value)) {
                    e.preventDefault();
                    QJ.val(target, value.replace(/\s\d?$/, ''));
                    return QJ.trigger(target, 'change');
                }
            };

            formatExpiry = function (e) {
                var digit, target, val;
                target = e.target;
                if (e.which > 0) {
                    digit = String.fromCharCode(e.which);
                    val = QJ.val(target) + digit;
                } else {
                    digit = e.data;
                    val = QJ.val(target);
                }
                if (!/^\d+$/.test(digit)) {
                    return;
                }
                if (/^\d$/.test(val) && (val !== '0' && val !== '1')) {
                    e.preventDefault();
                    QJ.val(target, "0" + val + " / ");
                    return QJ.trigger(target, 'change');
                } else if (/^\d\d$/.test(val)) {
                    e.preventDefault();
                    QJ.val(target, val + " / ");
                    return QJ.trigger(target, 'change');
                }
            };

            formatMonthExpiry = function (e) {
                var digit, target, val;
                digit = String.fromCharCode(e.which);
                if (!/^\d+$/.test(digit)) {
                    return;
                }
                target = e.target;
                val = QJ.val(target) + digit;
                if (/^\d$/.test(val) && (val !== '0' && val !== '1')) {
                    e.preventDefault();
                    QJ.val(target, "0" + val);
                    return QJ.trigger(target, 'change');
                } else if (/^\d\d$/.test(val)) {
                    e.preventDefault();
                    QJ.val(target, "" + val);
                    return QJ.trigger(target, 'change');
                }
            };

            formatForwardExpiry = function (e) {
                var digit, target, val;
                digit = String.fromCharCode(e.which);
                if (!/^\d+$/.test(digit)) {
                    return;
                }
                target = e.target;
                val = QJ.val(target);
                if (/^\d\d$/.test(val)) {
                    QJ.val(target, val + " / ");
                    return QJ.trigger(target, 'change');
                }
            };

            formatForwardSlash = function (e) {
                var slash, target, val;
                slash = String.fromCharCode(e.which);
                if (slash !== '/') {
                    return;
                }
                target = e.target;
                val = QJ.val(target);
                if (/^\d$/.test(val) && val !== '0') {
                    QJ.val(target, "0" + val + " / ");
                    return QJ.trigger(target, 'change');
                }
            };

            formatBackExpiry = function (e) {
                var target, value;
                if (e.metaKey) {
                    return;
                }
                target = e.target;
                value = QJ.val(target);
                if (e.which !== 8) {
                    return;
                }
                if (hasTextSelected(target)) {
                    return;
                }
                if (/\d(\s|\/)+$/.test(value)) {
                    e.preventDefault();
                    QJ.val(target, value.replace(/\d(\s|\/)*$/, ''));
                    return QJ.trigger(target, 'change');
                } else if (/\s\/\s?\d?$/.test(value)) {
                    e.preventDefault();
                    QJ.val(target, value.replace(/\s\/\s?\d?$/, ''));
                    return QJ.trigger(target, 'change');
                }
            };

            restrictNumeric = function (e) {
                var input;
                if (e.metaKey || e.ctrlKey) {
                    return true;
                }
                if (e.which === 32) {
                    return e.preventDefault();
                }
                if (e.which === 0) {
                    return true;
                }
                if (e.which < 33) {
                    return true;
                }
                input = String.fromCharCode(e.which);
                if (!/[\d\s]/.test(input)) {
                    return e.preventDefault();
                }
            };

            restrictCardNumber = function (maxLength) {
                return function (e) {
                    var card, digit, length, target, value;
                    target = e.target;
                    digit = String.fromCharCode(e.which);
                    if (!/^\d+$/.test(digit)) {
                        return;
                    }
                    if (hasTextSelected(target)) {
                        return;
                    }
                    value = (QJ.val(target) + digit).replace(/\D/g, '');
                    card = cardFromNumber(value);
                    length = 16;
                    if (card) {
                        length = card.length[card.length.length - 1];
                    }
                    if (maxLength) {
                        length = maxLength;
                    }
                    if (!(value.length <= length)) {
                        return e.preventDefault();
                    }
                };
            };

            restrictExpiry = function (e, length) {
                var digit, target, value;
                target = e.target;
                digit = String.fromCharCode(e.which);
                if (!/^\d+$/.test(digit)) {
                    return;
                }
                if (hasTextSelected(target)) {
                    return;
                }
                value = QJ.val(target) + digit;
                value = value.replace(/\D/g, '');
                if (value.length > length) {
                    return e.preventDefault();
                }
            };

            restrictCombinedExpiry = function (e) {
                return restrictExpiry(e, 6);
            };

            restrictMonthExpiry = function (e) {
                return restrictExpiry(e, 2);
            };

            restrictYearExpiry = function (e) {
                return restrictExpiry(e, 4);
            };

            restrictCVC = function (e) {
                var digit, target, val;
                target = e.target;
                digit = String.fromCharCode(e.which);
                if (!/^\d+$/.test(digit)) {
                    return;
                }
                if (hasTextSelected(target)) {
                    return;
                }
                val = QJ.val(target) + digit;
                if (!(val.length <= 4)) {
                    return e.preventDefault();
                }
            };

            setCardType = function (e) {
                var allTypes, card, cardType, target, val;
                target = e.target;
                val = QJ.val(target);
                cardType = Payment.fns.cardType(val) || 'unknown';
                if (!QJ.hasClass(target, cardType)) {
                    allTypes = (function () {
                        var j, len, results;
                        results = [];
                        for (j = 0, len = cards.length; j < len; j++) {
                            card = cards[j];
                            results.push(card.type);
                        }
                        return results;
                    })();
                    QJ.removeClass(target, 'unknown');
                    QJ.removeClass(target, allTypes.join(' '));
                    QJ.addClass(target, cardType);
                    QJ.toggleClass(target, 'identified', cardType !== 'unknown');
                    return QJ.trigger(target, 'payment.cardType', cardType);
                }
            };

            cursorSafeAssignValue = function (target, value) {
                var selectionEnd;
                selectionEnd = target.selectionEnd;
                QJ.val(target, value);
                if (selectionEnd) {
                    return target.selectionEnd = selectionEnd;
                }
            };

            Payment = (function () {
                function Payment() { }

                Payment.J = QJ;

                Payment.V2 = V2;

                Payment.fns = {
                    cardExpiryVal: function (value) {
                        var month, prefix, ref, year;
                        value = value.replace(/\s/g, '');
                        ref = value.split('/', 2), month = ref[0], year = ref[1];
                        if ((year != null ? year.length : void 0) === 2 && /^\d+$/.test(year)) {
                            prefix = (new Date).getFullYear();
                            prefix = prefix.toString().slice(0, 2);
                            year = prefix + year;
                        }
                        month = parseInt(month, 10);
                        year = parseInt(year, 10);
                        return {
                            month: month,
                            year: year
                        };
                    },
                    validateCardNumber: function (num) {
                        var card, ref;
                        num = (num + '').replace(/\s+|-/g, '');
                        if (!/^\d+$/.test(num)) {
                            return false;
                        }
                        card = cardFromNumber(num);
                        if (!card) {
                            return false;
                        }
                        return (ref = num.length, indexOf.call(card.length, ref) >= 0) && (card.luhn === false || luhnCheck(num));
                    },
                    validateCardExpiry: function (month, year) {
                        var currentTime, expiry, prefix, ref, ref1;
                        if (typeof month === 'object' && 'month' in month) {
                            ref = month, month = ref.month, year = ref.year;
                        } else if (typeof month === 'string' && indexOf.call(month, '/') >= 0) {
                            ref1 = Payment.fns.cardExpiryVal(month), month = ref1.month, year = ref1.year;
                        }
                        if (!(month && year)) {
                            return false;
                        }
                        month = QJ.trim(month);
                        year = QJ.trim(year);
                        if (!/^\d+$/.test(month)) {
                            return false;
                        }
                        if (!/^\d+$/.test(year)) {
                            return false;
                        }
                        month = parseInt(month, 10);
                        if (!(month && month <= 12)) {
                            return false;
                        }
                        if (year.length === 2) {
                            prefix = (new Date).getFullYear();
                            prefix = prefix.toString().slice(0, 2);
                            year = prefix + year;
                        }
                        expiry = new Date(year, month);
                        currentTime = new Date;
                        expiry.setMonth(expiry.getMonth() - 1);
                        expiry.setMonth(expiry.getMonth() + 1, 1);
                        return expiry > currentTime;
                    },
                    validateCardCVC: function (cvc, type) {
                        var ref, ref1;
                        cvc = QJ.trim(cvc);
                        if (!/^\d+$/.test(cvc)) {
                            return false;
                        }
                        if (type && cardFromType(type)) {
                            return ref = cvc.length, indexOf.call((ref1 = cardFromType(type)) != null ? ref1.cvcLength : void 0, ref) >= 0;
                        } else {
                            return cvc.length >= 3 && cvc.length <= 4;
                        }
                    },
                    cardType: function (num) {
                        var ref;
                        if (!num) {
                            return null;
                        }
                        return ((ref = cardFromNumber(num)) != null ? ref.type : void 0) || null;
                    },
                    formatCardNumber: function (num) {
                        var card, groups, ref, upperLength;
                        card = cardFromNumber(num);
                        if (!card) {
                            return num;
                        }
                        upperLength = card.length[card.length.length - 1];
                        num = num.replace(/\D/g, '');
                        num = num.slice(0, upperLength);
                        if (card.format.global) {
                            return (ref = num.match(card.format)) != null ? ref.join(' ') : void 0;
                        } else {
                            groups = card.format.exec(num);
                            if (groups == null) {
                                return;
                            }
                            groups.shift();
                            groups = groups.filter(function (n) {
                                return n;
                            });
                            return groups.join(' ');
                        }
                    },
                    validateLuhn: function (num) {
                        num = (num + '').replace(/\s+|-/g, '');
                        return luhnCheck(num);
                    }
                };

                Payment.restrictNumeric = function (el) {
                    QJ.on(el, 'keypress', restrictNumeric);
                    return QJ.on(el, 'input', restrictNumeric);
                };

                Payment.cardExpiryVal = function (el) {
                    return Payment.fns.cardExpiryVal(QJ.val(el));
                };

                Payment.formatCardCVC = function (el) {
                    Payment.restrictNumeric(el);
                    QJ.on(el, 'keypress', restrictCVC);
                    QJ.on(el, 'input', restrictCVC);
                    return el;
                };

                Payment.formatCardExpiry = function (el) {
                    var month, year;
                    Payment.restrictNumeric(el);
                    if (el.length && el.length === 2) {
                        month = el[0], year = el[1];
                        this.formatCardExpiryMultiple(month, year);
                    } else {
                        QJ.on(el, 'keypress', restrictCombinedExpiry);
                        QJ.on(el, 'keypress', formatExpiry);
                        QJ.on(el, 'keypress', formatForwardSlash);
                        QJ.on(el, 'keypress', formatForwardExpiry);
                        QJ.on(el, 'keydown', formatBackExpiry);
                        QJ.on(el, 'input', formatExpiry);
                    }
                    return el;
                };

                Payment.formatCardExpiryMultiple = function (month, year) {
                    QJ.on(month, 'keypress', restrictMonthExpiry);
                    QJ.on(month, 'keypress', formatMonthExpiry);
                    QJ.on(month, 'input', formatMonthExpiry);
                    QJ.on(year, 'keypress', restrictYearExpiry);
                    return QJ.on(year, 'input', restrictYearExpiry);
                };

                Payment.formatCardNumber = function (el, maxLength) {
                    Payment.restrictNumeric(el);
                    QJ.on(el, 'keypress', restrictCardNumber(maxLength));
                    QJ.on(el, 'keypress', formatCardNumber(maxLength));
                    QJ.on(el, 'keydown', formatBackCardNumber);
                    QJ.on(el, 'keyup blur', setCardType);
                    QJ.on(el, 'paste', reFormatCardNumber);
                    QJ.on(el, 'input', formatCardNumber(maxLength));
                    return el;
                };

                Payment.getCardArray = function () {
                    return cards;
                };

                Payment.setCardArray = function (cardArray) {
                    cards = cardArray;
                    return true;
                };

                Payment.addToCardArray = function (cardObject) {
                    return cards.push(cardObject);
                };

                Payment.removeFromCardArray = function (type) {
                    var key, value;
                    for (key in cards) {
                        value = cards[key];
                        if (value.type === type) {
                            cards.splice(key, 1);
                        }
                    }
                    return true;
                };

                return Payment;

            })();

            module.exports = Payment;

            globalThis.Payment = Payment;


            /***/
        }),
/* 1 */
/***/ (function (module, exports, __webpack_require__) {

            "use strict";
/* WEBPACK VAR INJECTION */(function (global) {

                var implementation = __webpack_require__(3);

                module.exports = function getPolyfill() {
                    if (typeof global !== 'object' || !global || global.Math !== Math || global.Array !== Array) {
                        return implementation;
                    }
                    return global;
                };

                /* WEBPACK VAR INJECTION */
            }.call(this, __webpack_require__(2)))

            /***/
        }),
/* 2 */
/***/ (function (module, exports) {

            var g;

            // This works in non-strict mode
            g = (function () {
                return this;
            })();

            try {
                // This works if eval is allowed (see CSP)
                g = g || new Function("return this")();
            } catch (e) {
                // This works if the window reference is available
                if (typeof window === "object") g = window;
            }

            // g can still be undefined, but nothing to do about it...
            // We return undefined, instead of nothing here, so it's
            // easier to handle this case. if(!global) { ...}

            module.exports = g;


            /***/
        }),
/* 3 */
/***/ (function (module, exports, __webpack_require__) {

            "use strict";
            /* eslint no-negated-condition: 0, no-new-func: 0 */



            if (typeof self !== 'undefined') {
                module.exports = self;
            } else if (typeof window !== 'undefined') {
                module.exports = window;
            } else {
                module.exports = Function('return this')();
            }


            /***/
        }),
/* 4 */
/***/ (function (module, exports) {

            // Generated by CoffeeScript 1.10.0
            (function () {
                var QJ, rreturn, rtrim;

                QJ = function (selector) {
                    if (QJ.isDOMElement(selector)) {
                        return selector;
                    }
                    return document.querySelectorAll(selector);
                };

                QJ.isDOMElement = function (el) {
                    return el && (el.nodeName != null);
                };

                rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

                QJ.trim = function (text) {
                    if (text === null) {
                        return "";
                    } else {
                        return (text + "").replace(rtrim, "");
                    }
                };

                rreturn = /\r/g;

                QJ.val = function (el, val) {
                    var ret;
                    if (arguments.length > 1) {
                        return el.value = val;
                    } else {
                        ret = el.value;
                        if (typeof ret === "string") {
                            return ret.replace(rreturn, "");
                        } else {
                            if (ret === null) {
                                return "";
                            } else {
                                return ret;
                            }
                        }
                    }
                };

                QJ.preventDefault = function (eventObject) {
                    if (typeof eventObject.preventDefault === "function") {
                        eventObject.preventDefault();
                        return;
                    }
                    eventObject.returnValue = false;
                    return false;
                };

                QJ.normalizeEvent = function (e) {
                    var original;
                    original = e;
                    e = {
                        which: original.which != null ? original.which : void 0,
                        target: original.target || original.srcElement,
                        preventDefault: function () {
                            return QJ.preventDefault(original);
                        },
                        originalEvent: original,
                        data: original.data || original.detail
                    };
                    if (e.which == null) {
                        e.which = original.charCode != null ? original.charCode : original.keyCode;
                    }
                    return e;
                };

                QJ.on = function (element, eventName, callback) {
                    var el, i, j, len, len1, multEventName, originalCallback, ref;
                    if (element.length) {
                        for (i = 0, len = element.length; i < len; i++) {
                            el = element[i];
                            QJ.on(el, eventName, callback);
                        }
                        return;
                    }
                    if (eventName.match(" ")) {
                        ref = eventName.split(" ");
                        for (j = 0, len1 = ref.length; j < len1; j++) {
                            multEventName = ref[j];
                            QJ.on(element, multEventName, callback);
                        }
                        return;
                    }
                    originalCallback = callback;
                    callback = function (e) {
                        e = QJ.normalizeEvent(e);
                        return originalCallback(e);
                    };
                    if (element.addEventListener) {
                        return element.addEventListener(eventName, callback, false);
                    }
                    if (element.attachEvent) {
                        eventName = "on" + eventName;
                        return element.attachEvent(eventName, callback);
                    }
                    element['on' + eventName] = callback;
                };

                QJ.addClass = function (el, className) {
                    var e;
                    if (el.length) {
                        return (function () {
                            var i, len, results;
                            results = [];
                            for (i = 0, len = el.length; i < len; i++) {
                                e = el[i];
                                results.push(QJ.addClass(e, className));
                            }
                            return results;
                        })();
                    }
                    if (el.classList) {
                        return el.classList.add(className);
                    } else {
                        return el.className += ' ' + className;
                    }
                };

                QJ.hasClass = function (el, className) {
                    var e, hasClass, i, len;
                    if (el.length) {
                        hasClass = true;
                        for (i = 0, len = el.length; i < len; i++) {
                            e = el[i];
                            hasClass = hasClass && QJ.hasClass(e, className);
                        }
                        return hasClass;
                    }
                    if (el.classList) {
                        return el.classList.contains(className);
                    } else {
                        return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
                    }
                };

                QJ.removeClass = function (el, className) {
                    var cls, e, i, len, ref, results;
                    if (el.length) {
                        return (function () {
                            var i, len, results;
                            results = [];
                            for (i = 0, len = el.length; i < len; i++) {
                                e = el[i];
                                results.push(QJ.removeClass(e, className));
                            }
                            return results;
                        })();
                    }
                    if (el.classList) {
                        ref = className.split(' ');
                        results = [];
                        for (i = 0, len = ref.length; i < len; i++) {
                            cls = ref[i];
                            results.push(el.classList.remove(cls));
                        }
                        return results;
                    } else {
                        return el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
                    }
                };

                QJ.toggleClass = function (el, className, bool) {
                    var e;
                    if (el.length) {
                        return (function () {
                            var i, len, results;
                            results = [];
                            for (i = 0, len = el.length; i < len; i++) {
                                e = el[i];
                                results.push(QJ.toggleClass(e, className, bool));
                            }
                            return results;
                        })();
                    }
                    if (bool) {
                        if (!QJ.hasClass(el, className)) {
                            return QJ.addClass(el, className);
                        }
                    } else {
                        return QJ.removeClass(el, className);
                    }
                };

                QJ.append = function (el, toAppend) {
                    var e;
                    if (el.length) {
                        return (function () {
                            var i, len, results;
                            results = [];
                            for (i = 0, len = el.length; i < len; i++) {
                                e = el[i];
                                results.push(QJ.append(e, toAppend));
                            }
                            return results;
                        })();
                    }
                    return el.insertAdjacentHTML('beforeend', toAppend);
                };

                QJ.find = function (el, selector) {
                    if (el instanceof NodeList || el instanceof Array) {
                        el = el[0];
                    }
                    return el.querySelectorAll(selector);
                };

                QJ.trigger = function (el, name, data) {
                    var e, error, ev;
                    try {
                        ev = new CustomEvent(name, {
                            detail: data
                        });
                    } catch (error) {
                        e = error;
                        ev = document.createEvent('CustomEvent');
                        if (ev.initCustomEvent) {
                            ev.initCustomEvent(name, true, true, data);
                        } else {
                            ev.initEvent(name, true, true, data);
                        }
                    }
                    return el.dispatchEvent(ev);
                };

                module.exports = QJ;

            }).call(this);


            /***/
        }),
/* 5 */
/***/ (function (module, exports, __webpack_require__) {

            var Payment, QJ, cardFromNumber, cardFromType, cards, cursorSafeAssignValue, defaultFormat, formatBackCardNumber, formatBackExpiry, formatCardNumber, formatExpiry, formatForwardExpiry, formatForwardSlash, formatMonthExpiry, globalThis, hasTextSelected, luhnCheck, reFormatCardNumber, restrictCVC, restrictCardNumber, restrictCombinedExpiry, restrictExpiry, restrictMonthExpiry, restrictNumeric, restrictYearExpiry, setCardType,
                indexOf = [].indexOf || function def(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

            globalThis = __webpack_require__(1)();

            QJ = __webpack_require__(4);

            defaultFormat = /(\d{1,4})/g;

            cards = [
                {
                    type: 'americanexpress',
                    pattern: /^3[47]/, //FROM GE CHECKOUT
                    format: /(\d{1,4})(\d{1,6})?(\d{1,5})?/,
                    length: [15],
                    cvcLength: [4],
                    luhn: true
                }, {
                    type: 'diners',
                    pattern: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/, //FROM GE CHECKOUT
                    format: /(\d{1,4})(\d{1,6})?(\d{1,4})?/,
                    length: [14],
                    cvcLength: [3],
                    luhn: true
                }, {
                    type: 'discover',
                    pattern: /^(6011|64[4-9]|65)/,//FROM GE CHECKOUT
                    format: defaultFormat,
                    length: [16],
                    cvcLength: [3],
                    luhn: true
                }, {
                    type: 'jcb',
                    pattern: /^35(2[89]|[3-8][0-9])/, //FROM GE CHECKOUT
                    format: defaultFormat,
                    length: [16, 19],
                    cvcLength: [3],
                    luhn: true
                }, {
                    type: 'laser',
                    pattern: /^(6304|670[69]|6771)/, //FROM GE CHECKOUT
                    format: defaultFormat,
                    length: [16, 17, 18, 19],
                    cvcLength: [3],
                    luhn: true
                }, {
                    type: 'maestro',
                    pattern: /^(5018|5020|5038|6304|6759|676[1-3])/, //FROM GE CHECKOUT
                    format: defaultFormat,
                    length: [12, 13, 14, 15, 16, 17, 18, 19],
                    cvcLength: [3],
                    luhn: true
                }, {
                    type: 'mastercard',
                    pattern: /^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$/, //FROM GE CHECKOUT
                    format: defaultFormat,
                    length: [16],
                    cvcLength: [3],
                    luhn: true
                }, {
                    type: 'visaelectron',
                    pattern: /^(4026|417500|4508|4844|491(3|7))/, //FROM GE CHECKOUT
                    format: defaultFormat,
                    length: [16],
                    cvcLength: [3],
                    luhn: true
                }, {
                    type: 'visa',
                    pattern: /^4/, //FROM GE CHECKOUT
                    format: defaultFormat,
                    length: [13, 16],
                    cvcLength: [3],
                    luhn: true
                }, {
                    type: 'mir',
                    pattern: /^220[0-4][0-9]{0,12}$/, //FROM GE CHECKOUT
                    format: defaultFormat,
                    length: [16, 19],
                    cvcLength: [3],
                    luhn: true
                }
            ];

            cardFromNumber = function (num) {
                var card, foundCard, j, len, match;
                num = (num + '').replace(/\D/g, '');
                foundCard = void 0;
                for (j = 0, len = cards.length; j < len; j++) {
                    card = cards[j];
                    if (match = num.match(card.pattern)) {
                        if (!foundCard || match[0].length > foundCard[1][0].length) {
                            foundCard = [card, match];
                        }
                    }
                }
                return foundCard && foundCard[0];
            };

            cardFromType = function (type) {
                var card, j, len;
                for (j = 0, len = cards.length; j < len; j++) {
                    card = cards[j];
                    if (card.type === type) {
                        return card;
                    }
                }
            };

            luhnCheck = function (num) {
                var digit, digits, j, len, odd, sum;
                odd = true;
                sum = 0;
                digits = (num + '').split('').reverse();
                for (j = 0, len = digits.length; j < len; j++) {
                    digit = digits[j];
                    digit = parseInt(digit, 10);
                    if ((odd = !odd)) {
                        digit *= 2;
                    }
                    if (digit > 9) {
                        digit -= 9;
                    }
                    sum += digit;
                }
                return sum % 10 === 0;
            };

            paymentTypeFromNumber = function (num) {
                var paymentType;
                num = (num + '').replace(/\D/g, '');
                // Visa
                visaRegex = new RegExp('^4[0-9]{0,15}$');
                // MasterCard
                mastercardRegex = new RegExp('^(5[1-5][0-9]{0,17}|222[1-9][0-9]{0,17}|22[3-9][0-9]{0,17}|2[3-6][0-9]{0,17}|27[01][0-9]{0,17}|2720[0-9]{0,17})$');
                // Maestro
                maestroRegex = new RegExp('^6[7-9][0-9]{0,17}$');
                // American Express
                amexRegex = new RegExp('^3$|^3[47][0-9]{0,13}$');
                // Diners Club
                dinersRegex = new RegExp('^3(?:0[0-5]|[68][0-9])[0-9]{11}$'),
                    //Discover
                    discoverRegex = new RegExp('^(6011[0-9]{0,12}$|64[4-9][0-9]{0,13}$|65[0-9]{0,14}$)'),
                    //JCB
                    jcbRegex = new RegExp('^2[1]?$|^21[3]?$|^1[8]?$|^18[0]?$|^(?:2131|1800)[0-9]{0,11}$|^3[5]?$|^35[0-9]{0,14}$');
                // Mir
                mirRegex = new RegExp('^220[0-4][0-9]{0,12}$');

                // checks per each, as their could be multiple hits
                if (num.match(visaRegex)) {
                    paymentType = 1;// "visa";
                } else if (num.match(mastercardRegex)) {
                    paymentType = 2;// "mastercard";
                } else if (num.match(maestroRegex)) {
                    paymentType = 23;// "maestro";
                } else if (num.match(amexRegex)) {
                    paymentType = 3;// "amex";
                } else if (num.match(dinersRegex)) {
                    paymentType = 51;// "diners_club";
                } else if (num.match(discoverRegex)) {
                    paymentType = 52;// "discover";
                } else if (num.match(jcbRegex)) {
                    paymentType = 33;// "jcb";
                } else if (num.match(mirRegex)) {
                    paymentType = 79; // "mir";
                }
                else {
                    paymentType = 0;
                }
                return paymentType;
            };

            hasTextSelected = function (target) {
                var e, ref;
                try {
                    if ((target.selectionStart != null) && target.selectionStart !== target.selectionEnd) {
                        return true;
                    }
                    if ((typeof document !== "undefined" && document !== null ? (ref = document.selection) != null ? ref.createRange : void 0 : void 0) != null) {
                        if (document.selection.createRange().text) {
                            return true;
                        }
                    }
                } catch (error) {
                    e = error;
                }
                return false;
            };

            reFormatCardNumber = function (e) {
                return setTimeout((function (_this) {
                    return function () {
                        var target, value;
                        target = e.target;
                        value = QJ.val(target);
                        value = payment.V2.fns.formatCardNumber(value);
                        cursorSafeAssignValue(target, value);
                        return QJ.trigger(target, 'change');
                    };
                })(this));
            };

            formatCardNumber = function (maxLength) {
                return function (e) {
                    var card, digit, i, j, len, length, re, target, upperLength, upperLengths, value;
                    if (e.which > 0) {
                        digit = String.fromCharCode(e.which);
                        value = QJ.val(e.target) + digit;
                    } else {
                        digit = e.data;
                        value = QJ.val(e.target);
                    }
                    if (!/^\d+$/.test(digit)) {
                        return;
                    }
                    target = e.target;
                    var paymentTypeId = payment.V2.fns.paymentType(value);
                    if (paymentTypeId != 0) {
                        card = cardFromType(paymentTypeId);
                    }
                    length = (value.replace(/\D/g, '')).length;
                    upperLengths = [16];
                    if (card) {
                        upperLengths = card.length;
                    }
                    if (maxLength) {
                        upperLengths = upperLengths.filter(function (x) {
                            return x <= maxLength;
                        });
                    }
                    for (i = j = 0, len = upperLengths.length; j < len; i = ++j) {
                        upperLength = upperLengths[i];
                        if (length >= upperLength && upperLengths[i + 1]) {
                            continue;
                        }
                        if (length >= upperLength) {
                            return;
                        }
                    }
                    if (hasTextSelected(target)) {
                        return;
                    }
                    if (card && card.type === 'americanexpress') {
                        re = /^(\d{4}|\d{4}\s\d{6})$/;
                    } else {
                        re = /(?:^|\s)(\d{4})$/;
                    }
                    value = value.substring(0, value.length - 1);
                    if (re.test(value)) {
                        e.preventDefault();
                        QJ.val(target, value + ' ' + digit);
                        return QJ.trigger(target, 'change');
                    }
                };
            };

            formatBackCardNumber = function (e) {
                var target, value;
                target = e.target;
                value = QJ.val(target);
                if (e.meta) {
                    return;
                }
                if (e.which !== 8) {
                    return;
                }
                if (hasTextSelected(target)) {
                    return;
                }
                if (/\d\s$/.test(value)) {
                    e.preventDefault();
                    QJ.val(target, value.replace(/\d\s$/, ''));
                    return QJ.trigger(target, 'change');
                } else if (/\s\d?$/.test(value)) {
                    e.preventDefault();
                    QJ.val(target, value.replace(/\s\d?$/, ''));
                    return QJ.trigger(target, 'change');
                }
            };

            formatExpiry = function (e) {
                var digit, target, val;
                target = e.target;
                if (e.which > 0) {
                    digit = String.fromCharCode(e.which);
                    val = QJ.val(target) + digit;
                } else {
                    digit = e.data;
                    val = QJ.val(target);
                }
                if (!/^\d+$/.test(digit)) {
                    return;
                }
                if (/^\d$/.test(val) && (val !== '0' && val !== '1')) {
                    e.preventDefault();
                    QJ.val(target, "0" + val + " / ");
                    return QJ.trigger(target, 'change');
                } else if (/^\d\d$/.test(val)) {
                    e.preventDefault();
                    QJ.val(target, val + " / ");
                    return QJ.trigger(target, 'change');
                }
            };

            formatMonthExpiry = function (e) {
                var digit, target, val;
                digit = String.fromCharCode(e.which);
                if (!/^\d+$/.test(digit)) {
                    return;
                }
                target = e.target;
                val = QJ.val(target) + digit;
                if (/^\d$/.test(val) && (val !== '0' && val !== '1')) {
                    e.preventDefault();
                    QJ.val(target, "0" + val);
                    return QJ.trigger(target, 'change');
                } else if (/^\d\d$/.test(val)) {
                    e.preventDefault();
                    QJ.val(target, "" + val);
                    return QJ.trigger(target, 'change');
                }
            };

            formatForwardExpiry = function (e) {
                var digit, target, val;
                digit = String.fromCharCode(e.which);
                if (!/^\d+$/.test(digit)) {
                    return;
                }
                target = e.target;
                val = QJ.val(target);
                if (/^\d\d$/.test(val)) {
                    QJ.val(target, val + " / ");
                    return QJ.trigger(target, 'change');
                }
            };

            formatForwardSlash = function (e) {
                var slash, target, val;
                slash = String.fromCharCode(e.which);
                if (slash !== '/') {
                    return;
                }
                target = e.target;
                val = QJ.val(target);
                if (/^\d$/.test(val) && val !== '0') {
                    QJ.val(target, "0" + val + " / ");
                    return QJ.trigger(target, 'change');
                }
            };

            formatBackExpiry = function (e) {
                var target, value;
                if (e.metaKey) {
                    return;
                }
                target = e.target;
                value = QJ.val(target);
                if (e.which !== 8) {
                    return;
                }
                if (hasTextSelected(target)) {
                    return;
                }
                if (/\d(\s|\/)+$/.test(value)) {
                    e.preventDefault();
                    QJ.val(target, value.replace(/\d(\s|\/)*$/, ''));
                    return QJ.trigger(target, 'change');
                } else if (/\s\/\s?\d?$/.test(value)) {
                    e.preventDefault();
                    QJ.val(target, value.replace(/\s\/\s?\d?$/, ''));
                    return QJ.trigger(target, 'change');
                }
            };

            restrictNumeric = function (e) {
                var input;
                if (e.metaKey || e.ctrlKey) {
                    return true;
                }
                if (e.which === 32) {
                    return e.preventDefault();
                }
                if (e.which === 0) {
                    return true;
                }
                if (e.which < 33) {
                    return true;
                }
                input = String.fromCharCode(e.which);
                if (!/[\d\s]/.test(input)) {
                    return e.preventDefault();
                }
            };

            restrictCardNumber = function (maxLength) {
                return function (e) {
                    var card, digit, length, target, value;
                    target = e.target;
                    digit = String.fromCharCode(e.which);
                    if (!/^\d+$/.test(digit)) {
                        return;
                    }
                    if (hasTextSelected(target)) {
                        return;
                    }
                    value = (QJ.val(target) + digit).replace(/\D/g, '');
                    card = cardFromNumber(value);
                    length = 16;
                    if (card) {
                        length = card.length[card.length.length - 1];
                    }
                    if (maxLength) {
                        length = maxLength;
                    }
                    if (!(value.length <= length)) {
                        return e.preventDefault();
                    }
                };
            };

            restrictExpiry = function (e, length) {
                var digit, target, value;
                target = e.target;
                digit = String.fromCharCode(e.which);
                if (!/^\d+$/.test(digit)) {
                    return;
                }
                if (hasTextSelected(target)) {
                    return;
                }
                value = QJ.val(target) + digit;
                value = value.replace(/\D/g, '');
                if (value.length > length) {
                    return e.preventDefault();
                }
            };

            restrictCombinedExpiry = function (e) {
                return restrictExpiry(e, 6);
            };

            restrictMonthExpiry = function (e) {
                return restrictExpiry(e, 2);
            };

            restrictYearExpiry = function (e) {
                return restrictExpiry(e, 4);
            };

            restrictCVC = function (e) {
                var digit, target, val;
                target = e.target;
                digit = String.fromCharCode(e.which);
                if (!/^\d+$/.test(digit)) {
                    return;
                }
                if (hasTextSelected(target)) {
                    return;
                }
                val = QJ.val(target) + digit;
                if (!(val.length <= 4)) {
                    return e.preventDefault();
                }
            };

            setCardType = function (e, paymentMethod, allPaymentTypes) {
                var allTypes, card, cardType, target, paymentTypeName;
                target = e.target;
                if (paymentMethod.value != '0') {
                    var paymentTypeId = parseInt(paymentMethod.value, 10);
                    if (allPaymentTypes[paymentTypeId] !== 'undefined') {
                        paymentTypeName = allPaymentTypes[paymentTypeId];
                    }
                };
                cardType = paymentTypeName || 'unknown';
                if (!QJ.hasClass(target, cardType)) {
                    allTypes = (function () {
                        var j, len, results;
                        results = [];
                        for (j = 0, len = cards.length; j < len; j++) {
                            card = cards[j];
                            results.push(card.type);
                        }
                        return results;
                    })();
                    QJ.removeClass(target, 'unknown');
                    QJ.removeClass(target, allTypes.join(' '));
                    QJ.addClass(target, cardType);
                    QJ.toggleClass(target, 'identified', cardType !== 'unknown');
                    return QJ.trigger(target, 'payment.cardType', cardType);
                }
            };

            cursorSafeAssignValue = function (target, value) {
                var selectionEnd;
                selectionEnd = target.selectionEnd;
                QJ.val(target, value);
                if (selectionEnd) {
                    return target.selectionEnd = selectionEnd;
                }
            };

            Payment = (function () {
                function Payment() { }

                Payment.J = QJ;

                Payment.fns = {
                    cardExpiryVal: function (value) {
                        var month, prefix, ref, year;
                        value = value.replace(/\s/g, '');
                        ref = value.split('/', 2), month = ref[0], year = ref[1];
                        if ((year != null ? year.length : void 0) === 2 && /^\d+$/.test(year)) {
                            prefix = (new Date).getFullYear();
                            prefix = prefix.toString().slice(0, 2);
                            year = prefix + year;
                        }
                        month = parseInt(month, 10);
                        year = parseInt(year, 10);
                        return {
                            month: month,
                            year: year
                        };
                    },
                    validateCardNumber: function (num, paymentType) {
                        var card, ref;
                        num = (num + '').replace(/\s+|-/g, '');
                        if (!/^\d+$/.test(num)) {
                            return false;
                        }

                        if (paymentType !== 'undefined') {
                            card = cardFromType(paymentType);
                        }

                        if (!card) {
                            return false;
                        }
                        return (ref = num.length, indexOf.call(card.length, ref) >= 0) && (card.luhn === false || luhnCheck(num));
                    },
                    validateCardExpiry: function (month, year) {
                        var currentTime, expiry, prefix, ref, ref1;
                        if (typeof month === 'object' && 'month' in month) {
                            ref = month, month = ref.month, year = ref.year;
                        } else if (typeof month === 'string' && indexOf.call(month, '/') >= 0) {
                            ref1 = Payment.V2.fns.cardExpiryVal(month), month = ref1.month, year = ref1.year;
                        }
                        if (!(month && year)) {
                            return false;
                        }
                        month = QJ.trim(month);
                        year = QJ.trim(year);
                        if (!/^\d+$/.test(month)) {
                            return false;
                        }
                        if (!/^\d+$/.test(year)) {
                            return false;
                        }
                        month = parseInt(month, 10);
                        if (!(month && month <= 12)) {
                            return false;
                        }
                        if (year.length === 2) {
                            prefix = (new Date).getFullYear();
                            prefix = prefix.toString().slice(0, 2);
                            year = prefix + year;
                        }
                        expiry = new Date(year, month);
                        currentTime = new Date;
                        expiry.setMonth(expiry.getMonth() - 1);
                        expiry.setMonth(expiry.getMonth() + 1, 1);
                        return expiry > currentTime;
                    },
                    validateCardCVC: function (cvc, type) {
                        var ref, ref1;
                        cvc = QJ.trim(cvc);
                        if (cvc == "" && type && type.cvcLength && indexOf.call(type.cvcLength, 0) >= 0) {
                            return true;
                        }
                        if (!/^\d+$/.test(cvc)) {
                            return false;
                        }
                        if (type && cardFromType(type)) {
                            return ref = cvc.length, indexOf.call((ref1 = cardFromType(type)) != null ? ref1.cvcLength : void 0, ref) >= 0;
                        } else {
                            return cvc.length >= 3 && cvc.length <= 4;
                        }
                    },
                    paymentTypeByCardNumber: function (num) {
                        if (!num) {
                            return null;
                        }
                        return paymentTypeFromNumber(num);
                    },
                    paymentType: function (cardType) {
                        if (!cardType) {
                            return null;
                        }
                        return cardFromType(cardType);
                    },
                    cardType: function (num) {
                        var ref;
                        if (!num) {
                            return null;
                        }
                        return ((ref = cardFromNumber(num)) != null ? ref.type : void 0) || null;
                    },
                    formatCardNumber: function (num) {
                        var card, groups, ref, upperLength;
                        var paymentTypeId = payment.V2.fns.paymentType(num);
                        if (paymentTypeId != 0) {
                            card = cardFromType(paymentTypeId);
                        }
                        if (!card) {
                            return num;
                        }
                        upperLength = card.length[card.length.length - 1];
                        num = num.replace(/\D/g, '');
                        num = num.slice(0, upperLength);
                        if (card.format.global) {
                            return (ref = num.match(card.format)) != null ? ref.join(' ') : void 0;
                        } else {
                            groups = card.format.exec(num);
                            if (groups == null) {
                                return;
                            }
                            groups.shift();
                            groups = groups.filter(function (n) {
                                return n;
                            });
                            return groups.join(' ');
                        }
                    }
                };

                Payment.restrictNumeric = function (el) {
                    QJ.on(el, 'keypress', restrictNumeric);
                    return QJ.on(el, 'input', restrictNumeric);
                };

                Payment.cardExpiryVal = function (el) {
                    return Payment.V2.fns.cardExpiryVal(QJ.val(el));
                };

                Payment.formatCardCVC = function (el) {
                    Payment.restrictNumeric(el);
                    QJ.on(el, 'keypress', restrictCVC);
                    QJ.on(el, 'input', restrictCVC);
                    return el;
                };

                Payment.formatCardExpiry = function (el) {
                    var month, year;
                    Payment.restrictNumeric(el);
                    if (el.length && el.length === 2) {
                        month = el[0], year = el[1];
                        this.formatCardExpiryMultiple(month, year);
                    } else {
                        QJ.on(el, 'keypress', restrictCombinedExpiry);
                        QJ.on(el, 'keypress', formatExpiry);
                        QJ.on(el, 'keypress', formatForwardSlash);
                        QJ.on(el, 'keypress', formatForwardExpiry);
                        QJ.on(el, 'keydown', formatBackExpiry);
                        QJ.on(el, 'input', formatExpiry);
                    }
                    return el;
                };

                Payment.formatCardExpiryMultiple = function (month, year) {
                    QJ.on(month, 'keypress', restrictMonthExpiry);
                    QJ.on(month, 'keypress', formatMonthExpiry);
                    QJ.on(month, 'input', formatMonthExpiry);
                    QJ.on(year, 'keypress', restrictYearExpiry);
                    return QJ.on(year, 'input', restrictYearExpiry);
                };

                Payment.formatCardNumber = function (el, maxLength, paymentMethod, allPaymentTypes) {
                    Payment.restrictNumeric(el);
                    QJ.on(el, 'keypress', restrictCardNumber(maxLength));
                    QJ.on(el, 'keypress', formatCardNumber(maxLength));
                    QJ.on(el, 'keydown', formatBackCardNumber);
                    QJ.on(el, 'keyup blur', function (e) { setCardType(e, paymentMethod, allPaymentTypes) });
                    QJ.on(el, 'paste', reFormatCardNumber);
                    QJ.on(el, 'input', formatCardNumber(maxLength));
                    return el;
                };

                Payment.getCardArray = function () {
                    return cards;
                };

                Payment.setCardArray = function (cardArray) {
                    cards = cardArray;
                    return true;
                };

                Payment.addToCardArray = function (cardObject) {
                    return cards.push(cardObject);
                };

                Payment.removeFromCardArray = function (type) {
                    var key, value;
                    for (key in cards) {
                        value = cards[key];
                        if (value.type === type) {
                            cards.splice(key, 1);
                        }
                    }
                    return true;
                };

                return Payment;

            })();

            module.exports = Payment;

            /***/
        })
/******/]);

// #endregion

//Fixer POC
function GEFixer() {

    this.currentPage = null;
    this.COOKIE_NAME = "GE_FIXER_INDICATOR";
    this.COOKIE_NAME_TOTAL_PRICE = "GE_FIXER_INDICATOR_TOTAL_PRICE";
    this.COOKIE_NAME_CURRENCY = "GE_FIXER_INDICATOR_CURRENCY";
    this.CONTINUE_BUTTON = "#continue_button";
    this.GE_CUSTOM_ATTR = "is-glbe-custom";
    this.isConfirmationMessage = "GE_SHOW_CONFIRMATION";
    this.Pages = {
        Information: "contact_information",
        Shipping: "shipping_method",
        Payment: "payment_method",
        Confirmation: "thank_you"
    }
}

GEFixer.prototype.ShowLoading = function () {
    var addCenteringStyles = function (element) {
        element.style.display = "flex";
        element.style.flexDirection = "row";
        element.style.flexWrap = "wrap";
        element.style.justifyContent = "center";
        element.style.alignItems = "center";
    }
    var loadingDivWrapper = document.createElement("div");
    loadingDivWrapper.style.position = "fixed";
    loadingDivWrapper.style.width = "100%";
    loadingDivWrapper.style.height = "100%";
    loadingDivWrapper.style.left = "0px";
    loadingDivWrapper.style.top = "0px";
    loadingDivWrapper.style.zIndex = "10000";
    loadingDivWrapper.style.backgroundColor = "rgba(255, 255, 255, 0.95)";
    addCenteringStyles(loadingDivWrapper);


    //loader box : image + text
    var loadingBox = document.createElement("div");
    loadingBox.style.width = "300px";
    loadingBox.style.height = "100px";
    addCenteringStyles(loadingBox);

    //load loader image
    var loaderImage = document.createElement("img");
    loaderImage.src = "https://web.global-e.com/content/images/loader3.gif";
    loaderImage.style.margin = "auto";
    loaderImage.style.width = "40px";
    loaderImage.style.height = "40px";

    //var text div
    var textContainer = document.createElement("div");
    textContainer.style.margin = "auto";
    textContainer.style.width = "300px";
    textContainer.style.height = "200px";
    textContainer.style.textAlign = "center";
    textContainer.style.marginTop = "20px";
    textContainer.innerText = "Your order is processing...";
    textContainer.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif;';
    textContainer.style.fontSize = "1.2857142857em";
    textContainer.style.lineHeight = "1.3em";
    textContainer.style.fontWeight = "600";

    loadingBox.appendChild(loaderImage);
    loadingBox.appendChild(textContainer);

    loadingDivWrapper.appendChild(loadingBox);
    document.body.appendChild(loadingDivWrapper);
}

GEFixer.prototype.SetCurrentPage = function () {
    try {
        if (typeof Shopify != "undefined" && Shopify.Checkout) {
            this.currentPage = Shopify.Checkout.step;
            GESHOP.Log(GESHOP.LogTypes.Info, "GEFixer SetCurrentPage: " + Shopify.Checkout.step);
        }
    } catch (e) {
        GESHOP.Log(GESHOP.LogTypes.Exception, "GEFixer Error in SetCurrentPage: " + e);
    }
}

GEFixer.prototype.Init = function () {
    try {
        var _self = this;
        GESHOP.Log(GESHOP.LogTypes.Info, "GEFixer Init");
        GESHOP.OnDocumentReady.call(this, function () {
            GESHOP.Log(GESHOP.LogTypes.Info, "GEFixer Init document ready");
            _self.SetCurrentPage();
            //_self.RegisterPostMessageListener();        
            _self.StartFixerProcess();
        });
    } catch (e) {
        GESHOP.Log(GESHOP.LogTypes.Exception, "GEFixer Error in Init: " + e);
    }
}
GEFixer.prototype.IfCancelAlternativePayment = function () {
    try {
        //do checks
        if (GESHOP.GetQueryParam("ge_state") == "0") {
            //cancel
            return true;
        }
        else {
            return false;
        }
    } catch (e) {
        GESHOP.Log(GESHOP.LogTypes.Exception, "GEFixer Error in IfCancelAlternativePayment: " + e);
    }
}
//This function should be called before execution of original button click on the 
//payment step
GEFixer.prototype.SetOriginalButtonClickedState = function () {
    try {
        GESHOP.Log(GESHOP.LogTypes.Info, "GEFixer SetOriginalButtonClickedState started");
        //save cookie
        //todo: verify if session cookie is not risky here.
        GESHOP.SetCookie(this.COOKIE_NAME, "true", 1, true);
        GESHOP.SetCookie(this.COOKIE_NAME_CURRENCY, Shopify.Checkout.currency, 1, true);
        GESHOP.SetCookie(this.COOKIE_NAME_TOTAL_PRICE, Shopify.Checkout.totalPrice, 1, true);
    } catch (e) {
        GESHOP.Log(GESHOP.LogTypes.Exception, "GEFixer Error in SetOriginalButtonClickedState: " + e);
    }
}

GEFixer.prototype.WasOriginalButtonClicked = function () {
    try {
        GESHOP.Log(GESHOP.LogTypes.Info, "GEFixer WasOriginalButtonClicked started");
        //search the cookie that indicates that the original button click was clicked
        var cookieValue = GESHOP.GetCookie(this.COOKIE_NAME);
        if (cookieValue != null && cookieValue != "false") {
            return cookieValue == "true";
        }

        return false;
    } catch (e) {
        GESHOP.Log(GESHOP.LogTypes.Exception, "GEFixer Error in WasOriginalButtonClicked: " + e);
        return false;
    }
}
//This function is called after the original button was clicked
GEFixer.prototype.RemoveCookieIfNeeded = function (forceRemove = false) {
    try {
        GESHOP.Log(GESHOP.LogTypes.Info, "GEFixer RemoveCookieIfNeeded");
        if (this.currentPage == this.Pages.Payment ||
            this.currentPage == this.Pages.Confirmation ||
            forceRemove) {
            var cookieValue = GESHOP.GetCookie(this.COOKIE_NAME);
            if (cookieValue != null) {
                GESHOP.SetCookie(this.COOKIE_NAME, "false", 1, true);
                GESHOP.Log(GESHOP.LogTypes.Info, "GEFixer RemoveCookieIfNeeded removed");
            }
        }
    } catch (e) {
        GESHOP.Log(GESHOP.LogTypes.Exception, "GEFixer Error in RemoveCookieIfNeeded: " + e);
    }
}

GEFixer.prototype.FindAndClickContinueButton = function () {
    try {
        GESHOP.Log(GESHOP.LogTypes.Info, "GEFixer FindAndClickContinueButton");
        var btns = document.querySelectorAll(this.CONTINUE_BUTTON);
        var clicked = false;
        if (btns.length > 0) {
            //look for the none custom contiue button
            for (var i = 0; i < btns.length; i++) {
                geAttr = btns[i].getAttribute(this.GE_CUSTOM_ATTR);
                if (geAttr == null) {
                    //original shopify button
                    this.RemoveCookieIfNeeded(); //remove the cookie to prevent fixer click loop 
                    clicked = true;
                    btns[i].click();
                    GESHOP.Log(GESHOP.LogTypes.Info, "GEFixer clicked on " + btns[i].textContent);
                }
            }

        }

        if (!clicked) {
            //try again in X ms
            var _self = this;
            setTimeout(function () {
                _self.FindAndClickContinueButton();
            }, 200);
        }
    } catch (e) {
        GESHOP.Log(GESHOP.LogTypes.Exception, "GEFixer Error in FindAndClickContinueButton: " + e);
    }
}

GEFixer.prototype.IsOOSScenario = function () {
    var self = this;
    try {
        GESHOP.Log(GESHOP.LogTypes.Info, "GEFixer CheckOOSScenario");
        var url = window.location.href;
        if (url.toLowerCase().includes(GESHOP.OOSScenarioQueryParam)) {
            return true;
        }
        return false;
    } catch (e) {
        GESHOP.Log(GESHOP.LogTypes.Exception, "GEFixer Error in CheckOOSScenario: " + e);
        return true;
    }
}

GEFixer.prototype.IsPriceChanged = function () {
    try {
        var self = this;
        GESHOP.Log(GESHOP.LogTypes.Info, "GEFixer IsPriceChanged started");
        // search the cookie that indicates the currecny
        var shopifyCurrentCurrency = "";
        var shopifyCurrentTotalPrice = 0;
        if (GESHOP.IsDefined(Shopify.Checkout.currency)) {
            shopifyCurrentCurrency = Shopify.Checkout.currency;
        }
        if (GESHOP.IsDefined(Shopify.Checkout.totalPrice)) {
            shopifyCurrentTotalPrice = Shopify.Checkout.totalPrice;
        }
        var cookieValueCurrency = GESHOP.GetCookie(this.COOKIE_NAME_CURRENCY);
        if (cookieValueCurrency != null) {
            if (cookieValueCurrency == shopifyCurrentCurrency) {
                // search the cookie that indicates the total price
                var cookieValueTotalPrice = parseFloat(GESHOP.GetCookie(this.COOKIE_NAME_TOTAL_PRICE));
                if (cookieValueTotalPrice != null) {
                    var percentageAmount = GESHOP.MaxAmountPercentageChange * cookieValueTotalPrice;
                    var totalPriceWithPercentageAmount = percentageAmount + cookieValueTotalPrice;
                    var totalPriceReducePercentageAmount = cookieValueTotalPrice - percentageAmount;
                    if ((shopifyCurrentTotalPrice >= cookieValueTotalPrice && shopifyCurrentTotalPrice <= totalPriceWithPercentageAmount)
                        || (shopifyCurrentTotalPrice <= cookieValueTotalPrice && shopifyCurrentTotalPrice >= totalPriceReducePercentageAmount)) {
                        GESHOP.Log(GESHOP.LogTypes.Info, "GEFixer IsPriceChanged Total price is in range of " + GESHOP.MaxAmountPercentageChange);
                        return false;
                    }
                    else {
                        GESHOP.Log(GESHOP.LogTypes.Info, "GEFixer IsPriceChanged Total price was changed");
                        this.RemoveCookieIfNeeded(true);
                        return true;
                    }
                }
            }
            else {
                GESHOP.Log(GESHOP.LogTypes.Info, "GEFixer IsPriceChanged Currency was changed");
                this.RemoveCookieIfNeeded(true);
                return true;
            }
        }
        this.RemoveCookieIfNeeded(true);
        return true;
    } catch (e) {
        GESHOP.Log(GESHOP.LogTypes.Exception, "GEFixer Error in IsPriceChanged: " + e);
        this.RemoveCookieIfNeeded(true);
        return true;
    }
}

GEFixer.prototype.StartFixerProcess = function () {
    try {
        //first check if we need to start the process (original button was clicked and we are not on confirmation page)
        //debugger;
        GESHOP.Log(GESHOP.LogTypes.Info, "GEFixer StartFixerProcess");
        if (!this.IfCancelAlternativePayment()) {
            if (this.WasOriginalButtonClicked() && this.currentPage != this.Pages.Confirmation && !this.IsOOSScenario() && !this.IsPriceChanged()) {
                this.ShowLoading();
                //check where we are in the checkout, if we are on payment step we only need to click the original button click
                switch (this.currentPage) {
                    case this.Pages.Payment:
                    case this.Pages.Information:
                    case this.Pages.Shipping:
                        //need to create fixer iframe for better user expiriance
                        //this.CreateOrProcessIframe();
                        GESHOP.Log(GESHOP.LogTypes.Info, "GEFixer StartFixerProcess - Original button clicked and we are not on confirmation page");
                        this.FindAndClickContinueButton();
                        break;
                }
            }
            else if (this.currentPage == this.Pages.Confirmation) {
                this.RemoveCookieIfNeeded();
            }
        }
        else {
            //we are back from cancel, just delete the cookie if it exists
            this.RemoveCookieIfNeeded(true);
        }
    } catch (e) {
        GESHOP.Log(GESHOP.LogTypes.Exception, "GEFixer Error in StartFixerProcess: " + e);
    }
}

_geFixer = new GEFixer();