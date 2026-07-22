const http = require('http');
const server = http.createServer((req, res) => {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ body: body, headers: req.headers }));
  });
});
server.listen(9999, () => console.log('listening on 9999'));
