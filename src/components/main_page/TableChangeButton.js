import React from 'react'
import 'components/main_page/TableChangeButton.scss'

const TableChangeButton = (props) => {

  return (
    <button className='tableChangeButton' onClick={props.onClick}>
      {
        props.options.map(option => {
          if (props.current === option.value) return <span key={option.value}><strong>{option.label}</strong></span>
          else return <span key={option.value}>{option.label}</span>
        })
      }
    </button>
  )
}

export default TableChangeButton