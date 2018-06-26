import React    from 'react'
import ReactDOM from 'react-dom'
import MainPage from 'components/main_page'
import 'src/main.scss'
import 'src/normalize.scss'

class App extends React.Component {
  render() {
    return <MainPage />
  }
}

ReactDOM.render( <App />, document.getElementById( 'app' ) )