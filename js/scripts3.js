const placeInput = document.getElementById('place-input');
const startDateInput = document.getElementById('start-date-input');
const endDateInput = document.getElementById('end-date-input');
const searchButton = document.getElementById('search-button');

searchButton.addEventListener('click', (e) => {
  e.preventDefault();
  const place = placeInput.value.trim();
  const startDate = startDateInput.value.trim();
  const endDate = endDateInput.value.trim();

  // Add your search logic here
  console.log(`Searching for: ${place} from ${startDate} to ${endDate}`);
});