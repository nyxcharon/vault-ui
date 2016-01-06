import React, { Component } from 'react';
import Button from 'react-mdl/lib/Button';
import {Grid, Cell} from 'react-mdl';
// import { Link } from 'react-router';
// import { CounterButton, GithubButton } from 'components';
// import config from '../../config';

export default class Home extends Component {
  render() {
    const styles = require('./Home.scss');
    // require the logo image both from client and server
    // const logoImage = require('./logo.png');
    return (
      <div>
        <h2 className={styles.home}>Home Page</h2>
        <h2 className="home">Home Page Test</h2>
        <Grid>
          <Cell col={12}>
            <Button raised ripple>Button 1</Button>
          </Cell>
          <Cell col={12}>
            <Button raised ripple>Button 2</Button>
          </Cell>
          <Cell col={12}>
            <Button raised ripple>Button 3</Button>
          </Cell>
        </Grid>
      </div>
    );
  }
}
