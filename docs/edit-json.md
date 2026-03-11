# Editing JSON Files
This document describes how to utilize the `edit-json` file action.

## Changes
After providing the file selector, `action` and `changes` are then specified - for editing JSON fields the `action` is "edit-json". The `changes` property is an array of modifications to make to the file; available changes are shown below.

Each change allows for two different methods of accessing the property to modify: `properties` and `path`. When using `properties` you provide an object that defines the path and values. With `path` an optional `value` or `values` can be provided as needed. These are further explained below and examples are provided.

### `remove`
To remove a key or an entry (or entries) within an array.

When using `properties`, the final key to remove should be inside an array. If the targeted property is an array, entries to be removed are specified. The following example would remove Snap dependencies and remove the `all` array entry within `searchspring.tags`.
```yaml
steps:
    - files:
        package.json:
            action: edit-json
            changes:
                - remove:
                        properties: {
                            dependencies: ['@searchspring/snap-preact', '@searchspring/snap-preact-components'],
                            searchspring: {
                                updates: ['all']
                            }
                        }
```

When using `path`, the location of the property to alter is provided in an array format. If no `value` is provided the property is removed. A `value` or `values` can be provided to specify removing specific values from an existing array. Using `path` also allows the specification of an array index within the path - making it easy to target properties of arrays.

The example below accomplishes the same as the example above, but using the `path` method.

```yaml
steps:
    - files:
        package.json:
            action: edit-json
            changes:
                - remove:
                        path: ['dependencies', '@searchspring/snap-preact']
                - remove:
                        path: ['dependencies', '@searchspring/snap-preact-components']
                - remove:
                        path: ['searchspring', 'updates']
                        value: 'all'
```

### `update`
Update is used to add a new key/value, alter an existing property, or add to an array.

When using `properties`, the keys provided are updated, but any other keys and values within the objecte are preserved. This method allows for modifiying multipe properties utilizing a single update entry. This is useful when updating dependencies, as these can easily be copy/pasted into a new patch file. When altering an existing array using `properties`, the existing array will *always* be appended to.

The example below updates the Snap dependencies (keeping the rest of the dependencies in place) and adds two new tags to the `searchspring.tags` property.
```yaml
steps:
    - files:
        package.json:
            action: edit-json
            changes:
                - update:
                    properties: {
                        dependencies: {
                            "@searchspring/snap-preact": "^0.40.0",
                            "@searchspring/snap-preact-components": "^0.40.0",
                        },
                        searchspring: {
                            tags: ['updated', 'patched']
                        }
                    }
```

Using the `path` method is more verbose, as each path and value must be specified in a separate `update` statement. The verboseness of this method does however provide more control; allowing specification on how to alter existing arrays by providing a `modifier` property. The `modifier` currently supports `set`, `append` and `prepend` - `set` is the default if none is provided and will set the property to the provided value (or values), replacing any existing value(s).

The example below accomplishes the same updates as the example above, but by utilizing the `path` method.

```yaml
steps:
    - files:
        package.json:
            action: edit-json
            changes:
                - update:
                    path: ['dependencies', '@searchspring/snap-preact']
                    value: '^0.40.0'
                - update:
                    path: ['dependencies', '@searchspring/snap-preact-components']
                    value: '^0.40.0'
                - update:
                    path: ['searchspring', 'tags']
                    values: ['updated', 'patched']
                    modifier: 'append'
```

## Example modifying all `.json` files
This example adds or modifies a `newKey` to every JSON file found in the project.
```yaml
steps:
    - files:
        '**/*.json':
            action: edit-json
            changes:
                - update:
                    path: ['newKey']
                    value: 'newValue'
```

## Example removing the first tag by array index
This example takes advantage of the `path` method's ability to target an array entry via index position and remove it.
```yaml
steps:
    - files:
        package.json:
            action: edit-json
            changes:
                - remove:
                    path: ['searchspring', 'tags', 0]
```

### `move`
To move a key or an entry (or rename).

This action does not support `properties` usage.

When using `path`, the location of the property to alter is provided in an array format. If no `newPath` is provided the action will do nothing. If the `newPath` already exists, the action will do nothing unless a modifier is provided. There are two supported modifiers that can be used when we want to deal with an existing `newPath`: `merge` and `replace`. When `merge` is used, we will attempt to merge the original object with the existing one. When `replace` is used, we will overwrite the existing entry.

The example below will move (essentially rename) `searchspring.template` -> `searchspring.scaffold`.

```yaml
steps:
    - files:
        package.json:
            action: edit-json
            changes:
                - move:
                    path: ['searchspring', 'template']
                    newPath: ['searchspring', 'scaffold']
```