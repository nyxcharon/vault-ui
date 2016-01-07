import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { load as loadPolicies } from 'redux/modules/policies';
import { Button } from 'react-mdl';

class Policies extends Component {
  static propTypes = {
    policies: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  componentDidMount() {
    this.props.dispatch(loadPolicies());
  }

  handleRefreshPolicies = (event) => {
    event.preventDefault();
    this.props.dispatch(loadPolicies());
  }

  render() {
    const { policies } = this.props;
    return (
      <div>
        <h1>Policies</h1>
        <ul>
          { policies.map((policy, index) => {
            return (<li key={index}>{policy}</li>);
          }) }
        </ul>
        <Button onClick={this.handleRefreshPolicies} className="mdl-cell--bottom" raised colored ripple>Refresh Policies</Button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    policies: state.policies.policies
  };
}

export default connect(mapStateToProps)(Policies);
