/*jslint indent: 2, newcap: true */
/*global document, window, Blob, HTMLLinkElement*/
(function () {
  'use strict';
  var map, properties, csvDownloadPrototype, declaredProps;

  csvDownloadPrototype = Object.create(HTMLLinkElement.prototype);
  map = Function.prototype.call.bind(Array.prototype.map);


  /**
   * Uses Object.defineProperty to add setters and getters
   * to each property of the element.
   *
   * Each property is reflected to the equivalent DOM attribute
   * @param {object} obj The element to add the shadow root.
   * @param {object} props Object with the properties.
   */
  declaredProps = (function () {
    var exports = {};

    function parse(val, type) {
      switch (type) {
      case Object:
      case Array:
        return JSON.parse(val);
      default:
        return val || '';
      }
    }
    function toHyphens(str) {
      return str.replace(/([A-Z])/g, '-$1').toLowerCase();
    }
    exports.serialize = function (val) {
      if (typeof val === 'string') {
        return String(val);
      }
      return JSON.stringify(val);
    };

    exports.syncProperty = function (obj, props, attr, val) {
      if (props[attr]) {
        var type = props[attr].type || props[attr];
        obj[attr] = parse(val, type);
      }
    };

    exports.init = function (obj, props) {
      Object.defineProperty(obj, 'props', {
        enumerable : false,
        configurable : true,
        value : {}
      });

      Object.keys(props).forEach(function (name) {
        var attrName = toHyphens(name), desc;

        desc = props[name].type ? props[name] : { type : props[name] };
        obj.props[name] = obj[name] || desc.value;

        if (obj.getAttribute(attrName) === null) {
          if (desc.reflectToAttribute) {
            obj.setAttribute(attrName, exports.serialize(obj.props[name]));
          }
        } else {
          obj.props[name] = parse(obj.getAttribute(attrName), desc.type);
        }
        Object.defineProperty(obj, name, {
          get : function () {
            return obj.props[name] || parse(obj.getAttribute(attrName), desc.type);
          },
          set : function (val) {
            obj.props[name] = val;
            if (desc.reflectToAttribute) {
              obj.setAttribute(attrName, exports.serialize(val));
            }
            if (typeof obj[desc.observer] === 'function') {
              obj[desc.observer](val);
            }
          }
        });
      });
    };

    return exports;
  }());

  /**
   * Actually convert the array to a CSV string
   * @param {object} array 2D Array or array-like object to convert to CSV.
   * @param {string} delimiter String used to concatenate the columns. The default is ","
   */
  function arrayToCsv(array, delimiter) {
    delimiter = delimiter || ',';

    if (typeof array !== 'object' || array === null) {
      return '';
    }
    return map(array, function (row) {
      return map(row, function (cell) {
        var cache = [];

        // From : http://stackoverflow.com/a/11616993/2507726
        /*jslint unparam: true*/
        function circularReplacer(key, value) {
          if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
              return;
            }
            cache.push(value);
          }
          return value;
        }
        /*jslint unparam: false*/

        if (typeof cell !== 'string') {
          cell = JSON.stringify(cell, circularReplacer).replace(/^"|"$/g, '');
          cache = null;
        }
        if (RegExp(delimiter + '|"').test(cell)) {
          cell = '"' + cell.replace(/"/g, '""') + '"';
        }
        return cell;
      }).join(delimiter);
    }).join('\r\n');
  }

  csvDownloadPrototype.createURI = function () {
    this.csvString = arrayToCsv(this.data, this.delimiter);
    this.setAttribute('href',
        'data:text/csv,' + encodeURIComponent(this.csvString));
  };

  properties = {
    data : {
      type : Object,
      value : '',
      observer : 'createURI'
    },
    download : {
      type : String,
      value : 'data.csv',
      reflectToAttribute : true
    },
    delimiter : {
      type : String,
      value : ',',
      observer : 'createURI'
    }
  };

  /*jslint unparam:true*/
  csvDownloadPrototype.attributeChangedCallback = function (attr, oldVal, newVal) {
    declaredProps.syncProperty(this, properties, attr, newVal);
  };
  /*jslint unparam:false*/

  csvDownloadPrototype.createdCallback = function () {
    declaredProps.init(this, properties);
    this.createURI();

    this.addEventListener('click', function (e) {
      var data;

      this.createURI();
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        e.preventDefault();
        data = new Blob([ this.csvString ]);
        window.navigator.msSaveOrOpenBlob(data, this.download);
      }
    }, true);
  };

  document.registerElement('csv-download', {
    prototype : csvDownloadPrototype,
    extends : 'a'
  });
}());
