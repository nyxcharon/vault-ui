import React, { Component } from 'react';
// import Button from 'react-mdl/lib/Button';
// import {Grid, Cell} from 'react-mdl';

const tempSecrets = [
  { secretName: 'Foo', data: 'Good'},
  { secretName: 'Bar', error: true}
];

class SecretValue extends Component {
  static propTypes = {
    data: React.PropTypes.string,
    error: React.PropTypes.bool
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

class SecretDisplay extends Component {
  static propTypes = {
    secretName: React.PropTypes.string.isRequired,
    data: React.PropTypes.string,
    error: React.PropTypes.bool
  }

  render() {
    return (<div className="SecretName">
      <h2>{this.props.secretName}</h2>
      <SecretValue data={this.props.data} error={this.props.error}/>
    </div>);
  }
}

export default class Secrets extends Component {

  render() {
    const secrets = tempSecrets.map((secret) => {
      return (<SecretDisplay secretName={secret.secretName}
        key={secret.id}
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
