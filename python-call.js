const express = require("express") ;
const path = require('path') ;
const session = require('express-session');
var http = require('http');
var usersRouter = require('./routes/users');
var transliterateRouter = require('./routes/NodeServer');

var PORT = process.env.port || 3003;
  
var cors = require('cors');

var app = express();
app.use('/users', usersRouter);
app.use('/transliterate', transliterateRouter);

//Import PythonShell module. 
const {PythonShell} =require('python-shell'); 

app.use(cors()); 
app.use(session({secret: '123HJYF65%^Etd',
 // Forces the session to be saved 
// back to the session store 
resave: true, 

// Forces a session that is "uninitialized" 
// to be saved to the store 
saveUninitialized: true}));
app.use(express.static(path.join(__dirname, '../')));
app.set("view engine", "ejs") 
     
app.listen(PORT, function(error){ 
    if(error) throw error 
    console.log("Server created Successfully on PORT", PORT) 
}) 

app.get('/callpython', (req, res, next)=>{ 
  // const { spawn } = require('child_process');
  // const pyProg = spawn('python', ['./HelloWorld.py']);
  console.log("Python start");
   //Here are the option object in which arguments can be passed for the python_test.js. 
   sess = req.session;
   sess.source = (sess.source == null | sess.source == undefined)? 'Devanagari':sess.source;
   
   let options = { 
    mode: 'text', 
    pythonOptions: ['-u'], // get print results in real-time 
      //scriptPath: 'path/to/my/scripts', //If you are having python_test.py script in same folder, then it's optional. 
    args: [sess.source, req.query.target, req.query.text] //An argument which can be accessed in the script using sys.argv[1] 
}; 
  

PythonShell.run('HelloWorld.py', options, function (err, result){ 
      if (err) throw err; 
      // result is an array consisting of messages collected  
      //during execution of script. 
      console.log("Python success "+ result.toString());
      res.send(result.toString()) ;
}); 

  console.log("Python end");
})

module.exports = app;
