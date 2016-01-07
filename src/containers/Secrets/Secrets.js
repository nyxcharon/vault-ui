import React, { Component, PropTypes } from 'react';
import { Button, Grid, Cell } from 'react-mdl';
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

function groupOrKey(secret, parent) {
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
        display = (<Grid> <SecretGroup groupName={key} groupData={secret[key]} parent={parent} id={key} /></Grid>);
      } else {
        console.log( 'Would be entry');
        display = (<SecretDisplay secretName={key} parent={parent} id={key}/>);
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
    secretName: PropTypes.string.isRequired,
    parent: PropTypes.string.isRequired
  }

  render() {
    console.log(`Displaying secret: ${this.props.secretName}`);
    return (<div>
       <Grid>
         <Cell align={'middle'}>{this.props.secretName}</Cell>
         <Cell><Button>Decrypt</Button></Cell>
       </Grid>
       <Grid>
        <Cell>Result</Cell>
       </Grid>
     </div>);
  }
}

class SecretGroup extends Component {
  static propTypes = {
    groupName: PropTypes.string.isRequired,
    groupData: PropTypes.object,
    parent: PropTypes.string.isRequired
  }

  render() {
    const styles = require('./Secrets.scss');
    console.log(`Secret group: ${this.props.groupName} Data: ${Object.keys(this.props.groupData)}`);
    return (<div className={styles.secretGroup}><h1>{this.props.groupName}</h1>
      {groupOrKey(this.props.groupData, `${this.props.parent}/${this.props.groupName}`)}
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
        <SecretGroup groupName="/" groupData={this.props.secrets} parent="" id="root" />
      </div>
    );
  }
}
