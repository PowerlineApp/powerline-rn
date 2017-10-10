import React, { Component } from 'react';
import { connect } from 'react-redux';
import { 
    View,
    RefreshControl,
    TouchableOpacity,
    Alert
} from 'react-native';

import {
    List,
    ListItem,
    Text,
    Content,
    Left,
    Body,
    Thumbnail,
    Right,
    Icon
} from 'native-base';
import { Actions } from 'react-native-router-flux';
const PLColors = require('PLColors');
import { getFollowers, unFollowers, acceptFollowers } from 'PLActions';
import styles from './styles';

class Followers extends Component{
    static propTypes = {
        token: React.PropTypes.string
    }

    constructor(props){
        super(props);

        this.state = {
            refreshing: false
        }
    }

    componentWillMount(){
        this._onRefresh();
    }

    loadFollowers(){
        var { token, dispatch } = this.props;
        var { page, per_page } = this.state;

        dispatch({type: 'RESET_FOLLOWERS'});

        getFollowers(token, page, per_page)
        .then(ret => {
            dispatch({type: 'LOAD_FOLLOWERS', data: ret});
            this.setState({
                refreshing: false
            });
        })
        .catch(err => {
            
        });
    }

    _onRefresh() {
        this.setState({refreshing: true});
        this.loadFollowers();
    }

    unFollowers(index){
        var { token, dispatch } = this.props;

        Alert.alert("Confirm", "Do you want to stop " + this.props.followers[index].username + " from following you ?", [
            {
                text: 'Cancel'
            },
            {
                text: 'OK',
                onPress: () => {
                    unFollowers(token, this.props.followers[index].id)
                    .then((ret) => {                        
                        var followerDATA = JSON.parse(JSON.stringify(this.props.followers));
                        followerDATA.splice(index, 1);
                        dispatch({type: 'RESET_FOLLOWERS'});
                        dispatch({type: 'CHANGE_FOLLOWERS', data: followerDATA});

                    })
                    .catch(err => {

                    });
                }
            }            
        ]);
    }

    acceptFollower(index){
        var { token } = this.props;

        Alert.alert("Confirm", "Do you want to approve " + this.state.followers[index].username + " ?", [
            {
                text: 'Cancel'
            },
            {
                text: 'OK',
                onPress: () => {
                    acceptFollowers(token, this.state.followers[index].id)
                    .then((ret) => {
                        var followerDATA = JSON.parse(JSON.stringify(this.props.followers));
                        followerDATA[index].status = 'active';
                        dispatch({type: 'RESET_FOLLOWERS'});
                        dispatch({type: 'CHANGE_FOLLOWERS', data: followerDATA});
                    })
                    .catch(err => {

                    });
                }
            }            
        ]);
    }

    goToProfile(id){
        Actions.profile({id: id});
    }

    render(){
        return (
            <Content
                refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh.bind(this)}
                        />
                }>
                {this.props.followers.length > 0?
                <List>
                    {
                        this.props.followers.map((follow, index) => {
                            return (
                                <ListItem avatar key={index} onPress={() => this.goToProfile(follow.id)}>
                                    <Left>
                                        <Thumbnail source={{uri: follow.avatar_file_name+'&w=50&h=50&auto=compress,format,q=95'}} />
                                    </Left>
                                    <Body>
                                        <Text>{follow.username}</Text>
                                        <Text note>{follow.full_name}</Text>
                                    </Body>
                                    <Right style={styles.itemRightContainer}>
                                        {follow.status=='active'?
                                        <TouchableOpacity onPress={() => this.unFollowers(index)}>
                                            <View style={styles.buttonContainer}>
                                                <Icon name="ios-person" style={styles.activeIconLarge}/>                                                
                                                <Icon name="remove-circle" style={styles.activeIconSmall}/>
                                            </View>
                                        </TouchableOpacity>
                                        :
                                        <View style={styles.buttonContainer}>
                                            <TouchableOpacity onPress={() => this.acceptFollower(index)}>
                                                <Icon name="checkmark" style={styles.acceptIcon}/>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => this.unFollowers(index)}>
                                                <Icon name="close" style={styles.rejectIcon}/>
                                            </TouchableOpacity>
                                        </View>
                                        }
                                    </Right>
                                </ListItem>
                            );
                        })
                    }
                </List>:
                <Text></Text>
                }
            </Content>
        );
    }

}

const mapStateToProps = state => ({
    token: state.user.token,
    followers: state.followers.payload
});

export default connect(mapStateToProps)(Followers);