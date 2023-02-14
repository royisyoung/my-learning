const Parser = require('@babel/parser');
const traverse = require('./traverser');
const generator = require('./generator')


const transformSync = function (code, options) {
  // parse
  const ast = Parser.parse(code);
  const vistors = {};
  options.plugins.forEach(([plugin, opts]) => {
    const res = plugin(null, opts);
    Object.assign(vistors, res.vistor);
  });
  // transform
  traverse(ast, vistors);
  // generate
  return generator(ast);
};

exports.transformSync = transformSync;