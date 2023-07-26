

document.addEventListener('DOMContentLoaded', function () {

    const fileInput = document.getElementById('select-image');
    const submitBtn = document.getElementById('submit-btn');
    const imageElement = document.getElementById('upload-source');
    const form = document.getElementById('upload-form');
    let alreadyUploading = false

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!isAcceptedExtension(file.name)) {
            event.target.value = ''; // Clear the file input to allow selecting a valid file
            showModal('Invalid file type', '<p>Invalid file type. Only <b>JPG, JPEG,</b> and <b>PNG</b> files are allowed.</p>');
            return
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            let imageDataUrl;
            if (isJpegOrJpg(file.name)) {
                imageDataUrl = piexif.remove(e.target.result);
            } else {
                imageDataUrl = URL.createObjectURL(e.target.result);
            }
            imageElement.src = imageDataUrl;
            updateLoadingBarProgress(0);
        };
        reader.readAsDataURL(file);
    });

    function isAcceptedExtension(filename) {
        const acceptedExtensions = ['jpg', 'jpeg', 'png'];
        const fileExtension = filename.split('.').pop().toLowerCase();
        return acceptedExtensions.includes(fileExtension);
    }

    function isJpegOrJpg(filename) {
        const extension = filename.split('.').pop().toLowerCase();
        return extension === 'jpeg' || extension === 'jpg';
    }




    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        // Check if a file is selected
        if (!fileInput.files || fileInput.files.length === 0) {
            showModal('Missing file', '<p>Please Select an image file</p>');
            return;
        }

        if (alreadyUploading) {   //just in case
            showModal("Please Wait", "Please wait until the previous upload is completed")
            return
        }

        alreadyUploading = true
        fileInput.disabled = true;
        submitBtn.disabled = true;


        try {
            //const file1 = fileInput.files[0];
            const file2 = dataURItoBlob(imageElement.src) //exif removed file
            const formData = new FormData();
            formData.set('file', file2);

            const response = await axios.post('/api/upload', formData, {
                onUploadProgress: function (progressEvent) {
                    const progress = (progressEvent.loaded / progressEvent.total) * 100;
                    updateLoadingBarProgress(progress);

                }
            });

            if (response.data.redirectUrl) {
                window.location.href = response.data.redirectUrl;
                updateLoadingBarProgress(100, "Redirecting...");
            } else {
                console.error('Missing redirect URL in the response');
            }
        } catch (error) {
            console.log(error.message)
            console.log(error.response.data.error)
            showModal('An error occurred while uploading the file.', error.response.data.error);
        } finally {
            alreadyUploading = false;
            fileInput.disabled = false;
            submitBtn.disabled = false;
        }

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


    const socket = io(); // Connect to the server
    const uploadedImageCountDom = document.getElementById("uploaded-image-count")
    socket.on('uploadedImageCount', (count) => {
        uploadedImageCountDom.textContent = count
    });


    //show disclaimer
    const disclaimerNote = `
        <div class="container">
        <div class="alert alert-warning">
        <h5>Disclaimer:</h5>
        <p>Welcome to Freemage Hosting, a free image hosting service. Please read this disclaimer carefully before using our platform. By using our service, you agree to the terms and conditions outlined in this disclaimer.</p>
    
        <ol>
            <li>
            <strong>Practice Project:</strong>
            <p>Freemage Hosting is a practice project and should not be used for commercial purposes. The service provided here is intended for educational and learning purposes only. We do not guarantee the availability, reliability, or functionality of the service as it may be subject to periodic changes, updates, or discontinuation without prior notice.</p>
            </li>
            <li>
            <strong>No Reliance:</strong>
            <p>Please note that you should not rely on Freemage Hosting as your primary or sole image hosting solution. While we strive to provide a reliable service, there may be instances where the service experiences downtime, resets image databases, or provides unexpected results. We do not assume any responsibility or liability for the loss, damage, or inconvenience caused by such occurrences.</p>
            </li>
            <li>
            <strong>Use at Your Own Risk:</strong>
            <p>By using Freemage Hosting, you acknowledge and accept that you are using the service at your own risk. We do not make any warranties or representations regarding the suitability, accuracy, or completeness of the service for your specific needs. We disclaim any liability for any errors, inaccuracies, or omissions in the service, and you agree to use the service solely at your own discretion.</p>
            </li>
            <li>
            <strong>User Responsibility:</strong>
            <p>As a user of Freemage Hosting, you are solely responsible for the images you upload and share through the service. You must ensure that you have the necessary rights, permissions, and consent to use, publish, and distribute the images. We do not assume any responsibility or liability for any copyright infringement, unauthorized use, or misuse of the images uploaded by users.</p>
            </li>
            <li>
            <strong>Changes to Service:</strong>
            <p>We reserve the right to modify, suspend, or terminate the service, including any features, functionality, or policies, at any time without prior notice. We are not obligated to provide any specific updates, enhancements, or ongoing support for the service.</p>
            </li>
            <li>
            <strong>Third-Party Content:</strong>
            <p>Freemage Hosting may contain links to third-party websites, services, or content. We do not endorse or assume any responsibility for the accuracy, legality, or appropriateness of the content provided by third parties. Your interactions with third-party websites or services are subject to their respective terms and policies, and we encourage you to review them before engaging with any third-party content.</p>
            </li>
        </ol>
    
        <p>By using Freemage Hosting, you agree to release and hold harmless Freemage Hosting and its owners, administrators, and affiliates from any claims, damages, liabilities, or losses arising out of or in connection with your use of the service.</p>
    
        <p>If you do not agree with any part of this disclaimer, please refrain from using Freemage Hosting.</p>
    
        <p>Thank you for using Freemage Hosting!</p>
    
        </div>
    </div>
    `
    showToast('Disclaimer', disclaimerNote);
});

