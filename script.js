const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const currentMonth = new Date().getMonth(); // Get the current month (0-11)
document.getElementById('current-month').textContent = monthNames[currentMonth];

function startCountdownToNextMonth(display) {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1); // Start of the next month
    const timeRemaining = nextMonth - now; // Time difference in milliseconds

    let timer = Math.floor(timeRemaining / 1000); // Convert to seconds

    const interval = setInterval(() => {
        const days = Math.floor(timer / (24 * 3600));
        const hours = Math.floor((timer % (24 * 3600)) / 3600);
        const minutes = Math.floor((timer % 3600) / 60);
        const seconds = timer % 60;

        // Format time as DD:HH:MM:SS
        display.textContent = `${days.toString().padStart(2, '0')}:${hours
            .toString()
            .padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        if (--timer < 0) {
            clearInterval(interval);
            display.textContent = "Offer expired!";
        }
    }, 1000);
}

document.addEventListener("DOMContentLoaded", () => {
    const timerElement = document.getElementById("timer");
    startCountdownToNextMonth(timerElement);
});

document.getElementById("purchase-btn").addEventListener("click", function () {
    // Show the popup
    document.getElementById("popup-modal").style.display = "flex";
});

document.getElementById("close-btn").addEventListener("click", function () {
    // Hide the popup when the close button is clicked
    document.getElementById("popup-modal").style.display = "none";
});