# grpc-server-mock

**Documentation will be improved in the near future**

## Installation

```
npm install -g grpc-server-mock
```

## Usage

### Start from auto-wire folder
Starts the server from the given autowire config.

Expected format:
```
|-- <autowire root folder>
|   |-- <arbitrary folder name that contains proto file and responses>
|   |   |-- <service_from_your_proto>
|   |   |   |-- <your_service_method_name1.json>
|   |   |   |-- <your_service_method_name2.json>
|   |   |-- <_otherservice_from_your_proto>
|   |   |   |-- <your_other_service_method_name1.json>
|   |   |   |-- <your_other_service_method_name2.json>
|   |   |   |-- <your_other_service_method_name3.json>
|   |   `-- <your.proto>
|   |-- <another arbitrary folder name that contains proto file and responses>
|   |   |-- <service_from_your_other_proto>
|   |   |   |-- <your_service_method_name1.json>
|   |   |   |-- <your_service_method_name2.json>
|   |   |-- <_otherservice_from_your_other_proto>
|   |   |   |-- <your_other_service_method_name1.json>
|   |   |   |-- <your_other_service_method_name2.json>
|   |   |   |-- <your_other_service_method_name3.json>
|   |   `-- <your_other.proto>
`
```

```json
[
  {
    "your_message_field_1": "<value>",
    "your_message_field_2": "<value>",
  },
  {
    "your_message_field_1": "<value>",
    "your_message_field_2": "<value>",
  }
]
```

### Start from config
Starts the server from the target config.

### GenerateConfigCommand
Generates Config file from target autowire folder.