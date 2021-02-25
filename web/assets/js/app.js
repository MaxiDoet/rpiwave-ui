var appContainer = document.querySelector("#app")

var radio = {
    settings: {},
    currentlyPlayingStationId: "",
    currentlyPlayingStationName: "",
    currentlyPlayingStationType: "",
    currentlyPlayingSource: "",
    currentlyPlayingTitle: "",
    currentlyPlayingSubTitle: "", // In most cases this is the artist or the radio station
    currentPage: 1,
    lastPage: 2,
    sleepTimerId: 0,
    dimTimeoutId: 0,
    backgroundChangeIntervalId: 0
}

var applications = []
var webStations = {}
var podcasts = {}
var dabPlusStations = {}

function setPage(pageNum) {
    radio["lastPage"] = radio["currentPage"]
    radio["currentPage"] = pageNum

    tmp = anime({
        targets: `#page-${pageNum}`,
        opacity: [0, 1],
        duration: 500,
        easing: 'easeInOutSine',
        elasticity: 600,
        delay: (el, i) => 45 * (i+1)
    });

    setTimeout(function() {
        var c = appContainer.children;
    var i;
    
    for (i = 0; i < c.length; i++) {
        if (c[i] != null && c[i].classList.contains("page")) {
            c[i].classList.remove("active");
        }        
    }

    if (c[pageNum]) {
        c[pageNum].classList.add("active");
    }
    }, 100)

    if (pageNum == 1) {
        // Remove old timeout
        clearTimeout(radio["dimTimeoutId"])
        // Register dim timeout
        radio["dimTimeoutId"] = setTimeout(function() {
            var request = new XMLHttpRequest()
            request.open("GET", `/api/dim_down`)
            request.send()  
        }, 10000)
    }

}

function openInNewTab(url) {
  var win = window.open(url, '_blank');
  win.focus();
}

const stationElements = document.querySelectorAll(".station");

for (let i = 0; i < stationElements.length; i++) {
    stationElements[i].addEventListener("click", function() {
        stationElements[i].classList.add('loading')
    });
}

function setCurrentlyPlaying(playing, mediaTitle, sourceType, applicationNum) {
    widgets = document.querySelectorAll(`.mediawidget`)


    console.log(`Updating mediaWidgets`)
    console.log(` Title: ${mediaTitle}`)
    console.log(` Sourcetype: ${sourceType}`)

    for (let i = 0; i < widgets.length; i++) {
        title = widgets[i].querySelector('.mediawidget-title')
        icon = widgets[i].querySelector('.mediawidget-icon') 

        /* 
        Source types:
            - 0 Web stream
            - 1 Radio
            - 2 Online service eg. Spotify, ...
            - 3 UPNP
            - 4 Podcast
        */

        icon.classList.remove("fa-signal-stream")
        icon.classList.remove("fa-broadcast-tower")

        switch (sourceType) {
            case 0:  
                icon.classList.add("fa-signal-stream")
                break;
            case 1:
                icon.classList.add("fa-broadcast-tower")
                break;
            case 2:
                icon.classList.add("fab")
                icon.classList.add(`${applications[applicationNum]["icon"]}`)
                break;
            case 3:
                break;
            case 4:
                icon.classList.add("fal")
                icon.classList.add("fa-microphone-alt")
        }

        title.textContent = mediaTitle

        if (playing) {
            widgets[i].style.display = "inline-flex"
        } else {
            widgets[i].style.display = "none"
        }
    };
}

function registerStation(scrollContainerId, data, type) {
   var scrollContainer = document.querySelector(`#${scrollContainerId}`)

   var station = document.createElement('div')
   station.setAttribute('class', 'station')
   station.setAttribute('id', `station-${data["id"]}`)

   var stationBanner = document.createElement('img')
   stationBanner.setAttribute('class', 'station-banner')
   stationBanner.src = data["banner"]

   var stationLoader = document.createElement('div')
   stationLoader.setAttribute('class', 'station-loader')
   stationLoaderSpan = document.createElement('span')
   stationLoader.appendChild(stationLoaderSpan)

   station.appendChild(stationBanner)
   station.appendChild(stationLoader)

   station.dataset.stationId = data["id"]

   scrollContainer.appendChild(station)
   console.log(`Debug (station): ${station}`)

   switch (type) {
       case 0:

           station.addEventListener('click', function() {
                playWebStation(data)
            })
           break
       case 1:
           dabPlusStations[data["id"]] = {'name': data["name"], 'bannerPath': data["bannerPath"]}

           station.addEventListener('click', function() {
                stationId = station.dataset.stationId

                playStation(stationId, data)
            })
            break
       }
}

function registerPodcast(scrollContainerId, data) {
    var scrollContainer = document.querySelector(`#${scrollContainerId}`)
 
    var podcast = document.createElement('div')
    podcast.setAttribute('class', 'podcast')
    podcast.setAttribute('id', `podcast-${data["id"]}`)
    podcast.setAttribute("data-id", data["id"])
 
    var podcastBanner = document.createElement('img')
    podcastBanner.setAttribute('class', 'podcast-banner')
    podcastBanner.src = data["logo"]
 
    podcast.appendChild(podcastBanner)
  
    scrollContainer.appendChild(podcast)
    console.log(`Debug (podcast): ${podcast}`)
    
    var request = new XMLHttpRequest()
    request.addEventListener("load", function() {
        podcasts[data["id"], JSON.parse(request.responseText)]
    })

    request.open("GET", `/api/get_podcast_data_by_id?id=${data["id"]}`)
    request.send()

    podcast.addEventListener("click", function() {
        // Remove all old episodes
        var elements = document.querySelectorAll("#page-7-podcast-episodes *")
        for (let i = 0; i < elements.length; i++) {
            elements[i].remove()
        }

        for (let i = 0; i < data["episodes"].length; i++) {
            registerEpisode("page-7-podcast-episodes", data, data["episodes"][i])
        }

        var elements = document.querySelector("#page-7").querySelectorAll(".page-7-podcast-episodes-entry")
        for (let i = 0; i < elements.length; i++) {
            elements[i].addEventListener("click", function() {
                playEpisode(data, i)
            })    
        }
        
        document.querySelector("#page-7").querySelectorAll("#page-7-podcast-cover")[0].src = data["logo"]
        setPage(7)
    })
 }
 
function registerStreamingApplication(scrollContainerId, id, bannerPath, icon, appPage, webFrame, frameUrl) {
    var scrollContainer = document.querySelector(`#${scrollContainerId}`)
    var appElement = document.querySelector(`#page-${appPage}`).querySelector('.main')

    /* Reference
    <div class="app" id="app-spotify">
        <img class="app-banner" src="/assets/icons/apps/spotify.png"></img>   
        <div class="app-loader">
            <span></span>
        </div>               
    </div>  
    */

   var app = document.createElement('div')
   app.setAttribute('class', 'app')
   app.setAttribute('id', `app-${id}`)

   var appBanner = document.createElement('img')
   appBanner.setAttribute('class', 'app-banner')
   appBanner.src = bannerPath

   var appLoader = document.createElement('div')
   appLoader.setAttribute('class', 'app-loader')
   appLoaderSpan = document.createElement('span')
   appLoader.appendChild(appLoaderSpan)

   app.appendChild(appBanner)
   app.appendChild(appLoader)

   scrollContainer.appendChild(app)

   applications.push({id: `${id}`, page: `${appPage}`, webFrame: `${webFrame}`, frameUrl: `${frameUrl}`, icon: `${icon}`})

    if (webFrame) {
        var appFrame = appElement.querySelector(`#page-${appPage}-frame`)
        
        appFrame.addEventListener('load', function() {
            app.classList.remove("loading")    
            app.classList.add("loaded")    
            setPage(appPage)
        })
    }

    app.addEventListener('click', function() {
        if (app.classList.contains('loaded')) {
            setPage(appPage)
        } else {
            app.classList.add('loading')

            if (webFrame) {
                appFrame.src = frameUrl
                setPage(appPage)
            }
        }
    })
}

function registerEpisode(episodeContainer, podcastData, episodeData) {
    container = document.getElementById(episodeContainer)

    /* Reference
    <div class="page-7-podcast-episodes-entry"><p class="page-7-podcast-episodes-entry-number">72</p><p class="page-7-podcast-episodes-entry-title">Test Episode</p></div>
    */

    var episode = document.createElement('div')
    episode.setAttribute("id", `episode-${episodeData["number"]}`)
    episode.setAttribute("class", "page-7-podcast-episodes-entry")

    var episodeNumber = document.createElement('p')
    episodeNumber.setAttribute("class", "page-7-podcast-episodes-entry-number")
    episodeNumber.textContent = episodeData["number"]

    var episodeTitle = document.createElement('p')
    episodeTitle.setAttribute("class", "page-7-podcast-episodes-entry-title")
    episodeTitle.textContent = episodeData["title"]

    episode.appendChild(episodeNumber)
    episode.appendChild(episodeTitle)

    container.appendChild(episode)
}

function getPodcastDataById(id) {
    //setCurrentlyPlaying(false)
    var request = new XMLHttpRequest()
    request.addEventListener("load", function() {
        return JSON.parse(request.responseText)
    })

    request.open("GET", `/api/get_podcast_data_by_id?id=${id}`)
    request.send()
}

function playEpisode(podcastData, number) {
    console.log(`Playing number ${number}`)
    console.log(podcastData)    

    /*
    playStream(podcastData["episodes"][number]["stream"])
    */
    podcastPlayer.setSource(podcastData["episodes"][number]["stream"]);
    podcastPlayer.play();

    setCurrentlyPlaying(true, podcastData["episodes"][number]["title"], 4)

    document.querySelector("#page-8").querySelectorAll(".podcast-player-cover")[0].src = podcastData["logo"]
    document.querySelector("#page-8").querySelectorAll(".podcast-player-title")[0].textContent = podcastData["name"]
    document.querySelector("#page-8").querySelectorAll(".podcast-player-subtitle")[0].textContent = podcastData["episodes"][number]["title"]

    setPage(8)
}

function playWebStation(data) {
    setPage(4)
    document.querySelector("#page-4").querySelectorAll('.navbar-title')[0].textContent = data["name"]
    document.querySelector("#page-4").querySelectorAll('.radio-player-station')[0].textContent = data["name"]
    document.querySelector("#page-4").querySelectorAll('.radio-player-cover')[0].src = data["icon"]
    
    
    switch (radio["settings"]["streamingQuality"]) {
        case "low": 
            if (data["streamLow"] != "") {
                playStream(data["streamLow"])
            }
            break;
        case "mid":
            if (data["streamMid"] != "") {
                playStream(data["streamMid"])
            }
            break;
        case "high":
            if (data["streamHigh"] != "") {
                playStream(data["streamHigh"])
            } else {
                playStream(data["streamMid"])
            }
            break;
    }

    setCurrentlyPlaying(true, data["name"], 0)
}

function stopPlayback() {
    //setCurrentlyPlaying(false)
    var request = new XMLHttpRequest()
    request.addEventListener("load", function() {
        // Do nothing
    })

    request.open("GET", `/api/stop_playback`)
    request.send()
}

function playStream(url) {
    if (radio["currentlyPlayingSource"] == 0) {
        stopPlayback()
    }

    var request = new XMLHttpRequest()
    request.addEventListener("load", function() {
        radio["currentlyPlayingSource"]=0
    })

    request.open("GET", `/api/play_stream?url=${url}`)
    request.send()
}

function playAudio(path) {
    var audio = new Audio(path);
    audio.play();
}

function loadWebStations() {
    var request = new XMLHttpRequest()
    request.addEventListener("load", function() {
        webStations = JSON.parse(request.responseText)["stations"]
        console.log(`Loaded ${webStations.length} web station(s)`)

        for (let i = 0; i < webStations.length; i++) {
            registerStation("page-2-webstations", webStations[i], 0)
            console.log("Registered station")
        }
    })

    /* Doesn't work :-(
    request.addEventListener("error", function() {
        // Display an 'error' station
        errorData = {name: "Error", id: "error", streamMid: "", banner: "/assets/banners/error_station.png"}
        registerStation('page-2-webstations', errorData, 0)
    })
    */
    request.open("GET", "/api/get_station_list")
    request.send()
}

function loadRandomPodcasts(count) {
    var request = new XMLHttpRequest()
    request.addEventListener("load", function() {
        var podcastData = JSON.parse(request.responseText)
        console.log(`Loaded ${podcastData.length} podcast(s)`)

        for (let i = 0; i < podcastData.length; i++) {
            registerPodcast("page-2-podcasts", podcastData[i])
            console.log("Registered podcast")
        }
    })

    /* Doesn't work :-(
    request.addEventListener("error", function() {
        // Display an 'error' station
        errorData = {name: "Error", id: "error", streamMid: "", banner: "/assets/banners/error_station.png"}
        registerStation('page-2-webstations', errorData, 0)
    })
    */
    request.open("GET", `/api/get_random_podcasts?count=${count}`)
    request.send()
}

function updateSettingsValue(property, value) {
    var request = new XMLHttpRequest()
    request.addEventListener("load", function() {
        console.log(`Updated '${property}'\`s value to ${value}`)
    })
    
    request.open("GET", `/api/update_config_value?property=${property}&value=${value}`)
    request.send()
}

function loadSettings() {
    var request = new XMLHttpRequest()
    request.addEventListener("load", function() {
        radio["settings"] = JSON.parse(request.responseText)

        var settingCheckboxes = document.querySelector("#page-3-settings").querySelectorAll("input[type=checkbox]") 
        var settingSelects = document.querySelector("#page-3-settings").querySelectorAll("select")
        document.temp = settingSelects

        for (let i=0; i < settingCheckboxes.length; i++) {
            try {
                settingCheckboxes[i].checked = (radio["settings"][settingCheckboxes[i].dataset.property] == "true") 
            } catch {
                continue;
            }
        }

        for (let i=0; i < settingSelects.length; i++) {
            try {
                settingSelects[i].value = radio["settings"][settingSelects[i].dataset.property] 
            } catch {
                continue;
            }
        }

        for (let i=0; i < settingCheckboxes.length; i++) {
            settingCheckboxes[i].addEventListener("change", function() {
                updateSettingsValue(settingCheckboxes[i].dataset.property, settingCheckboxes[i].checked)
            })
        }

        for (let i=0; i < settingSelects.length; i++) {
            settingSelects[i].addEventListener("change", function() {
                updateSettingsValue(settingSelects[i].dataset.property, settingSelects[i].selectedOptions[0].value)
            })
        }
    })
    
    request.open("GET", `/api/get_config`)
    request.send()
}

/*
const appElements = document.querySelectorAll(".app");

for (let i = 0; i < appElements.length; i++) {
    console.log(appElements[i])
    appElements[i].addEventListener("click", function() {
       appElements[i].classList.add('loading')
    });
}
*/

setPage(0);

// Register all eventhandlers
// Page 0 No eventhandlers
// Page 1
document.querySelector('#page-1').addEventListener("click", function() {
    // Dim up
    var request = new XMLHttpRequest()
    request.open("GET", `/api/dim_normal`)
    request.send()  
   setPage(2)
})

// Remove old interval
clearInterval(radio["backgroundChangeIntervalId"])

radio["backgroundChangeIntervalId"] = setInterval(function() {
    document.querySelector("#page-1-background").src = "https://source.unsplash.com/collection/27710177/800x480"
}, radio["settings"]["backgroundChangeInterval"] || 300000)

// Page 2
document.querySelector('#page-2-home').addEventListener("click", function() {
    setPage(1)
})
document.querySelector('#page-2-back').addEventListener("click", function() {
    setPage(radio["lastPage"])
})

document.querySelector('#page-2-settings').addEventListener("click", function() {
    setPage(3)
})

document.querySelector('#page-2-sleep').addEventListener("click", function() {
    setPage(9)
})

//Page 3
document.querySelector('#page-3-home').addEventListener("click", function() {
    setPage(2)
})
document.querySelector('#page-3-back').addEventListener("click", function() {
    setPage(radio["lastPage"])
})

loadSettings()

//Page 4
document.querySelector('#page-4-home').addEventListener("click", function() {
    stopPlayback()
    setCurrentlyPlaying(false, "", 0, 0)
    setPage(2)
})
document.querySelector('#page-4-back').addEventListener("click", function() {
    stopPlayback()
    setCurrentlyPlaying(false, "", 0, 0)
    setPage(radio["lastPage"])
})

//Page 7
document.querySelector('#page-7-home').addEventListener("click", function() {
    setPage(2)
})
document.querySelector('#page-7-back').addEventListener("click", function() {
    setPage(radio["lastPage"])
})

//Page 8
document.querySelector('#page-8-home').addEventListener("click", function() {
    podcastPlayer.pause()
    //stopPlayback()
    setCurrentlyPlaying(false, "", 0, 0)
    setPage(2)
})
document.querySelector('#page-8-back').addEventListener("click", function() {
    podcastPlayer.pause()
    //stopPlayback()
    setCurrentlyPlaying(false, "", 0, 0)
    setPage(radio["lastPage"])
})

//Page 9
document.querySelector('#page-9-home').addEventListener("click", function() {
    setPage(2)
})
document.querySelector('#page-9-back').addEventListener("click", function() {
    setPage(radio["lastPage"])
})

document.querySelector("#toggle_sleeptimer_active").addEventListener("change", function(event) {
    // Remove old timer
    clearTimeout(radio["sleepTimerId"])
    // Add new timer

    if (event.currentTarget.checked) {
        var sleepTimeMinutes = document.querySelector("#sleepTimeSwiper").dataset.value
        setTimeout(function() {
            // Perform shutdown
            var request = new XMLHttpRequest()
            request.open("GET", `/api/shutdown`)
            request.send()  
        }, sleepTimeMinutes * 60000)
    }
})

/* Register all back buttons in webframes*/
const backOverlayButtons = document.querySelectorAll(".back-overlay");

for (let i = 0; i < backOverlayButtons.length; i++) {
    backOverlayButtons[i].addEventListener("click", function() {
       setPage(2)
    });
}

/*Old spotify app 
document.querySelector('#app-spotify').addEventListener("click", function() {
    webFrame = document.querySelector('#page-5-frame')
    webFrame.addEventListener("load", function() {
        try {
            document.querySelectorAll('#onetrust-banner-sdk')[0].remove()
        } catch {
            
        }

        setPage(5)
        document.querySelector('#app-spotify').classList.remove("loading")    
        document.querySelector('#app-spotify').classList.add("loaded")    
    }) 

    if (document.querySelector('#app-spotify').classList.contains("loaded")) {
        setPage(5)
    }

    if (!document.querySelector('#app-spotify').classList.contains("loaded")) {
        document.querySelector('#app-spotify').classList.add('loading')
    }

    webFrame.src="https://open.spotify.com/"
})
*/

/*
Old iframe loader works on powerful devices but not on a raspberry pi 3!

const webFrames = document.querySelectorAll(".webframe");
var webFramesLeft = webFrames.length

for (let i = 0; i < webFrames.length; i++) {
    webFrames[i].addEventListener("load", function() {
       webFramesLeft--;
       if (webFramesLeft <= 0) {
            setPage(1)           
       }
    });
}
*/

/*
Old method. Now it makes a request to the python backend which then returns the track the user is currently playing
function getSpotifyTrackTitle() {
    return document.querySelectorAll('[data-testid="nowplaying-track-link"]')[0].textContent
}
*/

// Register all apps
// Spotify
setTimeout(function() {
    registerStreamingApplication("page-2-apps", "spotify", "/assets/icons/apps/spotify.png", "fa-spotify", 5, true, "https://open.spotify.com")
    registerStreamingApplication("page-2-apps", "ytmusic", "/assets/icons/apps/ytmusic.png", "fa-play-circle", 6, true, "https://music.youtube.com")        
}, 1000)

setTimeout(function() {
    var sound = new Howl({
        src: ['/assets/sounds/dab_soundlogo.wav']
      });
      
    //sound.play();

    loadWebStations()
    loadRandomPodcasts(5)
}, 100)

setTimeout(function() {
    setPage(1)
}, 10000)

/* Update every time text */
setInterval(function() {
    var timeTexts = document.querySelectorAll('.time')

    let now = new Date();  
    let options = {  
        hour: "2-digit", minute: "2-digit", hour12: false  
    };  


    for (let i = 0; i < timeTexts.length; i++) {
        timeTexts[i].textContent = now.toLocaleTimeString("en-us", options)
    }    
}, 10)

setInterval(function() {
    var dateTexts = document.querySelectorAll('.date')

    var today = new Date();
    var mm = today.getMonth() + 1;
    var dd = today.getDate();
    var yyyy = today.getFullYear();
    var format = dd + '/' + mm + '/' + yyyy

    for (let i = 0; i < dateTexts.length; i++) {
        dateTexts[i].textContent = format
    }    
}, 10)

//Example: setCurrentlyPlaying: setCurrentlyPlaying(true, "Fear", 2, 0)

let podcastPlayer = new AudioPlayer("podcastPlayer");
var sleepTimerSwiper = new NumberSwiper('sleepTimeSwiper');
