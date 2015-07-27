/** @namespace */
j = {};

j.version = '0.1.0';

/**
 * return the type of a variable
 *
 * @function j.type
 * @param {*} a - a variable
 * @return {string}
 */
j.type = function(a) {
  if(Object.prototype.toString.call(a) === '[object Array]') {
    return 'array';
  }

  return typeof a;
}

/**
 * Is the variable defined
 *
 * @function j.isDefined
 * @param {*} a - a variable
 * @return {boolean}
 */
j.isDefined = function(a) {
  return j.type(a) !== 'undefined';
}

/**
 * Check if an object is empty. e.g. {}
 *
 * @function j.isEmpty
 * @param {object} obj
 * @return {boolean}
 */
j.isEmpty = function(obj) {
  var size = j.size(obj);

  return size == 0;
}

/**
 * Get the size of the object.
 *
 * @function j.size
 * @param {object} obj
 * @return {number}
 */
j.size = function(obj) {
  var size = 0, key;

  for(key in obj) {
    if(obj.hasOwnProperty(key)) {
      size++;
    }
  }

  return size; 
}

/**
 * Is the value in the array
 *
 * @function j.inArray
 * @param {array} array
 * @param {string|number} value - value to check if in array
 * @return {boolean}
 */
j.inArray = function(array,value) {
  if(j.type(array) !== 'array') {
    throw new Error('Argument '+ arguments[0] +' must be of type `array`');
  }

  return array.indexOf(value) > -1;
}


/**
 * Diff two objects and return a new object with the differences.
 *
 * @function j.diff
 * @param {object} a - an object
 * @param {object} b - object to compare against
 * @param {array} ignore - array of keys to ignore
 * @return {object}
 */
j.diff = function(a,b,ignore) {
  var obj = {};
 
  if(_.isEmpty(a)) {
    return b;
  }

  for(var k in a) {
    // skip keys in the ignore array
    if(j.isDefined(ignore)) {
      if(j.inArray(ignore,k)) {
        continue;
      }
    }

    if(j.isDefined(a[k])) {
      if(!j.isDefined(b[k])) {
        obj[k] = null;
      } else if(j.type(a[k]) !== j.type(b[k])) { // if types don't match update immediatly
        obj[k] = b[k];
      } else {
        switch(j.type(a[k])) {
          case 'array':
            if(a[k].length !== b[k].length && j.isDefined(b[k])) {
              obj[k] = b[k];
            }
            break;
          case 'object':
            var new_obj = j.diff(a[k],b[k]);
            if(!j.isEmpty(new_obj)) {
              obj[k] = new_obj;
            }
            break;
          case 'function':
            break;
          case 'number':
          case 'string':
          default:
            if(a[k] !== b[k] && j.isDefined(b[k])) {
              obj[k] = b[k];
            }
        }
      }
    }
  }
  
  // if object b >= a iterate over b to make sure we didn't miss any data.
  if(j.size(b) >= j.size(a)) {
    for(var k in b) {
      if(!j.isDefined(obj[k])) {
        obj[k] = b[k];
      }
    }
  }

  return obj;
}