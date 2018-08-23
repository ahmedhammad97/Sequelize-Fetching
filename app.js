const express = require('express');
const ejs =  require('ejs');
const bodyParser = require('body-parser');
const sequelize = require('sequelize');
const fs = require('fs');

//Express configs
const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs');
app.listen(1234, ()=>{
    console.log("Listening to port 1234 .. Watch your mouth there!");  
})

//Database
const connection = new sequelize("quotes", "root", null,{
    host: 'localhost',
    dialect: 'mysql',
    operatorsAliases: false,
    logging : false
});
const quote = connection.define("quote", {
    quoteBody : sequelize.STRING,
    author : sequelize.STRING
});
connection.sync().then(() => {console.log(`Database ready! Woohoooo...`)})


/*Only one time database fill
var obj = JSON.parse(fs.readFileSync(__dirname + '/quotes.json', 'utf8'));
var num = 0
var lastQuote = ""
setTimeout(()=>{

obj.forEach(record=>{

    if(record.Quote == lastQuote){return;}
    if(record.Author.length > 40){return;}

    quote.create({quoteBody: record.Quote, author: record.Author});
    num++;
    lastQuote = record.Quote;
});

console.log(num + " Saved");

},3000)
End */

app.get('/', (req, res)=>{
    res.render('home');
})

app.post('/', (req, res)=>{

    quote.findAll({where: {quoteBody : {[sequelize.Op.regexp]: `${convertToRegex(req.body.searchTerm)}`}} }).then((result)=>{
        res.render('result', {
            searchTerm : req.body.searchTerm,
            quotes : result
        });
    })
})

//Helper functions
var convertToRegex = function(term){
    let arr = term.trim().split(" ");
    let regex = "";
    arr.forEach(word=>{
      regex = regex.concat("|", word)
    })
    return regex.substr(1);
  }