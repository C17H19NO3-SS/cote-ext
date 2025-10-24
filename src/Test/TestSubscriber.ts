import { ExtendedSubscriber } from "../Classes/Subscriber";

export class TestSubscriber extends ExtendedSubscriber {
  constructor() {
    super(
      {
        name: "subscriber",
        key: "demo",
      },
      {
        log: false,
      }
    );
  }

  testEvent(req: any) {
    console.log("[TestSubscriber] received emit with:", req);
    const res = { message: "TestSubscriber received", req };
    this.cote.emit("testEventResponse", res);
  }
}
