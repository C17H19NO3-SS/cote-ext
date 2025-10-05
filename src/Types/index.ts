import { type Event as E } from "cote";

export type Event<T extends object = {}> = E & T;
