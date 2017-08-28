/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _haversine = __webpack_require__(1);

var _haversine2 = _interopRequireDefault(_haversine);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var currentHeading = void 0;
var targetCoordinates = void 0;

var distanceInput = document.querySelector('#distance');
var unitSelect = document.querySelector('select[name=\'units\']');
var submitButton = document.querySelector('#submitButton');
var currentHeadingSavedAs = document.querySelector('#currentHeadingSavedAs');

var setHeadingButton = document.querySelector('#setHeadingButton');

var distanceRemainingAlert = document.querySelector('#distanceRemainingAlert');
var distanceRemainingWithUnits = document.querySelector('#distanceRemainingWithUnits');

var startDiv = document.querySelector('#start');
var endDiv = document.querySelector('#end');
var currentDiv = document.querySelector('#current');
var headingDiv = document.querySelector('#heading');
var totalDiv = document.querySelector('#total');

var currentHeadingReadOnly = document.querySelector('#currentHeading');

var setHeadingContainer = document.querySelector('#set-heading-container');
var distanceSavedAlert = document.querySelector('#distanceSavedAlert');
var distanceSavedWithUnits = document.querySelector('#distanceSavedWithUnits');
var setDistanceInput = document.querySelector('#set-distance-input');

var outputDiv = document.querySelector('#output');

submitButton.addEventListener('click', onSubmitClick);
distanceInput.addEventListener('change', onDistanceKeyDown);
distanceInput.addEventListener('keydown', onDistanceKeyDown);
setHeadingButton.addEventListener('click', onSetHeadingClick);

var setDistanceContainer = document.querySelector('#set-distance-container');

function onDistanceKeyDown(e) {
  var num = e.target.value;
  if (num.length && !isNaN(num)) {
    submitButton.disabled = false;
    if (e.keyCode === 13) {
      onSubmitClick(e);
    }
  } else {
    submitButton.disabled = true;
  }
}

function onSetHeadingClick(e) {
  e.preventDefault();
  window.removeEventListener('deviceorientation', onHeadingChange);
  currentHeadingSavedAs.innerHTML = currentHeading ? currentHeading.toFixed(2) + '&deg;' : '0&deg;';
  setHeadingContainer.querySelector('#set-heading-input').style.display = 'none';
  setHeadingContainer.querySelector('#headingSavedAlert').style.display = 'block';
  setDistanceContainer.style.display = 'block';
}

function onSubmitClick(e) {
  e.preventDefault();
  setDistanceInput.style.display = 'none';
  var selectedUnit = unitSelect.options[unitSelect.selectedIndex].value || 'feet';
  var distance = parseFloat(distanceInput.value);
  var locationOptions = { enableHighAccuracy: true, maximumAge: 1000 };
  distanceSavedWithUnits.textContent = distance + ' ' + selectedUnit;
  distanceSavedAlert.style.display = 'block';
  navigator.geolocation.getCurrentPosition(locationSuccess, locationFailure, locationOptions);
  outputDiv.style.display = 'block';

  function locationSuccess(position) {
    var _position$coords = position.coords,
        latitude = _position$coords.latitude,
        longitude = _position$coords.longitude;

    var heading = currentHeading || 0;

    headingDiv.innerHTML = heading.toFixed(2) + '&deg;';
    totalDiv.textContent = distance + ' ' + selectedUnit;
    targetCoordinates = _haversine2.default.targetCoordinates(position.coords, { distance: distance, heading: heading }, { unit: selectedUnit });

    startDiv.textContent = decimalToDMS(latitude, 'lat') + ', ' + decimalToDMS(longitude, 'lon');
    endDiv.textContent = decimalToDMS(targetCoordinates.latitude, 'lat') + ', ' + decimalToDMS(targetCoordinates.longitude, 'lon');
    currentDiv.textContent = distance + ' ' + selectedUnit;
    distanceRemainingAlert.style.display = 'block';
    distanceRemainingWithUnits.textContent = distance + ' ' + selectedUnit;
    navigator.geolocation.watchPosition(locationUpdate, locationUpdateFailure, locationOptions);

    function locationUpdate(position) {
      var currentDistance = _haversine2.default.distance(position.coords, targetCoordinates, { unit: selectedUnit });
      currentDiv.textContent = currentDistance.toFixed(2) + ' ' + selectedUnit;
      distanceRemainingWithUnits.textContent = currentDistance.toFixed(0) + ' ' + selectedUnit;
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
  var minutes = fraction * 60 | 0;
  var seconds = fraction * 3600 - minutes * 60 | 0;

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
  var heading = event.alpha;
  if (typeof event.webkitCompassHeading !== 'undefined') {
    heading = event.webkitCompassHeading;
  }
  currentHeading = heading;
  // if (currentHeading) headingDiv.textContent = `${currentHeading}`;
  if (currentHeading) currentHeadingReadOnly.value = currentHeading.toFixed(2) + '\xB0';
}

window.addEventListener('deviceorientation', onHeadingChange);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function Haversine() {
  var radii = {
    km: 6371,
    miles: 3960,
    meters: 6371000,
    nmi: 3440,
    feet: 20908800,
    yards: 6969600
  };

  var toRad = function toRad(deg) {
    return deg * Math.PI / 180;
  };
  var toDeg = function toDeg(rad) {
    return rad * 180 / Math.PI;
  };

  var distance = function distance(start, end) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};


    var R = options.unit ? radii[options.unit] : radii.km;

    var dLat = toRad(end.latitude - start.latitude);
    var dLon = toRad(end.longitude - start.longitude);
    var lat1 = toRad(start.latitude);
    var lat2 = toRad(end.latitude);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };
  var targetCoordinates = function targetCoordinates(current, target) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};


    var R = options.unit ? radii[options.unit] : radii.km;

    var distance = target.distance,
        heading = target.heading;
    var latitude = current.latitude,
        longitude = current.longitude;


    var bearing = toRad(heading);

    var lat1 = toRad(latitude);
    var lon1 = toRad(longitude);

    var lat2 = Math.asin(Math.sin(lat1) * Math.cos(distance / R) + Math.cos(lat1) * Math.sin(distance / R) * Math.cos(bearing));

    var lon2 = lon1 + Math.atan2(Math.sin(bearing) * Math.sin(distance / R) * Math.cos(lat1), Math.cos(distance / R) - Math.sin(lat1) * Math.sin(lat2));

    return {
      latitude: toDeg(lat2),
      longitude: toDeg(lon2)
    };
  };
  return {
    distance: distance,
    targetCoordinates: targetCoordinates
  };
}();

/***/ })
/******/ ]);