import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { load as loadPolicies, loadIndividualPolicy } from 'redux/modules/policies';
import { CollapsibleSection, CollapsibleList } from '../../components';
import {
  Card,
  CardTitle,
  CardText,
  Button,
  Spinner
} from 'react-mdl';

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

  loadPolicy = (policyName) => {
    this.props.dispatch(loadIndividualPolicy(policyName));
  }

  render() {
    const { policies } = this.props;
    const styles = require('../../components/styles/CardListStyles.scss');
    return (
      <div>
        <Card shadow={0} className={styles.fullWidthCard}>
          <CardTitle className={styles.cardTitle}>
            <div style={{float: 'right'}}>
              <h2 className="mdl-color-text--white">Policies</h2>
              <Button onClick={this.handleRefreshPolicies} className="mdl-cell--bottom" raised colored ripple>Refresh Policies</Button>
            </div>
          </CardTitle>
          <CardText className={styles.cardText}>
            <CollapsibleList>
              {policies.map((policy, index) => {
                return (
                  <CollapsibleSection key={index} title={policy.name} asyncLoadFn={() => this.loadPolicy(policy.name)}>
                    { policy.policy &&
                      <pre>{policy.policy}</pre>
                    }
                    { !policy.policy &&
                      <Spinner/>
                    }
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

function mapStateToProps(state) {
  return {
    policies: state.policies.policies
  };
}

export default connect(mapStateToProps)(Policies);
