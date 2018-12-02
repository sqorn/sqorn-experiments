let sq: SQ;

// type add<T extends any[]> = [E for E in T]
sq
export type Unite<T> = {[TKey in keyof T]: T[TKey]};

type t1 = { a: number } & { b: number } & { [key: string]: any } & { [key: string]: any }
type t2 = Unite<t1>
declare let tt2: t2;
tt2.a
tt2.asdf.asdf;

interface C<Type, Name> {
  type: Type
  name: Name
}

type Column = C<any, any>


type OBJ<T> = 


declare function column<Type, Name>(type, name): C<Type, Name>;

interface Book {
  id: C<number, 'id'>,
  title: C<string, 'title'>
}

declare let book: Book;

declare let b: boolean;

const s = sq.select(book.id)
const s2 = sq.select(book.id, book.title)
const s3 = sq.select(b ? book.id : book.title)
const x = s.execute()

sq.select

const From = sq.leftJoin('book', 'author').on(
  e.eq('book.author_id', 'author.id'))

j.leftJoin(

)

sq.from(sq.leftJoin('book', 'author').on(
  e.eq(book.authorId, author.Id)
))

sq.selectDistinctOn()()

sq.selectDistinct()

sq.from(a)
  .where(true)
  .groupBy()
  .having()
  .return(a,b,c)
  .distinctOn(a,b,)
  .union()
  .order()
  .offset()
  .limit()

sq.select()
  .distinctOn()
  .from()
  .where()
  .groupBy()
  .having()
  .union()
  .order()
  .limit()
  .offset()

sq.select.where.eq(book.id,2)
// select * from book where book.id = 2

sq.select(book.title).where.eq(book.id, 7)
// select book.title as "title" from book where book.id = 2

sq.select(book.author, book.title, e.plus(3,4))
  .distinctOn(book.author)

sq.select(author.id, book.title)
  .from(book).leftJoin(author).on.eq(book.authorId, author.id)


sq.where.eq(book.id, 7)
sq.




sq.select.where.eq(book.id, 7)
sq.delete.where.eq(book.id, 7)
sq.delete.from(book)
sq.insert.into(book).values()
sq.update.where(book.id, 7).set(book.title, 8)


// sq.selectDistinctOn()().from().where().groupBy().having()
// sq.selectDistinctOn('a')('a', 'b').from().where().groupBy().having().orderBy().limit().offset().all()
// sq.select('').from(book).naturalLeftJoin(author).on()

interface SQ {
  select<F1 extends Column>(f1: F1,): SelectFrom<F1>
  select<F1 extends Column, F2 extends Column>(f1: F1, f2: F2): SelectFrom<[F1, F2]>
  selectDistinct<T>(t: T): SelectFrom<T>
  selectDistinctOn<T>(t: T): () => SelectFrom<T>
  insertInto()
}

interface SelectFrom<T> {
  from(): SelectWhere
  execute(): 
}

interface SelectWhere {
  where(): SelectGroupBy
}

interface SelectGroupBy {
  groupBy(): SelectHaving
}

interface SelectHaving {
  having(): SelectOrderBy
}

interface SelectOrderBy {
  orderBy(): SelectLimit
}

interface SelectLimit {
  limit(): SelectOffset
}

interface SelectOffset {
  offset(): SelectDone
}

interface SelectDone {
  all(): Promise<any>
  first(): Promise<any>
  one(): Promise<any>
  run(): Promise<any>
}