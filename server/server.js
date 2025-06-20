const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;

// Allow frontend origin
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-frontend.onrender.com'],
  credentials: true
}));
app.use(express.json());

//MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ MongoDB connected');
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});


// stock API routes
app.use('/api/stock', require('./routes/stockRoutes'));
// authorization routes
app.use('/api/auth', require('./routes/authRoutes'));

app.get('/', (req, res) => {
  res.send('Stock Visualizer API is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
