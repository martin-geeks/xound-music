var components;

var mainUI, headerUI, sideBar, footerUI, popUpUI;
var reloadInterval, closeErrorTimeout;
var socket, locale, user, session;
lasts = {
tagged: {},
searched: {}
};

var loadStack = {
current: "",
abortController: new AbortController(),
};
var elements = {}
var root = document.getElementById('root');
async function requestData(method,url,params={},json){
let body = new FormData();
loadStack.abortController = new AbortController();
if(params instanceof FormData) { body = params }
else { Array.from(Object.entries(params)).forEach(data => body.append(data[0], data[1])); }
let xhr;
try { xhr = await fetch(url, method.toLowerCase() === "get" ? { signal: loadStack.abortController.signal  } : { method, body, signal: loadStack.abortController.signal });} catch(e) {
let resp = '{ "error": true, "message": "Couldn\'t fetch resources" }';
return json ? JSON.parse(resp) : resp;
};
xhr = await xhr.text();
try { xhr = json ? JSON.parse(xhr) : xhr; }
catch(e) { return { error: true, message: "JSON error" }}
return xhr;
}
async function loadUI(url, states={},i){
let component = await requestData("get", url,{}, true);
if(component.error) component = Object.assign({}, components.componentError);
component.states = component.states || {};
Object.assign(component.states,states);
return i ? UI.component(component): component;
}
components = {
    header : UI.component({
        "states": {},
        "is":"div",
        "class":"",
        "nodes":[" HI "]
    })
}

window.onload = async () =>{
    components.welcome = await loadUI('components/welcome',{changeLanguage: e => alert(1)},true);
    
    UI.render(components.welcome,root);
    
    if('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/serviceWorker.js',{scope:'/'})
        .then(resp =>{
            
        })
        .catch(err =>{
            alert(err);
        })
    } else {
        alert('Not Available');
    }
}