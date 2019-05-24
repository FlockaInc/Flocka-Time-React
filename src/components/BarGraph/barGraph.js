import React from 'react';
import './barGraph.css';

import CanvasJSReact from '../../assets/js/canvasjs.react';

import ns from '../../utilities/notificationService';
import ds from '../../utilities/data';

function BarGraph(props) {
  var CanvasJS = CanvasJSReact.CanvasJS;
  var CanvasJSChart = CanvasJSReact.CanvasJSChart;

  const options = {
    title: {
      text: "Programming Time (Last 7 Days)"
    },
    axisY: {
      minimum: 0
    },
    toolTip: {
      content: function (e) {
        var content;
        content = ds.convertTime(e.entries[0].dataPoint.y);
        return content;
      }
    },
    theme: 'dark1',
    animationEnabled: true,
    data: [{
      type: "column",
      dataPoints: []
    }]
  };

  for (var day of props.userDailyTime) {
    var data = {
      label: String(day.date),
      y: day.time
    }
    options.data[0].dataPoints.push(data);
  }

  console.log(options);

  return (
    <div className='userCodeTime'>
      <CanvasJSChart options={options}
      /* onRef = {ref => this.chart = ref} */
      />
    </div>
  );
}

export default BarGraph;