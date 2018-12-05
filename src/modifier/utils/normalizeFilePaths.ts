import slash from 'slash';

export default function normalizeFilePaths(files: { [key: string]: string }) {
  Object.keys(files).forEach((file) => {
    const normalized = slash(file);
    if (file !== normalized) {
      files[normalized] = files[file];
      delete files[file];
    }
  });
  return files;
}
