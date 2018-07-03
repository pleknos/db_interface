import * as pgp   from 'pg-promise'
import connection from 'configs/db_settings'

const db = pgp.default()(connection)

export default class Postgres {

  static select ({subject = '*', place, where, amount, offset, director = 'id', direction}) {
    if (place === undefined) throw new Error('select a table to fetch data from')

    let selectString = `SELECT ${subject} FROM ${place}`

    if (where) selectString += ` WHERE ${where}`

    if (direction && director !== 'id') {
      selectString += ` ORDER BY ${director} ${direction}, id ${direction}`
    } else if (direction) {
      selectString += ` ORDER BY ${director} ${direction}`
    }

    if (amount) selectString += ` LIMIT ${amount}`
    if (offset) selectString += ` OFFSET ${offset}`

    return db.any(selectString)
  }

  static update ({place, changes, where}) {
    if (place === undefined || changes === undefined || where === undefined) {
      throw new Error('Недостаточно данных для транзакции')
    }

    let updateString = `UPDATE ${place} SET`

    Object.entries(changes).forEach((entry) => {
      updateString += ` ${entry[0]} = '${entry[1]}',`
    })
    updateString = updateString.slice(0, -1)

    updateString += ` WHERE ${where}`

    return db.any(updateString)
  }

  static delete ({place, where}) {
    if (place === undefined || where === undefined) throw new Error('Недостаточно данных для транзакции')

    let deleteString = `DELETE FROM ${place} WHERE ${where}`

    return db.any(deleteString)
  }

  static insertTransaction ({transaction, place}) {
    const insertString = `
      INSERT INTO ${place} (${Object.keys(transaction).toString()}) 
      VALUES (${Object.values(transaction).map(each => '\'' + each + '\'').toString()})
    `

    return db.any(insertString)
  }

}