import React from 'react';
import './Link.scss';

export default props => {
  const { className, children , ...rest } = props;

  return(
    <a className={ `Link ${className}`} {...rest}>
      {children}
    </a>
  )
}