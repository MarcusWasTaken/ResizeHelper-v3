import AppDispatcher from '../dispatcher/AppDispatcher'

const ImageActions = {
  create: (name) => {
    AppDispatcher.dispatch({
      actionType: 'IMAGE_CREATE',
      name
    })
  },

  select: (id) => {
    AppDispatcher.dispatch({
      actionType: 'IMAGE_SELECT',
      id
    })
  },

  update: (id, update) => {
    AppDispatcher.dispatch({
      actionType: 'IMAGE_UPDATE',
      id,
      update
    })
  }
}

export default ImageActions