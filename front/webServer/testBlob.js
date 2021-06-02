var express = require('express');
var app = express();

var server = require('http').createServer(app);
var io = require('socket.io')(server);

// const io = require('socket.io')(server);
const resolution = {width: 1920, height: 1080};

app.use(function (req, res, next) { //TEMP
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,Cache-Control,x-csrf-token,x-access-token");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("preflightContinue", true);

    next();
});




io.on('connection', client => {
    client.on('event', data => { /* … */
    });
    client.on('disconnect', () => { /* … */
    });

});
server.listen(4001);
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 4002 });
wss.on('connection', function connection(ws) {

});

function changeObject(obj) {


    if (obj.hasOwnProperty('bb') && Array.isArray(obj.bb) && obj.bb.length > 0) {
        obj.bb.forEach((track) => {
            if (track.hasOwnProperty('trackBB')
                && track.trackBB.hasOwnProperty('xMin')) {
                track.trackBB.xMin = +track.trackBB.xMin / resolution.width;
            }
            if (track.hasOwnProperty('trackBB')
                && track.trackBB.hasOwnProperty('yMin')) {
                track.trackBB.yMin = +track.trackBB.yMin / resolution.height;
            }
            if (track.hasOwnProperty('trackBB')
                && track.trackBB.hasOwnProperty('xMax')) {
                track.trackBB.xMax = +track.trackBB.xMax / resolution.width;
            }
            if (track.hasOwnProperty('trackBB')
                && track.trackBB.hasOwnProperty('yMax')) {
                track.trackBB.yMax = +track.trackBB.yMax / resolution.height;
            }
        })
    }
    const x = 0;
}

function generateRandomWidthHeight(obj) {
    if (obj.hasOwnProperty('bb') && Array.isArray(obj.bb) && obj.bb.length > 0) {
        obj.bb.forEach((track) => {
            if (track.hasOwnProperty('trackBB')
                && track.trackBB.hasOwnProperty('xMin')
                && track.trackBB.hasOwnProperty('yMin')
                && track.trackBB.hasOwnProperty('xMax')
                && track.trackBB.hasOwnProperty('yMax')) {

                track.trackBB.xMin = getRandomInt(resolution.width - 300)/ resolution.width;
                track.trackBB.yMin = getRandomInt(resolution.height - 300)/ resolution.height;
                track.trackBB.xMax = track.trackBB.xMin + ((getRandomInt(140)+130)/ resolution.width);
                track.trackBB.yMax = track.trackBB.yMin + ((getRandomInt(140)+130)/ resolution.height);
            }

        })
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function newObj() {
    const part = {
        "time": "2519784",
        "unixtimestamp": "1606149303451455419",
        "bb": [
            {"trackId": 1, "trackBB": {"xMin": 0, "yMin": 10, "xMax": 20, "yMax": 40}},
            {"trackId": 2, "trackBB": {"xMin": 50, "yMin": 80, "xMax": 100, "yMax": 140}
            }],

        "droneGPS": {"lat": 12, "long": 24, "alt": 30, "pitch": 10, "roll": 429, "heading": 3},
        "gimbalOrientation": {"pan": 12, "tilt": 29},
        "cameraZoom": 0
    }
    const part2 ={
        "room": "test",
        "location": {
            "latitude": 34.6,
            "longitude": 32.7
        },
        "blubMetaData": [{
            "id": "1",
            "name":"bbb",
            "rectangleData": {
                "minX": 0.5,
                "minY": 0.5,
                "maxX": 0.5,
                "maxY": 0.5
            }
        }, {
            "id": "2",
            "name":"cccc",
            "rectangleData": {
                "minX": 0.5,
                "minY": 0.5,
                "maxX": 0.5,
                "maxY": 0.5
            }
        }]

    }

//    changeObject(part);
    generateRandomWidthHeight(part);
    part2.blubMetaData=[];
    part.bb.forEach((blob)=>{

        blob2= {"id": "1",
            "name":"bbb",
            "rectangleData": {
                "minX": 0.5,
                "minY": 0.5,
                "maxX": 0.5,
                "maxY": 0.5
            }
        }
        blob2.id = blob.trackId;
        blob2.name = blob2.name + blob.trackId;
        blob2.rectangleData.maxX = blob.trackBB.xMax;
        blob2.rectangleData.maxY = blob.trackBB.yMax;
        blob2.rectangleData.minX = blob.trackBB.xMin;
        blob2.rectangleData.minY = blob.trackBB.yMin;
        part2.blubMetaData.push(blob2)
    })
    part.unixtimestamp = "" + Date.now();
    part.time = "" + Math.floor(Date.now() / 1000);
    return part2;
}
function sendws(data){

    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}
setInterval(() => {
    const part = newObj();
    io.emit('test', part);
    sendws(part);

    io.emit('test1', part);
    sendws(part);
    io.emit('test2', part);
    sendws(part);

}, 1000);