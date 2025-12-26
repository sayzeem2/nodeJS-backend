//============================================================================
// //common js
// const module = require('moduleName');
// //es6
// import module from "moduleName";

// const fs = require('fs');

// const data = fs.readFileSync('file.txt', 'utf8');
// console.log(data);

// fs.readFile('file.txt', 'utf8', (error, data) => {
//     if (error) throw Error;
//     console.log(data);
// })

// fs.writeFileSync('new.txt', 'Hello, NodeJS')

//============================================================================
// const os = require('os');

// if (os.platform() == 'win32') {
//     console.log('You Are Running On Windows',os.cpus());
// }
//============================================================================
// const EventEmitter = require('events');
// const emitter = new EventEmitter();

// emitter.on('greet', (name) => {
//     console.log(`hello, ${name}`);
// })

// emitter.emit('greet', 'raj');
// emitter.emit('greet', 'zee');

// const fs = require('fs');
// const readStream = fs.createReadStream('file.txt', 'utf8');
// const writeStream = fs.createWriteStream('copy.txt');
// readStream.on('open', () => {
//     console.log("reading started");
// })
// readStream.on('data', (chunk) => {
//     console.log(`Read chunk (${chunk.length} chars):`, chunk.slice(0, 50) + '...');
// })
// readStream.on('end', () => {
//     console.log("reading ended");
// })

// writeStream.on('open', () => {
//     console.log("writing started");
// })

// writeStream.on('finish', () => {
//     console.log("writing finished");
// })

// readStream.pipe(writeStream);

// const a = Buffer.from('Hello');
// console.log(a);
// console.log(a.toString())

// const b = Buffer.from([0x41, 0x42, 0x43]);
// console.log(b.toString());     // ABC

// // Allocate zero-filled buffer
// const zero = Buffer.alloc(8);
// console.log(zero);             // <Buffer 00 00 00 00 00 00 00 00>

// // Allocate unsafe (faster but may contain old memory)
// const fast = Buffer.allocUnsafe(8);
// console.log(fast);