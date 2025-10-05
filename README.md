# cote-ext

TypeScript decorators and lightweight helpers for cote.js to make building Requesters and Responders more ergonomic and type-friendly.

This package provides small, focused utilities:

- `ExtendedRequester` — a thin subclass of `cote.Requester` that works with the `@request(type)` decorator.
- `ExtendedResponder` — a thin subclass of `cote.Responder` which automatically wires prototype-decorated handlers on construction.
- `request(type)` — method decorator for Requester methods that sends a cote request and returns a Promise or accepts a callback. Supports optional timeout.
- `on(event)` — method decorator for Responder prototype methods to register event handlers.
- `init(responder)` — low-level helper that attaches decorated handlers from the prototype to an instance (used internally by `ExtendedResponder`).

## Table of contents

- Installation
- Quick examples
- API reference
- Samples and runnable examples
- Publishing to npm
- Contributing
- License

## Installation

This package is written in TypeScript and exported as an ECMAScript module. It has a peer dependency on TypeScript and is designed to be used with bun, Node.js (with native ESM), or bundlers that understand ESM.

Install from npm:

```bash
npm install cote-ext
```

Install development dependencies (optional):

# cote-ext

TypeScript decorators and small helpers for cote.js. This README was updated to match the example in `src/Samples/Client.ts`.

The package provides:

- `ExtendedRequester` — thin subclass of `cote.Requester` that works together with `@request(type)`.
- `ExtendedResponder` — thin subclass of `cote.Responder` which wires prototype-decorated handlers at construction.
- `request(type)` — method decorator for Requester methods (Promise or callback usage, supports timeout).
- `on(event)` — method decorator for Responder prototype methods.
- `init(responder)` — helper to attach decorated handlers from a prototype to an instance.

## Quick example (matches Samples/Client.ts)

Below is the client example as used in `src/Samples/Client.ts`. It demonstrates the decorator usage, a short discovery delay, and both Promise and callback styles.

```ts
import { ExtendedRequester, request } from "../Classes/Requester";

class Client extends ExtendedRequester {
  constructor() {
    super({ name: "client", key: "demo" });
  }

  @request("test")
  test(_payload: any, _a?: any, _b?: any): any {
    // decorator overrides this body
    return undefined as any;
  }
}

async function main() {
  const client = new Client();

  // short delay for discovery
  await new Promise((r) => setTimeout(r, 1200));

  // 1) Promise
  const res = await client.test({ test: "ping" });
  console.log("Requester > Promise res:", res);

  // 2) Callback
  client.test({ test: "ping2" }, (err: any, res2: any) => {
    console.log("Requester > Callback res:", err || res2);
    process.exit(0);
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
```

## Notes on the client example

- The sample uses a short discovery wait (1200 ms) before sending requests so responders have time to announce themselves on the network.
- `@request` supports both Promise and Node-style callback usage. If you pass a callback as the last argument the method will use it; otherwise it returns a Promise.
- In the example the client is constructed with `{ name: "client", key: "demo" }`. Adjust `key` and `name` as your topology requires.

## API summary

- `ExtendedRequester` — extends `cote.Requester`. Construct with the same advertisement options as cote.
- `request(type)` — method decorator. Sends `{ type, ...payload }` if payload is an object, or `{ type }` otherwise. Accepts optional timeout via an options object `{ timeout?: number }`.
- `ExtendedResponder` & `on(event)` — decorate responder prototype methods; `ExtendedResponder` calls `init(this)` to bind decorated handlers to the instance.
- `init(responder)` — attach decorated handlers from prototype to given instance (call manually if you don't use `ExtendedResponder`).

## Samples

The repository contains `src/Samples/Client.ts`. I can add a matching `Samples/Server.ts` that responds to the `test` type if you'd like runnable examples for development with `bun` or `ts-node`.

## Contributing

Contributions welcome. Typical workflow:

1. Fork
2. Create a branch
3. Add tests/examples if relevant
4. Open a PR

## License

This project is released under the GNU General Public License v3 (GPLv3). See the `LICENSE` file for the full text.

If you'd like the README to use the package root import paths (for published usage) instead of the local sample imports, I can update the examples accordingly.
