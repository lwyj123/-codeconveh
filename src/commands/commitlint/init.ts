// tslint:disable:no-implicit-dependencies

import 'source-map-support/register';

import { Command, command, metadata } from 'clime';
import * as fse from 'fs-extra';

@command({
  description: 'This is a command that init commitfile in current directory',
})
export default class extends Command {
  @metadata
  async execute() {
    await fse.createFile('test.jeje');
    return 'keke';

    // throw new ExpectedError(`Language "${lang}" is not supported`);
  }
}
