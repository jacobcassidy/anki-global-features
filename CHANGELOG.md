# Changelog - Anki Global Features

All notable changes to this project are documented in this file.

## [Unreleased]

- Full instructions on how to set up and use Anki Global Features.

## [0.2.0] - 2024-12-01

- Updated HTML/JS to create side-by-side answer comparisons.
- Updated CSS design system to use a simple hue value to change colors between programming languages:

| Language     | Hue Value |
| ------------ | --------- |
| RUBY         | 28        |
| GIT          | 33        |
| HTML         | 46        |
| JAVASCRIPT   | 100       |
| Command Line | 130       |
| NODE         | 140       |
| GSAP         | 146       |
| REACT        | 218       |
| PYTHON       | 245       |
| TYPESCRIPT   | 258       |
| WORDPRESS    | 268       |
| PHP          | 273       |
| CSS          | 299       |

## [0.1.3] - 2024-08-10

### Added

- Moved Move Syntax Highlighting Addon styles to their own stylesheet.
- Added `@import url('_styles_for_syntax_highlighting.css')` to card stylesheets.
- Updated `.gitignore` to allow all `/assets` files to be committed.

### Updated

- Updated `CHANGELOG.md` title
- Updated `README.md` content.
- Updated `_global.js` main function as an IIFE.

## [0.1.2] - 2024-05-08

### Added

- Merged Anki Advanced Types Cards and Anki Global Card Styles into one repo for all Anki Global Features:
  - Added `assets/screenshots/download-file-button.png`
  - Added `assets/card-styles/*.css` files
  - Added `collection.media/_global.css` file
  - Added `collection.media/_inconsolata*` files

### Updated

- Formatted JS and CSS files.
- Updated global CSS topic header to remove spacing and rounding.

## [0.1.1] - 2023-08-14

### Added

- MIT License

## [>0.1.1]

### Added

- `README.md`
- `CHANGELOG.md`
- `.gitignore`
- `assets/note-types/*.html` files
- `collection.media/_diff_match_patch.js` file
- `collection.media/_global.js` file
