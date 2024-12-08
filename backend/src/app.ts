import express from 'express';
import cors from 'cors';
import {sendRequestToRabbitMQ} from "./rabbitmqClient.js";

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());


app.post('/api/send', async (req, res) => {
  console.log(req.body);
  const { text } = req.body;
  try {
    const response = await sendRequestToRabbitMQ(text);
    res.json({ response });
  } catch (error) {
    console.error("Failed to communicate with RabbitMQ:", error);
    res.status(500).json({ error: 'Failed to communicate with RabbitMQ' });
  }
});
app.listen(5002, () => {
  console.log('Server is running on port 5002' );
});
