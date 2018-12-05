import stringifyJS from './stringifyJS'
import recast from 'recast';

module.exports = function extendJSConfig(value: any, source: any) {

  let exportsIdentifier: string | null = null

  const ast = recast.parse(source)

  recast.types.visit(ast, {
    visitAssignmentExpression({ node }: any) {
      if (
        node.left.type === 'MemberExpression' &&
        node.left.object.name === 'module' &&
        node.left.property.name === 'exports'
      ) {
        if (node.right.type === 'ObjectExpression') {
          augmentExports(node.right)
        } else if (node.right.type === 'Identifier') {
          // do a second pass
          exportsIdentifier = node.right.name
        }
        return false
      }
    }
  })

  if (exportsIdentifier) {
    recast.types.visit(ast, {
      visitVariableDeclarator({ node }: any) {
        if (
          node.id.name === exportsIdentifier &&
          node.init.type === 'ObjectExpression'
        ) {
          augmentExports(node.init)
        }
        return false
      }
    })
  }

  function augmentExports(node: any) {
    const valueAST = recast.parse(`(${stringifyJS(value)})`)
    const props = valueAST.program.body[0].expression.properties
    const existingProps = node.properties
    for (const prop of props) {
      const existing = existingProps.findIndex((p: any) => {
        return !p.computed && p.key.name === prop.key.name
      })
      if (existing > -1) {
        // replace
        existingProps[existing].value = prop.value
      } else {
        // append
        existingProps.push(prop)
      }
    }
  }

  return recast.print(ast).code
}
