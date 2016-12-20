$('.madafaka').on('click', function (event) {
  event.preventDefault()
  $('#moreInforMainIMG').attr('src', $(this).attr('src'));
});