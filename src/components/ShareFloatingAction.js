import React, {Component} from 'react';
import { FloatingAction } from 'react-native-floating-action';

class SharefloatingAction extends Component {
    render() {
        return(
            <FloatingAction
                actions={
                    [
                        {
                            text: 'Facebook',
                            icon: require('../assets/facebook_logo.png'),
                            name: 'facebook',
                            position: 2,
                            color: this.props.isSelected('facebook') ? '#3b5998' : '#ccc'
                        }, {
                            text: 'Twitter',
                            icon: require('../assets/twitter_logo.png'),
                            name: 'twitter',
                            position: 1,
                            color: this.props.isSelected('twitter') ? '#55acee' : '#ccc'
                        }
                    ]
                }
                onPressItem={
                    (name) => {
                        this.props.cb(name)
                    }
                }
                buttonColor='#71c9f1'
                overlayColor='rgba(0,0,0,0)'
                floatingIcon={require('../assets/share_icon.png')}
                >
            </FloatingAction>
        )
    }
}
export default SharefloatingAction
