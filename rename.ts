const { join, extname, basename } = require('path');
const { readdirSync, renameSync } = require('fs');

const renamePacks = () => {
  const path = './src/assets/coco-icon-outline/';
  for (const oldFile of readdirSync(path)) {
    const extension = extname(oldFile);
    const name = basename(oldFile, extension);
    // const renamedSplit = name.split('Property 2=');

    const newName = name.toLowerCase().replaceAll(' ', '');
    renameSync(join(path, oldFile), join(path, newName + extension));
    // if (renamedSplit.length > 1) {
    // }
  }
};

renamePacks();
