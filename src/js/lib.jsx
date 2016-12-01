import React from 'react'
import update from 'immutability-helper'
import _ from 'underscore'

const lib = {
  variables: {
    queryTypes: [
      { name: 'max', value: 'max' },
      { name: 'min', value: 'min' }
    ],
    renderUnits: [
      { name: 'px', value: 'px' },
      { name: 'vw', value: 'vw' }
    ]
  },
  functions: {
    parseKB: function(value) {
      if (value === 0) {
        return value + ' KB';
      } else if (value > 0) {
        return Math.round(value * 4 / 1024 + 0.00001) + ' KB';
        // For megabyte conversion
        // return Math.round((value * 4 / 1024 + 0.00001) / 1024 * 10) / 10 + ' MB';
      } else {
        return value;
      }
    },
    uuid: function() {
      var i, random;
      var uuid = '';

      for (i = 0; i < 32; i++) {
        random = Math.random() * 16 | 0;
        if (i === 8 || i === 12 || i === 16 || i === 20) {
          uuid += '-';
        }
        uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
          .toString(16);
      }

      return uuid;
    },
    store: function (namespace, data) {
      if (data) {
        return localStorage.setItem(namespace, JSON.stringify(data));
      }
      var store = localStorage.getItem(namespace);
      return (store && JSON.parse(store)) || [];
    },
    capitalize: function(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  },
  mixins: {
    ModalCRUDMixin: {
      showModalWith: function(obj) {
        this.setState({ modal: obj });
      },
      closeModal: function() {
        this.setState({ modal: {} });
      },
      create: function(callback) {
        var obj = {
          id: lib.functions.uuid()
        };
        if (typeof callback === 'function') {
          obj = callback(obj);
        };
        this.showModalWith(obj);
      },
      destroy: function(obj) {
        var index = this.props[this.props.arrayName].findIndex((item) => item.id == obj.id );
        this.props.onUserInput({
          [this.props.arrayName]: {
            $splice: [[index, 1]]
          }
        });
      },
      update: function(obj) {
        var index = this.props[this.props.arrayName].findIndex((item) => item.id == obj.id );
        if(index != -1) {
          this.props.onUserInput({
            [this.props.arrayName]: {
              [index]: {
                $merge: obj
              }
            }
          });
        } else {
          this.props.onUserInput({
            [this.props.arrayName]: {
              $push: [obj]
            }
          });
        }
      }
    },
    ModalMixin: {
      componentDidMount: function() {
        if (! this.modal.showModal) {
          dialogPolyfill.registerDialog(this.modal);
        }
        this.modal.showModal();
        this.modal.addEventListener('close', this.close);
        // todo: add listener for enter key: save the modal (if an input is not focused.)
        // todo: add listener for shift + enter key: save modal and start another
        componentHandler.upgradeDom();
      },
      close: function() {
        this.props.onUserClose();
      },
      save: function() {
        // todo: validate fields here!

        var newData = {};
        var form = this.modal.getElementsByClassName("modal-form")[0];
        for(var input of form.getElementsByTagName("input")) {
          if (input.getAttribute('type') === 'radio' && !input.checked) {
            continue;
          }
          newData[input.getAttribute('name')] = input.value
        }
        this.props.onUserSave(_.extend(this.props.object, newData));
        this.close();
      },
      destroy: function() {
        this.props.onUserDestroy(this.props.object);
        this.close();
      }
    },
    ListCRUDMixin: {
      /**
       * ListCRUDMixin is old and should probably be swapped
       * for ModalCRUDMixin on most places to make all changes feel
       * more impactful and stateful.
       */
      create: function(callback) {
        var newData = {
          [this.props.arrayName]: { 
            $push: [_.extend({ 
              id: lib.functions.uuid(),
              sort: this.props[this.props.arrayName].length + 1,
              name: lib.functions.capitalize(this.props.arrayName.endsWith('s') ? this.props.arrayName.slice(0, -1) : this.props.arrayName) + ' ' + (this.props[this.props.arrayName].length + 1)
            }, this.props.defaultData)]
          }      
        };
        newData = typeof callback === 'function' && !_.isEmpty(callback(newData))
          ? _.extend(newData, callback(newData))
          : newData;
        this.props.onUserInput(newData);
      },
      destroy: function(id, callback) {
        if(typeof id === 'undefined') {
          console.warn('Attempted to delete an item, but it had no id.')
          return false;
        }
        var index = this.props[this.props.arrayName].findIndex(function(item) {
          return item.id == id;
        });
        var newData = {
          [this.props.arrayName]: {
            $splice: [[index, 1]],
            $apply: function(array) {
              return array.map(function(item, index) {
                return React.addons.update(item, {
                  $merge: { sort: index+1 }
                });
              });
            }
          }
        };
        newData = typeof callback === 'function' && !_.isEmpty(callback(newData))
          ? _.extend(newData, callback(newData))
          : newData;
        this.props.onUserInput(newData);
      },
      update: function(id, newData) {
        if(typeof id === 'undefined') {
          console.warn('Attempted to edit an item, but it had no id.')
          return false;
        }
        var index = this.props[this.props.arrayName].findIndex(function(item) {
          return item.id == id;
        });
        this.props.onUserInput({
          [this.props.arrayName]: {
            [index]: {
              $merge: newData
            }
          }
        });
      },
      sort: function(id, value) {
        value = value < 1 ? 1 : value > this.props[this.props.arrayName].length ? this.props[this.props.arrayName] : value;
        var item = this.props[this.props.arrayName].find(function(item) {
          return item.id == id;
        });
        this.props.onUserInput({
          [this.props.arrayName]: {
            $splice: [[item.sort-1, 1], [(value-1), 0, item]],
            $apply: function(array) {
              return array.map(function(item, index) {
                return React.addons.update(item, {
                  $merge: { sort: index+1 }
                });
              });
            }
          }
        });
      }
    }
  }
}

const MdlInputWrapper = React.createClass({
  render: function() {
    var children = React.Children.map(this.props.children, function(child) {
      var extend = this.props.number 
        ? { pattern: { $set: "-?[0-9]*(\.[0-9]+)?" } }
        : {};
      return update(child, {
        props: _.extend({
          className: { $set: 'mdl-textfield__input' },
          type: { $set: 'text' }
        }, extend)
      });

    }, this);
    var error = this.props.number
      ? <span className="mdl-textfield__error">Input is not a number!</span>
      : null;
    return (
      <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
        {children}
        <label className="mdl-textfield__label">{this.props.label}</label>
        {error}
      </div>
    );
  }
});

const MdlRadioInputWrapper = React.createClass({
  render: function() {
    var children = React.Children.map(this.props.children, function(child) {
      return update(child, {
        props: _.extend({
          type: { $set: 'radio' },
          className: { $set: 'mdl-radio__button' }
        })
      });
    }, this);
    return (
      <label className="mdl-radio mdl-js-radio mdl-js-ripple-effect">
        {children}
        <span className="mdl-radio__label">{this.props.children.props.value}</span>
      </label>
    );
  }
});

module.exports = {
  lib: lib,
  MdlInputWrapper: MdlInputWrapper,
  MdlRadioInputWrapper: MdlRadioInputWrapper
}