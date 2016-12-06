import React from 'react'

import { Panel, PanelBody, PanelTitle, PanelFooter } from 'components/panel'

const AboutPage = React.createClass({
  render: function() {
    return (
      <div className="about-page mdl-grid">
        <Panel>
          <PanelTitle text="Options"/>
          <PanelBody>
            Hello, I am the options page!<br/>
            I will probably be useless for a while, but my dream is to allow you to edit options!
          </PanelBody>
        </Panel>
      </div>
    );
  }
});

module.exports = AboutPage