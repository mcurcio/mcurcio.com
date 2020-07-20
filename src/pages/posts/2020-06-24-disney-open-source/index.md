---
title: Disney Open Source
date: 2020-06-24T17:41:02.172Z
description: This is the story of my attempt to open source a library at the
  worlds largest entertainment company.
featuredpost: true
featuredimage: /img/disneycareers-header.jpg
draft: true
tags:
  - disney
  - open source
  - rttl
  - juce
---
### The movement

It started with a very simple question to my boss:

> Am I allowed to open source something?

The answer, unsurprisingly, was "I don't know."

### The initial attempt

But I endeavored to find out, so I contacted a lawyer within our organization that we had worked with before and set up a meeting. That meeting was escalated to other local lawyers and other organizations and we had an earnest discussion about the project that I wanted to open source.

At this time, circa 2013, there were no open source projects hosted by Disney. There were the usual concerns about intellectual property and the legal ramifications of supporting software after it had been released, and most of all -- what would be the company liability if our software caused damage?

### Sidebar

It might be important to note that the software in question was a small C++ library which aimed to replicate parts of the STL for hard real-time purposes. The application internally was for robotics, so the off-the-shelf STL was not an option. As a result, I developed a small library called the Real Time Template Library (`rttl::`), which I affectionately named "Rattle".

### Elsewhere...

I followed up a few more times after those initial meetings, hoping that I could get a thumbs-up to throw my code up on GitHub. Once again, unsurpsingly, the legal team was not going to be so quick to leap.

Shortly after, I was contacted by my local legal contact about a larger effort from the corporate side to spin up an offical open source presence, including a formal process for releasing projects. I jumped at the chance to be a part of it. I figured that I could help the company get into the business of open source, which would help with recruitment and code maintaintenance and all of the other goodies that the community enjoys. At the same time, I though that by getting close to the process I could hopefully, maybe, finally release my small library.

### The Committee

I will skip over the year of meetings that determined the goals and structure and process of the organization and get right to the results. After much committee discussion, it was determined that each organization within Disney would be represented by 3 individuals:

1. Legal
2. Security
3. Engineering

I became the Engineering representative for the Imagineering organization (and the quasi-Security representative as Imagineering was the only organization within the company to not have a dedicated Security team).

The process was effectively that any project could be submitted to the organization, and each representative across the company had to give it a thumbs-up. Any dissent would kill the effort to prevent some project being released which would have a negative impact on another organization.

### Aftermath

It might be obvious at this point, especially for anyone who has ever perused the [Disney GitHub](https://github.com/disney) page, that Disney has not become a leader in open source. The problem, as I saw it from the inside, is that dissent came quickly and approvals came slow. Many projects were presented to the committee, but only the least offensive were ever approved. Typically the legal team would object to some IP or terminology or implicit patent grant, and occasionally the Security team would object to leaking information. I never witnessed Engineering team dissent.

But this is the story of my little pet project, and it is a sad story. Rattle was never even brought to committee. The legal team objected to the safety concerns around releasing a piece of Safety related software, and also to handing our biggest competitor (Universal Studios) a small piece of the Imagineering secret sauce.

But Rattle still holds a special place in my heart, and I have not seen anything like it. I am inclined to write a new version someday, and have been itching for something like it while working in JUCE recently. It should be infinitely easier to open source it without the committee...
