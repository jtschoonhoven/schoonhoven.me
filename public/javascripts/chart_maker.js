

function draw(data, chartType, pivotOn, filterOn){


  // describe data
  var data = JSON.parse(JSON.stringify(data));
  var values   = [];
  var xLabels  = [];
  var yLabels  = [];
  var zLabels  = [];
  var zxLabels = [];
  var zyLabels = [];
  var zzLabels = [];


  // describe d3 canvas
  var margin   = {};
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
    addValuesToFilterAndPivot(xLabels);
    pivot();
  };

  function pivot(){
    if(pivotOn || chartType === 'line'){

      var referenceMatrix = [];
      var tableMatrix = [];
      var toPivot = [];
      var extractedCols = [
        {key:'yLabel',  axisName:'yAxis',  values:[]}, 
        {key:'zLabel',  axisName:'zAxis',  values:[]},
        {key:'zxLabel', axisName:'zxAxis', values:[]},
        {key:'zyLabel', axisName:'zyAxis', values:[]},
        {key:'zzLabel', axisName:'zzAxis', values:[]}];

      getColumnsToPivot();

      function getColumnsToPivot(){
        for(var i=0;i<xLabels.length;i++){
          if(pivotOn != xLabels[i]){ toPivot.push(xLabels[i]); }
        }
        extractDataToPivot(toPivot);
      };

      // for each column NOT pivoted, remove from data obj and
      // assign to y-zz axis in extractedCols obj
      function extractDataToPivot(columns){
        for(var i=0;i<columns.length;i++){
          for(var j=0;j<data.length;j++){
            for(var k=0;k<data[j].length;k++){
              if(data[j][k].xLabel == columns[i]){
                // remove from data obj and assign to axis
                extractedCols[i].values.push(data[j].splice(k,1));
              }
            }
          }
          extractedCols[i].axisName = columns[i];
        }
        applyExtractedData();
      };

      // for the target data left in the data obj, apply values from
      // extractedCols as properties of the value so that original value
      // now equals target yLabel, zLabels, etc.
      function applyExtractedData(){
        for(var i=0;i<extractedCols.length;i++){
          for(var j=0;j<extractedCols[i].values.length;j++){
            for(var k=0;k<data[j].length;k++){
              data[j][k][extractedCols[i].key] = extractedCols[i].values[j][0].value;
            }
          }
        }
        makeYLabelsArray();
      };

      function makeYLabelsArray(){
        if(data[0][0].yLabel){
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
          for(var i=0;i<data.length;i++){
            for(var j=0;j<data[i].length;j++){
              zzLabels.push(data[i][j].zzLabel);
            }
          }
        }
        extractYLabels();
      };

      // some weird redundancy here between the following and the above
      function extractYLabels(){
        for(var i=0;i<data.length;i++){
          if(data[i][0].yLabel){
            yLabels.push(data[i][0].yLabel);
          }
        }
        yLabels = unique(yLabels);
        extractZLabels();
      };

      function extractZLabels(){
        for(var i=0;i<data.length;i++){
          if(data[i][0].zLabel){
            zLabels.push(data[i][0].zLabel);
          }
        }
        zLabels = unique(zLabels);
        makeReferenceMatrix();
      };

      function makeReferenceMatrix(){ 
        for(var i=0;i<yLabels.length;i++){
          referenceMatrix[i] = [];
          for(var j=0;j<zLabels.length;j++){
            referenceMatrix[i][j] = {yLabel:yLabels[i], zLabel:zLabels[j]};
          }
        }
        makeTableMatrix();
      };

      function makeTableMatrix(){
        for(var i=0;i<referenceMatrix.length;i++){
          tableMatrix[i] = [];
          for(var j=0;j<referenceMatrix[i].length;j++){
            var lookupObj = {yLabel: referenceMatrix[i][j].yLabel, zLabel: referenceMatrix[i][j].zLabel}
            lookup(lookupObj, function(result){
              tableMatrix[i][j] = result;
            });
          }
        }
        if(pivotOn){ data = tableMatrix; }
        setD3CanvasVariables();
      };

      function lookup(lookup, done){
        var found = 0;
        for(var i=0;i<data.length;i++){
          for(var j=0;j<data[i].length;j++){
            if(data[i][j].yLabel == lookup.yLabel && data[i][j].zLabel == lookup.zLabel){
              done(data[i][j]);
              found = 1;
              break;
            }
          }
        }
        if(found==0){ done(null); }
      };

    } // end if
    else{ setD3CanvasVariables(); }
  }; // end pivot



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

    addHeaders();

    function addHeaders(){
      data.unshift([]);
      for(var i=0;i<zLabels.length;i++){
        data[0][i] = {};
        data[0][i].xLabel = 'Header'
        data[0][i].value = zLabels[i];
      }
      addRowLabels();
    }

    function addRowLabels(){
      for(var i=0;i<=yLabels.length;i++){
        data[i].unshift({});
        data[i][0].xLabel = 'Column Label';
        data[i][0].value = yLabels[i-1];
      }
      makeTable();
    }

    // function extractTableHeader(){
    //   console.log(data);
    //   for(var i=0; i<data[0].length; i++){
    //     var d = {};
    //     d.value = data[0][i].xLabel
    //     d.xLabel = data[0][i].xLabel;
    //     tableHeader.push(d);
    //   }
    //   data.unshift(tableHeader);
    //   makeTable();
    // };

    function makeTable(){

      var canvas = d3.select('#canvas')
        .append('table')
        .attr('class', 'table table-hover table-condensed table-responsive');

      // var thead = d3.select('table')
      //   .append('thead')
      //   .append('tr');

      // var th = thead.selectAll('th')
      //   .data(data.shift())
      //   .enter()
      //   .append('th')
      //   .attr()
      //   .attr('data-value', function(d)    { return d.value; })
      //   .attr('data-name',  function(d)    { return d.name; })
      //   .attr('data-row',   function(d)    { return 'tableHeader'; })
      //   .attr('data-col',   function(d)    { return d.xLabel; })
      //   .attr('data-x-co',  function(d,i,j){ return j; })
      //   .attr('data-y-co',  function(d,i)  { return i; })
      //   .text(function(d){ return d.value; });

      var tbody = d3.select('table')
        .append('tbody');
      
      var tr = tbody.selectAll('tr')
        .data(data)
        .enter()
        .append('tr');

      var td = tr.selectAll('td')
        .data(function(d){ /*console.log(d);*/ return d; })
        .enter()
        .append('td')
        .attr('data-value',function(d)    { if(d && d.value)  return d.value; })
        .attr('data-name', function(d)    { if(d && d.name)   return d.name; })
        .attr('data-row',  function(d)    { if(d && d.yLabel) return d.yLabel; })
        .attr('data-col',  function(d)    { if(d && d.xLabel) return d.xLabel; })
        .attr('data-x-co', function(d,i,j){ return j; })
        .attr('data-y-co', function(d,i)  { return i; })
        .text(function(d){ if(d && d.value){return d.value} else{return ''}});
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

  function unique(array) {
     return $.grep(array, function(el, index) {
         return index == $.inArray(el, array);
     })
   };


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
