import React from 'react'
import 'components/Error.scss'

const Error = props => {
  return (
    <div className="error">
      <h1>{props.data.message}</h1>
      <h2>{props.data.type}</h2>
    </div>
  )
}

export default Error
