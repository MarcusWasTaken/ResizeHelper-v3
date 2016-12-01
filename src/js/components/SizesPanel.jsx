import React from 'react'
import _ from 'underscore'

import { lib, MdlInputWrapper, MdlRadioInputWrapper } from 'js/lib'
import { Panel, PanelBody, PanelTitle, PanelFooter } from 'components/panel'
import { Modal, ModalTitle, ModalContent, ModalActions } from 'components/modal'

const SizesPanel = React.createClass({
  mixins: [lib.mixins.ModalCRUDMixin],
  getInitialState: function() {
    return {
      modal: {}
    }
  },
  getDefaultProps: function() {
    return {
      arrayName: 'sizes'
    };
  },
  render: function() {
    var sizes = this.props.sizes.map((size) => (
      <SizeItem
        key={size.id}
        size={size}
        onUserDestroy={this.destroy}
        onUserEdit={this.showModalWith}
      />
    ));
    var modal = ! _.isEmpty(this.state.modal)
      ? (
          <SizeModal
            object={this.state.modal}
            onUserClose={this.closeModal}
            onUserSave={this.update}
            onUserDestroy={this.destroy}
          />
        )
      : null;
    return (
      <Panel>
        <PanelTitle text="Sizes">
          <button
            className="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect mdl-button--primary"
            onClick={this.create}
          >
            <i className="material-icons">add</i>
          </button>
        </PanelTitle>
        <ul className="mdl-list">
          {sizes}
        </ul>
        {modal}
      </Panel>
    );
  }
});

const SizeModal = React.createClass({
  mixins: [lib.mixins.ModalMixin],
  render: function() {
    return (
      <Modal
        ref={(ref) => { ref != null ? this.modal = ref.refs.modal : false }}
        onUserClose={this.props.onUserClose}
      >
        <ModalTitle>Sizes</ModalTitle>
        <ModalContent>
          <MdlInputWrapper label="Name">
            <input defaultValue={this.props.object.name} name="name" />
          </MdlInputWrapper>
          <MdlInputWrapper label="Width" number>
            <input defaultValue={this.props.object.width} name="width" />
          </MdlInputWrapper>
        </ModalContent>
        <ModalActions>
          <button type="button" className="mdl-button" onClick={this.save}>Save</button>
          <button type="button" className="mdl-button" onClick={this.destroy}>Delete</button>
        </ModalActions>
      </Modal>
    );
  }
});

const SizeItem = React.createClass({
  // destroy: function() {
  //   this.props.onUserDestroy(this.props.id);
  // },
  handleEdit: function() {
    this.props.onUserEdit(this.props.size);
  },
  render: function() {
    var self = this.props.size;
    return (
      <li className="mdl-list__item mdl-list__item--two-line">
        <span className="mdl-list__item-primary-content">
          <span>
            {self.name || <span className="mdl-color-text--red">No name</span>}
          </span>
          <span className="mdl-list__item-sub-title">
            {  
              self.width //&& self.height
                ? self.width + 'x' + (self.height || 0)
                : <span className="mdl-color-text--red">Invalid data</span>
            }
          </span>
        </span>
        <span className="mdl-list__item-secondary-content">
          <a className="mdl-list__item-secondary-action mdl-color-text--primary" href="#" onClick={this.handleEdit}>
            <i className="material-icons">edit</i>
          </a>
        </span>
      </li>
    );
  }
});

module.exports = SizesPanel