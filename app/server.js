const express = require('express');
const app = express();
const cors = require('cors')
const path = require('path');
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')));
const { sequelize } = require('./models/index');

// Settings
const PORT = process.env.PORT || 9001;

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