# Anki Global Features

This project adds advanced features to your Anki cards. You can add these features by including a few files in the Anki user directory (instructions below). You can also add these files to your Anki web account to sync them across all the devices on which you use Anki (which can't be done with addons). Hence, the name __Anki Global Features__.

| Table of Contents |
| --- |
| [About Anki](#about-anki) |
| [Advanced Typed Inputs](#adding-advanced-typed-inputs) |
| [Global Card Styles](#adding-global-card-styles) |
| [Installation](#installation) |
| [FAQ](#faq) |
| [Getting Updates](#updates)   |
| [Reporting Issues](#issues) |

## About Anki

If you're unfamiliar with [Anki](https://apps.ankiweb.net/), in a nutshell, it's an open-source digital flashcard system that uses [spaced repetition](https://en.wikipedia.org/wiki/Spaced_repetition) to help you retain knowledge in your long-term memory.

Anki apps are available for the following:

| Device | OS | Type |
| --- | --- |  --- |
| [AnkiPC](https://apps.ankiweb.net/) | Windows, Mac, or Linux | _Free_ |
| [AnkiWeb](https://ankiweb.net) | Web | _Free_ |
| [AnkiMobile](https://itunes.apple.com/us/app/ankimobile-flashcards/id373493387) | iOS & iPadOS | _Paid_ |
| [AnkiDroid](https://play.google.com/store/apps/details?id=com.ichi2.anki) | Android | _Free_ |


## Advanced Typed Inputs

Anki has a default input field you can use on the AnkiPC app to type an answer to a card's question. However, it has many limitations and is not available across all apps. Adding the _Advanced Typed Inputs_ setup improves on the default and allows you to use typed answers on all devices. I initially developed this setup specifically for programming reviews, but it can be used for any topic you study.

### Features include:

__Multiline Typed Inputs__ - Anki's default input field only allows a single input line. Advanced Typed Inputs allow you the freedom of adding multiple lines (perfect for code blocks).

<!-- [ADD GIF SCREENSHOT EXAMPLE] -->

__Infinity Typed Inputs__ - Anki's default input field can only be used once per card. Advanced Typed Inputs allow you the freedom to add additional input fields (perfect for when you have a 2-part question).

> Note: While the _Infinity Typed Inputs_ feature gives you the ability to add as many inputs as you want on a single card, you'll get the most benefit from your reviews by keeping your cards simple. For me, that means having only one extra optional input per card which can be used for a quick follow-up question or typed code example.

<!-- [ADD GIF SCREENSHOT EXAMPLE] -->

__Streamlined Comparison Answers__ - Anki currently uses different comparison algorithms for its different Anki apps. This gives you different results depending on which device you're using. _Advanced Typed Inputs_ streamlines this by using a single comparison algorithm, synced across all Anki apps to produce the same comparison results no matter which device you are using.

<!-- [ADD GIF SCREENSHOT EXAMPLE] -->

__Unlimited Comparison Answers__ - Like the input fields themselves, Anki limits the comparison answers to just one per card, even if you have multiple inputs for which you would like comparison answers. _Advanced Typed Inputs_ allow you to have unlimited comparison answers per card so you can compare all your multiline typed inputs.

<!-- [ADD GIF SCREENSHOT EXAMPLE] -->

## Global Card Styles

## Installation

The initial setup for Anki Global Features requires the use of the free [AnkiPC](https://apps.ankiweb.net/) app. This means you'll need to use a device running Windows, macOS, or Linux. Once set up, you can use the features on any Anki app.

> __Note__: If you only want to add a specific feature, follow the instructions for that feature:
> - [Advanced Typed Inputs - Installation Instructions]()
> - [Global Card Styles - Installation Instructions]()
>
> Otherwise, continue on for the full installation...

### Step 1: Install AnkiPC

If you don't already have AnkiPC installed, install it now by visiting [Anki](https://apps.ankiweb.net/) and clicking the download button (_available for macOS, Windows, and Linux_).

### Step 2: Download the _Anki Global Feature_ files

You have three options for downloading the files:

1. You can download the files you want individually (see below).
2. You can download the entire repository as a zip file: [Download Zip](https://github.com/jacobcassidy/anki-global-features/archive/refs/heads/main.zip)
3. You can clone the repository to your local computer with: `git clone git@github.com:jacobcassidy/anki-global-features.git`

#### Downloading Individual Files

![Download Button Screenshot](https://github.com/jacobcassidy/anki-global-features/blob/main/assets/screenshots/download-file-button.png?raw=true)

![download-file-button](https://github.com/user-attachments/assets/837ba54a-35d6-440d-bb91-4b8edd2cb02e)

![Download Button Screenshot](/assets/screenshots/download-file-button.png)

> Figure 1: You can download individual files by going to the file's page and clicking the small download button.

#### The Files You Need

The files you need are contained in the [collection.media](https://github.com/jacobcassidy/anki-advance-typed-cards/tree/main/collection.media) directory.

| Files                                                                                                                                         |
| --------------------------------------------------------------------------------------------------------------------------------------------- |
| [\_diff_match_patch.js](https://github.com/jacobcassidy/anki-advance-typed-cards/blob/main/collection.media/_diff_match_patch.js)             |
| [\_global.js](https://github.com/jacobcassidy/anki-advance-typed-cards/blob/main/collection.media/_global.js)                                 |
| [\_inconsolata-regular.woff](https://github.com/jacobcassidy/anki-advance-typed-cards/blob/main/collection.media/_inconsolata-regular.woff)   |
| [\_inconsolata-regular.woff2](https://github.com/jacobcassidy/anki-advance-typed-cards/blob/main/collection.media/_inconsolata-regular.woff2) |


### Step 3: Move the files to your local _collection.media_ directory

After you download the above files, you will need to move them to your local Anki `collection.media` directory [[ref](https://docs.ankiweb.net/files.html#file-locations)]:

| OS          | Location                                                           |
| ----------- | ------------------------------------------------------------------ |
| **macOS**   | `~/Library/Application Support/Anki2/[username]/collection.media/` |
| **Windows** | `APPDATA\Anki2\[username]\collection.media\`                                                    |
| **Linux**   | `~/.local/share/Anki2/[username]/collection.media/`                |

> _Note: `[username]` is your Anki profile name. The default profile name is `User 1`._

### Step 4: Sync the files to use on all devices

**You are now ready to start using _Anki Advance Typed Cards_!**

## Usage

### Overview

<!--
Create your note types:

- Advance type [PHP Example]
- Cloze type [JavaScript Example] -->

### How to Use The Advance Typed Inputs

### How to Use the Advance Comparison Answers

<!-- ### How to Use The Global Card Designs

- CSS, Git, HTML, JavaScript, NodeJS, PHP, Python, React, Ruby, WordPress

- Using nightmode? Here's how to style your cards: -->


## FAQ

### Why not create an Anki plugin to release these features?

Anki plugins only work with the AnkiPC app and are incompatible across other devices such as mobile. If that changes, please let me know by opening an [issue](https://github.com/jacobcassidy/anki-global-features/issues).

### Why are the files in the collection.media directory prefixed with an underscore?

Anki has a [Check Media](https://docs.ankiweb.net/media.html#checking-media) feature, which can delete unused media files not contained in any cards. Adding the leading underscore, such as `_global.js`, makes Anki ignore that file so it won't be deleted when using the Check Media feature.

## Updates

View the [Changelog](https://github.com/jacobcassidy/anki-global-features/blob/main/CHANGELOG.md) to see the latest updates. Currently, you will need to manually copy/paste any changes you want to your local Anki files, then start, or restart the AnkiPC app if you have it open, so the updates can be synced.

## Issues

If you come across any issues, please report them [here](https://github.com/jacobcassidy/anki-global-features/issues).
