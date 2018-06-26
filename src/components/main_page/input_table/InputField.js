import React        from 'react'
import Select       from 'react-select'
import { niceDate } from 'utilities/Normalizers'
import 'components/main_page/input_table/react-select.scss'
import './InputField.scss'

export default class InputField extends React.Component {
  constructor (props) {
    super(props)

    let defaultValue = ''

    if (this.props.column.type === 'date') {
      const date = new Date()
      defaultValue = niceDate(date)
    }

    defaultValue = this.props.default || defaultValue

    this.state = {selectedOption: defaultValue, contents: []}

    this.props.selectOption(this.state.selectedOption)

    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  componentDidUpdate (prevProps, prevState) {

    if (prevState.selectedOption !== this.state.selectedOption) this.props.selectOption(
      this.state.selectedOption)

    if (this.props.default !== prevProps.default) {

      this.setState(
        {selectedOption: this.props.default},
      )
    }
  }

  handleSelectChange (selectedOption) {
    if (selectedOption !== null) {
      this.setState({selectedOption: selectedOption.id})
    } else {
      this.setState({selectedOption: ''})
    }
  }

  handleInputChange (event) {
    this.setState({selectedOption: event.target.value})
  }

  componentWillMount () {
    if (this.props.column.contents) {
      this.setState({contents: this.props.column.contents})
    }
  }

  render () {
    const column = this.props.column
    const {selectedOption} = this.state

    if (this.state.contents.length > 0) {
      return <Select
        name='form-field-name'
        value={selectedOption}
        onChange={this.handleSelectChange}
        placeholder={column.literal}
        options={this.state.contents}
        noResultsText='Совпадения не найдены'
        multi={false}
        labelKey='name'
        valueKey='id'
        matchProp='any'
        menuContainerStyle={{width: '200px'}}
      />
    } else {
      return (
        <div className='Select-control field'>
          <div className='Select-input'>
            <input type='text' placeholder={column.literal} value={selectedOption}
                   onChange={this.handleInputChange} />
          </div>
        </div>
      )
    }

  }
}