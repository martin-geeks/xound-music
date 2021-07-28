const moult = require('moult');
const components = require('./components');
const log = console.log;
const app = moult.app('Xound-Music');
const PORT = process.env.PORT || 5000

app.use(moult.sessions({save: true,json:true,expire:2,path:'/'}))
app.use(moult.cookies());
app.use(moult.static({host:'dists'}));
app.use(moult.multipart());
app.use(components);
var userCatche;

app.set('404',(req,res,rep)=>{
    log(rep);
    
    res.json({code: 'HTTP_404'});
});
app.routes()
.get('/',(req,res,rep)=>{
    
    
    res.render('root',{});
})

app.listen(PORT);