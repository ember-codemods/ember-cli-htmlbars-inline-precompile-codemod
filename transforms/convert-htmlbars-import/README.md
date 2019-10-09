# convert-htmlbars-import


## Usage

```
npx ember-cli-htmlbars-inline-precompile-codemod path/of/files/ or/some**/*glob.js

# or

yarn global add ember-cli-htmlbars-inline-precompile-codemod
ember-cli-htmlbars-inline-precompile-codemod path/of/files/ or/some**/*
```

## Input / Output

<!--FIXTURES_TOC_START-->
* [convert-htmlbars-import](#convert-htmlbars-import)
<!--FIXTURES_TOC_END-->

<!--FIXTURES_CONTENT_START-->
---
<a id="convert-htmlbars-import">**convert-htmlbars-import**</a>

**Input** (<small>[convert-htmlbars-import.input.js](transforms/convert-htmlbars-import/__testfixtures__/convert-htmlbars-import.input.js)</small>):
```js
import hbs from 'htmlbars-inline-precompile';

```

**Output** (<small>[convert-htmlbars-import.output.js](transforms/convert-htmlbars-import/__testfixtures__/convert-htmlbars-import.output.js)</small>):
```js
import { hbs } from 'ember-cli-htmlbars';

```
<!--FIXTURES_CONTENT_END-->
