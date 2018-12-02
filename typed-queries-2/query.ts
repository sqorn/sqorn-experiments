declare let q: Query;

q.select().from().leftJoin().on().leftJoin()
const aj = q.selectDistinct().from().join().on().where().

q.selectCount().from().whereNot().andNot()

q.select().from().naturalJoin().where()

q.selectCount().from().join().on()

book.id.eq(author.id)

q.selectCount().from().where.exists().andNot.isNull()

interface Query {
  select: SelectStep;
  selectDistinct: SelectStep
  selectDistinctOn(): DistinctOnStep
  selectOne: SelectStep
  selectZero: SelectStep
  selectCount(): SelectStep
  // update: Update
  // delete: Delete
  // insert: Insert
  // values: Values
}

interface DistinctOnStep {
  (): SelectStep
}

interface SelectStep extends FromStep {
  (): FromStep
}

interface FromStep extends WhereStep {
  from(): JoinStep
}

interface JoinStep extends WhereStep {
  join(): JoinConditionStep
  leftJoin(): JoinConditionStep
  rightJoin(): JoinConditionStep
  fullJoin(): JoinConditionStep
  crossJoin(): JoinConditionStep
  
  naturalJoin(): JoinStep
  naturalLeftJoin(): JoinStep
  naturalRightJoin(): JoinStep
  naturalFullJoin(): JoinStep
  naturalCrossJoin(): JoinStep
}

interface JoinConditionStep {
  on(): JoinStep
  using(): JoinStep
}

interface WhereStep extends GroupByStep {
  where(): GroupByStep
}

interface GroupByStep extends HavingStep {
  groupBy(): HavingStep
}

interface HavingStep extends OrderByStep {
  having(): OrderByStep
}

interface OrderByStep extends LimitStep {
  orderBy(): LimitStep
}

interface LimitStep extends OffsetStep {
  limit(): OffsetStep
}

interface OffsetStep extends DoneStep {
  offset(): DoneStep
}

interface DoneStep {

}

