var app = new Vue({
    el: '#app',
    data: {
        playerAnimatedBackgroundEnabled: true
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


setPage(4);