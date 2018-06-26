import React           from 'react'
import { toTableView } from 'src/utilities/Normalizers'

const OutputRow = (props) => {

  const outputFields = props.columns.map(column =>
    < td key={column.name} data-value={props.row[column.name]} data-column={column.name} data-type={column.type}>
      {toTableView(props.row[column.name], column)}
    </td>,
  )

  const handleClick = () => { props.setCurrentRow(props.row)}

  return <tr onClick={handleClick} data-id={props.row.id}>{outputFields}</tr>
}

export default OutputRow
