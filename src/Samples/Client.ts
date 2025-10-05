import { ExtendedRequester, request } from "../Classes/Requester";

class Client extends ExtendedRequester {
  constructor() {
    super({ name: "client", key: "demo" });
  }

  @request("test")
  test<T>(_payload: any, cb?: Function): Promise<T> {
    // dekoratör bu gövdeyi override eder
    return undefined as any;
  }
}

async function main() {
  const client = new Client();

  // discovery için kısa gecikme
  await new Promise((r) => setTimeout(r, 1200));

  // 1) Promise ile
  const res = await client.test({ test: "ping" });
  console.log("Requester > Promise res:", res);

  // 2) Callback ile
  client.test({ test: "ping2" }, (err: any, res2: any) => {
    console.log("Requester > Callback res:", err || res2);
    process.exit(0);
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
