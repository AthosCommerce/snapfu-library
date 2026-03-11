# Snapfu Patches
This repository contains patch files utilized by Snapfu to update Snap projects. Patch files are ordered by framework and version and currently only support application within a Unix enviroment.

Patch versions are automatically created when a new version of Snap is released - this is done within the Snap monorepo repository.

## Patch Version Files
All files with the version directory will be copied into the project's `./patch` directory during patch application. Subsequent patch version applications will clear this directory to prevent contamination.

Valid patch file names (where `framework` and `version` match the directory structure the file is part of) and will be executed in this order:
`maintenance.{framework}.{version}.yml`
`maintenance.{framework}.snap.{version}.yml` (only if project distribution is not templates)
`maintenance.{framework}.snapTemplates.{version}.yml` (only if project distribution is templates)
`patch.{framework}.{version}.yml` 


## Patch File Structure
The patch files used by Snapfu utilize a specific YAML structure to execute commands and make modifications to files within a project.

To learn more about the available options please see the [patch file options](./docs/patches.md) readme.

## Development
The easiest way to develop and test patches is to do so with `Snapfu`. This process is also the easiest way to develop `Snapfu` with new patch file functionality.

Make sure you have `Snapfu` installed and then run `snapfu patch fetch`. The patches repository will be cloned into the current users home directory in `~/.searchspring/snapfu-patches`. From here, checkout a new branch, and proceed do patch development or experimentation. All `snapfu` `patch` commands will now utilize the branch you are modifying allowing you to apply local patch files to local projects.