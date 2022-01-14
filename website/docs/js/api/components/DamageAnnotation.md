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
yarn add @monkvision/react-native
```

``` javascript
import { DamageAnnotation } from '@monkvision/react-native';
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

const handleAdd = (ellipse) => {
  console.log(ellipse);
}

const handleRemove = (ellipse) => {
  console.log(ellipse);
}

const handleValidate = (ellipse) => {
  addViewDamage(inspectionId, damageId, image, ellipse);
}

<DamageAnnotation
  image={image}
  onAdd={handleAdd}
  onRemove={handleRemove}
  onValidate={handleValidate}
/>;
```

The property `image` comes from the result of an inspection, which is formatted with the
hooks [`usePolygon`](https://monkvision.github.io/monkjs/docs/js/api/components/damage-highlight#usepolygons).

The argument `ellipse` of each callback has the following format:

```js
// Ellipse format
Ellipse.propTypes = {
  cx: PropTypes.number, // Position of the center
  cy: PropTypes.number,
  rx: PropTypes.number, // Radius of the ellipse on `x` axis
  ry: PropTypes.number, // Radius of the ellipse on `y` axis
};
```

And can be used to compute the `bounding_box` needed to generate a `View` on the Monk API.
