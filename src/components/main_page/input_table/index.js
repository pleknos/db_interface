import React from 'react'
import InputField from 'components/main_page/input_table/InputField'
import Postgres from 'utilities/Postgres'
import { toInputView } from 'utilities/Normalizers'
import { validateTransaction } from 'utilities/Validators'
import { makeError } from 'utilities/Utilities'
import Error from 'components/Error'
import './index.scss'

export default class InputTable extends React.Component {
  constructor(props) {
    super(props)

    this.makeTransaction = this.makeTransaction.bind(this)
    this.selectOption = this.selectOption.bind(this)

    this.state = {
      error: undefined
    }
  }

  selectOption(column, option) {
    this.setState({
      [column.name]: option
    })
  }

  async makeTransaction() {
    try {
      const validTransaction = validateTransaction(this.state, this.props.columns)

      await Postgres.insertTransaction({
        transaction: validTransaction,
        place: 'public.' + this.props.currentTable
      })

      this.props.reloadRows(true)
    } catch (error) {
      makeError(error, this)
      console.error(error.message)
    }
  }

  render() {
    const columns = this.props.columns

    const inputFields = columns.map(column => {
      let defaultValue = ''
      if (this.props.currentRow) defaultValue = toInputView(this.props.currentRow[column.name], column)

      return (
        <li key={column.name}>
          <InputField
            column={column}
            selectOption={option => this.selectOption(column, option)}
            default={defaultValue}
          />
        </li>
      )
    })

    return (
      <div className="inputTable">
        <ul>{inputFields}</ul>
        <button onClick={this.makeTransaction}>+</button>
        {this.state.error && <Error data={this.state.error} />}
      </div>
    )
  }
}
