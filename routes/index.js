
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { 
    tableObj: JSON.stringify(
      {
      "zero_dimension": {
        "title": "Distance Travelled by Light",
        "description": "Zero-dimensional data has no x or y axis. It exists. Nothing more.",
        "rows": [[
          {"name": "Distance", "value": 299792458}
          ]]
      },
      "first_dimension": {
        "title": "Distance Travelled by Light",
        "description": "One-dimensional data has an axis. It can move in a line through space, time, or different categories. Exciting!",
        "rows": [
          [{"name": "Distance", "value":0, "xLabel":"At 0 Seconds"}, {"name": "Distance", "value":299792458, "xLabel": "After 1 Second"}, {"name": "Distance", "value":599584916, "xLabel": "After 2 Seconds"}]
        ]
      },
      "second_dimension": {
        "title": "Distance Travelled by Light",
        "description": "Two-dimensional data is more dynamic. It can travel along TWO axes. View different categories over time, for instance.",
        "rows": [
          [{"name": "Distance", "value":0, "xLabel":"At 0 Seconds", "yLabel": "In a Vacuum"}, {"name": "Distance", "value":299792458, "xLabel": "After 1 Second", "yLabel": "In a Vacuum"}, {"name": "Distance", "value":599584916, "xLabel": "After 2 Seconds", "yLabel": "In a Vacuum"}],
          [{"name": "Distance", "value":0, "xLabel":"At 0 Seconds", "yLabel": "In the Atmosphere"}, {"name": "Distance", "value":299705000, "xLabel": "After 1 Second", "yLabel": "In the Atmosphere"}, {"name": "Distance", "value":599410000, "xLabel": "After 2 Seconds", "yLabel": "In the Atmosphere"}]
        ]
      },
      "third_dimension": {
        "title": "Distance Travelled by Light",
        "description": "Three dimensional data has an x, y, and z-axis. A three dimensional table can show multiple categories moving in space and time together. Representing the third dimension on a 2-dimensional computer screen can be accomplished in a few ways.",
        "rows": [
          [{"name": "Distance", "value":0, "xLabel":"At 0 Seconds", "yLabel": "In a Vacuum", "zLabel": "m/s"}, {"name": "Distance", "value":299792458, "xLabel": "After 1 Second", "yLabel": "In a Vacuum", "zLabel": "m/s"}, {"name": "Distance", "value":599584916, "xLabel": "After 2 Seconds", "yLabel": "In a Vacuum", "zLabel": "m/s"}],
          [{"name": "Distance", "value":0, "xLabel":"At 0 Seconds", "yLabel": "In the Atmosphere", "zLabel": "m/s"}, {"name": "Distance", "value":299705000, "xLabel": "After 1 Second", "yLabel": "In the Atmosphere", "zLabel": "m/s"}, {"name": "Distance", "value":599410000, "xLabel": "After 2 Seconds", "yLabel": "In the Atmosphere", "zLabel": "m/s"}],
          // z
          [{"name": "Distance", "value":0, "xLabel":"At 0 Seconds", "yLabel": "In a Vacuum", "zLabel": "k/s"}, {"name": "Distance", "value":299792, "xLabel": "After 1 Second", "yLabel": "In a Vacuum", "zLabel": "k/s"}, {"name": "Distance", "value":599584, "xLabel": "After 2 Seconds", "yLabel": "In a Vacuum", "zLabel": "k/s"}],
          [{"name": "Distance", "value":0, "xLabel":"At 0 Seconds", "yLabel": "In the Atmosphere", "zLabel": "k/s"}, {"name": "Distance", "value":299705, "xLabel": "After 1 Second", "yLabel": "In the Atmosphere", "zLabel": "k/s"}, {"name": "Distance", "value":599410, "xLabel": "After 2 Seconds", "yLabel": "In the Atmosphere", "zLabel": "k/s"}]
        ]
      }
    } 
  )});
};
