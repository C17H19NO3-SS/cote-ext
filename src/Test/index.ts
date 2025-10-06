import { TestRequester } from "./TestRequester";
import { TestResponder } from "./TestResponder";

new TestResponder();

console.log("Response >", await new TestRequester().test({ hello: "world" }));
