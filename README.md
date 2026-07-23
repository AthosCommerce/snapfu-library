# Snapfu Library
This repository contains files utilized by Snapfu to build and patch Snap projects. Files are organized by organization and framework.

## Structure
The repository is organized by organization at the top level:

```
{organization}/
    {framework}/
        components/
        patches/
        customPatches/
```

Currently supported organizations: `athos`, `searchspring`  
Currently supported frameworks: `preact`

## Components
Snapfu will read the contents of the framework directory utilized by the project (eg. `{organization}/preact`) to make a listing of available components to use for the various features it provides.

Available component types:
- **recommendation** — recommendation templates (`standard`, `bundle`, `email`) each with one or more variants
- **badge** — badge overlay templates

For example, when using `snapfu recs init` on a preact project, the components found within the library (`{organization}/preact/components/recommendation`) will be available as options when initializing. Note: when `snapfu` copies the component files over, it will rename any files found to match the template name.

## Patches
See [PATCHES.md](./PATCHES.md) file for documentation.

## Custom Patches
Custom patches are one-off maintenance operations that can be applied to projects outside of the normal version-based patch flow. These are located in `{organization}/{framework}/customPatches/` and are identified by name rather than version.

## Development
The easiest way to develop and test the library is to do so with `snapfu`. This process is also the easiest way to develop `snapfu` with new component and patch file functionality.

The library repository will be cloned into the current users home directory in `~/.athoscommerce/snapfu-library` when it is first used (eg. `snapfu recs init`). From here, checkout a new branch, and proceed to development or experimentation. All `snapfu` commands needing the library will now utilize the branch you are modifying, allowing you to apply local patch files to local projects.
