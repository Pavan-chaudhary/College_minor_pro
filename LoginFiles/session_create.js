var express = require('express');
var route = express.Router();
var uuid = require('uuid/v4');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mysql = require('mysql');
var fs = require('fs');

/*var conn = mysql.createConnection({
	host:'127.0.0.1',
	user:'root',
	password:'mysqldb',
	database:'auto_business'
})*/

const users = [
   {id:'skfnk3',email:'pavanjatt90@gmail.com',password:'vpy599'}
]

route.use(bodyParser.urlencoded({
		extended:false
	}));
route.use(bodyParser.json());

//Configure passport.js to use local strategy called by passport.authenticate() function
passport.use(new LocalStrategy({usernameField:'email',passwordField:'pass'},function(email,pass,done){
  console.log('Inside local Strategy callback');
 /*  var query="SELECT pass FROM users WHERE email='"+email+"'";
   conn.query(query,function(err){
   	  if(err) throw error;
   	  if(password=rows[0].pass){
   	  	return done(null,)
   	  };
   })*/
   const user = users[0];
   if(email==user.email&&pass==user.password){
   	console.log('Local Strategy returned true');
   	return done(null,user);
   }
  }
));

//tell passport how to serialize the user
passport.serializeUser((user,done)=>{
    console.log('Inside serializeUser callback.User id is save to the session file store here');
    done(null,user.id);
});

passport.deserializeUser((id,done)=>{
    console.log('Inside deserializeUser callback');;
    console.log(`The user id passport saved in the session file store is:${id}`)
    const user = users[0].id === id ? users[0] :false;
    done(null,user);
});

route.use(session({
	genid:function(req){
	    console.log("Indside the session middleware")
	    console.log(req.sessionID)
	    return uuid()	
	},
	store:new FileStore(),
	secret:'hello',
	resave:false,
	saveUninitialized:true
}));

route.use(passport.initialize());
route.use(passport.session());

//creating the login post route
route.post('/verify',(req,res,next)=>{
   console.log('Inside POST /login callback');
   console.log(req.sessionID);
   console.log(req.body.email);
   console.log(req.body.pass);
   passport.authenticate('local',(err,user,info)=>{
        console.log("Inside passport.authenticate callback");
        console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`);
        console.log('req.user:'+req.user);
        req.login(user,(err)=>{
        	console.log('Inside req.login() callback');
        	console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`);
        	console.log(`req.user:${JSON.stringify(req.user)}`);
        	return res.send('You were authenticated & logged in!');
        })  
    })(req,res,next);

route.get('/verified',(req,res)=>{
	console.log('Inside GET /verified callback');
	console.log(`User authenticated? ${req.isAuthenticated()}`);
	if(req.isAuthenticated()){
		res.send('Authenticated request demo');
	}else{
		res.send('Invalid User');
	}
  });

});

route.get('/login_page',function(req,res){
	fs.readFile('./LoginFiles/login_page.html',function(err,data){
		if(err) throw err;
    	res.writeHead(200,{'Content-Type':'text/html'});
        res.write(data);
        return res.end();
	});
});

route.get('/login_page_css',function(req,res){
	fs.readFile('./LoginFiles/login_page_css.css',function(err,data){
		if(err) throw err;
    	res.writeHead(200,{'Content-Type':'text/css'});
        res.write(data);
        return res.end();
	})
})
module.exports=route;