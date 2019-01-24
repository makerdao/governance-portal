import React from 'react';
import PropTypes from 'prop-types';

class WithPagination extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      error: false,
      page: 0,
      items: []
    };
  }

  componentDidMount() {
    this.fetchItems(0, this.props.numPerPage);
  }

  fetchItems = async page => {
    const { fetchItems, numPerPage } = this.props;

    this.setState({
      loading: true
    });

    try {
      const newItems = await fetchItems(page, numPerPage);

      this.setState({
        loading: false,
        items: this.state.items
          .slice(0, page * numPerPage)
          .concat(newItems)
          .concat(this.state.items.slice((page + 1) * numPerPage))
      });
    } catch (err) {
      this.setState({
        loading: false,
        error: true
      });
      throw err;
    }
  };

  onNext = async () => {
    const newPage = this.state.page + 1;

    const hasAlreadyBeenFetched =
      newPage * this.props.numPerPage < this.state.items.length;

    try {
      !hasAlreadyBeenFetched && (await this.fetchItems(newPage));

      this.setState({
        page: newPage
      });
    } catch (err) {
      // do nothing.
    }
  };

  onPrev = () => {
    const newPage = this.state.page - 1 <= 0 ? 0 : this.state.page - 1;
    this.setState({
      page: newPage
    });
  };

  retry = () => {
    this.fetchItems(this.state.page, this.props.numPerPage);
  };

  render() {
    const { page, items, error, loading } = this.state;
    const itemsToShow = items.slice(
      page * this.props.numPerPage,
      (page + 1) * this.props.numPerPage
    );

    return this.props.children({
      onNext: this.onNext,
      onPrev: this.onPrev,
      retry: this.retry,
      items: itemsToShow,
      page,
      loading,
      error
    });
  }
}

WithPagination.propTypes = {
  children: PropTypes.func.isRequired,
  // Function that fetches data given a page and number per page
  fetchItems: PropTypes.func.isRequired,
  numPerPage: PropTypes.number
};

WithPagination.defaultProps = {
  numPerPage: 5
};

export default WithPagination;
