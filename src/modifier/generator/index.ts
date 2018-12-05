import normalizeFilePaths from '../utils/normalizeFilePaths';
import ConfigTransform from '../transformer/ConfigTransform';
import writeFileTree from '../utils/writeFileTree';
// import injectImportsAndOptions from '../utils/injectImportsAndOptions'

export interface IGeneratorOptions {
  pkg: any;
  plugins: any;
  completeCbs?: any[];
  files?: any;
  invoking?: boolean;
}

const ensureEOL = (str: string) => {
  if (str.charAt(str.length - 1) !== '\n') {
    return `${str}\n`;
  }
  return str;
};

const defaultConfigTransforms = {
  babel: new ConfigTransform({
    file: {
      js: ['babel.config.js'],
    },
  }),
  postcss: new ConfigTransform({
    file: {
      js: ['postcss.config.js'],
      json: ['.postcssrc.json', '.postcssrc'],
      yaml: ['.postcssrc.yaml', '.postcssrc.yml'],
    },
  }),
  eslintConfig: new ConfigTransform({
    file: {
      js: ['.eslintrc.js'],
      json: ['.eslintrc', '.eslintrc.json'],
      yaml: ['.eslintrc.yaml', '.eslintrc.yml'],
    },
  }),
  jest: new ConfigTransform({
    file: {
      js: ['jest.config.js'],
    },
  }),
  browserslist: new ConfigTransform({
    file: {
      lines: ['.browserslistrc'],
    },
  }),
};
const reservedConfigTransforms = {
  vue: new ConfigTransform({
    file: {
      js: ['vue.config.js'],
    },
  }),
};

export default class Generator {
  pkg: any;
  originalPkg: any;
  context: any;
  files: { [key: string]: string };
  fileMiddlewares: any[];
  postProcessFilesCbs: any[];
  configTransforms: any;
  constructor(context: any, {
    pkg = {},
    plugins = [],
    completeCbs = [],
    files = {},
    invoking = false,
  }: IGeneratorOptions) {
    this.context = context;
    this.pkg = {
      ...pkg,
    };
    this.originalPkg = pkg;
    this.files = files;
    this.configTransforms = {};

    this.fileMiddlewares = [];
    this.postProcessFilesCbs = [];

    plugins.forEach(({ id, apply, options }) => {
      const api = new GeneratorAPI(id, this, options, rootOptions)
      apply(api, options, rootOptions, invoking)
    })
  }

  async generate({
    checkExisting = false,
  } = {}) {
    // save the file system before applying plugin for comparison
    const initialFiles = { ...this.files };
    // extract configs from package.json into dedicated files.
    this.extractConfigFiles(checkExisting);
    // wait for file resolve
    await this.resolveFiles();
    // set package.json
    // this.sortPkg();
    // this.files['package.json'] = JSON.stringify(this.pkg, null, 2) + '\n';
    // write/update file tree to disk
    await writeFileTree(this.context, this.files, initialFiles);
  }

  extractConfigFiles(checkExisting: boolean) {
    const configTransforms = {
      ...defaultConfigTransforms,
      ...this.configTransforms,
      ...reservedConfigTransforms,
    };
    const extract = (key: string) => {
      if (
        configTransforms[key] &&
        this.pkg[key] &&
        // do not extract if the field exists in original package.json
        !this.originalPkg[key]
      ) {
        const value = this.pkg[key];
        const configTransform = configTransforms[key];
        const res = configTransform.transform(
          value,
          checkExisting,
          this.files,
          this.context,
        );
        const { content, filename } = res;
        this.files[filename] = ensureEOL(content);
        delete this.pkg[key];
      }
    };
    // 提取package.json中的内容到
    for (const key in this.pkg) {
      extract(key);
    }
  }

  async resolveFiles() {
    const files = this.files;
    for (const middleware of this.fileMiddlewares) {
      // await middleware(files, ejs.render);
    }

    // normalize file paths on windows
    // all paths are converted to use / instead of \
    normalizeFilePaths(files);

    for (const postProcess of this.postProcessFilesCbs) {
      await postProcess(files);
    }
  }
}
