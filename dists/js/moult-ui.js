

const log = console.log;


class UI {

static component(defs) { return new Component(defs); }


static clear_ui(ui) { Array.from(ui.childNodes).forEach((v,i) => { ui.removeChild(v); }); }
static del_node(ui,noid) { ui.removeChild(ui.childNodes[noid]) }
static rep_node(ui,noid,nui) { ui.childNodes[noid] ? ui.childNodes[noid].replaceWith(nui) : ui.appendChild(nui); }


static build(defs) {

/*
if(defs.id === "io") { console.log(JSON.stringify(defs.nodes[0].states)); }

*/

if(defs.meets) {
if(!defs.operand) { return document.createElement("div"); }
}
if(defs.is === "text") {
let ele = document.createElement("span");
ele.innerHTML = defs.text;
return ele;
} else {
let ele;
if(defs.is === "img") {
ele = document.createElement(defs.label ? "label": "div");
ele.style.background = `${defs.shade ? "linear-gradient("+defs.shade+"), " : ""}url(${defs.src}) center`;
ele.style.backgroundSize = "cover";
} else {
ele = document.createElement(defs.is);
}
if(defs.id) { ele.setAttribute("id",defs.id); }
if(defs.class) { ele.setAttribute("class", defs.class); }
if(defs.props) {
defs.props.forEach((v,i) => {
try {
ele.setAttribute(v[0],v[1]);
} catch(e) { alert(e); }
});
}
if(defs.attributes) {
Array.from(Object.entries(defs.attributes))
.forEach(attribute => { ele[attribute[0]] = attribute[1]; });
}
if(defs.src) { ele.src = defs.src; }
if(defs.events) {
Array.from(Object.entries(defs.events))
.forEach((event,i) => {
if(event[1].forEach) {
event[1].forEach((ev,i) => {
if(typeof ev === "string") {
console.log(defs.state("message"));
}
ele.addEventListener(event[0],ev);
});
} else {
ele.addEventListener(event[0],event[1]);
}
});
}
if(defs.nodes) {
defs.nodes.forEach((v,i) => {
ele.appendChild(UI.build(v));
});}
return ele;
}
}

static render(ele,ui) {



ui = ele.container = ui ? ui : ele.container;
if(ele.meets) {
if(ele.old && ele.old.meets) {
if(ele.operand && !ele.old.operand) {
return UI.rep_node(ui,ele.index,UI.build(ele));
} else if(!ele.operand && ele.old.operand || !ele.operand) {
return UI.rep_node(ui,ele.index, document.createElement("div"));
}
}
}
if(!ui) { return new Error("Container is not specified"); };
if(ele.old) {

if(ele.is !== ele.old.is || (ele.is === "img" && ele.src !== ele.old.src)) {
return UI.rep_node(ui,ele.index,UI.build(ele)); }
if(ele.is === "text") {
return ele.text !== ele.old.text ? UI.rep_node(ui,ele.index,UI.build(ele)) : ""; }

if(ele.nodes) {
let oldNodes = ele.old.nodes ? Array.from(ele.old.nodes) : [];
ele.nodes.forEach((node, ind) => {
UI.render(node, ui.childNodes[ele.index]);
oldNodes.shift();
});
oldNodes.reverse().forEach((oldNode,i) => UI.del_node(ui.childNodes[ele.index], oldNode.index));
}

if(ele.is === "img" && ele.src !== ele.old.src) { UI.rep_node(ui,ele.index, UI.build(ele)); }

if(ele.events) {
Array.from(Object.entries(ele.events))
.forEach((event,i) => {
if(event[1].forEach && ele.old.events && ele.old.events[event[0]]) {
if(ele.old.events[event[0]].forEach) { ele.old.events[event[0]].forEach(ev => { ui.childNodes[ele.index].removeEventListener(event[0],ev);})}
else { ui.childNodes[ele.index].removeEventListener(event[0], ele.old.events[event[0]]); }
}
if(event[1].forEach) {
event[1].forEach((ev,i) => {
ui.childNodes[ele.index].addEventListener(event[0],ev);
});
} else {
ui.childNodes[ele.index].addEventListener(event[0],event[1]);
}});
}

if(ele.class && ele.class !== ele.old.class) {
ui.childNodes[ele.index].setAttribute("class", ele.class);
}
if(ele.id && ele.id !== ele.old.id) {
ui.childNodes[ele.index].setAttribute("id", ele.id); }
if(ele.props) {
ele.props.forEach((v,i) => {
if(ele.old.props && v[1] !== ele.old.props[i][1]) {
if(ele.is ==="input") { console.log(9); }
ui.childNodes[ele.index].setAttribute(v[0],v[1]);
}});}
if(ele.attributes) { Array.from(Object.entries(ele.attributes)).forEach((attribute,i) => { if(attribute[1] !== ele.old.attributes[attribute[0]]) { ui.childNodes[ele.index][attribute[0]] = attribute[1]; }});}
}
else {
UI.rep_node(ui,ele.index,UI.build(ele));
}
}

}

class Component {

constructor(defs) {
defs.nodes = defs.nodes ? defs.nodes : [];
this.props = [];
this.history = [];
this.blueprint = Object.assign({},defs);
this.states = defs.state ? undefined : defs.states;
this.state = defs.state ? defs.state : state => state === "@" ? this.states : this.states[state];
if(defs.meets) {
this.meets = defs.meets;
this.operand = this.catalyze(defs.operand);
}
this.is = this.catalyze(defs.is);
if(defs.label) { this.label = defs.label; }
this.index = defs.index ? defs.index : 0;
if(defs.id) { this.id = this.catalyze(defs.id); }
if(this.is === "text"){
this.text = this.catalyze(defs.text);
}
if(defs.class) { this.class = this.catalyze(defs.class.join ? defs.class.join(" ") : defs.class); }
if(defs.props) {
defs.props.forEach((v,i) => {
this.props.push([v[0],this.catalyze(v[1])]);
});
}

this.attributes = {};
if(defs.attributes) {
Array.from(Object.entries(defs.attributes))
.forEach(attribute => {
this.attributes[this.catalyze(attribute[0])] = this.catalyze(attribute[1]);
});
}

if(defs.src) {
this.src = this.catalyze(defs.src);
this.shade = this.catalyze(defs.shade);
}

if(defs.events) {
this.events = {};
Array.from(Object.entries(defs.events))
.forEach((event,i) => {
if(event[1].forEach) {
this.events[event[0]] = [];
event[1].forEach((func,i) => {
this.events[event[0]].push(this.catalyze(func));
});
} else {
this.events[event[0]] = this.catalyze(v[1]);
}
});
}

if(defs.loop && defs.array) {
this.array = this.catalyze(defs.array);
this.array = this.array && this.array.forEach ? this.array : [];
if(this.array && this.array.forEach) {
this.nodes = [];
this.limit = defs.limit !== undefined ? defs.limit : this.array.length;
for(let x = 0; x < this.array.length && x < this.limit; x++) {
defs.nodes.forEach((snd,ind) => {
this.nodes.push(new Component(Object.assign(typeof snd === "string" ? { is: "text", text: snd } : snd, { states: this.array[x], state: state => state === "@" ? this.array[x] : this.array[x][state], index: x })));
});}
}
} else if(defs.nodes) {
this.nodes = [];
defs.nodes.forEach((v,i) => {
this.nodes.push(new Component(Object.assign(typeof v === "string" ? { is: "text", text: v } : v, { state: this.state, index: i })));
});
}

}

catalyze(string)  {
if(string === "@") { return JSON.stringify(this.states); }
if(typeof string !== "string"){ return string; }
let returnValue = ""+string;
let matches = returnValue.match(/@([.a-zA-Z_0-9-]+)?/g);
if(matches) {
matches.forEach((match,i) => {
let value;
let mat = match;
match = match.split("@")[1].split(".");
match.forEach((v,i) => {
value = value === undefined ? this.state(v): value[v];
});
try {
if(typeof value === "function" || typeof value === "object" || typeof value === "boolean") {
returnValue = value;
} else {
returnValue = returnValue.replace(new RegExp(`${mat}`),value);
}
} catch(e) { alert(e); }
});
}
return returnValue;
}

reset(defs) {

}

update(defs,render) {
delete this.old;

this.old = Object.assign({}, this);
this.states = typeof this.states === "object" ? Object.assign({}, this.states, defs.states ? defs.states : {}) : defs.states;
let blueprint = Object.assign({}, this.blueprint);
let nodes = [], blueprintNodes = [];
let props = [], blueprintProps = [];
this.state = defs.state ? defs.state : this.state;
this.events = {};
this.index = defs.index !== undefined ? defs.index : this.index;
this.is = defs.is ? this.catalyze(defs.is) : blueprint.is ? this.catalyze(blueprint.is) : undefined;
this.text = defs.text ? this.catalyze(defs.text) : blueprint.text ? this.catalyze(blueprint.text) : undefined;
this.src = defs.src ? this.catalyze(defs.src) : blueprint.src ? this.catalyze(blueprint.src) : undefined;
this.id = defs.id ? this.catalyze(defs.id) : blueprint.id ? this.catalyze(blueprint.id) : undefined;
this.class = defs.class ? this.catalyze(defs.class) : blueprint.class ? this.catalyze(blueprint.class) : undefined;
this.meets = defs.meets ? this.catalyze(defs.meets) : blueprint.meets ? this.catalyze(blueprint.meets) : undefined;
this.operand = defs.operand !== undefined ? this.catalyze(defs.operand) : blueprint.operand ? this.catalyze(blueprint.operand) : undefined;
this.loop = defs.loop !== undefined ? this.catalyze(defs.loop) : blueprint.loop ? this.catalyze(blueprint.loop) : undefined;
this.array = defs.array !== undefined ? this.catalyze(defs.array) : blueprint.array ? this.catalyze(blueprint.array) : undefined;
this.limit = defs.limit !== undefined ? this.catalyze(defs.limit) : blueprint.limit !== undefined ? this.catalyze(blueprint.limit) : this.array ? this.array.length : null;
let attributes = Object.assign({}, blueprint.attributes);
if(this.is === "text") {
this.nodes = blueprint.nodes = [];
if(this.text === "...") {  }
}
if(defs.attributes) {
blueprint.attributes = blueprint.attributes ? blueprint.attributes : {};
Array.from(Object.entries(defs.attributes)).forEach(attribute => {
blueprint.attributes[attribute[0]] = attribute[1];
attributes[attribute[0]] = this.catalyze(attribute[1]);
});} else if(blueprint.attributes) {
Array.from(Object.entries(blueprint.attributes)).forEach(attribute => {
attributes[attribute[0]] = this.catalyze(attribute[1]);
});}
if(defs.props) {
defs.props.forEach((prop,i) => {
blueprintProps.push([prop[0], this.catalyze(prop[1])]);
props.push([prop[0], this.catalyze(prop[1])]);
});} else if(blueprint.props) {
blueprint.props.forEach((prop,i) => {
blueprintProps.push([prop[0], this.catalyze(prop[1])]);
props.push([prop[0], this.catalyze(prop[1])]);
});}
if(defs.events) {
Array.from(Object.entries(defs.events)).forEach((event,i) => {
this.events[event[0]] = [];
event[1].forEach((ev) => {
this.events[event[0]].push(this.catalyze(ev));
});});} else if(blueprint.events) {
Array.from(Object.entries(blueprint.events)).forEach((event,i) => {
this.events[event[0]] = [];
event[1].forEach((ev) => {
this.events[event[0]].push(this.catalyze(ev));
});});}

if(this.loop && this.array ) {
let array = this.array;
// array = array ? array : [];
let limit = this.limit;
let Nodes = [];

if(defs.nodes) {

defs.nodes.forEach((node,i) => {
blueprintNodes.push(typeof node === "string" ? node : blueprint.nodes[i] ? Object.assign({}, blueprint.nodes[i], node) : node);
Nodes.push(typeof node === "string" ? node : blueprint.nodes[i] ? Object.assign({}, blueprint.nodes[i], node) : node);
});} else if(blueprint.nodes) {
blueprint.nodes.forEach(node => {
if(node.nodes && node.nodes[0] === "@actionName") {
}
Nodes.push(typeof node === "string" ? ""+node : Object.assign({}, node));
})
}
for(let x = 0; x < array.length && (this.limit === null ? true : x < this.limit) && Nodes; x++) {
let state = array[x];
Nodes.forEach((node,i) => {
node = typeof node === "string" ? { is: "text", text: node } : node;
Object.assign(node, { index: ((Nodes.length*x)+i), states: state, state: states => states === "@" ? state : state[states] });
nodes.push(this.nodes[((Nodes.length*x)+i)] ? this.nodes[((Nodes.length*x)+i)].update(node,true) : new Component(node));
})}}
else if(defs.nodes) {
defs.nodes.forEach((node,i) => {
blueprintNodes.push(typeof node === "string" ? ""+node : blueprint.nodes[i] ? Object.assign({}, blueprint.nodes[i], node) : Object.assign({},node));
node = typeof node === "string" ? { is: "text", text: node } : node;
Object.assign(node, { index: i,state:this.state });
nodes.push(this.nodes[i] ? this.nodes[i].update(node,true) : new Component(node));
});} else if(blueprint.nodes) {
blueprint.nodes.forEach((node,i) => {
blueprintNodes.push(typeof node === "string" ? ""+node : blueprint.nodes[i] ? Object.assign({}, blueprint.nodes[i], node) : Object.assign({},node));
node = typeof node === "string" ? { is: "text", text: node } : node;
Object.assign(node, { index: i, state: this.state, states: null });
nodes.push(this.nodes[i] ? this.nodes[i].update(node,true) : new Component(node));
});
}

blueprint.nodes = blueprintNodes;
blueprint.props = blueprintProps;
blueprint.class = defs.class ? defs.class : blueprint.class;
blueprint.src = defs.src ? defs.src : blueprint.src;
blueprint.text = defs.text ? defs.text : blueprint.text;
blueprint.id = defs.id ? defs.id : blueprint.id;
blueprint.meets = defs.meets !== undefined ? defs.meets : blueprint.meets;
blueprint.operand = defs.operand !== undefined ? defs.operand : blueprint.operand;
blueprint.loop = defs.loop !== undefined ? defs.loop : blueprint.loop;
blueprint.limit = defs.limit !== undefined ? defs.limit : blueprint.limit;
blueprint.array = defs.array !== undefined ? defs.array : blueprint.array;
this.nodes = nodes;
this.attributes = attributes;
this.props = props;
this.blueprint = blueprint;
/*
if(defs.pid === "reset") {
log(JSON.stringify(this.nodes[0].nodes));
} */
return render ? this : UI.render(this);
}

}


/*
{ "is": "div", "class": "mr ml", "nodes": [{ "is": "i", "class": "ic ic-bell cl ft20" }] },
{ "is": "div", "class": "wc bdbdl b5", "nodes": [
{ "is": "p", "class": "ft12", "nodes": ["@message"] },
{ "is": "p", "meets": true, "operand": "@actionable", "class": "cs fwb pv3 ft11", "props": [[ "action","@action" ]], "events": { "click": ["@more"] }, "nodes": ["@actionText"]}
]}
*/