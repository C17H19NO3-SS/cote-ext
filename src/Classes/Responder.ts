import {
  Responder,
  type DiscoveryOptions,
  type ResponderAdvertisement,
} from "cote";

// Prototip -> (event -> handler) eşlemesi
const listeners = new WeakMap<object, Map<string, Function>>();

export function on<T extends Responder>(event: string) {
  return function (target: T, key: keyof T): void {
    let map = listeners.get(target as unknown as object);
    if (!map) {
      map = new Map<string, Function>();
      listeners.set(target as unknown as object, map);
    }
    map.set(event, (target as any)[key] as Function);
  };
}

export function init(res: Responder) {
  // Her örneğe benzersiz id ver (prototipten gölgeleyerek)
  if (!Object.prototype.hasOwnProperty.call(res, "___id")) {
    Object.defineProperty(res, "___id", {
      value: Math.floor(Math.random() * 100000000).toFixed(0),
    });
  }

  // Prototipte biriken dinleyicileri bu örneğe bağla
  const proto = Object.getPrototypeOf(res);
  const map = listeners.get(proto);
  if (map) {
    map.forEach((fn, ev) => {
      res.on(ev as "cote:added" | "cote:removed", fn.bind(res));
    });
  }
}

export class ExtendedResponder extends Responder {
  constructor(
    initConfig: ResponderAdvertisement,
    discoveryOptions?: DiscoveryOptions
  ) {
    super(initConfig, discoveryOptions);
    init(this);
  }
}
