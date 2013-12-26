

function draw(data, chartType){

  // clear the canvas and break the reference to the parent object
  var data = JSON.parse(JSON.stringify(data));
  $('#canvas').empty();

  // declare axes + values
  var values   = [];
  var xLabels  = [];
  var yLabels  = [];
  var zLabels  = [];
  var zxLabels = [];
  var zyLabels = [];
  var zzLabels = [];

  // fill values
  for(var i=0; i<data.length; i++){
    values[i] = [];
    for(var j=0; j<data[i].length; j++){
      values[i].push(data[i][j].value);
    };
  };
  // fill xLabels
  for(var i=0; i<data[0].length; i++){ 
    if(data[0][i].xLabel){ xLabels.push(data[0][i].xLabel) };
  };
  // fill yLabels
  for(var i=0; i<data.length; i++){
    if(data[i][0].yLabel){ yLabels.push(data[i][0].yLabel) };
  };
  // fill zLabels
  for(var i=0; i<data.length; i++){
    if(data[i][0].zLabel){ zLabels.push([data[i][0].zLabel]) };
  };
  // fill zxLabels
  for(var i=0; i<data.length; i++){
    if(data[i][0].zxLabel){ zxLabels.push([data[i][0].zxLabel]) };
  };
  // fill zyLabels
  for(var i=0; i<data.length; i++){
    if(data[i][0].zyLabel){ zyLabels.push([data[i][0].zyLabel]) };
  };
  // fill zzLabels
  for(var i=0; i<data.length; i++){
    if(data[i][0].zzLabel){ zzLabels.push([data[i][0].zzLabel]) };
  };

  var canvas_x = $('#canvas').width();
  var canvas_y = $(window).height() - 140;
  var margin = 60;

  var scale_x = d3.scale.linear()
    .domain([0, data[0].length - 1])
    .range([margin, canvas_x - margin]);

  var scale_y = d3.scale.linear()
    .domain([0, data.length - 1])
    .range([margin, canvas_y - margin]);

  switch(chartType){

    case 'json':

      var canvas = d3.select('#canvas')
        .append('div')
        .text(JSON.stringify(data, null, '\t'));

    break; //json

    case 'dotMatrix':

      var canvas = d3.select('#canvas')
        .append('svg')
        .attr('width', canvas_x)
        .attr('height', canvas_y);

      var group = canvas.selectAll('.group')
        .data(data)
        .enter()
        .append('g')
        .attr('class', 'group')
        //.attr('transform', function(d,i){ return 'translate(' + scale_x(i) + ',0)'; });

      var circles = group.selectAll('.myCircle')
        .data(function(d){ return d; })
        .enter()
        .append('circle')
        .attr('class', 'myCircle')
        .attr('cx', function(d, i, j){ return scale_x(i); })
        .attr('cy', function(d, i, j){ return scale_y(j); })
        .attr('r', 2)
        .style('fill', 'black');

      var text = group.selectAll('text')
        .data(function(d){ return d; })
        .enter()
        .append("text")
        .attr('x', function(d, i, j){ return scale_x(i); })
        .attr('y', function(d, i, j){ return scale_y(j); })
        .attr("dy", -7)
        .attr("dx", 0)
        .style("text-anchor", "middle")
        .text( function(d){ return d.value; } )
        .style("font", "10px sans-serif")
        .style("fill","#333");

      break; //dotMatrix

      case 'table':

        // add back y & z labels as values in data obj
        if(yLabels.length > 0){
          for(var i=0; i<data.length; i++){
            var d = {};
            d.name =  'yLabel';
            d.value = yLabels[i];
            d.yLabel = yLabels[i];
            d.xLabel = 'y-axis';
            data[i].unshift(d);
          };
        };
        if(zLabels.length > 0){
          for(var i=0; i<data.length; i++){
            var d = {};
            d.name =  'zLabel';
            d.value = zLabels[i];
            d.yLabel = zLabels[i];
            d.xLabel = 'z-axis';
            data[i].unshift(d);
          };
        };
        if(zxLabels.length > 0){
          for(var i=0; i<data.length; i++){
            var d = {};
            d.name =  'zxLabel';
            d.value = zxLabels[i];
            d.yLabel = zxLabels[i];
            d.xLabel = 'zx-axis';
            data[i].unshift(d);
          };
        };
        if(zyLabels.length > 0){
          for(var i=0; i<data.length; i++){
            var d = {};
            d.name =  'zyLabel';
            d.value = zyLabels[i];
            d.yLabel = zyLabels[i];
            d.xLabel = 'zy-axis';
            data[i].unshift(d);
          };
        };
        if(zzLabels.length > 0){
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
          .attr('class', 'table table-striped table-bordered table-hover table-condensed table-responsive');

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

  }; // end switch


//   switch(chartType){


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


//     default: //table

        
//       var tbody = d3.select('table')
//         .append('tbody');
      
//       var tr = tbody.selectAll('tr')
//         .data(data)
//         .enter()
//         .append('tr');

//       var td = tr.selectAll('td')
//         .data(function(d){ return d; })
//         .enter()
//         .append('td')
//         .text(function(d){ return d.value; });


//     break;


//   };

};

function unique(array) {
  return $.grep(array, function(el, index) {
      return index == $.inArray(el, array);
  });
};

