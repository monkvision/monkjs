---
id: damage-highlight
title: "DamageHighlight"
slug: /js/api/components/damage-highlight
---

**Polygons on a vehicle picture.**
Damages are highlighted by the property `clipPath` while the opacity of the rest of the image is reduced to localize
the damage on the car.
[Try it with Expo Snack.](https://snack.expo.dev/@alexandre-em-monk/damagehighlight-component)

![npm latest package](https://img.shields.io/npm/v/@monkvision/react-native/latest.svg)

```yarn
yarn add @monkvision/visualization
```

``` javascript
import { DamageHighlight } from '@monkvision/visualization';
```

``` javascript
const image = {
  id: "uuid", // image's uuid
  width: 0, // original size of the image
  height: 0,
  source: {
    uri: "https://my_image_path.monk.ai"
  },
};

const polygons = [[[0, 0], [1, 0], [0, 1]], [[2, 0], [1, 1], [0, 2]]];
const damages = [{ damageType: "Scratch", polygons, id }];

<DamageHighlight image={image} damages={damages} />;
```

The component's properties are from the result of an inspection. Both of them are a part of `inspection.images`.

---

# Props

## image

``` javascript
PropTypes.shape({
  height: PropTypes.number,
  id: PropTypes.string, // image's uuid
  source: PropTypes.shape({
    uri: PropTypes.string, // "https://my_image_path.monk.ai"
  }),
  width: PropTypes.number, // original size of the image
})
```

``` javascript
const image = { id: 'uuid', width: 0, height: 0, source: {
  uri: 'https://my_image_path.monk.ai'
}};

<DamageHighlight image={image}/>
```
> `image.id` is mandatory for usage on web
## damages
`PropTypes.arrayOf({ polygons, ellipse, damageType, id })`

Contains all damages information related to the picture:

* **polygons** : Polygons are 3 levels depth matrix and come from `inspection.images[i].views[j].image_region.polygons`
  1. list all polygons of a `damage` on the current `image`
  2. list all `points` of a single `polygon`
  3. list of 2 number which is the position of a `point` in the plane (basically `x` and `y`)
* **ellipse** : Contains all information related to the ellipse
  * `rx`, `ry` are the radius of the ellipse on axis `x` and `y`
  * `cx`, `cy` are the position of the center of the ellipse
* **id** : id of the damage
* **damageType** : type of the damage that will be display with the polygon/ellipse

## onPressDamage
`PropTypes.func`

Callback that allows to add an action at the on press event on a polygon or an ellipse. And allows to have the information of the selected damage.

### Arguments
* damage `PropTypes.shape({ damageType, ellipse, id, polygons })` - Is the selected damage

## options

### background.opacity
`PropTypes.number`

Allow setting background image's opacity.

### label.fontSize
`PropTypes.number`

Allow setting the damage type label's font size.

### polygons / ellipse
```js
ellipse: PropTypes.shape({
  opacity: PropTypes.number,
  stroke: PropTypes.shape({
    color: PropTypes.string,
    strokeWidth: PropTypes.number,
  })
})
```
Allow to style the polygons or the ellipse

## width
`PropTypes.number`

Allows to set the image's displayed width. The height will be computed afterwards

---
# Methods
To use methods that `DamageHighlight` exposes one has to create a component `ref` and invoke them using it.
## toImage()
`PropTypes.func`

It returns a Promise of the base64 image

```js
// ...
const damageHighlightRef = useRef(null);

const saveImage = useCallback(async () => {
  const base64 = await damageHighlightRef.current.toImage();
}, [damageHighlightRef]);

// ...
<DamageHighlight ref={damageHighlightRef} />
```

---
# Hooks
## useProps

Extract properties from an API server response and convert it to fit with `DamageHighlight` component props.

### getDamages(image, damages)
`PropTypes.func`

Format a `damages` list to DamageHighlight `damages` prop (cf. [example](#Example))

| Name      | Type            | Description                      |
|-----------|-----------------|----------------------------------|
| `image`   | [Image](#image) | A single inspection image object |
| `damages` | [Damage]        | List of damage from api result   |

### getImage(image)
`PropTypes.func`

Format an `image` to a classical [image](#image) object (cf. [example](#Example))

| Name    | Type            | Description                      |
|---------|-----------------|----------------------------------|
| `image` | [Image](#image) | A single inspection image object |

# Example
``` javascript
import React, { useState, useEffect } from 'react';
import { DamageHighlight, useProps } from '@monkvision/visualization';

export default function App() {
  const oneImage = inspection.images[0]; // result from API

  const ref = useRef(null);
  const { getDamages, getImage } = useProps();
  const options = {
    polygons: {
      opacity: 0.5,
      stroke: {
        color: 'green',
        strokeWidth: 50,
      }
    },
    label: {
      fontSize: 20,
    },
    background: {
      opacity: 0.35,
    },
  }

  const handleSaveImage = useCallback(async () => {
    const base64 = await ref.current.toImage();
    save(base64);
  }, [ref]);

  const handlePressDamage = (damage) => {
    console.log(damage);
  }

  return (
    <View>
      <DamageHighlight
        image={getImage(oneImage)}
        damages={getDamages(oneImage, inspection.damages)}
        options={options}
        width={400}
        height={180}
        onPressDamage={console.log}
        ref={ref}
      />
    </View>
  )
}

```
