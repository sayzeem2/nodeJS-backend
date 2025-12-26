const fs = require('fs');
const path = require('path');

const http = require('http');//required to make connections to server----imports the http module in the file

// const server = http.createServer((req, res) => {
//     res.writeHead(200, { 'content-type': 'text/plain' });
//     res.end('Hello World');
// })
// const server = http.createServer((req, res) => {
//     if (req.url == '/') {
//         res.writeHead(200, { 'content-type': 'text/html' });
//         res.end('<h1>Welcome to home page</h1>');
//     } else if (req.url == '/about') {
//         res.writeHead(200, { 'content-type': 'text/html' });
//         res.end('<h1>Welcome to about page</h1><p>this is a basic web server example</p>');
//     } else {
//         res.writeHead(404, { 'content-type': 'text/html' });
//         res.end('<h1>404 Page not found</h1><p>this is a basic web server example</p>');
//     }
// })

const server = http.createServer((req, res) => {
    let filepath = '.' + req.url;
    if (filepath == './') {
        filepath = './index.html';
    }
    const extName = path.extname(filepath);
    let contentType = 'text/html';
    switch (extName) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.png':
            contentType = 'image/png';
            break;
    }
    fs.readFile(filepath, (err, content) => {
        if (err) {
            res.writeHead(404);
            res.end('File Not Found');
        } else {
            res.writeHead(200, { 'content-type': contentType });
            res.end(content, 'utf-8');
        }
    })
})


server.listen(3000, () => {
    console.log('server running at http://localhost:3000/');
})