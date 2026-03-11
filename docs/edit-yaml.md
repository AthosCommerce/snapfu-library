# Editing YAML Files
This document describes how to utilize the `edit-yaml` file action. 

Functionality, structure and usage is exactly the same as `edit-json` - but `edit-yaml` does different parsing in order to preserve comments. Specific YAML examples can be seen below.

## Changes
After providing the file selector, `action` and `changes` are then specified - for editing YAML fields the `action` is "edit-yaml". The `changes` property is an array of modifications to make to the file; available changes are shown below.

Each change allows for two different methods of accessing the property to modify: `properties` and `path`. When using `properties` you provide an object that defines the path and values. With `path` an optional `value` or `values` can be provided as needed. These are further explained below, and examples are provided.

### `remove`
To remove a key or an entry (or entries) within an array.

When using `properties`, the final key to remove should be inside an array. If the targeted property is an array, entries to be removed are specified. The following example would remove the "pull_request" trigger from the deploy workflow and remove all of the `steps` from the "Publish" job.
```yaml
steps:
    - files:
        .github/workflows/deploy.yml:
            action: edit-yaml
            changes:
                - remove:
                    properties: {
                        on: ['pull_request']
                    }
                - remove:
                    properties: {
                        jobs: {
                            Publish: ['steps']
                        }
                    }
```

When using `path`, the location of the property to alter is provided in an array format. If no `value` is provided, the property is removed. A `value` or `values` can be provided to specify removing specific values from an existing array. Using `path` also allows the specification of an array index within the path - making it easy to target properties of arrays.

The example below accomplishes the same as the example above, but using the `path` method.

```yaml
steps:
    - files:
        .github/workflows/deploy.yml:
            action: edit-yaml
            changes:
                - remove:
                    path: ['on']
                    value: 'pull_request'
                - remove:
                    path: ['jobs', 'Publish', 'steps']
```

### `update`
Update is used to add a new key/value, alter an existing property, or add to an array.

When using `properties`, the keys provided are updated, but any other keys and values within the objecte are preserved. This method allows for modifiying multipe properties utilizing a single update entry. This is useful when updating dependencies, as these can easily be copy/pasted into a new patch file. When altering an existing array using `properties`, the existing array will *always* be appended to.

The example below updates the "Publish" job by adding a new property `timeout-minutes` (keeping the rest of the properties in place), and adds a new step to the `steps` array.
```yaml
steps:
    - files:
        .github/workflows/deploy.yml:
            action: edit-yaml
            changes:
                - update:
                    properties: {
                        jobs: {
                            Publish: {
                                timeout-minutes: 10,
                                steps: [{
                                    name: New step,
                                    uses: some/action@v1
                                }]
                            }
                        }
                    }
```

Using the `path` method is more verbose, as each path and value must be specified in a separate `update` statement. The verboseness of this method does however provide more control; allowing specification on how to alter existing arrays by providing a `modifier` property. The `modifier` currently supports `set`, `append` and `prepend` - `set` is the default if none is provided and will set the property to the provided value (or values), replacing any existing value(s).

The example below accomplishes the same updates as the example above, but by utilizing the `path` method.

```yaml
steps:
    - files:
        .github/workflows/deploy.yml:
            action: edit-yaml
            changes:
                - update:
                    path: ['jobs', 'Publish', 'timeout-minutes']
                    value: 10

                - update:
                    path: ['jobs', 'Publish', 'steps']
                    modifier: 'append'
                    value:
                        name: New step
                        uses: some/action@v1
```

## Example modifying all `.yml` files
This example adds or modifies a `newKey` to every YAML file found in the project.
```yaml
steps:
    - files:
        '**/*.yml':
            action: edit-yaml
            changes:
                - update:
                    path: ['newKey']
                    value: 'newValue'
```

## Example removing the first step in deploy.yml by array index
This example takes advantage of the `path` method's ability to target an array entry via index position and remove it.
```yaml
steps:
    - files:
        .github/workflows/deploy.yml:
            action: edit-yaml
            changes:
                - remove:
                    path: ['jobs', 'Publish', 'steps', 0]
```