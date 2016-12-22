import React from 'react'
import ImageStore from '../stores/ImageStore'
import ImageActions from '../actions/ImageActions'
import ImageListItem from '../components/ImageListItem'

const getState = () => {
  return {
    images: ImageStore.getArray()
  }
}

const ImageList = React.createClass({
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
    let imageItems = this.state.images.map((image) => 
      <ImageListItem
        key={image.id}
        {...image}
        onClick={this._onImageClick}
      />
    )
    return (
      <div>
        <h3>Images</h3>
        <button onClick={this._createImage}>
          + Add image
        </button>
        <ul>
          {imageItems}
        </ul>
      </div>
    )
  },

  _createImage: function() {
    let name = prompt('enter name for the new image', 'new image')
    if (name !== null) {
      ImageActions.create(name)
    }
  },

  _onImageClick: function(id) {
    ImageActions.select(id)
  },

  _onChange: function() {
    this.setState(getState());
  }
})

export default ImageList