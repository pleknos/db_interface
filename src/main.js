import React       from 'react'
import ReactDOM    from 'react-dom'
import RadioButton from 'components/RadioButton'
import MainPage    from 'components/main_page'
import ReportsPage from 'components/reports_page'
import 'src/main.scss'
import 'src/normalize.scss'

class App extends React.Component {
  constructor (props) {
    super(props)

    this.state = {currentPage: 'main'}

    this.changePage = this.changePage.bind(this)
  }

  changePage () {
    const currentPage = this.state.currentPage === 'main' ? 'reports' : 'main'
    this.setState({currentPage})
  }

  render () {
    const options = [
      {
        label: 'Ввод данных',
        value: 'main',
      },
      {
        label: 'Отчеты',
        value: 'reports',
      },
    ]

    return (
      <div className='container'>
        <RadioButton current={this.state.currentPage} options={options} onClick={this.changePage}
                     style={{float: 'right'}} />
        {this.state.currentPage === 'main' && <MainPage />}
        {this.state.currentPage === 'reports' && <ReportsPage />}
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))