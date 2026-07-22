const express = require('express');
const app = express();
app.use(express.json());
app.post('/echo', (req, res) => {
  res.json({ body: req.body, headers: req.headers });
});
app.listen(9999, () => console.log('Express test server on 9999'));
