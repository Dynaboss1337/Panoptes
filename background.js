chrome.runtime.onInstalled.addListener(() => {
       console.log("Extension installed, fetching accounts...");
       console.log("Background script loaded");
       fetchAndUpdateAccounts();
     });

     chrome.alarms.create("updateAccounts", { periodInMinutes: 60 });

     chrome.alarms.onAlarm.addListener((alarm) => {
       if (alarm.name === "updateAccounts") {
         console.log("Alarm triggered, fetching accounts...");
         fetchAndUpdateAccounts();
       }
     });

     function fetchAndUpdateAccounts() {
       console.log("Fetching accountList.json...");
       fetch('https://raw.githubusercontent.com/dynaboss1337/Panoptes/main/accountList.json')
         .then(response => {
           console.log("Response received, status:", response.status);
           if (!response.ok) throw new Error("HTTP error " + response.status);
           return response.json();
         })
         .then(data => {
           console.log("Data fetched:", data);
           chrome.storage.local.set({ accountList: data }, () => {
             console.log("Account list stored:", data);
             chrome.runtime.sendMessage({ type: "accountsUpdated" });
           });
         })
         .catch(error => console.error("Error fetching accounts:", error));
     }

     chrome.runtime.onMessage.addListener((message) => {
       if (message.type === "updateNow") fetchAndUpdateAccounts();
     });
