import React from 'react'
import ChooseReport from 'components/reports_page/ChooseReport'
import ChoosePeriod from 'components/reports_page/ChoosePeriod'
import ChooseActivities from 'components/reports_page/ChooseActivities'
import CreateReport from 'components/reports_page/CreateReport'
import './index.scss'

export default class ReportsPage extends React.Component {
  constructor(props) {
    super(props)
  }

  choose(type, value) {
    this.setState({ [type]: value })
  }

  render() {
    return (
      <div className="reports">
        <ChooseReport onChange={(t, v) => this.choose(t, v)} />
        <ChoosePeriod onChange={(t, v) => this.choose(t, v)} />
        <ChooseActivities onChange={(t, v) => this.choose(t, v)} />
        <CreateReport state={this.state} />
      </div>
    )
  }
}
