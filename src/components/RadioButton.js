import React from 'react'
import './RadioButton.scss'

const RadioButton = (props) => {

  const style = props.style ? props.style : {}

  return (
    <button className='radioButton' onClick={props.onClick} style={style}>
      {
        props.options.map(option => {
          if (props.current === option.value) return <span key={option.value}><strong>{option.label}</strong></span>
          else return <span key={option.value}>{option.label}</span>
        })
      }
    </button>
  )
}

export default RadioButton