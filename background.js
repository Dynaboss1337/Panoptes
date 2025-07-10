console.log("Background service worker started");
console.log("Background listener initialized");

// Initial fetch on install
chrome.runtime.onInstalled.addListener(() => {
    console.log("Installed, starting initial fetch...");
    fetchAccounts();
});

// Periodic fetch every hour
setTimeout(fetchAccounts, 3600000); // 1 hour in milliseconds
setInterval(fetchAccounts, 3600000); // Repeat every hour

function fetchAccounts() {
    console.log("Attempting to fetch accountList.json...");
    fetch('https://dynaboss1337.github.io/Panoptes/accountList.json')
        .then(response => {
            console.log("Fetch response status:", response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Fetched data:", data);
            if (Array.isArray(data)) {
                chrome.storage.local.set({ accountList: data }, () => {
                    console.log("Account list saved:", data);
                    chrome.runtime.sendMessage({ type: "accountsUpdated" });
                });
            } else {
                console.error("Fetched data is not an array:", data);
            }
        })
        .catch(error => {
            console.error("Fetch error:", error.message);
});

// Listen for manual update request
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "updateNow") {
        console.log("Manual update requested");
        fetchAccounts();
        sendResponse({ status: "Update initiated" });
    }
});
