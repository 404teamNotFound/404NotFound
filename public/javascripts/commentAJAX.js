function uploadComment(dataObj) {
  $.ajax({
    url: '/upload_comment',
    method: 'post',
    dataType: "json",
    data: dataObj,
  }).done(handleSuccess);
}

function handleSuccess(dataObj) {
  alert('SUCCESS')
}

$('#add-comment').on('click', function () {
  let pageURL = window.location.href
  let splitURL = pageURL.split('/')
  let articleId = splitURL[splitURL.length - 1]
  let userID = $('#userID').val()
  let content = $('#inputComment').val()
  if (content) {
    let dataObj = {
      articleId: articleId,
      authorId: userID,
      content: content
    }
    uploadComment(dataObj)
  } else {
    alert("NO comment")
  }
});
