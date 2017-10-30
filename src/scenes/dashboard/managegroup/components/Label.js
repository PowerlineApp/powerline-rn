import React, { PureComponent, PropTypes } from 'react';

import { Label as NBLabel } from 'native-base';
import PLColors from 'PLColors';

class Label extends PureComponent {
  render() {
    return (
        <NBLabel style={{
            color: PLColors.darkGreyText,
            fontSize: 16,
            fontWeight: '300',
            marginTop: 8,
        }}>{this.props.children}</NBLabel>
    );
  }
}

export default Label;
