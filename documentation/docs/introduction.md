---
sidebar_position: 1
title: Introduction
---

# MonkJs
MonkJs is a NodeJs SDK, designed for React and React Native to help developers interact with the Monk API more easily.

# Monk Workflow
Monk offers AI solutions that allow users and developers to analyze pictures of vehicles in order to detect various
elements such as damages, cost of repair and such. In order to use these AI solutions, developers can use Monk's API
that exposes endpoints to communicate with the AI models. The usual Monk workflow when using our API looks like this :

1. Log into our Auth0 authentication service with a registered account and get the authentication token. This token
  should be included with every request made to the Monk API.
2. Create an *Inspection* using the `POST /inspection` endpoint, and specify which AI models (which *Tasks*) you want to
  run during this inspection.
3. Take pictures of your vehicle and add them to your inspection using the `POST /inspection/{id}/images` endpiont. For
  each picture, specify which *Task* you want to run on it.
4. *(optional)* Ask the API to analyze the quality of the images before running the AI models on them
5. Once all the pictures are uploaded, tell the API to start inspection *Tasks* by using the
  `PATCH /inspection/{id}/tasks/{name}` endpoint.
6. Wait for the *Tasks* to complete.
7. Obtain the results of the inspection using the `GET /inspection` endpoint.
8. *(optional)* Update the AI results if some of them are wrong using the different severity endpoints.
9. Ask the API to generate a PDF report containing the summary of the inspection results using the
  `POST /inspections/${id}/pdf` endpoint.
10. Wait for the PDF to be generated.
11. Download your PDF report using the `GET /inspections/${id}/pdf` endpoint.

The MonkJs SDK offers solutions to easily implement this workflow into your web or native application. If you want to
implement this workflow yourself, you can refer to our [API Documentation](https://documentation.preview.monk.ai/) and
[API Swagger](https://api.monk.ai/v1/apidocs/) for more documentation.

# The SDK
Among other things, the MonkJs SDK offers the following tools to implement the workflow mentionned above :

- A package called [network](docs/packages/network.md) that offers utility functions to easily communicate with our API.
- A single-page component called [InspectionCapture](docs/packages/inspection-capture-web.md) that you can place in your
  app to display a camera preview and allow users to take pictures of their vehicle, analyze the quality of the pictures
  taken and upload them to the API.
- A single-page component called [InspectionReport](docs/packages/inspection-report-web.md) that you can place in your app
  to display the results of an insepction, update the results if needed, and ask the API to generate the PDF report.

The complete list of packages available in the MonkJs SDK is described in [this page](/docs/category/packages).
