const API_URL = 'https://api.hypixel.net/skyblock/bazaar';
const PRODUCT_ID = 'ENCHANTED_CARROT';
const dataContainer = document.getElementById('data-container');

async function fetchBazaarData() {
    try {
        const response = await fetch(API_URL);

        // Check if the network response was successful
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Check if the data is valid and the product exists
        if (data.success && data.products[PRODUCT_ID]) {
            const productData = data.products[PRODUCT_ID];
            displayData(productData);
        } else {
            dataContainer.innerHTML = '<p>Error: Product data not found.</p>';
        }

    } catch (error) {
        dataContainer.innerHTML = `<p>Error fetching data: ${error.message}</p>`;
        console.error('There was a problem with the fetch operation:', error);
    }
}

function displayData(productData) {
    const quickStatus = productData.quick_status;
    const sellSummary = productData.sell_summary;
    const buySummary = productData.buy_summary;

    dataContainer.innerHTML = `
        <p><strong>Product ID:</strong> ${PRODUCT_ID}</p>
        <p><strong>Sell Price (Quick Status):</strong> ${quickStatus.sellPrice.toFixed(2)} coins</p>
        <p><strong>Buy Price (Quick Status):</strong> ${quickStatus.buyPrice.toFixed(2)} coins</p>
        
        <div class="buy-orders">
            <h3>Buy Orders (Top 3)</h3>
            <ul>
                ${buySummary.slice(0, 3).map(order => `
                    <li><strong>Price per unit:</strong> ${order.pricePerUnit.toFixed(2)} coins | <strong>Orders:</strong> ${order.orders} | <strong>Amount:</strong> ${order.amount}</li>
                `).join('')}
            </ul>
        </div>

        <div class="sell-orders">
            <h3>Sell Orders (Top 3)</h3>
            <ul>
                ${sellSummary.slice(0, 3).map(order => `
                    <li><strong>Price per unit:</strong> ${order.pricePerUnit.toFixed(2)} coins | <strong>Orders:</strong> ${order.orders} | <strong>Amount:</strong> ${order.amount}</li>
                `).join('')}
            </ul>
        </div>
    `;
}

// Call the function to fetch and display data when the page loads
fetchBazaarData();
