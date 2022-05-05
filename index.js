// Place your server entry point code here
const express = require('express')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const morgan = require('morgan')

const logdb = require('./src/services/database.js')

const fs = require("fs")

const help_message = (`
server.js [options]

--port	Set the port number for the server to listen on. Must be an integer
            between 1 and 65535.

--debug	If set to true, creates endlpoints /app/log/access/ which returns
            a JSON access log from the database and /app/error which throws 
            an error with the message "Error test successful." Defaults to 
            false.

--log		If set to false, no log files are written. Defaults to true.
            Logs are always written to database.

--help	Return this message and exit.
`)

//read the port number here through CLI

const args = require('minimist')(process.argv.slice(2))

args['port']
args['help']
args['debug']
args['log']

const port = args.port || process.env.PORT || 5555


//start server
const server = app.listen(port, () => {
    console.log('App listening on port %PORT%'.replace('%PORT%', port))
});

app.use(express.static('./public'));

//a04 starts here

if (args.help || args.h) {
  console.log(help_message) 
  process.exit(0)
}



if(args.log == true){
  const WRITESTREAM = fs.createWriteStream('./log/access.log', { flags: 'a'})
  app.use(morgan('combined', { stream: accessLog}))
}

app.use((req, res, next) => {
  let logdata = {
    remoteaddr: req.ip,
    remoteuser: req.user,
    time: Date.now(),
    method: req.method,
    url: req.url,
    protocol: req.protocol,
    httpversion: req.httpVersion,
    status: res.statusCode,
    referer: req.headers['referer'],
    useragent: req.headers['user-agent']
}
    const stmt = logdb.prepare('INSERT INTO access (remoteaddr, remoteuser, time, method, url, protocol, httpversion, status, referer, useragent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    const info = stmt.run(logdata.remoteaddr, logdata.remoteuser, logdata.time, logdata.method, logdata.url, logdata.protocol, logdata.httpversion, logdata.status, logdata.referer, logdata.useragent)

  next();
})

if(args.debug == true){

  app.get('/app/log/access', (req, res) =>{
    try{
      const stmt = logdb.prepare('SELECT * FROM access').all()
      res.status(200).json(stmt)
    }
    catch{
      console.error(e)
      console.log("Not accessible")
    }
  })

  app.get('/app/error', (req, res) => {
    throw new Error("Error test successful.")
  })
}

app.get('/app/', (req, res) => {
    // Respond with status 200
        res.statusCode = 200;
    // Respond with status message "OK"
        res.statusMessage = 'OK';
        res.writeHead( res.statusCode, { 'Content-Type' : 'text/plain' });
        res.end(res.statusCode+ ' ' +res.statusMessage)
    });

app.get('/app/flip/', (req, res) => {
    result = coinFlip()
   
    res.status(200).json({"flip": result})

});

app.get('/app/flips/:number', (req, res) => {
    
    result = coinFlips(req.params.number)

    res.status(200).json({"raw": result, "summary" : countFlips(result)})

});

app.post('/app/flips/coins', (req, res, next) => {
    result = coinFlips(req.params.number)
    show = {"raw": result, "summary" : countFlips(result)}
    res.status(200).json(show)
})

app.get('/app/flip/call/:guess(heads|tails)/', (req, res) => {
	
    result = flipACoin("heads")

    res.status(200).json(result)
});

app.post('/app/flip/call/', (req, res, next) => {
    call = flipACoin(req.body.guess)
    res.status(200).json(call)
})

//default endpoint
app.use(function(req, res){
    res.status(404).send('404 NOT FOUND')
}); 


//functions
function coinFlip() {
    var num = Math.floor(Math.random() * 2)
    if(num == 0){
      return "heads"
    }
    else{
      return "tails"
    }
  }
  
function coinFlips(flips) {
    var flip = flips
    const list = []
    var index = 0;
  
    while(flip != 0){
      list[index] = coinFlip();
      flip--
      index++
    }
    return list
  
  }

function countFlips(array) {
    var num_heads = 0;
    var num_tails = 0;
  
    for(const results of array){
      if(results == "heads"){
        num_heads++
      }
      else{
        num_tails++
      }
    }
    return {"heads": num_heads, "tails" : num_tails}
  
  }
  
function flipACoin(call) {
    var result = coinFlip()
    if(result == call){
      return {"call": call, "flip": result, "result": 'win'}
    }
    else{
      return {"call": call, "flip": result, "result": 'lose'}
    }
  
  }