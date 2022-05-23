const fsp = require('fs/promises');
const path = require('path');


fsp.rm(path.join(__dirname, 'project-dist'), {recursive: true, force: true})
  .then(() => fsp.mkdir(path.join(__dirname, 'project-dist')))
  .then(() => renderHtml())
  .then((data) => fsp.writeFile(path.join(__dirname, 'project-dist', 'index.html'), data))
  .then(() => renderStyles(path.join(__dirname, 'styles')))
  .then(() => fsp.mkdir(path.join(__dirname, 'project-dist', 'assets')))
  .then(() => copyFiles(path.join(__dirname, 'assets'), filesCopy));


// Render HTML

const renderHtml = async () => {
  let content = await fsp.readFile(path.join(__dirname, 'template.html'));
  let components = await fsp.readdir(path.join(__dirname, 'components'));
  content = content.toString();
  let resStr = components.map(async (component) => {
    const componentContent = await fsp.readFile(path.join(__dirname, 'components', component), 'utf8');
    content = content.replace(`{{${path.parse(component).name}}}`, componentContent.toString());
    return content;
  });
  await Promise.all(resStr);
  return  content.toString();
};


// Render styles

const bunlePath = path.join(__dirname, 'project-dist', 'style.css');

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


// Copy assets

const filesCopy = path.join(__dirname, 'project-dist', 'assets');

const copyFiles = async (srcFolder, distFolder) => {
  const arr = await fsp.readdir(srcFolder);
  arr.map(async (file) => {
    const fileInfo = await fsp.stat(path.join(srcFolder, file));
    if (fileInfo.isDirectory()) {
      await fsp.mkdir(path.join(distFolder, file));
      return copyFiles(path.join(srcFolder, file), path.join(distFolder, file));
    }
    const filePath = path.join(srcFolder, file);
    await fsp.copyFile(filePath, path.join(distFolder, file));
  });
};
