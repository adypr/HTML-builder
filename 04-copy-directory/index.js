const fsp = require('fs/promises');
const path = require('path');

const filesCopy = path.join(__dirname, 'files-copy');

fsp.rm(filesCopy, {recursive: true})
  .then(() => fsp.mkdir(filesCopy))
  .catch(() => fsp.mkdir(filesCopy))
  .then(() => copyFiles(path.join(__dirname, 'files'), filesCopy))
  .catch(() => copyFiles(path.join(__dirname, 'files'), filesCopy));

const copyFiles = async (folder) => {
  const arr = await fsp.readdir(folder);
  arr.map(async (file) => {
    const filePath = path.join(folder, file);
    await fsp.copyFile(filePath, path.join(filesCopy, file));
  });
};
