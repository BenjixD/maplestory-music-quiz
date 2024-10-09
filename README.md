# Maplestory Music Quiz

Fullstack Typescript project including NextJS Frontend and Node Backend for music quiz application.

## nx

Monorepo built via:
```
npx create-nx-workspace
npx import [prior nodejs project]
```

To Install nx cli locally:
```
npx add --global nx@latest
```

run `nx graph` to visually explore what was created.

## Run tasks

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

These targets are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.
