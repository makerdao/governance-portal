import React, { Component } from 'react';
import PropTypes from 'prop-types';

class OutsideClickHandler extends Component {
  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  /**
   * Set the wrapper ref
   */
  setWrapperRef = node => {
    this.wrapperRef = node;
  };

  /**
   * Alert if clicked on outside of element
   */
  handleClickOutside = event => {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.props.onOutsideClick();
    }
  };
  render = () => <div ref={this.setWrapperRef}>{this.props.children}</div>;
}

OutsideClickHandler.propTypes = {
  children: PropTypes.element.isRequired,
  onOutsideClick: PropTypes.func.isRequired
};

OutsideClickHandler.defaultProps = {
  onOutsideClick: () => {}
};

export default OutsideClickHandler;
