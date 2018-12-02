# Better SQL Query Building through Table Inference

Your latest app is backed by a SQL database. You've had poor experiences with ORMs in the past, but you don't want to wrangle query strings manually. So, you strike a balance and use a query builder.

Your query builder provides a fluent SQL-based API with typed models. It's nice to work with, but you've noticed something... there's a lot of redundancy in your queries that could be avoided if the query builder intelligently applied what it knows about your schema, specifically relationships between tables.

# Data Set

## Author

<table>
	<tr>
		<th>id</th>
		<th>first_name</th>
		<th>last_name</th>
		<th>birthday</th>
	</tr>
	<tr>
		<td>1</td>
		<td>Brandon</td>
		<td>Sanderson</td>
		<td>1975-12-19</td>
	</tr>
	<tr>
		<td>3</td>
		<td>John</td>
		<td>Tolkien</td>
		<td>1892-01-03</td>
	</tr>
	<tr>
		<td>2</td>
		<td>Robert</td>
		<td>Jordan</td>
		<td>1948-10-17</td>
	</tr>
</table>

## Book

<table>
	<tr>
		<th>id</th>
		<th>title</th>
		<th>genre</th>
		<th>publish_year</th>
		<th>author_id</th>
	</tr>
	<tr>
		<td>1</td>
		<td>The Way of Kings</td>
		<td>Fantasy</td>
		<td>2010</td>
		<td>1</td>
	</tr>
	<tr>
		<td>2</td>
		<td>The Eye of the World</td>
		<td>Fantasy</td>
		<td>1990</td>
		<td>2</td>
	</tr>
	<tr>
		<td>3</td>
		<td>The Fellowship of the Ring</td>
		<td>Fantasy</td>
		<td>1954</td>
		<td>3</td>
	</tr>
	<tr>
		<td>77</td>
		<td>Oathbringer</td>
		<td>Fantasy</td>
		<td>2017</td>
		<td>1</td>
	</tr>
</table>

## Reviews

<table>
	<tr>
		<th>id</th>
		<th>text</th>
		<th>book_id</th>
	</tr>
	<tr>
		<td>1</td>
		<td>good</td>
		<td>1</td>
	</tr>
	<tr>
		<td>2</td>
		<td>ok</td>
		<td>1</td>
	</tr>
	<tr>
		<td>3</td>
		<td>bad</td>
		<td>1</td>
	</tr>
	<tr>
		<td>4</td>
		<td>nice</td>
		<td>2</td>
	</tr>
	<tr>
		<td>5</td>
		<td>cool</td>
		<td>3</td>
	</tr>
	<tr>
		<td>6</td>
		<td>rad</td>
		<td>77</td>
	</tr>
	<tr>
		<td>7</td>
		<td>yaaaa</td>
		<td>77</td>
	</tr>
</table>



# Implicit Joins

This query gets the title, author's first name, and author's last name of all books:

```sql
select book.title, author.first_name, author.last_name
from book
left join author on book.author_id = author.id
```

You presume the query builder equivalent should look something like:

```js
select('book.title', 'author.first_name', 'author.last_name')
.from('book')
.leftJoin('author').on('book.author_id = author.id')
```

That makes sense... but lets assume that you've defined database models.

Each model has table properties representing its columns and relationship properties referencing other models.

```ts
interface Book {
  id: number
  title: string
  genre: string
  author_id: number
  author: Author
}
interface Author {
  id: number
  firstName: string
  lastName: string
  books: Book[]
}
declare const book: Book, author: Author;
```

Now, the query might be written like this:

```js
select(book.title, author.firstName, author.lastName)
.from(book)
.leftJoin(author).on(book.authorId.eq(author.id))
```

The join makes this harder to understand, but intuitively, to fetch the results, the query first gets a book, then finds the book's author.

Since we defined model relationships before hand, it should be possible to use this information to simplify how the query is expressed:

```js
select(book.title, book.author.firstName, book.author.lastName)
```

This works because
 1. the relationship between book and author is known
 2. the relationship is 1-1
 3. a path exist from each field to the source model book

What if you wanted to find all books written by each author? The SQL query would be:

```sql
select author.id, book.title
from author
left join book on author.id = book.author_id;
```

The equivalent query builder syntax is:

```js
select(author.id, author.books.title)
```

Unfortunately, working with this query's results is awkward because finding all books written by an author requires checking multiple result rows.

Wouldn't it be nice to return a single row for each author containing an array of book titles? Yes? Well, good thing we're using Postgres.

```sql
select author.id, array_agg(book.title)
from author
left join book on author.id = book.author_id
group by author.id
```

The query builder syntax becomes:

```js
select(author.id, array(author.books.title))
.group(author.id)
```

If a query uses an aggregated field, all non-aggregated fields must be listed in the group by clause.

The query builder is smart enough to account for this:

```js
select(author.id, array(author.books.title))
```

To make sense of the data, we decide to also fetch the author's last name and the book's genre.

```sql
select author.id, author.last_name, book.title, book.genre
from author
left join book on author.id = book.author_id;
```

The query becomes:

```js
const { books } = author
select(author.id, author.lastName, books.title, books.genre)
```

We also prefer working with json trees, but the query is more complicated since we aggregate both the title and genre of each book.

```sql
select
  author.id,
  author.last_name,
  json_agg(json_build_object('title', book.title, 'genre', book.genre)) as books
from author
left join book on author.id = book.author_id
group by
  author.id,
  author.last_name -- optional because author.id is primary key
```

You run the query and get:

<table>
	<tr>
		<th>id</th>
		<th>last_name</th>
		<th>books</th>
	</tr>
	<tr>
		<td>1</td>
		<td>Sanderson</td>
		<td>[{"title" : "The Way of Kings", "genre" : "Fantasy"}, {"title" : "Oathbringer", "genre" : "Fantasy"}]</td>
	</tr>
	<tr>
		<td>2</td>
		<td>Jordan</td>
		<td>[{"title" : "The Eye of the World", "genre" : "Fantasy"}]</td>
	</tr>
	<tr>
		<td>3</td>
		<td>Tolkien</td>
		<td>[{"title" : "The Fellowship of the Ring", "genre" : "Fantasy"}]</td>
	</tr>
</table>

The equivalent query building syntax is:

```js
const books = author.books.jsonAgg
select(author.id, author.lastName, books.title, books.genre)
```

At this point, you decide to go all in on JSON by aggregating everything into a single object.

It's tricky because you have to fetch the data, then aggregate books, then aggregate authors. We show each step using CTEs:

```sql
with
-- 1. Get all data
data as (
  select
    author.id,
    author.last_name,
    book.title,
    book.genre
  from author
  left join book on author.id = book.author_id
),
-- 2. Aggregate books
q1 as (
  select
  	data.id,
  	data.last_name,
    json_agg(json_build_object(
      'title', data.title,
      'genre', data.genre
    )) as books
  from data
  group by
    data.id,
    data.last_name
),
-- 3. Aggregate authors
q2 as (
  select
    json_agg(json_build_object(
      'id', q1.id,
      'last_name', q1.last_name,
      'books', q1.books
    ))
  from q1
)
-- 4. Return result
select * from q2;
```

Translating the steps into nested queries results in:

```sql
select
  json_agg(json_build_object(
    'id', subquery.id,
    'last_name', subquery.last_name,
    'books', subquery.books
  )) as query
from (
  select
    author.id,
    author.last_name,
    json_agg(json_build_object(
      'title', book.title,
      'genre', book.genre
    )) as books
  from author
  left join book on author.id = book.author_id
  group by
    author.id,
    author.last_name
) subquery;
```

Run it, and voila!

```json
[
  {
    "id": 1,
    "last_name": "Sanderson",
    "books": [
      {
        "title": "The Way of Kings",
        "genre": "Fantasy"
      },
      {
        "title": "Oathbringer",
        "genre": "Fantasy"
      }
    ]
  },
  {
    "id": 2,
    "last_name": "Jordan",
    "books": [
      {
        "title": "The Eye of the World",
        "genre": "Fantasy"
      }
    ]
  },
  {
    "id": 3,
    "last_name": "Tolkien",
    "books": [
      {
        "title": "The Fellowship of the Ring",
        "genre": "Fantasy"
      }
    ]
  }
]

```

The equivalent query building syntax should be something like:

```js
const books = author.books
select(json(author.id, author.lastName, json(books.title, books.genre)))
```

Season SQL Gurus might think, "huh? that looks like a nested aggregate"

Nested aggregate query building rules:
* 


```js
const books = author.books
select(json(author.id, author.lastName, json(books.title, books.genre)))
.where(books.title.eq('The Way of Kings'))
```


We're fussy, so we decide to read the reviews for each book. The query becomes:

```sql
select author.id, author.lastName, book.title, review.text
from author
left join book on author.id = book.author_id
left join review on book.id = review.book_id
```

The equivalent query builder syntax is:

```js
select(author.id, author.lastName, author.books.title, author.books.reviews.text)
```

<!-- The relationships are getting long, so let's refactor them:

```js
const { books } = author
const { reviews } = books
select(author.id, books.title, reviews.text)
``` -->

Again, this is awkward. We can do better with aggregation. But it's a little complicated since an author may have many books and a book may have many reviews.

```sql
select author.id, book.title, review.text
from author
left join book on author.id = book.author_id
left join review on book.id = review.book_id
```

Now, lets say we want to find the number of books written by each author.




### OTHER

1. first and last name of author of Moby Dick

sq.select(author.first_name, author.last_name)
	.where(author.books.title.eq('Moby Dick'))

select author.first_name, author.last_name
from author
left join book on author.id = book.author_id
where book.title = 'Moby Dick'

2. number of books written by each author

sq.select(author.id, count(author.books.id))

select count(book.id)
from author
left join book on author.id = book.author_id
group by author.id

3. number of books written by author of Moby Dick

sq.select(author.id, count(author.books.id))
	.where(author.books.title.eq('Moby Dick'))

const b = author.books.as('b')
sq.select(author.id, count(b.id)).where(b.title.eq('Moby Dick'))

select author.id, count(b.id)
from author
left join book b on author.id = b.author_id
where b.title = 'Moby Dick'
group by author.id

4. author name and book title of all fantasy books

sq.select(author.name, book.title).where(book.authorId.eq(book.id), book.genre.eq('fantasy'))

select author.name, book.title
from author, book
where book.genre = 'fantasy'

SELECT
  first_name, last_name,
  (SELECT count(*) 
   FROM film_actor fa 
   WHERE fa.actor_id = a.actor_id)
FROM actor a


sq.select(
	actor.firstName,
	actor.lastName,
	sq.select(count()).where(filmActor.id.eq(actor.id))
)

SELECT
  (SELECT count(*) 
   FROM film_actor
   WHERE film_actor.actor_id = actor.id)
FROM actor
WHERE actor.name = 'Bob'

sq.select(
	sq.select(count()).where(filmActor.id.eq(actor.id))
).where(actor.name.eq('Bob'))

SELECT count(*) 
FROM film_actor, actor
WHERE film_actor.actor_id = actor.id

sq.select(count()).where(filmActor.id.eq(actor.id))

SELECT
  (SELECT count(*) WHERE film_actor.actor_id = actor.id)
FROM actor, film_actor
WHERE actor.name = 'Bob'

sq.select(
	sq.select(count()).where(filmActor.id.eq(actor.id))
).from(filmActor, actor)
.where(actor.name.eq('Bob'))

To infer a query's:
* from clause (including joins)
* group by clause
its fields and ancestor fields must be known.

This necessitates top-down query construction, but parameterization must happen in lexical order, so two passes must be made. First,


sq.select(
	sq.select(count()).where(filmActor.id.eq(actor.id).and())
).where(actor.name.eq('Bob'))

```js
['select', ['select count() where']]
```