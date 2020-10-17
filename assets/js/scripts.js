function initMap() {
            var map = new google.maps.Map(document.getElementById("map"), {
                zoom: 3,
                center: {lat: 46.619261, lng: -33.134766},
            });

            // Add some marker locations
            var labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

            var locations = [
                {lat: 40.785091, lng: -73.968285},
                {lat: 41.084045, lng: -73.874245},
                {lat: 40.754932, lng: -73.984016},
            ];

            // This is a built in JS method - not to be confused with the google map
            // The map method in JS works similar to a forEach function
            // It returns an array with the results of looping through each item in our locations array.
            // It can take up to three arguments
            
            var markers = locations.map(function(location, i) {     // location is the current value of where we are in the array as we're looping through    
                return new google.maps.Marker({
                    position: location,
                    label: labels[i % labels.length]
                    // We do this to get one of our labels out of the string that we've created
                    // The reason for using the % operator is so that if we have more than 26 locations, 
                    // then it will loop around to the start of our string again and go from Z back to A, instead of throwing an error.
                });
            });

            var markerCluster = new MarkerClusterer(map, markers, {
                imagePath:"https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m"
            });
        }