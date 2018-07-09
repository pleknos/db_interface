import { toOutputView, toInputView } from 'utilities/Normalizers'

export default class Filter {
  constructor() {
    this.default = {
      subject: '*',
      where: undefined,
      director: 'id',
      direction: 'DESC'
    }
  }

  //statement = 'where' => argument = {column, value, type}
  add(statement, argument, validation = true) {
    if (statement === 'where') {
      if (validation)
        argument.value = toOutputView(toInputView(argument.value, { type: argument.type }), { type: argument.type })

      const operator = argument.type === 'commentary' ? 'LIKE' : '='

      if (operator === 'LIKE') {
        argument.value = `%${argument.value}%`
      }

      if (this.where) {
        this.where += ` AND ${argument.column} ${operator} '${argument.value}'`
      } else {
        this.where = `${argument.column} ${operator} '${argument.value}'`
      }
    } else {
      this[statement] = argument
    }

    return this
  }

  reset() {
    delete this.subject
    delete this.where
    delete this.director
    delete this.direction

    return this
  }

  get state() {
    return JSON.stringify(this.make())
  }

  make() {
    return {
      subject: this.subject || this.default.subject,
      where: this.where || this.default.where,
      director: this.director || this.default.director,
      direction: this.direction || this.default.direction
    }
  }
}
