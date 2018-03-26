'use strict'

function isUndefined (value) {
  return value === undefined
}

function isObject (value) {
  return value === Object(value)
}

function isArray (value) {
  return Array.isArray(value)
}

function isDate (value) {
  return value instanceof Date
}

function isBlob (value) {
  return value &&
    typeof value.size === 'number' &&
    typeof value.type === 'string' &&
    typeof value.slice === 'function'
}

function isFile (value) {
  return isBlob(value) &&
    (typeof value.lastModifiedDate === 'object' || typeof value.lastModified === 'number') &&
    typeof value.name === 'string'
}

function objectToFormData (obj, fd, pre) {
  fd = fd || new FormData()

  if (isUndefined(obj)) {
    return fd
  } else if (isArray(obj)) {
    obj.forEach(function (value) {
      var key = pre + '[]'

      objectToFormData(value, fd, key)
    })
  } else if (isDate(obj)) {
    fd.append(pre, obj.toISOString())
  } else if (isObject(obj) && !isDate(obj) && !isFile(obj)) {
    Object.keys(obj).forEach(function (prop) {
      var value = obj[prop]

      if (isArray(value)) {
        while (prop.length > 2 && prop.lastIndexOf('[]') === prop.length - 2) {
          prop = prop.substring(0, prop.length - 2)
        }
      }

      var key = pre ? (pre + '[' + prop + ']') : prop

      objectToFormData(value, fd, key)
    })
  } else {
    fd.append(pre, obj)
  }

  return fd
}

module.exports = objectToFormData
