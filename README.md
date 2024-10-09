# Maplestory Music Quiz

Fullstack Typescript project including NextJS Frontend and Node Backend for music quiz application.

## Preface

Nx monorepo was built via:
```
npx create-nx-workspace
npx import [prior nodejs project]
```

## Installation

To Install nx cli locally:
```
npx add --global nx@latest
```

## Projects

This repo contains 2 projects:
- `orbis` - nextjs react web application
- `elnath` - backend nodejs server

This repo contains 1 e2e project:
- `orbis-e2e` - cypress testing framework for end-to-end testing

Nx project commands are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.


### Orbis

NextJs React Web Application.

To run the dev server for your app, use:

```sh
nx dev orbis
```

To create a production bundle:

```sh
nx build orbis
```

To see all available targets to run for a project, run:

```sh
nx show project orbis
```

### Elnath

NodeJS Backend Application

To run the dev server for your app, use:

```sh
nx dev elnath
```

To create a production bundle:

```sh
nx build elnath
```

To see all available targets to run for a project, run:

```sh
nx show project elnath
```
