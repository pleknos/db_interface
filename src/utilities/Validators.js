import { toOutputView } from 'utilities/Normalizers'

class ValidationError extends Error {
  constructor (props) {
    super(props)
    this.type = 'validationError'
  }
}

export const validateTransaction = (transaction, columns) => {
  let valid = {}

  for (let column of columns) {
    valid[column.name] = validateSingle(transaction[column.name], column)
  }

  return valid
}

export const validateSingle = (value, column) => {
  let tc = toOutputView(value, column)

  if (column.type === 'table' && (tc === '' || tc === null)) throw new ValidationError(
    `Отсутствует значение в поле '${column.literal}'`)

  if (column.type === 'date') {
    if (!/^[0-9]{1,2}[/][0-9]{1,2}[/][0-9]{2,4}$/g.test(tc)) throw new ValidationError(
      `Дата введена неправильно`)
  }

  if (column.type === 'currency') {
    if (!/^-?[0-9]+$/g.test(tc)) throw new ValidationError(`Сумма введена неправильно`)
  }

  return tc
}