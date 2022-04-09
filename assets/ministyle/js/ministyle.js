class Accordion {
    constructor(element) {
        this.target = element;
        element.querySelectorAll(".header").forEach((e, index) => {
            e.addEventListener("click", (evt) => {
                this.toggle(e.getAttribute('data-target'));
            });
        });
    }
    toggle(targetID) {
        this.target.querySelector(`#${targetID}`).classList.toggle("active");
    }
    show(targetID) {
        this.target.querySelector(`#${targetID}`).classList.add("active");
    }
    hide(targetID) {
        this.target.querySelector(`#${targetID}`).classList.remove("active");
    }
    destroy() {
        this.target.remove();
    }
}
// register async requests
XMLHttpRequest.prototype["requests"] = 0;
XMLHttpRequest.prototype["nativeSend"] = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.send = function (body) {
    this.onreadystatechange = function (e) {
        switch (this.readyStage) {
            case XMLHttpRequest.HEADERS_RECEIVED:
                XMLHttpRequest["requests"] += 1;
                break;
            case XMLHttpRequest.DONE:
                XMLHttpRequest["requests"] -= 1;
                break;
        }
    };
};
window["getAsyncRequests"] = () => {
    return XMLHttpRequest.prototype["requests"];
};
class Carousel {
    constructor(element) {
        this.items = new Array();
        this.target = element;
        let e;
        element.querySelectorAll(".content > *").forEach((e) => {
            this.items.push(e);
        });
        this.index = 0;
        this.timeout = 5;
        this.changeIn = 5;
        this.intervalRef = setInterval(() => {
            if (this.changeIn <= 0) {
                this.changeIn = this.timeout;
                this.next();
            }
            else
                this.changeIn -= 1;
        }, 1000);
    }
    setInterval(interval) {
        this.timeout = interval;
        this.changeIn = interval;
    }
    next() {
        this.items[this.index].classList.remove('active');
        this.items[this.index].classList.add('hide');
        this.index = (this.index + 1) % this.items.length;
        this.items[this.index].classList.remove('hide');
        this.items[this.index].classList.add('active');
        this.changeIn = this.timeout;
    }
    prev() {
        this.items[this.items.length - (this.index + 1)].classList.remove('active');
        this.items[this.index].classList.add('hide');
        this.index = (this.index + 1) % this.items.length;
        this.items[this.index].classList.remove('hide');
        this.items[this.items.length - (this.index + 1)].classList.add('active');
        this.changeIn = this.timeout;
    }
}
class Collapse {
    constructor(element) {
        this.target = element;
        this.actor = document.getElementById(element.getAttribute('data-collapsed'));
        this.actor.addEventListener("click", (evt) => {
            this.toggle();
        });
    }
    toggle() {
        this.target.classList.toggle("show");
    }
    show() {
        this.target.classList.add("show");
    }
    hide() {
        this.target.classList.remove("show");
    }
    destroy() {
        this.target.remove();
    }
}
// disable anchor without reference
function invalidBlankAnchor() {
    let anchors = document.querySelectorAll("a[href=''], a[href='#']");
    let i = 0;
    for (i = 0; i < anchors.length; i += 1) {
        anchors[i].addEventListener("click", (e) => { e.preventDefault(); });
    }
}
// Modal Object
class Modal {
    constructor(element) {
        this.target = element;
        element.addEventListener("click", (e) => {
            if (e.target.className.split(' ').includes("modal")) {
                e.target.classList.remove("active");
            }
        });
    }
    show() {
        this.target.classList.add("active");
    }
    hide() {
        this.target.classList.remove("active");
    }
    destroy() {
        this.target.remove();
    }
}
// Modal Object
class Navbar {
    constructor(element) {
        this.target = element;
    }
    toggle() {
        this.target.classList.toggle("active");
    }
    show() {
        this.target.classList.add("active");
    }
    hide() {
        this.target.classList.remove("active");
    }
    destroy() {
        this.target.remove();
    }
}
let _scrollGroup;
function scrollInit() {
    _scrollGroup = [
        ["top", 0, 130],
        ["footer", window['scrollMaxY'] - 400, window['scrollMaxY']]
    ];
}
window["scrollGroup"] = () => {
    let scroll = window.scrollY;
    for (let i = 0; i < _scrollGroup.length; i += 1) {
        if (scroll >= _scrollGroup[i][1] && scroll <= _scrollGroup[i][2]) {
            return _scrollGroup[i][0];
        }
    }
    return "";
};
function scrollSync() {
    setInterval(() => {
        document.body.setAttribute("data-scroll", window["scrollGroup"]());
    }, 300);
}
class SVGIcon {
    static arrow(dest, opt = {}) {
        let svg = document.createElement('svg');
        svg.setAttribute("width", opt["width"] || "256");
        svg.setAttribute("height", opt["height"] || "256");
        let path = document.createElement("path");
        path.setAttribute("fill", opt["fill"] || "#65727e");
        path.setAttribute("p", "#M0 40 L128 216 L256 40");
        svg.appendChild(path);
        if (dest)
            dest.innerHTML = svg.outerHTML;
        return svg;
    }
    static menu(dest, opt = {}) {
        let svg = document.createElement('svg');
        svg.setAttribute("width", opt["width"] || "256");
        svg.setAttribute("height", opt["height"] || "256");
        let line1 = document.createElement("line");
        line1.setAttribute("x1", "20");
        line1.setAttribute("y1", "60");
        line1.setAttribute("x2", "236");
        line1.setAttribute("y2", "60");
        line1.setAttribute("stroke", opt["stroke"] || "#65727e");
        line1.setAttribute("stroke-width", opt["stroke-width"] || "1.8rem");
        let line2 = document.createElement("line");
        line2.setAttribute("x1", "20");
        line2.setAttribute("y1", "127");
        line2.setAttribute("x2", "236");
        line2.setAttribute("y2", "127");
        line2.setAttribute("stroke", opt["stroke"] || "#65727e");
        line2.setAttribute("stroke-width", opt["stroke-width"] || "1.8rem");
        let line3 = document.createElement("line");
        line3.setAttribute("x1", "20");
        line3.setAttribute("y1", "195");
        line3.setAttribute("x2", "236");
        line3.setAttribute("y2", "195");
        line3.setAttribute("stroke", opt["stroke"] || "#65727e");
        line3.setAttribute("stroke-width", opt["stroke-width"] || "1.8rem");
        svg.appendChild(line1);
        svg.appendChild(line2);
        svg.appendChild(line3);
        if (dest)
            dest.innerHTML = svg.outerHTML;
        return svg;
    }
    static addLoading() {
        let div = document.createElement("div");
        div.classList.add("loading");
        let svg = document.createElement("svg");
        svg.appendChild(document.createElement("circle"));
        svg.appendChild(document.createElement("circle"));
        svg.appendChild(document.createElement("circle"));
        svg.appendChild(document.createElement("circle"));
        div.appendChild(svg);
        document.body.innerHTML += (div.outerHTML);
        return div;
    }
}
