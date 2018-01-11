;(function() {
  'use strict'

  var Graph = {

    chartEl: '#js-Chart',
    introEl: '#js-Intro',
    footerEl: '#js-Footer',

    init: function() {
      this.$chartEl = $(this.chartEl);
      this.i18n = this.$chartEl.data('i18n');
      if(this.$chartEl.length > 0){
        google.charts.load('current', {
          'packages': ['corechart']
        });

        google.charts.setOnLoadCallback($.proxy(this.getChartData, this));
      }
    },

    getChartData: function() {
      var intro = new google.visualization.Query('https://docs.google.com/spreadsheets/d/1B37J7fFTokDZ3J3hX4zIm4YhGy5tR6WfKt6RRIfugcE/gviz/tq?gid=0&range=B2');
      var footer = new google.visualization.Query('https://docs.google.com/spreadsheets/d/1B37J7fFTokDZ3J3hX4zIm4YhGy5tR6WfKt6RRIfugcE/gviz/tq?gid=0&range=B6');
      var query = new google.visualization.Query('https://docs.google.com/spreadsheets/d/1B37J7fFTokDZ3J3hX4zIm4YhGy5tR6WfKt6RRIfugcE/gviz/tq?gid=0&range=B9:F14');
      var age = new google.visualization.Query('https://docs.google.com/spreadsheets/d/1B37J7fFTokDZ3J3hX4zIm4YhGy5tR6WfKt6RRIfugcE/gviz/tq?gid=0&range=B15:F25');

      intro.send($.proxy(this.handleIntroResponse, this));
      footer.send($.proxy(this.handleFooterResponse, this));
      query.send($.proxy(this.handleChartResponse, this));
      age.send($.proxy(this.handleAgeResponse, this));

    },

    getPayData: function(){
      var query = new google.visualization.Query('https://docs.google.com/spreadsheets/d/1B37J7fFTokDZ3J3hX4zIm4YhGy5tR6WfKt6RRIfugcE/gviz/tq?gid=0&range=B35:E38');
      query.send($.proxy(this.handlePayResponse, this));
    },

    handleIntroResponse: function(response){
      var resp = response.getDataTable();
      $(this.introEl).text(resp.getValue(0, 0));
    },

    handleFooterResponse: function(response){
      var resp = response.getDataTable();
      $(this.footerEl).text(resp.getValue(0, 0));
    },

    handleChartResponse: function(response){
      var resp = response.getDataTable();
      this.addRows(resp);
    },

    handleAgeResponse: function(response) {
      var resp = response.getDataTable();
      var $el = $('<div/>')
                .append('<h2 class="heading-medium">'+resp.getValue(0, 0)+'</h2>')
                .append('<p>'+resp.getValue(0, 1)+'</p>')
                .insertAfter(this.$chartEl);
      this.addAges(resp, $el);
    },

    handlePayResponse: function(response) {
      var resp = response.getDataTable();
      var $el = $('<div/>')
                .addClass('column-full')
                .append('<h2 class="heading-small">'+resp.getValue(0, 0)+'</h2>')
                .append('<p>'+resp.getValue(1, 0)+'</p>')
                .append('<p>'+resp.getValue(2, 0)+'</p>')
                .append('<p>'+resp.getValue(3, 0)+'</p>')
                .appendTo($('#women'));
      var $mean = $('<div/>').addClass('data column-one-third')
                  .append('<span class="data-item bold-xxlarge">'+resp.getValue(1, 2)+'%</span>')
                  .append('<span class="data-item bold-xsmall">Lower than men (MEAN)</span>')
                  .appendTo($('#women'));
      var $median = $('<div/>').addClass('data column-one-third')
                  .append('<span class="data-item bold-xxlarge">'+resp.getValue(1, 3)+'%</span>')
                  .append('<span class="data-item bold-xsmall">Lower than men (MEDIAN)</span>')
                  .appendTo($('#women'));
    },

    addAges: function(resp, $el) {
      for(var r=3; r<resp.getNumberOfColumns();r++){
        var $graphEl = $('<div/>').addClass('column').appendTo($el);
        var title = (r===3)? 'Justice Digital & Technology' : 'UK';
        var data = new google.visualization.DataTable(),
          options = {
            'chartArea': {
              'height': 300
            },
            'colors': ['#F47738', '#6F72AF', '#005EA5', '#FFBF47', '#B10E1E', '#85994B', '#2E358B', '#28A197', '#2B8CC4', '#B58840'],
            'enableInteractivity': true,
            'height': 350,
            'legend': 'none',
            'pieHole': 0.6,
            'pieSliceText': 'label',
            'sliceVisibilityThreshold': 0,
            'title': title
          };
        data.addColumn('string', 'Property');
        data.addColumn('number', 'Value');
        for(var j=1; j<resp.getNumberOfRows();j++){
          data.addRow(
            [resp.getValue(j,2), Math.round(resp.getValue(j,r))]
          );
        }

        var chart = new google.visualization.PieChart($graphEl[0]);
        chart.draw(data, options);
      }
    },

    addRows: function(resp) {
      for(var i=0; i<resp.getNumberOfRows();i++){
        var title = resp.getValue(i, 0),
            $el = $('<div/>')
                    .addClass('grid-row')
                    .attr('id', title.replace(/\s/g,'').toLowerCase())
                    .append('<h2 class="column-two-thirds heading-medium">'+resp.getValue(i, 0)+'</h2>')
                    .append('<p class="column-full">'+resp.getValue(i, 1)+'</p>')
                    .appendTo(this.$chartEl);
        this.addChart(resp, i, $el);
      }

      this.getPayData();

    },

    addChart: function(resp, row, $el){
      for(var i=3; i<resp.getNumberOfColumns();i++){
        var $graphEl = $('<div/>').addClass('column-one-half column').appendTo($el);

        var data = new google.visualization.DataTable(),
          options = {
            'chartArea': {
              'height': 300
            },
            'enableInteractivity': false,
            'height': 350,
            'legend': 'none',
            'pieHole': 0.6,
            'pieSliceText': 'none',
            'slices': {
              0: {
                'visibleInLegend': true,
                'color': '#005EA5'
              },
              1: {
                'visibleInLegend': false,
                'color': '#28A197',
                'textStyle': {'color': '#28A197'}
              }
            },
            'title': resp.getColumnLabel(i)
          };

        data.addColumn('string', 'Property');
        data.addColumn('number', 'Value');
        data.addRows([
          [resp.getColumnLabel(i) + ' ' + Math.round(( resp.getValue(row,i) * 100).toFixed(1)) + '%', Math.round(resp.getValue(row,i)*100)],
          ['Other', Math.round((1 - resp.getValue(row,i))*100)]
        ]);

        var chart = new google.visualization.PieChart($graphEl[0]);
        chart.draw(data, options);
        var $valueEl = $('<div/>').addClass('value').text(Math.round(( resp.getValue(row,i) * 100).toFixed(1)) + '%').appendTo($graphEl);
      }
    },

  };

  Graph.init();
})()