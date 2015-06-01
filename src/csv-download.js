/*jslint indent: 2, newcap: true */
/*global document, Polymer*/
(function () {
  'use strict';

  function arrayToCsv(array, delimiter) {
    var map = Function.prototype.call.bind(Array.prototype.map);
    delimiter = delimiter || ',';

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
    }).join('\n');
  }

  Polymer({
    is : 'csv-download',
    properties : {
      delimiter : {
        type : String,
        value : ','
      },
      data : {
        type : Array,
        value : function () {
          return [];
        }
      },
      filename : {
        type : String,
        value : 'data.csv'
      }
    },
    download: function () {
      var element;

      element = document.createElement('a');
      element.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(arrayToCsv(this.data, this.delimiter));
      element.download = this.filename;
      element.click();
    }
  });
}());
