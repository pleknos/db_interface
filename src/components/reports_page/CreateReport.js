import React from 'react'
import Report from 'utilities/Report'

export default class CreateReport extends React.Component {
  constructor(props) {
    super(props)

    this.createReport = this.createReport.bind(this)
  }

  async createReport(event) {
    const target = event.target

    target.disabled = true
    target.innerText = 'Создается...'

    try {
      const reportObject = await new Report(this.props.state)
      const reportWindow = window.open('report.html', '', 'width=700,height=800')

      setTimeout(() => {
        reportWindow.postMessage(reportObject, '*')
      }, 1000)
    } finally {
      target.disabled = false
      target.innerText = 'Создать отчет'
    }
  }

  render() {
    return (
      <button className="createReportButton" onClick={this.createReport}>
        Создать отчет
      </button>
    )
  }
}
