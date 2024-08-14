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

## Structure

Core files and folders

```
src/
├── app.ts             // main express instance
├── bootstrap.ts       // main plugin wrapper
├── init.ts            // initialization SYNC processes (MUST IMPORT IN `main.ts` BEFORE ANYTHING ELSE)
├── lib/
│   ├── common/        // contains shared resources for the entire application
│   └── constant
│       └── env.ts     // environment variables
├── main.ts            // main entrypoint
├── plugins/           // contains plugin files
├── routes/            // contains route function files
├── schemas/           // contains schema files (json schema)
├── services/          // contains services/ injectables
└── test.ts            // test entrypoint (executes test files)
```
