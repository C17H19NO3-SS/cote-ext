import {
  Subscriber,
  type DiscoveryOptions,
  type ResponderAdvertisement,
} from "cote";

export class ExtendedSubscriber {
  public cote: Subscriber;

  constructor(
    options: ResponderAdvertisement,
    discoveryOptions?: DiscoveryOptions
  ) {
    this.cote = new Subscriber(options, discoveryOptions);
    this._autowire();
  }

  private _autowire() {
    const proto = Object.getPrototypeOf(this);
    const privFuncs = ["constructor", "_autowire", "on", "eventNames"];
    for (const key of Object.getOwnPropertyNames(proto)) {
      if (privFuncs.some((v) => v === key) || key.startsWith("c_")) continue;
      // Wrap the subscriber callback to ensure `this` is the class instance
      // and to pass through a callback/publisher if the handler expects it.
      this.cote.on(key, (req: any, cb?: Function) => {
        const func = (this as any)[key] as Function;
        if (typeof func === "function") {
          // Call the handler with the instance as `this`.
          // Pass cb and cote as additional args for handlers that expect them.
          return func.call(this, req, cb, this.cote);
        }
      });
    }
  }
}
