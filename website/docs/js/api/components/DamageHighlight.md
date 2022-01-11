---
id: damage-highlight
title: "DamageHighlight"
slug: /js/api/components/damage-highlight
---

**Polygons on a vehicle picture.**
Damages are highlighted by the property `clipPath` while the opacity of the rest of the image is reduced to localized
the damage on the car.
[Try it with Expo Snack.](https://snack.expo.dev/@alexandre-em-monk/damagehighlight-component)

![npm latest package](https://img.shields.io/npm/v/@monkvision/react-native/latest.svg)

```yarn
yarn add @monkvision/react-native
```

``` javascript
import { DamageHighlight } from '@monkvision/react-native';
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

<DamageHighlight image={image} polygons={polygons} />;
```

The component's properties are from the result of an inspection. Both of them are a part of `inspection.images`.

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

## polygons

`PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.arrayO(PropTypes.number)))`

Polygons are 3 levels depth matrix and come from `inspection.images[i].views.image_region.polygons`.

1. list all polygons of a `damage` on the current `image`
2. list all `points` of a single `polygon`
3. is the `position` of a `point` in the plane (basically `x` and `y`)

```js
const polygons = [[[0, 0], [1, 0], [0, 1]], [[2, 0], [1, 1], [0, 2]]];

<DamageHighlight polygons={polygons}/>
```

## usePolygons

Extract properties from an API server response

``` javascript
import { usePolygons } from '@monkvision/react-native';
```

``` javascript
const oneImage = inspection.images[0]; // result from API

const [getImage, getPolygons] = usePolygons();

<DamageHighlight
  image={getImage(oneImage)}
  polygons={getPolygons(oneImage.id, damage.views)[0]}
/>
```

## Ellipse

It is also possible to manually add a damage by highlighting it with an ellipse which has properties:

```js
Ellipse.propTypes = {
  cx: PropTypes.number, // Position of the center
  cy: PropTypes.number,
  rx: PropTypes.number, // Radius of the ellipse on `x` axis
  ry: PropTypes.number, // Radius of the ellipse on `y` axis
};
```

Which we add some callback:

* `onAdd` that takes a SVG `event` as property to compute the location of the ellipse on the image
* `onValidated` that takes an `Ellipse` as a property
* `isValidate` allows to call `onValidated` function when the user validate the ellipse

It is especially used on
the [DamageAnnotation](https://monkvision.github.io/monkjs/docs/js/api/components/damage-annotation) component to
annotate the damage related to an image.

```jsx
// Example of use
<DamageHighlight
  image={image}
  ellipse={ellipse}
  isValidated={isValidated}
  onAdd={handleAddPoint}
  onValidate={handleValidate}
/>
```
