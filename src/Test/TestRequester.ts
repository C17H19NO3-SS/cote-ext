import { ExtendedRequester } from "../Classes/Requester";

export class TestRequester extends ExtendedRequester {
  constructor() {
    super(
      { name: "responder", key: "demo" },
      {
        log: false,
      }
    );
  }

  test(req: { hello: string }) {}
}
