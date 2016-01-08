import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
  Card,
  CardTitle,
  CardText,
  Button
} from 'react-mdl';

import {health} from 'redux/modules/vault';


class HealthObject extends Component {
  static propTypes = {
    data: PropTypes.object,
    id: PropTypes.string
  }

  render() {
    const {data} = this.props; // eslint-disable-line no-shadow
    const styles = require('./Health.scss');
    const ip = Object.keys(data);
    const { initialized, sealed, standby} = data[ip];
    return (
      <div className={`mdl-cell mdl-cell--4-col, ${styles.healthListItem}`}>
          <div>ip: { ip }</div>
          <div>standby: { standby.toString() }</div>
          <div>sealed: { sealed.toString() }</div>
          <div>initialized: { initialized.toString() }</div>
      </div>
    );
  }
}

@connect(
  state => ({data: state.vault.health}),
  dispatch => bindActionCreators({health}, dispatch))
export default class AppTest extends Component {
  static propTypes = {
    health: PropTypes.func.isRequired,
    data: PropTypes.object
  };

  componentDidMount() {
    this.props.health();
  }

  handleHealthClick = (event) => {
    event.preventDefault();
    this.props.health();
    return;
  }

  render() {
    const {data} = this.props; // eslint-disable-line no-shadow
    const styles = require('./Health.scss');

    let display;
    if (health !== undefined) {
      display = Object.keys(data).map((key) => {
        return (<HealthObject id={key} data={data[key]} />);
      });
    } else {
      display = null;
    }


    /* const styles = require('./AppTest.scss'); */
    return (
       <div>
        <Card shadow={0} className={styles.card}>
          <CardTitle className={styles.cardTitle}>
            <div style={{float: 'right'}}>
              <h2 className="mdl-color-text--white">Health</h2>
              <Button onClick={this.handleRefreshPolicies} className="mdl-cell--bottom" raised colored ripple>Refresh Health</Button>
            </div>
          </CardTitle>
          <CardText className={styles.cardText}>
            <ul className={styles.healthList}>
              <div className={`${styles.healthList}, mdl-grid`}>
                { display }
              </div>
            </ul>
          </CardText>
        </Card>
      </div>
    );
  }
}


