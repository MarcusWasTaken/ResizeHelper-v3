import React from 'react'
import update from 'immutability-helper'
import _ from 'underscore'

import { lib, MdlInputWrapper, MdlRadioInputWrapper } from 'js/lib'
import { Modal, ModalTitle, ModalContent, ModalActions } from 'components/modal'

const Drawer = React.createClass({
  clearImage: function() {
    this.props.onUserInput({
      activeImage: { $set: {} }
    });
  },
  render: function() {
    return (
      <div className="helper-drawer mdl-layout__drawer">
        <span className="mdl-layout-title mdl-color--primary mdl-color-text--white">Resize helper</span>
        <nav className="helper-navigation mdl-navigation">
        <h3 className="helper-navigation-title">Pages</h3>
          <a className="mdl-navigation__link" onClick={this.clearImage}>About</a>
        </nav>
        <ImageList
          images={this.props.app.images}
          activeId={this.props.app.activeImage.id}
          onUserInput={this.props.onUserInput}
          onUserImageChange={this.props.onUserImageChange}
        />
      </div>
    );
  }
});

const ImageList = React.createClass({
  mixins: [lib.mixins.ModalCRUDMixin],
  getInitialState: function() {
    return {
      modal: {}
    }
  },
  getDefaultProps: function() {
    return {
      arrayName: 'images'
    };
  },
  handleCreate: function() {
    this.create(function(obj) {
      return _.extend(obj, {
        breakpoints: [],
        sizes: []
      });
    });
  },
  render: function() {
    var images = this.props.images.map(function(image) {
      return (
        <ImageItem
          key={image.id}
          image={image}
          activeId={this.props.activeId}
          onUserDestroy={this.destroy}
          onUserEdit={this.showModalWith}
          onUserImageChange={this.props.onUserImageChange}
        />
      );
    }, this);
    var modal = ! _.isEmpty(this.state.modal)
      ? (
          <ImageListModal
            object={this.state.modal}
            onUserClose={this.closeModal}
            onUserSave={this.update}
          />
        )
      : null;
    return (
      <nav className="helper-navigation mdl-navigation">
        <h3 className="helper-navigation-title">Images</h3>
        {images}
        <span className="mdl-navigation__link no_hover">
          <button className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" onClick={this.handleCreate}>
            New Image
          </button>
        </span>
        {modal}
      </nav>
    );
  }
});

const ImageListModal = React.createClass({
  mixins: [lib.mixins.ModalMixin],
  render: function() {
    return (
      <Modal 
        ref={(ref) => { ref != null ? this.modal = ref.refs.modal : false }}
        onUserClose={this.props.onUserClose}
      >
        <ModalTitle>Image</ModalTitle>
        <ModalContent>
          <MdlInputWrapper label="Name">
            <input defaultValue={this.props.object.name} name="name" />
          </MdlInputWrapper>
          <div className="double-inputfields">
            <MdlInputWrapper label="Width" number>
              <input defaultValue={this.props.object.width} name="width" />
            </MdlInputWrapper>
            <MdlInputWrapper label="Height" number>
              <input defaultValue={this.props.object.height} name="height" />
            </MdlInputWrapper>
          </div>
          <div className="double-inputfields">
            <MdlInputWrapper label="Render Width" number>
              <input defaultValue={this.props.object.renderWidth} name="renderWidth" />
            </MdlInputWrapper>
            <div className="input-group input-group--right">
              <MdlRadioInputWrapper>
                <input name="renderUnit" value="px" defaultChecked={this.props.object.renderUnit === "px"}/>
              </MdlRadioInputWrapper>
              <MdlRadioInputWrapper>
                <input name="renderUnit" value="vw" defaultChecked={this.props.object.renderUnit === "vw"}/>
              </MdlRadioInputWrapper>
            </div>
          </div>
        </ModalContent>
        <ModalActions>
          <button type="button" className="mdl-button" onClick={this.save}>Save</button>
        </ModalActions>
      </Modal>
    );
  }
});

const ImageItem = React.createClass({
  handleEdit: function() {
    this.props.onUserEdit(this.props.image);
  },
  componentDidMount: function() {
    this.handleImageChange();
  },
  handleImageChange: function() {
    if(this.props.image.id != this.props.activeId) {
      this.props.onUserImageChange(this.props.image);
    }
  },
  render: function() {
    var isActive = this.props.image.id === this.props.activeId;
    return (
      <a 
        className={'mdl-navigation__link' + (isActive ? ' active' : '')}
        onClick={this.handleImageChange}
      >
        {this.props.image.name}
      </a>
    );
  }
});

export default Drawer