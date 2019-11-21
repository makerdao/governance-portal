import React from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';

import Loader from '../components/Loader';

const ESM_CLI_DOC_SRC =
  'https://raw.githubusercontent.com/makerdao/developerguides/master/governance/Emergency-Shutdown-CLI-Documentation.md';
const Container = styled.div`
  padding: 50px;
`;

export default class Dropdown extends React.Component {
  state = {
    esmCliDocContent: null
  };

  componentDidMount() {
    fetch(ESM_CLI_DOC_SRC)
      .then(res => res.text())
      .then(esmCliDocContent => this.setState({ esmCliDocContent }));
  }

  render() {
    const { esmCliDocContent } = this.state;
    return (
      <Container>
        {esmCliDocContent ? (
          <ReactMarkdown
            className="markdown"
            skipHtml={false}
            source={esmCliDocContent}
          />
        ) : (
          <Loader mt={34} mb={34} color="header" background="background" />
        )}
      </Container>
    );
  }
}
