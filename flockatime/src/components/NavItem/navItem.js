import React, { useState } from 'react';
import './navItem.css';

function NavItem(props) {

  if (props.attr.element === 'ul') {
    return (
      <ul className={props.attr.attr.class || ''}></ul>
    );
  } else if (props.attr.element === 'button') {
    return (
      <button 
        className={props.attr.attr.class || ''}
        type={props.attr.attr.type || ''}
        data-toggle={props.attr.attr.dataToggle || ''}
        data-target={props.attr.attr.dataTarget || ''}
        data-state={props.attr.attr.dataState || ''}
      >
        {props.attr.text}
      </button>
    );
  }
  
  return null;
}

export default NavItem;