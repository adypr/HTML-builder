const fsp = require('fs/promises');
const path = require('path');
const pathName = path.join(__dirname, 'secret-folder');

console.log('Note: File sizes are calculated in binary');
fsp.readdir(pathName).then(fileNames => {
  fileNames.map(async (file) => {
    const fileName = path.join(pathName, file);
    const isDirectory = await fsp.stat(fileName).then(path => path.isDirectory());
    const fileInfo = path.parse(fileName);
    let fileSize;
    await fsp.stat(fileName).then(file => fileSize = file.size / 1024);
    if (!isDirectory) console.log(`${fileInfo.name} - ${fileInfo.ext.slice(1)} - ${fileSize}kb`);
  });
});
                    