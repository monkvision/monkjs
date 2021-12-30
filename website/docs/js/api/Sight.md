---
id: sight
title: "Sights"
slug: /js/api/sight
---

A capture scheme is a list of sights `[Sight]` with a unique string `id` and [cylindrical coordinates](https://en.wikipedia.org/wiki/Cylindrical_coordinate_system).

> If our AI can work without this metadata, it analyzes much more easily with it. The Camera view then embeds a list of default sights that you can customize in the near future.

`const sight = new Sight('abstractFront', [null, 0, null], 'Front', ['exterior']);`

This scheme will enable a wheel indicator displaying the angle we need to take the picture.
Plus an overlay is completing the view helping to take position before taking the picture.

``` json
/* pictures */
{
  // ...
  "abstractFront": {
    "sight": Sight,
    "source": { "uri":"data:image/png;base64", "width":640, "height":480, "exif":{...} }
  }
}
```
