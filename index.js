const { readFileSync } = require('fs')
const { dirname, resolve } = require('path')

const Datauri = require('datauri')
const isBinaryPath = require('is-binary-path')

const getInlinedString = file => {
  const data = readFileSync(file)
  if (isBinaryPath(file)) {
    return new Datauri().format(file, data).content
  } else {
    return data.toString('utf8')
  }
}

module.exports = ({ types }) => ({
  visitor: {
    CallExpression (path, state) {
      if (!types.isIdentifier(path.node.callee, { name: '__inline' })) return
      if (path.node.arguments.length !== 1) return

      const argument = path.node.arguments[0]
      if (!types.isStringLiteral(argument)) return

      const file = resolve(dirname(state.file.opts.filename), argument.value)
      try {
        const inlinedString = getInlinedString(file)
        path.replaceWith(types.stringLiteral(inlinedString))
      } catch (err) {
        throw path.buildCodeFrameError(`Cannot inline ${file}: ${err.message}`)
      }
    }
  }
})
