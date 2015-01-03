
var http = require('http')
var fs = require('fs')
var async = require('async')
var express = require('express')
var app = express()

//settings of docker registry server
var settings = JSON.parse(fs.readFileSync('config.js').toString());

//Debug info
console.log("Current Path: " + __dirname);
console.log("Load Settings from config.js: ")
console.log("%j", settings);

//static file handler
app.use(express.static(__dirname + '/public'));


function error(status, msg) {
  var err = new Error(msg);
  err.status = status;
  return err;
}

//HTTP GET METHOD 
function get(path, callback) {
    var options = {
        hostname: settings["docker.hostname"],
        port: settings["docker.port"],
        path: path,
        method: 'GET'
    }

    var httpreq = http.request(options, function (httpres) {
        if (httpres.statusCode != 200) {
            throw new Error('occured error when get data from docker registry server.');
        }

        //process data
        var data = [];
        httpres.on('data', function (chunk) {
            data.push(chunk);
        });

        httpres.on('end', function () {
            console.log("Request URI: " + path);
            callback(Buffer.concat(data));
        });
    });

    httpreq.on('error', function (e) {
        throw new Error(e.message);
    });

    httpreq.end();
}

//auth check before all reqeusts to "/api"
// app.use('/api', function (req, res, next) {
//     var uid = req.query["uid"];

//     if (!uid) {
//         return next(error(401, 'please login first'));
//     }

//     req.uid = uid;
//     next();
// });

/****************** API *******************/

//find images for given search keyword
app.get('/api/search', function (req, res) {
    var path = '/v1/search?q=' + (req.query.q || '');
    //step1: fetch related repositories
    get(path, function (data) {
        var repos = JSON.parse(data.toString('utf-8'));
        var results = [];

        //step2: fetch tags of the repository
        async.each(repos.results, function(repo, callback) {
            var url = '/v1/repositories/' + repo.name + "/tags";

            get(url, function (tagData) {
                var tags = JSON.parse(tagData.toString('utf-8'));

                for(var tag in tags) {
                    //step3: populate image info 
                    results.push({name: repo.name, desc: repo.description, tag: tag, imgId: tags[tag]});
                }

                callback();
            });

        }, function (err) {
            //when finish all reqeusts
            if (err) {
                res.status(500);
                res.send({error: err.message});
            } else {
                res.json(results);
            }            
        });//--end async block
        
    });//--end get
});

//get image details by image id
app.get("/api/images/:imgId", function (req, res) {
    var path = "/v1/images/" + req.params.imgId + "/json";

    get(path, function (data) {
        res.set('Content-Type', 'application/json')
        res.send(data);
    });
});

/******************  End API *******************/

//error handler
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send({error: err.message});
});

//404 handler
app.use(function (req, res) {
    res.status(404);
    res.send({error: "the page doesn't exists"});
})

//startup
if (!module.parent) {
    app.listen(3000);
    console.log("Server is running on port: " + 3000);
}

