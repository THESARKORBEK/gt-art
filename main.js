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

    // Add event listener to the track button
    document.getElementById('track').addEventListener('click', () => {
        let lastVisit = localStorage.getItem('lastVisitTime');
        let visitDuration = localStorage.getItem('visitDuration');

        if (lastVisit) {
            lastVisit = new Date(parseInt(lastVisit));
            alert(`Your last visit was on ${lastVisit}\nYou stayed for ${visitDuration} seconds.`);
        } else {
            alert('This is your first visit!');
        }
    });
});
