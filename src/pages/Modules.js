import React from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import { Flex, Grid, Text } from '@makerdao/ui-components-core';

import Loader from '../components/Loader';

export default class Dropdown extends React.Component {
  state = {
    esmCliDocContent: null
  };

  componentDidMount() {
    fetch(require('../esCliDoc.md'))
      .then(res => res.text())
      .then(esmCliDocContent => this.setState({ esmCliDocContent }));
  }

  render() {
    const { esmCliDocContent } = this.state;
    return (
      <Flex flexDirection="column" minHeight="100vh">
        <Grid gridRowGap="m" mx={'2xl'} my={'2xl'} px={'2xl'}>
          <Text.h2 textAlign="left">Emergency Shutdown Module</Text.h2>
        </Grid>
      </Flex>
    );
  }
}
