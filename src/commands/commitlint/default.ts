export const brief = 'commitlint cli';
export const description = 'commitlint cli for init';

export const subcommands = [
  {
    name: 'init',
    alias: 'i',
    brief: 'Init commitlint file',
  },
  {
    name: 'test',
    aliases: ['t'],
    brief: 'Test commitlint work well',
  },
];
