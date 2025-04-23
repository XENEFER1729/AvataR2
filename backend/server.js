const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

mongoose.connect("mongodb+srv://projectavatar196:avatar362@a1.9jwvun6.mongodb.net/", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

.then(() => console.log(' MongoDB connected'))
.catch(err => console.error(' MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('Hello from Express + MongoDB!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
