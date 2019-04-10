import React from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

const ExtendedLink = ({ to, children, location }) => {
  console.log('extended click');
  return (
    <Link
      to={{
        pathname: to,
        search: location.search
      }}
    >
      {children}
    </Link>
  );
};

export default withRouter(ExtendedLink);
