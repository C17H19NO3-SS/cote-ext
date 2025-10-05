import {
  Requester,
  type DiscoveryOptions,
  type ResponderAdvertisement,
} from "cote";

type Opts = { timeout?: number };
type Callback<T> = (err: unknown, res: T) => void;

export function request<TRes = unknown>(type: string) {
  return function (
    _target: any,
    _key: string | symbol,
    desc: TypedPropertyDescriptor<any>
  ): TypedPropertyDescriptor<any> {
    desc.value = function (
      this: Requester,
      payload: any,
      a?: Opts | Callback<TRes>,
      b?: Callback<TRes>
    ) {
      let opts: Opts | undefined;
      let cb: Callback<TRes> | undefined;
      if (typeof a === "function") cb = a;
      else opts = a;
      if (typeof b === "function") cb = b;

      const message =
        payload && typeof payload === "object"
          ? { type, ...payload }
          : { type };

      if (cb) {
        let timer: any;
        if (opts?.timeout)
          timer = setTimeout(
            () => cb!(new Error("request timeout"), undefined as any),
            opts.timeout
          );
        (this as any).send(message, (err: unknown, res: TRes) => {
          if (timer) clearTimeout(timer);
          cb!(err, res);
        });
        return; // callback yolu → void
      }

      return new Promise<TRes>((resolve, reject) => {
        let timer: any;
        if (opts?.timeout)
          timer = setTimeout(
            () => reject(new Error("request timeout")),
            opts.timeout
          );
        (this as any).send(message, (err: unknown, res: TRes) => {
          if (timer) clearTimeout(timer);
          err ? reject(err as any) : resolve(res);
        });
      });
    };
    return desc; // Promise değil, descriptor dön
  };
}

export class ExtendedRequester extends Requester {
  constructor(
    initConfig: ResponderAdvertisement,
    discoveryOptions?: DiscoveryOptions
  ) {
    super(initConfig, discoveryOptions);
  }
}
