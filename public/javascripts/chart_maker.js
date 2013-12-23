
function draw(data, chartType){


  var canvas_x = $('#content').width();
  var canvas_y = $(window).height() - 100;
  var margin = 50;

  var allTheValues = [];
  var allTheNames = [];

  for(var i=0;i<data.length;i++){
    for(var j=0;j<data[i].length;j++){
      allTheValues.push(data[i][j].value);
    };
  };

  for(var i=0;i<data[0].length; i++){
    allTheNames.push(data[0][i].name);
  }

  var scale_x = d3.scale.linear()
    .domain([0, data[0].length - 1])
    .range([margin, canvas_x - margin]);

  var scale_y = d3.scale.linear()
    .domain([0, data.length - 1])
    .range([margin, canvas_y - margin]);


  switch(chartType){


    case 'dotMatrix':

      var canvas = d3.select('#canvas')
        .append('svg')
        .attr('width', canvas_x)
        .attr('height', canvas_y);

      var group = canvas.selectAll('.group')
        .data(data)
        .enter()
        .append('g')
        .attr('class', 'group');

      var circles = group.selectAll('.myCircle')
        .data(function(d){ return d; })
        .enter()
        .append('circle')
        .attr('class', 'myCircle')
        .attr('cx', function(d, i, j){ return scale_x(j); })
        .attr('cy', function(d, i){ return scale_y(i); })
        .attr('r', 2)
        .style('fill', 'black');


      $(window).resize(function(){

        canvas_x = $('#content').width();
        canvas_y = $(window).height() - 100;

        scale_x
          .domain([0, data[0].length - 1])
          .range([margin, canvas_x - margin]);

        scale_y
          .domain([0, data.length - 1])
          .range([margin, canvas_y - margin]);

        canvas
          //.transition().ease('linear').duration(100)
          .attr('width', canvas_x)
          .attr('height', canvas_y);

        circles
          //.transition().ease('linear').duration(100)
          .attr('cx', function(d, i, j){ return scale_x(j); })
          .attr('cy', function(d, i){ return scale_y(i); });
      });
    break;


    default: //table

      var canvas = d3.select('#canvas')
        .append('table')
        .attr('width', canvas_x)
        .attr('height', canvas_y)
        .attr('class', 'table table-striped table-bordered table-hover table-condensed table-responsive');

      var thead = d3.select('table')
        .append('thead')
        .append('tr')

      var th = thead.selectAll('th')
        .data(allTheNames)
        .enter()
        .append('th')
        .text(function(d){ return d });
        
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
        .text(function(d){ return d.value; });


    break;


  };
};
