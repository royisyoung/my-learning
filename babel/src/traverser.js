function traverser(ast, visitor) {
  function traverseArray(arr, parent) {
    arr.forEach((node) => {
      traverseNode(node, parent);
    });
  }

  function traverseNode(node, parent) {
    let methods = null;
    try {
      methods = visitor[node.type];
    } catch (error) {
      throw new TypeError('Cannot read node.type, and parent type is' + parent.type);
    }

    if (typeof methods === 'function') {
      methods = {
        enter: methods,
      };
    }
    if (methods && methods.enter) {
      methods.enter(node, parent);
    }
    switch (node.type) {
      case 'File':
        traverseNode(node.program, node);
        break;
      case 'Program':
      case 'BlockStatement':
        traverseArray(node.body, node);
        break;
      case 'ArrowFunctionExpression':
        traverseArray(node.params, node);
        traverseNode(node.body, node);
        break;
      case 'ForStatement':
        traverseNode(node.init, node);
        traverseNode(node.test, node);
        traverseNode(node.update, node);
        traverseNode(node.body, node);
        break;
      case 'ExpressionStatement':
        traverseNode(node.expression, node);
        break;
      case 'UpdateExpression':
        traverseNode(node.argument, node);
        break;
      case 'VariableDeclaration':
        traverseArray(node.declarations, node);
        break;
      case 'VariableDeclarator':
        traverseNode(node.id, node);
        traverseNode(node.init, node);
        break;
      case 'TemplateLiteral':
        traverseArray(node.quasis, node);
        traverseArray(node.quasis, node);
        break;
      case 'BinaryExpression':
        traverseNode(node.left, node);
        traverseNode(node.right, node);
        break;
      case 'CallExpression':
        traverseNode(node.callee, node);
        traverseArray(node.arguments, node);
        break;
      case 'MemberExpression':
        traverseNode(node.object, node);
        traverseNode(node.property, node);
        break;
      case 'TemplateElement':
      case 'Identifier':
      case 'Literal':
      case 'StringLiteral':
      case 'NumericLiteral':
        break; // do nothing
      default:
        throw new TypeError(parent.type + ' => ' + node.type);
    }

    if (methods && methods.exit) {
      methods.exit(node, parent);
    }
  }

  traverseNode(ast, null);
}

module.exports = traverser;
