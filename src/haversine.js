module.exports = (function Haversine() {
  const radii = {
    km: 6371,
    miles: 3960,
    meters: 6371000,
    nmi: 3440,
    feet: 20908800,
    yards: 6969600
  };

  const toRad = (deg) => (deg * Math.PI) / 180;
  const toDeg = (rad) => (rad * 180) / Math.PI;

  const distance = (start, end, options = {}) => {

    const R = options.unit ? radii[options.unit] : radii.km;

    const dLat = toRad(end.latitude - start.latitude);
    const dLon = toRad(end.longitude - start.longitude);
    const lat1 = toRad(start.latitude);
    const lat2 = toRad(end.latitude);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) *
      Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }
  const targetCoordinates = (current, target, options = {}) => {

    const R = options.unit ? radii[options.unit] : radii.km;

    const { distance, heading } = target;
    const { latitude, longitude } = current;

    const bearing = toRad(heading);

    const lat1 = toRad(latitude);
    const lon1 = toRad(longitude);

    const lat2 = Math.asin(Math.sin(lat1) * Math.cos(distance / R) +
      Math.cos(lat1) * Math.sin(distance / R) * Math.cos(bearing));

    const lon2 = lon1 + Math.atan2(Math.sin(bearing) * Math.sin(distance / R) *
      Math.cos(lat1), Math.cos(distance / R) - Math.sin(lat1) * Math.sin(lat2));

    return {
      latitude: toDeg(lat2),
      longitude: toDeg(lon2)
    }
  }
  return {
    distance,
    targetCoordinates
  }
})();
