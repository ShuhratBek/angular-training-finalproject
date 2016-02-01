var express = require('express'),
    app = express(),
    topRouters = [],
    bodyParser = require('body-parser'),
    pause = require('connect-pause'),
    NodeCache = require("node-cache"),
    myCache = new NodeCache(),
    users = require('./data/users.json'),
    profiles = require('./data/profile.json'),
    fs = require('fs'),
    every = require('every-time'),
    dummyjson = require('dummy-json'),
    templateNodes = fs.readFileSync('./data/templateNodes.hbs', {encoding: 'utf8'}),
    templateChart = fs.readFileSync('./data/templateChart.hbs', {encoding: 'utf8'});
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

myCache.set("users", users);
myCache.set("profiles", profiles);

app.use(function (req, res, next) {
     if (topRouters.length >  0) {
         var idx =  0;
         var nextRouter =  function  () {
             ++idx;
             if (idx <  topRouters.length) {
                 topRouters[idx](req, res, nextRouter);
             } else {
                 next();
             }
         };
        topRouters[idx](req, res, nextRouter);
     } else {
         next();
     }
 });

app.post('/login', pause(3000), function(req, res) {
    var data = myCache.get('users'),
        result = {},
        username = req.body.username,
        password = req.body.password,
        obj = data.users.filter(function (obj) {
            return (obj.username === username && obj.password === password);
        })[0],
        id = data.users.indexOf(obj);
    if(id > -1) {
        result.id = id;
        result.success = true;
    } else {
        result.success = false;
    }
    res.send(result);
});

app.post('/forgot', pause(3000), function(req, res) {
    var data = myCache.get('users'),
        result = {},
        username = req.body.username,
        obj = data.users.filter(function (obj) {
            return (obj.username === username);
        })[0],
        id = data.users.indexOf(obj);
    if(id > -1) {
        result.password = data.users[id].password;
        result.success = true;
    } else {
        result.success = false;
    }
    res.send(result);
});

app.get('/getprofile/:id', function(req, res) {
    var data = myCache.get('profiles'),
        userCache = myCache.get('users'),
        result = {},
        id = req.params.id,
        profile = data.profiles[id];
    if(id > -1 && profile) {
        result.data = profile;
        result.data.password = userCache.users[id].password;
        result.success = true;
    } else {
        result.success = false;
    }
    res.send(result);
});

app.post('/setprofile/:id', pause(3000), function(req, res) {
    var profileCache = myCache.get('profiles'),
        userCache = myCache.get('users'),
        result = {},
        id = req.params.id;

    profileCache.profiles[id].age = req.body.age;
    profileCache.profiles[id].birthday = req.body.birthday;
    profileCache.profiles[id].greeting = req.body.greeting;
    userCache.users[id].password = req.body.password;

    if(myCache.set('users', userCache) && myCache.set('profiles', profileCache)) {
        result.success = true;
    } else {
        result.success = false;
    }
    res.send(result);
});

app.get('/chart', function(req, res) {
    res.send({value: random(100)});
});

app.get('/nodes/:id', function(req, res) {
    var result = dummyjson.parse(templateNodes);
    res.send(result);
});

function random (high) {
    return Math.round(Math.random() * high,2);
}

var  router = express.Router();

router.use('/', function(req, res, next) {
    next();
});

topRouters.splice(0, 0, express.static(__dirname));
app.listen(3000);

console.log('3000 port');
var server = require('http').createServer();
var io = require('socket.io')(server);
io.on('connection', function(socket){
    every('1 seconds', function(){
        socket.emit('chart', {values: chartValue()});
    });
});
function chartValue() {
    var result = dummyjson.parse(templateChart);
    var obj = JSON.parse(result);
    return obj.values;
}
server.listen(9999);