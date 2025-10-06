import {
  Responder,
  type DiscoveryOptions,
  type Event,
  type ResponderAdvertisement,
} from "cote";

export class ExtendedResponder {
  public cote: Responder;

  constructor(
    options: ResponderAdvertisement,
    discoveryOptions?: DiscoveryOptions
  ) {
    this.cote = new Responder(options, discoveryOptions);
    this._autowire();
  }

  private _autowire() {
    const proto = Object.getPrototypeOf(this);
    const privFuncs = ["constructor", "_autowire", "on", "eventNames"];
    for (const key of Object.getOwnPropertyNames(proto)) {
      if (privFuncs.some((v) => v === key) || key.startsWith("c_")) continue;
      this.cote.on(
        key,
        (this as any)[key] as (req: Event, cb: Function) => void
      );
    }
  }

  on(event: string, listener: (req: Event, cb: Function) => void) {
    this.cote.on(event, listener);
  }

  eventNames() {
    return this.cote.eventNames();
  }
}
