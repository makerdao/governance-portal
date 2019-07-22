import React, { Component } from 'react';
import styled from 'styled-components';

import ClickOutside from './ClickOutside';
import theme, { shadows, colors } from '../theme';
import arrow from '../imgs/arrow.svg';

export default class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  toggle = () => {
    this.setState({ shown: !this.state.shown });
  };

  clickOutside = () => {
    if (this.state.shown) this.setState({ shown: false });
  };

  select(item, index) {
    this.setState({ shown: false });
    this.props.onSelect(item, index);
  }

  render() {
    const {
      items,
      itemKey,
      renderItem,
      renderRowItem,
      value,
      emptyMsg,
      color
    } = this.props;
    const hasItems = items.length > 0;
    const noItemMsg = emptyMsg || 'nothing to show';
    const selected = value ? renderItem(value) : <div />;
    return (
      <ClickOutside onOutsideClick={this.clickOutside}>
        <Wrapper>
          <Selection
            onClick={this.toggle}
            clickable={hasItems}
            dim={!hasItems}
            color={color}
          >
            {hasItems ? selected : noItemMsg}
            <Arrow hide={!hasItems} color={color} />
          </Selection>
          {this.state.shown && (
            <List>
              {items.map((item, index) => (
                <Row
                  key={item[itemKey] || index}
                  onClick={() => this.select(item, index)}
                >
                  {renderRowItem ? renderRowItem(item) : renderItem(item)}
                </Row>
              ))}
            </List>
          )}
        </Wrapper>
      </ClickOutside>
    );
  }
}

const Wrapper = styled.div`
  position: relative;
`;

const Selection = styled.div`
  border: 1px solid
    ${({ color }) => (color ? `rgb(${colors[color]})` : '#d1d8da')};
  border-radius: 4px;
  position: relative;
  height: 40px;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  opacity: ${({ dim }) => (dim ? '0.75' : '1')};
  cursor: ${({ clickable }) => (clickable ? 'pointer' : 'auto')};
  pointer-events: ${({ clickable }) => (clickable ? 'auto' : 'none')};
  align-items: center;
`;

export const Input = styled.input`
  border: none;
  color: ${theme.text.dim_grey_alt};
  font-size: 16px;
  display: block;
  flex-grow: 1;
`;

const Arrow = styled.img`
  visibility: ${({ hide }) => (hide ? 'hidden' : 'visible')};
  mask: url(${arrow}) center no-repeat;
  mask-size: 90%;
  background-color: ${({ color }) =>
    color ? `rgb(${colors[color]})` : 'black'};
  height: 9px;
  width: 16px;
  margin-left: 5px;
`;

const List = styled.div`
  width: 100%;
  position: absolute;
  top: 100%;
  margin-top: -2px;
  left: 0;
  background-color: white;
  z-index: 1;
  border: 1px solid #d1d8da;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  box-shadow: ${shadows.medium};
`;

const Row = styled.div`
  cursor: pointer;
  padding: 6px 8px;
  &:hover {
    background-color: rgb(${colors.light_grey});
  }
`;
