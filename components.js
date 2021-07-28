
const { join }= require("path");

class Components {

constructor() {
this.app = "zeiro.components";
}

async call(req,res,app) {
let match = req.path.match(/components\/([.a-zA-Z0-9-]+)/);
if(match && match[1]) {
req.fine = true;
res.stem(join("dists","components",match[1]))
.catch(e => res.write("{}"))
.finally(e => res.end());
}
}


}

module.exports = new Components();