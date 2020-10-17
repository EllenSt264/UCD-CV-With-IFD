/* Google Maps */
function initMap() {
    var map = new google.maps.Map(document.getElementById("map"), {
        zoom: 3,
        center: {lat: 46.619261, lng: -33.134766},
    });

    // Add markers
    var labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    // Add locations
    var locations = [
        {lat: 40.785091, lng: -73.968285},
        {lat: 41.084045, lng: -73.874245},
        {lat: 40.754932, lng: -73.984016},
    ];
    /**
     * This is a built in JS method - not to be confused with the google map
     * The map method in JS works similar to a forEach function
     * It returns an array with the results of looping through each item in our locations array
     * It can take up to three arguments
     */
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
};

/* Github Page */

function userInformationHTML(user) {    
    // The bracket before @ will allow the @ sign to appear before the user's login
    return `<h2>${user.name}
                <span class="small-name">
                (@<a href="${user.html_url}" target="_blank">${user.login}</a>
                </span>
            </h2>
            <div class="gh-content">
                <div class="gh-avatar">
                    <a href="${user.html_url}" target="_blank">
                        <img src="${user.avatar_url}" width="80" height="80" alt"${user.login}">
                    </a>
                </div>
                <p>Followers: ${user.followers} - Following: ${user.following} <br> Repos: ${user.public_repos}</p>
            </div>`;
}

function repoInformationHTML(repos) {
    // As GitHub returns this object as an array, we can use a standard array method on it, (length)
    // to see if its equal to 0
    if (repos.length === 0) {
        return `<div class="clearfix repo-list">No repos!</div>`
    }

    var listItemsHTML = repos.map(function(repo) {
        return `<li>
                    <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                </li>`;
    });

    // The map() returns an array, so we use the join() method on that array to join everything with a new line
    return `<div class="clearfix repo-list">
                <p><strong>Repo List: </strong></p>
                <ul>
                    ${listItemsHTML.join("\n")}
                </ul>
            </div>`;
}

function fetchGitHubInformation(event) {
    $("#gh-user-data").html("");
    $("#gh-repo-data").html("");

    var username = $("#gh-username").val();
    if (!username) {    // If username is empty
        $("#gh-user-data").html(`<h2>Please enter a GitHub username</h2>`);
        return;     // Until we have the GitHub API we can leave this field empty
    };
 
    $("#gh-user-data").html(`<div id="loader"><img src="assets/css/loader.gif" alt="loading.." /></div>`); 

    // JQuery Promise
    $.when(
        $.getJSON(`https://api.github.com/users/${username}`),
        $.getJSON(`https://api.github.com/users/${username}/repos`)
    ).then(
        function(firstResponse, secondResponse) {
            var userData = firstResponse;
            var repoData = secondReponse;
            $("#gh-user-data").html(userInformationHTML(userData));
            /*
            When we do two calls like this, the when() method packs a response up into arrays.
            And each one is the first element of the array.
            So we just need to put the indexes in there for these responses.
            */
           $("gh-repo-data").html(repoInformationHTML(repoData));
        },
        // We need an error function incase the JQuery promise doesn't work out
        function(errorResponse) {
            if (errorResponse.status === 404) {     // 404 not found error
                $("#gh-user-data").html(`<h2>No info found for user ${username}</h2>`)
            } 
            // GitHub has a limit restriction to how many requests you can make
            // This will give users a nicer UI when this happens
            else if (errorResponse.status === 403) {
                /*
                The date that we want to retrieve is actually stored inside our errorResponse inside the headers.
                And the particular header that we want to target is the X-RateLimit-Reset header.
                This is presented to us as a UNIX timestamp.
                So to get it into a format we can read, we need to multiply it by 1000 and then turn it into a date object.
                */    
                var resetTime = new Date(errorResponse.getResponseHeader("X-RateLimit-Reset") * 1000);
                // resetTime.toLocaleDateString() will pick up the location from your browser and print the local time.
                $("#gh-user-data").html(`<h4>Too many requests, please wait until ${resetTime.toLocaleDateString()}</h4>`)
            }
            else {
                console.log(errorResponse);
                $("#gh-user-data").html(`<h2>Error: ${errorResponse.responseJSON.message}</h2>`)
            }
        }
    )
}