# grpc-server-mock

**Documentation will be improved in the near future**

## Installation

```
npm install -g grpc-server-mock
```

## Usage

### Start from auto-wire folder
Starts the server from the given autowire config.
An example can be found in the [examples folder.](./examples)

```
grpc-server-mock start:autowire
```
Options:
```
--host     Server host.                                [default: "127.0.0.1"]
--port     Server port.                                    [default: "50051"]
--folder   Path to folder with files for autowireing.          [default: "."]
--silent   If true, noop logger will be used       [boolean] [default: false]
```

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
```
grpc-server-mock start:config
```
Options:
```
--folder   Path to file with config.     [default: "./grpc-server-mock.json"]
--silent   If true, noop logger will be used       [boolean] [default: false]
```

### GenerateConfigCommand
Generates Config file from target autowire folder.
```
grpc-server-mock generate:config
```
Options:
```
--host     Server host.                                [default: "127.0.0.1"]
--port     Server port.                                    [default: "50051"]
--folder   Path to folder with files for autowireing.          [default: "."]
--output   Desired path to output file.  [default: "./grpc-server-mock.json"]
```
