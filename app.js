
var express = require('express');  // lightweight framework which node requires
	app = express();
	var server = require('http').createServer(app);  // socket needs http server module
	io = require('socket.io').listen(server);
//	io =require('../..')(server);
	var mysql = require('mysql');  
	users = {};
	
//var port = normalizePort();
//app.set('port', port);	
server.listen(process.env.PORT || 2000);  // what port to listen

// io.configure(function () { 
//  io.set("transports", ["xhr-polling"]); 
//  io.set("polling duration", 10); 
// });

//var connection = mysql.createConnection({
// host: 'localhost',
// user: 'root',
// password: '',
 //database: 'final_chat'
//});   
//connection.connect(function(err){
//	if(err){
	//	console.log(err);
//	}else{
//		console.log('connected');
//	}
//});

// database name to be used
//connection.query('use final_chat');

// end mysql
// create route
app.use('/*', function(req, res){
	res.sendfile(__dirname + '/index.html');
});
// turn on connection event whenever client connects to server. it takes function parameter as socket that cliet is using

io.on('connection', function(socket){
	// all socket code goes inside this.
console.log("socket connected");	
 
/* connection.query('SELECT * FROM chat order by time desc limit 2', function(err, docs){
 if(err) throw err;
		socket.emit('load old msgs', docs);
 });*/
	
	// socket.on used to recieve events
	socket.on('new_user', function(data){
		// data object has all the data which is sent from .emit
			var datastring = JSON.stringify(data);
			var dataparsed = JSON.parse(datastring);
			socket.nickname = dataparsed.usernick;
			users[socket.nickname] = socket;
			console.log(socket.nickname);
	});
	

	socket.on('send_message', function(data){
		var datastring = JSON.stringify(data);
		var dataparsed = JSON.parse(datastring);
		if(dataparsed.friend_name in users){
			users[dataparsed.friend_name].emit('new_message', {message: dataparsed.message, user_name: dataparsed.user_name});
		}
		// .emit is used for sending events. pattern .emit('funtion_name', { json data });
		users[dataparsed.user_name].emit('new_message_return', {message: dataparsed.message, user_name: dataparsed.user_name});
	});
		// socket.on recieves msg. emit sends msg
	
	
	socket.on('disconnect', function(data){
		if(!socket.nickname) return;
		delete users[socket.nickname];
	});
});
