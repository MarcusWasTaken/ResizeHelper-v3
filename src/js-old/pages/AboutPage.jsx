import React from 'react'

import { Panel, PanelBody, PanelTitle, PanelFooter } from 'components/panel'

const AboutPage = React.createClass({
  render: function() {
    return (
      <div className="about-page mdl-grid">
        <Panel>
          <PanelTitle text="About"/>
          <PanelBody>
            Hello, I am the about page!<br/>
            I will probably be useless for a while, but my dream is to provide information for all visitors!
            <br/><br/>
            To start using the resize helper, create a new image definition in the menu to the left!
          </PanelBody>
        </Panel>
      </div>
    );
  }
});

module.exports = AboutPage