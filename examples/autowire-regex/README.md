Running `grpc-server-mock start:autowire --matched` from this folder will autowire `SomeSvc` from the `foo.proto` using the content provided in the `Action.json`.

Request payload will be regex matched against the provided inputs that have `regexMatch` set to true.

This can be observed in the provided `Action.json` file.