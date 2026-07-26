const express = require('express');
const cors = require('cors');
const incomeRoutes = require('./routes/incomeRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/income', incomeRoutes);
app.use('/api/expenses', expenseRoutes);

app.use(errorHandler);

module.exports = app;