document.addEventListener('click', function(event) {
  var target = event.target || event.scrElement;
  var range = document.createRange();
  range.selectNode((target.tagName === 'P' && target.firstChild.tagName === 'SPAN') ? target.firstChild : target);
  window.getSelection().addRange(range);
  document.execCommand('copy');
});
