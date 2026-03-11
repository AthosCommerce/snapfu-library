# Snapfu Library
This repository contains files utilized by Snapfu to build and patch Snap projects.

https://github.com/searchspring/snapfu  
https://www.npmjs.com/package/snapfu

## Components
Snapfu will read the contents of framework directory utilized by the project (eg. `preact`) to make a listing of available components to use for the various features it provides. For example, when using `snapfu recs init` on a preact project, the components found within the library (`./preact/components/recommendation`) will be available as options when initializing. Note: when `snapfu` copies the component files over, it will rename any files found to match the template name.

## Patches
Patches are currently pulled from the patches repository, but this will be pulled into the library soon!
https://github.com/searchspring/snapfu-patches

## Development
The easiest way to develop and test the library is to do so with `snapfu`. This process is also the easiest way to develop `snapfu` with new component and patch file functionality.

The library repository will be cloned into the current users home directory in `~/.searchspring/snapfu-library` when it is first used (eg. `snapfu recs init`). From here, checkout a new branch, and proceed do development or experimentation. All `snapfu` commands needing the library will now utilize the branch you are modifying, allowing you to apply local patch files to local projects.
