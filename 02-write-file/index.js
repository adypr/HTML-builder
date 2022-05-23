const {stdin, stdout, exit} = process;
const fs = require('fs');
const path = require('path');

const partingWords = 'Text typing finished. Have a good day!';


const stream = fs.createReadStream(path.join(__dirname, 'newfile.txt' ), 'utf-8');
stream.on('error', async () => {
  await fs.writeFile(path.join(__dirname, 'newfile.txt' ), '', (err) => {
    if (err) throw (err);
  });
});

stdout.write('Hi!\nPlease, type some text\nYour text will be written to a file newfile.txt\n');
stdin.on('data', (data) => {
  if (data.toString().slice(0, 4) === 'exit') {
    console.log(partingWords);
    exit();
  }
     
  fs.appendFile(path.join(__dirname, 'newfile.txt' ), data, (err) => {
    if (err) throw err;
    console.log('You can continue typing. For finish type \'exit\' or Ctrl + C');
  });
});

process.on('SIGINT', () => {
  console.log(partingWords);
  exit();
});