import express from 'express';
import cors from 'cors';
import {sendRequestToRabbitMQ} from "./rabbitmqClient.js";

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true
}));

app.post('/api/send', async (req, res) => {
  try {
    const response = await sendRequestToRabbitMQ(req.body);
    res.json({ response });
  } catch (error) {
    console.error("Failed to communicate with RabbitMQ:", error);
    res.status(500).json({ error: 'Failed to communicate with RabbitMQ' });
  }
});
app.listen(5000, () => {
  console.log('Server is running on port 5000' );
});
