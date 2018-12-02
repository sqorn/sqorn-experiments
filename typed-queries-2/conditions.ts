type ConditionTypes = keyof NextStep
type NextStep = {
  join: NextJoinConditionStep
  where: NextWhereConditionStep
  having: NextHavingConditionStep
}

interface ConditionStep<T extends ConditionTypes> {
  (): NextStep[T]
  eq(): NextStep[T]
  neq(): NextStep[T]
  lt(): NextStep[T]
  lte(): NextStep[T]
  gt(): NextStep[T]
  gte(): NextStep[T]
  between(): NextStep[T]
  notBetween(): NextStep[T]
  isDistinct(): NextStep[T]
  isNotDistinct(): NextStep[T]
  isNull(): NextStep[T]
  isNotNull(): NextStep[T]
  true(): NextStep[T]
  notTrue(): NextStep[T]
  false(): NextStep[T]
  notFalse(): NextStep[T]
  unknown(): NextStep[T]
  notUnknown(): NextStep[T]
  exists(): NextStep[T]
  notExists(): NextStep[T]
  in(): NextStep[T]
  notIn(): NextStep[T]
  any(): NextStep[T]
  some(): NextStep[T]
  all(): NextStep[T]
  like(): NextStep[T]
  notLike(): NextStep[T]
  similarTo(): NextStep[T]
  notSimilarTo(): NextStep[T]
}

interface NextConditionStep<T extends ConditionTypes> {
  and: ConditionStep<T>
  andNot: ConditionStep<T>
  or: ConditionStep<T>
  orNot: ConditionStep<T>
}

interface NextJoinConditionStep extends NextConditionStep<'join'>, JoinStep {}
interface NextWhereConditionStep extends NextConditionStep<'where'>, WhereStep {}
interface NextHavingConditionStep extends NextConditionStep<'having'>, WhereStep {}
