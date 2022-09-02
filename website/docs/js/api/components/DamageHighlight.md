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
<DamageHighlight images={inspection.images} damages={inspection.damages} />;
```

The component's properties are from the result of an inspection.

---

# Props

## image
> Contains all images information related to a single inspection. This can be retrieved on the `GET /inspections/:id` method

```js
  images: PropTypes.arrayOf(PropTypes.shape({
    additionalData: PropTypes.shape({
      label: PropTypes.objectOf(PropTypes.string).isRequired,
    }),
    id: PropTypes.string.isRequired,
    imageHeight: PropTypes.number.isRequired,
    imageWidth: PropTypes.number.isRequired,
    views: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      imageRegion: PropTypes.shape({
        specification: PropTypes.shape({
          boundingBox: PropTypes.shape({
            height: PropTypes.number,
            width: PropTypes.number,
            xmin: PropTypes.number,
            ymin: PropTypes.number,
          }).isRequired,
          polygons: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number))),
        }),
      }),
    })),
    path: PropTypes.string.isRequired,
  })),
```

* **polygons** : Polygons are 3 levels depth matrix and come from `inspection.images[i].views[j].image_region.polygons`
  1. list all polygons of a `damage` on the current `image`
  2. list all `points` of a single `polygon`
  3. list of 2 number which is the position of a `point` in the plane (basically `x` and `y`)
* **ellipse**: Ellipses are all damages added by the user and are displayed basing on the bounding box given when created on `DamageAnnotation` for example
## damages

> Contains all damages information related to a single inspection. This can be retrieved on the `GET /inspections/:id` method
```js
  damages: PropTypes.arrayOf(PropTypes.shape({
    createdBy: PropTypes.string,
    damageType: PropTypes.string,
    deletedAt: PropTypes.string,
    id: PropTypes.string,
    inspectionId: PropTypes.string,
  })),
```

## damageStyle
`PropTypes.func`

Callback that allows to customize the style of a polygon/ellipse depending on the damage. For instance:

```js
  <DamageHighlight damageStyle={(damage) => ({ stroke: damage.id === 'aaa' ? 'green' : 'yellow' } })} >
```

## onPressDamage
`PropTypes.func`

Callback that allows to add an action at the on press event on a polygon or an ellipse. And allows to have the information of the selected damage.

### Arguments
* damage : Is the selected damage

```js
  <DamageHighlight onPressDamage={(damage) => showDamageLabel(damage.damageType)} >
```

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

Allows to set the image's displayed width

## height
`PropTypes.number`

Allows to set the image's displayed height

---
# Methods
To use methods that `DamageHighlight` exposes one has to create a component `ref` and invoke them using it.
## toImage()
`PropTypes.func`

It returns a Promise of the base64 image. The image `id` must be defined (Web only).

```js
// ...
const damageHighlightRef = useRef(null);

const saveImage = useCallback(async () => {
  const base64 = await damageHighlightRef.current.toImage();
}, [damageHighlightRef]);

// ...
<DamageHighlight ref={damageHighlightRef} />
```

# Example
``` javascript
import React, { useState, useEffect, useRef, useCallback } from 'react';
import monk from '@monkvision/corejs';
import { DamageHighlight } from '@monkvision/visualization';

export default function App() {
  const ref = useRef(null);
  const [inspection, setInspection] = useState(null);
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

  useEffect(() => {
    monk.entity.inspection.getOne(id)
      .then(setInspection)
      .catch(console.error)
  }, [])

  return (
    <View>
      {inspection.images.map((image) => (
        <DamageHighlight
          damages={damages}
          damageStyle={(damage) => (damage.damageType === 'dent' ? { stroke: 'red', strokeDasharray: '5, 5' } : {})}
          image={item}
          onPressDamage={handlePressDamage}
          options={options}
          width={400}
          height={180}
          ref={ref}
        />
      ))}
    </View>
  )
}

```
