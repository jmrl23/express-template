# Express Template

template for building express application

[![Express](https://i.cloudup.com/zfY6lL7eFa-3000x3000.png)](http://expressjs.com/)

## Installation

```sh
yarn # or npm install
```

## Scripts

| Script     | Description                                 |
| ---------- | ------------------------------------------- |
| build      | build project                               |
| test       | run test files                              |
| start      | start (must build first)                    |
| start:dev  | start on development mode (nodemon + swc)   |
| start:prod | start on production mode (must build first) |
| format     | format codes (prettier)                     |
| lint       | lint codes (eslint)                         |

## Structure

Core files and folders

```
src/
├── app.ts                        # main express instance
├── bootstrap.ts                  # main plugins entrypoint
├── init.ts                       # initialization file
├── lib/                          # libraries
│   ├── common/
│   │   ├── index.ts
│   │   ├── logger.ts
│   │   ├── swagger.ts
│   │   ├── typings.ts
│   │   ├── validate.ts
│   │   └── wrapper.ts
│   └── constant/
│       └── env.ts
├── main.ts                       # main entrypoint
├── modules/
│   ├── cache/
│   │   ├── cacheService.spec.ts
│   │   └── cacheService.ts
│   └── todos/                    # example module
│       ├── todos.route.ts
│       ├── todosSchema.ts
│       ├── todosService.spec.ts
│       └── todosService.ts
├── plugins/
│   ├── middlewares.ts
│   ├── routes.ts
│   └── swagger.ts
└── test.ts                       # test entrypoint (run all test files)
```
