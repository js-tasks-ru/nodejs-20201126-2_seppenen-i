function sum(a, b) {

  if (typeof(a) !== 'number') {
    throw new TypeError('first argument is not a number: ' + a); 
  }

  if (typeof(b) !== 'number') {
    throw new TypeError('second argument is not a number: ' + b); 
  }

  return a + b;
}

module.exports = sum;
