import 'source-map-support/register';

import { Command, command, metadata } from 'clime';
import * as fse from 'fs-extra';
import * as path from 'path';
import { exec } from '../../utils/child-process-promise';

@command({
  description: 'This is a command that init commitfile in current directory',
})
export default class extends Command {
  @metadata
  async execute() {
    await Promise.all([
      fse.copy(
        path.join(__dirname, './template/commitlint.config.js'),
        'commitlint.config.js',
      ),
      , fse.copy(
        path.join(__dirname, './template/husky.config.js'),
        'husky.config.js',
      ),
    ]);
    await exec('npm install --save-dev husky @commitlint/cli');

    return 'keke';

    // throw new ExpectedError(`Language "${lang}" is not supported`);
  }
}
