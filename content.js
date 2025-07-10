function highlightAccounts(accounts) {
       console.log("Accounts loaded:", accounts);
       const usernameElements = document.querySelectorAll('a[href*="/"] span.css-1jxf684, div[data-testid="UserName"] span, span.css-1jxf684');
       usernameElements.forEach(element => {
         let username = element.textContent;
         if (!username || !username.startsWith('@')) return;
         username = username.replace(/^@/, '').toLowerCase();

         const account = accounts.find(cat => cat.usernames.some(u => u.toLowerCase() === username));
         if (account) {
           element.style.backgroundColor = account.color;
           element.style.color = "white";
           element.style.padding = "2px 4px";
           element.style.borderRadius = "4px";
           element.title = `Category: ${account.category}`;
         }
       });
     }

     // Load initial accounts
     chrome.storage.local.get(['accountList'], (result) => {
       if (result.accountList) {
         highlightAccounts(result.accountList);
       } else {
         console.log("No accountList found in storage");
       }
     });

     // Listen for updates
     chrome.runtime.onMessage.addListener((message) => {
       if (message.type === "accountsUpdated") {
         chrome.storage.local.get(['accountList'], (result) => {
           if (result.accountList) {
             highlightAccounts(result.accountList);
           } else {
             console.log("No accountList after update");
           }
         });
       }
     });

     //Trigger manual update on script load (for testing)
    chrome.runtime.sendMessage({ type: "updateNow" }, (response) => {
    console.log("Manual update response:", response);
    });

    // Run forceUpdate() in the console
    function forceUpdate() {
    chrome.runtime.sendMessage({type: "updateNow"}, (response) => console.log("Update response:", response));
    };


     // Handle dynamic content
     const observer = new MutationObserver(() => {
       chrome.storage.local.get(['accountList'], (result) => {
         if (result.accountList) {
           highlightAccounts(result.accountList);
         }
       });
     });
     observer.observe(document.body, { childList: true, subtree: true });
