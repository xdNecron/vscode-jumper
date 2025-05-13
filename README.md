# Jumper

Jumper is a quick search-and-jump extension for VS Code heavily inspired by [avy](https://github.com/abo-abo/avy). Its primarly goal is to provide better text navigation solution for users using Vim emulation plugin.

## Features

Jumper's one and only feature is its search prompt, which is by default mapped to `Shift``Space`. Any character can be inserted inside the prompt with the sole exception of `.` which Jumper reserves as its special character.

> As of current version, Jumper will look for search results in text that was visible during search prompt initiation. 

By default, Jumper will jump to the first occurence of the given prompt.

If a number `n` preceded by `.` is provided at the end of the prompt, Jumper will jump to `n`-th occurence of the given prompt. In case `n` is larger than the number of occurences, Jumper will jump to the last occurence. 

Thus search prompt `hello.4` would jump the 4th occurence of the word hello in visible text.

> In case "multiple n's" are given (f.e. `hello.4.3.5`), the last number will be evaluated.

## Extension Settings

The default keybind for `jumper.searchBuffer` can be changed in keybind settings.

## Known Issues

- In case of a trailing dot (f.e. `hello.4.3.`), none of the position delimeters will be evaluated. This is because of insufficent parsing. Scheduled to fix in next version.

## Release Notes


### 1.0.0

Initial release of Jumper.

## Contact

[GitHub repo](https://github.com/xdNecron/vscode-jumper)
