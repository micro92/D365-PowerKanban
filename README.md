# D365 Power Kanban

This is a custom PCF control for displaying a Kanban inside D365 datasets.

Features so far:
- Supports option sets, status codes and boolean attributes as swimlane sources
- Color schemes are taken from option set color values
- Primary and Secondary entities can be configured, so that you can show accounts and their child cases in one kanban board (choose view Advanced)
- Swimlanes with Drag and Drop functionality (allowed transitions can be defined for statuscode attributes inside their respective state transitions, or via custom script hook)
- Card forms can be used for customizing the display, they are rendered with clickable lookups
- Side-By-Side view for quick data view AND edit, where all your form scripts are considered (resizable in lower right corner)
- Custom Buttons and Custom Forms on state transition (via custom script support)
- Search in data, highlighting and filtering
- Support for subscriptions and notifications to records, so that you can subscribe to record changes and see them
- Custom Dialogs, for allowing to also resolve cases, win opportunities etc from the board

Todos:
- Virtualization and Performance Tweaking
- Plugins for automatically creating notifications for subscribed users are already done, need to change namespace
- Pay respect to dataset data, we are only using views currently, so the entitylist views work right now, but subgrids need tweaking

# Impressions
## Simple View (Primary Entity only)
![Screenshot_2020-06-23 Accounts My Active Accounts - Microsoft Dynamics 365(3)](https://user-images.githubusercontent.com/4287938/85367979-9cac1a80-b52a-11ea-8f7f-91c3e2a832d8.png)

## Advanced View (Primary Entity and Secondary Entity)
![Screenshot_2020-06-23 Accounts My Active Accounts - Microsoft Dynamics 365](https://user-images.githubusercontent.com/4287938/85366990-adf42780-b528-11ea-8848-bc035b21ae4f.png)

## Custom Dialogs
![Screenshot_2020-06-23 Accounts My Active Accounts - Microsoft Dynamics 365(1)](https://user-images.githubusercontent.com/4287938/85367031-c2382480-b528-11ea-9864-c0b36f0e6e00.png)

## Side By Side View
![Screenshot_2020-06-23 Accounts My Active Accounts - Microsoft Dynamics 365(2)](https://user-images.githubusercontent.com/4287938/85367151-fdd2ee80-b528-11ea-9765-bd3a80337fcb.png)

# Installation
- Download and install the [latest managed solution](/releases/latest)
- Create at least one "PowerKanban Config" record for each entity where you want to use PowerKanban. Give it a unique name and enter a configuration json such as the following into the value field:
```json
{
    "primaryEntity": {
        "allowTransitions": true,
        "logicalName": "incident",
        "swimLaneSource": "statuscode",
        "notificationLookup": "oss_incidentid",
        "subscriptionLookup": "oss_incidentid",
        "transitionCallback": "boardViewExtender.onStateTransition"
    },
    "defaultViewId": "",
    "showCreateButton": true,
    "showDeleteButton": true,
    "showDeactivateButton": true,
    "secondaryEntity": {
        "allowTransitions": true,
        "logicalName": "task",
        "notificationLookup": "oss_taskid",
        "parentLookup": "regardingobjectid",
        "subscriptionLookup": "oss_taskid",
        "swimLaneSource": "statuscode"
    },
    "customScriptUrl": "/WebResources/oss_/D365BoardView/js/exampleExternalScript.js"
}
```
The notificationLookup and subscriptionLookup properties on primaryEntity and secondaryEntity can be omitted if you don't want to use the subscription / notification features.
- Enable the PCF control for the entity you like and pass the unique name of the PowerKanban config you created as 'configName' property inside the PCF control if you want to use this config on start automatically. If you don't pass one, the kanban board will load with the config selector by default.
