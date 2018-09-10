import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import theme from '../theme';
import clock from '../imgs/clock.svg';
import smallClock from '../imgs/clock-small.svg';

const Wrapper = styled.div`
  display: flex;
  color: ${theme.text.darker_default};
  font-size: ${({ theme }) => theme.fonts.size.xlarge};
  font-weight: 300;
  margin: 37px 0px;
  align-items: center;
`;

const WrapperSmall = styled.div`
  display: flex;
  color: ${theme.text.darker_default};
  font-size: ${({ theme, fs }) => (fs ? `${fs}px` : theme.fonts.size.medium)};
  font-weight: 300;
  align-items: center;
  margin-bottom: ${({ mb }) => (mb ? `${mb}px` : '')};
  margin-top: ${({ mt }) => (mt ? `${mt}px` : '')};
`;

const Clock = styled.div`
  margin-right: 0.5em;
  width: 30px;
  height: 30px;
  background: url(${clock}) no-repeat;
`;

const SmallClock = styled.div`
  margin-right: 0.5em;
  width: 20px;
  height: 20px;
  background: url(${smallClock}) no-repeat;
`;

const Bold = styled.strong`
  font-weight: bold;
`;

class Timer extends Component {
  constructor(props) {
    super(props);
    const timeLeft =
      Math.floor(props.endTimestamp / 1000) -
      Math.floor(new Date().getTime() / 1000);
    if (timeLeft <= 0) this.state = { timeLeft: 0 };
    else this.state = { timeLeft };
  }

  interval = null;

  componentDidMount() {
    this.interval = setInterval(this.countDown, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  countDown = () => {
    if (this.state.timeLeft > 0)
      this.setState(state => ({ timeLeft: state.timeLeft - 1 }));
  };

  renderCore() {
    let { timeLeft } = this.state;
    const days = Math.floor(timeLeft / (3600 * 24));
    const Sday = days !== 1 ? 's' : '';
    timeLeft -= days * 3600 * 24;
    const hours = Math.floor(timeLeft / 3600);
    const Shour = hours !== 1 ? 's' : '';
    timeLeft -= hours * 3600;
    const minutes = Math.floor(timeLeft / 60);
    const Sminute = minutes !== 1 ? 's' : '';

    return (
      <div>
        Time left to vote{' '}
        <Bold>
          {days > 0 && (
            <Fragment>
              {days} day
              {Sday}{' '}
            </Fragment>
          )}
          {hours > 0 && (
            <Fragment>
              {hours} hour
              {Shour}{' '}
            </Fragment>
          )}
          {minutes} minute
          {Sminute}
        </Bold>
      </div>
    );
  }

  render() {
    const { small } = this.props;
    if (small) {
      return (
        <WrapperSmall fs={this.props.fs} mb={this.props.mb} mt={this.props.mt}>
          <SmallClock />
          {this.renderCore()}
        </WrapperSmall>
      );
    }
    return (
      <Wrapper mb={this.props.mb} mt={this.props.mt}>
        <Clock />
        {this.renderCore()}
      </Wrapper>
    );
  }
}

Timer.propTypes = {
  small: PropTypes.bool,
  mb: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  mt: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

Timer.defaultProps = {
  small: false
};

export default Timer;
