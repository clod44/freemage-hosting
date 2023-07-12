
document.addEventListener('DOMContentLoaded', function () {
    const fileInput = document.getElementById('select-image');
    const imageElement = document.getElementById('upload-source');
    const form = document.getElementById('upload-form');

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!isAcceptedExtension(file.name)) {
            event.target.value = ''; // Clear the file input to allow selecting a valid file
            showModal('Invalid file type', '<p>Invalid file type. Only <b>JPG, JPEG,</b> and <b>PNG</b> files are allowed.</p>');
            return
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            const cleanImage = isJpegOrJpg(file.name) ? piexif.remove(e.target.result) : e.target.result;
            imageElement.src = cleanImage;
            updateLoadingBarProgress(0);
        };
        reader.readAsDataURL(file);
    });

    function isAcceptedExtension(filename) {
        const acceptedExtensions = ['jpg', 'jpeg', 'png', 'JPG', 'JPEG', 'PNG'];
        const fileExtension = filename.split('.').pop().toLowerCase();
        return acceptedExtensions.includes(fileExtension);
    }

    function isJpegOrJpg(filename) {
        const extension = filename.split('.').pop().toLowerCase();
        return extension === 'jpeg' || extension === 'jpg';
    }




    form.addEventListener('submit', function (event) {
        event.preventDefault();

        // Check if a file is selected
        if (!fileInput.files || fileInput.files.length === 0) {
            alert('Please select an image file.');

            showModal('Missing file', '<p>Please Select an image file</p>');
            return;
        }

        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/upload');
        // Track the progress of the upload
        xhr.upload.addEventListener('progress', function (event) {
            if (event.lengthComputable) {
                const progress = (event.loaded / event.total) * 100;
                updateLoadingBarProgress(progress);
            }
        });
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    if (xhr.getResponseHeader('Content-Type').indexOf('application/json') !== -1) {
                        const response = JSON.parse(xhr.responseText);
                        if (response.redirectUrl) {
                            window.location.href = response.redirectUrl;
                        } else {
                            console.error('Missing redirect URL in the response');
                        }
                    } else {
                        console.error('Invalid response format, expecting JSON');
                    }
                } else {
                    const errorResponse = JSON.parse(xhr.responseText);
                    const errorMessage = errorResponse.error;
                    console.error(errorMessage);
                    alert(errorMessage);
                }
            }
        };

        const formData = new FormData(form);
        formData.set('file', dataURItoBlob(imageElement.src));
        xhr.send(formData);
    });

    function dataURItoBlob(dataURI) {
        const byteString = atob(dataURI.split(',')[1]);
        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        const extension = mimeString.split('/')[1];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeString });
        const fileName = `image.${extension}`;
        const file = new File([blob], fileName);
        return file;
    }




    window.addEventListener('beforeunload', () => {
        fileInput.value = '';
    });
});

