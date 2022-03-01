---
id: inspections
title: "Inspection"
slug: /js/api/inspections
---

![npm latest package](https://img.shields.io/npm/v/@monkvision/corejs/latest.svg)

```yarn
yarn add @monkvision/corejs
```

## getOne({ id, params })
`GET /inspections/${id}`

Returns an inspection with all its tasks.

```javascript
const id = 'one-valid-inspection-id'
const res = await monkApi.inspections.getOne({ id });
```

[Try it on api.monk.ai](https://api.monk.ai/v1/apidocs/#/Inspection/get_inspection)

### Query params
| **name**             | **type** | **default** |
|----------------------|----------|-------------|
| `params`             | Object   |             |
| `params.showDeletedObjects` | boolean  | false       |
| `requestConfig`      | Object   |             |

### Response schema
```json
{
  "axiosResponse": {
    "status": "",
    "statusText": "",
    "headers": {},
    "data": {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "object_type": "ANNOTATION_TYPE",
      "owner_id": "string",
      "created_at": "2022-02-28T11:01:28.947Z",
      "deleted_at": "2022-02-28T11:01:28.947Z",
      "creator_id": "string",
      "signature_date": "2022-02-28T11:01:28.947Z",
      "images": [
        {
          "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "object_type": "ANNOTATION_TYPE",
          "path": "string",
          "name": "string",
          "image_height": 0,
          "image_width": 0,
          "binary_size": 0,
          "mimetype": "string",
          "views": [
            {
              "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
              "object_type": "ANNOTATION_TYPE",
              "created_at": "2022-02-28T11:01:28.947Z",
              "deleted_at": "2022-02-28T11:01:28.947Z",
              "element_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
              "created_by": "string",
              "image_region": {
                "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                "object_type": "ANNOTATION_TYPE",
                "image_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                "specification": {
                  "bounding_box": {
                    "xmin": 0,
                    "ymin": 0,
                    "width": 0,
                    "height": 0
                  },
                  "polygons": [
                    [
                      [
                        0
                      ]
                    ]
                  ]
                }
              },
              "rendered_outputs": [
                {
                  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                  "object_type": "ANNOTATION_TYPE",
                  "path": "string",
                  "created_at": "2022-02-28T11:01:28.948Z",
                  "deleted_at": "2022-02-28T11:01:28.948Z",
                  "base_image_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
                }
              ]
            }
          ],
          "rendered_outputs": [
            {
              "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
              "object_type": "ANNOTATION_TYPE",
              "path": "string",
              "created_at": "2022-02-28T11:01:28.948Z",
              "deleted_at": "2022-02-28T11:01:28.948Z",
              "base_image_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
            }
          ],
          "wheel_analysis": {
            "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "object_type": "ANNOTATION_TYPE",
            "rim_condition": {
              "prediction": "string",
              "confidence": 0
            },
            "rim_material": {
              "prediction": "string",
              "confidence": 0
            },
            "hubcap_over_rim": {
              "prediction": "string",
              "confidence": 0
            },
            "rim_visual_aspect": {
              "prediction": "string",
              "confidence": 0
            },
            "hubcap_condition": {
              "prediction": "string",
              "confidence": 0
            },
            "hubcap_visual_aspect": {
              "prediction": "string",
              "confidence": 0
            }
          },
          "has_vehicle": true,
          "viewpoint": {
            "prediction": "string",
            "confidence": 0
          },
          "detailed_viewpoint": {
            "is_exterior": true,
            "centers_on": "front",
            "distance": "string"
          },
          "damage_area": {
            "relevant_elements": [
              "front"
            ],
            "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
          }
        }
      ],
      "damages": [
        {
          "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "object_type": "ANNOTATION_TYPE",
          "created_at": "2022-02-28T11:01:28.948Z",
          "deleted_at": "2022-02-28T11:01:28.948Z",
          "damage_type": "string",
          "created_by": "string",
          "inspection_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "part_ids": [
            "3fa85f64-5717-4562-b3fc-2c963f66afa6"
          ]
        }
      ],
      "parts": [
        {
          "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "object_type": "ANNOTATION_TYPE",
          "created_at": "2022-02-28T11:01:28.948Z",
          "deleted_at": "2022-02-28T11:01:28.948Z",
          "part_type": "string",
          "created_by": "string",
          "inspection_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "damage_ids": [
            "3fa85f64-5717-4562-b3fc-2c963f66afa6"
          ],
          "part_operation": {
            "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "object_type": "ANNOTATION_TYPE",
            "created_at": "2022-02-28T11:01:28.948Z",
            "deleted_at": "2022-02-28T11:01:28.948Z",
            "part_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "name": "string",
            "labour_details": {
              "t1": 0,
              "t2": 0,
              "t3": 0,
              "m1": 0,
              "m2": 0,
              "m3": 0,
              "paint_hours": 0,
              "labour_hours": 0
            },
            "pieces_OEM_cost": 0,
            "total_cost": 0,
            "severity": 0
          }
        }
      ],
      "vehicle": {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "object_type": "ANNOTATION_TYPE",
        "created_at": "2022-02-28T11:01:28.948Z",
        "deleted_at": "2022-02-28T11:01:28.948Z",
        "repair_estimate": 0,
        "brand": "string",
        "model": "string",
        "plate": "string",
        "vehicle_type": "string",
        "mileage_unit": "km",
        "mileage_value": 0,
        "market_value_unit": "string",
        "market_value_value": 0,
        "vin": "string",
        "color": "string",
        "exterior_cleanliness": "string",
        "interior_cleanliness": "string",
        "date_of_circulation": "string"
      },
      "documents": [
        {
          "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "object_type": "ANNOTATION_TYPE",
          "created_at": "2022-02-28T11:01:28.948Z",
          "deleted_at": "2022-02-28T11:01:28.948Z",
          "inspection_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "type": "PASSPORT"
        }
      ],
      "tasks": [
        {
          "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "object_type": "ANNOTATION_TYPE",
          "created_at": "2022-02-28T11:01:28.948Z",
          "status": "NOT_STARTED",
          "done_at": "2022-02-28T11:01:28.948Z",
          "name": "damage_detection",
          "inspection_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "error_messages": [
            {
              "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
              "object_type": "ANNOTATION_TYPE",
              "created_at": "2022-02-28T11:01:28.948Z",
              "error_code": 0,
              "trace_id": "string",
              "message": "string"
            }
          ],
          "images": [
            {
              "image_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
            }
          ],
          "confidence_pre_execution": true,
          "confidence_post_execution": true,
          "confidence_pre_execution_status": "NOT_STARTED"
        }
      ],
      "inspection_type": "claim",
      "accident_nature": "string",
      "related_inspection_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "usage_duration": 0
    }
  },
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "entities": {
    "damageAreas": {
      "3fa85f64-5717-4562-b3fc-2c963f66afa6": {
        "relevantElements": [
          "front"
        ],
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
      }
    },
    "views": {
      "3fa85f64-5717-4562-b3fc-2c963f66afa6": {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "objectType": "ANNOTATION_TYPE",
        "createdAt": "2022-02-28T11:01:28.947Z",
        "deletedAt": "2022-02-28T11:01:28.947Z",
        "elementId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "createdBy": "string",
        "imageRegion": {
          "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "object_type": "ANNOTATION_TYPE",
          "image_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "specification": {
            "bounding_box": {
              "xmin": 0,
              "ymin": 0,
              "width": 0,
              "height": 0
            },
            "polygons": [
              [
                [
                  0
                ]
              ]
            ]
          }
        },
        "renderedOutputs": [
          {
            "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "object_type": "ANNOTATION_TYPE",
            "path": "string",
            "created_at": "2022-02-28T11:01:28.948Z",
            "deleted_at": "2022-02-28T11:01:28.948Z",
            "base_image_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
          }
        ]
      }
    },
    "images": {
      "3fa85f64-5717-4562-b3fc-2c963f66afa6": {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "objectType": "ANNOTATION_TYPE",
        "path": "string",
        "name": "string",
        "imageHeight": 0,
        "imageWidth": 0,
        "binarySize": 0,
        "mimetype": "string",
        "views": [
          "3fa85f64-5717-4562-b3fc-2c963f66afa6"
        ],
        "renderedOutputs": [
          {
            "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "object_type": "ANNOTATION_TYPE",
            "path": "string",
            "created_at": "2022-02-28T11:01:28.948Z",
            "deleted_at": "2022-02-28T11:01:28.948Z",
            "base_image_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
          }
        ],
        "wheelAnalysis": {
          "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "object_type": "ANNOTATION_TYPE",
          "rim_condition": {
            "prediction": "string",
            "confidence": 0
          },
          "rim_material": {
            "prediction": "string",
            "confidence": 0
          },
          "hubcap_over_rim": {
            "prediction": "string",
            "confidence": 0
          },
          "rim_visual_aspect": {
            "prediction": "string",
            "confidence": 0
          },
          "hubcap_condition": {
            "prediction": "string",
            "confidence": 0
          },
          "hubcap_visual_aspect": {
            "prediction": "string",
            "confidence": 0
          }
        },
        "hasVehicle": true,
        "viewpoint": {
          "prediction": "string",
          "confidence": 0
        },
        "detailedViewpoint": {
          "is_exterior": true,
          "centers_on": "front",
          "distance": "string"
        },
        "damageArea": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
      }
    },
    "damages": {
      "3fa85f64-5717-4562-b3fc-2c963f66afa6": {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "objectType": "ANNOTATION_TYPE",
        "createdAt": "2022-02-28T11:01:28.948Z",
        "deletedAt": "2022-02-28T11:01:28.948Z",
        "damageType": "string",
        "createdBy": "string",
        "inspectionId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "partIds": [
          "3fa85f64-5717-4562-b3fc-2c963f66afa6"
        ],
        "parts": [
          "3fa85f64-5717-4562-b3fc-2c963f66afa6"
        ]
      }
    },
    "vehicles": {
      "3fa85f64-5717-4562-b3fc-2c963f66afa6": {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "objectType": "ANNOTATION_TYPE",
        "createdAt": "2022-02-28T11:01:28.948Z",
        "deletedAt": "2022-02-28T11:01:28.948Z",
        "repairEstimate": 0,
        "brand": "string",
        "model": "string",
        "plate": "string",
        "vehicleType": "string",
        "mileageUnit": "km",
        "mileageValue": 0,
        "marketValueUnit": "string",
        "marketValueValue": 0,
        "vin": "string",
        "color": "string",
        "exteriorCleanliness": "string",
        "interiorCleanliness": "string",
        "dateOfCirculation": "string"
      }
    },
    "tasks": {
      "damage_detection": {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "objectType": "ANNOTATION_TYPE",
        "createdAt": "2022-02-28T11:01:28.948Z",
        "status": "NOT_STARTED",
        "doneAt": "2022-02-28T11:01:28.948Z",
        "name": "damage_detection",
        "inspectionId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "errorMessages": [
          {
            "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "object_type": "ANNOTATION_TYPE",
            "created_at": "2022-02-28T11:01:28.948Z",
            "error_code": 0,
            "trace_id": "string",
            "message": "string"
          }
        ],
        "images": [],
        "confidencePreExecution": true,
        "confidencePostExecution": true,
        "confidencePreExecutionStatus": "NOT_STARTED",
        "parts": {
          "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
        }
      }
    },
    "inspections": {
      "3fa85f64-5717-4562-b3fc-2c963f66afa6": {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "objectType": "ANNOTATION_TYPE",
        "ownerId": "string",
        "createdAt": "2022-02-28T11:01:28.947Z",
        "deletedAt": "2022-02-28T11:01:28.947Z",
        "creatorId": "string",
        "signatureDate": "2022-02-28T11:01:28.947Z",
        "images": [
          "3fa85f64-5717-4562-b3fc-2c963f66afa6"
        ],
        "damages": [
          "3fa85f64-5717-4562-b3fc-2c963f66afa6"
        ],
        "parts": [
          {
            "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "object_type": "ANNOTATION_TYPE",
            "created_at": "2022-02-28T11:01:28.948Z",
            "deleted_at": "2022-02-28T11:01:28.948Z",
            "part_type": "string",
            "created_by": "string",
            "inspection_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "damage_ids": [
              "3fa85f64-5717-4562-b3fc-2c963f66afa6"
            ],
            "part_operation": {
              "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
              "object_type": "ANNOTATION_TYPE",
              "created_at": "2022-02-28T11:01:28.948Z",
              "deleted_at": "2022-02-28T11:01:28.948Z",
              "part_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
              "name": "string",
              "labour_details": {
                "t1": 0,
                "t2": 0,
                "t3": 0,
                "m1": 0,
                "m2": 0,
                "m3": 0,
                "paint_hours": 0,
                "labour_hours": 0
              },
              "pieces_OEM_cost": 0,
              "total_cost": 0,
              "severity": 0
            }
          }
        ],
        "vehicle": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "documents": [
          {
            "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "object_type": "ANNOTATION_TYPE",
            "created_at": "2022-02-28T11:01:28.948Z",
            "deleted_at": "2022-02-28T11:01:28.948Z",
            "inspection_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "type": "PASSPORT"
          }
        ],
        "tasks": [
          "damage_detection"
        ],
        "inspectionType": "claim",
        "accidentNature": "string",
        "relatedInspectionId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "usageDuration": 0
      }
    }
  },
  "result": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}
```

## getMany({ params })
`GET /inspections`

Returns all inspections created by user/organization.

```javascript
const res = await monkApi.inspections.getMany({});
```

[Try it on api.monk.ai](https://api.monk.ai/v1/apidocs/#/Inspection/get_all_inspections)

### Query params
| **name**                       | **type**        | **default** |
|--------------------------------|-----------------|-------------|
| `params`                       | Object          |             |
| `params.limit`                 | number          | 100         |
| `params.before`                | $uuid: {string} |             |
| `params.after`                 | $uuid: {string} |             |
| `params.paginationOrder`       | "asc" or "desc" | `desc`      |
| `params.onwershipFilter`       | string          |             |
| `params.inspectionStatus`      | string          |             |
| `params.allInspections`        | boolean         | false       |
| `params.allInspectionsInOrganization` | boolean  | false       |
| `params.verbose`               | number          | 0           |

### Response schema
```json
{
  "axiosResponse": {
    "status": "",
    "statusText": "",
    "headers": {},
    "data": [
      {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "object_type": "ANNOTATION_TYPE",
        "created_at": "2022-02-28T11:38:53.013Z",
        "deleted_at": "2022-02-28T11:38:53.013Z",
        "images": [
          {
            "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "object_type": "ANNOTATION_TYPE",
            "path": "string",
            "name": "string",
            "image_height": 0,
            "image_width": 0,
            "binary_size": 0,
            "mimetype": "string"
          }
        ],
        "owner_id": "string",
        "creator_id": "string",
        "damages": [
          null
        ]
      },
      {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "object_type": "ANNOTATION_TYPE",
        "created_at": "2022-02-28T11:38:53.013Z",
        "deleted_at": "2022-02-28T11:38:53.013Z",
        "images": [
          {
            "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "object_type": "ANNOTATION_TYPE",
            "path": "string",
            "name": "string",
            "image_height": 0,
            "image_width": 0,
            "binary_size": 0,
            "mimetype": "string"
          }
        ],
        "owner_id": "string",
        "creator_id": "string"
      }
    ]
  },
  "entities": {
    "inspections": {
        "3fa85f64-5717-4562-b3fc-2c963f66afa6": {
          "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "object_type": "ANNOTATION_TYPE",
          "created_at": "2022-02-28T11:38:53.013Z",
          "deleted_at": "2022-02-28T11:38:53.013Z",
          "images": [
            {
              "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
              "object_type": "ANNOTATION_TYPE",
              "path": "string",
              "name": "string",
              "image_height": 0,
              "image_width": 0,
              "binary_size": 0,
              "mimetype": "string"
            }
          ],
          "owner_id": "string",
          "creator_id": "string",
          "damages": [
            null
          ]
        },
        "3fa85f64-5717-4562-b3fc-2c963f66afa6": {
          "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "object_type": "ANNOTATION_TYPE",
          "created_at": "2022-02-28T11:38:53.013Z",
          "deleted_at": "2022-02-28T11:38:53.013Z",
          "images": [
            {
              "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
              "object_type": "ANNOTATION_TYPE",
              "path": "string",
              "name": "string",
              "image_height": 0,
              "image_width": 0,
              "binary_size": 0,
              "mimetype": "string"
            }
          ],
          "owner_id": "string",
          "creator_id": "string"
        }
    }
  }
}
```
## createOne({ data })
`POST /inspections`

An inspection contains data about the state of a vehicle at a given time. Returns a unique inspection id.

> You must create an inspection with the list of all the tasks
you will ever want to apply on this inspection.
You can add images directly or add images later.
You must specify on the images also what task you want to apply to the image.
When a task have started it is too late to edit it
or to add more image on which you want to apply task.


```javascript
const data = { tasks, images, vehicle, damageAreas };
const res = await monkApi.inspections.createOne({ data });
```

[Try it on api.monk.ai](https://api.monk.ai/v1/apidocs/#/Inspection/post_inspection)

### Body data
| **name**                 | **type**   | **default** |
|--------------------------|------------|-------------|
| `data`                   | Object     |             |
| `data.tasks`             | array      |             |
| `data.tasks.damage_detection` | Object    |             |
| `data.tasks.wheel_analysis`   | Object    |             |
| `data.tasks.images_ocr`       | Object    |             |
| `data.images`                 | \[Object\] |             |
| `data.vehicle`                | Object     |             |
| `damageAreas`            | \[Object\] |             |
| `requestConfig`          | Object     |             |

### Response schema
```json
{
  "axiosResponse": {
    "status": "",
    "statusText": "",
    "headers": {},
    "data": {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "object_type": "ANNOTATION_TYPE"
    }
  },
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "entities": {
    "images": {
      "3fa85f64-5717-4562-b3fc-2c963f66afa6": {
        "name": "string",
        "rotateImageBeforeUpload": "NO_ROTATION",
        "tasks": [
          {
            "name": "damage_detection",
            "image_details": {
              "viewpoint_name": "string"
            }
          },
          {
            "name": "images_ocr"
          },
          "damage_detection"
        ]
      }
    },
    "vehicles": {
      "3fa85f64-5717-4562-b3fc-2c963f66afa6": {
        "brand": "string",
        "model": "string",
        "plate": "string",
        "vehicleType": "string",
        "mileage": {
          "value": 0,
          "unit": "km"
        },
        "marketValue": {
          "value": 0,
          "unit": "string"
        },
        "serie": "string",
        "vehicleStyle": "string",
        "vehiculeAge": "string",
        "vin": "string",
        "color": "string",
        "exteriorCleanliness": "string",
        "interiorCleanliness": "string",
        "dateOfCirculation": "string"
      }
    },
    "tasks": {
      "3fa85f64-5717-4562-b3fc-2c963f66afa6": {
        "status": "NOT_STARTED",
        "damageScoreThreshold": 0,
        "callbacks": [
          {
            "url": "string",
            "headers": {},
            "params": {}
          }
        ],
        "generateSubimagesParts": {
          "generate_tight": true,
          "margin": 0,
          "damage_view_part_interpolation": 0,
          "ratio": 0,
          "quality": 0
        },
        "generateSubimagesDamages": {
          "generate_tight": true,
          "margin": 0,
          "damage_view_part_interpolation": 0,
          "ratio": 0,
          "quality": 0
        },
        "generateVisualOutput": {
          "generate_parts": false,
          "generate_damages": true
        },
        "scoring": {},
        "images": []
      }
    },
    "inspections": {
      "3fa85f64-5717-4562-b3fc-2c963f66afa6": {
        "tasks": [
          null,
          null,
          null,
          null
        ],
        "images": [
          null
        ],
        "inspectionType": "claim",
        "accidentNature": "string",
        "relatedInspectionId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "usageDuration": 0,
        "damageAreas": [
          {
            "relevant_elements": [
              "front"
            ]
          }
        ]
      }
    }
  }
}
```

## upsertOne({ data })
`POST /inspections`

> Please keep in mind that the **id** is mandatory in the **data** param, otherwise it will be considered as `createOne.


```javascript
const data = { id, tasks, images, vehicle, damageAreas };
const res = await monkApi.inspections.upsertOne({ data });
```
[Try it on api.monk.ai](https://api.monk.ai/v1/apidocs/#/Inspection/post_inspection)

### Body data
| **name**                 | **type**   | **default** |
|--------------------------|------------|-------------|
| `data`                   | Object     |             |
| `data.id`                | string     |             |
| `data.tasks`             | array      |             |
| `data.tasks.damage_detection` | Object    |             |
| `data.tasks.wheel_analysis`   | Object    |             |
| `data.tasks.images_ocr`       | Object    |             |
| `data.images`                 | \[Object\] |             |
| `data.vehicle`                | Object     |             |
| `damageAreas`            | \[Object\] |             |
| `requestConfig`          | Object     |             |

### Response schema
```json
{
  "axiosResponse": {
    "status": "",
    "statusText": "",
    "headers": {},
    "data": {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "object_type": "ANNOTATION_TYPE"
    }
  },
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "entities": {
    "images": {
      "3fa85f64-5717-4562-b3fc-2c963f66afa6": {
        "name": "string",
        "rotateImageBeforeUpload": "NO_ROTATION",
        "tasks": [
          {
            "name": "damage_detection",
            "image_details": {
              "viewpoint_name": "string"
            }
          },
          {
            "name": "images_ocr"
          },
          "damage_detection"
        ]
      }
    },
    "vehicles": {
      "3fa85f64-5717-4562-b3fc-2c963f66afa6": {
        "brand": "string",
        "model": "string",
        "plate": "string",
        "vehicleType": "string",
        "mileage": {
          "value": 0,
          "unit": "km"
        },
        "marketValue": {
          "value": 0,
          "unit": "string"
        },
        "serie": "string",
        "vehicleStyle": "string",
        "vehiculeAge": "string",
        "vin": "string",
        "color": "string",
        "exteriorCleanliness": "string",
        "interiorCleanliness": "string",
        "dateOfCirculation": "string"
      }
    },
    "tasks": {
      "3fa85f64-5717-4562-b3fc-2c963f66afa6": {
        "status": "NOT_STARTED",
        "damageScoreThreshold": 0,
        "callbacks": [
          {
            "url": "string",
            "headers": {},
            "params": {}
          }
        ],
        "generateSubimagesParts": {
          "generate_tight": true,
          "margin": 0,
          "damage_view_part_interpolation": 0,
          "ratio": 0,
          "quality": 0
        },
        "generateSubimagesDamages": {
          "generate_tight": true,
          "margin": 0,
          "damage_view_part_interpolation": 0,
          "ratio": 0,
          "quality": 0
        },
        "generateVisualOutput": {
          "generate_parts": false,
          "generate_damages": true
        },
        "scoring": {},
        "images": []
      }
    },
    "inspections": {
      "3fa85f64-5717-4562-b3fc-2c963f66afa6": {
        "tasks": [
          null,
          null,
          null,
          null
        ],
        "images": [
          null
        ],
        "inspectionType": "claim",
        "accidentNature": "string",
        "relatedInspectionId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "usageDuration": 0,
        "damageAreas": [
          {
            "relevant_elements": [
              "front"
            ]
          }
        ]
      }
    }
  }
}
```

## addAdditionalDataToOne({ id, data })
`PATCH /inspections/${id}/pdf_data`

```javascript
const data = { mileage: { value, unit }, marketValue :{ value, unit } agentFirstName, agentLastName, agentCompany, agentCompanyCity, vehicleOwnerFirstName, vehicleOwnerLastName, vehicleOwnerAddress, vehicleOwnerPhone, vehicleOwnerEmail, dateOfStart, dateOfValidation, vinOrRegistering, comment };

const res = await monkApi.inspections.addAdditionalDataToOne({ data });
```

[Try it on api.monk.ai](https://api.monk.ai/v1/apidocs/#/Inspection/edit_inspection_pdf_data)

### Body data
| **name**                 | **type**   | **default** |
|--------------------------|------------|-------------|
| `id`                     | string     |             |
| `data`                   | Object     |             |
| `data.mileage`           | Object     |             |
| `data.mileage.value`     | number     |             |
| `data.mileage.unit`      | string     |             |
| `data.marketValue`       | number     |             |
| `data.marketValue.value` | number     |             |
| `data.marketValue.unit`  | string     |             |
| `data.agentFirstName`    | string     |             |
| `data.agentLastName`     | string     |             |
| `data.agentCompany`      | string     |             |
| `data.agentCompanyCity`  | string     |             |
| `data.vehicleOwnerFirstName`  | string     |             |
| `data.vehicleOwnerLastName`  | string     |             |
| `data.vehicleOwnerAddress`  | string     |             |
| `data.vehicleOwnerPhone` | string     |             |
| `data.vehicleOwnerEmail` | string     |             |
| `data.dateOfStart`       | string     |             |
| `data.dateOfValidation`  | string     |             |
| `data.vinOrRegistering`  | string     |             |
| `data.comment`           | string     |             |
| `requestConfig`          | Object     |             |

### Response schema
```json
{
  "axiosResponse": {
    "status": "",
    "statusText": "",
    "headers": {},
    "data": {
      "mileage": {
        "value": 0,
        "unit": "km"
      },
      "market_value": {
        "value": 0,
        "unit": "string"
      },
      "agent_first_name": "string",
      "agent_last_name": "string",
      "agent_company": "string",
      "agent_company_city": "string",
      "vehicle_owner_first_name": "string",
      "vehicle_owner_last_name": "string",
      "vehicle_owner_address": "string",
      "vehicle_owner_phone": "string",
      "vehicle_owner_email": "string",
      "date_of_start": "string",
      "date_of_validation": "string",
      "vin_or_registering": "string",
      "comment": "string"
    }
  },
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "entities": {
    "images": {
      "3fa85f64-5717-4562-b3fc-2c963f66afa6": {
        "name": "string",
        "rotateImageBeforeUpload": "NO_ROTATION",
        "tasks": [
          {
            "name": "damage_detection",
            "image_details": {
              "viewpoint_name": "string"
            }
          },
          {
            "name": "images_ocr"
          },
          "damage_detection"
        ]
      }
    },
    "vehicles": {
      "3fa85f64-5717-4562-b3fc-2c963f66afa6": {
        "brand": "string",
        "model": "string",
        "plate": "string",
        "vehicleType": "string",
        "mileage": {
          "value": 0,
          "unit": "km"
        },
        "marketValue": {
          "value": 0,
          "unit": "string"
        },
        "serie": "string",
        "vehicleStyle": "string",
        "vehiculeAge": "string",
        "vin": "string",
        "color": "string",
        "exteriorCleanliness": "string",
        "interiorCleanliness": "string",
        "dateOfCirculation": "string"
      }
    },
    "tasks": {
      "3fa85f64-5717-4562-b3fc-2c963f66afa6": {
        "status": "NOT_STARTED",
        "damageScoreThreshold": 0,
        "callbacks": [
          {
            "url": "string",
            "headers": {},
            "params": {}
          }
        ],
        "generateSubimagesParts": {
          "generate_tight": true,
          "margin": 0,
          "damage_view_part_interpolation": 0,
          "ratio": 0,
          "quality": 0
        },
        "generateSubimagesDamages": {
          "generate_tight": true,
          "margin": 0,
          "damage_view_part_interpolation": 0,
          "ratio": 0,
          "quality": 0
        },
        "generateVisualOutput": {
          "generate_parts": false,
          "generate_damages": true
        },
        "scoring": {},
        "images": []
      }
    },
    "inspections": {
      "3fa85f64-5717-4562-b3fc-2c963f66afa6": {
        "tasks": [
          null,
          null,
          null,
          null
        ],
        "images": [
          null
        ],
        "inspectionType": "claim",
        "accidentNature": "string",
        "relatedInspectionId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "usageDuration": 0,
        "damageAreas": [
          {
            "relevant_elements": [
              "front"
            ]
          }
        ]
      }
    }
  }
}
```

## deleteOne({ id })
`DELETE /inspections/${id}`

```javascript
const id = 'one-valid-inspection-id'
const res = await monkApi.inspections.deleteOne({ id });
```

[Try it on api.monk.ai](https://api.monk.ai/v1/apidocs/#/Inspection/delete_inspection)

### Query params
| **name**             | **type** | **default** |
|----------------------|----------|-------------|
| `id`                 | string   |             |
| `requestConfig`      | Object   |             |

### Response schema
```json
{
  "axiosResponse": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "object_type": "ANNOTATION_TYPE"
  },
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "entities": {
    "inspections": {
      "3fa85f64-5717-4562-b3fc-2c963f66afa6": {
        "deleted": true,
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
      }
    }
  },
  "result": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}
```
