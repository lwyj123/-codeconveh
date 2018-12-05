import stringify from 'javascript-stringify'
export default function stringifyJS(value: string) {
  return stringify(value, (val: any, indent: any, stringify: any) => {
    if (val && val.__expression) {
      return val.__expression
    }
    return stringify(val)
  }, 2)
}
