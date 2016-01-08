import React, { Component, PropTypes } from 'react';
import {
  Button,
  Grid,
  Cell,
  Card,
  CardText,
  CardTitle,
  Spinner } from 'react-mdl';
import { connect } from 'react-redux';
import connectData from 'helpers/connectData';
import { isLoaded, load } from 'redux/modules/secrets';


import {
  CollapsibleSection,
  CollapsibleList } from '../../components';

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
        display = (<SecretGroup groupName={key} groupData={secret[key]} parent={parent} id={key} />);
      } else {
        console.log( 'Would be entry');
        display = (
          <SecretDisplay secretName={key} parent={parent} id={key}/>
        );
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
    return (
      <div>
        <a href={ `/api/secret?id=${this.props.parent}/${this.props.secretName}` }>{this.props.secretName}</a>
      </div>
    );
  }
}

class SecretGroup extends Component {
  static propTypes = {
    groupName: PropTypes.string.isRequired,
    groupData: PropTypes.object,
    parent: PropTypes.string.isRequired
  }

  render() {
    console.log(`Secret group: ${this.props.groupName} Data: ${Object.keys(this.props.groupData)}`);
    const group = groupOrKey(this.props.groupData, `${this.props.parent}/${this.props.groupName}`);
    return (
      <div>
        <CollapsibleList>
          <CollapsibleSection key={this.props.groupName} title={this.props.groupName}>
            {
              group
            }
          </CollapsibleSection>
        </CollapsibleList>
        </div>
    );
  }
}


@connectData(fetchData)
@connect(
  state => ({
    secrets: state.secrets.data,
    isFetching: state.secrets.isFetching
  }))
export default class Secrets extends Component {
  static propTypes = {
    secrets: React.PropTypes.object,
    isFetching: React.PropTypes.bool
  }

  refreshSecrets = () => {
    if (!this.props.isFetching) {
      console.log('Calling refresh secrets');
      load();
    } else {
      console.log('Currently refreshing');
    }
  }

  render() {
    const styles = require('../../components/styles/CardListStyles.scss');

    if (this.props.secrets !== null) {
      console.log(Object.keys(this.props.secrets).length);
    }

    return (
        <Card shadow={0} className={styles.fullWidthCard}>
          <CardTitle className={styles.cardTitle}>
            <h2 className="mdl-color-text--white">Secrets</h2>
          </CardTitle>
          <CardText className={styles.cardText}>
            { this.props.isFetching && <Spinner/>}
            { !this.props.isFetching && <SecretGroup groupName="/" groupData={this.props.secrets} parent="" id="root" /> }
          </CardText>
        </Card>
    );
  }
}
