document.addEventListener("DOMContentLoaded", () => {
    // Function to access the camera and take a photo
    function accessCamera() {
        console.log('Attempting to access the camera...'); // Debug log

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then((stream) => {
                    console.log('Camera stream started'); // Debug log
                    const video = document.createElement('video');
                    video.srcObject = stream;

                    // When video metadata is loaded, set up the photo taking button
                    video.onloadedmetadata = () => {
                        console.log('Video metadata loaded'); // Debug log

                        video.play();
                        const takePhotoButton = document.createElement('button');
                        takePhotoButton.textContent = 'Take Photo';
                        takePhotoButton.id = 'takePhoto';
                        takePhotoButton.style.display = 'block';
                        takePhotoButton.style.margin = '10px auto';
                        document.body.appendChild(video);
                        document.body.appendChild(takePhotoButton);

                        // Take a photo when the button is clicked
                        takePhotoButton.addEventListener('click', () => {
                            const canvas = document.createElement('canvas');
                            canvas.width = video.videoWidth;
                            canvas.height = video.videoHeight;
                            const context = canvas.getContext('2d');
                            context.drawImage(video, 0, 0, canvas.width, canvas.height);

                            // Save the photo to local storage
                            const dataURL = canvas.toDataURL('image/png');
                            localStorage.setItem('userPhoto', dataURL);
                            console.log('Photo saved to local storage'); // Debug log

                            // Stop the camera stream
                            stream.getTracks().forEach(track => track.stop());
                            document.body.removeChild(video);
                            document.body.removeChild(takePhotoButton);

                            alert('Photo saved to local storage!');

                            // Show button to display the photo
                            const showPhotoButton = document.createElement('button');
                            showPhotoButton.textContent = 'Show Photo';
                            showPhotoButton.style.display = 'block';
                            showPhotoButton.style.margin = '10px auto';
                            document.body.appendChild(showPhotoButton);

                            showPhotoButton.addEventListener('click', () => {
                                const userPhoto = localStorage.getItem('userPhoto');
                                if (userPhoto) {
                                    const photoWindow = window.open('');
                                    photoWindow.document.write(`<img src="${userPhoto}" alt="User Photo">`);
                                } else {
                                    alert('No photo found in local storage.');
                                }
                            });
                        });
                    };

                    video.onerror = (error) => {
                        console.error('Video playback error:', error);
                        alert('Error playing video.');
                    };
                })
                .catch((error) => {
                    console.error('Error accessing the camera:', error);
                    alert('Unable to access the camera. Error: ' + error.message);
                });
        } else {
            console.error('getUserMedia is not supported in this browser.');
            alert('Camera not supported.');
        }
    }

    // Add event listener to the track button
    const trackButton = document.getElementById('track');
    if (trackButton) {
        trackButton.addEventListener('click', () => {
            accessCamera();
        });
    } else {
        console.error('Track button not found!');
    }
});