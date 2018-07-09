import React from 'react'
import InputTable from 'components/main_page/input_table'
import Postgres from 'utilities/Postgres'
import OutputTable from 'components/main_page/output_table'
import RadioButton from 'components/RadioButton'
import FilterModal from 'components/main_page/filter_modal'
import Filter from 'utilities/Filter'

export default class MainPage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      columns: [],
      currentRow: undefined,
      currentTable: 'transactions',
      shouldReloadRows: false,
      showFilterModal: false
    }

    this.setCurrentRow = this.setCurrentRow.bind(this)
    this.reloadRows = this.reloadRows.bind(this)
    this.changeTable = this.changeTable.bind(this)
    this.handleModalToggle = this.handleModalToggle.bind(this)

    this.filter = new Filter()
  }

  async componentWillMount() {
    const columns = await Postgres.select({ place: 'private.columns' })

    for (let column of columns) {
      if (column.content_table) {
        column.contents = await Postgres.select({
          place: 'public.' + [column.content_table],
          director: 'id',
          direction: 'ASC'
        })
      }
    }

    this.setState({
      columns: columns
    })
  }

  setCurrentRow(currentRow) {
    this.setState({ currentRow })
  }

  reloadRows(bool) {
    this.setState({
      shouldReloadRows: bool
    })
  }

  changeTable() {
    const currentTable = this.state.currentTable === 'transactions' ? 'planned' : 'transactions'
    this.setState({ currentTable })
    this.reloadRows(true)
  }

  handleModalToggle() {
    this.setState({ showFilterModal: !this.state.showFilterModal })
  }

  render() {
    const options = [
      {
        label: 'Факт',
        value: 'transactions'
      },
      {
        label: 'План',
        value: 'planned'
      }
    ]

    return (
      <div>
        <RadioButton current={this.state.currentTable} options={options} onClick={this.changeTable} />
        <button onClick={this.handleModalToggle}>Добавить фильтр</button>

        <InputTable
          reloadRows={this.reloadRows}
          currentTable={this.state.currentTable}
          currentRow={this.state.currentRow}
          columns={this.state.columns}
        />

        <OutputTable
          shouldReloadRows={this.state.shouldReloadRows}
          reloadRows={this.reloadRows}
          currentTable={this.state.currentTable}
          setCurrentRow={this.setCurrentRow}
          columns={this.state.columns}
          filter={this.filter}
        />
        {this.state.showFilterModal && (
          <FilterModal
            onClick={this.handleModalToggle}
            columns={this.state.columns}
            filter={this.filter}
            reloadRows={this.reloadRows}
          />
        )}
      </div>
    )
  }
}
