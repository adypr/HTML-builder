const fsp = require('fs/promises');
const path = require('path');

const bunlePath = path.join(__dirname, 'project-dist', 'bundle.css');

const renderStyles = async (folder) => {
  await fsp.writeFile(bunlePath, '');
  const arr = await fsp.readdir(folder);
  arr.map(async (file) => {
    const filePath = path.join(folder, file);
    if (path.parse(filePath).ext !== '.css') return;
    const fromFile = await fsp.open(filePath);
    for await (const chunk of fromFile.createReadStream()) {
      await fsp.appendFile(bunlePath, chunk).then(fsp.appendFile(bunlePath, '\n'));
    }
    await fromFile.close();
  });
    
};

renderStyles(path.join(__dirname, 'styles'));