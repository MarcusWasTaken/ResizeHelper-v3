import React from 'react'
import _ from 'underscore'

import { lib, MdlInputWrapper, MdlRadioInputWrapper } from 'js/lib'
import { Panel, PanelBody, PanelTitle, PanelFooter } from 'components/panel'
import { Modal, ModalTitle, ModalContent, ModalActions } from 'components/modal'
import DevicesPanel from 'components/devicespanel'
import BreakpointsPanel from 'components/breakpointspanel'
import SizesPanel from 'components/sizespanel'

const ImagePage = React.createClass({
  render: function() {
    return (
      <div className="mdl-grid mdl-grid--no-stretch">
        <div className="mdl-grid mdl-grid--no-spacing mdl-grid--no-stretch mdl-cell mdl-cell--7-col mdl-cell--4-col-tablet">
          <ImagePropertiesPanel
            image={this.props.app.activeImage}
            images={this.props.app.images}
            onUserInput={this.props.onImageChange}
          />
          <DevicesPanel
            devices={this.props.app.devices}
            chartsLoaded={this.props.app.chartsLoaded}
          />
        </div>
        <div className="mdl-grid mdl-grid--no-spacing mdl-grid--no-stretch mdl-cell mdl-cell--5-col mdl-cell--4-col-tablet">
          <BreakpointsPanel 
            breakpoints={this.props.app.activeImage.breakpoints}
            onUserInput={this.props.onImageChange}
          />
          <SizesPanel 
            sizes={this.props.app.activeImage.sizes}
            onUserInput={this.props.onImageChange}
          />
        </div>
      </div>
    );
  }
});

const ImagePropertiesPanel = React.createClass({
  mixins: [lib.mixins.ModalCRUDMixin],
  getInitialState: function() {
    return {
      modal: {}
    };
  },
  componentDidMount: function() {
    componentHandler.upgradeDom() 
  },
  openModal: function() {
    this.showModalWith(this.props.image);
  },
  handleUpdate: function(obj) {
    this.props.onUserInput({
      $set: obj
    });
  },
  handleDestroy: function(obj) {
    var index = this.props.images.findIndex(function(item) {
      return item.id == obj.id;
    });
    this.props.onUserInput({
      $set: {}
    });
  },
  render: function() {
    var modal = ! _.isEmpty(this.state.modal)
      ? (
          <ImagePropertiesModal
            object={this.state.modal}
            onUserClose={this.closeModal}
            onUserSave={this.handleUpdate}
            onUserDestroy={this.handleDestroy}
          />
        )
      : null;
    return (
      <Panel>
        <PanelTitle text={this.props.image.name}>
          <button 
            className="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab  mdl-js-ripple-effect mdl-button--primary"
            onClick={this.openModal}
          >
            <i className="material-icons">edit</i>
          </button>
        </PanelTitle>
        <PanelBody>
          <p>Size: {this.props.image.width}x{this.props.image.height}</p>
          <p>Default Render: {this.props.image.renderWidth}{this.props.image.renderUnit}</p>
          {modal}
        </PanelBody>
      </Panel>
    );
  }
});

const ImagePropertiesModal = React.createClass({
  mixins: [lib.mixins.ModalMixin],
  render: function() {
    return (
      <Modal 
        ref={(ref) => { ref != null ? this.modal = ref.refs.modal : false }}
        onUserClose={this.props.onUserClose}
      >
        <ModalTitle>Editing Image</ModalTitle>
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
          <button type="button" className="mdl-button" onClick={this.destroy}>Delete</button>
        </ModalActions>
      </Modal>
    );
  }
});

module.exports = ImagePage