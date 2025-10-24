import { TestPublisher } from "./TestPublisher";
import { TestRequester } from "./TestRequester";
import { TestResponder } from "./TestResponder";
import { TestSubscriber } from "./TestSubscriber";

new TestResponder();
const requester = new TestRequester();
requester.test({ hello: "world" });

const publisher = new TestPublisher();
new TestSubscriber();

publisher.testEvent({ event: "data" });
