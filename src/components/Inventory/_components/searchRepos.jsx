import React from 'react';
import ReactDOM from 'react-dom';
import { Select, Spin } from 'antd';
import _ from 'lodash';
import moment from 'moment';

class SearchRepos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      value: [],
      fetching: false,
    };
    this.lastFetchId = 0;
    this.fetchUser = _.debounce(this.fetchUser, 800);
  }
  componentDidMount() {
  }
  componentWillReceiveProps(nextProps) {
  }
  componentDidUpdate(prevProps) {
  }
  fetchUser(value) {
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({ fetching: true });
    fetch('https://randomuser.me/api/?results=5')
      .then(response => response.json())
      .then((body) => {
        if (fetchId !== this.lastFetchId) { // for fetch callback order
          return;
        }
        const data = body.results.map(user => ({
          text: `${user.name.first} ${user.name.last}`,
          value: user.login.username,
          fetching: false,
        }));
        this.setState({ data });
      });
  }
  handleChange = (value) => {
    this.setState({
      value,
      data: [],
      fetching: false,
    });
  }
  render() {
    const { fetching, data, value } = this.state;
    return (
      <Select
        mode="multiple"
        labelInValue
        value={value}
        placeholder="Select users"
        notFoundContent={fetching ? <Spin size="small" /> : null}
        filterOption={false}
        onSearch={this.fetchUser}
        onChange={this.handleChange}
        style={{ width: '100%' }}
      >
        {data.map(d => <Select.Option key={d.value}>{d.text}</Select.Option>)}
      </Select>
    );
  }
}

SearchRepos.propTypes = {
};
module.exports = SearchRepos;
