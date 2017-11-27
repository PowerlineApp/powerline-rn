import React, {Component} from 'react';
import { FloatingAction } from 'react-native-floating-action';

class SharefloatingAction extends Component {
    render() {
        return(
            <FloatingAction
                actions={
                [
                    {
                        text: '',
                        icon: require('../assets/share_icon.png'),
                        name: '',
                        position: 1,
                        color: this.props.isSelected() ? '#55c5ff' : '#ccc'
                    }
                ]
                }
                onPressItem={
                    () => {
                        this.props.onPress();
                    }
                }
                buttonColor={this.props.isSelected() ? '##55c5ff' : '#ccc'}
                overlayColor='rgba(0,0,0,0)'
                floatingIcon={require('../assets/share_icon.png')}
                overrideWithAction
                 />
        );
    }
}
export default SharefloatingAction;
