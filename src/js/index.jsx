import React from 'react'
import ReactDOM from 'react-dom'
import update from 'immutability-helper'
import _ from 'underscore'

import { lib } from 'js/lib'
import AboutPage from 'pages/aboutpage'
import ImagePage from 'pages/imagepage'
import Drawer from 'components/drawer'

import 'normalize.css'
import 'css/modules/app'

const DEVICES = [ // <- outdated, should be edit-able in the future
  { name: 'Desktop', width: 1920, density: 1 },
  { name: 'Laptop', width: 1280, density: 1 },
  { name: 'iPad - standing', width: 768, density: 2 },
  { name: 'iPad - landscape', width: 1024, density: 2 },
  { name: 'iPhone 4 - standing', width: 320, density: 2 },
  { name: 'iPhone 4 - landscape', width: 480, density: 2 }
];

const App = React.createClass({
  getInitialState: function() {
    return {
      app: {
        images: [],
        activeImage: {},
        devices: DEVICES
      }
    };
  },
  componentWillMount: function() {
    this.setState(update(this.state, {
      app: {
        devices: {
          $apply: (array) => this.initArray(array)
        },
        images: {
          $set: lib.functions.store('resizehelper2')
        }
      }
    }));
  },
  initArray: function(array, callback) {
    return array.map(function(item, index) {
      var newData = typeof callback === 'undefined' ? {} : callback(item, index);
      if (typeof item.id === 'undefined') {
        newData = _.extend(newData, { id: lib.functions.uuid() });
      }
      return update(item, {
        $merge: newData
      });
    }, this);
  },
  handleChange: function(updatePath) {
    this.setState(
      update(this.state, { app: updatePath }),
      lib.functions.store('resizehelper2', update(this.state, { app: updatePath }).app.images)
    );
  },
  handleActiveImageChange: function(updatePath) {
    var newUpdate = update(this.state.app.activeImage, updatePath);

    if (_.isEmpty(newUpdate)) {
      var index = this.state.app.images.findIndex((image) => image.id === this.state.app.activeImage.id);
      this.handleChange({
        activeImage: {
          $set: {}
        },
        images: {
          $splice: [[index, 1]]
        },
        devices: {
          $apply: (array) => array.map((item) =>
            _.extend(item, {
              excess: null
            })
          )
        }
      });
    } else {
      var index = this.state.app.images.findIndex((image) => image.id === newUpdate.id);
      this.handleChange({
        activeImage: {
          $set: _.extend(
            newUpdate, 
            {
              ratio: newUpdate.height / newUpdate.width,
              breakpoints: this.initArray(newUpdate.breakpoints, function(item, index) {
                return {
                  sort: index+1
                };
              }),
              sizes: this.initArray(newUpdate.sizes, function(item, index) {
                return {
                  sort: index+1,
                  height: Math.ceil(item.width * (newUpdate.height / newUpdate.width))
                };
              })
            }
          )
        },
        images: {
          [index]: {
            $set: _.extend(
              _.omit(newUpdate, 'ratio'),
              {
                breakpoints: newUpdate.breakpoints.map(function(item) {
                  return _.omit(item, 'sort');
                }),
                sizes: newUpdate.sizes.map(function(item) {
                  return _.omit(item, 'sort', 'height');
                })
              }
            )
          }
        },
        devices: {
          $apply: (array) => array.map((item) =>
            _.extend(item, {
              excess: (() => {
                const breakpoint = newUpdate.breakpoints.find(breakpoint =>
                  (breakpoint.queryType === 'min' && item.width >= breakpoint.queryWidth) ||
                  (breakpoint.queryType === 'max' && item.width <= breakpoint.queryWidth)
                )
                const sizes = [].concat(newUpdate.sizes.concat({
                  name: 'original',
                  width: newUpdate.width,
                  height: newUpdate.height
                }))
                // returns an array with the difference between each size's natural size, and their displayed size.
                const diff = sizes.map(size => {
                  const renderUnit = breakpoint ? breakpoint.renderUnit : newUpdate.renderUnit;
                  const renderWidth = breakpoint ? breakpoint.renderWidth : newUpdate.renderWidth;
                  const displayWidth = (() => {
                    if (renderUnit === 'px') {
                      return item.width > renderWidth ? renderWidth : item.width;
                    } else if (renderUnit === 'vw') {
                      return item.width * renderWidth / 100;
                    }
                  })()
                  const displayHeight = Math.ceil(displayWidth * newUpdate.height / newUpdate.width);
                  return size.width * size.height - (item.density * displayWidth) * (item.density * displayHeight);
                })
                // returns the smallest diff where the size is either larger or equal to what it is displayed
                return Math.min.apply(0, diff.filter(item => item >= 0));
              })()
            })
          )
        }
      });
    };
  },
  handleImageChange: function(image) {
    this.handleActiveImageChange({
      $set: image
    });
  },
  render: function() {
    var pageToRender = _.isEmpty(this.state.app.activeImage)
      ? <AboutPage />
      : <ImagePage
          app={this.state.app}
          onChange={this.handleChange}
          onImageChange={this.handleActiveImageChange}
        />;
    return (
      <div className="mdl-layout mdl-js-layout mdl-layout--fixed-drawer">
        <Drawer
          app={this.state.app}
          onUserInput={this.handleChange}
          onUserImageChange={this.handleImageChange}
        />
        <main className="mdl-layout__content mdl-color--grey-100">
          {pageToRender}
        </main>
      </div>
    );
  }
});

ReactDOM.render(
  <App />,
  document.getElementById('main')
);
