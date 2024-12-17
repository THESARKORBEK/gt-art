document.addEventListener("DOMContentLoaded", () => {
    const startTime = new Date().getTime();

    // Get previous visit time from local storage
    let lastVisitTime = localStorage.getItem('lastVisitTime');
    if (lastVisitTime) {
        lastVisitTime = new Date(parseInt(lastVisitTime));
        console.log(`Your last visit was on ${lastVisitTime}`);
    } else {
        console.log('This is your first visit!');
    }

    // Update local storage with the current visit time
    localStorage.setItem('lastVisitTime', startTime);

    // Calculate and log the duration of the visit when the user leaves the page
    window.addEventListener('beforeunload', () => {
        const endTime = new Date().getTime();
        const duration = (endTime - startTime) / 1000; // duration in seconds
        console.log(`You stayed on this page for ${duration} seconds.`);

        // Store the visit duration in local storage
        localStorage.setItem('visitDuration', duration);
    });

    // Fetch and display the user's IP address
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('userIP', data.ip);
        })
        .catch(error => console.error('Error fetching IP address:', error));

    // Add event listener to the track button
    document.getElementById('track').addEventListener('click', () => {
        let lastVisit = localStorage.getItem('lastVisitTime');
        let visitDuration = localStorage.getItem('visitDuration');
        let userIP = localStorage.getItem('userIP');

        if (lastVisit) {
            lastVisit = new Date(parseInt(lastVisit));
            alert(`Your last visit was on ${lastVisit}\nYou stayed for ${visitDuration} seconds.\nYour IP address: ${userIP}`);
        } else {
            alert('This is your first visit!');
        }

        // Access the camera and take a photo
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
                const video = document.createElement('video');
                video.srcObject = stream;
                video.play();

                const button = document.createElement('button');
                button.textContent = 'Take Photo';
                document.body.appendChild(video);
                document.body.appendChild(button);

                button.addEventListener('click', () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    const context = canvas.getContext('2d');
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);
                    
                    // Save the photo to local storage
                    const dataURL = canvas.toDataURL('image/png');
                    localStorage.setItem('userPhoto', dataURL);

                    // Stop the camera
                    stream.getTracks().forEach(track => track.stop());
                    document.body.removeChild(video);
                    document.body.removeChild(button);

                    alert('Photo saved to local storage!');

                    // Show button to display the photo
                    const showPhotoButton = document.createElement('button');
                    showPhotoButton.textContent = 'Show Photo';
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
            }).catch((error) => {
                console.error('Error accessing the camera:', error);
                alert('Unable to access the camera.');
            });
        } else {
            alert('Camera not supported.');
        }
    });
});
