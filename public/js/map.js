var map = L.map('map').setView(
  [listingCoords.geometry.coordinates[1], listingCoords.geometry.coordinates[0]],
  13
);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

// Create marker manually from coordinates
var marker = L.marker([
  listingCoords.geometry.coordinates[1], // latitude
  listingCoords.geometry.coordinates[0]  // longitude
]).addTo(map);

// Bind custom popup message
marker.bindPopup(`
  <div style="font-size:12px;">
    <b>${listingCoords.location}</b><br>
    <P>Exact location will be provided after booking.</P>
  </div>
`);

// Show popup on hover
marker.on('mouseover', function () {
  this.openPopup();
});
marker.on('mouseout', function () {
  this.closePopup();
});
