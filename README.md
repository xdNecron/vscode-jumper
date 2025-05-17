# Jumper

Jumper is a search-and-jump navigation tool for VS Code, heavily inspired by [avy](https://github.com/abo-abo/avy). Its primarly goal is to provide better text navigation solution for Vim Emulation plugin users. It is not meant to be used as a search tool alternative and will never strive to become one.

## Installation

Download the `vsix` file from the latest release and run the following command in the download directory:
```shell
code --install-extension jumper-<version-number>.vsix
```

## Features

Jumper's one and only feature is its search prompt, which is by default mapped to `Shift+Space`. Any character can be inserted inside the prompt with the sole exception of `.` which Jumper reserves as its special character.

> As of current version, Jumper will look for search results in text that was visible during search prompt initiation.

On submitting the search prompt, Jumper will move the cursor to beginning of the first occurence of the search prompt.

If a number `n` preceded by `.` is provided at the end of the prompt, Jumper will jump to `n`-th occurence of the given prompt. In case `n` is larger than the number of occurences, Jumper will jump to the last occurence. The last occurence of the `.n` sequence is evaluated, allowing the user to adjust the target position quicker. In case of a "trailing dot" Jumper will jump to the first occurence of the prompt.

Here are examples of three prompts and their evaluations:
- `hello` and `hello.` will provide the same result;
- `hello.3.5.6` will jump to 6th occurence of `hello`;
- `hello.5.2.` will jump to the first occurence of `hello`.

## Extension Settings

The default keybind for `jumper.searchBuffer` can be changed in keybind settings.

## Release Notes

### 1.0.1

#### Changelog

- Fixed broken decoration rendering when scrolled down in text and line 1 (or 0) is not visible.

### 1.0.0

Initial release of Jumper.

## Contact

[GitHub repo](https://github.com/xdNecron/vscode-jumper)
