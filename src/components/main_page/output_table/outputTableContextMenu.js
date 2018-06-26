import contextMenu   from 'components/contextMenu'
import { makeError } from 'utilities/Utilities'

const outputTableContextMenu = (caller) => {
  contextMenu([
    {
      label: `Разместить по возрастанию`, callback: (event) => {
        try {
          if (event.target.tagName !== 'TD') throw new Error('Действие невозможно')
          caller.filter.add('director', event.target.dataset.column).add('direction', 'ASC')
          caller.props.reloadRows(true)
        } catch (error) {
          makeError(error, caller)
          console.error(error.message)
        }
      },
    },
    {
      label: `Разместить по убыванию`, callback: (event) => {
        try {
          if (event.target.tagName !== 'TD') throw new Error('Действие невозможно')
          caller.filter.add('director', event.target.dataset.column).add('direction', 'DESC')
          caller.props.reloadRows(true)
        } catch (error) {
          makeError(error, caller)
          console.error(error.message)
        }
      },
    },
    {
      label: `Фильтр по знчению`, callback: (event) => {
        try {
          if (event.target.tagName !== 'TD') throw new Error('Действие невозможно')
          const data = event.target.dataset
          caller.filter.add('where', {column: data.column, value: data.value, type: data.type}).
                 add('direction', 'DESC')
          caller.props.reloadRows(true)
        } catch (error) {
          makeError(error, caller)
          console.error(error.message)
        }
      },
    },
    {
      label: `Изменить`, callback: (event) => {
        try {
          if (event.target.tagName !== 'TD') throw new Error('Действие невозможно')

          const id = event.target.parentElement.dataset.id
          const cells = Array.prototype.map.call(event.target.parentElement.cells, (cell) => cell.dataset)

          caller.initiateChangeRow({cells, id})

        } catch (error) {
          makeError(error, caller)
          console.error(error.message)
        }
      },
    },
    {
      label: `Удалить все фильтры`, callback: (event) => {
        try {
          caller.filter.reset()
          caller.props.reloadRows(true)
        } catch (error) {
          makeError(error, caller)
          console.error(error.message)
        }
      },
    },
  ])
}

export default outputTableContextMenu