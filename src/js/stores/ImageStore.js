import AppDispatcher from '../dispatcher/AppDispatcher'
import { EventEmitter } from 'events'
import lib from 'js/lib'

var _images = lib.store('rh-images')
var _selected = lib.store('rh-selected')

const create = (name) => {
  const id = lib.uuid()
  _images[id] = {
    id,
    name
  }
}

const select = (id) => {
  _selected = id
}

const update = (id, key, value) => {
  _images[id][key] = value
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
    lib.store('rh-images', _images)
    lib.store('rh-selected', _selected)
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