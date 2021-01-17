
var appContainer = document.querySelector("#app")

function setPage(pageNum) {
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
}

const stationElements = document.querySelectorAll(".station");

for (let i = 0; i < stationElements.length; i++) {
    stationElements[i].addEventListener("click", function() {
        stationElements[i].classList.add('loading')
    });
}

const appElements = document.querySelectorAll(".app");

/*
for (let i = 0; i < appElements.length; i++) {
    console.log(appElements[i])
    appElements[i].addEventListener("click", function() {
       appElements[i].classList.add('loading')
    });
}
*/

setPage(1);

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
    //Todo: if latest action is set go back to it
})

//Page 3
document.querySelector('#page-3-home').addEventListener("click", function() {
    setPage(2)
})
document.querySelector('#page-3-back').addEventListener("click", function() {
    setPage(2)
})

//Page 4
document.querySelector('#page-4-home').addEventListener("click", function() {
    setPage(2)
})
document.querySelector('#page-4-back').addEventListener("click", function() {
    setPage(2)
})

//Page 5
document.querySelector('#page-5-home').addEventListener("click", function() {
    setPage(2)
})
document.querySelector('#page-5-back').addEventListener("click", function() {
    setPage(2)
})

//Spotify app
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