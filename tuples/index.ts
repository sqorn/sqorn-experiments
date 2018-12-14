type ExtendTuple<T, U> = T extends [infer R1, infer R2, infer R3]
  ? [R1, R2, R3, U]
  : T extends [infer R1, infer R2]
  ? [R1, R2, U]
  : T extends [infer R1]
  ? [R1, U]
  : T extends []
  ? [U]
  : never;

// type MaybeType<T> = T extends Maybe<infer MaybeType> ? MaybeType : never;
type FieldToObject<F> = F extends Field
  ? { [key in F["name"]]: F["type"] }
  : never;

type testFieldToObject = FieldToObject<Field<"title", string>>;

// type RowToObject<T extends Field[], U> = T extends [infer R1, infer R2, infer R3]
//   ? [FieldToObject<R1>, R2, R3, U]
//   : T extends [infer R1, infer R2]
//   ? [R1, R2, U]
//   : T extends [infer R1]
//   ? [R1, U]
//   : T extends []
//   ? [U]
//   : never;

type RowToObject<T extends Field[]> = T[number];

type UnionToIntersection<U> = (U extends any
  ? (k: U) => void
  : never) extends ((k: infer I) => void)
  ? I
  : never;

type Tail<T extends any[]> = ((...args: T) => any) extends ((
  _: infer First,
  ...rest: infer Rest
) => any)
  ? T extends any[]
    ? Rest
    : ReadonlyArray<Rest[number]>
  : [];

type testTail = Tail<[3, 9, true]>;

// interface ExtendTuple<T> {
//   moo<U>(arg: U): (T extends [infer R] ? [R, U] : T extends [] ? [U] : never)
// }

type tupleExtendsArray = [string, 3] extends any[] ? true : false;

interface Field<Name extends string = string, Type = any> {
  name: Name;
  type: Type;
}

type x1 = [1] extends [infer R] ? true : false;

declare function extendTuple<T, U>(t: T, u: U): ExtendTuple<T, U>;
const m = [];
declare let o: [Field<"title", string>, Field<"id", number>];
declare let g: Field<"genre", string>;
let r = extendTuple(o, g);

type MapTuple<T extends Field[]> = { [key in keyof T]: FieldToObject<T[key]> };

type x4 = MapTuple<typeof o>;

type TupleToObjectH<T extends Field[]> = UnionToIntersection<
  MapTuple<T>[number]
>;
type TupleToObject<T extends Field[]> = {
  [key in keyof TupleToObjectH<T>]: TupleToObjectH<T>[key]
};
type x3 = TupleToObject<typeof o>;

type Lit = string | number | boolean | undefined | void | null | {};
const tuple = <T extends Lit[]>(...args: T) => args;

const meow = tuple(true, false, "ads", {}, []);
