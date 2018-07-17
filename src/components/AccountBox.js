import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Blockies from 'react-blockies';
import { connect } from 'react-redux';
import ClickOutside from './ClickOutside';
import Loader from './Loader';
import { cutMiddle } from '../utils/misc';
import arrow from '../imgs/arrow.svg';
import { firstLetterCapital } from '../utils/misc';
import { fonts, colors, shadows } from '../theme';
import { getActiveAccount, setActiveAccount } from '../reducers/accounts';

const StyledArrow = styled.img`
  position: absolute;
  right: 10px;
  cursor: pointer;
  width: 14px;
  height: 14px;
  mask: url(${arrow}) center no-repeat;
  mask-size: 90%;
  background-color: rgba(${colors.white}, 0.8);
`;

const Account = styled.div`
  margin-left: 9px;
  margin: ${({ noAccounts }) => (noAccounts ? 'auto' : '')};
`;

const StyledDropdownWrapper = styled.div`
  min-width: 70px;
  border-radius: 4px;
  position: relative;
  font-size: ${fonts.size.small};
  font-weight: ${fonts.weight.medium};
  text-align: center;
  outline: none;
  position: absolute;
  background: rgb(${colors.dark});
  color: rgb(${colors.dark_grey});
  border-radius: 4px;
  width: 100%;
  top: 110%;
  z-index: 1;
  opacity: ${({ show }) => (show ? 1 : 0)};
  visibility: ${({ show }) => (show ? 'visible' : 'hidden')};
  pointer-events: ${({ show }) => (show ? 'auto' : 'none')};
  box-shadow: ${shadows.medium};
  overflow-x: hidden;
  overflow-y: auto;
`;

const StyledAccount = styled.div`
  color: white;
  cursor: pointer;
  background: ${({ dark }) => (dark ? '#053C4B' : '#435367')};
  border-radius: 4px;
  padding: 6px 10px;
  font-size: 15px;
  display: flex;
  width: 220px;
  align-items: center;
  font-weight: ${fonts.weight.normal};
  font-family: ${fonts.family.SFProText};
`;

const StyledRow = styled.div`
  display: flex;
  cursor: pointer;
  justify-content: flex-start;
  border-top: ${({ selected }) =>
    selected ? '' : `1px solid rgba(${colors.light_grey}, 0.15)`};
  font-weight: ${({ selected }) =>
    selected ? fonts.weight.bold : fonts.weight.normal};
  padding: 6px;
  width: auto;
  font-size: 15px;
  padding-left: 11px;
  color: white;
  background: ${({ dark }) => (dark ? '#053C4B' : '#435367')};
  &:hover {
    opacity: 0.9;
  }
`;

const AccountWrapper = styled.div`
  position: relative;
`;

class AccountBox extends Component {
  state = {
    dropdownOpen: false
  };
  clickOutside = () => {
    if (this.state.dropdownOpen) this.setState({ dropdownOpen: false });
  };
  onChange = ({ address }) => {
    this.setState({ dropdownOpen: false });
    this.props.setActiveAccount(address);
  };
  toggleDropdown = () => {
    this.setState(state => ({ dropdownOpen: !state.dropdownOpen }));
  };
  render() {
    if (this.props.fetching)
      return (
        <StyledAccount dark={dark} {...this.props}>
          <Loader
            size={20}
            color="background"
            background={dark ? 'box_dark' : 'box_light'}
          />
        </StyledAccount>
      );

    const { dark, allAccounts, activeAccount, ...props } = this.props;
    const availableAccounts = allAccounts.filter(account => !!account.address);

    if (!activeAccount)
      return (
        <StyledAccount dark={dark} {...this.props}>
          <Account noAccounts>No Accounts</Account>
        </StyledAccount>
      );

    return (
      <ClickOutside onOutsideClick={this.clickOutside}>
        <AccountWrapper {...props}>
          <StyledAccount dark={dark} onClick={this.toggleDropdown}>
            <Blockies
              seed={activeAccount.address}
              size={5}
              spotColor="#fc5e04"
              color="#fc5e04"
              bgColor="#fff"
            />
            <Account>
              {firstLetterCapital(activeAccount.type)}{' '}
              {cutMiddle(activeAccount.address)}
            </Account>
            <StyledArrow />
          </StyledAccount>
          <StyledDropdownWrapper show={this.state.dropdownOpen}>
            {availableAccounts.map(({ address, type }) => (
              <StyledRow
                key={address}
                onClick={() => this.onChange({ address, type })}
                selected={address === activeAccount.address}
                dark={dark}
              >
                <Blockies
                  seed={address}
                  size={5}
                  spotColor="#fc5e04"
                  color="#fc5e04"
                  bgColor="#fff"
                />
                <Account>{`${firstLetterCapital(type)} ${cutMiddle(
                  address
                )}`}</Account>
              </StyledRow>
            ))}
          </StyledDropdownWrapper>
        </AccountWrapper>
      </ClickOutside>
    );
  }
}

AccountBox.propTypes = {
  allAccounts: PropTypes.array,
  dark: PropTypes.bool,
  fetching: PropTypes.bool,
  setActiveAccount: PropTypes.func
};

AccountBox.defaultProps = {
  allAccounts: [],
  dark: false,
  onChange: () => {},
  fetching: false
};

const mapStateToProps = state => ({
  allAccounts: state.accounts.allAccounts,
  activeAccount: getActiveAccount(state)
});

export default connect(
  mapStateToProps,
  { setActiveAccount }
)(AccountBox);
