import {
  Requester,
  type DiscoveryOptions,
  type ResponderAdvertisement,
} from "cote";

export class ExtendedRequester {
  public cote: Requester;

  constructor(
    options: ResponderAdvertisement,
    discoveryOptions?: DiscoveryOptions
  ) {
    this.cote = new Requester(options, discoveryOptions);
    this._autowire();
  }

  private _autowire() {
    const proto = Object.getPrototypeOf(this);
    const privFuncs = ["constructor", "_autowire", "on", "eventNames"];
    for (const key of Object.getOwnPropertyNames(proto)) {
      if (privFuncs.some((v) => v === key) || key.startsWith("c_")) continue;
      (this as any)[key] = (req: any) => {
        return new Promise((resolve, reject) => {
          this.cote.send(
            {
              type: key,
              ...req,
            },
            (err: unknown, res: any) => {
              if (err) reject(err);
              else resolve(res);
            }
          );
        });
      };
    }
  }
}
