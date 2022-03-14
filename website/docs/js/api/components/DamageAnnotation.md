---
id: damage-annotation
title: "DamageAnnotation"
slug: /js/api/components/damage-annotation
---

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

const renderOptions = { width: 400, height: 220, rx: 100, ry: 100 };

<DamageAnnotation
  image={image}
  renderOptions={renderOptions}
  clip={false}
/>;
```

The property `image` comes from the result of an inspection, which is formatted with the
hooks [`usePolygon`](/docs/js/api/components/damage-highlight#usepolygons).

# Props

## clip
`PropsType.bool`

Set the clip path property to show separate the polygons of the picture.

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


### Example
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
