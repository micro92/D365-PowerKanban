# D365 Power Kanban

This is a custom PCF control for displaying a Kanban inside D365 datasets.

Features so far:
- Supports option sets, status codes and boolean attributes as swimlane sources
- Color schemes are taken from option set color values
- Primary and Secondary entities can be configured, so that you can show accounts and their child cases in one kanban board (choose view Advanced)
- Swimlanes with Drag and Drop functionality (allowed transitions can be defined for statuscode attributes inside their respective state transitions, or via custom script hook)
- Record Count as badge per lane
- Card forms can be used for customizing the display, they are rendered with clickable lookups
- Side-By-Side view for quick data view AND edit, where all your form scripts are considered (resizable in lower right corner)
- Modal forms for data view and edit (open per double click on tile or "Open in modal" button)
- Custom Buttons and Custom Forms on state transition (via custom script support)
- Search in data, highlighting and filtering
- Support for subscriptions and notifications to records, so that you can subscribe to record changes and see them
- Custom Dialogs, for allowing to also resolve cases, win opportunities etc from the board
- Works on entity lists as well as on form subgrids
- Columns that contain html (such as email descriptions) are converted to plain text

Todos:
- Virtualization and Performance Tweaking
- Plugins for automatically creating notifications for subscribed users are already done, need to change namespace

# Impressions
## Simple View (Primary Entity only)
![Screenshot_2020-06-23 Accounts My Active Accounts - Microsoft Dynamics 365(3)](https://user-images.githubusercontent.com/4287938/85367979-9cac1a80-b52a-11ea-8f7f-91c3e2a832d8.png)

## Advanced View (Primary Entity and Secondary Entity)
![Screenshot_2020-06-23 Accounts My Active Accounts - Microsoft Dynamics 365](https://user-images.githubusercontent.com/4287938/85366990-adf42780-b528-11ea-8848-bc035b21ae4f.png)

## Form View
![grafik](https://user-images.githubusercontent.com/4287938/88367426-fef77580-cd8b-11ea-9658-e1af8af17d1e.png)

## Custom Dialogs
![Screenshot_2020-06-23 Accounts My Active Accounts - Microsoft Dynamics 365(1)](https://user-images.githubusercontent.com/4287938/85367031-c2382480-b528-11ea-9864-c0b36f0e6e00.png)

## Side By Side View
![Screenshot_2020-06-23 Accounts My Active Accounts - Microsoft Dynamics 365(2)](https://user-images.githubusercontent.com/4287938/85367151-fdd2ee80-b528-11ea-9765-bd3a80337fcb.png)

# Installation
- Download and install the [latest managed solution](/../../releases/latest)
- Create at least one "PowerKanban Config" record for each entity where you want to use PowerKanban. Give it a unique name and enter a configuration json such as the following into the value field.
- Enable the PCF control for the entity you like and pass the unique name of the PowerKanban config you created as 'configName' property inside the PCF control if you want to use this config on start automatically. If you don't pass one, the kanban board will load with the config selector by default.

## Basic config
```json
{
    "primaryEntity": {
        "logicalName": "incident",
        "swimLaneSource": "statuscode"
    },
    "secondaryEntity": {
        "logicalName": "task",
        "parentLookup": "regardingobjectid",
        "swimLaneSource": "statuscode"
    }
}
```

## Config with enabled subscription and notification feature
```json
{
    "primaryEntity": {
        "logicalName": "incident",
        "swimLaneSource": "statuscode",
        "notificationLookup": "oss_incidentid",
        "subscriptionLookup": "oss_incidentid",
        "transitionCallback": "boardViewExtender.onStateTransition"
    },
    "secondaryEntity": {
        "logicalName": "task",
        "notificationLookup": "oss_taskid",
        "parentLookup": "regardingobjectid",
        "subscriptionLookup": "oss_taskid",
        "swimLaneSource": "statuscode"
    },
    "customScriptUrl": "/WebResources/oss_/D365BoardView/js/exampleExternalScript.js"
}
```
> customScriptUrl is only needed when you have transitionCallback configured on either primary or secondary entity

## Config with custom code callback on primary record drag and drop
```json
{
    "primaryEntity": {
        "logicalName": "incident",
        "swimLaneSource": "statuscode",
        "transitionCallback": "boardViewExtender.onStateTransition"
    },
    "secondaryEntity": {
        "logicalName": "task",
        "parentLookup": "regardingobjectid",
        "swimLaneSource": "statuscode"
    },
    "customScriptUrl": "/WebResources/oss_/D365BoardView/js/exampleExternalScript.js"
}
```

# Configuration

Below JSON schema describes the structure of the configuration:

```JSON
{
    "$schema": "http://json-schema.org/draft-07/schema",
    "$id": "http://example.com/example.json",
    "type": "object",
    "title": "PowerKanban Config",
    "description": "The schema of a complete PowerKanban configuration object",
    "default": {},
    "examples": [
        {
            "primaryEntity": {
                "logicalName": "incident",
                "swimLaneSource": "statuscode",
                "subscriptionLookup": "oss_incidentid",
                "notificationLookup": "oss_incidentid",
                "transitionCallback": "boardViewExtender.onStateTransition",
                "defaultView": "All Cases",
                "preventTransitions": false
            },
            "secondaryEntity": {
                "logicalName": "task",
                "parentLookup": "regardingobjectid",
                "swimLaneSource": "statuscode",
                "subscriptionLookup": "oss_taskid",
                "notificationLookup": "oss_taskid",
                "transitionCallback": "boardViewExtender.onSecondaryStateTransition",
                "defaultView": "All Tasks",
                "preventTransitions": false
            },
            "customScriptUrl": "/WebResources/oss_/D365BoardView/js/exampleExternalScript.js"
        }
    ],
    "required": [
        "primaryEntity"
    ],
    "properties": {
        "primaryEntity": {
            "$id": "#/properties/primaryEntity",
            "type": "object",
            "title": "The primaryEntity schema",
            "description": "This configures settings regarding the primary entity in a PowerKanban board. It is always needed",
            "default": {},
            "examples": [
                {
                    "logicalName": "incident",
                    "swimLaneSource": "statuscode",
                    "subscriptionLookup": "oss_incidentid",
                    "notificationLookup": "oss_incidentid",
                    "transitionCallback": "boardViewExtender.onStateTransition",
                    "defaultView": "All Cases",
                    "preventTransitions": false
                }
            ],
            "required": [
                "logicalName",
                "swimLaneSource",
            ],
            "properties": {
                "logicalName": {
                    "$id": "#/properties/primaryEntity/properties/logicalName",
                    "type": "string",
                    "title": "logicalName",
                    "description": "This is the logical name of this entity. Needs to be set.",
                    "default": "",
                    "examples": [
                        "incident"
                    ]
                },
                "swimLaneSource": {
                    "$id": "#/properties/primaryEntity/properties/swimLaneSource",
                    "type": "string",
                    "title": "swimLaneSource",
                    "description": "This defines which field to use for splitting data up into lanes. Always needed.",
                    "default": "",
                    "examples": [
                        "statuscode"
                    ]
                },
                "subscriptionLookup": {
                    "$id": "#/properties/primaryEntity/properties/subscriptionLookup",
                    "type": "string",
                    "title": "subscriptionLookup",
                    "description": "When using the subscription and notification feature, you need to create a new lookup on the subscription entity which points to the entity for which you want to subscribe for notifications. Pass the name of the lookup you created in here. If left out, subscription and notification controls will be unavailable",
                    "default": "",
                    "examples": [
                        "oss_incidentid"
                    ]
                },
                "notificationLookup": {
                    "$id": "#/properties/primaryEntity/properties/notificationLookup",
                    "type": "string",
                    "title": "notificationLookup",
                    "description": "When using the subscription and notification feature, you need to create a new lookup on the notification entity which points to the entity for which you want to receive notifications. Pass the name of the lookup you created in here. If left out, subscription and notification controls will be unavailable",
                    "default": "",
                    "examples": [
                        "oss_incidentid"
                    ]
                },
                "transitionCallback": {
                    "$id": "#/properties/primaryEntity/properties/transitionCallback",
                    "type": "string",
                    "title": "transitionCallback",
                    "description": "You can provide a custom function which runs on status transition of a record. You need to pass the function name, which may contain namespaces as well. If not passed, default behaviours will apply.",
                    "default": "",
                    "examples": [
                        "boardViewExtender.onStateTransition"
                    ]
                },
                "defaultView": {
                    "$id": "#/properties/primaryEntity/properties/defaultView",
                    "type": "string",
                    "title": "defaultView",
                    "description": "Provide a default view which will be selected initially. You can either pass the view name or the ID (without curly brackets). Case is ignored in all scenarios.",
                    "default": "First fetched view",
                    "examples": [
                        "All Cases",
                        "2B5F5A5D-2D23-4FE7-AA58-E77995368AE7"
                    ]
                },
                "preventTransitions": {
                    "$id": "#/properties/primaryEntity/properties/preventTransitions",
                    "type": "boolean",
                    "title": "preventTransitions",
                    "description": "This defines whether drag and drop will be prevented. If not defined, it will default to false and no drag and drop will be possible",
                    "default": false,
                    "examples": [
                        true
                    ]
                }
            },
            "additionalProperties": true
        },
        "secondaryEntity": {
            "$id": "#/properties/secondaryEntity",
            "type": "object",
            "title": "secondaryEntity",
            "description": "Configure a secondary entity in here, which can be displayed in separate swim lanes per primary record when switching to the advanced view.",
            "default": {},
            "examples": [
                {
                    "logicalName": "task",
                    "parentLookup": "regardingobjectid",
                    "swimLaneSource": "statuscode",
                    "subscriptionLookup": "oss_taskid",
                    "notificationLookup": "oss_taskid",
                    "transitionCallback": "boardViewExtender.onSecondaryStateTransition",
                    "defaultView": "All Tasks",
                    "preventTransitions": false
                }
            ],
            "required": [
                "logicalName",
                "parentLookup",
                "swimLaneSource"
            ],
            "properties": {
                "logicalName": {
                    "$id": "#/properties/secondaryEntity/properties/logicalName",
                    "type": "string",
                    "title": "logicalName",
                    "description": "This is the logical name of this entity. Needs to be set.",
                    "default": "",
                    "examples": [
                        "task"
                    ]
                },
                "parentLookup": {
                    "$id": "#/properties/secondaryEntity/properties/parentLookup",
                    "type": "string",
                    "title": "parentLookup",
                    "description": "Name of the lookup over which secondary entity is connected to primary entity. Used for displaying secondary records with their matching primary record. Always needed.",
                    "default": "",
                    "examples": [
                        "regardingobjectid"
                    ]
                },
                "swimLaneSource": {
                    "$id": "#/properties/secondaryEntity/properties/swimLaneSource",
                    "type": "string",
                    "title": "swimLaneSource",
                    "description": "This defines which field to use for splitting data up into lanes. Always needed.",
                    "default": "",
                    "examples": [
                        "statuscode"
                    ]
                },
                "subscriptionLookup": {
                    "$id": "#/properties/secondaryEntity/properties/subscriptionLookup",
                    "type": "string",
                    "title": "subscriptionLookup",
                    "description": "When using the subscription and notification feature, you need to create a new lookup on the notification entity which points to the entity for which you want to receive notifications. Pass the name of the lookup you created in here. If left out, subscription and notification controls will be unavailable",
                    "default": "",
                    "examples": [
                        "oss_taskid"
                    ]
                },
                "notificationLookup": {
                    "$id": "#/properties/secondaryEntity/properties/notificationLookup",
                    "type": "string",
                    "title": "notificationLookup",
                    "description": "When using the subscription and notification feature, you need to create a new lookup on the notification entity which points to the entity for which you want to receive notifications. Pass the name of the lookup you created in here. If left out, subscription and notification controls will be unavailable",
                    "default": "",
                    "examples": [
                        "oss_taskid"
                    ]
                },
                "transitionCallback": {
                    "$id": "#/properties/secondaryEntity/properties/transitionCallback",
                    "type": "string",
                    "title": "transitionCallback",
                    "description": "You can provide a custom function which runs on status transition of a record. You need to pass the function name, which may contain namespaces as well. If not passed, default behaviours will apply.",
                    "default": "",
                    "examples": [
                        "boardViewExtender.onSecondaryStateTransition"
                    ]
                },
                "defaultView": {
                    "$id": "#/properties/secondaryEntity/properties/defaultView",
                    "type": "string",
                    "title": "defaultView",
                    "description": "Provide a default view which will be selected initially. You can either pass the view name or the ID (without curly brackets). Case is ignored in all scenarios.",
                    "default": "First fetched view",
                    "examples": [
                        "All Tasks",
                        "2B5F5A5D-2D23-4FE7-AA58-E77995368AE7"
                    ]
                },
                "preventTransitions": {
                    "$id": "#/properties/secondaryEntity/properties/preventTransitions",
                    "type": "boolean",
                    "title": "preventTransitions",
                    "description": "This defines whether drag and drop will be prevented. If not defined, it will default to false and no drag and drop will be possible",
                    "default": false,
                    "examples": [
                        true
                    ]
                }
            },
            "additionalProperties": true
        },
        "customScriptUrl": {
            "$id": "#/properties/customScriptUrl",
            "type": "string",
            "title": "customScriptUrl",
            "description": "When using custom logic such as transitionCallbacks, you need to provide the url to the web resource where your custom code can be found, so that it can be fetched on load.",
            "default": "",
            "examples": [
                "/WebResources/oss_/D365BoardView/js/exampleExternalScript.js"
            ]
        }
    },
    "additionalProperties": true
}
```

# Create automatic notifications on events
You need to configure the Xrm.Oss.PowerKanban.CreateNotification plugin with new plugin steps registered to the entity events that interest you.

## Examples
### Events on subscribed record
A plugin for notifying users when the description of a case (that they subscribed to) can be created with this configuration:

```JSON
{
    "subscriptionLookupName": "oss_incidentid",
    "notificationLookupName": "oss_incidentid",
    "notifyCurrentUser": false,
    "capturedFields": [ "description" ]
}
```

### Events on sub entity of subscribed record
A plugin configuration for notifying users when a new task is created regarding a case (that they subscribed to) can be created with this configuration:

```JSON
{
    "parentLookupName": "regardingobjectid",
    "subscriptionLookupName": "oss_taskid",
    "notificationLookupName": "oss_taskid",
    "notifyCurrentUser": false,
    "capturedFields": [ "description" ]
}
```
