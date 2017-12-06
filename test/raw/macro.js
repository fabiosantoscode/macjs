"use strict";

const ok = require("assert");

const { quote, unquote } = require("../../lib/raw/macro")(module);

describe("raw/macro.js", () => {
  it("can quote a function", () => {
    ok.deepEqual(
      quote(x => {
        return x;
      }),
      quote(x => {
        return x;
      }),
      "two similar functions produce the same AST"
    );
    ok.equal(
      quote(x => x).ast.program.body[0].expression.type,
      "ArrowFunctionExpression"
    );
  });
  const quotedCode = quote(x => x);
  it("can unquote a function", () => {
    ok.equal(typeof quotedCode.toString(), "string");
    ok.equal(eval(quotedCode + "")(1), 1);
  });
});
