// import extendJSConfig from './extendJSConfig'
// import stringifyJS from './stringifyJS'
import * as merge from 'deepmerge';
import * as _ from 'lodash';

const mergeArrayWithDedupe = (a: any[], b: any[]) => Array.from(new Set([...a, ...b]));
const mergeOptions = {
  arrayMerge: mergeArrayWithDedupe,
};

export interface ITransformReadOptions {
  source: any;
}
export interface ITransformWriteOptions {
  value: any;
  existing: any;
}

const transformJSON = {
  read: ({ source }: ITransformReadOptions) => JSON.parse(source),
  write: ({ value, existing }: ITransformWriteOptions) => {
    return JSON.stringify(merge(existing, value, mergeOptions), null, 2);
  },
};

const transformYAML = {
  read: ({ source }: ITransformReadOptions) => require('js-yaml').safeLoad(source),
  write: ({ value, existing }: ITransformWriteOptions) => {
    return require('js-yaml').safeDump(merge(existing, value, mergeOptions), {
      skipInvalid: true,
    });
  },
};

const transformLines = {
  read: ({ source }: ITransformReadOptions) => source.split('\n'),
  write: (options: ITransformWriteOptions) => {
    // tslint:disable-next-line:prefer-const
    let { value, existing } = options;
    if (existing) {
      value = existing.concat(value);
      // Dedupe
      value = value.filter((item: any, index: number) => value.indexOf(item) === index);
    }
    return value.join('\n');
  },
};

export default {
  json: transformJSON,
  yaml: transformYAML,
  lines: transformLines,
} as { [key: string]: any };
