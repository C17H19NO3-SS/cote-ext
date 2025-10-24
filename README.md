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

# cote-ext

Professional TypeScript helpers for cote.js — source-first package

cote-ext provides compact, TypeScript-first helpers that simplify building cote Requesters/Responders/Publisher/Subscriber classes. The project is source-first (it exposes `.ts` sources directly) so you can iterate quickly using runtimes like Bun, tsx, or tools such as ts-node.

This README documents how to run the included test/demo classes (in `src/Test`), explains the provided helpers, and gives troubleshooting notes and recommended scripts.

Table of contents

- Overview
- Quick start (run tests in `src/Test`)
  - Single-process demo (quick)
  - Separate processes (server + client)
- Test files (what's inside `src/Test`)
- API reference (short)
- Development & running (commands)
- Troubleshooting
- Next steps
- License

---

Overview

- This repo provides `ExtendedRequester`, `ExtendedResponder`, `ExtendedPublisher`, and `ExtendedSubscriber` classes under `src/Classes` that autowire communication by inspecting subclass prototypes.
- Example/test code is located in `src/Test`. Use those files as canonical examples for how to use the helpers.

---

Quick start — run the tests in `src/Test`

Prerequisites

- Node (v16+ recommended)
- Either Bun (recommended for running `.ts` directly) OR `npx ts-node-esm` / `tsx` for TypeScript execution
- Project dependencies (install with npm/yarn/pnpm):

```powershell
npm install
```

Single-process demo (quick)

The `src/Test/index.ts` file starts a responder in-process and runs simple pub/sub + request/response flows. It uses the test classes in `src/Test` which log to the console when handlers run.

Run in a single terminal (Bun):

```powershell
bun x src/Test/index.ts
```

Or with ts-node (if Bun is not installed):

```powershell
npx ts-node-esm src/Test/index.ts
```

You should see console logs showing when each test handler is called and what responses are produced.

Separate processes (server + client)

You can run responder and requester in separate terminals. The responder will listen for requests; the requester/client will send requests.

Terminal 1 — start responder (example uses the TestResponder class):

```powershell
bun x src/Test/TestResponder.ts
# OR
npx ts-node-esm src/Test/TestResponder.ts
```

Terminal 2 — run the client (uses TestRequester / TestPublisher / TestSubscriber):

```powershell
bun x src/Test/index.ts
# OR
npx ts-node-esm src/Test/index.ts
```

Note: discovery in cote can take a short time on local runs. If you see timeouts or no responses, add a short delay before sending requests (for example: `await new Promise(r => setTimeout(r, 300))`).

---

Test files (what's in `src/Test`)

- `TestResponder.ts` — an `ExtendedResponder` that logs when its `test` handler is called and responds via the callback.
- `TestRequester.ts` — an `ExtendedRequester`; it provides `c_test` (non-autowired helper) which logs before/after sending and calls the auto-wired `test` method.
- `TestPublisher.ts` — an `ExtendedPublisher` which logs when its `testEvent` handler is invoked and what it returns.
- `TestSubscriber.ts` — an `ExtendedSubscriber` which logs when it receives emits and returns a result. (The class uses the autowiring in `src/Classes/Subscriber.ts`.)
- `index.ts` — a convenience runner that uses the above classes to exercise request/response and pub/sub flows and prints detailed logs.

These test classes are intentionally self-contained and log to the console so you can observe how the helpers autowire methods and how messages flow through cote.

---

Short API reference

- `ExtendedRequester` (src/Classes/Requester.ts)

  - Creates an internal `cote.Requester` and auto-creates Promise-wrapping methods on the subclass for each non-private prototype method. Methods call `cote.send({ type: methodName, ...payload }, cb)` internally.

- `ExtendedResponder` (src/Classes/Responder.ts)

  - Creates an internal `cote.Responder` and registers prototype methods as handlers. Methods should take `(req, cb)` and use the callback to return results.

- `ExtendedPublisher` / `ExtendedSubscriber`
  - Publisher methods are registered as handlers and receive `(req, cb, publisher)` so you can access the publisher instance if needed.
  - Subscriber methods call `this.cote.emit(eventName, payload, callback)` via an autowired wrapper — methods can be async and return values (the wrapper converts to Promise).

See the source under `src/Classes` for exact behavior and types.

---

Development & recommended scripts

Add the following convenience scripts to `package.json` if you want quick commands:

```jsonc
"scripts": {
  "test:single": "bun x src/Test/index.ts",
  "start:responder": "bun x src/Test/TestResponder.ts",
  "start:client": "bun x src/Test/index.ts",
  "typecheck": "npx tsc -p tsconfig.json --noEmit"
}
```

If Bun is not available, replace `bun x` with `npx ts-node-esm` or `npx tsx`.

Type checking

```powershell
npx tsc -p tsconfig.json --noEmit
```

---

Troubleshooting

- "type.slice is not a function" — root cause: an event emitter received a non-string event name (often because an object was passed as the first argument). The helpers in `src/Classes` wrap emit/send calls to ensure the event name is a string and the payload is a separate argument.
- `this.cote` is undefined inside a handler — root cause: handler method was called without being bound to the instance. The autowire code now wraps handlers and calls them with `.call(this,...)` to preserve instance context.
- Discovery/timeouts — add a short delay (300–1200ms) before sending requests in local single-process tests.
- Running TypeScript files directly — prefer Bun, `tsx`, or `ts-node` which understand TS source import semantics. If consumers cannot load `.ts`, either publish compiled JS or document the required runtimes.

If you run into a specific error, open the file under `src/Test` referenced by the stack trace and check the test log lines — the test classes log entry and exit points to make debugging easier.

---

Next steps (I can help with any of these):

- Add the `scripts` above to `package.json` automatically.
- Add a minimal GitHub Actions workflow for typechecking (`npx tsc --noEmit`).
- Generate a small sample `dist` build pipeline to publish compiled JS instead of source-first.

Tell me which of the above you want next and I'll implement it.
