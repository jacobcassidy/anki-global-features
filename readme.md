# Anki Advance Typed Cards

| Table of Content              |
| :---------------------------- |
| [About](#about)               |
| [Features](#features)         |
| [Installation](#installation) |
| [How To Use](#how-to-use)     |
| [FAQs](#faqs)                 |

## About

_Anki Advance Typed Cards_ adds and syncs [advance features](#features) and [global card designs](#global-card-designs) across all Anki apps.

If you're unfamiliar with [Anki](https://apps.ankiweb.net/), in a nutshell, it's a digital flashcard system that uses [spaced-repetition](https://en.wikipedia.org/wiki/Spaced_repetition) to help you retain knowledge in your long-term memory.

Anki apps are available for the following devices:

- [AnkiPC](https://apps.ankiweb.net/) (Windows, Mac, or Linux - Free)
- [AnkiWeb](https://ankiweb.net) (Web - Free)
- [AnkiMobile](https://itunes.apple.com/us/app/ankimobile-flashcards/id373493387) (iOS & iPadOS - Paid)
- [AnkiDroid](https://play.google.com/store/apps/details?id=com.ichi2.anki) (Android - Free)

> Note: _Anki Advance Typed Cards_ requires use of the free AnkiPC app to set up the advance features and global card designs. You will also need a free AnkiWeb account if you want to sync the designs and features across all Anki apps.
>
>_Anki Advance Typed Cards_ is not affiliated with Anki apps. This is an independent project created to solve my own needs for upgrades to the Anki apps.

## Features

| Features Index                                                    |
| :---------------------------------------------------------------- |
| [Multiline Typed Inputs](#multiline-typed-inputs)                 |
| [Infinity Typed Inputs](#infinity-typed-inputs)                   |
| [Streamlined Comparison Answers](#streamlined-comparison-answers) |
| [Multiple Comparison Answers](#multiple-comparison-answers)       |
| [Global Card Designs](#global-card-designs)                       |

<!-- ### The Main Features
1. The ability to quickly modify the design of your cards globally with CSS and have the styles sync across all Anki apps.
2. The ability to add multiline typed inputs to your cards that work on all Anki apps.
3. The ability to have as many multiline inputs as you want in a single card.
4. Streamlined comparison answers that work with multiline inputs across all Anki apps.
5. No limit to how many comparison answers you can have per card. -->

### Multiline Typed Inputs

**Example:**

[ADD GIF SCREENSHOT EXAMPLE]

---

### Infinity Typed Inputs

> Note: While this feature gives you the ability to add as many typed inputs on a single card as you want, you'll get the most benefit from your study by keeping your cards simple. Which mean only using an extra input or two when it makes sense - such as having a short bonus question with a typed input related the original question.

**Example:**

[ADD GIF SCREENSHOT EXAMPLE]

---

### Streamlined Comparison Answers

Anki currently uses different comparison algorithms for its different Anki apps. This gives you different results depending on which device you're using. _Anki Advance Typed Cards_ steamlines this by using a single comparison algorithm which is synced across all Anki apps to produce the same comparison results no matter which device you are using.

**Example:**

[ADD GIF SCREENSHOT EXAMPLE]

---

### Multiple Comparison Answers

Anki only allows one comparison answer per card, even if you have multiple inputs for which you would like comparison answers for. _Anki Advance Typed Cards_ allows you to have comparison answers for all your multiline typed inputs.

**Example:**

[ADD GIF SCREENSHOT EXAMPLE]

---

### Global Card Designs

**Example:**

[ADD GIF SCREENSHOT EXAMPLE]

## Installation

| Installation Index                                                                                                                        |
| :---------------------------------------------------------------------------------------------------------------------------------------- |
| [Step 1: Install AnkiPC](#step-1-if-you-dont-have-ankipc-installed-install-it-now)                                                        |
| [Step 2: Download repo files](#step-2-download-this-repositorys-collectionmedia-directory-files)                                          |
| [Step 3: Move files to your local directory](#step-3-move-the-files-you-downloaded-to-your-local-anki-collectionmedia-directory-found-at) |

### Step 1: If you don't have AnkiPC installed, install it now:

- Visit [Anki](https://apps.ankiweb.net/) and click the download button (for macOS, Windows, or Linux).

### Step 2: Download this repository's [collection.media](https://github.com/jacobcassidy/anki-advance-typed-cards/tree/main/collection.media) directory files:

- [\_diff_match_patch.js](https://github.com/jacobcassidy/anki-advance-typed-cards/blob/main/collection.media/_diff_match_patch.js)
- [\_global.css](https://github.com/jacobcassidy/anki-advance-typed-cards/blob/main/collection.media/_global.css)
- [\_global.js](https://github.com/jacobcassidy/anki-advance-typed-cards/blob/main/collection.media/_global.js)
- [\_inconsolata-regular.woff](https://github.com/jacobcassidy/anki-advance-typed-cards/blob/main/collection.media/_inconsolata-regular.woff)
- [\_inconsolata-regular.woff2](https://github.com/jacobcassidy/anki-advance-typed-cards/blob/main/collection.media/_inconsolata-regular.woff2)

> Note: The above files are prefixed with an underscore `_` to keep them from being added to the delete files list in AnkiPC's "Check Media..." tool.

### Step 3: Move the files you downloaded to your local Anki _collection.media_ directory found at:

- **macOS:** `~/Library/Application Support/Anki2/[username]/collection.media/`
- **Windows:** `APPDATA\Anki2`
- **Linus:** `~/.local/share/Anki2/[username]/collection.media/`

> Note: `[username]` is your Anki profile name. The default profile name is `User 1`.

**You are now ready to start using _Anki Advance Typed Cards_!**

## How To Use

| How To Index                                                   |
| :------------------------------------------------------------- |
| [Overview](#)                                                  |
| [How to Use The Advance Typed Inputs](#)                       |
| [How to Use The Advance Comparison Answers](#)                 |
| [How to Use The Global Card Designs](#)                        |
| [How to Sync The Features and Designs Across All Anki Apps](#) |

### Overview

Create your note types:

- Advance type [PHP Example]
- Cloze type [JavaScript Example]

### How to Use The Advance Typed Inputs

### How to Use the Advance Comparison Answers

### How to Use The Global Card Designs

- CSS, Git, HTML, JavaScript, NodeJS, PHP, Python, React, Ruby, WordPress

- Using nightmode? Here's how to style your cards:

### How to Sync The Features and Designs Across All Anki Apps

## FAQs

### Why not create an Anki plugin to release these features?

Anki plugins only work with the AnkiPC app and are not currently compatible across all devices. If that changes, please let me know by opening an [issue](https://github.com/jacobcassidy/anki-advance-typed-cards/issues).

### I found a bug, how can I report it?

If you came across a bug, please [open an issue](https://github.com/jacobcassidy/anki-advance-typed-cards/issues) and provide as much detail as you can so I can replicate the problem and fix it. Screenshots and/or screencasts of the issue are extra helpful.
