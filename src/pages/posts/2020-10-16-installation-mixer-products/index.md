---
title: Home Audio Technology Stack
date: 2020-10-16T16:24:00.000Z
featuredpost: true
featuredimage: /img/310281.jpg
description: Whole home audio routing with off-the-shelf equipment.
affiliate: amazon
tags:
  - audio
  - ear
---
Playing music out of speakers has become much simpler recently thanks to consumer smart speakers like the [Echo](/affiliate/amazon/B07R1CXKN7) and [Sonos One](/affiliate/amazon/B07NJQFL4X). But these products only allow playing from one speaker at a time, and only from one audio source.

For a home automation enthusiast, playing audio throughout the house means routing audio from _any_ source to _any_ destination. Even more, it is imperative to overlay these signals so that I can hear the delivery driver through my doorbell _while_ music is playing! This is a non-trivial problem, but with a little bit of custom software (hello [EAR](https://github.com/mcurcio/ear)!) and some off-the-shelf hardware, it can be achieved.

The simple hardware list looks like this:

* [MOTU 24Ao](/affiliate/amazon/B00OZOLJBQ)
* [Monoprice 10761](https://www.monoprice.com/product?p_id=10761)
* [Monoprice in-celing speakers](/affiliate/amazon/B001N87MI6)

This equipment will produce crisp, powerful audio to 12 different channels/speakers, and can be expanded by adding more amplifiers.

The next step is routing audio with [Einstein Audio Router](https://github.com/mcurcio/ear) through a connected host computer. The software is still in an early alpha state, but a future article will cover configuring simple setups.
