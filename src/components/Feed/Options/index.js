import React, {Component} from 'react'
import {View, Text} from 'react-native';

import Option from './option';

const options = [
    {
        value: 'This is one answers choice text that can be a line or two long and will display here',
        amount: '50',
        is_user_amount: false,
        checked: false
    },
    {
        value: 'Option two',
        amount: '20',
        is_user_amount: true,
        checked: false
        
    },
    {
        value: 'Option three',
        amount: '10',
        is_user_amount: false,
        checked: false

    }
]

class Options extends Component {
    constructor(props){
        super(props);

        this.state = {options};
    }

    setChecked(index) {
        let {options} = this.state;
        options = options.map((opt, i) => ({...opt, checked: i === index }))
        this.setState({options})
    }


    render(){
        let {item} = this.props;
        let {options} = this.state;
        return (
            <View style={styles.optionsContainer}>
                {
                    options.map((opt, i) => {
                        console.log(opt);
                        return <Option type={item.entity.type} opt={opt} onCheck={() => this.setChecked(i)} />
                    })
                }
            </View>
        )
    }
}

const styles= {
    optionsContainer: {
        justifyContent: 'flex-start'
    }
}


export default Options;