const fs = require('fs');
const path = require('path');
const {stdin, stdout} = require('process');


const filePath = path.join(__dirname, 'text.txt' ); 
const stream = new fs.ReadStream(filePath);

stream.on('readable', () => {
    const data = stream.read();
    if (data !== null) stdout.write(data);
})

stream.on('error', (err) => {
    if (err) console.log('Ошибка выполнения программы:', err);
})

