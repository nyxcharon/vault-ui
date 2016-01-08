import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import connectData from 'helpers/connectData';
import { CollapsibleSection } from '../../components';

import {mounts} from 'redux/modules/vault';

import {
  Card,
  CardTitle,
  CardText,
} from 'react-mdl';


function fetchData(getState, dispatch) {
  console.log('calling load mounts');
  const promises = [];
  promises.push(dispatch(mounts()));
  return Promise.all(promises);
}


class MountData extends Component {
  static propTypes = {
    data: PropTypes.object,
    id: PropTypes.string
  }

  render() {
    console.log('data', this.props.data);
    console.log('id', this.props.id);
    return (
      <div>
        <CollapsibleSection title={this.props.id}>
          { }
          <div>{this.props.data.description}</div>
        </CollapsibleSection>
      </div>
    );
  }
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

    console.log('reunder mounts', mounts);
    let display;
    if (mounts !== undefined) {
      console.log('derpy mounts');
      console.log(mounts);
      display = Object.keys(mounts).map((key) => {
        return (<MountData id={key} data={mounts[key]} />);
      });
      console.log(display);
    } else {
      display = null;
    }

    return (
      <div>
        <Card shadow={0}>
          <CardTitle>
            User Title Stuff
          </CardTitle>
          <CardText >
            <ul>
              {display}
            </ul>
          </CardText>
        </Card>
      </div>
    );
  }
}
