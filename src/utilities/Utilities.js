export const makeError = (error, caller) => {
  caller.setState({error: error})
  if (caller.timerId) clearTimeout(caller.timerId)
  caller.timerId = setTimeout(() => caller.setState({error: undefined}), 4000)


}
