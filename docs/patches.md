# Snapfu Patch Files
This document describes how to leverage various features available within a Snapfu patch file. Snapfu patch files can be used to:
* run commands
* modify files

## YAML
Each patch descriptor file is a YAML file that describes the changes to be made to a project. These files must be parsable by a YAML parser. A simple change to package dependencies can be seen below:
```yaml
version: 0.40.0
description: 'updating snap dependencies to version 0.40.0'

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
                        }
                    }
```

## Version
The version property details which version the patch is part of. Valid patch versions are:  
`[0-9].[0-9].[0-9]`

## Description
The description describes the changes being made.

## Steps
These are the steps to take when applying the patch. Any number of steps can be defined and are run sequentially.

### Step type `run`
Various commands can be executed using the `run` step. These commands assume that the patches are being applied within a Unix enviroment.

In most cases this command would be used to copy over new files, remove existing files or rename files. The commands used here expect a Unix environment of some sort. Commonly utilized commands might include the `cp`, `mv` and `rm` commands.

The example below modifies the `.gitignore` file by appending two new lines.

```yaml
steps:
    # add a line to .gitignore to ignore future patch files
    - run: |
            echo '\n\n# ignore patch\npatch' >> .gitignore
```

### Step type `files`
File manipulation currently supports modification of both JSON and YAML files, with plans to allow for more generic file editing (find/replace) in the future.

All files that are to be edited are keys within the `files` property. These should be relative paths to the project being patched. File paths can utilize globs to apply changes to multiple files.

```
- files:
    'package.json': { ... }
    'tests/cypress.json': { ... }
    '**/*.js': { ... }
```

Each file specified must then specify an `action` and associated action descriptors to describe the changes to be made to the file. Each `action` type has a different set of possible secondary actions or `changes` available to use for file manipulation.  

* [`edit-json`](./edit-json.md)
* [`edit-yaml`](./edit-yaml.md)

Additional glob documentaion:  
https://github.com/isaacs/node-glob#readme

## Examples
See the patches in this repository for additional examples of these options in use.