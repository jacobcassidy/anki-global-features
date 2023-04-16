# Anki Advance Typed Cards

## About

Anki Advanced Typed Cards provides a way to add and sync card styles and advance features across all Anki apps from a single place. This allows you to have a similar experience using an Anki app to review your cards, no matter which device you're currently using.

The Anki apps available for different devices:
- [AnkiPC](https://apps.ankiweb.net/) (For Windows, Mac, or Linus - Free)
- [AnkiWeb](https://ankiweb.net) (For the web only - Free)
- [AnkiMobile](https://itunes.apple.com/us/app/ankimobile-flashcards/id373493387) (For iOS & iPadOS - Paid)
- [AnkiDroid](https://play.google.com/store/apps/details?id=com.ichi2.anki) (For Android - Free)

*Note: The setup of Anki Advanced Typed Cards requires the free AnkiPC app. After you are set up, you may use any of the Anki apps with the features synced across all of them.*

### The Anki Advanced Typed Cards main features:
1. The ability to quickly modify the design of your cards globally with CSS and have the styles sync across all Anki apps.
2. The ability to add multiline typed inputs to your cards that work across all Anki apps.
3. The ability to have as many multiline inputs as you want on a single card.
4. Streamlined comparison answers that work with multiline inputs across all Anki apps.
5. No limit to how many comparison answers you can have per card.

## Features In Detail

### 1. Global Card Designs

#### Purpose:

#### Example:

[ADD GIF SCREENSHOT EXAMPLE]

### 2. Multiline Typed Inputs

#### Purpose:

#### Example:

[ADD GIF SCREENSHOT EXAMPLE]

### 3. Countless Inputs

#### Purpose:

*Note: While this gives you the ability to add many typed inputs on a single card, you'll get the most benefit from keeping your cards simple with only an extra input or two when it makes sense. Such as having a short bonus question with a typed input related the original question.*

#### Example:

[ADD GIF SCREENSHOT EXAMPLE]

### 4. Streamlined Comparison Answers

#### Purpose:

Anki currently uses different comparison algorithms for different Anki apps. This gives you different results depending on which device you're using. Anki Advance Typed Cards uses a single comparison algorithm which is synced across all Anki apps to produce matching results no matter which device you are using.

#### Example:

[ADD GIF SCREENSHOT EXAMPLE]

### 5. Limitless Comparison Answers

#### Purpose:

Anki only allows one comparison answer per card, even if you have multiple inputs you would like comparison answers for. Anki Advance Typed Cards allows you to have comparison answers for all your typed inputs.

#### Example:

[ADD GIF SCREENSHOT EXAMPLE]

## Questions & Answers

### Why not create an Anki plugin to release these features?

Anki plugins only work with the AnkiPC app and are not currently compatible across all devices. If that changes, please let me know and I may be able to port Anki Advance Typed Cards into a plugin.

## Setup Guide

1. ### Download the files
    - `_global.css`
    - `_global.js`
    - `_diff_match_patch.js`

    *Note: Files that are not prefix with an underscore `_` will show up in the Anki "Check Media..." tool for files to delete. This is why you will see the root files using the leading underscore for their names, such as `_global.css`.*

2. ### Add the files to your Anki collection.media directory found at:
    - __macOS:__ `~/Library/Application Support/Anki2/[username]/collection.media/_my-custom-style.css`.
    - __Windows:__ `?`

    **Note:** `[username]` is your Anki profile name. The default username is `User 1`.

3. ### Create your note types
    - Advance type [PHP Example]
    - Cloze type [JavaScript Example]

4. ### Card Color Styles
    - CSS, Git, HTML, JavaScript, NodeJS, PHP, Python, React, Ruby, WordPress

5. ###  Night Mode Styles
    - Using nightmode? Here's how to style your cards:





