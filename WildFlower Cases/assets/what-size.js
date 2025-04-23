(function(d) {
    let size = false;
    const form = document.getElementById('what-size-form');
    const results = document.querySelector('.what-size__results');
    const error = document.querySelector('.what-size__error');
    const iPhoneJsonUrl = `/blogs/iphone-sizes?view=iphone-sizes-json`;
    const youHaveSize = (size) => {
        const model = document.querySelector('.what-size__model');
        const image = document.querySelector('.what-size__image');
        const description = document.querySelector('.what-size__description');
        const link = document.querySelector('.what-size__link');
        model.textContent = size.name;
        image.src = size.image;
        description.innerHTML = size.description;
        link.href = size.link_url;
        results.style.display = 'block';
    };
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        size = false;
        const inputValue = document.querySelector('.what-size__input').value.toUpperCase();
        results.style.display = 'none';
        error.style.display = 'none';
        fetch(iPhoneJsonUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            data.forEach((iPhone) => {
                iPhone.models.forEach(model => {
                    if(model === inputValue) {
                        youHaveSize(iPhone);
                        return;
                    }
                });
            });
        });
    });
})(document);


/*whatSizeFormSubmit: function() {
    var inpt = $('.what-size__input').val().toUpperCase();
    var yourSize = false;
    $('.what-size__results').hide();
    $('.what-size__error').hide();  
    var iPhoneJSON = '/blogs/iphone-sizes?view=iphone-sizes-json';
    $.getJSON(iPhoneJSON,function(data) {
      console.log(data);
      $.each(data,function(i,v) {
        $.each(v.models,function(im, m) {
          if(m == inpt) {
            console.log(v.name);
            yourSize = v;
            return;
          }
        });
      });
      if(yourSize) {
      	wick.youHaveSize(yourSize);
      } else {
        $('.what-size__error').fadeIn();
      }
    });
  },
  youHaveSize: function(m) {
    $('.what-size__model').text(m.name);
    $('.what-size__image').attr('src',m.image);
    $('.what-size__description').html(m.description);
    $('.what-size__link').attr('href',m.link_url);
    $('.what-size__results').fadeIn();
    Cookies.set('iphone_model', m.name, { expires: 365 });
  },
  */