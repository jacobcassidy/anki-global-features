# Anki Advance Typed Cards

| Table of Content              |
| :---------------------------- |
| [About](#about)               |
| [Features](#features)         |
| [Installation](#installation) |
| [How To Use](#how-to-use)     |
| [FAQs](#faqs)                 |

## About

Anki Advance Typed Cards provides a way to add and sync advance features and global card designs across all Anki apps.

Anki apps are available for the following devices:

- [AnkiPC](https://apps.ankiweb.net/) (Windows, Mac, or Linus - Free)
- [AnkiWeb](https://ankiweb.net) (Web - Free)
- [AnkiMobile](https://itunes.apple.com/us/app/ankimobile-flashcards/id373493387) (iOS & iPadOS - Paid)
- [AnkiDroid](https://play.google.com/store/apps/details?id=com.ichi2.anki) (Android - Free)

> Note: Anki Advance Typed Cards requires the use of the free AnkiPC app to set up the advance features. After the initial setup, you may use any of the Anki apps with the features synced across all of them.

## Features

| Index                                                                  |
| :--------------------------------------------------------------------- |
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

### Infinity Typed Inputs



> Note: While this feature gives you the ability to add as many typed inputs on a single card as you want, you'll get the most benefit from your study by keeping your cards simple. Which mean only using an extra input or two when it makes sense - such as having a short bonus question with a typed input related the original question.

**Example:**

[ADD GIF SCREENSHOT EXAMPLE]

### Streamlined Comparison Answers

Anki currently uses different comparison algorithms for its different Anki apps. This gives you different results depending on which device you're using. Anki Advance Typed Cards steamlines this by using a single comparison algorithm which is synced across all Anki apps to produce the same comparison results no matter which device you are using.

**Example:**

[ADD GIF SCREENSHOT EXAMPLE]

### Multiple Comparison Answers

Anki only allows one comparison answer per card, even if you have multiple inputs for which you would like comparison answers for. Anki Advance Typed Cards allows you to have comparison answers for all your multiline typed inputs.

**Example:**

[ADD GIF SCREENSHOT EXAMPLE]

### Global Card Designs



**Example:**

[ADD GIF SCREENSHOT EXAMPLE]

## Installation

### Step 1: Download the following files:

- [\_global.css](https://github.com/jacobcassidy/anki-advance-typed-cards/blob/main/collection.media/_global.css)
- [\_global.js](https://github.com/jacobcassidy/anki-advance-typed-cards/blob/main/collection.media/_global.js)
- [\_diff_match_patch.js](https://github.com/jacobcassidy/anki-advance-typed-cards/blob/main/collection.media/_diff_match_patch.js)

> Note: The above files are prefixed with an underscore `_` to keep them from being added to the delete files list in Anki's "Check Media..." tool.

### Step 2: Add the files you downloaded to your Anki _collection.media_ directory found at:

- **macOS:** `~/Library/Application Support/Anki2/[username]/collection.media/_my-custom-style.css`.
- **Windows:** `?`

> Note: `[username]` is your Anki profile name. The default username is `User 1`.

## How To Use

| Index                                   |
| :-------------------------------------- |
| [How to Use The Advance Inputs](#)      |
| [How to Use The Advance Comparisons](#) |
| [How to Use The Global Card Designs](#) |

#### Step 3: Create your note types

- Advance type [PHP Example]
- Cloze type [JavaScript Example]

#### Step 4: Card Color Styles

- CSS, Git, HTML, JavaScript, NodeJS, PHP, Python, React, Ruby, WordPress

#### Step 5: Night Mode Styles

- Using nightmode? Here's how to style your cards:

## FAQs

### Why not create an Anki plugin to release these features?

Anki plugins only work with the AnkiPC app and are not currently compatible across all devices. If that changes, please let me know by opening an [issue](https://github.com/jacobcassidy/anki-advance-typed-cards/issues).

### I found a bug, how can I report it?

If you came across a bug, please [open an issue](https://github.com/jacobcassidy/anki-advance-typed-cards/issues) and provide as much detail as you can so I can replicate the problem and fix it. Screenshots and/or screencasts of the problem are extra helpful.
