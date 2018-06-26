import React              from 'react'
import Select             from 'react-select'
import { validateSingle } from 'utilities/Validators'
import './index.scss'

export default class FilterModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {firstOption: '', secondOption: ''}
    this.handleFirstChange = this.handleFirstChange.bind(this)
    this.handleSecondChange = this.handleSecondChange.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.addFilter = this.addFilter.bind(this)

    this.columns = this.props.columns.reduce((prev, cur) => {
      return Object.assign(prev, {[cur.id]: cur})
    }, {})
  }

  addFilter () {
    try {
      if (this.state.firstOption === '' || this.state.secondOption === '') throw new Error('Одно из полей не заполнено')

      const result = validateSingle(this.state.secondOption, this.columns[this.state.firstOption])

      this.props.filter.add('where', {
        column: this.columns[this.state.firstOption].name,
        value: result,
        type: this.columns[this.state.firstOption].type,
      }, false)
    } catch (error) {
      console.error(error.message)
    }

    this.props.reloadRows(true)
  }

  handleFirstChange (firstOption) {
    if (firstOption !== null) {
      this.setState({firstOption: firstOption.id})
    } else {
      this.setState({firstOption: ''})
    }
  }

  handleSecondChange (secondOption) {
    if (secondOption !== null) {
      this.setState({secondOption: secondOption.id})
    } else {
      this.setState({secondOption: ''})
    }
  }

  handleInputChange (event) {
    this.setState({secondOption: event.target.value})
  }

  render () {
    const {firstOption, secondOption} = this.state

    return (
      <div className='filterModal'>
        <div className='fmContents'>
          <Select value={firstOption}
                  onChange={this.handleFirstChange}
                  placeholder='Столбец'
                  options={this.props.columns}
                  noResultsText='Совпадения не найдены'
                  multi={false}
                  labelKey='literal'
                  valueKey='id'
                  matchProp='any'
          />
          {firstOption !== '' && this.columns[firstOption].type === 'table' &&
          <Select value={secondOption}
                  onChange={this.handleSecondChange}
                  placeholder='Значение'
                  options={(firstOption !== '' &&
                    this.columns[firstOption].contents) ||
                  []}
                  noResultsText='Совпадения не найдены'
                  multi={false}
                  labelKey='name'
                  valueKey='id'
                  matchProp='any'
                  menuContainerStyle={{width: '200px'}}
          />
          }
          {firstOption !== '' && this.columns[firstOption].type !== 'table' &&
          <div className='Select'>
            <div className='Select-control field'>
              <div className='Select-input'>
                <input type='text' placeholder='Значение' value={secondOption}
                       onChange={this.handleInputChange} />
              </div>
            </div>
          </div>
          }
          <button onClick={this.addFilter}>Добавить</button>
          <br />
          <button onClick={this.props.onClick} className='fmCls'>Закрыть</button>
        </div>
      </div>
    )
  }
}