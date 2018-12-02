
interface Query {
  select(...fields: string[]): SelectDistinctStep
  update(table: string): UpdateSetStep
  delete(table: string): DeleteWhereStep
  into(table: string): InsertInsertStep
}

interface SelectDistinctStep extends SelectFromStep {
  distinct: SelectFromStep
}

interface SelectFromStep {
  from(table: string): SelectWhereStep
}

interface SelectWhereStep {
  where(): any
}

interface UpdateSetStep {
  set(): UpdateWhereStep
}

interface UpdateWhereStep {
  where(): any
}

interface DeleteWhereStep {
  where(): any
}

interface InsertInsertStep {
  insert(): any
}


declare let q: Query;

q.select('title').from('book').where()
q.select().distinct.where()
q.select().distinct.where()
q.update('book').set().where()
q.delete('book').where()
q.into('book').insert()
