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
