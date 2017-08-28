import Haversine from './haversine';

let currentHeading;
let targetCoordinates;

const distanceInput = document.querySelector('#distance');
const unitSelect = document.querySelector(`select[name='units']`);
const submitButton = document.querySelector('#submitButton');
const currentHeadingSavedAs = document.querySelector('#currentHeadingSavedAs');

const setHeadingButton = document.querySelector('#setHeadingButton');

const startDiv = document.querySelector('#start');
const endDiv = document.querySelector('#end');
const currentDiv = document.querySelector('#current');
const headingDiv = document.querySelector('#heading');
const totalDiv = document.querySelector('#total');

const currentHeadingReadOnly = document.querySelector('#currentHeading');

const setHeadingContainer = document.querySelector('#set-heading-container');
const distanceSavedAlert = document.querySelector('#distanceSavedAlert');
const distanceSavedWithUnits = document.querySelector('#distanceSavedWithUnits');
const setDistanceInput = document.querySelector('#set-distance-input');

const outputDiv = document.querySelector('#output');

submitButton.addEventListener('click', onSubmitClick);

setHeadingButton.addEventListener('click', onSetHeadingClick);

const setDistanceContainer = document.querySelector('#set-distance-container');

function onSetHeadingClick(e) {
  e.preventDefault();
  window.removeEventListener('deviceorientation', onHeadingChange);
  currentHeadingSavedAs.innerHTML = currentHeading ? `${currentHeading.toFixed(2)}&deg;` : '0&deg;';
  setHeadingContainer.querySelector('#set-heading-input').style.display = 'none';
  setHeadingContainer.querySelector('#headingSavedAlert').style.display = 'block';
  setDistanceContainer.style.display = 'block';
}

function onSubmitClick(e) {
  e.preventDefault();
  setDistanceInput.style.display = 'none';
  const selectedUnit = unitSelect.options[unitSelect.selectedIndex].value || 'feet';
  const distance = parseFloat(distanceInput.value);
  const locationOptions = { enableHighAccuracy: true, maximumAge: 1000 };
  distanceSavedWithUnits.textContent = `${distance} ${selectedUnit}`;
  distanceSavedAlert.style.display = 'block';
  navigator.geolocation.getCurrentPosition(locationSuccess, locationFailure, locationOptions);
  outputDiv.style.display = 'block';

  function locationSuccess(position) {
    const { latitude, longitude } = position.coords;
    const heading = currentHeading || 0;

    headingDiv.innerHTML = `${heading.toFixed(2)}&deg;`;
    totalDiv.textContent = `${distance} ${selectedUnit}`;
    targetCoordinates = Haversine.targetCoordinates(position.coords, { distance, heading }, { unit: selectedUnit });

    startDiv.textContent = `${decimalToDMS(latitude, 'lat')}, ${decimalToDMS(longitude, 'lon')}`;
    endDiv.textContent = `${decimalToDMS(targetCoordinates.latitude, 'lat')}, ${decimalToDMS(targetCoordinates.longitude, 'lon')}`;
    currentDiv.textContent = `${distance} ${selectedUnit}`;

    navigator.geolocation.watchPosition(locationUpdate, locationUpdateFailure, locationOptions);

    function locationUpdate(position) {
      const currentDistance = Haversine.distance(position.coords, targetCoordinates, { unit: selectedUnit });
      currentDiv.textContent = `${currentDistance.toFixed(2)} ${selectedUnit}`;

    }

    function locationUpdateFailure(error) {
      console.log(error);
    }
  }

  function locationFailure(error) {
    outputDiv.textContent = error;
  }
}

function decimalToDMS(decimal, type) {
  var degrees = decimal | 0;
  var fraction = Math.abs(decimal - degrees);
  var minutes = (fraction * 60) | 0;
  var seconds = (fraction * 3600 - minutes * 60) | 0;

  var direction = "";
  var positive = degrees > 0;
  degrees = Math.abs(degrees);
  switch (type) {
    case "lat":
      direction = positive ? "N" : "S";
      break;
    case "lng":
      direction = positive ? "E" : "W";
      break;
  }

  return degrees + "° " + minutes + "' " + seconds + "\" " + direction;
}

function onHeadingChange(event) {
  let heading = event.alpha;
  if (typeof event.webkitCompassHeading !== 'undefined') {
    heading = event.webkitCompassHeading;
  }
  currentHeading = heading;
  // if (currentHeading) headingDiv.textContent = `${currentHeading}`;
  if (currentHeading) currentHeadingReadOnly.value = `${currentHeading.toFixed(2)}°`;
}

window.addEventListener('deviceorientation', onHeadingChange);
