function uploadComment(dataObj) {
  $.ajax({
    url: '/upload_comment',
    method: 'post',
    dataType: "json",
    data: dataObj,
  }).done(handleSuccess);
}

function handleSuccess(result) {
  //result.comment
  //result.author
  let html = '<div id="comments">' + result.comment + '<div id="moreInfoAuthorName">By: ' +
    result.author + '</div></div>';
  $('#allComments').append(html)
  document.getElementById("form-horizontal5").reset();
}

$('#add-comment').on('click', function (event) {
  event.preventDefault()
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
