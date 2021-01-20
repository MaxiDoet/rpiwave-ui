var appContainer = document.querySelector("#app")

var radio = {
    currentlyPlayingSource: "",
    currentlyPlayingTitle: "",
    currentlyPlayingSubTitle: "", // In most cases this is the artist or the radio station
    currentPage: 1,
    lastPage: 1 
}

var applications = []

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
   setPage(2)
})
// Page 2
document.querySelector('#page-2-home').addEventListener("click", function() {
    setPage(1)
})
document.querySelector('#page-2-back').addEventListener("click", function() {
    setPage(radio["lastPage"])
})

//Page 3
document.querySelector('#page-3-home').addEventListener("click", function() {
    setPage(2)
})
document.querySelector('#page-3-back').addEventListener("click", function() {
    setPage(radio["lastPage"])
})

//Page 4
document.querySelector('#page-4-home').addEventListener("click", function() {
    setPage(2)
})
document.querySelector('#page-4-back').addEventListener("click", function() {
    setPage(radio["lastPage"])
})

//Page 5
document.querySelector('#page-5-home').addEventListener("click", function() {
    setPage(2)
})
document.querySelector('#page-5-back').addEventListener("click", function() {
    setPage(radio["lastPage"])
})

//Page 6
document.querySelector('#page-6-home').addEventListener("click", function() {
    setPage(2)
})
document.querySelector('#page-6-back').addEventListener("click", function() {
    setPage(radio["lastPage"])
})

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
        */

        icon.classList.remove("fa-signal-stream")
        icon.classList.remove("fa-broadcast-tower")

        switch (sourceType) {
            case 0:  
                icon.classList.add("fa-signal-stream")
            case 1:
                icon.classList.add("fa-broadcast-tower")
            case 2:
                icon.classList.add("fab")
                icon.classList.add(`${applications[applicationNum]["icon"]}`)
            case 3:
        }

        title.textContent = mediaTitle

        if (playing) {
            widgets[i].style.display = "inline-flex"
        } else {
            widgets[i].style.display = "none"
        }
    };
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
   console.log(`Debug (app): ${app}`)

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
                openInNewTab(frameUrl)
            }
        }
    })
}

/*
Old method. Now it makes a request to the python backend which then returns the track the user is currently playing
function getSpotifyTrackTitle() {
    return document.querySelectorAll('[data-testid="nowplaying-track-link"]')[0].textContent
}
*/

// Register all apps
// Spotify
setTimeout(function() {
    registerStreamingApplication("page-2-online", "spotify", "/assets/icons/apps/spotify.png", "fa-spotify", 5, true, "https://open.spotify.com")
    registerStreamingApplication("page-2-online", "ytmusic", "/assets/icons/apps/ytmusic.png", "fa-play-circle", 6, true, "https://music.youtube.com")        

    //registerStreamingApplication("page-2-local", "ytmusic", "/assets/icons/apps/ytmusic.png", "fa-play-circle", 5, true, "https://music.youtube.com")        

}, 1000)

setTimeout(function() {
    setPage(1)
}, 10000)

//Example: setCurrentlyPlaying: setCurrentlyPlaying(true, "Fear", 2, 0)