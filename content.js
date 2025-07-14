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

        // Apply blackout and mute only for specific categories
        const blackoutCategories = ["BNWO account", "Fake Right Winger, BNWO shill"];
        if (blackoutCategories.includes(account.category)) {
          // Blackout profile picture
          const profileContainer = element.closest('div[role="main"]')?.querySelector('img.avatar');
          if (profileContainer) {
            profileContainer.style.setProperty('filter', 'brightness(0)', 'important');
            profileContainer.setAttribute('inert', '');
          }

          // Blackout banner
          const bannerContainer = element.closest('div[data-testid="UserProfileHeader_Container"]')?.querySelector('img');
          if (bannerContainer) {
            bannerContainer.style.setProperty('filter', 'brightness(0)', 'important');
            bannerContainer.setAttribute('inert', '');
          }

          // Blackout post images/videos
          const mediaContainers = element.closest('article')?.querySelectorAll('div[data-testid="tweetPhoto"] img, div[data-testid="videoPlayer"] video');
          mediaContainers.forEach(media => {
            media.style.setProperty('filter', 'brightness(0)', 'important');
            media.setAttribute('inert', '');
            if (media.tagName === 'VIDEO') {
              media.muted = true;
              media.pause();
              console.log("Muting video:", media); // Debug log
            }
          });

          // Blackout retweet media
          const retweetArticles = document.querySelectorAll('article[data-testid="tweet"]');
          retweetArticles.forEach(article => {
            const retweetUsername = article.querySelector('a[href*="/status/"] span.css-1jxf684')?.textContent?.replace(/^@/, '').toLowerCase();
            if (retweetUsername && account.usernames.some(u => u.toLowerCase() === retweetUsername)) {
              const retweetMedia = article.querySelectorAll('div[data-testid="tweetPhoto"] img, div[data-testid="videoPlayer"] video');
              retweetMedia.forEach(media => {
                media.style.setProperty('filter', 'brightness(0)', 'important');
                media.setAttribute('inert', '');
                if (media.tagName === 'VIDEO') {
                  media.muted = true;
                  media.pause();
                  console.log("Muting retweet video:", media); // Debug log
                }
              });
            }
          });
        }
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

  // Trigger manual update on script load (for testing)
  chrome.runtime.sendMessage({type: "updateNow"}, (response) => {
    console.log("Manual update response:", response);
  });

  // Handle dynamic content
  const observer = new MutationObserver(() => {
    chrome.storage.local.get(['accountList'], (result) => {
      if (result.accountList) {
        highlightAccounts(result.accountList);
      }
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
