import { ExtendedResponder, on } from "../Classes/Responder";

type TestReq = { test: string };
type TestRes = { ok: boolean };

class ProductService extends ExtendedResponder {
  constructor() {
    // key aynı olmalı ki discovery eşleşsin
    super({ name: "product-service", key: "demo" });
    console.log("Responder up");
  }

  // Requester'dan gelen { type: "test", ... } için cevap ver
  @on("test")
  handleTest(req: TestReq, cb: (err: unknown, res: TestRes) => void) {
    console.log("Responder > test payload:", req);
    cb(null, { ok: true });
  }
}

new ProductService();
// Süreci açık tut
process.stdin.resume();
