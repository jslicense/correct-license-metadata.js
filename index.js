var spdxExpressionValidate = require('spdx-expression-validate')

module.exports = function (metadata) {
  if (typeof metadata !== 'object') throw new Error('argument must be an object')

  var singular = metadata.license
  var plural = metadata.licenses

  if (singular && plural) return false

  var firstElement

  if (singular) {
    if (isValidExpression(singular)) return singular
    if (isOneElementArray(singular)) {
      if (isValidExpression(singular[0])) return singular[0]
    }
    if (isOneElementArray(singular)) {
      firstElement = singular[0]
      if (isValidExpression(firstElement)) return firstElement
      if (typeof firstElement === 'object') {
        if (isValidExpression(firstElement.type)) return firstElement.type
      }
    }
    return false
  }

  if (plural) {
    if (isValidExpression(plural)) return plural
    if (isOneElementArray(plural)) {
      firstElement = plural[0]
      if (isValidExpression(firstElement)) return firstElement
      if (typeof firstElement === 'object') {
        if (isValidExpression(firstElement.type)) return firstElement.type
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
