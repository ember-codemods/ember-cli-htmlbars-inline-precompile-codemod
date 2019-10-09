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
    // setting up import information
    let namedIdentifier = inlinePrecompileImportStatement.find(j.Identifier).get(0).node.name;
    if (namedIdentifier !== 'hbs') {
      namedIdentifier = `hbs as ${namedIdentifier}`;
    }
    const identifier = j.identifier(namedIdentifier);
    const variableId = j.importSpecifier(identifier);

    // remove imports from 'htmlbars-inline-precompile'
    inlinePrecompileImportStatement.remove();

    // finding all 'ember-cli-htmlbars' import statements
    const emberCliImportStatement = root.find(j.ImportDeclaration, {
      source: {
        value: 'ember-cli-htmlbars',
      },
    });

    // if no imports from 'ember-cli-htmlbars' exists, write one;
    if (emberCliImportStatement.length === 0) {
      const importStatement = j.importDeclaration([variableId], j.literal('ember-cli-htmlbars'));
      body.unshift(importStatement);
    }
    // if any imports from 'ember-cli-htmlbars' already exists, include hbs
    else {
      let existingSpecifiers = emberCliImportStatement.get('specifiers');
      if (existingSpecifiers.filter(exSp => exSp.value.imported.name === 'hbs').length === 0) {
        existingSpecifiers.push(variableId);
      }
    }
  }
}
