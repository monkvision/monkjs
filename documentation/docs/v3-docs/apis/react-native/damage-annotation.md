---
sidebar_position: 3
title: DamageAnnotation
hide_title: true
---

:::caution

This section refers to the old versions of the MonkJs SDK (version `3.X.X` and below). For the v4 docs, please refer to
[this page](docs/introduction.md).

:::

# DamageAnnotation

`DamageAnnotation` allows the user to highlight a damage manually with an ellipse. Then he can manipulate this ellipse
by moving and resizing it to match a damage.
[Try it with Expo Snack.](https://snack.expo.dev/@alexandre-em-monk/damageannotation-component)

![npm latest package](https://img.shields.io/npm/v/@monkvision/react-native/latest.svg)

```yarn
yarn add @monkvision/visualization
```

``` javascript
import { DamageAnnotation } from '@monkvision/visualization';
```

``` javascript
// Usage example
const image = {
  id: "uuid", // image's uuid
  width: 0, // original size of the image
  height: 0,
  source: {
    uri: "https://my_image_path.monk.ai"
  },
};

<DamageAnnotation image={image} />;
```

The property `image` comes from the result of an inspection, which is formatted with the
hooks [`usePolygon`](docs/v3-docs/apis/react-native/damage-highlight.md).

# Props

## inspectionId
`PropsType.string`

Inspection Id

## clip
`PropsType.bool`

Set the clip path property to show separate the polygons of the picture.

## image

``` javascript
PropTypes.shape({
  height: PropTypes.number,
  id: PropTypes.string, // image's uuid if existant, null if a new picture
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

<DamageAnnotation image={image}/>
```

## options

### backgroundOpacity
`PropsType.number`

Set the background image opacity (works only if clip is `true`)

### ellipse.stroke
`PropTypes.shape({ color: PropTypes.string, strokeWidth: PropTypes.number })`

Set the style of the ellipse by defining the stroke's color and width

### ellipse.anchor.{ x | y | o }
`PropsTypes.shape({ color: PropsTypes.string, radius: PropsTypes.number })`

Set the color of the ellipse's anchor icon of the `x` or `y` axis or the origin `o`'s color and size

```js
const options = {
  backgroundOpacity: 0.33,
  ellipse: {
    stroke: {
      color: 'yellow',
      strokeWidth: 2.5,
    },
    anchor: {
      x: {
        color: 'mediumseagreen',
        radius: 15,
      },
      y: {
        color: 'red',
        radius: 15,
      },
      o: {
        color: 'orange',
        radius: 15,
      },
    },
  },
};

<DamageAnnotation options={options} clip />
```

## renderOptions

### width
`PropsTypes.number`

Set the width of the rendered component

### height
`PropsTypes.number`

Set the height of the rendered component

### rx
`PropsTypes.number`

Set the ellipse's radius on the `x` axis

### ry
`PropsTypes.number`

Set the ellipse's radius on the `y` axis

# Methods
To use methods that `DamageHighlight` exposes one has to create a component `ref` and invoke them using it.
## createDamageView(damageType, partType)
`PropTypes.func`

Create a damage containing a `damageType: PropTypes.string` and a `partType: PropTypes.string` then create a new view on the current image (a freshly taken image or an already taken image) of the inspection with the bounding box calculated from the ellipse.
## reset()
`PropTypes.func`

Clear the image from the created ellipse.

```js
// ...
const damageAnnotationRef = useRef(null);

const createDamageView = useCallback(async () => {
  const base64 = await damageAnnotationRef.current.createDamageView('dent', 'bumper_back');
}, [damageAnnotationRef]);

// ...
<DamageAnnotation ref={damageAnnotationRef} image={inspection.images[0]} />
```

# Example


``` javascript
import React, { useState, useRef, useCallback } from 'react';
import { DamageAnnotation } from '@monkvision/visualization';

// Usage example
const image = {
  id: "uuid", // image's uuid
  width: 0, // original size of the image
  height: 0,
  source: {
    uri: "https://my_image_path.monk.ai"
  },
};

export default function App() {
  const ref = useRef(null);
  const [inspection, setInspection] = useState(null);
  const [partType, setPartType] = useState(null);
  const [damageType, setDamageType] = useState(null);

  const renderOptions = { width: 400, height: 220, rx: 100, ry: 100 };
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

  const handleAddDamage = useCallback(async () => {
    const newDamageView = await ref.current.createDamageView(damageType, partType);
  }, [ref]);

  return (
    <View>
      <DamageAnnotation
        image={image}
        options={options}
        renderOptions={renderOptions}
        clip
        ref={ref}
      />
      <Input onChange={setDamageType} placeholder="damage type?" />
      <Input onChange={setPartType} placeholder="part type?" />
      <Button onPress={handleAddDamage}>Add damage</Button>
    </View>
  )
}

```
