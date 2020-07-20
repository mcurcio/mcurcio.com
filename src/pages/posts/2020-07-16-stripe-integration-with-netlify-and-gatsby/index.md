---
title: 'Netlify checkout with Stripe'
date: 2020-07-16T12:13:10.000Z
featuredpost: false
featuredimage: header.jpg
description: Thanks to Netlify and Stripe, it has never been easier to throw together a payment page that scales.
tags:
  - olivias cards
  - mustard seed school
  - stripe
  - netlify
  - serverless
---
But I had a few challenges along the way, so I am documenting my notes here in case I need to do this again in the future.

In the process of building my [Olivias Cards for Mustard Seed School](/olivias-cards-for-mustard-seed) fundraiser page, I needed a checkout solution. I have experience with [Stripe](https://stripe.com), so that was the obvious choice.

The final code is in this repository, the [frontend code is here](https://github.com/mcurcio/mcurcio.com/blob/master/src/pages/olivias-cards-for-mustard-seed/index.js) (caution: the frontend code is a MESS), and the [backend code is here](https://github.com/mcurcio/mcurcio.com/blob/master/lambda/olivias-cards/olivias-cards.js).

The requirements were:
1. No PCI requirements - Stripe needed to handle all of the processing and security
2. Custom shipping costs logic, including free shipping code
3. Generated invoices and emails
4. Integrated on the page (no external checkout form)

Thanks to [Stripe Elements](https://stripe.com/payments/elements) requirement #1 was achievable with essentially copy/pasting code from the React plugin docs. The other requirements were a bit more challenging.

I tried two different methods for generating the backend code. At first, I tried using the [Stripe Orders API](https://stripe.com/docs/api/orders/object) because a quick glance through the docs showed that I could pass individual line items to the checkout process, which I *assumed* would get translated to a final receipt. Spoiler: all of the line items are coalesced into a single charge.

The second solution that I tried was successful -- using the [Stripe Invoices API](https://stripe.com/docs/api/invoices) I was able to add the individual line items and then apply them to a single invoice which could be charged. All of the relevant code is in [the serverless Lambda code](https://github.com/mcurcio/mcurcio.com/blob/master/lambda/olivias-cards/olivias-cards.js).

*Header image via https://mitchgavan.com/react-serverless-shop/*
