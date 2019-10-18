const { getParser } = require('codemod-cli').jscodeshift;

module.exports = function transformer(file, api) {
  const j = getParser(api);
  const root = j(file.source);

  const importsToReplace = ['htmlbars-inline-precompile', 'ember-cli-htmlbars-inline-precompile'];

  writeImportStatement(j, root, importsToReplace);

  return root.toSource({ quote: 'single' });
};

function writeImportStatement(j, root, importsToReplace) {
  importsToReplace.forEach(i => {
    // find import statement
    const importStatement = root.find(j.ImportDeclaration, {
      source: {
        value: i,
      },
    });

    // if import statement exists, remove it and replace with a new import
    if (importStatement.length !== 0) {
      replaceWithNewImport(j, root, importStatement);
    }
  });
}

function replaceWithNewImport(j, root, oldImport) {
  let body = root.get().value.program.body;

  // setting up new import information
  let namedIdentifier = oldImport.find(j.Identifier).get(0).node.name;
  if (namedIdentifier !== 'hbs') {
    namedIdentifier = `hbs as ${namedIdentifier}`;
  }
  const identifier = j.identifier(namedIdentifier);
  const variableId = j.importSpecifier(identifier);

  // remove unwanted import
  oldImport.remove();

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
