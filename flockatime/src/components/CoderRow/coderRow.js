import React from 'react';
import './coderRow.css';

function CoderRow(props) {
  return (
    <tr>
      <td>{props.rank}</td>
      <td>{props.username}</td>
      <td>{props.total}</td>
      <td>{props.dailyAvg}</td>
    </tr>
  );
}

export default CoderRow;