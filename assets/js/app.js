var app = new Vue({
    el: '#app',
    data: {
        playerAnimatedBackgroundEnabled: true,
        latestAvaiable: false
    }
})

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

setPage(2);

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

document.querySelector('#page-2-action-dab').addEventListener("click", function() {
    setPage(3)
})

//Page 3
document.querySelector('#page-3-home').addEventListener("click", function() {
    setPage(2)
})
document.querySelector('#page-3-back').addEventListener("click", function() {
    setPage(2)
})