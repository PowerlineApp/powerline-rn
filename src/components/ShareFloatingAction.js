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
                            color: this.props.isSelected() ? '#71c9f1' : '#ccc'
                        }
                    ]
                }
                onPressItem={
                    () => {
                        this.props.cb()
                    }
                }
                buttonColor={this.props.isSelected() ? '#71c9f1' : '#ccc'}
                overlayColor='rgba(0,0,0,0)'
                floatingIcon={require('../assets/share_icon.png')}
                overrideWithAction
                >
            </FloatingAction>
        )
    }
}
export default SharefloatingAction
