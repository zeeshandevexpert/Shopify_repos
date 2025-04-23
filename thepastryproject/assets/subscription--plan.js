 document.addEventListener('DOMContentLoaded', function(){
    document.querySelector('#purchase-btn').addEventListener('click', function(e){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const selling_planId = urlParams.get('selling_plan');
      e.preventDefault();
      var xhttp = new XMLHttpRequest();

      let variant_id = this.getAttribute('data-variant-id');

      
      let Month = document.getElementById('gMonth1');
      const value1 = Month?.value || '';
      const value2 = Month ? Month.value : '';
      if (Month) {
      var Monthvalue = Month.value;
      } else {
      console.log('Month is falsy');
      }
      
      
        let Note = document.getElementById('note-content');
        const value11 = Note?.value || '';
        const value21 = Note ? Note.value : '';
        if (Note) {
        var Notevalue = Note.value;
        } else {
        console.log('Note is falsy');
        }
      
      
      
       

      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          
          console.log('cart cleared');
          
          let data = {
          'items': [{
          'id': variant_id,
          'quantity': 1,
          'selling_plan': selling_planId,
          properties: {
          'Starting Month': Monthvalue,
          'Gift Note': Notevalue
          }
          
          }]
          };
      
          const xhr = new XMLHttpRequest();
          xhr.open('POST', '/cart/add.js', true);
          xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
          xhr.send(JSON.stringify(data));


       
          xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
              window.location.href = '/checkout';
            }
          }
          
        }
      };

      //post data here to clear the cart
      xhttp.open("POST", "/cart/clear.js", true);
      xhttp.send();
    });

});

