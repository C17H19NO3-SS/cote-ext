import {
  Publisher,
  type DiscoveryOptions,
  type Event,
  type ResponderAdvertisement,
} from "cote";

export class ExtendedPublisher {
  public cote: Publisher;

  constructor(
    options: ResponderAdvertisement,
    discoveryOptions?: DiscoveryOptions
  ) {
    this.cote = new Publisher(options, discoveryOptions);
    this._autowire();
  }

  private _autowire() {
    const proto = Object.getPrototypeOf(this);
    const privFuncs = ["constructor", "_autowire", "on", "eventNames"];
    for (const key of Object.getOwnPropertyNames(proto)) {
      if (privFuncs.some((v) => v === key) || key.startsWith("c_")) continue;
      this.cote.on(key, (req: Event, cb: Function) => {
        const func = (this as any)[key] as (
          req: Event,
          cb: Function,
          publisher: Publisher
        ) => void;
        if (typeof func === "function") {
          func.call(this, req, cb, this.cote);
        }
      });
    }
  }

  on(event: string, listener: (req: Event, cb: Function) => void) {
    this.cote.on(event, listener);
  }

  eventNames() {
    return this.cote.eventNames();
  }
}
