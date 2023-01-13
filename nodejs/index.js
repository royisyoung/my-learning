// const http = require('node:http');

// const hostname = '127.0.0.1';
// const port = 3000;

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Hello, World!\n');
// });

// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });


const fs = require('fs');
// 创建可读流
const readerStream = fs.createReadStream('./package.json');
// 创建可写流
const writerStream = fs.createWriteStream('./test.txt');
// 设置编码为utf8
readerStream.pipe(writerStream);
console.log('执行完毕');