# AGENTS.md — Guidelines for AI Coding Agents in This Repository

> Purpose: This document tells AI coding agents exactly **how to make safe, high‑quality, CI‑green contributions** to this large JavaScript (AngularJS) monorepo. Treat it as your CONTRIBUTING.md.

---

## 0) Non‑Negotiable Principles

1. **Never break `main`.** All work must go through a PR with required checks green.
2. **Follow the repo’s conventions before your own.** Detect current patterns (tooling, versions, code style) and **match them**.
3. **Small, atomic changes.** One topic per PR. Large refactors must be split into incremental steps.
4. **Reproducibility over cleverness.** Prefer explicit scripts and lockfiles; avoid magic.
5. **Security & privacy first.** Never commit secrets, tokens, or PII. Obey `.gitignore`.

---

## 1) Toolchain & Environment

- **Node.js**: Use the version declared in `.nvmrc` or `engines.node` in `package.json`. If both exist, prefer `.nvmrc`.
- **Package manager**: Use **npm** with the provided `package-lock.json`.
- **Formatting**: Don't hand-format code. Always run `npm run prettier` before committing any changes.
- **Lockfiles are mandatory.** Never delete or regenerate with a different tool unless the PR is explicitly about migrating package managers.
- **Chrome for tests**: Karma/Jasmine run headless. If touching the Karma config, ensure `ChromeHeadless` with `--no-sandbox` and `--disable-dev-shm-usage` flags remains supported.

### Allowed commands (examples)

```bash
# with npm
npm run test
npm run prettier
npm run lint
npm run build
npm run docs
```

> Agents must **use existing package scripts** instead of raw tool invocations when available.

---

## 2) Git & Branching

- **Branch from `main`**: `feature/<short-topic>`, `fix/<short-topic>`, or `chore/<short-topic>`.
- **Keep history clean**: Rebase your branch on latest `main` before opening/updating PRs.
- **No force‑push to protected branches.**

### Commit messages — Conventional Commits

Use the format:

```
<type>(<scope>): <short summary>

<body>

BREAKING CHANGE: <details>
```

Allowed `<type>`: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.

Examples:

- `fix(auth): prevent double bootstrap on token refresh`
- `test(directives): add specs for date parser`
- `build(deps): bump angular 1.8.x to latest patch`

---

## 3) Package & Dependency Rules

1. **Match existing semver style** used in the repo (e.g., caret `^`, tilde `~`, or pinned). Do not mix styles.
2. **Lockfile discipline**:
   - If you change `package.json`, you **must** update the lockfile in the **same commit**:
     - npm: `npm install --package-lock-only` (or run the actual install) → commit `package-lock.json`.

3. **Dependency upgrades**:
   - Patch/minor: allowed if tests and type checks pass.
   - Major: open a separate PR with migration notes, links to changelogs, and code mods if needed.

4. **Do not add transient, unused deps.** If added, show usage in code or remove.
5. **Security**: Prefer fixes suggested by `npm audit`. When suppressing, document why in the PR.

---

## 4) AngularJS Code Standards

- **Component first**: Prefer `angular.module(...).component()` over legacy controllers where feasible.
- **DI safety**: Use array annotation or `ng-annotate`/`ng-strict-di` so minification is safe.
- **Modules**: Keep module names stable; avoid circular deps.
- **Templates**: Put HTML in template files; test them via `ng-html2js` preprocessor.
- **Avoid global state**: Use services/factories; avoid leaking to `window`.
- **Controllers**: Use `controllerAs` syntax; avoid `$scope` unless required by legacy zones. When necessary, scope usage must be minimal.
- **Async**: Prefer `$http`/`$q`/promises consistent with existing code; don’t introduce new async libs casually.
- **Performance**: Avoid deep `$watch`. Use one‑time bindings `::` where safe.

---

## 5) Testing Policy (Karma + Jasmine)

- **Mandatory**: All new logic must come with Jasmine specs.
- **Coverage**: Maintain or improve coverage. If the repo defines thresholds, they must stay green.
- **Headless**: Ensure tests run in `ChromeHeadless` in CI; do not remove `--no-sandbox`/`--disable-dev-shm-usage` flags.
- **Fixtures & Templates**: If a test relies on HTML templates, configure `ng-html2js` and load the `templates` module.

Example snippet for `karma.conf.js` (reference):

```js
customLaunchers: {
  ChromeHeadlessNoSandbox: {
    base: 'ChromeHeadless',
    flags: [
      '--headless=new',
      '--no-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--window-size=1920,1080'
    ]
  }
},
browsers: ['ChromeHeadlessNoSandbox'],
```

---

## 6) Linting & Formatting

- **ESLint**: Run `lint` and fix autofixable issues (`--fix`) when appropriate.
- **Prettier**: Formatting is automated. Run `npm run prettier` before committing; do not tweak its config.
- **No style churn**: Do not reformat unrelated files; limit formatting to the changed lines/files.

**IMPORTANT: Don't bother formatting code yourself while editing the code, simply run `npm run prettier`.**

---

## 7) CI & Local Verification

Before committing, an agent must run:

```bash
# Install dependencies
npm ci

# Prettier
npm run prettier

# Lint & tests
npm run lint
npm run test
npm run docs
npm run test:e2e
```

CI must pass on all required jobs (lint, tests, build). If CI scripts live in `.github/workflows/`, **do not** modify them unless the task is specifically about CI.

---

## 8) Files & Project Hygiene

- **Respect folder layout** (e.g., `src/`, `test/`, `app/`, `lib/`). Add new files where similar ones live.
- **No build artifacts**: Don’t commit `dist/` unless the repo historically does and the PR is about releases.
- **Docs**: Update README/CHANGELOG when user‑visible behavior or public APIs change.
- **Feature flags**: Follow existing patterns; default to disabled unless specified.

---

## 9) PR Checklist (Agent MUST verify all)

- [ ] Branch created from latest `main` and rebased
- [ ] Conventional Commit messages used
- [ ] Only one logical topic in this PR
- [ ] `package.json` and lockfile updated together (if applicable)
- [ ] `npm run prettier` executed
- [ ] Lint passes locally (`npm run lint`)
- [ ] Docs build passes locally (`npm run docs`)
- [ ] Tests added/updated and passing locally (`npm run test`)
- [ ] CI green (tests, lint, build) (`npm run test:e2e`)
- [ ] Docs/notes updated (if behavior changed)

---

## 10) Safe Refactors Policy

When refactoring legacy AngularJS code:

- **No behavior changes** without tests first.
- Introduce components gradually; keep APIs stable.
- Use codemods or scripted edits where possible; include the script in the PR for traceability.
- Run tests after each logical step; keep commits small.

---

## 11) Dependency & Browser Support

- **Target browsers**: Keep compatibility as declared in the repo (e.g., Chrome headless in CI). Do not drop support without approval.
- **Polyfills**: If adding/removing, document rationale and verify bundle impact.

---

## 12) Security & Compliance

- No secrets in code, configs, or tests. Use environment variables or CI secrets.
- For third‑party code: include license headers or NOTICE updates if required.
- Avoid introducing network access in tests unless mocked.

---

## 13) Communication in PRs

- Provide a clear description, screenshots/GIFs for UI changes, and migration notes when relevant.
- Link issues, RFCs, or discussion threads.
- For breaking changes, include a **Migration** section and mark `BREAKING CHANGE` in the commit trailer.

---

## 14) Examples

### Updating a Dependency (npm example)

```bash
# 1) create branch
git checkout -b build/deps-angular-mocks-1.8.4

# 2) update and lock
npm install angular-mocks@^1.8.4 --save-dev

# 3) verify
npm run lint
npm run test:ci

# 4) commit with conventional message
git add package.json package-lock.json
git commit -m "build(deps-dev): bump angular-mocks to ^1.8.4"
```

### Adding a Test for a Fix (npm example)

```bash
# implement fix in src/...
# add matching spec in test/... or src/**/*\.spec.js

npm ci
npm run lint --fix
npm run test:ci

git add -A
git commit -m "fix(date-parser): handle empty input correctly"
```

---

## 15) What Agents MUST NOT Do

- Do **not** change package manager or Node version casually.
- Do **not** reformat the entire codebase.
- Do **not** commit failing tests or `xit`/`xdescribe` to bypass failures.
- Do **not** disable linters/TypeScript rules unless tightly scoped and justified.
- Do **not** introduce new libraries when built‑ins or existing deps suffice.

---

## 16) When in Doubt

1. Inspect similar files and follow the established pattern.
2. Run the full local verification suite.
3. Prefer clarity and tests over implicit behavior.

> These rules exist to keep this big AngularJS codebase reliable, fast to build, and easy to change. Follow them and your PRs will merge smoothly.
