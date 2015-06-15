/*jslint indent: 2, newcap: true */
/*global document, window, Blob, HTMLLinkElement*/
(function () {
  'use strict';
  var map, csvDownloadPrototype;

  csvDownloadPrototype = Object.create(HTMLLinkElement.prototype);
  map = Function.prototype.call.bind(Array.prototype.map);

  function setProperty(obj, name, def, fn) {
    if (obj.getAttribute(name) === null) {
      obj.setAttribute(name, obj.props[name] || def);
    }
    Object.defineProperty(obj, name, {
      get : function () {
        return obj.getAttribute(name) || obj.props[name] || def;
      },
      set : function (val) {
        obj.props[name] = val;
        obj.setAttribute(name, val);
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
    this.data = this.data || [];
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
