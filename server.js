const path = require('path');
const express = require('express');
const app = express();

const PORT = process.env.PORT || 8003;

app.use(express.static(path.resolve(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Serving application on port ${PORT}`);
});
