(function () {
    const capsuleElement = document.querySelector('#capsule-countdown');
    if(!capsuleElement) return;
    const capsuleDate = capsuleElement.getAttribute('data-countdown-to');
    console.log(capsuleDate);
    const finaleDate = new Date(capsuleDate).getTime();
  console.log(finaleDate);
    const daysElement = capsuleElement.querySelector('#cap-days');
    const hoursElement = capsuleElement.querySelector('#cap-hours');
    const minutesElement = capsuleElement.querySelector('#cap-minutes');
    const secondsElement = capsuleElement.querySelector('#cap-seconds');
    const timer = () => {
        const now = new Date().getTime();
        let diff = finaleDate - now;
        // Showing the alert when the counter time finishes.
        if (diff < 0) {
            capsuleElement.style.display = 'none';
            return false;
        }

        let days = Math.floor(diff / (1000 * 60 * 60 * 24));
        let hours = Math.floor(diff % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
        let minutes = Math.floor(diff % (1000 * 60 * 60) / (1000 * 60));
        let seconds = Math.floor(diff % (1000 * 60) / 1000);
        // Adding the zeros.
        days >= 10 ? days = `${days}` : days;
        days <= 9 ? days = `0${days}` : days;
        hours <= 9 ? hours = `0${hours}` : hours;
        minutes <= 9 ? minutes = `0${minutes}` : minutes;
        seconds <= 9 ? seconds = `0${seconds}` : seconds;

        daysElement.textContent = days;
        hoursElement.textContent = hours;
        minutesElement.textContent = minutes;
        secondsElement.textContent = seconds;

    }
    timer();
    // Calling the function every 1000 milliseconds.
    setInterval(timer, 1000);
})();