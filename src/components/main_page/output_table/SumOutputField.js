import React from 'react'
import Postgres from 'utilities/Postgres'
import 'components/main_page/output_table/SumOutputField.scss'

export default class SumOutputField extends React.Component {
  constructor(props) {
    super(props)
    this.state = { sum: 0 }

    this.getSum = this.getSum.bind(this)

    this.getSum()
  }

  async getSum() {
    const { where } = this.props.filter.make()
    let sum = await Postgres.select({ subject: 'SUM(amount)', place: 'public.' + this.props.current, where })
    sum = (sum[0].sum / 100).toLocaleString()
    this.setState({ sum })
  }

  componentDidUpdate(prevProps) {
    if (this.props.current !== prevProps.current) {
      this.getSum()
    } else if (this.props.filterState !== prevProps.filterState) {
      this.getSum()
    }
  }

  render() {
    return <div className="sumOutputField">Итого: {this.state.sum}</div>
  }
}
