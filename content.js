// JavaScript source code
async function fetchAccountList() {
    try {
        const response = await fetch('https://github.com/Dynaboss1337/Panoptes/accountList.json');
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch account list:', error);
        return []; // Fallback to empty list on failure
    }
}

async function highlightAccounts() {
    const accounts = await fetchAccountList();

    const usernameElements = document.querySelectorAll('a[href*="/"] span, div[data-testid="UserName"] span, span');
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

highlightAccounts();
const observer = new MutationObserver(highlightAccounts);
observer.observe(document.body, { childList: true, subtree: true });