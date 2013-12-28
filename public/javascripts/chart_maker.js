

function draw(data, chartType){

  var data = JSON.parse(JSON.stringify(data)); // break ref to parent obj
  $('#canvas').empty();

  var values = [];
  for(var i=0; i<data.length; i++){
    values[i] = [];
    for(var j=0; j<data[i].length; j++){
      values[i].push(data[i][j].value);
    };
  };

  var xLabels = [];
  for(var i=0; i<data[0].length; i++){ 
    if(typeof data[0][i] != 'undefined'){ xLabels.push(data[0][i].xLabel) };
  };

  var canvas_x = $('#canvas').width();
  var canvas_y = $(window).height() - 250;
  var margin_top = 20;
  var margin_right = 40;
  var margin_bottom = 30;
  var margin_left = 100;
  var max = d3.max(d3.max(values));
  var min = d3.min(d3.min(values));

  var scale_x = d3.scale.linear()
    .domain([0, data[0].length - 1])
    .range([margin_left, canvas_x - margin_right]);

  var scale_y = d3.scale.linear()
    .domain([max, 0])
    .range([margin_top, canvas_y - margin_bottom]);

  switch(chartType){

    case 'json':

    function syntaxHighlight(json) { // thanks to Pumbaa80: http://stackoverflow.com/questions/4810841/json-pretty-print-using-javascript
      json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
          var cls = 'number';
          if (/^"/.test(match)) {
              if (/:$/.test(match)) {
                  cls = 'key';
              } else {
                  cls = 'string';
              }
          } else if (/true|false/.test(match)) {
              cls = 'boolean';
          } else if (/null/.test(match)) {
              cls = 'null';
          }
          return '<span class="' + cls + '">' + match + '</span>';
      });
    };

    $('#canvas').append('<pre>'+syntaxHighlight('{'+JSON.stringify(data)+'}')+'</pre>');

    break; //json

      case 'table':

        // add back y & z labels as values in data obj
        if(typeof yLabels != 'undefined' && yLabels.length > 0){
          for(var i=0; i<data.length; i++){
            var d = {};
            d.name =  'yLabel';
            d.value = yLabels[i];
            d.yLabel = yLabels[i];
            d.xLabel = 'y-axis';
            data[i].unshift(d);
          };
        };
        if(typeof zLabels != 'undefined' && zLabels.length > 0){
          for(var i=0; i<data.length; i++){
            var d = {};
            d.name =  'zLabel';
            d.value = zLabels[i];
            d.yLabel = zLabels[i];
            d.xLabel = 'z-axis';
            data[i].unshift(d);
          };
        };
        if(typeof zxLabels != 'undefined' && zxLabels.length > 0){
          for(var i=0; i<data.length; i++){
            var d = {};
            d.name =  'zxLabel';
            d.value = zxLabels[i];
            d.yLabel = zxLabels[i];
            d.xLabel = 'zx-axis';
            data[i].unshift(d);
          };
        };
        if(typeof zyLabels != 'undefined' && zyLabels.length > 0){
          for(var i=0; i<data.length; i++){
            var d = {};
            d.name =  'zyLabel';
            d.value = zyLabels[i];
            d.yLabel = zyLabels[i];
            d.xLabel = 'zy-axis';
            data[i].unshift(d);
          };
        };
        if(typeof zzLabels != 'undefined' && zzLabels.length > 0){
          for(var i=0; i<data.length; i++){
            var d = {};
            d.name =  'zzLabel';
            d.value = zzLabels[i];
            d.yLabel = zzLabels[i];
            d.xLabel = 'zz-axis';
            data[i].unshift(d);
          };
        };
        if(xLabels.length > 0){
          var header = [];
          for(var i=0; i<data[0].length; i++){
            var d = {};
            d.name = data[0][i].name;
            d.value = data[0][i].xLabel
            d.yLabel = data[0][i].name;
            d.xLabel = data[0][i].xLabel;
            header.push(d);
          };
          data.unshift(header);
        };

        // draw table
        var canvas = d3.select('#canvas')
          .append('table')
          .attr('class', 'table table-hover table-condensed table-responsive');

        var thead = d3.select('table')
          .append('thead')
          .append('tr')

        var th = thead.selectAll('th')
          .data(data.shift())
          .enter()
          .append('th')
          .attr()
          .attr('data-value', function(d)    { return d.value; })
          .attr('data-name',  function(d)    { return d.name; })
          .attr('data-row',   function(d)    { return 'header'; })
          .attr('data-col',   function(d)    { return d.xLabel; })
          .attr('data-x-co',  function(d,i,j){ return j; })
          .attr('data-y-co',  function(d,i)  { return i; })
          .text(function(d){ return d.value; });

        var tbody = d3.select('table')
          .append('tbody');
        
        var tr = tbody.selectAll('tr')
          .data(data)
          .enter()
          .append('tr');

        var td = tr.selectAll('td')
          .data(function(d){ return d; })
          .enter()
          .append('td')
          .attr('data-value',function(d)    { return d.value; })
          .attr('data-name', function(d)    { return d.name; })
          .attr('data-row',  function(d)    { return d.yLabel; })
          .attr('data-col',  function(d)    { return d.xLabel; })
          .attr('data-x-co', function(d,i,j){ return j; })
          .attr('data-y-co', function(d,i)  { return i; })
          .text(function(d){ return d.value; });

      break; // table

      case 'area':
      case 'line':

      var canvas = d3.select('#canvas')
        .append('svg')
        .attr('width', canvas_x)
        .attr('height', canvas_y);

      var group = canvas.selectAll('.group')
        .data(data)
        .enter()
        .append('g')
        .attr('class', 'group');

      if(chartType == 'area'){
        var pathGen = d3.svg.area()
          .x(function(d,i){ return scale_x(i); })
          .y0(function(){ return (canvas_y - margin_bottom); })
          .y1(function(d){ return scale_y(d.value); })
          .interpolate('cardinal');

        var path = group.selectAll('.fill')
          .data(data)
          .enter()
          .append('path')
          .attr('d', pathGen)
          .attr('class', 'fill')
          .attr('fill', '#43B386')
      };

      var lineGen = d3.svg.line()
        .x(function(d,i){ return scale_x(i); })
        .y(function(d){ return scale_y(d.value); })
        .interpolate('cardinal');

      var line = group.selectAll('.lines')
        .data(data)
        .enter()
        .append('path')
        .attr('class', 'lines')
        .attr('d', lineGen)
        .attr('stroke-width', 2)
        .attr('stroke', '#276ba4');

      var circles = group.selectAll('circle')
        .data(function(d){ return d; })
        .enter()
        .append('circle')
        .attr('cx', function(d,i,j){ return scale_x(i); })
        .attr('cy', function(d){ return scale_y(d.value); })
        .attr('r', 4)
        .style('fill', '#155183');

      var ordinalScale = d3.scale.ordinal()
        .domain( function(){ 
          var domain = [];
          var n = data[0].length;
          for(var i=0; i<n; i++){
            domain.push(data[0][i].name)
          }
          return domain;
        })
        .range( );

      var domain_x = function(){ 
          var d = [];
          var n = data[0].length;
          for(var i=0; i<n; i++){ d.push(data[0][i].xLabel); };
          return d;
        };

      var range_x = function(){
          var r = [];
          var n = data[0].length;
          for(var i=0; i<data[0].length; i++){ 
            r.push(margin_left+((canvas_x-(margin_left+margin_right))/(n-1))*i); 
          };
          return r;
        };

      var xAxisGen = d3.svg.axis()
        .scale(d3.scale.ordinal().domain(domain_x()).range(range_x()))
        .orient('bottom')
        // .tickFormat(d3.format('')); // integers, or '.1%' // for %'s'

      var xAxis = canvas.append('g')
      .attr('transform', 'translate(0,' + (canvas_y - margin_bottom * .9) + ')')
        .attr('class', 'x axis')
        .call(xAxisGen);

      var yAxisGen = d3.svg.axis()
        .scale(scale_y)
        .orient('left')
        .ticks(5);

      var yAxis = canvas.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate('+ (margin_left) + ', 0)')
        .call(yAxisGen);

      break;



  }; // end switch
//       $(window).resize(function(){

//         canvas_x = $('#content').width();
//         canvas_y = $(window).height() - 100;

//         scale_x
//           .domain([0, data[0].length - 1])
//           .range([margin, canvas_x - margin]);

//         scale_y
//           .domain([0, data.length - 1])
//           .range([margin, canvas_y - margin]);

//         canvas
//           //.transition().ease('linear').duration(100)
//           .attr('width', canvas_x)
//           .attr('height', canvas_y);

//         circles
//           //.transition().ease('linear').duration(100)
//           .attr('cx', function(d, i, j){ return scale_x(j); })
//           .attr('cy', function(d, i){ return scale_y(i); });
//         text
//           .attr('x', function(d, i, j){ return scale_x(j); })
//           .attr('y', function(d, i){ return scale_y(i); });
//       });
//     break;


//     case 'boxAndWhisker':

//       var canvas = d3.select('#canvas')
//         .append('svg')
//         .attr('width', canvas_x)
//         .attr('height', canvas_y);

//       var group = canvas.selectAll('.group')
//         .data(data)
//         .enter()
//         .append('g')
//         .attr('class', 'group');

//       var min = group.selectAll('.min')
//         .data(function(d,i){ return data[i] })
//         .enter()
//         .append('circle')
//         .attr('class', 'min')
//         .attr('cx', function(d, i, j){ return scale_x(0); })
//         .attr('cy', function(d, i){ return scale_y(i); })
//         .attr('r', 2)
//         .style('fill', 'black');


//       $(window).resize(function(){

//         canvas_x = $('#content').width();
//         canvas_y = $(window).height() - 100;

//         scale_x
//           .domain([0, data[0].length - 1])
//           .range([margin, canvas_x - margin]);

//         scale_y
//           .domain([0, data.length - 1])
//           .range([margin, canvas_y - margin]);

//         canvas
//           //.transition().ease('linear').duration(100)
//           .attr('width', canvas_x)
//           .attr('height', canvas_y);

//         circles
//           //.transition().ease('linear').duration(100)
//           .attr('cx', function(d, i, j){ return scale_x(j); })
//           .attr('cy', function(d, i){ return scale_y(i); });

//       });

//     break;


};

function unique(array) {
  return $.grep(array, function(el, index) {
      return index == $.inArray(el, array);
  });
};

