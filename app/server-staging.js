const express = require('express');
const app = express();
const cors = require('cors')
const path = require('path');
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')));
const { sequelize } = require('./models/index-staging');

const corsOpts = {
  origin: '*',

  methods: [
    'GET',
    'POST',
    'PATCH',
    'PUT',
    'DELETE'
  ],

  allowedHeaders: [
    'Content-Type',
  ],
};
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
app.use(cors(corsOpts));

// Settings
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rutas
app.use(require('./routes'));

app.listen(PORT, function () {
  console.log(`Example app listening on http://localhost:${PORT}`);

  sequelize.authenticate().then(() => {
      console.log('Database konnek');
  })
});