export type Lit = string | number | boolean | undefined | null | void | {};

// infers a tuple type for up to twelve values (add more here if you need them)
export function tuple<A extends Lit, B extends Lit, C extends Lit, D extends Lit, E extends Lit, F extends Lit, G extends Lit, H extends Lit, I extends Lit, J extends Lit, K extends Lit, L extends Lit>(a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, j: J, k: K, l: L): [A, B, C, D, E, F, G, H, I, J, K, L];
export function tuple<A extends Lit, B extends Lit, C extends Lit, D extends Lit, E extends Lit, F extends Lit, G extends Lit, H extends Lit, I extends Lit, J extends Lit, K extends Lit>(a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, j: J, k: K): [A, B, C, D, E, F, G, H, I, J, K];
export function tuple<A extends Lit, B extends Lit, C extends Lit, D extends Lit, E extends Lit, F extends Lit, G extends Lit, H extends Lit, I extends Lit, J extends Lit>(a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, j: J): [A, B, C, D, E, F, G, H, I, J];
export function tuple<A extends Lit, B extends Lit, C extends Lit, D extends Lit, E extends Lit, F extends Lit, G extends Lit, H extends Lit, I extends Lit>(a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I): [A, B, C, D, E, F, G, H, I];
export function tuple<A extends Lit, B extends Lit, C extends Lit, D extends Lit, E extends Lit, F extends Lit, G extends Lit, H extends Lit>(a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H): [A, B, C, D, E, F, G, H];
export function tuple<A extends Lit, B extends Lit, C extends Lit, D extends Lit, E extends Lit, F extends Lit, G extends Lit>(a: A, b: B, c: C, d: D, e: E, f: F, g: G): [A, B, C, D, E, F, G];
export function tuple<A extends Lit, B extends Lit, C extends Lit, D extends Lit, E extends Lit, F extends Lit>(a: A, b: B, c: C, d: D, e: E, f: F): [A, B, C, D, E, F];
export function tuple<A extends Lit, B extends Lit, C extends Lit, D extends Lit, E extends Lit>(a: A, b: B, c: C, d: D, e: E): [A, B, C, D, E];
export function tuple<A extends Lit, B extends Lit, C extends Lit, D extends Lit>(a: A, b: B, c: C, d: D): [A, B, C, D];
export function tuple<A extends Lit, B extends Lit, C extends Lit>(a: A, b: B, c: C): [A, B, C];
export function tuple<A extends Lit, B extends Lit>(a: A, b: B): [A, B];
export function tuple<A extends Lit>(a: A): [A];
export function tuple(...args: any[]): any[] {
  return args;
}

let sq: SQ<{}>;

// type add<T extends any[]> = [E for E in T]

export type Simplify<T> = { [key in keyof T]: T[key]};

type t1 = { a: number } & { b: number }
type t2 = Simplify<t1>
declare let tt2: t2;
tt2.a;

type Types = string | number

interface C<Name extends string, Type extends Types> {
  type: Type
  name: Name
  as<Alias extends string>(alias: Alias): C<Alias, Type>
}

type Column = C<string, Types>

type R<T extends Column> = { [key in T["name"]]: T["type"] }

interface Row {
  [name: string]: any
}

type x = R<C<'id', number>>
type x2 = Simplify<R<C<'id', number>> & R<C< 'name', string>> & R<C< 'nade', string>>>

// declare function column<Type, Name>(type, name): C<Type, Name>;

// interface Model<Name> {
//   $name: Name
//   as<Alias>(alias: Alias): ChangeModelName<this, Alias>
// }

// type ChangeModelName<T extends Model<any>, Name> =  ;

interface Book<Table extends string> {
  $table: Table
  as<Alias extends string>(alias: Alias): Book<Alias>
  id: C<'id', number>,
  title: C<'title', string>
  author: C<'author', string>
}

const book = model('book', {
  id: 'number',
  title: 'string',
  author: 'string'
})


type xjj = Simplify<Omit<{ a: 1 }, 'a'> & { a: 2 }>

const b1 = book.as('b1')
const b1t = b1.alias
const b2 = book.as('b2')

book

sq.select(b1.author.as('a1'), b2.author.as(a2))
b1.

interface Model<Table extends string> {
  table: Table;
  as<Alias extends string>(alias: Alias): Simplify<this & { alias: Alias }>
}

interface Test {
  a: string;
  b: number;
  c: boolean;
}
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
type Replace<T, K extends keyof T, N> = Simplify<Pick<T, Exclude<keyof T, K>> & { [key in K]: N }>

// Omit a single property:
type OmitA = Omit<Test, "a">
type ReplaceA = Replace<Test, "a", 23>



interface Fields {
  [field: string]: 'number' | 'string'
}

declare function model<Name extends string, Fields>(name: Name, fields: Fields):
  Model<Name> & { [key in keyof Fields]: Fields[key] }

// declare let book: Book<'book'>;

const jkjkb = book.$name
const b = book.as('b')
const n = b.$name

const d = book.id.as('pew')

export type Simplify2<T> = {[TKey in keyof T]: T[TKey]};

const s = sq.select(book.id)
type st = typeof s
const s2 = s.select(book.title, book.author)
const s21 = s.select(book.title)
const r = s.select(book.id.as('id2'))
const asdjklfklsdjf = r.execute()
const asdfasdf = s21.execute()
type s2t = typeof s2
const sdsdb = s2.execute()
const asdf = sdsdb.title


// sq.selectDistinctOn()().from().where().groupBy().having()
// sq.selectDistinctOn('a')('a', 'b').from().where().groupBy().having().orderBy().limit().offset().all()
// sq.select('').from(book).naturalLeftJoin(author).on()

interface SQ<T extends Row> {
  select<F1 extends Column>(f1: F1): SelectFrom< T & R<F1>>
  // select<F1 extends Column>(f1: F1): SelectFrom<Simplify<Row<F1>>>
}

interface SelectFrom<T extends Row> {
  // select<F1 extends Column>(f1: F1): SelectFrom<Simplify2<{ a: 1 } & T & { [key in F1["name"]]: F1["type"] }>>
  // select<F1 extends Column, R extends Simplify<T & Row<F1>>>(f1: F1): SelectFrom<R>
  select<F1 extends Column>(f1: F1): SelectFrom< T & R<F1>>
  
  select<F1 extends Column, F2 extends Column>(f1: F1, f2: F2): SelectFrom<T & R<F1> & R<F2>>
  // select<F1 extends Column, F2 extends Column, R extends Simplify<T & CtoR<F1> & CtoR<F2>>>(f1: F1, f2: F2): SelectFrom<R>
  // select<F1 extends Column, F2 extends Column, R extends T & CtoR<F1> & CtoR<F2>>(f1: F1, f2: F2): SelectFrom<{ [key in keyof R]: R[key] }>

  execute(): { [key in keyof T]: T[key]}
}


const tuple1 = <T extends any[]>(...args: T): typeof args => args

function tuple2<T extends any[]>(...args: T): T {
  return args;
}

const x = tuple1(1,2,3)
const y = tuple(1,2,3)