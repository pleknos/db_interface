export const toTableView = (field, column) => {
  const contents = column.contents

  if (contents) {
    for (let i = 0; i < contents.length; i++) {
      if (contents[i].id === field) return contents[i].name
    }
  }

  if (field === null) return ''
  if (column.type === 'date') return niceDate(field)
  if (column.type === 'currency') return (field / 100).toLocaleString()

  return field
}

export const toInputView = (field, column) => {
  if (field === null) return ''
  if (column.type === 'date') return niceDate(new Date(field))
  if (column.type === 'currency') return (field / 100).toLocaleString()
  return field
}

export const toOutputView = (field, column) => {
  if (column.type === 'date') return field.replace(/[\W]/g, '/')
  if (column.type === 'currency') return parseInt((field.replace(/[\s]/g, '').replace(/[,]/g, '.')) * 100)
  return field
}

export const niceDate = date => {
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
}

