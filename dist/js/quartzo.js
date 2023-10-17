class Meta {
    constructor() {
        this._properts = {
            anchor: false,
            qselect: false,
            qcarousel: false,
        };
        this.metaTags = document.querySelectorAll("meta[name=setting]");
        for (let i = 0; i < this.metaTags.length; i += 1) {
            let metaTag = this.metaTags[i];
            let content = metaTag.getAttribute("content");
            if (Object.keys(this._properts).includes(content.toLowerCase())) {
                this.setProperty(content.toLowerCase());
            }
        }
        this.apply();
    }
    setProperty(name) {
        if (Object.keys(this._properts).includes(name.toLowerCase())) {
            this._properts[name.toLowerCase()] = true;
        }
    }
    removeProperty(name) {
        if (Object.keys(this._properts).includes(name.toLowerCase())) {
            this._properts[name.toLowerCase()] = false;
        }
    }
    apply(parent = document) {
        let elements = parent.querySelectorAll("select, .carousel, a");
        for (let i = 0; i < elements.length; i += 1) {
            this.applyTo(elements[i]);
        }
    }
    applyTo(element) {
        if (this._properts["qselect"] && element.tagName.toLowerCase() == "select") {
            new QSelect(element);
        }
        else if (this._properts["qcarousel"] && element.classList.contains("carousel")) {
            new QCarousel(element);
        }
        else if (this._properts["anchor"] && element.tagName.toLowerCase() == "a") {
            element["initialize"]();
        }
    }
}
var meta;
window.addEventListener("load", (e) => {
    meta = new Meta();
});
class QCarousel {
    constructor(element) {
        this.timeout = 5;
        this.intervalReference = 0;
        this.target = element;
        QCarousel.items.push(element);
        this.itemList = element.querySelectorAll(".items > *");
        this.index = 0;
        if (element.querySelectorAll(".items > [show]").length > 0) {
            this.itemList[0].setAttribute("show", "");
        }
        this.resetTimeout();
        this.start();
        this.addButtonEvents();
    }
    next() {
        this.itemList[this.index].removeAttribute('show');
        this.index = (this.index + 1) % this.itemList.length;
        this.itemList[this.index].setAttribute('show', '');
        this.resetTimeout();
    }
    prev() {
        this.itemList[this.index].removeAttribute('show');
        this.index = (this.index - 1);
        if (this.index < 0)
            this.index = this.itemList.length - 1;
        this.itemList[this.index].setAttribute('show', '');
        this.resetTimeout();
    }
    resetTimeout() {
        this.currentTimeout = this.timeout;
    }
    start() {
        this.stop();
        this.resetTimeout();
        this.intervalReference = setInterval(() => {
            if (this.timeout == 0)
                return false;
            if (this.currentTimeout == 0)
                this.next();
            this.currentTimeout--;
        }, 1000);
    }
    stop() {
        if (this.intervalReference == 0)
            return false;
        clearInterval(this.intervalReference);
        this.intervalReference = 0;
    }
    upadte() {
        this.itemList = this.target.querySelectorAll(".items > *");
        this.resetTimeout();
    }
    addButtonEvents() {
        let buttonPreview = this.target.querySelector('[carousel-action="preview"]');
        let buttonNext = this.target.querySelector('[carousel-action="next"]');
        if (buttonPreview)
            buttonPreview.addEventListener("click", (evt) => { this.prev(); });
        if (buttonNext)
            buttonNext.addEventListener("click", (evt) => { this.next(); });
    }
}
QCarousel.items = new Array();
class QSelect {
    constructor(select) {
        this.target = document.createElement("details");
        this.valueItems = new Array();
        this.labelItems = new Array();
        if (select.tagName.toUpperCase() != "SELECT") {
            throw `"${select.tagName}" is a invalid object!`;
        }
        this.buildQselect(select);
        this.applyEvents();
        QSelect["SelectCount"] += 1;
        QSelect.items.push(this.target);
    }
    buildQselect(select) {
        let summaryTag = document.createElement("summary");
        let contentTag = document.createElement("div");
        this.target.appendChild(summaryTag);
        this.target.appendChild(contentTag);
        this.target.className = "dropdown dropdown-select";
        contentTag.className = "content";
        if (select.getAttribute("name") == "") {
            select.setAttribute("name", `qselect-${QSelect["SelectCount"]}`);
        }
        if (select.getAttribute("id") == "") {
            select.setAttribute("id", `qselect-${QSelect["SelectCount"]}`);
        }
        let repeats = select.childElementCount;
        for (let x = 0; x < repeats; x += 1) {
            let summaryInputTag = document.createElement("input");
            let contentInputTag = document.createElement("input");
            let contentLabelTag = document.createElement("label");
            summaryInputTag.setAttribute("id", `${select.getAttribute("id")}-${x}`);
            summaryInputTag.setAttribute("label", `${select.children[x].innerHTML}`);
            summaryInputTag.setAttribute("data-index", `${x}`);
            if (select.children[x].getAttribute("value")) {
                summaryInputTag.setAttribute("value", `${select.children[x].getAttribute("value")}`);
            }
            contentInputTag.setAttribute("name", `${select.getAttribute("name")}-label`);
            contentLabelTag.setAttribute("for", `${select.getAttribute("id")}-${x}`);
            contentLabelTag.innerHTML = select.children[x].innerHTML;
            if (select.children[x].hasAttribute("checked")) {
                summaryInputTag.setAttribute("checked", `true`);
                contentInputTag.setAttribute("checked", `true`);
            }
            if (select.hasAttribute("multiple")) {
                summaryInputTag.setAttribute("name", `${select.getAttribute("name")}[]`);
                summaryInputTag.setAttribute("type", `checkbox`);
                contentInputTag.setAttribute("type", `checkbox`);
            }
            else {
                summaryInputTag.setAttribute("name", `${select.getAttribute("name")}`);
                summaryInputTag.setAttribute("type", `radio`);
                contentInputTag.setAttribute("type", `radio`);
            }
            if (select.hasAttribute("required")) {
                summaryInputTag.setAttribute("required", "required");
            }
            this.valueItems.push(summaryInputTag);
            this.labelItems.push(contentInputTag);
            summaryTag.appendChild(summaryInputTag);
            contentTag.appendChild(contentInputTag);
            contentTag.appendChild(contentLabelTag);
        }
        select.replaceWith(this.target);
    }
    applyEvents() {
        let repeats = this.valueItems.length;
        for (let x = 0; x < repeats; x += 1) {
            let e = this.valueItems[x];
            e.addEventListener("change", () => {
                var _a;
                let index = parseInt(`${e.getAttribute("data-index")}`);
                this.labelItems[index].checked = !((_a = this.labelItems[index]) === null || _a === void 0 ? void 0 : _a.checked);
            });
        }
    }
}
QSelect.items = new Array();
QSelect["SelectCount"] = 0;
Element["fromJson"] = (json) => {
    if (typeof json == "string") {
        json = JSON.parse(json);
    }
    let buildTree = (object) => {
        let element;
        element = document.createElement(object["tag"]);
        let keys = Object.keys(object);
        for (let i = 0; i < keys.length; i += 1) {
            let key = keys[i].toLowerCase();
            if (key == "tag")
                continue;
            else if (key == "childrens") {
                for (let j = 0; j < object[keys[i]].length; j += 1) {
                    if (typeof object[keys[i]][j] == "string") {
                        element.append(object[keys[i]][j]);
                    }
                    else {
                        let child = buildTree(object[keys[i]][j]);
                        element.append(child);
                    }
                }
            }
            else {
                if (key.toLowerCase() == "classname")
                    key = "class";
                element.setAttribute(key, object[keys[i]]);
            }
        }
        return element;
    };
    if (json["element"] == undefined)
        return null;
    return buildTree(json["element"]);
};
Element.prototype["oldAppend"] = Element.prototype.append;
Element.prototype.append = function (node, eventJson = []) {
    this["oldAppend"](node);
    if (eventJson) {
        for (let i = 0; i < eventJson.length; i += 1) {
            let eventDescription = eventJson[i];
            if (!eventDescription["ref"]) {
                eval(eventDescription["callback"])();
            }
            else if (eventDescription["ref"][0] == "#") {
                let element = this.querySelector(eventDescription["ref"]);
                element.addEventListener(eventDescription["event"], (ev) => { (eval(eventDescription["callback"]))(ev); });
            }
            else {
                let elements = this.querySelectorAll(eventDescription["ref"]);
                for (let j = 0; j < elements.length; j += 1) {
                    elements[j].addEventListener(eventDescription["event"], (ev) => { (eval(eventDescription["callback"]))(ev); });
                }
            }
        }
    }
    meta.apply(this);
};
Element.prototype["appendFromJson"] = function (json) {
    if (typeof json == "string") {
        json = JSON.parse(json);
    }
    this.append(Element["fromJson"](json), json["events"]);
    return true;
};
// let elementJson = {
//   element: {
//     tagName: "button",
//     className: "button button-outline button-warning",
//     id: "json-button",
//     childrens: [
//       {
//         tagName: "span",
//         childrens: "Text"
//       }
//     ]
//   },
//   events:[
//     {
//       ref: "#json-button",
//       event: "click",
//       callback: "(evt) => {alert('OK')}"
//     }
//   ]
// }
const REQUEST_DEFAULT_PARAMS = { method: "get" };
const REQUEST_DEFAULT_CALLBACK = (response) => {
    if (response["type"].toLowerCase() == "render") {
        if (response["target"]) {
            let elements = document.querySelectorAll(response["target"]);
            for (let i = 0; i < elements.length; i += 1) {
                switch (response["renderType"]) {
                    case "append":
                        elements[i]["appendFromJson"](response);
                        break;
                    case "replace-block":
                        let newElement = Element["fromJson"](response);
                        elements[i].replaceWith(newElement);
                        break;
                    default:
                        elements[i].innerHTML = "";
                        elements[i]["appendFromJson"](response);
                        break;
                }
            }
        }
        else {
            throw new Error(`Render not have target element.`);
        }
    }
    else if (response["type"].toLowerCase() == "script") {
        eval(response["javascript"]);
    }
    else {
        throw new Error(`Invalid type "${response["type"]}", use "render" or "script"!`);
    }
};
const REQUEST_DEFAULT_ERROR = (error) => {
    console.log(error);
};
Request["requestPendings"] = 0;
Request["__pushStack__"] = () => {
    Request["requestPendings"]++;
    document.body.setAttribute("data-pendingRequest", `${(Request["requestPendings"] != 0)}`);
    let elements = document.querySelectorAll(".navbar-content");
    for (let i = 0; i < elements.length; i += 1) {
        elements[i].removeAttribute("open");
    }
};
Request["__popStack__"] = () => {
    Request["requestPendings"]--;
    document.body.setAttribute("data-pendingRequest", `${(Request["requestPendings"] != 0)}`);
};
Request["fetch"] = (url, params = REQUEST_DEFAULT_PARAMS, callback = REQUEST_DEFAULT_CALLBACK) => {
    if ((typeof params["body"]).toLowerCase() == "object")
        params["body"] = JSON.stringify(params["body"]);
    let request = new Request(url, params);
    fetch(request).then((_response) => { Request["__pushStack__"](); return _response.json(); }).then(callback).catch(REQUEST_DEFAULT_ERROR).finally(() => { Request["__popStack__"](); });
};
// let elementJson = {
//   type: "render",
//   target: ".elements",
//   renderType: "append",
//   element: {
//     tagName: "button",
//     className: "button button-outline button-warning",
//     id: "json-button",
//     childrens: [
//       {
//         tagName: "span",
//         childrens: "Text"
//       }
//     ]
//   },
//   events: [
//     {
//       ref: "#json-button",
//       event: "click",
//       callback: "(evt) => {alert('OK')}"
//     }
//   ]
// }
// let functionJson = {
//   type: "script",
//   javascript: "alert('OK')"
// }
HTMLAnchorElement.prototype["initialize"] = function () {
    if (this.getAttribute("href") == "" || this.getAttribute("href") == "#") {
        this.setAttribute("href", "javascript:void(0)");
    }
    this.addEventListener("click", (evt) => {
        if (this.hasAttribute("remote")) {
            evt.preventDefault();
            let method;
            if (this.hasAttribute("method"))
                method = this.getAttribute("method").toLowerCase();
            else
                method = "get";
            Request["fetch"](this.getAttribute("href"), { method: method });
        }
    });
};
