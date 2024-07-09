document.addEventListener('DOMContentLoaded', () => {
    const countersInput = document.getElementById('counters-input');
    const addCountersButton = document.getElementById('add-counters');
    const counterSection = document.getElementById('counter-section');
    const resetScoresButton = document.getElementById('reset-scores');
    const deleteCountersButton = document.getElementById('delete-counters');
    const installAppButton = document.getElementById('install-app');
    const configSection = document.getElementById('config-section');
    const listSection = document.getElementById('list-section');
    const listsContainer = document.getElementById('lists-container');

    let lists = JSON.parse(localStorage.getItem('lists')) || { "Default": [] };
    let counters = JSON.parse(localStorage.getItem('counters')) || [];
    let selectedList = localStorage.getItem('selectedList') || "Default";

    // Render the lists and counters on page load
    renderLists();
    renderCounters();

    // Event listener to add a new counter to the selected list
    addCountersButton.addEventListener('click', () => {
        const counterName = countersInput.value.trim();
        if (counterName) {
            counters.push({ name: counterName, count: 0, list: selectedList });
            saveToLocalStorage();
            renderCounters();
            countersInput.value = '';
        }
    });

    // Event listener for incrementing or decrementing counters
    counterSection.addEventListener('click', (event) => {
        const target = event.target;
        if (target.tagName === 'BUTTON') {
            const action = target.dataset.action;
            const counterName = target.dataset.name;
            const counterIndex = counters.findIndex(counter => counter.name === counterName && counter.list === selectedList);

            if (action === 'increment') {
                counters[counterIndex].count += 1;
            } else if (action === 'decrement' && counters[counterIndex].count > 0) {
                counters[counterIndex].count -= 1;
            }

            saveToLocalStorage();
            renderCounters();
        }
    });

    // Event listener to reset scores for all counters in the selected list
    resetScoresButton.addEventListener('click', () => {
        counters = counters.map(counter => counter.list === selectedList ? { ...counter, count: 0 } : counter);
        saveToLocalStorage();
        renderCounters();
    });

    // Event listener to delete all counters in the selected list
    deleteCountersButton.addEventListener('click', () => {
        counters = counters.filter(counter => counter.list !== selectedList);
        saveToLocalStorage();
        renderCounters();
    });

    // Install the app
    window.addEventListener('beforeinstallprompt', (event) => {
        event.preventDefault();
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

    // Toggle display of the list section
    window.toggleListSection = () => {
        const displayStyle = listSection.style.display === 'none' ? 'block' : 'none';
        listSection.style.display = displayStyle;
        configSection.style.display = 'none';
    };

    // Toggle display of the config section
    window.toggleConfigSection = () => {
        const displayStyle = configSection.style.display === 'none' ? 'block' : 'none';
        configSection.style.display = displayStyle;
        listSection.style.display = 'none';
    };

    // Create a new list
    window.createNewList = () => {
        const listName = document.getElementById('new-list-name').value.trim();
        if (listName && !lists[listName]) {
            lists[listName] = [];
            saveToLocalStorage();
            renderLists();
            document.getElementById('new-list-name').value = '';
        }
    };

    // Select a list
    window.selectList = (listName) => {
        selectedList = listName;
        localStorage.setItem('selectedList', selectedList);
        renderCounters();
    };

    // Save lists and counters to local storage
    function saveToLocalStorage() {
        localStorage.setItem('lists', JSON.stringify(lists));
        localStorage.setItem('counters', JSON.stringify(counters));
    }

    // Render the lists
    function renderLists() {
        listsContainer.innerHTML = '';
        for (const listName in lists) {
            const listElement = document.createElement('div');
            listElement.className = 'list-item';
            listElement.innerText = listName;
            listElement.addEventListener('click', () => selectList(listName));
            listsContainer.appendChild(listElement);
        }
    }

    // Render counters for the selected list
    function renderCounters() {
        counterSection.innerHTML = '';
        const listCounters = counters.filter(counter => counter.list === selectedList);
        listCounters.forEach(counter => {
            const counterDiv = document.createElement('div');
            counterDiv.className = 'bg-white p-4 rounded-lg shadow-md mb-4';
            counterDiv.innerHTML = `
                <div class="group relative">
                    <div class="flex justify-between flex-wrap">
                        <p class="text-lg font-bold mb-2 w-full">${counter.name} : ${counter.count}</p>
                        <p class="text-sm font-medium text-gray-900 w-1/2">
                            <button class="w-full bg-green-500 text-white px-4 py-2 rounded mr-2" data-name="${counter.name}" data-action="increment">+</button>
                        </p>
                        <p class="text-sm font-medium text-gray-900 w-1/2">
                            <button class="w-full bg-red-500 text-white px-4 py-2 rounded ml-2" data-name="${counter.name}" data-action="decrement">-</button>
                        </p>
                    </div>
                </div>
            `;
            counterSection.appendChild(counterDiv);
        });
    }
});
