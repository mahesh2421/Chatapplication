document.getElementById('send-button').addEventListener('click', function() {
    const userInput = document.getElementById('user-input').value.trim().toLowerCase();
    const chatBox = document.getElementById('chat-box');

    if (userInput === 'news') {
        fetchRSS();
    } else {
        addMessage('User', userInput, 'user');
        addMessage('Bot', "Please type 'news' to get the latest news from NDTV.", 'bot');
    }

    document.getElementById('user-input').value = '';
});

function addMessage(sender, message, className) {
    const chatBox = document.getElementById('chat-box');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${className}`;
    messageDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function fetchRSS() {
    const proxyUrl = 'https://api.allorigins.win/get?url=';
    const targetUrl = 'https%3A%2F%2Ffeeds.feedburner.com%2Fndtvnews-top-stories';

    fetch(`${proxyUrl}${targetUrl}`)
        .then(response => response.json())
        .then(data => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data.contents, "text/xml");
            const items = xmlDoc.querySelectorAll("item");
            let newsList = "<ul>";

            items.forEach((item, index) => {
                if (index < 5) { // Show top 5 news items
                    const title = item.querySelector("title").textContent;
                    const link = item.querySelector("link").textContent;
                    newsList += `<li><a href="${link}" target="_blank">${title}</a></li>`;
                }
            });

            newsList += "</ul>";
            addMessage('Bot', newsList, 'bot');
        })
        .catch(error => addMessage('Bot', 'Error fetching news.', 'bot'));
}
