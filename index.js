var spdxExpressionValidate = require('spdx-expression-validate')

module.exports = function (metadata) {
  if (typeof metadata !== 'object') throw new Error('argument must be an object')

  var singular = metadata.license
  var plural = metadata.licenses

  if (singular && plural) return false

  if (singular) {
    if (isValidExpression(singular)) return singular
    if (isOneElementArray(singular)) {
      if (isValidExpression(singular[0])) return singular[0]
    }
    return false
  }

  if (plural) {
    if (isValidExpression(plural)) return plural
    if (isOneElementArray(plural)) {
      var first = plural[0]
      if (isValidExpression(first)) return first
      if (typeof first === 'object') {
        if (isValidExpression(first.type)) return first.type
      }
    }
    return false
  }

  return false
}

function isValidExpression (argument) {
  return typeof argument === 'string' && spdxExpressionValidate(argument)
}

function isOneElementArray (argument) {
  return Array.isArray(argument) && argument.length === 1
}
