import { ExtendedPublisher } from "../Classes/Publisher";

export class TestPublisher extends ExtendedPublisher {
  constructor() {
    super(
      {
        name: "publisher",
        key: "demo",
      },
      {
        log: false,
      }
    );
  }

  testEvent(req: any) {
    console.log("[TestPublisher] handler called with:", req);
    this.cote.publish("testEvent", req);
  }
}
