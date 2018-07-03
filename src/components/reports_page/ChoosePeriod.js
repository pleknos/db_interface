import React         from 'react'
import { inputDate } from 'utilities/Normalizers'

export default class ChoosePeriod extends React.Component {
  constructor (props) {
    super(props)
    this.type = 'period'
    this.today = inputDate(new Date())

    this.state = {periodType: 'month', firstDate: this.today, lastDate: this.today}

    this.makeChange = this.makeChange.bind(this)
    this.onDateChange = this.onDateChange.bind(this)
    this.onPeriodTypeChange = this.onPeriodTypeChange.bind(this)
  }

  onPeriodTypeChange (event) {
    this.setState({periodType: event.target.value})
  }

  onDateChange (event, pos) {
    this.setState({[pos]: event.target.value})
  }

  componentDidMount () {
    this.makeChange()
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.periodType !== this.state.periodType || prevState.firstDate !== this.state.firstDate ||
      prevState.lastDate !== this.state.lastDate) {
      this.makeChange()
    }
  }

  makeChange () {
    switch (this.state.periodType) {
      case 'month': {
        const date = this.state.firstDate.split('-')
        const lastDay = new Date(date[0], date[1], 0).getDate()
        const first = `1/${date[1]}/${date[0]}`
        const last = `${lastDay}/${date[1]}/${date[0]}`

        this.props.onChange(this.type, {first, last})

        break
      }
      case 'day': {
        const date = this.state.firstDate.split('-')
        const first = `${date[2]}/${date[1]}/${date[0]}`

        this.props.onChange(this.type, {first, last: first})

        break
      }
      case 'period': {
        const fdate = this.state.firstDate.split('-')
        const ldate = this.state.lastDate.split('-')

        const first = `${fdate[2]}/${fdate[1]}/${fdate[0]}`
        const last = `${ldate[2]}/${ldate[1]}/${ldate[0]}`

        this.props.onChange(this.type, {first, last})

        break
      }
    }
  }

  render () {
    return (
      <div className='choiceDiv'>
        <h2>Период</h2>
        <select name='selectPeriodType' value={this.state.periodType} onChange={this.onPeriodTypeChange}>
          <option value='month'>Месяц</option>
          <option value='day'>День</option>
          <option value='period'>Период</option>
        </select>
        <input type='date' value={this.state.firstDate} onChange={(event) => this.onDateChange(event, 'firstDate')} />
        {this.state.periodType === 'period' &&
        <input type='date' value={this.state.lastDate} onChange={(event) => this.onDateChange(event, 'lastDate')} />}
      </div>
    )
  }
}