import React from 'react'

import { Panel, PanelBody, PanelTitle, PanelFooter } from 'components/panel'

const DevicesPanel = React.createClass({
  drawChart: function(element) {
    if (!(this.props.chartsLoaded && element != null)) {
      return false;
    }
    
    let data = new google.visualization.arrayToDataTable([
      ['Devices', 'Excess Pixels']
    ].concat(
      this.props.devices.map(device => [
        device.name, device.excess == 0 ? 0 : Math.round((device.excess * 4 / 1024 + .00001) / 1024 * 10) / 10
      ])
    ));

    const options = {
      colors: ['#f44336'],
      chartArea: {
        height: '100%'
      },
      height: 6*40+21,
      bars: 'horizontal',
      hAxis: {
        title: '',
        minValue: 0,
        format: '#.# MB'
      },
      vAxis: {
        title: ''
      },
      legend: {
        position: 'none'
      }
    };

    const chart = new google.charts.Bar(element);
    chart.draw(data, google.charts.Bar.convertOptions(options));
  },
  render: function() {
    return (
      <Panel>
        <PanelTitle text="Devices"/>
        <PanelBody>
          <div ref={(el) => {this.drawChart(el)}}>Loading…</div>
        </PanelBody>
      </Panel>
    );
  }
});

module.exports = DevicesPanel