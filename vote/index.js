var Hapi = require("hapi");
const getenv = require("getenv");

var server = new Hapi.Server({
    host: getenv("HTTP_HOST", "localhost"),
    port:getenv.int("HTTP_PORT", 3000) 
});

const Inert = require("inert");
const redis = require("redis");


var redisHost = getenv("REDIS_HOST", "127.0.0.1");
var redisPort = getenv.int("REDIS_PORT", 6379);
var redisClient = redis.createClient(redisPort, redisHost);

redisClient.on("connect", function() {
    console.log("Connected to " + redisHost + " on port " + redisPort);
});

// Register plugin
server.register(Inert)
    .then((() => {
        server.route({
            method: "GET",
            path: "/",
            handler: function (request, reply) {
                return reply.file("./public/vote.html");
            }
        });
        
        server.route({
            method: "GET",
            path: "/pie.jpg",
            handler: function(request, reply) {
                return reply.file("./public/pie.jpg");
            }
        });
        
        server.route({
            method: "GET",
            path: "/cake.jpg",
            handler: function(request, reply) {
                return reply.file("./public/cake.jpg")
            }
        });
        
        server.route({
            method: "GET",
            path: "/cake",
            handler: function (request, reply) {
                 redisClient.rpush(["votes","cake"], function(err, reply) {
                    console.log("Added " + reply + " votes to redis!");
                 });
                return "Thank you for your vote!";
            }    
        });
        
        server.route({
            method: "GET",
            path: "/pie",
            handler: function (request, reply) {
                 redisClient.rpush(["votes","pie"], function(err, reply) {
                    console.log("Added " + reply + " votes to redis!");
                 });
                return "Thank you for your vote!";
            }    
        });

        return server.start();
    }))
    .then(() => {
        console.log("Server running at: ", server.info.uri);
    });