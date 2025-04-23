(function(){ var s = document.createElement('script'), e = ! document.body ? document.querySelector('head') : document.body; s.src = 'https://acsbapp.com/apps/app/dist/js/app.js'; s.async = true; s.onload = function(){ acsbJS.init({ statementLink : '', footerHtml : '', hideMobile : true, hideTrigger : true, language : 'en', position : 'left', leadColor : '#146ff8', triggerColor : '#146ff8', triggerRadius : '50%', triggerPositionX : 'right', triggerPositionY : 'bottom', triggerIcon : 'people', triggerSize : 'small', triggerOffsetX : 20, triggerOffsetY : 20, mobile : { triggerSize : 'small', triggerPositionX : 'right', triggerPositionY : 'bottom', triggerOffsetX : 10, triggerOffsetY : 10, triggerRadius : '50%' } }); }; e.appendChild(s);}());
//Hotjar Tracking Code for my site
	(function(h,o,t,j,a,r){
    	h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
    	h._hjSettings={hjid:3423178,hjsv:6};
    	a=o.getElementsByTagName('head')[0];
    	r=o.createElement('script');r.async=1;
    	r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
    	a.appendChild(r);
	})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');