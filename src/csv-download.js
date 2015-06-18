/*jslint indent: 2, newcap: true */
/*global document, window, Blob, HTMLLinkElement*/
(function () {
  'use strict';
  var map, csvDownloadPrototype;

  csvDownloadPrototype = Object.create(HTMLLinkElement.prototype);
  map = Function.prototype.call.bind(Array.prototype.map);

  function setProperty(obj, name, def, fn) {
    if (obj.getAttribute(name) === null) {
      if (obj.props[name] && typeof obj.props[name] !== 'object') {
        obj.setAttribute(name, obj.props[name]);
      }
      obj.setAttribute(name, def);
    }
    Object.defineProperty(obj, name, {
      get : function () {
        return obj.props[name] || obj.getAttribute(name) || def;
      },
      set : function (val) {
        obj.props[name] = val;
        if (typeof val !== 'object') {
          obj.setAttribute(name, val);
        }
        if (typeof fn === 'function') {
          fn.call(obj);
        }
      }
    });
  }

  function arrayToCsv(array, delimiter) {
    delimiter = delimiter || ',';

    if (typeof array !== 'object' && !Array.isArray(array)) {
      return '';
    }
    return map(array, function (row) {
      return map(row, function (cell) {
        if (typeof cell !== 'string') {
          cell = JSON.stringify(cell).replace(/^"|"$/g, '');
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

  csvDownloadPrototype.createdCallback = function () {
    this.props = {};
    setProperty(this, 'data', '', this.createURI);
    setProperty(this, 'download', 'data.csv', this.createURI);
    setProperty(this, 'delimiter', ',', this.createURI);
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
