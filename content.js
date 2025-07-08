// JavaScript source code
function highlightAccounts() {
    const accounts = accountList;

    const usernameElements = document.querySelectorAll('a[href*="/"] span, div[data-testid="UserName"] span, span');
    usernameElements.forEach(element => {
        let username = element.textContent;
        if (!username || !username.startsWith('@')) return;
        username = username.replace(/^@/, '').toLowerCase();

        // Find matching account category
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

highlightAccounts();
const observer = new MutationObserver(highlightAccounts);
observer.observe(document.body, { childList: true, subtree: true });
