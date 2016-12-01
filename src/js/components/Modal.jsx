import React from 'react'

const Modal = React.createClass({
  render: function() {
    return (
      <dialog className="mdl-dialog" ref="modal">
        <button
          type="button"
          className="mdl-button mdl-js-button mdl-button--icon helper-modal-button--close"
          onClick={this.props.onUserClose}
        >
          <i className="material-icons">clear</i>
        </button>
        {this.props.children}
      </dialog>
    );
  }
});

const ModalTitle = React.createClass({
  render: function() {
    return (
      <h2 className="mdl-dialog__title">{this.props.children}</h2>
    );
  }
});
  
const ModalContent = React.createClass({
  render: function() {
    return (
      <div className="mdl-dialog__content">
        <form className="modal-form">{this.props.children}</form>
      </div>
    );
  }
});

const ModalActions = React.createClass({
  render: function() {
    return (
      <div className="mdl-dialog__actions">
        {this.props.children}
      </div>
    );
  }
});

module.exports = {
  Modal: Modal,
  ModalTitle: ModalTitle,
  ModalContent: ModalContent,
  ModalActions: ModalActions
}