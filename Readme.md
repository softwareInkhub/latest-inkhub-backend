=================================================================================   HOCAdminService  ===============================================================================================


===================================================   BACKEND    ===================================================


==  Activity  ==

1. SchemaServiceActivity
2. ClientServiceActivity
3. FirebaseClientActivity

==  Builder  ==

==  Controller  ==

==  DataAccessor  ==

==  ClientAccessor  ==
1. FireBaseClientAccessor









===================================================   DATA MODEL - SCHEMA - JSON    ===================================================


2. SchemaTagsEnum



3. SchemaStatusEnum
default field: //datastore specific: AWS Dynamo, Firebase, JSON-Schema, MongoDB - JSON-Object-Schema

supported Data Types: String, Number, Boolean, DateTime-UTC, SET, Null, Object, Set<Object>





uuid: firebase:id
createAt: DateTime
createdBy: - (Dependecy UserManagementService)
lastUpdatedAt: DateTime
lastUpdateBy: - (Dependecy UserManagementService)
tags: ENUM SET
status: ENUM SET {Configuration}

Method:
1. Schema single CRUD operations
2. Schema Bulk operations:
    1. GetAll()

Created By: Mohit 
Date:

