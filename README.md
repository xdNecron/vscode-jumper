# Jumper

Jumper is a search-and-jump navigation tool for VS Code, heavily inspired by [avy](https://github.com/abo-abo/avy).

## Philosophy

My one and only goal with Jumper is to create a solution which would allow quick navigation around the screen by *jumping* around words. Jumper is not meant to replace any search tools and will never aim to do so.

## Installation

Install Jumper from the [VS Code Extension Marketplace](https://marketplace.visualstudio.com/items?itemName=rainfall.jumper) or download the `vsix` file from the latest release and run the following command in the download directory:

```shell
code --install-extension jumper-<version-number>.vsix
```

## Features

You can open Jumper's search prompt using the default shortcut `Shift` `Space`.

Jumper processes all queries as regular expressions, so keep in mind using escape sequences for special symbols (except for dot (`.`) character, see further below).

After entering a query, Jumper will highlight the first occurence in text. The highlighted location always shows where Jumper will move your cursor.

Non-highlighted search results will have a small index number before them. If a number is added behind a query with a dot inbetween:

```shell
<query>.<number>
```
then Jumper will use that index as the move target. 

If the index is out-of-bounds, Jumper will select the last occurence of the query.

If multiple dot-number combinations are provided, such as:

```shell
<query>.<number-1>.<number-2>
```

the last dot-number combination will be used as target. If a trailing dot or a dot followed by any text is provided, it will be evaluated as

```shell
<query>.1
```

## Extension Settings

The default keybind for `jumper.searchBuffer` can be modified in keybind settings.

Theming options are WIP.

## Release Notes

### 1.2.0

- Each result has its number shown next to it.

## Contact

[GitHub repo](https://github.com/xdNecron/vscode-jumper)
