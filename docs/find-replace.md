# Find & Replace in Files
This document describes how to utilize the `find-replace` file action.

## Changes
After providing the file selector, `action` and `changes` are then specified - for find and replace the `action` is "find-replace". The `changes` property is an array of modifications to make to the file. 

### `replace`
Each modification expects a `pattern` key containing a regex string to find, and a `replacement` key containing the string value to replace if a match was found.

The following example would replace `snapfu-template-preact` with `snapfu-scaffold-preact` in the `package.json` file and `from '@searchspring/snap-preact-components'` with `from '@searchspring/snap-preact/components'` in the `src/components/Autocomplete.jsx` file

```yaml
steps:
    - files:
        package.json:
            action: find-replace
            changes:
                - replace: 
                    pattern: 'snapfu-template-preact'
                    replacement: 'snapfu-scaffold-preact'
         src/components/Autocomplete.jsx:
            action: find-replace
            changes:
                - replace: 
                    pattern: from '@searchspring\/snap-preact-components'
                    replacement: from '@searchspring/snap-preact/components'
```
