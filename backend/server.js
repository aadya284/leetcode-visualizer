require('dotenv').config();
const express = require('express');
const cors = require('cors');

const problemsRoutes = require('./routes/problems');
const executeRoutes = require('./routes/execute');

const app = express();
app.use(cors());
app.use(express.json());

app.use(problemsRoutes);
app.use(executeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`LeetVisual backend running on port ${PORT}`);
});
