const { getParser } = require('codemod-cli').jscodeshift;

module.exports = function transformer(file, api) {
  const j = getParser(api);
  const root = j(file.source);

  writeImportStatement(j, root);

  return root.toSource({ quote: 'single' });
};

function writeImportStatement(j, root) {
  let body = root.get().value.program.body;

  // finding all 'htmlbars-inline-precompile' import statements
  const inlinePrecompileImportStatement = root.find(j.ImportDeclaration, {
    source: {
      value: 'htmlbars-inline-precompile',
    },
  });

  // if any imports from 'htmlbars-inline-precompile' exists, remove it and replace with a new import
  if (inlinePrecompileImportStatement.length !== 0) {
    inlinePrecompileImportStatement.remove();

    // setting up 'hbs' as an identifier for import statement
    const hbs = 'hbs';
    const hbsAsIdentifier = j.identifier(hbs);
    const variableId = j.importSpecifier(hbsAsIdentifier);

    // finding all 'ember-cli-htmlbars' import statements
    const emberCliImportStatement = root.find(j.ImportDeclaration, {
      source: {
        value: 'ember-cli-htmlbars',
      },
    });

    // if no imports from 'ember-cli-htmlbars' exists, write import { hbs } from 'ember-cli-htmlbars';
    if (emberCliImportStatement.length === 0) {
      const importStatement = j.importDeclaration([variableId], j.literal('ember-cli-htmlbars'));
      body.unshift(importStatement);
    }
    // if any imports from 'ember-cli-htmlbars' already exists, include hbs
    else {
      let existingSpecifiers = emberCliImportStatement.get('specifiers');
      if (existingSpecifiers.filter(exSp => exSp.value.imported.name === hbs).length === 0) {
        existingSpecifiers.push(variableId);
      }
    }
  }
}
