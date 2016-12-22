import React from 'react'
import ImageStore from '../stores/ImageStore'
import ImageActions from '../actions/ImageActions'

const getState = () => {
  return {
    image: ImageStore.getSelected()
  }
}

const Image = React.createClass({
  getInitialState: function() {
    return getState();
  },

  componentDidMount: function() {
    ImageStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    ImageStore.removeChangeListener(this._onChange);
  },

  render: function() {
    let image = this.state.image
    return (
      <div>
        <h3>Active Image</h3>
        <table>
          <tbody>
          <tr>
            <td>ID:</td>
            <td>{image.id}</td>
          </tr>
          <tr>
            <td>Name:</td>
            <td><a href="#" onClick={this._onEdit('name')}>{image.name}</a></td>
          </tr>
          <tr>
            <td>Width:</td>
            <td><a href="#" onClick={this._onEdit('width')}>{image.width || 'undefined'}</a></td>
          </tr>
          <tr>
            <td>Height:</td>
            <td><a href="#" onClick={this._onEdit('height')}>{image.height || 'undefined'}</a></td>
          </tr>
          </tbody>
        </table>
        <hr />
      </div>
    )
  },

  _onEdit: function(key, validation) {
    let image = this.state.image
    return function(e) {
      let oldValue = e.target.innerHTML
      let newValue = prompt(`Enter new ${key}:`, oldValue)
      
      if (newValue !== null) {
        ImageActions.update(image.id, {[key]: newValue})
      }
    }
  },

  _onChange: function() {
    this.setState(getState());
  }
})

export default Image