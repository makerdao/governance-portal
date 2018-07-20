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
  margin-left: 0.7em;
  position: relative;
  top: 1px;
  cursor: pointer;
  width: 14px;
  height: 14px;
  mask: url(${arrow}) center no-repeat;
  mask-size: 90%;
  background-color: #627685;
`;

const Account = styled.div`
  margin-left: 9px;
  margin: ${({ noAccounts }) => (noAccounts ? 'auto' : '')};
`;

const DropdownList = styled.div`
  min-width: 70px;
  border-radius: 4px;
  font-size: ${fonts.size.small};
  font-weight: ${fonts.weight.medium};
  text-align: center;
  outline: none;
  position: absolute;
  background: rgb(${colors.dark});
  color: rgb(${colors.dark_grey});
  border-radius: 4px;
  width: 220px;
  top: 110%;
  right: 0;
  z-index: 1;
  opacity: ${({ show }) => (show ? 1 : 0)};
  visibility: ${({ show }) => (show ? 'visible' : 'hidden')};
  pointer-events: ${({ show }) => (show ? 'auto' : 'none')};
  box-shadow: ${shadows.medium};
  overflow-x: hidden;
  overflow-y: auto;
`;

const SelectedItem = styled.div`
  color: #627685;
  cursor: pointer;
  padding: 6px 10px;
  font-size: 15px;
  display: flex;
  align-items: center;
  font-weight: ${fonts.weight.normal};
  font-family: ${fonts.family.SFProText};
`;

const Wrapper = styled.div`
  position: relative;
`;

const AccountBlurbWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const AccountBlurb = ({ type, address }) => {
  return (
    <AccountBlurbWrapper>
      <Blockies
        seed={address}
        size={5}
        spotColor="#fc5e04"
        color="#fc5e04"
        bgColor="#fff"
      />
      <Account>
        {firstLetterCapital(type)} {cutMiddle(address, 4, 3)}
      </Account>
    </AccountBlurbWrapper>
  );
};

const DropdownRow = styled.div`
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
    const { allAccounts, activeAccount, fetching } = this.props;

    if (fetching)
      return (
        <SelectedItem>
          <Loader size={20} color="background" background="header" />
        </SelectedItem>
      );

    const availableAccounts = allAccounts.filter(account => !!account.address);

    if (!activeAccount)
      return (
        <SelectedItem>
          <Account noAccounts>No Accounts</Account>
        </SelectedItem>
      );

    return (
      <ClickOutside onOutsideClick={this.clickOutside}>
        <Wrapper>
          <SelectedItem onClick={this.toggleDropdown}>
            <AccountBlurb
              type={activeAccount.type}
              address={activeAccount.address}
            />
            <StyledArrow />
          </SelectedItem>
          <DropdownList show={this.state.dropdownOpen}>
            {availableAccounts.map(({ address, type }) => (
              <DropdownRow
                key={address}
                onClick={() => this.onChange({ address, type })}
                selected={address === activeAccount.address}
                dark
              >
                <AccountBlurb type={type} address={address} />
              </DropdownRow>
            ))}
          </DropdownList>
        </Wrapper>
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

const mapStateToProps = (state, props) => ({
  allAccounts: state.accounts.allAccounts,
  activeAccount: getActiveAccount(state),
  fetching: props.fetching || state.accounts.fetching
});

export default connect(
  mapStateToProps,
  { setActiveAccount }
)(AccountBox);
