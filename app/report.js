window.addEventListener('message', receiveMessage, false)

function receiveMessage (event) {
  makeReport(event.data)
}

document.querySelector('.print').onclick = () => {
  window.print()
}

const colors = ['#21247F', '#45477F', '#6F72CC', '#8B8EFF', '#D7D8FF', 'white']

const makeReport = (data) => {
  const app = document.getElementById('app')
  const header = document.createElement('div')

  header.className = 'header'

  header.innerHTML = `
          <span class='column ids'></span>
          <span class='column names'>Виды поступлений</span>
          <span class='column'>Долг на начало</span>
          <span class='column'>Бюджет</span>
          <span class='column'>ДС Итого</span>
          <span class='column'>Долг на конец</span>
        `

  app.append(header)

  iterate(data, app, '', 0)
}

const iterate = (data, container, previousRows, colorIterator) => {

  if (previousRows === undefined) previousRows = ''

  for (let row in data) {
    if (typeof data[row] === 'object') {
      let item = document.createElement('div')

      let rowIds = previousRows + row

      let style = `'background-color: ${colors[colorIterator]}`

      if (colorIterator < 3) {style += `; color: white'`}

      if (colors[colorIterator] === 'white') {style += `; border-top: 1px solid black'`} else {style += `'`}

      item.innerHTML =
        `
          <span class='column ids' style=${style}>${rowIds}</span>
          <span class='column names' style=${style}>${data[row].name}</span>
          <span class='column' style=${style}>${((data[row].planBefore - data[row].factBefore) / 100).toLocaleString()}</span>
          <span class='column' style=${style}>${(data[row].plan / 100).toLocaleString()}</span>
          <span class='column' style=${style}>${(data[row].fact / 100).toLocaleString()}</span>
          <span class='column' style=${style}>${((data[row].planBefore - data[row].factBefore + data[row].plan -
          data[row].fact) / 100).toLocaleString()}</span>
        `

      container.append(item)
      iterate(data[row], item, rowIds + '.', colorIterator + 1)
    }
  }
}