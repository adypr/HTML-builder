const fsp = require('fs/promises');
const path = require('path');

const filesCopy = path.join(__dirname, 'files-copy');

fsp.rm(filesCopy, {recursive: true, force: true})
  .then(() => fsp.mkdir(filesCopy))
  .then(() => copyFiles(path.join(__dirname, 'files'), filesCopy));

const copyFiles = async (srcFolder, distFolder) => {
  const arr = await fsp.readdir(srcFolder);
  arr.map(async (file) => {
    const fileInfo = await fsp.stat(path.join(srcFolder, file));
    if (fileInfo.isDirectory()) {
      console.log(distFolder);
      await fsp.mkdir(path.join(distFolder, file));
      return copyFiles(path.join(srcFolder, file), path.join(distFolder, file));
    }
    const filePath = path.join(srcFolder, file);
    await fsp.copyFile(filePath, path.join(distFolder, file));
  });
};
