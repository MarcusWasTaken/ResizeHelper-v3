import React from 'react'
import update from 'immutability-helper'
import _ from 'underscore'

import { lib, MdlInputWrapper, MdlRadioInputWrapper } from 'js/lib'
import { Modal, ModalTitle, ModalContent, ModalActions } from 'components/modal'

import 'css/modules/drawer'

const Drawer = React.createClass({
  clearImage: function() {
    this.props.onUserInput({
      activeImage: { $set: {} }
    });
  },
  changePage: function(page) {
    this.props.onPageChange(page)
  },
  render: function() {
    return (
      <div className="rh-drawer mdl-layout__drawer">
        <span className="mdl-layout-title mdl-color--primary mdl-color-text--white">Resize helper</span>
        <nav className="rh-navigation mdl-navigation">
          <a className="mdl-navigation__link" onClick={this.changePage}>
            <i className="material-icons md-18">info</i>About
          </a>
          <a className="mdl-navigation__link" onClick={this.changePage}>
            <i className="material-icons md-18">settings</i>Options
          </a>
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
      <nav className="rh-navigation mdl-navigation">
        <h3 className="rh-navigation-title">Images</h3>
        <a className="mdl-navigation__link" onClick={this.handleCreate}>
          <i className="material-icons md-18">add_circle</i>New Image
        </a>
        <br/>
        {images}
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
        <ModalTitle>New Image</ModalTitle>
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
        <i className="material-icons md-18">image</i>
        <span className="truncate">{this.props.image.name}</span>
      </a>
    );
  }
});

export default Drawer