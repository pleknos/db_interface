import React    from 'react'
import Postgres from 'utilities/Postgres'

export default class ChooseReport extends React.Component {
  constructor (props) {
    super(props)

    this.type = 'report'

    this.state = {reports: {}}

    this.getReports()

    this.onClick = this.onClick.bind(this)
  }

  async getReports () {
    const reports = await Postgres.select({place: 'private.reports', direction: 'ASC'})
    this.setState({reports})
  }

  onClick (event) {
    const input = event.target.closest('li').firstElementChild
    input.checked = true
    this.props.onChange(this.type, input.value)
  }

  render () {

    const reportsList = Object.values(this.state.reports).map(report => (
      <li key={report.name} onClick={this.onClick}>
        <input type='radio' name='chooseReport' value={report.name} />
        <span>{report.label}</span>
      </li>
    ))

    return (
      <div className='choiceDiv'>
        <h2>Тип отчета</h2>
        <ul>
          {reportsList}
        </ul>
      </div>
    )
  }
}