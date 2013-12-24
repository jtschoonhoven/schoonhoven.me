
// expects data like so:

// [[{"name":"users","value":"295355","yLabel":"US"},{"name":"users","value":"295355","yLabel":"CA"}],
// [{"name":"users","value":"347468","yLabel":"US"},{"name":"users","value":"347468","yLabel":"CA"}]]

// {"title":"matrix", "rows": [[{"name":"n","value":1},{"name":"n","value":2},{"name":"n","value":3}],
// [{"name":"n","value":4},{"name":"n","value":5},{"name":"n","value":6}],
// [{"name":"n","value":7},{"name":"n","value":8},{"name":"n","value":9}]]}

function draw(data, chartType){

  $('#canvas').empty();

  var canvas_x = $('#canvas').width();
  var canvas_y = $(window).height() - 120;
  var margin = 50;

  // make object: all keys/values from the data object, sorted & unique
  var tableItems = {};
  tableItems.xLabel = [];
  tableItems.yLabel = [];
  tableItems.keys = Object.keys(data[0][0]);
  tableItems.keys.forEach(function(key){
    tableItems[key] = [];
    data.forEach(function(row){
      row.forEach(function(item){
        if(item[key]) { tableItems[key].push(item[key]) };
      });
    });
    tableItems[key] = unique(tableItems[key].sort());
  });

    console.log(tableItems);

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

        var canvas = d3.select('#canvas')
          .append('table')
          .attr('width', canvas_x)
          .attr('height', canvas_y)
          .attr('class', 'table table-striped table-bordered table-hover table-condensed table-responsive');

        var thead = d3.select('table')
          .append('thead')
          .append('tr')

        // if we're going to prepend an extra y-label column, shift header row right
        if(tableItems.yLabel.length > 0 && tableItems.xLabel.length > 0){ tableItems.xLabel.unshift(''); }

        var th = thead.selectAll('th')
          .data(tableItems.xLabel)
          .enter()
          .append('th')
          .text(function(d){ return d; });

        var tbody = d3.select('table')
          .append('tbody');
        
        var tr = tbody.selectAll('tr')
          .data(data)
          .enter()
          .append('tr');

        // if we do not have yLabels to prepend, give .data an empty array
        var td_yData = tableItems.yLabel.length > 0 ? [1] : [];

        // yLabel column
        var td_y = tr.selectAll('.td_y')
          .data(td_yData)
          .enter()
          .append('td')
          .attr('class', 'td_y')
          .text(function(d,i){ return tableItems.yLabel[i]; })

        var td = tr.selectAll('.td')
          .data(function(d){ return d; })
          .enter()
          .append('td')
          .attr('class', 'td')
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

  function unique(array) {
    return $.grep(array, function(el, index) {
        return index == $.inArray(el, array);
    });
  };

};
