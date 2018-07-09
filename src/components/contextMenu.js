import { remote } from 'electron'

// menuItems: [{string label, function callback}, ...]

const { Menu, MenuItem } = remote

const contextMenu = menuItems => {
  document.querySelector('.outputTable').addEventListener(
    'contextmenu',
    event => {
      const menu = new Menu()

      menuItems.forEach(item => {
        menu.append(
          new MenuItem({
            label: item.label,
            click() {
              item.callback(event)
            }
          })
        )
      })

      event.preventDefault()
      menu.popup({ window: remote.getCurrentWindow() })
    },
    false
  )
}

export default contextMenu
