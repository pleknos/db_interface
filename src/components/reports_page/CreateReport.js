import React  from 'react'
import Report from 'utilities/Report'

export default class CreateReport extends React.Component {
  constructor (props) {
    super(props)

    this.createReport = this.createReport.bind(this)
  }

  async createReport () {
    const reportObject = await new Report(this.props.state)
  }

  render () {
    return <button onClick={this.createReport}>Создать отчет</button>
  }
}



