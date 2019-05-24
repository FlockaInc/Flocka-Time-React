import React from 'react';
import './coderRow.css';

function CoderRow(props) {
  let rowClass = props.currentUser ? 'my-data' : '';


  return (
    <tr className={rowClass}>
      <td>{props.rank}</td>
      <td>{props.username}</td>
      <td>{props.total}</td>
      <td>{props.dailyAvg}</td>
    </tr>
  );
}

export default CoderRow;