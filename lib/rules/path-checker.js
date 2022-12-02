/**
 * @fileoverview path-checker
 * @author Ilya
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: null, // `problem`, `suggestion`, or `layout`
    docs: {
      description: "path-checker",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
  },

  create(context) {


    return {
      ImportDeclaration(node) {
        const importTo = node.source.value
        const currentFile = context.getFilename()

        context.report(node, "Неправильный импорт")
      }
    };
  },
};
