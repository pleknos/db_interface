import React                   from 'react'
import './ChangeRowModal.scss'
import InputField              from 'components/main_page/input_table/InputField'
import { toInputView }         from 'src/utilities/Normalizers'
import Postgres                from 'src/utilities/Postgres'
import { validateTransaction } from 'src/utilities/Validators'
import { makeError }           from 'utilities/Utilities'
import Error                   from 'components/Error'

export default class ChangeRowModal extends React.Component {
  constructor (props) {
    super(props)
    this.updateTransaction = this.updateTransaction.bind(this)
    this.deleteTransaction = this.deleteTransaction.bind(this)

    this.state = {error: undefined}

    this.cols = {}
    this.props.contents.cells.forEach(cell => {
      this.cols[cell.column] = toInputView(cell.value, {type: cell.type})
    })
  }

  selectOption (column, option) {
    this.setState({
      [column.name]: option,
    })
  }

  async updateTransaction () {
    let difference = {}

    Object.keys(this.cols).forEach(col => {
      if (this.cols[col] !== this.state[col]) difference[col] = this.state[col]
    })

    try {
      const changes = validateTransaction(difference, this.props.columns)

      await Postgres.update(
        {place: 'public.' + this.props.currentTable, changes: changes, where: 'id = ' + this.props.contents.id},
      )

      this.props.reloadRows(true)

    } catch (error) {
      makeError(error, this.props.caller)
      console.error(error.message)
    }
  }

  async deleteTransaction () {
    try {
      await Postgres.delete(
        {place: 'public.' + this.props.currentTable, where: 'id = ' + this.props.contents.id},
      )

      this.props.reloadRows(true)

    } catch (error) {
      makeError(error, this.props.caller)
      console.error(error.message)
    }
  }

  render () {
    let columns = this.props.columns
    let cells = this.props.contents.cells

    let defaultValue = ''
    if (this.props.currentRow) defaultValue = toInputView(this.props.currentRow[column.name], column)

    const inputFields = columns.map(column => {
        for (let cell of cells) {
          if (cell.column === column.name) defaultValue = toInputView(cell.value, column)
        }

        return (
          <li key={column.name}>
            <InputField column={column}
                        selectOption={(option) => this.selectOption(column, option)}
                        default={defaultValue}
            />
          </li>
        )
      },
    )

    return <div className='changeRowModal'>
      <div className='crmContents'>
        <ul>{inputFields}</ul>

        <div className='crmButtons'>
          <button onClick={this.updateTransaction}>Изменить</button>
          <button onClick={this.deleteTransaction}>Удалить</button>
          <button onClick={this.props.onClick}>Закрыть</button>
        </div>
      </div>
      {this.state.error && <Error data={this.state.error} />}
    </div>
  }
}