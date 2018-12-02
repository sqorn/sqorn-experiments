import { setQuarter } from 'date-fns'

const b = book.as('b')
const a = author.as('a')

sq.return(b.id, a.firstName, a.lastName)
  .from(b)
  .join(a)
  .on(e.eq())

// automatically derive source table
// 1. define relationships from root model
// 2. use in query
// 3. sqorn automaticaly constructs from + joins

const b = book.as('b')
const a = b.author.as('a')

sq.return(employee.department, e.avg(employee.salary)).group(
  employee.department
)

// select employee.department, avg(employee.salary)
// from employee
// group by employee.department

sq.return(b.id, a.firstName, a.lastName).where(eq(a.id, 23))

sq.return(b.id, a.firstName, a.lastName)
  .from(b)
  .leftJoin(a)
  .on(eq(b.author_id, a.id))
  .where(eq(a.id, 23))

// sq.return(book.id, book.author.firstName, book.author.lastName)

// select b.id, a.first_name, a.last_name
// from book b left join author a on book.author_id = author.id
// where a.id = 23

sq.select(author.firstName, author.lastName)
  .where.eq(author.books.title, 'The Way of Kings')
  .and.not.null(author.books.title)

// select author.first_name, author.last_name
// from author
// left join book on author.id = book.author_id
// where book.title = 'The Way of Kings';

sq.where
  .eq(author.books.title, 'The Way of Kings')
  .and.not.null(author.books.title)
  .return(author.firstName, author.lastName).distinct

const author = book.author
sq.return(author.firstName, author.lastName).where.eq(
  book.title,
  'The Way of Kings'
)

// select author.first_name, author.last_name
// from book
// left join author on book.author_id = author.id
// where book.title = 'The Way of Kings'

select(
  cu.FIRST_NAME,
  cu.LAST_NAME,
  cu
    .address()
    .city()
    .country().COUNTRY
)

const c = customer.as('c')
const address = c.address
const country = address.city.country

sq.return(c.firstName, c.lastName, country.country).where.like(
  address.street,
  'main'
)

// select c.first_name as "firstName", c.last_name as "lastName", country.country as "country"
// from customer c
// left join address on customer.address_id = address.id
// left join city on address.city_id = city.id
// left join country on city.country_id = country.id
// where

// objection
const middleAgedJennifers = await Person.query()
  .where('age', '>', 40)
  .andWhere('age', '<', 60)
  .andWhere('firstName', 'Jennifer')
  .orderBy('lastName')

const p = person.as('p')
sq.select.where
  .gt(p.age, 40)
  .and.lt(p.age, 60)
  .and.eq(p.firstName, 'Jennifer')
  .order(p.lastName)

sq.select.where.and(
  e.gt(p.age, 40),
  e.lt(p.age, 60),
  e.eq(p.firstName, 'Jennifer')
)

sq.select.where(
  e.and(e.gt(p.age, 40), e.lt(p.age, 60), e.eq(p.firstName, 'Jennifer'))
)

// objection
const people = await Person.query()
  .select('persons.*', 'Parent.firstName as parentFirstName')
  .join('persons as parent', 'persons.parentId', 'parent.id')
  .where('persons.age', '<', Person.query().avg('persons.age'))
  .whereExists(
    Animal.query()
      .select(1)
      .where('persons.id', ref('animals.ownerId'))
  )
  .orderBy('persons.lastName')

sq.select.where.eq(person.id, animal.ownerId)
// evaluation?
// standalone: invalid -> more than one source table
// embedded:
//  parent contains neither:
//    -> invalid

//  parent query contains person:
//    -> select * from animal where person.id = animal.ownerId
sq.select(person.age).where.exists(
  sq.select.where.eq(person.id, animal.ownerId)
)

// select person.age
// from person
// where exists (
//   select *
//   from animal
//   where person.id = animal.owner_id
// )

//  parent contains animal:
//    -> select * from person where person.id = animal.ownerId
//  parent contains both (e.g. subquery of subquery):
//    -> select * where person.id = animal.ownerId

// SELECT *
//   FROM BOOK
//  WHERE BOOK.AUTHOR_ID = (
//  		SELECT ID
//           FROM AUTHOR
//          WHERE LAST_NAME = 'Orwell'
// )

const OrwellId = sq.select(author.id).where.eq(author.lastName, 'Orwell')
const OrwellBooks = sq.select.where.eq(book.authorId, OrwellId)

const OrwellId = sq.select(author.id).where(author.lastName.eq('Orwell'))
const OrwellBooks = sq.select.where.eq(book.authorId, OrwellId)

sq('book')({ authorId: sq('author')({ lastName: 'Orwell' })('id') })

// SELECT nested.* FROM (
//   SELECT AUTHOR_ID, count(*) books
//     FROM BOOK
// GROUP BY AUTHOR_ID
// ) nested
// ORDER BY nested.books DESC

const nested = sq
  .select(book.authorId, e.count().as('books'))
  .group(book.authorId)
  .as('nested')

const outer = sq.select(nested.all).orderBy(nested.books, 'desc')

// SELECT LAST_NAME, (
//   SELECT COUNT(*)
//    FROM BOOK
//   WHERE BOOK.AUTHOR_ID = AUTHOR.ID) books
// FROM AUTHOR
// ORDER BY books DESC

const books = sq.select.count.where.eq(book.authorId, author.id).as('books')
sq.select(author.lastName, books).order(books)

const parent = person.parent
sq.select(person.all, parent.firstName.as('parentFirstName'))
  .where.lt(person.age, e.avg(person.age))
  .and.exists(sq.select.one.where.eq(person.id, animal.id))

// select "persons".*, "parent"."firstName" as "parentFirstName"
// from "persons"
// inner join "persons" as "parent" on "persons"."parentId" = "parent"."id"
// where "persons"."age" < (select avg("persons"."age") from "persons")
// and exists (select 1 from "animals" where "persons"."id" = "animals"."ownerId")
// order by "persons"."lastName" asc

// SELECT
//   first_name, last_name, count(fa.actor_id)
// FROM actor a
// LEFT JOIN film_actor fa USING (actor_id)
// GROUP BY actor_id, first_name, last_name

// note aggregates are on join column

sq.select(a.firstName, a.lastName, a.films.count).group(a.id)

// select a.first_name, a.last_name, count(fa.actor_id)
// from actor a
// left join film_actor fa on a.id = fa.actor_id
// group by a.id, a.first_name, a.last_name

sq.select(employee.department.name, employee.salary.avg).group(
  employee.department.id
)

// select department.name, avg(employee.salary)
// from employee
// left join department on employee.department_id = department.id
// group by department.id, department.name
