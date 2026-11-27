# xSTAR website

The website of xSTAR, a Wellcome-funded study of arboviruses across Africa, led from Imperial College London. It's built with [Astro](https://astro.build/) and published to GitHub Pages at <https://epic-ic.github.io/xstar-network/>. The current site is at <https://www.xstar-network.org/>.

## Running it

You need Node 24.22.1 (the version in `.nvmrc`).

```sh
npm install
npm run dev
```

Then open <http://localhost:4321/xstar-network/>.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Runs the site locally, reloading as you edit |
| `npm run prebuild` | Checks content references only. `npm run build` runs it first by itself |
| `npm run build` | Checks content references, then builds the site into `dist/` |
| `npm run preview` | Serves the built site from `dist/` |
| `npm test` | Runs the unit tests |
| `npm run coverage` | Runs the unit tests and fails below 100% coverage |
| `npm run check:types` | Type-checks the site with `astro check` |
| `npm run check:links` | Builds the site as Pages serves it and checks every link |
| `npm run check:accessibility` | Builds the site and checks each page against WCAG 2.2 AA with axe |

CI runs the build and every check on each pull request. Every merge to `main` deploys.

## Content

Content lives in `src/content/`, and `src/content.config.ts` sets the rules each item must follow.

| Collection | Where | One item is |
|---|---|---|
| Partners | `partners.yaml` | A partner institution, with its logo in `src/assets/partners/` |
| Publications | `publications.yaml` | A paper, by its DOI |
| People | `people/<language>/` | A Markdown file per person |
| News | `news/<language>/` | A Markdown file per post |
| Pages | `pages/<language>/` | A Markdown file per page, such as About |

A build fails if an item breaks its collection's rules or names a partner that doesn't exist. It also fails if two partners have the same name or order, or two people in the same language do.
