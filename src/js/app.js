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
    /*
        if (event.target.tagName === 'SPAN') {
            const itemText = event.target.textContent;
            const itemIndex = items.findIndex(item => item.name === itemText);
            if (itemIndex !== -1) {
                items[itemIndex].count += 1;
                localStorage.setItem('items', JSON.stringify(items));
                renderItems();
            }
        }
    */
    counterSection.addEventListener('click', (event) => {
        const target = event.target;
        if (target.tagName === 'BUTTON') {
            const action = target.dataset.action;
            const counterName = target.dataset.name;
            const counterIndex = counters.findIndex(counter => counter.name === counterName);

            if (action === 'increment') { 
                counters[counterIndex].count += 1;
            } else if (action === 'decrement') {
                if (counters[counterIndex].count > 0) {
                    counters[counterIndex].count -= 1;
                }
            }

            localStorage.setItem('counters', JSON.stringify(counters));
            renderCounters();
        }
    });

    resetScoresButton.addEventListener('click', () => {
        counters = counters.map(counter => ({ ...counter, count: 0 }));
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
        console.log('renderCounters');
        counterSection.innerHTML = '';
        counters.forEach(counter => {
            const counterDiv = document.createElement('div');
            counterDiv.className = 'bg-white p-4 rounded-lg shadow-md mb-4';
            counterDiv.innerHTML = `
                <div class="group relative">
                    <div class="flex justify-between flex-wrap">
                        <p class="text-lg font-bold mb-2 w-full">${counter.name} : ${counter.count}</p>
                            <p class="text-sm font-medium text-gray-900 w-1/2">
                                <button class="w-full bg-green-500 text-white px-4 py-2 rounded mr-2" data-name="${counter.name}" data-action="increment">+</button>
                            </p>
                        <p class="text-sm font-medium text-gray-900  w-1/2">
                            <button class="w-full bg-red-500 text-white px-4 py-2 rounded ml-2" data-name="${counter.name}" data-action="decrement">-</button>
                        </p>
                    </div>
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
