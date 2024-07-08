document.addEventListener('DOMContentLoaded', () => {
  const itemInput = document.getElementById('item-input');
  const addItemButton = document.getElementById('add-item');
  const counterSection = document.getElementById('counter-section');
  const items = JSON.parse(localStorage.getItem('items')) || [];

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

  function renderItems() {
      counterSection.innerHTML = '';
      items.forEach((item, index) => {
          const button = document.createElement('button');
          button.textContent = `${item.name}: ${item.count}`;
          button.dataset.index = index;
          counterSection.appendChild(button);
      });
  }

  renderItems();
});
