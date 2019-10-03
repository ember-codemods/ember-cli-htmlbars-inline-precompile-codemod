const { getParser } = require('codemod-cli').jscodeshift;
const { addImportStatement, writeImportStatements } = require('../utils');
// const { getOptions } = require('codemod-cli');

module.exports = function transformer(file, api) {
  const j = getParser(api);

  const root = j(file.source);

  addImportStatement(['hbs']);
  writeImportStatements(j, root);

  return root.toSource({ quote: 'single' });
};
