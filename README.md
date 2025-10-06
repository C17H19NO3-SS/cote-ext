# cote-ext

Professional TypeScript helpers for cote.js — source-first package

cote-ext provides compact, well-typed helpers that simplify building Requesters and Responders with cote.js in TypeScript-first projects. The library is intentionally source-first (it exposes `.ts` files directly) to support fast iteration with runtimes like bun or tools like tsx/ts-node.

This README contains a concise project overview, examples (from `src/Test`), running instructions, API reference, publishing considerations, and troubleshooting notes.

---

Table of contents

- Project overview
- Installation
- Quick examples (exactly from `src/Test`)
  - A. Single-process demo (quick test)
  - B. Separate processes (server + client)
- API reference
  - ExtendedRequester
  - ExtendedResponder
- Running & development
- Distribution & publishing notes
- Contributing
- Troubleshooting
- License

---

Project overview

- Designed for TypeScript-first workflows.
- Provides `ExtendedRequester` and `ExtendedResponder` class helpers that autowire communication patterns by inspecting class prototypes.
- Example/test code lives in `src/Test` and `src/Samples`.

---

Installation

If you publish this package to npm, consumers can install it:

```bash
npm install cote-ext
```

During development, run the examples using `bun` (recommended for direct TypeScript), `tsx`, or `ts-node`.

---

Quick examples (copied from `src/Test`)

These examples are verbatim from the repository. Use them to validate the project locally.

A. Single-process demo (quick test)

File: `src/Test/index.ts`

```ts
import { TestRequester } from "./TestRequester";
import { TestResponder } from "./TestResponder";

// Start responder in the same process (convenient for quick testing)
new TestResponder();

// Send a test request and print the response
console.log("Response >", await new TestRequester().test({ hello: "world" }));
```

Run (single terminal):

```powershell
bun run src/Test/index.ts
# or
npx tsx src/Test/index.ts
```

B. Separate processes (server + client)

Responder (server) — `src/Test/TestResponder.ts`:

```ts
import type { Event } from "cote";
import { ExtendedResponder } from "../Classes/Responder";

export class TestResponder extends ExtendedResponder {
  constructor() {
    super({ name: "responder", key: "demo" });
  }

  test(req: Event, cb: (err: unknown, res?: any) => void) {
    console.log("Request received >", req);
    cb(null, { ok: true, echo: req });
  }
}
```

Start the responder (terminal 1):

```powershell
bun run src/Test/TestResponder.ts
# or
npx tsx src/Test/TestResponder.ts
```

Requester (client) — use the TestRequester or `src/Samples/Client.ts`:

```ts
// src/Test/TestRequester.ts
import { ExtendedRequester } from "../Classes/Requester";

export class TestRequester extends ExtendedRequester {
  constructor() {
    super({ name: "requester", key: "demo" });
  }

  test(req: Record<string, any>) {}
}
```

Run the client after the responder is running (terminal 2):

```powershell
bun run src/Test/index.ts
# or run a client file that uses TestRequester
```

Notes on discovery: small local demos often need a short delay before the client sends requests. Example: `await new Promise(r => setTimeout(r, 1200))`.

---

API reference

ExtendedRequester (src/Classes/Requester.ts)

- Behavior:
  - Creates an internal `cote.Requester` instance and inspects the subclass prototype.
  - Replaces non-private prototype methods with wrappers that call `this.cote.send({ type: methodName, ...payload }, cb)`.
  - Wrappers return a Promise when no callback is provided, otherwise they call the provided callback.

ExtendedResponder (src/Classes/Responder.ts)

- Behavior:
  - Creates an internal `cote.Responder` instance and autowires prototype methods as handlers using `responder.on(methodName, handler)`.
  - Handler methods should accept `(req, cb)` and use the callback to return results.

Type tips

- Since the package is source-first, ensure method signatures are flexible (accept optional callback and/or options) so the runtime wrappers can be used both with Promise and callback styles. See `src/Samples/Client.ts` for recommended shapes.

---

Running & development

Recommend using `bun` for quick local runs. Alternative: `tsx` or `ts-node`.

Example scripts (add them to `package.json` for convenience):

```jsonc
"scripts": {
  "start:responder": "bun run src/Test/TestResponder.ts",
  "start:client": "bun run src/Test/index.ts"
}
```

Type checking locally:

```bash
npm install
npx tsc -p tsconfig.json --noEmit
```

---

Distribution & publishing notes

Current package is configured as a TypeScript-source package:

- `module` -> `src/index.ts`
- `types` -> `src/Types/index.ts`
- `exports` -> includes type entry and source entry

Recommendations before publishing:

- Confirm `package.json` metadata: `name`, `version`, `description`, `author`, `repository`.
- Choose distribution strategy:
  - Source-first (current): publish `src/`, document that consumers need TS-aware runtimes.
  - Compiled: add a build step to emit `dist/` and update `main/module/types` to point to `dist/`.
- Add `files` in `package.json` to explicitly include what you want to publish, e.g. `["src","README.md","LICENSE"]`.

---

Contributing

- Fork, create a topic branch, run `npx tsc --noEmit`, open a PR with tests or sample updates.

---

Troubleshooting

- Decorator/typing issues: ensure method implementations accept the parameter shapes expected by wrappers (payload, optional options or callback).
- Discovery timing: in local runs add a short delay before sending requests.
- If consumers cannot import `.ts` files, either publish compiled JS or instruct consumers to use `bun`/`tsx`/`ts-node`.

---

License

This project is licensed under GPLv3 (see `LICENSE`).

---

If you want, I can now:

- Add the `start:responder` / `start:client` scripts directly to `package.json`.
- Add a minimal GitHub Actions workflow that runs `npx tsc --noEmit` on PRs.
- Convert this README's examples to use package-root imports (i.e., `import { ExtendedRequester } from 'cote-ext'`) to show published usage.

Which one would you like next?
