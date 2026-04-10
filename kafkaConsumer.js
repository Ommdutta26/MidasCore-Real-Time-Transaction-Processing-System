const { Kafka } = require("kafkajs");
const db = require("./database");
const redis = require("./redisClient");
const { broadcast } = require("./websocket");

const kafka = new Kafka({
  clientId: "midas",
  brokers: ["localhost:9092"]
});

const consumer = kafka.consumer({ groupId: "transaction-group" });

async function startConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: "transactions" });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const tx = JSON.parse(message.value.toString());

      const senderBalance = await redis.get(tx.sender);
      const receiverBalance = await redis.get(tx.receiver);

      if (senderBalance < tx.amount) {
        console.log("Transaction rejected");
        return;
      }

      await redis.set(tx.sender, senderBalance - tx.amount);
      await redis.set(tx.receiver, Number(receiverBalance) + tx.amount);

      db.run(
        "INSERT INTO transactions(sender,receiver,amount) VALUES(?,?,?)",
        [tx.sender, tx.receiver, tx.amount]
      );

      broadcast(tx);
    }
  });
}

module.exports = { startConsumer };