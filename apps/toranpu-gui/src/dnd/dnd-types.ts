import { MutableRefObject } from "react";

export type UniqueIdentifier = string | number;
type AnyData = Record<string, any>;
export type Data<T = AnyData> = T & AnyData;

export type DataRef<T = AnyData> = MutableRefObject<Data<T> | undefined>;

