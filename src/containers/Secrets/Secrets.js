import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import connectData from 'helpers/connectData';
import { isLoaded, load } from 'redux/modules/secrets';


function fetchData(getState, dispatch) {
  console.log('fetching secret data');
  const promises = [];
  if (!isLoaded(getState())) {
    console.log('calling load secret');
    promises.push(dispatch(load()));
  }else {
    console.log('skpping load secret');
  }
  return Promise.all(promises);
}

function groupOrKey(secret) {
  // console.log(`Analyzing secret: ${secret}`);
  const keys = Object.keys(secret);
  let result = null;

  if (keys.length > 0) {
    console.log(`Key Length of Secret: ${keys.length}`);
    const moreKeys = keys.map((key) => {
      let display = null;
      console.log(`Working key ${key}`);
      if (Object.keys(secret[key]).length > 0 ) {
        console.log( 'Would be group');
        display = (<SecretGroup groupName={key} groupData={secret[key]} id={key} />);
      } else {
        console.log( 'Would be entry');
        display = (<SecretDisplay secretName={key} id={key}/>);
      }

      return display;
    });

    result = moreKeys;
  } else {
    console.log(`No length for ${Object.keys(secret)}`);
  }

  return result;
}

class SecretDisplay extends Component {
  static propTypes = {
    secretName: PropTypes.string.isRequired
  }

  render() {
    console.log(`Displaying secret: ${this.props.secretName}`);
    return (<div>Secret Name: {this.props.secretName}</div>);
  }
}

class SecretGroup extends Component {
  static propTypes = {
    groupName: PropTypes.string.isRequired,
    groupData: PropTypes.object
  }

  render() {
    console.log(`Secret group: ${this.props.groupName} Data: ${Object.keys(this.props.groupData)}`);
    return (<div><h1>{this.props.groupName}</h1>
      {groupOrKey(this.props.groupData)}
    </div>);
  }
}


@connectData(fetchData)
@connect(
  state => ({secrets: state.secrets.data}))
export default class Secrets extends Component {
  static propTypes = {
    secrets: React.PropTypes.object
  }

  render() {
    if (this.props.secrets !== null) {
      console.log(Object.keys(this.props.secrets).length);
    }
    return (
      <div>
        <h1>Secrets</h1>
        {groupOrKey(this.props.secrets)}
      </div>
    );
  }
}
