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
      replaceImports(j, root, importStatement);
    }
  });
}

function replaceImports(j, root, oldImport) {
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

  // if no imports from 'ember-cli-htmlbars' exists, write a new import delcaration;
  if (emberCliImportStatement.length === 0) {
    createNewImport(j, root, variableId);
  }
  // if any imports from 'ember-cli-htmlbars' exist
  else {
    let existingSpecifiers = emberCliImportStatement.get('specifiers');

    // if 'hbs' is already being imported from 'ember-cli-htmlbars', write a new import declaration
    if (existingSpecifiers.filter(exSp => exSp.value.imported.name.includes('hbs')).length > 0) {
      createNewImport(j, root, variableId);
    }
    // otherwise, add hbs import to existing 'ember-cli-htmlbars' import declaration
    else {
      existingSpecifiers.push(variableId);
    }
  }
}

function createNewImport(j, root, variableId, importLiteral = 'ember-cli-htmlbars') {
  let body = root.get().value.program.body;

  // write a new import delcaration
  const importStatement = j.importDeclaration([variableId], j.literal(importLiteral));
  body.unshift(importStatement);
}
