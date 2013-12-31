

function draw(data, chartType, pivotOn, filterOn){


  // describe data
  var data = JSON.parse(JSON.stringify(data));
  var values   = []
  var xLabels  = [];
  var yLabels  = [];
  var zLabels  = [];
  var zxLabels = [];
  var zyLabels = [];
  var zzLabels = [];


  // describe d3 canvas
  var margin  = {};
  var canvas_x = null;
  var canvas_y = null;
  var max      = null;
  var min      = null;
  var scale_x  = null;
  var scale_y  = null;


  start(); 


  function start(data){
    $('#canvas').empty();
    makeValuesArray();
  };


  function makeValuesArray(){
    for(var i=0; i<data.length; i++){
      values[i] = [];
      for(var j=0; j<data[i].length; j++){
        values[i].push(data[i][j].value);
      }
    }
    makeXLabelsArray();
  };


  function makeXLabelsArray(){
    for(var i=0; i<data[0].length; i++){ 
      if(typeof data[0][i] != 'undefined'){ 
        xLabels.push(data[0][i].xLabel) 
      }
    }
    pivot();
  };


  function pivot(){
    if(pivotOn || chartType === 'line'){

      var toPivot = [];
      var extractedCols = [
        {key:'yLabel', values:[]}, 
        {key:'zLabel', values:[]},
        {key:'zxLabel', values:[]},
        {key:'zyLabel', values:[]},
        {key:'zzLabel', values:[]}];
      var extractedAxisNames = [
        {key:'yAxis', value:null}, 
        {key:'zAxis', value:null},
        {key:'zxAxis', value:null},
        {key:'zyAxis', value:null},
        {key:'zzAxis', value:null}];


      getColumnsToPivot();


      function getColumnsToPivot(){
        for(var i=0;i<xLabels.length;i++){
          if(pivotOn != xLabels[i]){ toPivot.push(xLabels[i]); }
        }
        extractDataToPivot(toPivot);
      };


      function extractDataToPivot(columns){
        for(var i=0;i<columns.length;i++){
          console.log('pivoting '+columns[i]);
          for(var j=0;j<data.length;j++){
            for(var k=0;k<data[j].length;k++){
              if(data[j][k].xLabel == columns[i]){
                extractedCols[i].values.push(data[j].splice(k,1));
              }
            }
          }
          extractedAxisNames[i].value = columns[i];
          console.log('done pivoting ' + columns[i]);
        }
        applyExtractedData();
      };


      function applyExtractedData(){
        console.log('Applying extracted rows');
        for(var i=0;i<extractedCols.length;i++){
          for(var j=0;j<extractedCols[i].values.length;j++){
            for(var k=0;k<data[j].length;k++){
              data[j][k][extractedCols[i].key] = extractedCols[i].values[j][0].value;
            }
          }
        }
      }
    } // end if
    makeYLabelsArray();
  }; // end pivot


  function makeYLabelsArray(){
    if(data[0][0].yLabel){
      console.log('Filling yLabels array');
      for(var i=0;i<data.length;i++){
        for(var j=0;j<data[i].length;j++){
          yLabels.push(data[i][j].yLabel);
        }
      }
    }
    makeZLabelsArray();
  };


  function makeZLabelsArray(){
    if(data[0][0].zLabel){
      console.log('Filling zLabels array');
      for(var i=0;i<data.length;i++){
        for(var j=0;j<data[i].length;j++){
          zLabels.push(data[i][j].zLabel);
        }
      }
    }
    makeZXLabelsArray();
  };


  function makeZXLabelsArray(){
    if(data[0][0].zxLabel){
      console.log('Filling zxLabels array');
      for(var i=0;i<data.length;i++){
        for(var j=0;j<data[i].length;j++){
          zxLabels.push(data[i][j].zxLabel);
        }
      }
    }
    makeZYLabelsArray();
  };


  function makeZYLabelsArray(){
    if(data[0][0].zyLabel){
      console.log('Filling zyLabels array');
      for(var i=0;i<data.length;i++){
        for(var j=0;j<data[i].length;j++){
          zyLabels.push(data[i][j].zyLabel);
        }
      }
    }
    makeZZLabelsArray();
  };


  function makeZZLabelsArray(){
    if(data[0][0].zzLabel){
      console.log('Filling zzLabels array');
      for(var i=0;i<data.length;i++){
        for(var j=0;j<data[i].length;j++){
          zzLabels.push(data[i][j].zzLabel);
        }
      }
    }
    setD3CanvasVariables();
  };


  function setD3CanvasVariables(){
    canvas_x      = $('#canvas').width();
    canvas_y      = $(window).height() - 250;
    margin.top    = 20;
    margin.right  = 40;
    margin.bottom = 30;
    margin.left   = 100;
    max = d3.max(d3.max(values));
    min = d3.min(d3.min(values));

    scale_x = d3.scale.linear()
      .domain([0, data[0].length - 1])
      .range([margin.left, canvas_x - margin.right]);

    scale_x = d3.scale.linear()
      .domain([0, data[0].length - 1])
      .range([margin.left, canvas_x - margin.right]);

    renderChartType();
  };


  function renderChartType(){
    console.log('called ' + chartType);
    switch(chartType){

      case 'json':  
        renderJSON();   
        break;

      case 'table': 
        renderTable();  
        break;

      case 'area':                  
      case 'line':  
        renderLine();   
        break;
    }
  };


  function renderJSON(){
    function syntaxHighlight(json) { // thanks to Pumbaa80: http://stackoverflow.com/questions/4810841/json-pretty-print-using-javascript
      json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
          var cls = 'number';
          if (/^"/.test(match)) {
              if (/:$/.test(match)) { cls = 'key'; } 
              else { cls = 'string'; }
          } 
          else if (/true|false/.test(match)) { cls = 'boolean'; } 
          else if (/null/.test(match)) { cls = 'null'; }
          return '<span class="' + cls + '">' + match + '</span>';
      })
    }
    $('#canvas').append('<pre>'+syntaxHighlight('{'+JSON.stringify(data)+'}')+'</pre>');
  };


  function renderTable(){
    // yLabels remain vertical
    // zLabels are pivoted horizontally
    // zx,zy,zzLabels not yet supported

    var tableHeader = [];

    extractYLabels();

    function extractYLabels(){
      extractZLabels();
    };

    function extractZLabels(){
      getTableHeader();
    };

    function getTableHeader(){
      for(var i=0; i<data[0].length; i++){
        var d = {};
        d.name = data[0][i].name;
        d.value = data[0][i].xLabel
        d.yLabel = data[0][i].name;
        d.xLabel = data[0][i].xLabel;
        tableHeader.push(d);
      }
      data.unshift(tableHeader);
      makeTable();
    };

    function makeTable(){

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
        .attr('data-row',   function(d)    { return 'tableHeader'; })
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
    };

  }; // end table


  function renderLine(){

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
        .y0(function(){ return (canvas_y - margin.bottom); })
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
          r.push(margin.left + ((canvas_x-(margin.left + margin.right))/(n-1))*i); 
        };
        return r;
      };

    var xAxisGen = d3.svg.axis()
      .scale(d3.scale.ordinal().domain(domain_x()).range(range_x()))
      .orient('bottom')
      // .tickFormat(d3.format('')); // integers, or '.1%' // for %'s'

    var xAxis = canvas.append('g')
    .attr('transform', 'translate(0,' + (canvas_y - margin.bottom * .9) + ')')
      .attr('class', 'x axis')
      .call(xAxisGen);

    var yAxisGen = d3.svg.axis()
      .scale(scale_y)
      .orient('left')
      .ticks(5);

    var yAxis = canvas.append('g')
      .attr('class', 'y axis')
      .attr('transform', 'translate('+ (margin.left) + ', 0)')
      .call(yAxisGen);
  }; // end renderLine()

}; // end draw()





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
