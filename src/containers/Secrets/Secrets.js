import React, { Component } from 'react';
// import Button from 'react-mdl/lib/Button';
// import {Grid, Cell} from 'react-mdl';

var tempSecrets = [
  { secretName: 'Foo', data: 'Good'},
  { secretName: 'Bar', error: 'Bad'}
];

class SecretValue extends Component {
  render() {
    if (this.props.error) {
      return (<p>Denied</p>);
    } else {
      return (<p>{this.props.data}</p>);
    }
  }
}

class SecretDisplay extends Component {
  render() {
    return (<div className="SecretName">
      <h2>{this.props.secretName}</h2>
      <SecretValue data={this.props.data} error={this.props.error}/>
    </div>);
  }
}

export default class Secrets extends Component {
  render() {
    var secrets = tempSecrets.map(function(secret) {
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
