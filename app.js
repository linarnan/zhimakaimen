var m = require('mraa');
var util = require('util');
var pin = new m.Gpio(20);
pin.dir(m.DIR_OUT);

var http = require('http');
var port = 3000; 
var time = 500;
var lock = false;

function turnOn() {
    console.log("turn ON!");
    pin.write(1);
    setTimeout(turnOff, time);
}

function turnOff() {
    pin.write(0);
    console.log("turn Off!");
}

function indexHTML(){
return '<!DOCTYPE><head> \
<style>.arrow-up {margin:auto auto; width:0;height:0;border-left:400px solid transparent;border-right:400px solid transparent;border-bottom:400px solid black;} </style>\
<script>function turnOn(){var r = new XMLHttpRequest();r.open("GET", "/api/on", true);r.send();}</script>\
</head><body><button><div class="arrow-up" onclick="turnOn()" ontouchstart="turnOn()"></div></button></body></html>';
}

var requestHandler = function(req, res){  
  //for (x in req.client){console.log(x);};
    console.log(req.socket.remoteAddress);
  //for (x in req.socket){console.log(x);};
  if(req.url === '/api/on'){
    if(lock === true){
      res.writeHead(200);res.end('');
      return;
    }
    lock = true;
    turnOn();
    setTimeout(function(){lock=false}, 2000);
    res.writeHead(200);res.end('');
  }else{
    var body = indexHTML();
    res.writeHead(200, {'Content-Type':'text/html', 'Content-Length': body.length});
    res.end(body);
  }
}

var server = http.createServer(requestHandler)

server.listen(port, function(err) {  
  if (err) {
    return console.log('something bad happened', err)
  }
  console.log('server is listening on ' + port);
})
