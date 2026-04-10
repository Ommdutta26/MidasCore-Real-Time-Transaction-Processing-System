const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const redis = require("./redisClient");
const { sendTransaction } = require("./kafkaProducer");
const { startConsumer } = require("./kafkaConsumer");
const websocket = require("./websocket");

const app = express();
const server = http.createServer(app);

app.use(bodyParser.json());

websocket.init(server);

startConsumer();

/* create user */

app.post("/user", async (req, res) => {
  const { name, balance } = req.body;

  await redis.set(name, balance);

  res.send("User created");
});

/* send transaction */

app.post("/transaction", async (req, res) => {
  await sendTransaction(req.body);

  res.send("Transaction queued");
});

/* check balance */

app.get("/balance/:name", async (req, res) => {
  const balance = await redis.get(req.params.name);

  res.send({ balance });
});

server.listen(3000, () => {
  console.log("Midas Core running");
});