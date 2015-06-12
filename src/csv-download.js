/*jslint indent: 2, newcap: true */
/*global document, window, Blob, Polymer*/
(function () {
  'use strict';
  var map = Function.prototype.call.bind(Array.prototype.map);

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

  Polymer({
    is : 'csv-download',
    extends : 'a',
    properties : {
      delimiter : {
        type : String,
        observer : 'createURI',
        value : ','
      },
      data : {
        type : Array,
        observer : 'createURI',
        value : function () {
          return [];
        }
      },
      download : {
        type : String,
        reflectToAttribute : true,
        value : 'data.csv'
      }
    },
    createURI : function () {
      this.csvString = arrayToCsv(this.data, this.delimiter);
      Polymer.dom(this).setAttribute('href',
          'data:application/octet-stream,' + encodeURIComponent(this.csvString));
    },
    ready : function () {
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        this.addEventListener('click', function (e) {
          e.preventDefault();
          var data = new Blob([ this.csvString ]);
          window.navigator.msSaveOrOpenBlob(data, this.download);
        }.bind(this));
      }
    }
  });
}());
