"use strict";

const assert = require("assert");
const { dirname } = require("path");
const { parse } = require("babylon");
const { transformFromAst } = require("babel-core");
const {
  findNearestPackageJsonSync: findPackage
} = require("find-nearest-package-json");

const isValidModule = mod => mod instanceof module.__proto__.constructor;

class QuotedCode {
  constructor({ code, ast }) {
    this.code = code;
    this.ast = ast;
    Object.seal(this);
  }
  toString() {
    return transformFromAst(this.ast, this.code).code;
  }
}

const parseFunctionAsExpression = fn => {
  const code = `(\n${fn}\n)`;
  const ast = parse(code, {
    // For source maps, make parser ignore the opening paren
    startLine: 1
  });
  return { code, ast };
};

class MacroModule {
  constructor({ rootModule }) {
    assert(
      isValidModule(rootModule),
      "pass a Module object to the macro package constructor " +
        '(use the "module" pseudovariable)'
    );
    this.rootModule = rootModule;
    const nearestPackageJson = findPackage(rootModule.filename);
    this.packagePath = dirname(nearestPackageJson.path);
    Object.seal(this);
  }
  quote(fn) {
    assert(typeof fn === "function", "quote() always takes a function");
    const { ast, code } = parseFunctionAsExpression(fn);
    assert(ast.program.body[0].type === "ExpressionStatement");
    return new QuotedCode({ ast, code });
  }
}

module.exports = rootModule => {
  return new MacroModule({ rootModule });
};
