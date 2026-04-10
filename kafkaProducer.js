const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "midas",
  brokers: ["localhost:9092"]
});

const producer = kafka.producer();

async function sendTransaction(transaction) {
  await producer.connect();

  await producer.send({
    topic: "transactions",
    messages: [{ value: JSON.stringify(transaction) }]
  });

  await producer.disconnect();
}

module.exports = { sendTransaction };