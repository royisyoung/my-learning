class Generator {
  constructor() {
    this.buff = '';
  }

  space() {
    this.buff += ' ';
  }

  nextLine() {
    this.buff += '\n';
  }

  leftParenthesis() {
    this.buff += '(';
  }

  rightParenthesis() {
    this.buff += ')';
  }

  leftCurlyBrace() {
    this.buff += '{';
  }

  rightCurlyBrace() {
    this.buff += '}';
  }

  setIndent(deep, indent = ' ') {
    if (!deep) return;
    this.buff += new Array(deep).fill(indent).join('');
  }

  indent() {
    this.buff += '  ';
  }

  semicolon() {
    this.buff += ';';
  }

  splicingNodes(nodes, indent) {
    nodes.forEach((node, index) => {
      this.setNextLine(node, nodes[index - 1]);
      this[node.type](node, indent);
    });
  }

  splicingDeclarations(declarations) {
    declarations.forEach((declaration, index) => {
      if (index !== 0) {
          this.buff += ',';
        }
        this[declaration.type](declaration);
      });
  }

  splicingArguments(args) {
    args.forEach((args, index) => {
      if (index !== 0) {
        this.buff += ', ';
      }
      this[args.type](args);
    });
  }

  setNextLine(node, prevNode) {
    if (!prevNode) return;
    const diffLineNum = node.loc.start.line - prevNode.loc.end.line;
    if (diffLineNum > 0) {
      this.buff += new Array(diffLineNum).fill('\n');
    }
  }


  // arguments(arr) {
  //   this.buff += arr.map((i) => i.name).join(', ');
  // }

  File(node) {
    this.Program(node.program);
  }

  Program(node) {
    // node.body.forEach((node) => {
    //   this[node.type](node) + ';';
    //   this.nextLine();
    // });
    this.splicingNodes(node.body);
  }

  VariableDeclaration(node) {
    this.buff += node.kind; // eg: const / let
    this.space();
    // node.declarations.forEach((declaration, index) => {
    // if (index !== 0) {
    //     this.buff += ',';
    //   }
    //   this[declaration.type](declaration);
    // });
    this.splicingDeclarations(node.declarations);
    this.semicolon();
  }

  VariableDeclarator(node) {
    this[node.id.type](node.id);
    this.buff += ' = ';
    this[node.init.type](node.init);
  }

  ArrowFunctionExpression(node) {
    if (node.async) {
      this.buff += 'async '
    }
    this.leftParenthesis();
    this.splicingArguments(node.params);
    this.rightParenthesis();
    this.buff += ' => ';
    this.leftCurlyBrace();
    this.nextLine();
    this[node.body.type](node.body);
    this.nextLine();
    this.rightCurlyBrace();
  }

  FunctionExpression(node) {
    if (node.async) {
      this.buff += 'async '
    }
    this.buff += 'function';
    this.space();
    this.leftParenthesis();
    this.splicingArguments(node.params);
    this.rightParenthesis();
    this.space();
    this.leftCurlyBrace();
    this.nextLine();
    this[node.body.type](node.body);
    this.nextLine();
    this.rightCurlyBrace();
  }

  BlockStatement(node, deep = 0) {
    // node.directives.forEach((directive, index) => {
    //   if (index !== 0) {
    //     this.nextLine();
    //   }
    //   this.indent();
    //   this[directive.type](directive);
    // });
    if (deep) {
      deep += 1;
    }
    this.splicingNodes(node.directives, deep);
    // node.body.forEach((subNode, index) => {
    //   if (index !== 0) {
    //     this.nextLine();
    //   }
    //   this.indent();
    //   this[subNode.type](subNode);
    // });
    this.splicingNodes(node.body, deep);
  }

  DirectiveLiteral(node) {
    this.buff += node.raw;
  }

  ForStatement(node) {
    this.buff += 'for';
    this.space();
    this.leftParenthesis();
    this[node.init.type](node.init);
    this.space();
    this[node.test.type](node.test);
    this.semicolon();
    this.space();
    this[node.update.type](node.update);
    this.rightParenthesis();
    this.space();
    this.leftCurlyBrace();
    this.nextLine();
    // this.indent();
    this[node.body.type](node.body);
    this.nextLine();
    // this.indent();
    this.rightCurlyBrace();
  }

  BinaryExpression(node) {
    this[node.left.type](node.left);
    this.space();
    this.buff += node.operator;
    this.space();
    this[node.right.type](node.right);
  }

  UpdateExpression(node) {
    if (node.prefix) {
      this.buff += node.operator;
      this[node.argument.type](node.argument);
    } else {
      this[node.argument.type](node.argument);
      this.buff += node.operator;
    }
  }

  TemplateLiteral(node) {
    this.buff += '`';
    node.quasis.forEach((templateElement, index) => {
      this[templateElement.type](templateElement);
      const expression = node.expressions[index];
      if (expression) {
        this.buff += '${';
        this[expression.type](expression);
        this.buff += '}';
      }
    });
    this.buff += '`';
    this.semicolon();
  }

  TemplateElement(node) {
    this.buff += node.value.raw;
  }

  ExpressionStatement(node) {
    this[node.expression.type](node.expression);
    this.semicolon();
  }

  CallExpression(node) {
    this[node.callee.type](node.callee);
    this.leftParenthesis();
    node.arguments.forEach((arg, index) => {
      if (index !== 0) {
        this.buff += ', ';
      }
      this[arg.type](arg);
    });
    this.rightParenthesis();
  }

  MemberExpression(node) {
    this[node.object.type](node.object);
    // computed
    if (node.computed) {
      this.buff += '[';
      this[node.property.type](node.property);
      this.buff += ']';
    } else {
      this.buff += '.';
      this[node.property.type](node.property);
    }
  }

  Identifier(node) {
    this.buff += node.name;
  }

  Literal(node) {
    this.buff += node.raw;
  }

  StringLiteral(node) {
    // this.buff += node.extra.raw;
    // how to create an empty string by stringLiteral?
    this.buff += !node.extra && node.value === '' ? `''` : node.extra.raw;
  }

  NumericLiteral(node) {
    this.buff += node.extra.raw;
  }

  generate(node) {
    this[node.type](node);
    return this.buff;
  }
}

module.exports = function (node) {
  return new Generator().generate(node);
};
