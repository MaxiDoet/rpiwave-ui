var app = new Vue({
    el: '#app',
    data: {
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

setPage(2);