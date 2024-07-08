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
        if (event.target.tagName === 'SPAN') {
            const itemText = event.target.textContent;
            const itemIndex = items.findIndex(item => item.name === itemText);
            if (itemIndex !== -1) {
                items[itemIndex].count += 1;
                localStorage.setItem('items', JSON.stringify(items));
                renderItems();
            }
        }
    });

    /*
    counterSection.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
            const index = event.target.dataset.index;
            items[index].count += 1;
            localStorage.setItem('items', JSON.stringify(items));
            renderItems();
        }
    });
    */

    resetScoresButton.addEventListener('click', () => {
        items = items.map(item => ({ ...item, count: 0 }));
        localStorage.setItem('items', JSON.stringify(items));
        renderItems();
    });

    deleteItemsButton.addEventListener('click', () => {
        items = [];
        localStorage.removeItem('items');
        renderItems();
    });

    window.addEventListener('beforeinstallprompt', (event) => {
        event.preventDefault();
        deferredPrompt = event;
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

    function renderItems() {
        counterSection.innerHTML = '';
        items.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'flex justify-between items-center bg-white p-2 rounded shadow';
            itemDiv.innerHTML = `
                <span>${item.name}: ${item.count}</span>
                <button data-index="${index}" class="bg-blue-500 text-white p-1 rounded">+</button>
            `;
            counterSection.appendChild(itemDiv);
        });
    }

    renderItems();
});
