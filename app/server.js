const express = require('express');
// const connectDb = require('./config/db');

const app = express();

// CONNECT DATABASE
// connectDb();

// INIT MIDDLEWARE
app.use(express.json({ extended: false }));

app.get('/', (req, res) =>
  res.json({ msg: 'Welcome to the ContactKeeper API...' })
);

// DEFINE ROUTES

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
