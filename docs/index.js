(function() {
  function handleWindowLoad() {
    var elemButtonGroup = document.getElementsByClassName('btn-group')[0];
    var elemContent = document.getElementsByClassName('content')[0];
    var deserializedDom;

    elemButtonGroup.addEventListener('click', function(event) {
      var action = event.target.getAttribute('data-action');

      if (action === 'serialize') {
        elemContent.textContent = domSerialization.serialize(elemContent);
      } else {
        elemContent.innerHTML = domSerialization.deserialize(
          elemContent.textContent,
        ).innerHTML;
      }
    });
  }

  window.addEventListener('load', handleWindowLoad);
})();
