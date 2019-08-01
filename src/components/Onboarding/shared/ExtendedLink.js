import React from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

const ExtendedLink = ({ to, onClick, children, location }) => {
  return (
    <Link
      to={{
        pathname: to,
        search: location.search
      }}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default withRouter(ExtendedLink);
