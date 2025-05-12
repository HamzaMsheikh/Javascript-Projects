function clock() {
    const clockElm = document.getElementById('clock');
    const date = new Date();

    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    let am_pm = "AM";

    if (hours >= 12) {
        am_pm = "PM";
        if (hours > 12) hours -= 12;
    }

    if (hours === 0) hours = 12;

    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${am_pm}`;

    clockElm.textContent = formattedTime;
}

setInterval(clock, 1000);
clock();
