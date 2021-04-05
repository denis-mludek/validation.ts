import { string, Ok, Err, Validator, prettifyJson, union } from './core'

export function recursion<T>(
  definition: (self: Validator<T>) => Validator<unknown>
): Validator<T> {
  const Self = new Validator<T>((value, config, path) =>
    Result.validate(value, config, path)
  )
  const Result: any = definition(Self)
  return Result
}

export const isoDate = string.flatMap(str => {
  const date = new Date(str)
  return isNaN(date.getTime())
    ? Err(`Expected ISO date, got: ${prettifyJson(str)}`)
    : Ok(date)
})

export const relativeUrl = string.flatMap(str => {
  try {
    new URL(str, 'http://some-domain.com')
    return Ok(str)
  } catch (err) {
    return Err(`${str} is not a relative URL`)
  }
})

export const absoluteUrl = string.flatMap(str => {
  try {
    new URL(str)
    return Ok(str)
  } catch (err) {
    return Err(`${str} is not an absolute URL`)
  }
})

export const url = union(absoluteUrl, relativeUrl)

export const booleanFromString = union('true', 'false').map(
  str => str === 'true'
)
