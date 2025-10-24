import type { Event } from "cote";
import { ExtendedResponder } from "../Classes/Responder";

export class TestResponder extends ExtendedResponder {
  constructor() {
    super(
      { name: "responder", key: "demo" },
      {
        log: false,
      }
    );
  }

  test(req: Event, cb: (err: unknown, res?: any) => void) {
    console.log("[TestResponder] handler called with:", req);
    const res = { ok: true, echo: req };
    console.log("[TestResponder] responding with:", res);
    cb(null, res);
  }
}
