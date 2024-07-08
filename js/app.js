document.addEventListener('DOMContentLoaded', () => {
    const itemInput = document.getElementById('item-input');
    const addItemButton = document.getElementById('add-item');
    const counterSection = document.getElementById('counter-section');
    const resetScoresButton = document.getElementById('reset-scores');
    const deleteItemsButton = document.getElementById('delete-items');
    const installAppButton = document.getElementById('install-app');

    let items = JSON.parse(localStorage.getItem('items')) || [];
    let deferredPrompt;

    addItemButton.addEventListener('click', () => {
        const item = itemInput.value.trim();
        if (item) {
            items.push({ name: item, count: 0 });
            localStorage.setItem('items', JSON.stringify(items));
            renderItems();
            itemInput.value = '';
        }
    });

    counterSection.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
            const index = event.target.dataset.index;
            items[index].count += 1;
            localStorage.setItem('items', JSON.stringify(items));
            renderItems();
        }
    });

    resetScoresButton.addEventListener('click', () => {
        items = items.map(item => ({ ...item, count: 0 }));
        localStorage.setItem('items', JSON.stringify(items));
        renderItems();
    });

    deleteItemsButton.addEventListener('click', () => {
        items = [];
        localStorage.setItem('items', JSON.stringify(items));
        renderItems();
    });

    function renderItems() {
        counterSection.innerHTML = '';
        items.forEach((item, index) => {
            const button = document.createElement('button');
            button.textContent = `${item.name}: ${item.count}`;
            button.dataset.index = index;
            counterSection.appendChild(button);
        });
    }

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        installAppButton.style.display = 'block';
    });

    installAppButton.addEventListener('click', () => {
        installAppButton.style.display = 'none';
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the A2HS prompt');
            } else {
                console.log('User dismissed the A2HS prompt');
            }
            deferredPrompt = null;
        });
    });

    renderItems();
});
