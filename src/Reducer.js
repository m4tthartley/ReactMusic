
const initial = {
  tracks: [],
  artists: []
}

export default (state = initial, action) => {
  switch (action.type) {
    case 'ADD_TRACKS':
      return {
        ...state,
        ...{tracks: [
          ...state.tracks,
          ...action.data
        ]}
      }
      break
    case 'ADD_ARTISTS':
      return {
        ...state,
        ...{artists: [
          ...state.tracks,
          ...action.data
        ]}
      }
      break
    default:
      return state
  }
}