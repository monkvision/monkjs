---
id: corejs
title: "🧿 corejs"
slug: /js/api/corejs
---
![npm next package](https://img.shields.io/npm/v/@monkvision/corejs/next.svg)

Install with `npm`
``` npm
npm install @monkvision/corejs @reduxjs/toolkit --save
```

Install from `yarn`
``` yarn
yarn add @monkvision/corejs @reduxjs/toolkit
```

## MonkCore

Based on Redux, the core instance provides a set of tools to request manipulation of Monk data.

``` javascript
import MonkCore, { getBaseQuery } from '@monkvision/corejs';
import dotenv from 'dotenv'

// Use the env config tool that fit your own project
// For example:
// import Constants from 'expo-constants';
// const config = Constants.manifest.extra;

const config = dotenv.config()

if (config.error) {
  throw config.error
}

const monkCore = new MonkCore(getBaseQuery({
  baseUrl: `https://${config.MONK_DOMAIN}/`,
}));

export default monkCore;
```

### APIs
* [inspection](#inspection-api)
* [damage](#damage-api)

## Inspection API
``` javascript
import monkCore from 'config/monkCore';

// Your own components...
import Loading from 'components/Loading';
import Empty from 'components/Empty';
import Inspection from 'components/Inspection';

const { useGetInspectionsQuery } = monkCore.inspection;

function App() {
  const { data, isLoading } = useGetInspectionsQuery();

  if (isLoading) {
    return <Loading />;
  }

  if (isEmpty(data)) {
    return <Empty />;
  }

  return data.map((props) => <Inspection {...props) />;
}
```

### useGetInspectionByIdQuery

``` javascript
const { useGetInspectionsQuery } = monkCore.inspection;
const { data, isLoading } = useGetInspectionsQuery(id);
```

### useGetInspectionsQuery

``` javascript
const { useGetInspectionsQuery } = monkCore.inspection;
const { data, isLoading } = useGetInspectionsQuery({ limit: 20 });
```

### useGetAllInspectionsQuery

``` javascript
const { useGetAllInspectionsQuery } = monkCore.inspection;
```

### usePostOneInspectionQuery

``` javascript
const { usePostOneInspectionQuery } = monkCore.inspection;
```

## Damage API

## Sights
