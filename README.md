# Jumper

Jumper is a search-and-jump navigation tool for VS Code, heavily inspired by [avy](https://github.com/abo-abo/avy). Its primarly goal is to provide better text navigation solution for Vim Emulation plugin users. It is not meant to be used as a search tool alternative and will never strive to become one.

## Installation

Install Jumper from the [VS Code Extension Marketplace](https://marketplace.visualstudio.com/items?itemName=rainfall.jumper) or download the `vsix` file from the latest release and run the following command in the download directory:

```shell
code --install-extension jumper-<version-number>.vsix
```

## Features

Jumper's one and only feature is its search prompt, which is by default mapped to `Shift`+`Space`. All characters are supported with the sole exception of `.` which Jumper reserves as its special character.

All the results will be highlighted with the currently active jump target having inverted colors. The first occurence is by default selected as the jump location. Each result has its own number representing its index in the results list.

You can change the jump location by adding a dot and a corresponding number at the end of the prompt, such as this:

```shell
hello.3
```

The third occurence of `hello` is now the jump target. Upon pressing `Enter` Jumper will move the cursor to the first character of the jump target.

Only the last dot-number combination is evaluated. Any text that comes *after* the dot will not be considered as a part of the search prompt. If a dot-number combination is not found in the prompt, Jumper will revert to its default behaviour (e.g. selecting the first occurence). In other words, cases such as `hello.` or `hello.world` will be evaluated using the default behaviour since they do not contained the whole combination.

## Extension Settings

The default keybind for `jumper.searchBuffer` can be modified in keybind settings.

## Release Notes

### 1.2.0

- Each result has its number shown next to it.

## Contact

[GitHub repo](https://github.com/xdNecron/vscode-jumper)
