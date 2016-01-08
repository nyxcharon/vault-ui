import React, { Component, PropTypes } from 'react';
import * as authActions from 'redux/modules/users';
import {connect} from 'react-redux';
import { Card, CardTitle, CardText, Button, Spinner } from 'react-mdl';
import UserView from './UserView';
import { CollapsibleSection, CollapsibleList } from '../../components';

@connect(
  state => ({users: state.users.data,
    usersLoading: state.users.usersLoading}),
  authActions)
export default class Users extends Component {
  static propTypes = {
    load: PropTypes.func,
    users: PropTypes.array,
    usersLoading: PropTypes.bool
  }

  componentWillMount() {
    console.log('Calling load');

    if (this.props.users === null) {
      this.loadUsersIfNeeded();
    }
  }

  loadUsersIfNeeded = () => {
    this.props.load();
  }

  render() {
    const { users, usersLoading } = this.props;
    const styles = require('../../components/styles/CardListStyles.scss');

    let display = null;
    console.log(`Users Loading: ${usersLoading}`);
    console.log('this props: ', this.props);

    if (!usersLoading && users !== null) {
      display = users.map((userName, index) => {
        return (
          <CollapsibleSection key={index} title={userName} key={index}>
            <UserView ref={`userView${index}`} userName={userName} />
          </CollapsibleSection>
        );
      });
    } else {
      display = null;
    }

    return (
      <div>
        <Card shadow={0} className={styles.fullWidthCard}>
          <CardTitle className={styles.cardTitle}>
            <h2 className="mdl-color-text--white">Users</h2>
          </CardTitle>
          <CardText className={styles.cardText}>
          <div style={{textAlign: 'right'}}>
            <Button onClick={this.loadUsersIfNeeded} raised colored ripple>Reload</Button>
          </div>
          { usersLoading &&
            <div>
              <p>Loading Users!</p>
              <Spinner />
            </div>
          }
          { !usersLoading &&
            <CollapsibleList>
              {display}
            </CollapsibleList>
          }
          </CardText>
        </Card>
      </div>
    );
  }
}
