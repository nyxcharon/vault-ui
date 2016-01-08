import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { load as loadPolicies, loadIndividualPolicy } from 'redux/modules/policies';
import { CollapsibleSection, CollapsibleList } from '../../components';
import {
  Card,
  CardTitle,
  CardText,
  Button
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
    this.collapseAll();
  }

  loadPolicy = (policyName) => {
    this.props.dispatch(loadIndividualPolicy(policyName));
  }

  collapseAll = () => {
    for (const child of Object.entries(this.refs)) {
      if (child[1].collapse) {
        child[1].collapse();
      }
    }
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
            </div>
          </CardTitle>
          <CardText className={styles.cardText}>
            <div style={{textAlign: 'right'}}>
              <Button onClick={this.handleRefreshPolicies} className="mdl-cell--bottom" raised colored ripple>Refresh</Button>
            </div>
            <CollapsibleList>
              {policies.map((policy, index) => {
                return (
                  <CollapsibleSection ref={`section${index}`} key={index} title={policy.name} asyncLoadFn={() => this.loadPolicy(policy.name)}>
                    <pre>{policy.policy}</pre>
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
