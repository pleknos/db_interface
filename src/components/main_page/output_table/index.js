import React                  from 'react'
import OutputRow              from 'components/main_page/output_table/OutputRow'
import outputTableContextMenu from 'components/main_page/output_table/outputTableContextMenu'
import SumOutputField         from 'components/main_page/output_table/SumOutputField'
import ChangeRowModal         from 'components/main_page/output_table/ChangeRowModal'
import Postgres               from 'utilities/Postgres'
import { makeError }          from 'utilities/Utilities'
import Error                  from 'components/Error'
import './index.scss'

export default class OutputTable extends React.Component {
  constructor (props) {

    super(props)
    this.state = {rows: [], rowsOffset: 0, changeRowModal: false}

    this.filter = this.props.filter

    this.loadRows = this.loadRows.bind(this)
    this.handleTableScroll = this.handleTableScroll.bind(this)
    this.setCurrentRow = this.setCurrentRow.bind(this)
    this.initiateChangeRow = this.initiateChangeRow.bind(this)

    this.loadRows(30)
  }

  async loadRows (amount) {
    const options = {
      place: 'public.' + [this.props.currentTable],
      amount: amount,
      offset: this.state.rowsOffset,
      ...this.filter.make(),
    }

    let rows

    try {
      rows = await Postgres.select(options)
    } catch (error) {
      makeError(error, this)
      console.error(error.message)
    }

    this.setState({
      rows: [...this.state.rows, ...rows],
      rowsOffset: this.state.rowsOffset + amount,
    })
  }

  async componentDidUpdate () {
    if (this.props.shouldReloadRows) {
      this.props.reloadRows(false)
      await this.setState({rows: [], rowsOffset: 0})
      this.loadRows(30)
    }
  }

  componentDidMount () {
    outputTableContextMenu(this)
  }

  handleTableScroll (event) {
    const target = event.target
    if (target.scrollHeight - target.clientHeight - target.scrollTop ===
      0 && target.scrollTop !== 0) this.loadRows(100)
  }

  setCurrentRow (currentRow) {
    this.props.setCurrentRow(currentRow)
  }

  initiateChangeRow ({cells, id}) {
    //console.log(cells, id)
    this.setState({changeRowModal: !this.state.changeRowModal, changeRowModalContents: {cells, id}})
  }

  render () {
    const columns = this.props.columns
    const rows = this.state.rows

    const tableHeaderCols = columns.map(column =>
      <th key={column.name}>
        {column.literal}
      </th>,
    )

    const tableRows = rows.map(row => {
        return <OutputRow setCurrentRow={this.setCurrentRow} row={row} columns={columns} key={row.id} />
      },
    )

    return (
      <div>
        <table className='outputTable' onScroll={this.handleTableScroll}>
          <thead>
          <tr>
            {tableHeaderCols}
          </tr>
          </thead>
          <tbody>
          {tableRows}
          </tbody>
        </table>
        <SumOutputField filter={this.filter} filterState={this.filter.state} current={this.props.currentTable} />
        {this.state.changeRowModal &&
        <ChangeRowModal onClick={this.initiateChangeRow} contents={this.state.changeRowModalContents}
                        currentTable={this.props.currentTable} columns={columns} caller={this}
                        reloadRows={this.props.reloadRows} />}
        {this.state.error && <Error data={this.state.error} />}
      </div>
    )
  }
}