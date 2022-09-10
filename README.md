# StashDB Userscripts

## [INSTALL USERSCRIPT](dist/public/StashDB%20Userscripts%20Bundle.user.js?raw=1)

Installation requires a browser extension such as [Violentmonkey](https://violentmonkey.github.io/) / [Tampermonkey](https://www.tampermonkey.net/) / [Greasemonkey](https://www.greasespot.net/).

> You may remove any unwanted userscripts from the bundle by removing the line that starts with `// @require` that corresponds to the userscript you wish to remove.

![Allow cors - Tamper Monkey](images/allow-cors-tamper-monkey.png?raw=true "Allow cors - Tamper Monkey")

*Known issues: If username/password access is enabled in stash, Firefox + Tampermonkey does not work, but Firefox + Violentmonkey works. Both work in Chrome*

## Developing

Each userscript source is split into two files:
* `src/header` - Folder with userscript metadata blocks
* `src/body` - Folder with main script code

Execute `py build.py` to combine source files and generate:
* a userscript bundle to `dist\local` for local development
* individual userscripts and a bundle to `dist\public` for release

Build output directories:
* `dist\local` - A userscript bundle with `@require` headers that load the script code from local files (`src/body`)
* `dist\public` - Userscripts with `@require` headers that load the script code from this github repo