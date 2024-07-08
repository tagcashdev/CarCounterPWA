document.addEventListener('DOMContentLoaded', () => {
    const countersInput = document.getElementById('counters-input');
    const addCountersButton = document.getElementById('add-counters');
    const counterSection = document.getElementById('counter-section');
    const resetScoresButton = document.getElementById('reset-scores');
    const deleteCountersButton = document.getElementById('delete-counters');
    const installAppButton = document.getElementById('install-app');

    let counters = JSON.parse(localStorage.getItem('counters')) || [];
    let deferredPrompt;

    addCountersButton.addEventListener('click', () => {
        const counter = countersInput.value.trim();
        if (counter) {
            counters.push({ name: counter, count: 0 });
            localStorage.setItem('counters', JSON.stringify(counters));
            renderCounters();
            countersInput.value = '';
        }
    });

    // Gestion des événements de clic sur les boutons + et -
    counterSection.addEventListener('click', (event) => {
        const target = event.target;
        if (target.tagName === 'BUTTON') {
            const action = target.dataset.action;
            const counterName = target.dataset.name;

            if (action === 'increment') {
                const counter = counters.find(counter => counter.name === counterName);
                if (counter) {
                    counter.count++;
                    renderCounters();
                }
            } else if (action === 'decrement') {
                const counter = counters.find(counter => counter.name === counterName);
                if (counter && counter.count > 0) {
                    counter.count--;
                    renderCounters();
                }
            }
        }
    });

    resetScoresButton.addEventListener('click', () => {
        counters = counters.map(item => ({ ...counter, count: 0 }));
        localStorage.setItem('counters', JSON.stringify(counters));
        renderCounters();
    });

    deleteCountersButton.addEventListener('click', () => {
        counters = [];
        localStorage.removeItem('counters');
        renderCounters();
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

    // Fonction pour rendre les éléments de compteur dans le DOM
    function renderCounters() {
        counterSection.innerHTML = '';
        counters.forEach(counter => {
            const counterDiv = document.createElement('div');
            counterDiv.className = 'bg-white p-4 rounded-lg shadow-md mb-4';
            counterDiv.innerHTML = `
                <p class="text-lg font-bold mb-2">${counter.name} : ${counter.count}</p>
                <div class="flex items-center">
                    <button class="bg-green-500 text-white px-4 py-2 rounded mr-2" data-name="${counter.name}" data-action="increment">+</button>
                    <button class="bg-red-500 text-white px-4 py-2 rounded ml-2" data-name="${counter.name}" data-action="decrement">-</button>
                </div>
            `;
            counterSection.appendChild(counterDiv);
        });
    }
    /*
    function renderItems() {
        counterSection.innerHTML = '';
        items.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'bg-white p-2 rounded shadow';
            itemDiv.innerHTML = `
                <span>${item.name}: ${item.count}</span>
            `;
            counterSection.appendChild(itemDiv);
        });
    }*/

    renderCounters();
});
