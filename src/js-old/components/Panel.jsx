import React from 'react'

import 'css/modules/panel'

const Panel = React.createClass({
  render: function() {
    return (
      <div className="panel mdl-shadow--2dp mdl-cell mdl-cell--12-col">{this.props.children}</div>
    );
  }
});

const PanelTitle = React.createClass({
  render: function() {
    return (
      <div className="panel__title">
        <h2 className="panel__title-text">
          {this.props.text}
        </h2>
        {this.props.children}
      </div>
    );
  }
});

const PanelBody = React.createClass({
  render: function() {
    return (
      <div className="panel__body">
        {this.props.children}
      </div>
    );
  }
});

const PanelFooter = React.createClass({
  render: function() {
    var className = 'panel__actions' + (this.props.border ? ' panel--border' : '')
    return (
      <div className={className}>
        {this.props.children}
      </div>
    );
  }
});

module.exports = {
  Panel: Panel,
  PanelTitle: PanelTitle,
  PanelBody: PanelBody,
  PanelFooter: PanelFooter
}