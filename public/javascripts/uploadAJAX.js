/**
 * Upload the photos using ajax request.
 *
 * @param formData
 */
function uploadFiles(formData) {
  $.ajax({
    url: '/upload_photos',
    method: 'post',
    data: formData,
    processData: false,
    contentType: false,
    xhr: function () {
      let xhr = new XMLHttpRequest();

      // Add progress event listener to the upload.
      xhr.upload.addEventListener('progress', function (event) {
        let progressBar = $('.progress-bar');

        if (event.lengthComputable) {
          let percent = (event.loaded / event.total) * 100;
          progressBar.width(percent + '%');

          if (percent === 100) {
            progressBar.removeClass('active');
          }
        }
      });

      return xhr;
    }
  }).done(handleSuccess).fail(function (xhr, status) {
    alert(status);
  });
}

/**
 * Handle the upload response data from server and display them.
 *
 * @param data
 */
function handleSuccess(data) {
  if (data.length > 0) {
    let html = '';
    for (let i=0; i < data.length; i++) {
      let img = data[i];

      if (img.status) {
        $('<input>').attr({type: 'hidden', name: 'inputImages', value: img.publicPath}).appendTo('fieldset');
        html += '<div class="col-xs-6 col-md-4"><a href="#" class="thumbnail"><img src="/' + img.publicPath + '" alt="' + img.filename  + '"></a></div>';
      } else {
        html += '<div class="col-xs-6 col-md-4"><a href="#" class="thumbnail">Invalid file type - ' + img.filename  + '</a></div>';
      }
    }

    $('#album').append(html);
  } else {
    alert('No images were uploaded.')
  }
}

// Set the progress bar to 0 when a file(s) is selected.
$('#photos-input').on('change', function () {
  $('.progress-bar').width('0%');

  // Get the files from input, create new FormData.
  let files = $('#photos-input').get(0).files,
    formData = new FormData();

  if (files.length === 0) {
    alert('Select at least 1 file to upload.');
    return false;
  }

  if (files.length > 15) {
    alert('You can only upload up to 15 files.');
    return false;
  }

  // Append the files to the formData.
  for (let i=0; i < files.length; i++) {
    let file = files[i];
    formData.append('photos[]', file, file.name);
  }

  // Note: We are only appending the file inputs to the FormData.
  uploadFiles(formData);

});

// On form submit, handle the file uploads.
// $('#upload-photos').on('submit', function (event) {
//   event.preventDefault();
//
//
// });