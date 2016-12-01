import React from 'react'
import _ from 'underscore'

import { lib, MdlInputWrapper, MdlRadioInputWrapper } from 'js/lib'
import { Panel, PanelBody, PanelTitle, PanelFooter } from 'components/panel'
import { Modal, ModalTitle, ModalContent, ModalActions } from 'components/modal'

const BreakpointsPanel = React.createClass({
  mixins: [lib.mixins.ModalCRUDMixin],
  getInitialState: function() {
    return {
      modal: {}
    }
  },
  getDefaultProps: function() {
    return {
      arrayName: 'breakpoints'
    };
  },
  render: function() {
    var breakpoints = this.props.breakpoints.map(function(breakpoint) {
      return (
        <BreakpointItem 
          key={breakpoint.id}
          breakpoint={breakpoint}
          onUserDestroy={this.destroy}
          onUserEdit={this.showModalWith}
        />
      );
    }, this);
    var modal = ! _.isEmpty(this.state.modal)
      ? (
          <BreakpointModal
            object={this.state.modal}
            onUserClose={this.closeModal}
            onUserSave={this.update}
            onUserDestroy={this.destroy}
          />
        )
      : null;
    return (
      <Panel>
        <PanelTitle text="Breakpoints">
          <button
            className="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect mdl-button--primary"
            onClick={this.create}
          >
            <i className="material-icons">add</i>
          </button>
        </PanelTitle>
        <ul className="mdl-list">
          {breakpoints}
        </ul>
        {modal}
      </Panel>
    );
  }
});

const BreakpointModal = React.createClass({
  mixins: [lib.mixins.ModalMixin],
  render: function() {
    return (
      <Modal
        ref={(ref) => { ref != null ? this.modal = ref.refs.modal : false }}
        onUserClose={this.props.onUserClose}
      >
        <ModalTitle>Breakpoint</ModalTitle>
        <ModalContent>
          <MdlInputWrapper label="Name">
            <input defaultValue={this.props.object.name} name="name" />
          </MdlInputWrapper>
          <div className="double-inputfields">
            <MdlInputWrapper label="Query Width" number>
              <input defaultValue={this.props.object.queryWidth} name="queryWidth" />
            </MdlInputWrapper>
            <div className="input-group input-group--right">
              <MdlRadioInputWrapper>
                <input name="queryType" value="max" defaultChecked={this.props.object.queryType === "max"}/>
              </MdlRadioInputWrapper>
              <MdlRadioInputWrapper>
                <input name="queryType" value="min" defaultChecked={this.props.object.queryType === "min"}/>
              </MdlRadioInputWrapper>
            </div>
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
          <button type="button" className="mdl-button" onClick={this.destroy}>Delete</button>
        </ModalActions>
      </Modal>
    );
  }
});

const BreakpointItem = React.createClass({
  // destroy: function() {
  //   this.props.onUserDestroy(this.props.id);
  // },
  handleEdit: function() {
    this.props.onUserEdit(this.props.breakpoint);
  },
  render: function() {
    var self = this.props.breakpoint;
    return (
      <li className="mdl-list__item mdl-list__item--two-line">
        <span className="mdl-list__item-primary-content">
          <span>
            {self.name || <span className="mdl-color-text--red">No name</span>}
          </span>
          <span className="mdl-list__item-sub-title">
            {  
              self.queryType && self.queryWidth && self.renderWidth && self.renderUnit
                ? '(' + self.queryType + '-width: ' + self.queryWidth + 'px) ' + self.renderWidth + self.renderUnit
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

module.exports = BreakpointsPanel