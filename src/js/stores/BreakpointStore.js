import AppDispatcher from '../dispatcher/AppDispatcher'
import { EventEmitter } from 'events'
import lib from 'js/lib'

var _breakpoints = {}

const create = (imageID) => {
  const id = lib.uuid()
  _breakpoints[id] = {
    id,
    
  }
}

const ImageStore = Object.assign({}, EventEmitter.prototype, {
  get: (id) => {
    return _images[id]
  },

  getAll: () => {
    return _images
  },

  getArray: () => {
    let _arr = []
    for (let id in _images) {
      _arr.push(_images[id])
    }
    return _arr
  },

  getSelected: () => {
    return ImageStore.get(_selected)
  },

  emitChange: () => {
    ImageStore.emit('change')
  },

  addChangeListener: (callback) => {
    ImageStore.on('change', callback)
  },

  removeChangeListener: (callback) => {
    ImageStore.removeListener('change', callback)
  }
})

AppDispatcher.register((action) => {
  switch(action.actionType) {
    case 'IMAGE_CREATE':
      if(action.name.trim() !== '') {
        create(action.name)
        ImageStore.emitChange()
      }
      break

    case 'IMAGE_SELECT':
      if(action.id !== _selected) {
        select(action.id)
        ImageStore.emitChange()
      }
      break

    case 'IMAGE_UPDATE':
      for (let key in action.update) {
        //shitty validation
        if (
          (key == 'name' && action.update[key].trim() !== '') ||
          (key.match(/width|height/g) && parseInt(action.update[key]) > 0)
        ) {
          update(action.id, key, action.update[key])
        }
      }
      ImageStore.emitChange()
      break

    default:
      //no op
  }
})

export default ImageStore