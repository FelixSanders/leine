const SPREADSHEET_ID = '1fs9p0wUwJxyDwiLaSJ9ZH9K9FZS1tjAV_1hrX_mzuic'; // Google Sheet ID
const API_KEY = 'AIzaSyB9X6vArhzlQtB8eLtd3fRJmf4tyA_OkCo';
const RANGE = 'A3:K';
const itemAmount = 2;


const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const currentDate = new Date();
const currentMonth = currentDate.getMonth();
const currentYear = currentDate.getFullYear();


// Display the current month


document.getElementById('next-month').textContent = monthNames[currentMonth + 1];


function startCountdownToNextMonth(display) {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const timeRemaining = nextMonth - now;

    let timer = Math.floor(timeRemaining / 1000);

    const interval = setInterval(() => {
        const days = Math.floor(timer / (24 * 3600));
        const hours = Math.floor((timer % (24 * 3600)) / 3600);
        const minutes = Math.floor((timer % 3600) / 60);
        const seconds = timer % 60;

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

function fetchSheetData() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${currentYear}!${RANGE}?key=${API_KEY}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const rows = data.values;
            const currentRow = rows[currentMonth];
            console.log('hi')
            for (let i = 0; i < itemAmount; i++) {
                const productStartCol = i * 5;
                const itemName = currentRow[productStartCol + 1];
                const price = currentRow[productStartCol + 2];
                const tokopediaLink = currentRow[productStartCol + 3];
                const shopeeLink = currentRow[productStartCol + 4];
                const imageLink = convertToDriveImageUrl(currentRow[productStartCol + 5]);

                const productContainer = document.getElementById('product-container');

                const productItem = document.createElement('div');
                productItem.classList.add('product-item');

                const productImage = document.createElement('img');
                productImage.src = imageLink;
                productImage.alt = 'Product Image';
                productImage.classList.add('product-image');
                productItem.appendChild(productImage);

                const productDetails = document.createElement('div');
                productDetails.classList.add('product-details');

                const productName = document.createElement('p');
                productName.classList.add('product-text');
                productName.textContent = itemName;
                productDetails.appendChild(productName);

                const productPrice = document.createElement('p');
                productPrice.classList.add('product-price');
                productPrice.textContent = price;
                productDetails.appendChild(productPrice);

                const purchaseButton = document.createElement('button');
                purchaseButton.classList.add('purchase-button');
                purchaseButton.innerHTML = '<i class="fa-solid fa-cart-shopping"></i> BUY';
                productDetails.appendChild(purchaseButton);

                productItem.appendChild(productDetails);
                productContainer.appendChild(productItem);

                purchaseButton.addEventListener("click", function () {
                    document.getElementById("popup-modal").style.display = "flex";
                    document.body.classList.add("no-scroll");
                    
                    document.getElementById('tokopedia-link').href = tokopediaLink;
                    document.getElementById('shopee-link').href = shopeeLink;
                });
            }
        })
        .catch(error => console.error('Error fetching data from Google Sheets:', error));
}

const menuToggle = document.getElementById("menu-toggle");
const menu = document.getElementById("menu");

menuToggle.addEventListener("click", () => {
    menu.classList.toggle("active");
});

document.addEventListener("DOMContentLoaded", () => {
    const overlayTitle = document.querySelector(".overlay-title");

    const year = currentDate.getFullYear();

    const monthText = `${monthNames[currentMonth]} '${year.toString().slice(-2)} Collection`;

    overlayTitle.textContent = monthText.toUpperCase();
    document.getElementById('current-month').textContent = monthText;
});


document.addEventListener("DOMContentLoaded", () => {
    const timerElement = document.getElementById("next-timer");
    startCountdownToNextMonth(timerElement);
    fetchSheetData();
});


document.getElementById("close-btn").addEventListener("click", function () {
    document.getElementById("popup-modal").style.display = "none";
    document.body.classList.remove("no-scroll");
});

document.getElementById("popup-modal").addEventListener("click", function (e) {
    if (e.target === document.getElementById("popup-modal")) {
        document.getElementById("popup-modal").style.display = "none";
        document.body.classList.remove("no-scroll");
    }
});
