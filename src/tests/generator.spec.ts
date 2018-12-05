import Generator from '../modifier/generator';
import * as fse from 'fs-extra'

// describe('calculate', () => {
//   it('add', () => {
//     const result = Calculator.Sum(5, 2);
//     expect(result).toBe(7);
//   });

//   it('substract', () => {
//     const result = Calculator.Difference(5, 2);
//     expect(result).toBe(3);
//   });
// });

describe('generator', () => {
  it('extend package.json', async () => {
    const isTestOrDebug = process.env.VUE_CLI_TEST || process.env.VUE_CLI_DEBUG;
    const createCompleteCbs = [];
    const generator = new Generator('/', {
      pkg: { foo: 1 },
      plugins: [{
        id: 'test',
        apply: api => {
          api.extendPackage(pkg => ({
            foo: pkg.foo + 1
          }))
        }
      }]
    })
    await generator.generate()

    const pkg = JSON.parse(fse.readFileSync('/package.json', 'utf-8'))
    expect(pkg).toEqual({
      foo: 2
    })
  });
});
