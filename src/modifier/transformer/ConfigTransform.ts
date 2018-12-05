import configTransforms from '../utils/configTransforms';
export interface IConfigTransformOptions {
  file: IFileDescriptor;
}
export interface IFileDescriptor {
  type: string;
  filename: string;
  [key: string]: string;
}

class ConfigTransform {
  fileDescriptor: IFileDescriptor;
  constructor(options: IConfigTransformOptions) {
    this.fileDescriptor = options.file;
  }

  transform(value: any, checkExisting: boolean, files: any, context: any) {
    let file;
    if (checkExisting) {
      file = this.findFile(files);
    }
    if (!file) {
      file = this.getDefaultFile();
    }
    const { type, filename } = file;

    const transform = configTransforms[type];

    let source;
    let existing;
    if (checkExisting) {
      source = files[filename];
      if (source) {
        existing = transform.read({
          source,
          filename,
          context,
        });
      }
    }

    const content = transform.write({
      source,
      filename,
      context,
      value,
      existing,
    });

    return {
      filename,
      content,
    };
  }

  findFile(files: any) {
    for (const type of Object.keys(this.fileDescriptor)) {
      const descriptors = this.fileDescriptor[type];
      for (const filename of descriptors) {
        if (files[filename]) {
          return { type, filename };
        }
      }
    }
    return;
  }

  getDefaultFile() {
    const [type] = Object.keys(this.fileDescriptor);
    const [filename] = this.fileDescriptor[type];
    return { type, filename };
  }
}

export default ConfigTransform;
