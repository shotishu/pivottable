(function() {
  var $, makeGoogleChart;
  $ = jQuery;
  makeGoogleChart = function(chartType, extraOptions) {
    return function(pivotData) {
      var agg, colKey, colKeys, dataArray, dataTable, groupByTitle, h, hAxisTitle, headers, k, numCharsInHAxis, options, result, row, rowKey, rowKeys, title, v, vAxisTitle, wrapper, _i, _j, _len, _len2;
      rowKeys = pivotData.getRowKeys();
      if (rowKeys.length === 0) {
        rowKeys.push([]);
      }
      colKeys = pivotData.getColKeys();
      if (colKeys.length === 0) {
        colKeys.push([]);
      }
      headers = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = rowKeys.length; _i < _len; _i++) {
          h = rowKeys[_i];
          _results.push(h.join("-"));
        }
        return _results;
      })();
      headers.unshift("");
      numCharsInHAxis = 0;
      dataArray = [headers];
      for (_i = 0, _len = colKeys.length; _i < _len; _i++) {
        colKey = colKeys[_i];
        row = [colKey.join("-")];
        numCharsInHAxis += row[0].length;
        for (_j = 0, _len2 = rowKeys.length; _j < _len2; _j++) {
          rowKey = rowKeys[_j];
          agg = pivotData.getAggregator(rowKey, colKey);
          if (agg.value() != null) {
            row.push(agg.value());
          } else {
            row.push(null);
          }
        }
        dataArray.push(row);
      }
      title = vAxisTitle = pivotData.aggregator().label;
      hAxisTitle = pivotData.colAttrs.join("-");
      if (hAxisTitle !== "") {
        title += " vs " + hAxisTitle;
      }
      groupByTitle = pivotData.rowAttrs.join("-");
      if (groupByTitle !== "") {
        title += " by " + groupByTitle;
      }
      options = {
        width: $(window).width() / 1.4,
        height: $(window).height() / 1.4,
        title: title,
        hAxis: {
          title: hAxisTitle,
          slantedText: numCharsInHAxis > 50
        },
        vAxis: {
          title: vAxisTitle
        }
      };
      if (dataArray[0].length === 2 && dataArray[0][1] === "") {
        options.legend = {
          position: "none"
        };
      }
      for (k in extraOptions) {
        v = extraOptions[k];
        options[k] = v;
      }
      dataTable = google.visualization.arrayToDataTable(dataArray);
      result = $("<div style='width: 100%; height: 100%;'>");
      wrapper = new google.visualization.ChartWrapper({
        dataTable: dataTable,
        chartType: chartType,
        options: options
      });
      wrapper.draw(result[0]);
      result.bind("dblclick", function() {
        var editor;
        editor = new google.visualization.ChartEditor();
        google.visualization.events.addListener(editor, 'ok', function() {
          return editor.getChartWrapper().draw(result[0]);
        });
        return editor.openDialog(wrapper);
      });
      return result;
    };
  };
  $.pivotUtilities.gchart_renderers = {
    "Line Chart": makeGoogleChart("LineChart"),
    "Bar Chart": makeGoogleChart("ColumnChart"),
    "Area Chart": makeGoogleChart("AreaChart", {
      isStacked: true
    })
  };
}).call(this);
