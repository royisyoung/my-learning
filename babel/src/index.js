const fs = require('fs');
const path = require('path');
const { transformSync } = require('./core');
const t = require('@babel/types');

function getCode(codeFile) {
  return fs.readFileSync(codeFile).toString();
}
function writeCode(path, content) {
  fs.writeFileSync(path, content);
}

// read code
const code = getCode(path.resolve(__dirname, '../code.js'));


const concatStrNode = function(expressions) {
  let node = t.stringLiteral('');
  console.log(node);
  let i = 0;
  while(i < expressions.length) {
    // @ts-ignore
    node = t.callExpression(t.memberExpression(node, t.identifier('concat')), [expressions[i]]);
    i++;
  }
  return node;
}

// babel it
const options = {
  plugins: [
    // [
    //   function(api, options) {
    //     return {
    //       vistor: {
    //         Identifier: {
    //           enter: node => {
    //             node.name += 'Changed';
    //           }
    //         },
    //       }
    //     }
    //   },
    //   {}
    // ],
    // [
    //   function(api, options) {
    //     return {
    //       vistor: {
    //         Literal(node) {
    //           node.raw += options.annotation;
    //         },
    //         StringLiteral(node) {
    //           node.extra.raw += options.annotation;
    //         }
    //       }
    //     }
    //   },
    //   {
    //     annotation: ' // changed by bb',
    //   }
    // ],
    [
      function(api, options) {
        return {
          vistor: {
            TemplateLiteral(node, parent) {
              const newNode = concatStrNode(node.expressions);
              for (const key of Object.keys(parent)) {
                if (parent[key] === node) {
                  parent[key] = newNode;
                  return;
                }
              }
            },
            VariableDeclaration(node) {
              node.kind = 'var';
            },
            ArrowFunctionExpression(node, parent) {
              // function fun(limit) { var tt = 'b' }
              // console.log(t.functionExpression(t.identifier('fun'), [t.identifier('limit')], t.blockStatement([t.variableDeclaration('var', [t.variableDeclarator(t.identifier('tt'), t.stringLiteral('b'))])])))
              node.type === 'FunctionExpression'
            }
          }
        }
      }
    ]
  ]
};
const transformedCode = transformSync(code, options);
// putout
const distFileName = 'dist-code.js';
const distCodeFile = path.resolve(__dirname, `../${distFileName}`);
writeCode(distCodeFile, transformedCode);
