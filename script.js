const SPREADSHEET_ID = '1fs9p0wUwJxyDwiLaSJ9ZH9K9FZS1tjAV_1hrX_mzuic'; // Google Sheet ID
const API_KEY = 'AIzaSyB9X6vArhzlQtB8eLtd3fRJmf4tyA_OkCo';
const RANGE = 'Sheet1!A2:F';

const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const currentDate = new Date();
const currentMonth = currentDate.getMonth();

// Display the current month
document.getElementById('current-month').textContent = monthNames[currentMonth];

document.getElementById('next-month').textContent = monthNames[currentMonth + 1];


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
            location.reload()
        }
    }, 1000);
}

function convertToDriveImageUrl(driveLink) {
    if (driveLink) {
        const match = driveLink.match(/\/d\/([a-zA-Z0-9_-]+)\//);
        if (match) {
            return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
        } else {
            console.error("Google Drive link format is invalid.");
            return 'images/item/Placeholder.png';
        }
    } else {
        console.error("Google Drive link format is invalid.");
        return 'images/item/Placeholder.png';
    }
}

// Update the product info section after fetching data from the sheet
function fetchSheetData() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const rows = data.values;
            const currentMonthData = rows[currentMonth];

            if (currentMonthData) {
                const itemName = currentMonthData[1];
                const price = currentMonthData[2];
                const tokopediaLink = currentMonthData[3];
                const shopeeLink = currentMonthData[4];
                const imageLink = convertToDriveImageUrl(currentMonthData[5]);
                const upcomingImageLink = convertToDriveImageUrl(rows[currentMonth + 1][5]);

                // Update the DOM
                document.getElementById('product-name').textContent = itemName;
                document.getElementById('product-price').textContent = price;
                document.getElementById('tokopedia-link').href = tokopediaLink;
                document.getElementById('shopee-link').href = shopeeLink;
                document.getElementById('product-image').src = imageLink;

                document.getElementById('upcoming-image').src = upcomingImageLink;

                if (upcomingImageLink != 'images/item/Placeholder.png') {
                    document.getElementById('upcoming-image').classList.add('darkened');
                }
            }
        })
        .catch(error => console.error('Error fetching data from Google Sheets:', error));
}

document.addEventListener("DOMContentLoaded", () => {
    const timerElement = document.getElementById("timer");
    startCountdownToNextMonth(timerElement);
    fetchSheetData();
});

document.addEventListener("DOMContentLoaded", () => {
    const timerElement = document.getElementById("next-timer");
    startCountdownToNextMonth(timerElement);
});

document.getElementById("purchase-btn").addEventListener("click", function () {
    document.getElementById("popup-modal").style.display = "flex";
    document.body.classList.add("no-scroll");
});

document.getElementById("close-btn").addEventListener("click", function () {
    document.getElementById("popup-modal").style.display = "none";
    document.body.classList.remove("no-scroll");
});
