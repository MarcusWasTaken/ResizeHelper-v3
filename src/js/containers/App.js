import React from 'react'
import ImageStore from '../stores/ImageStore'
import ImageList from './ImageList'
import Image from './Image'

const getState = () => {
  return {
    selected: ImageStore.getSelected()
  }
}

const App = React.createClass({
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
    let page
    if(typeof this.state.selected !== 'undefined') {
      page = <Image />
    }
    return (
      <div>
        <ImageList />
        <hr />
        {page}
      </div>
    )
  },

  _onChange: function() {
    this.setState(getState());
  }
})

export default App