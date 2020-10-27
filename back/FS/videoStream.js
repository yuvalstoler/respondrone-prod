"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require('path');
const fs = require('fs');

const uploadsPath = path.join(__dirname, './uploads');
const services = require(path.join(__dirname, '../../config/services.json'));
const port = services.VSS.port;

const mimeNames = {
    '.css': 'text/css',
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.mp3': 'audio/mpeg',
    '.mp4': 'video/mp4',
    '.ogg': 'application/ogg',
    '.ogv': 'video/ogg',
    '.oga': 'audio/ogg',
    '.txt': 'text/plain',
    '.wav': 'audio/x-wav',
    '.webm': 'video/webm'
};



class Server
{
    constructor() {
        this.createApp();
        this.createServer();
        this.middleware();
        this.listen();
        this.routes()
    }

    routes() {
        this.app.use('/api/file', (request, response) => {
            // We will only accept 'GET' method. Otherwise will return 405 'Method Not Allowed'.
            if (request.method !== 'GET') {
                this.sendResponse(response, 405, {'Allow': 'GET'}, null);
                return null;
            }

            var filename = path.join(uploadsPath, request.url);
            //initFolder + url.parse(request.url, true, true).pathname.split('/').join(path.sep);
            // Check if file exists. If not, will return the 404 'Not Found'.
            if (!fs.existsSync(filename)) {
                this.sendResponse(response, 404, null, null);
                return null;
            }
            var responseHeaders = {};
            var stat = fs.statSync(filename);
            var rangeRequest = this.readRangeHeader(request.headers['range'], stat.size);


            // If 'Range' header exists, we will parse it with Regular Expression.
            if (rangeRequest == null) {
                responseHeaders['Content-Type'] = this.getMimeNameFromExt(path.extname(filename));
                responseHeaders['Content-Length'] = stat.size;  // File size.
                responseHeaders['Accept-Ranges'] = 'bytes';

                //  If not, will return file directly.
                this.sendResponse(response, 200, responseHeaders, fs.createReadStream(filename));
                return null;
            }

            var start = rangeRequest.Start;
            var end = rangeRequest.End;

            // If the range can't be fulfilled.
            if (start >= stat.size || end >= stat.size) {
                // Indicate the acceptable range.
                responseHeaders['Content-Range'] = 'bytes */' + stat.size; // File size.

                // Return the 416 'Requested Range Not Satisfiable'.
                this.sendResponse(response, 416, responseHeaders, null);
                return null;
            }


            responseHeaders['Content-Range'] = 'bytes ' + start + '-' + end + '/' + stat.size;
            responseHeaders['Content-Length'] = start === end ? 0 : (end - start + 1);
            responseHeaders['Content-Type'] = this.getMimeNameFromExt(path.extname(filename));
            responseHeaders['Accept-Ranges'] = 'bytes';
            responseHeaders['Cache-Control'] = 'no-cache';

            // Return the 206 'Partial Content'.
            this.sendResponse(response, 206, responseHeaders, fs.createReadStream(filename, {start: start, end: end}));
        });
    }
    sendResponse(response, responseStatus, responseHeaders, readable) {
        response.writeHead(responseStatus, responseHeaders);

        if (readable == null)
            response.end();
        else{
            readable.on('open', function () {
                readable.pipe(response);
            });
        }
        return null;
    }
    getMimeNameFromExt(ext) {
        var result = mimeNames[ext.toLowerCase()];

        // It's better to give a default value.
        if (result == null)
            result = 'application/octet-stream';

        return result;
    }
    readRangeHeader(range, totalLength) {

        if (range == null || range.length === 0)
            return null;

        var array = range.split(/bytes=([0-9]*)-([0-9]*)/);
        var start = parseInt(array[1]);
        var end = parseInt(array[2]);
        var result = {
            Start: isNaN(start) ? 0 : start,
            End: isNaN(end) ? (totalLength - 1) : end
        };

        if (!isNaN(start) && isNaN(end)) {
            result.Start = start;
            result.End = totalLength - 1;
        }

        if (isNaN(start) && !isNaN(end)) {
            result.Start = totalLength - end;
            result.End = totalLength - 1;
        }

        return result;
    }



    middleware() {
        this.app.use(bodyParser.json({ limit: '50mb' }));
        this.app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
        // enable cors middleware
        const options = {
            allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
            credentials: true,
            methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
            origin: "*",
            preflightContinue: false
        };
        this.app.use(cors(options));
        this.app.options("*", cors(options));
    }
    static bootstrap() {
        return new Server();
    }
    createApp() {
        this.app = express();
    };
    createServer() {
        this.server = http.createServer(this.app);
    }
    listen() {
        this.server.listen(port, () => {
            console.log('Running server on port', port);
        });
    }
}
// let server =
Server.bootstrap();





