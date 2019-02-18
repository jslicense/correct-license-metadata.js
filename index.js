var spdxExpressionValidate = require('spdx-expression-validate')

module.exports = function (metadata) {
  if (typeof metadata !== 'object') throw new Error('argument must be an object')

  var singular = metadata.license
  var plural = metadata.licenses

  if (singular && plural) return false

  var firstElement
  var unambiguous

  if (singular) {
    if (isValidExpression(singular)) return singular
    unambiguous = getUnambiguousCorrection(singular)
    if (unambiguous) return unambiguous
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

function getUnambiguousCorrection (argument) {
  if (argument === 'Apache, Version 2.0') return 'Apache-2.0'
  if (argument === 'Apache License, Version 2.0') return 'Apache-2.0'
  if (argument === 'Apache 2.0') return 'Apache-2.0'
  if (argument === 'Apache 2') return 'Apache-2.0'
  if (argument === 'Apache v2') return 'Apache-2.0'
  if (argument === 'MIT/X11') return 'MIT'
  if (argument === 'LGPL 3') return 'LGPL-3.0'
  return false
}

function isValidExpression (argument) {
  return typeof argument === 'string' && spdxExpressionValidate(argument)
}

function isOneElementArray (argument) {
  return Array.isArray(argument) && argument.length === 1
}
