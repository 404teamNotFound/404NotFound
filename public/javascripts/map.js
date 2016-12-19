		
			function myMap() {
				  var myCenter = new google.maps.LatLng(42.7339, 25.4858);
				  var mapCanvas = document.getElementById("map");
				  var mapOptions = {center: myCenter};
				  var map = new google.maps.Map(mapCanvas, mapOptions);
				  
				  var markers = [
					['Sofia, Bulgaria', 42.6977,23.3219],
					['Varna, Bulgaria', 43.2141,27.9147],
					['Plovdiv, Bulgaria', 42.1354,24.7453],
					['Veliko Turnovo, Bulgaria', 43.0757,25.6172],
					['Burgas, Bulgaria', 42.5048,27.4626]
				];
				  
				  // Info Window Content
					var infoWindowContent = [
						['<div class="info_content">' +
						'<h3>Sofia</h3>' +
						'<p>The London Eye is a giant Ferris wheel situated on the banks of the River Thames. The entire structure is 135 metres (443 ft) tall and the wheel has a diameter of 120 metres (394 ft).</p>' +        '</div>'],
						
						['<div class="info_content">' +
						'<h3>Varna</h3>' +
						'<p>The Palace of Westminster is the meeting place of the House of Commons and the House of Lords, the two houses of the Parliament of the United Kingdom. Commonly known as the Houses of Parliament after its tenants.</p>' +
						'</div>'],
						
						['<div class="info_content">' +
						'<h3>Plovdiv</h3>' +
						'<p>The Palace of Westminster is the meeting place of the House of Commons and the House of Lords, the two houses of the Parliament of the United Kingdom. Commonly known as the Houses of Parliament after its tenants.</p>' +
						'</div>'],
						
						['<div class="info_content">' +
						'<h3>Veliko Turnovo</h3>' +
						'<p>The Palace of Westminster is the meeting place of the House of Commons and the House of Lords, the two houses of the Parliament of the United Kingdom. Commonly known as the Houses of Parliament after its tenants.</p>' +
						'</div>'],
						
						['<div class="info_content">' +
						'<h3>Burgas</h3>' +
						'<p>The Palace of Westminster is the meeting place of the House of Commons and the House of Lords, the two houses of the Parliament of the United Kingdom. Commonly known as the Houses of Parliament after its tenants.</p>' +
						'</div>']
					];
				  
				  var bounds = new google.maps.LatLngBounds();
				  
				  // Display multiple markers on a map
				var infoWindow = new google.maps.InfoWindow(), marker, i;
				
				// Loop through our array of markers & place each one on the map  
				for( i = 0; i < markers.length; i++ ) {
					var position = new google.maps.LatLng(markers[i][1], markers[i][2]);
					bounds.extend(position);
					marker = new google.maps.Marker({
						position: position,
						map: map,
						title: markers[i][0]
					});
					
						// Allow each marker to have an info window    
						google.maps.event.addListener(marker, 'click', (function(marker, i) {
							return function() {
								infoWindow.setContent(infoWindowContent[i][0]);
								infoWindow.open(map, marker);
							}
						})(marker, i));

						// Automatically center the map fitting all markers on the screen
						map.fitBounds(bounds);
				}
			}
			
			
			var c = document.getElementById("myCanvas");
			var ctx = c.getContext("2d");
			ctx.moveTo(0,0);
			ctx.lineTo(0,100);
			ctx.stroke();
			