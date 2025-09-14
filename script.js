// Global variables to store the fetched data and product IDs
let bazaarData = null;
let allProductIDs = [];
const itemInput = document.getElementById('itemInput');
const resultsDiv = document.getElementById('results');
const autocompleteList = document.getElementById('autocomplete-list');
const loadingMessage = document.getElementById('loadingMessage');

// Function to fetch all product IDs on page load
async function initializeApp() {
    const apiUrl = 'https://api.hypixel.net/skyblock/bazaar';
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        bazaarData = await response.json();
        if (bazaarData.success) {
            allProductIDs = Object.keys(bazaarData.products);
            loadingMessage.textContent = 'Ready!';
            loadingMessage.classList.add('text-green-400');
            setTimeout(() => {
                loadingMessage.textContent = '';
            }, 2000);
        } else {
            throw new Error(bazaarData.cause || 'API request failed.');
        }
    } catch (error) {
        console.error('Initialization error:', error);
        loadingMessage.textContent = 'Error loading item list. Try refreshing the page.';
        loadingMessage.classList.add('text-red-400');
    }
}

// Autocomplete functionality
function autocompleteSearch() {
    // Replace spaces with underscores for the search
    const inputValue = itemInput.value.toUpperCase().trim().replace(/ /g, '_');
    autocompleteList.innerHTML = '';
    autocompleteList.classList.add('hidden');

    if (inputValue.length === 0) {
        return;
    }

    // Change from startsWith() to includes() to find matches anywhere in the string
    const filteredIDs = allProductIDs.filter(id => id.includes(inputValue));

    if (filteredIDs.length > 0) {
        autocompleteList.classList.remove('hidden');
        filteredIDs.slice(0, 10).forEach(id => {
            const suggestionDiv = document.createElement('div');
            suggestionDiv.textContent = id.replace(/_/g, ' ');
            suggestionDiv.classList.add('p-2', 'cursor-pointer', 'text-white', 'hover:bg-slate-600', 'transition', 'duration-100', 'rounded-md');
            suggestionDiv.onclick = () => {
                itemInput.value = id;
                autocompleteList.classList.add('hidden');
                fetchItemData();
            };
            autocompleteList.appendChild(suggestionDiv);
        });
    }
}

// Hide autocomplete list on outside click
document.addEventListener('click', (e) => {
    if (!e.target.matches('#itemInput')) {
        autocompleteList.classList.add('hidden');
    }
});

// The main function to fetch and display data, now using the pre-loaded data
function fetchItemData() {
    // Replace spaces with underscores for the data fetch
    const itemID = itemInput.value.toUpperCase().trim().replace(/ /g, '_');
    
    if (!bazaarData) {
        resultsDiv.innerHTML = '<div class="text-red-400 font-medium">Item list not loaded yet. Please wait.</div>';
        return;
    }

    if (!itemID) {
        resultsDiv.innerHTML = '<div class="text-red-400 font-medium">Please enter a valid item ID.</div>';
        itemInput.classList.add('border-red-400');
        return;
    }

    itemInput.classList.remove('border-red-400');
    
    const product = bazaarData.products[itemID];
    if (!product) {
        resultsDiv.innerHTML = `<div class="text-red-400 font-medium">Item ID "<span class="font-mono">${itemID}</span>" not found. Please check the spelling.</div>`;
        return;
    }
    
    const itemData = product.quick_status;
    const formattedItemID = itemID.replace(/_/g, ' ');

    // Check if quick_status and its properties exist before trying to format them.
    const sellPrice = itemData && itemData.sellPrice ? itemData.sellPrice.toFixed(2) : 'N/A';
    const buyPrice = itemData && itemData.buyPrice ? itemData.buyPrice.toFixed(2) : 'N/A';
    const sellVolume = itemData && itemData.sellVolume ? itemData.sellVolume.toLocaleString() : 'N/A';
    const buyVolume = itemData && itemData.buyVolume ? itemData.buyVolume.toLocaleString() : 'N/A';

    resultsDiv.innerHTML = `
        <div class="space-y-4 w-full text-left text-gray-300">
            <div class="bg-slate-700 rounded-lg p-4 shadow-sm">
                <h2 class="text-xl font-semibold text-blue-200 mb-4">${formattedItemID}</h2>
                <div class="grid grid-cols-2 gap-4">
                    <div><strong class="text-white">Instant Sell:</strong> <span class="text-green-400">${sellPrice}</span> coins</div>
                    <div><strong class="text-white">Instant Buy:</strong> <span class="text-red-400">${buyPrice}</span> coins</div>
                </div>
            </div>
            <div class="bg-slate-700 rounded-lg p-4 shadow-sm">
                <div class="grid grid-cols-2 gap-4">
                    <div><strong class="text-white">Sell Volume:</strong> ${sellVolume}</div>
                    <div><strong class="text-white">Buy Volume:</strong> ${buyVolume}</div>
                </div>
            </div>
        </div>
    `;
}

// Start the application when the window loads
window.onload = initializeApp;
