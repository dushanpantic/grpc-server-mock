Running `grpc-server-mock start:autowire` from this folder will autowire `SearchService` from the `SearchService.proto` using the content provided in the `Search.json`.

However, the `./search/common/` folder will not be treated as service folder due to the config set in the `./search/root.json`.
