import React from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';

import Loader from '../components/Loader';

const Container = styled.div`
  padding: 50px;
`;

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
      <Container>
        {esmCliDocContent ? (
          <div>
            <p>
              Emergency Shutdown is currently only available through the command
              line interface as we are in the process of building a frontend UI
              for users to interact with. This guide therefore outlines the
              steps and procedures necessary to check, interact with and trigger
              the ESM.
            </p>
            <br />
            <p>
              The Emergency Shutdown Module (ESM) is responsible for a process
              that gracefully shuts down the Maker Protocol and properly
              allocates collateral to both Vault users and Dai holders. This
              acts as a last resort to protect the Maker Protocol against a
              serious threat, such as but not limited to governance attacks,
              long-term market irrationality, hacks and security breaches.
            </p>
            <br />
            <p>
              Please be aware that the triggering of the ESM is not to be taken
              lightly as this action permanently burns the users MKR tokens.
            </p>
            <br />
            <ReactMarkdown
              className="markdown"
              skipHtml={false}
              source={esmCliDocContent}
            />
          </div>
        ) : (
          <Loader mt={34} mb={34} color="header" background="background" />
        )}
      </Container>
    );
  }
}
