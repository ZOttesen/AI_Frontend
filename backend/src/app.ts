import express from 'express';
import cors from 'cors';
import {sendAnswerToRabbitMQ, sendRequestToRabbitMQ} from "./rabbitmqClient.js";
import {Answer, Message} from "./utility/types";

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());


app.post('/api/send', async (req, res) => {
  const { category, points, preferences}  = req.body;

const message: Message = {
    category: category,
    points: points,
    preferences: preferences
  };

  try {
    const response = await sendRequestToRabbitMQ(message);
    res.json({ response });
  } catch (error) {
    console.error("Failed to communicate with RabbitMQ:", error);
    res.status(500).json({ error: 'Failed to communicate with RabbitMQ' });
  }
});

app.post('/api/answer', async (req, res) => {
  const { answer, question, preferences}  = req.body;

  console.log("Answer received:", answer, question, preferences);

  const message: Answer = {
    answer: answer,
    question: question,
    preferences: preferences
  };

  try{
    const response = await sendAnswerToRabbitMQ(message);
    res.json({ response });
  }catch (error){
    console.error("Failed to communicate with RabbitMQ:", error);
    res.status(500).json({ error: 'Failed to communicate with RabbitMQ' });
  }
});


app.listen(5002, () => {
  console.log('Server is running on port 5002' );
});
