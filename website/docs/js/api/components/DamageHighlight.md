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

<DamageHighlight image={image} polygons={polygons} />;
```

The component's properties are from the result of an inspection. Both of them are a part of `inspection.images`.

---

# Props
## backgroundOpacity
`PropTypes.number`

Allow to set an opacity to the background image.

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

## polygonsProps
```js
polygonsProps: PropTypes.shape({
  opacity: PropTypes.number,
  stroke: PropTypes.shape({
    color: PropTypes.string,
    strokeWidth: PropTypes.number,
  })
})
```

### opacity
`PropTypes.number`

Opacity of the picture of the damages inside the polygon.


### stroke.color
`PropTypes.string`

Color of the polygon's outlines

### stroke.strokeWidth
`PropTypes.number`

Polygon's outline strokes size

## savePng
`PropType.func`

Callback to convert the svg to a png image which is stored temporarily on the ram of the device.
The `generated image` is the only argument of the callback function on base64 format

## width
`PropTypes.number`

Allows to set the image's displayed width. The height will be computed afterwards

---
# Methods
## useDamageImage
### svgToPng

Convert the svg to a png image. Depending on the device, the function can have different arguments, and it returns a Promise of the url of the generated png image

```js
const { svgToPng } = useDamageImage(image, width);
```

#### Web

> For the web version, the svg must have an id linked to it, to be able to retrieve it

| Name       | Type            | Description                                                 |
|------------|-----------------|-------------------------------------------------------------|
| `image`    | [Image](#image) | Current image without polygons or labels                    |
| `id`       | String          | id of the current image                                     |

**Example:**
```js
  const url = await saveSvg(image, id);

  <Svg id={id}>(...)</Svg>
```

#### Native

> For the native version, the svg must have a reference linked to it to be able to retrieve it

| Name       | Type   | Description                         |
|------------|--------|-------------------------------------|
| `ref`      | Ref    | reference of the svg with the image |
| `width`    | Number | original width of the image         |
| `height`   | Number | original height of the image        |

**Example:**
```js
  const url = await saveSvg(svgRef, width, height);

  <Svg ref={(ref) => setSvgRef(ref)}>(...)</Svg>
```

## usePolygons

Extract properties from an API server response

### getPolygons
`PropTypes.func`

Get all polygons linked to an image and return a [list of polygons](#polygons)

| Name                          | Type     | Description                                            |
|-------------------------------|----------|--------------------------------------------------------|
| `imageId`                     | String   | Id of the current image                                |
| `views`                       | Views    | Contains all coordinates of all polygons of an `image` |

### getImage
`PropTypes.func`

Format an `image` to a classical [image](#image) object

| Name    | Type            | Description             |
|---------|-----------------|-------------------------|
| `image` | [Image](#image) | Inspection image object |

### Example
``` javascript
import { usePolygons } from '@monkvision/react-native';
```

``` javascript
const oneImage = inspection.images[0]; // result from API

const [getImage, getPolygons] = usePolygons();

<DamageHighlight
  image={getImage(oneImage)}
  polygons={getPolygons(oneImage.id, damage.views)[0]}
  polygonsProps={{
    opacity: 0.75,
    polygonsProps={{
      opacity: 0.5,
      stroke: {
        color: 'green',
        strokeWidth: 50,
      }
    }}
  }}
/>
```
