import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';


import { Label as NBLabel } from 'native-base';
import PLColors from '../../../../common/PLColors';

class Label extends PureComponent {
  render() {
    const { small, disabled } = this.props;
    return (
        <NBLabel
          {...this.props}
          style={{
            color: disabled ? PLColors.lightText : PLColors.darkGreyText,
            fontSize: small ? 14 : 16,
            fontWeight: '300',
            marginTop: 8,
            ...this.props.style,
          }}
        >{this.props.children}</NBLabel>
    );
  }
}

export default Label;
