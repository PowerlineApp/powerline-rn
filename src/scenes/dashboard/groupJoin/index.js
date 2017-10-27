import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
const PLColors = require('PLColors');
import {TextInput} from 'react-native'
import styles  from './styles';
import update from 'immutability-helper'
import { getGroupRequiredFields } from '../../../actions/groups'
import {
    Content,
    Container,
    Item,
    Input,
    Title,
    Button,
    Header,
    Body,
    Left,
    Right,
    Label,
    Icon,
    List,
    ListItem,
    Thumbnail,
    Text
} from 'native-base';
import { Actions } from 'react-native-router-flux';

class GroupJoin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fields: null,
            passcode: null,
            input: {}
        }
        this.renderPasscodeInput = this.renderPasscodeInput.bind(this)
    }
    componentDidMount() {
        console.log('mounted')
        this.loadFields() 
    }

    loadFields() {
        const { token } = this.props;
        const { id } = this.props.data;
        getGroupRequiredFields(token, id)
            .then(result => {
                console.log(getGroupRequiredFields)
                this.setState({
                    fields: result
                })
            })    
            .catch(err => {
                this.setState({
                    error: err
                })
            })
    }

    renderPasscodeInput() {
        if(this.props.data.membership_control === 'passcode') {
            return (
                <View style={{flex: 1, minWidth: '100%'}}>
                    <Text style={{alignSelf: 'flex-start', color: PLColors.inactiveText, fontSize: 13}}>Group Password</Text>
                    <TextInput
                        placeholder="Group password"
                        style={styles.inputText}
                        autoCorrect={false}
                        underlineColorAndroid={'transparent'}
                        value={this.state.passcode}
                        onChange={(event) => this.setState({passcode: event.nativeEvent.text})}
                    />
                </View>
            )
        }
    }

    onTextChange(field, value) {
        console.log(field, value)
        let obj = {}
        obj[field] = value
        this.setState(update(this.state, {input: {$merge: obj}})) 
    }

    renderFields() {
        if(this.state.fields) {
            const { fields } = this.state
            return fields.map((field, index) => {
                return (
                    <View style={{flex: 1, minWidth: '100%'}}>
                        <Text style={{alignSelf: 'flex-start', color: PLColors.inactiveText, fontSize: 13}}>{field.field_name}</Text>
                        <TextInput
                            key={index}
                            placeholder="required field"
                            style={styles.inputText}
                            autoCorrect={false}
                            underlineColorAndroid={'transparent'}
                            onChange={(event) => this.onTextChange(field.field_name, {id: field.id, answer: event.nativeEvent.text})}
                        />
                    </View>
                )
            })
        }
        return;
    }

    validateFields () {
        
    }

    render() {
        console.log(this.state)
        return (
            <Container style={styles.container}>
                <Header style={styles.header}>
                    <Left>
                        <Button transparent onPress={() => Actions.pop()} style={{width: 50, height: 50 }}  >
                            <Icon active name="arrow-back" style={{color: 'white'}}/>
                        </Button>
                    </Left>
                    <Body>
                        <Title style={{color: 'white'}}>Group Join</Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={() => {}}>
                            <Label style={{color: 'white'}}>Invite</Label>
                        </Button>
                    </Right>
                </Header>
                 <Content padder>
                     <List>
                        <ListItem style={{backgroundColor: 'white', marginLeft: 0, paddingLeft: 17}}>
                            {this.props.data.avatar_file_path?
                            <Thumbnail style={styles.avatar} square source={{uri: this.props.data.avatar_file_path+'&w=50&h=50&auto=compress,format,q=95'}}/>:
                            <View style={styles.avatar}/>
                            }
                            <Body>
                                <Text style={{color: PLColors.main}}>{this.props.data.official_name}</Text>                             
                            </Body>
                        </ListItem>
                        <ListItem style={styles.listItem}>
                            <View>
                              {this.renderPasscodeInput()}
                            </View>
                        </ListItem>
                        <ListItem style={styles.listItem}>
                            <View>
                              {this.renderFields()}
                            </View>
                        </ListItem>
                     </List>
                </Content> 
            </Container>
        )
    }
}

const mapState = state => ({
    token: state.user.token
});

const mapActions = (dispatch) => ({})

export default connect(mapState, mapActions) (GroupJoin)