

/*
const os=require('os');
var totalMemory=os.totalmem();
var freeMemory=os.freemem();


console.log(`Total memory: ${totalMemory}`);
console.log(`Free memory: ${freeMemory}`);
*/

const express = require('express');
const app = express();
//const port = 3000;

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}


app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));