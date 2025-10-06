import type { Event } from "cote";
import { ExtendedRequester } from "../Classes/Requester";

export class TestRequester extends ExtendedRequester {
  constructor() {
    super({ name: "responder", key: "demo" });
  }

  test(req: Record<string, any>) {}
}
