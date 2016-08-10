module.exports = {
  'String': function(a) {
    return (typeof a === 'string');
  }, 

  'Int': function(a) {
    return (typeof a === 'number' && a === Math.floor(a));
  } 
}
