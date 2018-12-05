import * as fse from 'fs-extra';
import * as path from 'path';

function deleteRemovedFiles(directory: string, newFiles: any, previousFiles: any) {
  // get all files that are not in the new filesystem and are still existing
  const filesToDelete = Object.keys(previousFiles)
    .filter(filename => !newFiles[filename]);

  // delete each of these files
  return Promise.all(filesToDelete.map((filename: string) => {
    return fse.unlink(path.join(directory, filename));
  }));
}

export default async function writeFileTree(dir: string, files: any, previousFiles: any) {
  if (process.env.VUE_CLI_SKIP_WRITE) {
    return;
  }
  if (previousFiles) {
    await deleteRemovedFiles(dir, files, previousFiles);
  }
  Object.keys(files).forEach((name) => {
    const filePath = path.join(dir, name);
    fse.ensureDirSync(path.dirname(filePath));
    fse.writeFileSync(filePath, files[name]);
  });
}
