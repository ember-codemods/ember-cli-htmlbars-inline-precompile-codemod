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
* [non-standard-imported-name](#non-standard-imported-name)
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
---
<a id="non-standard-imported-name">**non-standard-imported-name**</a>

**Input** (<small>[non-standard-imported-name.input.js](transforms/convert-htmlbars-import/__testfixtures__/non-standard-imported-name.input.js)</small>):
```js
import h from 'htmlbars-inline-precompile';

```

**Output** (<small>[non-standard-imported-name.output.js](transforms/convert-htmlbars-import/__testfixtures__/non-standard-imported-name.output.js)</small>):
```js
import { hbs as h } from 'ember-cli-htmlbars';

```
<!--FIXTURES_CONTENT_END-->
