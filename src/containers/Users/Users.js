import React, { Component, PropTypes } from 'react';
import * as authActions from 'redux/modules/users';
import {connect} from 'react-redux';
import { Card, CardTitle, CardText, Button, Spinner } from 'react-mdl';
import UserView from './UserView';
import { CollapsibleSection, CollapsibleList } from '../../components';

@connect(
  state => ({users: state.users.data,
    isLoading: state.users.isLoading}),
  authActions)
export default class Users extends Component {
  static propTypes = {
    load: PropTypes.func,
    users: PropTypes.array,
    isLoading: PropTypes.bool
  }

  componentWillMount() {
    console.log('Calling load');

    if (this.props.users === null) {
      this.loadUsersIfNeeded();
    }
  }

  loadUsersIfNeeded = () => {
    console.log('Calling load users');

    if (!this.props.isLoading) {
      console.log('Not loading. Repullig');
      this.props.load();
    }
  }

  render() {
    const { users, isLoading } = this.props;
    let display = null;
    console.log(`Users Loading: ${isLoading}`);

    if (!isLoading && users !== null) {
      display = users.map((userName, index) => {
        return (
          <CollapsibleSection key={index} title={userName} key={index}>
            <UserView userName={userName}/>
          </CollapsibleSection>
        );
      });
    } else {
      display = null;
    }

    return (
      <div>
        <Card shadow={0}>
          <CardTitle>Users
            <Button onClick={this.loadUsersIfNeeded}>Reload</Button>
          </CardTitle>
          <CardText>
          { isLoading &&
            <Card>
              <p>Loading Users!</p>
              <Spinner />
            </Card>
          }
          { !isLoading &&
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
