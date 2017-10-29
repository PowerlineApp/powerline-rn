import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { Container, Content, Header, Left, Right, Label, Text, Button, Icon, Title, Body, Footer, Textarea, View, List, ListItem, Thumbnail, Toast} from 'native-base';

const PLColors = require('PLColors');
import styles from './styles';
import { Dimensions, ScrollView, TextInput } from 'react-native';
import { showToast } from 'PLToast';

const { width, height } = Dimensions.get('window');
import { loadUserData, getGroups, getUsersByGroup, createPostToGroup, getPetitionConfig } from 'PLActions';
import randomPlaceholder from '../../../utils/placeholder';
import CommunityView from '../../../components/CommunityView';
const POST_MAX_LENGTH = 5000;

class NewGroupPoll extends Component{
    constructor(props){
        super(props);

        this.state = {
            showCommunity: true,
            profile: {},
            grouplist: [],
            selectedGroupIndex: -1,
            answers: [],
            answersCount: 0
        };
    }


    componentDidMount () {
        var { token } = this.props;
        loadUserData(token).then(data => {
            this.setState({
                profile: data
            });
        }).catch(err => {

        });

        getGroups(token).then(ret => {
            this.setState({
                grouplist: ret.payload
            });
        }).catch(err => {

        });
    }


    toggleCommunity () {
        this.setState({
            showCommunity: !this.state.showCommunity
        });
    }

    selectGroupList (index) {
        this.setState({
            selectedGroupIndex: index,
            showCommunity: false
        });

        var { token } = this.props;

        getPetitionConfig(token, this.state.grouplist[index].id)
        .then(data => {
            this.setState({
                posts_remaining: data.posts_remaining
            });
        })
        .catch(err => {

        });
    }

    setAnswer(text, index){
        let {answers} = this.state;
        answers[i] = text;
        this.setState({answers});
    }


    /**
     * render one field of answer for each counter
     * @param {Number (integer)} qtt 
     */
    renderAnswers(qtt){
        console.log('rendering: ', qtt);
        return (
            new Array(qtt).map(i =>
                <View>
                    <View style={{flexDirection: 'row'}}>
                    <TextInput
                        style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                        onChangeText={(text) => this.setAnswer(text, i)}
                        value={this.state.answers[i]}
                    />
                    <Text>x</Text> {/* will be an icon to delete answer */}
                    </View>
                </View>));
    }



    render(){
        // return null;
        let { answersCount } = this.state;
        console.log(answersCount);
        return (
            <Container style={styles.container}>
                <Header style={styles.header}>
                    <Left>
                        <Button transparent onPress={() => Actions.pop()} style={{width: 50, height: 50 }}  >
                            <Icon active name='arrow-back' style={{color: 'white'}} />
                        </Button>
                    </Left>
                    <Body>
                        <Title style={{color: 'white'}}>New Group Poll</Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={() => this.createPost()}>
                            <Label style={{color: 'white'}}>Send</Label>
                        </Button>
                    </Right>
                </Header>
                {
                    this.state.showCommunity &&
                    <CommunityView
                        grouplist={this.state.grouplist}
                        onPress={this.selectGroupList.bind(this)}
                    />
                }
                <ScrollView>
                    <View style={styles.main_content}>
                        <List>
                            <ListItem style={styles.community_container} onPress={() => this.toggleCommunity()}>
                                <View style={styles.avatar_container}>
                                    <View style={styles.avatar_wrapper}>
                                        <Thumbnail square style={styles.avatar_img} source={{uri: this.state.profile.avatar_file_name + '&w=50&h=50&auto=compress,format,q=95'}} />
                                    </View>
                                    <View style={styles.avatar_subfix} />
                                </View>
                                <Body style={styles.community_text_container}>
                                    <Text style={{color: 'white'}}>
                                        {this.state.selectedGroupIndex == -1 ? 'Select a community' : this.state.grouplist[this.state.selectedGroupIndex].official_name}
                                    </Text>
                                </Body>
                                <Right style={styles.communicty_icon_container}>
                                    <Icon name='md-create' style={{color: 'white'}} />
                                </Right>
                            </ListItem>
                        </List>
                        <View style={{padding: 20, flexDirection: 'column'}}>
                            <View>
                                <TextInput
                                    style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                                    onChangeText={(text) => this.setState({text})}
                                    value={this.state.text}
                                    placeholder='Type your question here'
                                />
                            </View>
                            {
                                this.renderAnswers(answersCount)
                            }

                            <Button transparent onPress={() => this.setState({answersCount: answersCount + 1})} style={{width: 50, height: 50 }}  >
                                <Text>Add Answer </Text>
                            </Button>
                        </View>



                    </View>
                </ScrollView>
            </Container>);
    }
}

const mapStateToProps = state => ({
    token: state.user.token
});

export default connect(mapStateToProps)(NewGroupPoll);

