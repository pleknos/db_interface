import React    from 'react'
import Postgres from 'utilities/Postgres'

export default class ChooseActivities extends React.Component {
  constructor (props) {
    super(props)
    this.type = 'activities'

    this.state = {rawActivities: {}, activities: []}

    this.loadActivities()

    this.onClick = this.onClick.bind(this)
  }

  async loadActivities () {
    const rawActivities = await Postgres.select({place: 'public.activity_types', direction: 'ASC'})

    let activities = []

    rawActivities.map(act => {
      activities.push({id: act.id, value: false, label: act.name})
    })

    this.setState({rawActivities, activities})
  }

  onClick (event) {
    const input = event.target.closest('li').firstElementChild

    const updatedActivities = this.state.activities.map(act => {
      if (act.id == input.name) {
        act.value = !act.value
        input.checked = act.value
      }
      return act
    })

    this.setState({activities: updatedActivities})
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState !== this.state) this.props.onChange(this.type, this.state.activities)
  }

  render () {
    const actsList = this.state.activities.map(act => (
        <li onClick={this.onClick} key={act.id}>
          <input onclick='return false' type='checkbox' name={act.id} defaultValue='false' />
          <span>{act.label}</span>
        </li>
      ),
    )

    return (
      <div className='choiceDiv'>
        <h2>Деятельности</h2>
        <ul>
          {actsList}
        </ul>
      </div>
    )
  }
}