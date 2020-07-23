# Jules' Spielwiese
## qwertzuiopasdfghjklyxcvbnm
### qwertzuiopasdfghjklyxcvbnm
#### qwertzuiopasdfghjklyxcvbnm
##### qwertzuiopasdfghjklyxcvbnm
###### qwertzuiopasdfghjklyxcvbnm

Hi Jules! Hier kannst du deinen ganzen Rechtstext schreiben, und unsere API holt des dann immer ab und macht da draus wunderschönes HTML.
Im Folgenden hab ich dir noch paar Beispiele geschrieben, da siehst du nen Teil von dem, was MD so alles bereitstellt.



## Download tarball

You can download the latest release tarball directly from [releases][releases]

## Bower

    bower install showdown

## npm (server-side)

    npm install showdown

## CDN

You can also use one of several CDNs available: 

* rawgit CDN

        https://cdnwn.min.js

* cdnjs

        https://cdnown.min.js


---------

# Syntax


## Table of contents

- [Introduction](#introduction)
- [Paragraphs](#paragraphs)
- [Headings](#headings)
    * [Atx Style](#atx-style)
    * [Setext style](#setext-style)
    * [Header IDs](#header-ids)
- [Blockquotes](#blockquotes)
- [Bold and Italic](#bold-and-italic)
- [Strikethrough](#strikethrough)
- [Emojis](#emojis)
- [Code formatting](#code-formatting)
    * [Inline formats](#inline-formats)
    * [Multiple lines](#multiple-lines)
- [Lists](#lists)
    * [Unordered lists](#unordered-lists)
    * [Ordered lists](#ordered-lists)
    * [TaskLists (GFM Style)](#tasklists--gfm-style-)
    * [List syntax](#list-syntax)
    * [Nested blocks](#nested-blocks)
    * [Nested lists](#nested-lists)
    * [Nested code blocks](#nested-code-blocks)
- [Links](#links)
    * [Simple](#simple)
    * [Inline](#inline)
    * [Reference Style](#reference-style)
- [Images](#images)
    * [Inline](#inline-1)
    * [Reference Style](#reference-style-1)
    * [Image dimensions](#image-dimensions)
    * [Base64 encoded images](#base64-encoded-images)
- [Tables](#tables)
- [Mentions](#mentions)
- [Handling HTML in markdown documents](#handling-html-in-markdown-documents)
- [Escaping entities](#escaping-entities)
    * [Escaping markdown entities](#escaping-markdown-entities)
    * [Escaping html tags](#escaping-html-tags)
- [Known differences and Gotchas](#known-differences-and-gotchas)

## Introduction

Showdown was created by John Fraser as a direct port of the original parser written by markdown's creator, John Gruber. Although Showdown has evolved since its inception, in "vanilla mode", it tries to follow the [original markdown spec][md-spec] (henceforth refereed as vanilla) as much as possible. There are, however, a few important differences, mainly due to inconsistencies in the original spec, which we addressed following the author's advice as stated in the [markdown's "official" newsletter][md-newsletter].

Showdown also support "extra" syntax not defined in the original spec as opt-in features. This means new syntax elements are not enabled by default and require users to enable them through options.

This document provides a quick description the syntax supported and the differences in output from the original markdown.pl implementation.

## Paragraphs

Paragraphs in Showdown are just **one or more lines of consecutive text** followed by one or more blank lines.

```md
On July 2, an alien mothership entered Earth's orbit and deployed several dozen 
saucer-shaped "destroyer" spacecraft, each 15 miles (24 km) wide.
    
On July 3, the Black Knights, a squadron of Marine Corps F/A-18 Hornets, 
participated in an assault on a destroyer near the city of Los Angeles.
```

The implication of the “one or more consecutive lines of text” is that Showdown supports 
“hard-wrapped” text paragraphs. This means the following examples produce the same output:

```md
A very long line of text
```

```md
A very
long line
of text
```

If you DO want to add soft line breaks (which translate to `<br>` in HTML) to a paragraph, 
you can do so by adding 3 space characters to the end of the line (`  `).

You can also force every line break in paragraphs to translate to `<br>` (as Github does) by
enabling the option **`simpleLineBreaks`**.

## Headings

### Atx Style

You can create a heading by adding one or more # symbols before your heading text. The number of # you use will determine the size of the heading. This is similar to [**atx style**][atx].

```md
# The largest heading (an <h1> tag)
## The second largest heading (an <h2> tag)
…
###### The 6th largest heading (an <h6> tag)
```

The space between `#` and the heading text is not required but you can make that space mandatory by enabling the option **`requireSpaceBeforeHeadingText`**.

You can wrap the headings in `#`. Both leading and trailing `#` will be removed.

```md
## My Heading ##
```

If, for some reason, you need to keep a leading or trailing `#`, you can either add a space or escape it:

```md
# # My header # #

#\# My Header \# #
```

### Setext style

You can also use [**setext style**][setext] headings, although only two levels are available.