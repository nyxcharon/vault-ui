import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import connectData from 'helpers/connectData';
import { CollapsibleSection, CollapsibleList } from '../../components';

import {mounts} from 'redux/modules/vault';

import {
  Card,
  CardTitle,
  CardText,
} from 'react-mdl';


function fetchData(getState, dispatch) {
  const promises = [];
  promises.push(dispatch(mounts()));
  return Promise.all(promises);
}

@connectData(fetchData)
@connect(
  state => ({mounts: state.vault.mounts}))
export default class Mounts extends Component {
  static propTypes = {
    mounts: PropTypes.object
  };

  onClick() {
    console.log('I clicked');
  }

  render() {
    const {mounts} = this.props; // eslint-disable-line no-shadow
    const styles = require('../../components/styles/CardListStyles.scss');
    return (
      <div>
        <Card shadow={0} className={styles.fullWidthCard}>
          <CardTitle className={styles.cardTitle}>
            <h2 className="mdl-color-text--white">Mounts</h2>
          </CardTitle>
          <CardText className={styles.cardText}>
            <CollapsibleList>
              {Object.keys(mounts).map((key, index) => {
                return (
                  <CollapsibleSection key={index} title={key}>
                    <pre>{JSON.stringify(mounts[key], null, '  ')}</pre>
                  </CollapsibleSection>
                  );
              })}
            </CollapsibleList>
          </CardText>
        </Card>
      </div>
    );
  }
}
