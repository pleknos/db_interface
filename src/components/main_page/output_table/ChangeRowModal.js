import React           from 'react'
import './ChangeRowModal.scss'
import InputField      from 'components/main_page/input_table/InputField'
import { toInputView } from 'src/utilities/Normalizers'

export default class ChangeRowModal extends React.Component {
  constructor (props) {
    super(props)
  }

  selectOption (column, option) {
    this.setState({
      [column.name]: option,
    })
  }

  componentDidUpdate () {
    console.log(this.state)
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
          <button>Изменить</button>
          <button>Удалить</button>
          <button onClick={this.props.onClick}>Закрыть</button>
        </div>
      </div>
    </div>
  }
}