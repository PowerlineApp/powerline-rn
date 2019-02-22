//This is the Search Screen. It is accessible via burger menu and via the search shortcut on the Home Screen
//GH 43

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import {
    Container,
    Header,
    Left,
    Body,
    Title,
    Icon,
    Button,
    List,
    Text,
    Content,
    Thumbnail,
    Right,
    View,
    Item,
    Input,
    Tabs,
    Tab
} from 'native-base';

import {
    MenuContext
} from 'react-native-popup-menu';
import styles from './styles';
import { openDrawer, searchGroup, searchForUsersFollowableByCurrentUser, searchPostsByHashtab } from 'PLActions';

import SearchGroups from './groups';
import SearchUsers from './users';
import SearchHashtags from './hashtags';
import {Mixpanel} from 'PLEnv';


class Search extends Component {
    static defaultProps = {
        initialPage: 0
    };

    constructor(props){
        super(props);

        this.state = {
            search: props.search?props.search: '',
            groups: [],
            users: [],
            posts: [],
        }

        this.onQuery(props.search?props.search: '');
        this.onRemoveUser = this.onRemoveUser.bind();
    }

    onChangeText(text){
        
        this.onQuery(text);

        this.setState({
            search: text
        });
    }

    //There are three different types of searches. Search by Groups (default view), search for people, and search for posts/hashtags.
    //At the time of this comment, search for posts is not yet developed.
    async onQuery(text){
        if(text != ''){
            //search query
            this.setState({
                groups: [],
                users: []
            });

            var { token } = this.props;
            searchForUsersFollowableByCurrentUser(token, text, 1, 20)
            .then(data => {
                this.setState({
                    users: data
                });
                Mixpanel.track("User search from Home Screen");
            })
            .catch(err => {

            });

            searchGroup(token, text)
            .then(data => {
                this.setState({
                    groups: data.payload
                });
                Mixpanel.track("Group search from Home Screen");
            })
            .catch(err => {

            });

            const postsResult = await searchPostsByHashtab(token, text);
            if (postsResult.status === 200 & postsResult.ok) {
                const { payload: posts } = await postsResult.json();
                this.setState({ posts });
            }
        }
    }

    onRemoveUser(index){
        this.state.users.splice(index, 1);
        this.setState({
            users: this.state.users
        });
    }

    render() {
        return (
            <MenuContext customStyles={menuContextStyles}>
                <Container style={styles.container}>
                    <Header searchBar rounded style={styles.header}>
                        <Left style={{flex: 0.1}}>
                            <Button style={{width: '100%'}}  transparent onPress={this.props.openDrawer}>
                                <Icon active name="menu" style={{color: 'white'}}/>
                            </Button>
                        </Left>
                        <Item style={styles.searchBar}>
                            <Input style={styles.searchInput} autoFocus placeholder="Search groups, people, topics" value={this.state.search} onChangeText={(text) => this.onChangeText(text)} selectTextOnFocus={true} />
                            <Icon active name="search"/>
                        </Item>
                    </Header>
                    <Tabs initialPage={this.props.initialPage} locked={true}>
                        <Tab heading="Groups" tabStyle={styles.tabStyle} activeTabStyle={styles.tabStyle}>
                            <SearchGroups groups={this.state.groups}/>
                        </Tab>
                        <Tab heading="People" tabStyle={styles.tabStyle} activeTabStyle={styles.tabStyle}>
                            <SearchUsers users={this.state.users} onRemove={(index) => this.onRemoveUser(index)}/>
                        </Tab>
                        <Tab heading="Hashtags" tabStyle={styles.tabStyle} activeTabStyle={styles.tabStyle}>
                            <SearchHashtags posts={this.state.posts} />
                        </Tab>
                    </Tabs>
                </Container>
            </MenuContext>
        );
    }
}

const menuContextStyles = {
    menuContextWrapper: styles.container,
    backdrop: styles.backdrop
}

const mapStateToProps = state => ({
    token: state.user.token
});

const mapDispatchToProps = dispatch => ({
    openDrawer: () => dispatch(openDrawer())
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);