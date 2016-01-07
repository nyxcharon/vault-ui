import React, { Component } from 'react';
import { connect } from 'react-redux';
import connectData from 'helpers/connectData';

import { isLoaded, load } from 'redux/modules/secrets';


function fetchData(getState, dispatch) {
  console.log('fetching data');
  const promises = [];
  if (!isLoaded(getState())) {
    console.log('calling load');
    promises.push(dispatch(load()));
  }else {
    console.log('skpping load');
  }
  return Promise.all(promises);
}

@connectData(fetchData)
@connect(
  state => ({secrets: state.users.data}))
class SecretValue extends Component {
  static propTypes = {
    secrets: React.PropTypes.string,
    data: React.PropTypes.string,
    error: React.PropTypes.string
  }

  render() {

    let returnVal;

    if (this.props.error) {
      returnVal = (<p>Denied</p>);
    } else {
      returnVal = (<p>{this.props.data}</p>);
    }

    return returnVal;
  }
}


@connectData(fetchData)
@connect(
  state => ({secrets: state.users.data}))
class SecretDisplay extends Component {
  static propTypes = {
    secrets: React.PropTypes.string.isRequired,
    data: React.PropTypes.string,
    error: React.PropTypes.string
  }

  render() {
    return (<div className="SecretName">
      <h2>{this.props.secrets}</h2>
      <SecretValue data={this.props.data} error={this.props.error}/>
    </div>);
  }
}

@connectData(fetchData)
@connect(
  state => ({secrets: state.users.data}))
export default class Secrets extends Component {
  static propTypes = {
    secrets: React.PropTypes.string
  }

  render() {
    const secrets = [
      { secretName: 'Foo', data: 'Good'},
      { secretName: 'Bar', error: true}
    ].map((secret, index) => {
      return (<SecretDisplay secretName={secret.secretName}
        key={index}
        data={secret.data}
        error={secret.error}
        />);
    });

    return (
      <div>
        <h1>Secrets</h1>
        {secrets}
      </div>
    );
  }
}
