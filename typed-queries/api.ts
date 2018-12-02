declare let q: SQL;

q.select().distinctOn().from().leftJoin().on.eq().and();

const aj = q.select.one.distinct.from().join().on().and.not()

interface SQL {
  select: SelectStep;
  // update: Update
  // delete: Delete
  // insert: Insert
  // values: Values
}

interface SelectStep extends DistinctStep {
  (): DistinctStep
  count: DistinctStep
  zero: DistinctStep
  one: DistinctStep
}

interface DistinctStep extends FromStep {
  distinct: FromStep
  distinctOn(): FromStep
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

type ConditionTypes = keyof NextStep
type NextStep = {
  join: NextJoinConditionStep
  where: NextWhereConditionStep
  
}

interface JoinConditionStep {
  on: NegatableConditionStep<'join'>
  using: NegatableConditionStep<'join'>
}

interface WhereStep extends GroupByStep {
  where: NegatableConditionStep<'where'>
}

interface NegatableConditionStep<T extends ConditionTypes> extends ConditionStep<T> {
  not: ConditionStep<T>
}

interface ConditionStep<T extends ConditionTypes> {
  (): NextStep[T]
  eq(): NextStep[T]
  neq(): NextStep[T]
  lt(): NextStep[T]
  gt(): NextStep[T]
}

interface NextConditionStep<T extends ConditionTypes> {
  and: NegatableConditionStep<T>
  or: NegatableConditionStep<T>
}

interface NextJoinConditionStep extends NextConditionStep<'join'>, JoinStep {}
interface NextWhereConditionStep extends NextConditionStep<'where'>, WhereStep {}


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

