document.addEventListener('DOMContentLoaded', () => {
  const dropdownLink = document.querySelector('[data-dropdown]');
  const dropdownBtn = dropdownLink.querySelector('.dropdown-btn');

  dropdownBtn.addEventListener('click', (event) => {
    event.preventDefault(); 
    dropdownLink.classList.toggle('active');
  });
});