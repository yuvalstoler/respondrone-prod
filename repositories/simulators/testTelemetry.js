"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require('path');
const request = require('request');
const WebSocket = require('ws');

const url_drones = "ws://141.226.94.241:4701";
const url_frs = "ws://141.226.94.241:4702";
const url_gimbals = "ws://141.226.94.241:4703";


class Server
{
    /*ws_drones;
    ws_frs;
    ws_gimbals;*/

    constructor() {
        this.port = 4800;
        this.createApp();
        this.createServer();
        this.middleware();
        this.listen();
        this.routes()

        this.startWS('ws_drones', url_drones);
        this.startWS('ws_frs', url_frs);
        this.startWS('ws_gimbals', url_gimbals);
    }
    static bootstrap() {
        return new Server();
    }
    //===================         Configure Express middleware.      ====================
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
    // Configure API endpoints.
    // ==================================================================================
    startWS(socketClientStr, url) {
        this[socketClientStr] = new WebSocket(url);
        this[socketClientStr].on('open', () => {
            console.log(url, 'client | connected');
        });

        this[socketClientStr].on('error',  (err) => {
            console.log(url, 'client | error', err);
        });

        this[socketClientStr].on('close',  (err) => {
            console.log(url, 'client | disconnected', err);
            setTimeout(() => {
                this.startWS(socketClientStr, url);
            }, 3000);
        });
    }
    // --------------------------------------------
    routes() {
        this.app.use('/Drones_Tel', (req,res) => {
            this.ws_drones.send(JSON.stringify(req.body));
            res.send({status: "success"})
        });

        this.app.use('/FRs_Tel', (req,res) => {
            this.ws_frs.send(JSON.stringify(req.body));
            res.send({status: "success"})
        });

        this.app.use('/Gimbals_Tel', (req,res) => {
            this.ws_gimbals.send(JSON.stringify(req.body));
            res.send({status: "success"})
        });

    }
    // --------------------------------------------
    createApp() {
        this.app = express();
    };
    createServer() {
        this.server = http.createServer(this.app);
    }
    listen() {
        this.server.listen(this.port, () => {
            console.log('Running server on port ', this.port);
        });
    }

    // ---------------------------------------------
    request_(reqBody, url, cb) {
        let reqObj = {
            url: url,
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: reqBody,
            json: true
        }
        request(reqObj, (error, response, body) => {
            if (error) {
                cb({error: error})
            } else {
                try {
                    cb(body)
                } catch (e) {
                    cb({error: e.message})
                }
            }
        })
    }
}
// let server =
Server.bootstrap();
