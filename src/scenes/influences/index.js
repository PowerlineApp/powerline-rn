//This is My Influences Screen, accessible via burger menu and via Friends Feed "Manage Followers" 
//User A follows User B. User A is a "follower" to User B... User B is a "followed user" to User A
//GH36

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { Content, Container, Title, Text, Button, List, Icon, ListItem, Left, Body, Right, Thumbnail, Header, Tabs, Tab } from 'native-base';

import Menu, {
    MenuContext,
    MenuTrigger,
    MenuOptions,
    MenuOption,
    renderers
} from 'react-native-popup-menu';

const PLColors = require('../../common/PLColors');
const { WINDOW_WIDTH, WINDOW_HEIGHT } = require('../../common/PLConstants');
import styles from './styles';
import { openDrawer } from '../../actions';
import Followings from './followings';
import Followers from './followers';
import {Mixpanel} from '../../PLEnv';


class Influences extends Component {
    constructor(props) {
        super(props);
    }

    //User can search for user(s) to follow
    searchFollowings() {
        Actions.searchFollowing();
    }

    render() {
        return (
            <MenuContext customStyles={menuContextStyles}>
                <Container>
                    <Header hasTabs style={styles.header}>
                        <Left>
                            <Button style={{width: '100%'}}  transparent onPress={Actions.pop}>
                            <Icon active name="arrow-back" style={{ color: "white" }} />
                            </Button>
                        </Left>
                        <Body style={{flex: 4}}>
                            <Title style={{color: '#fff'}}>My Influences</Title>
                        </Body>
                        <Right>
                            <Button transparent onPress={this.searchFollowings}>
                                <Icon active name='add-circle' style={{ color: 'white' }} />
                            </Button>
                        </Right>
                    </Header>
                    {/* User has choice to view Followers or Followed Users */}
                    <Tabs initialPage={0} locked>
                        <Tab heading='Followers' tabStyle={styles.tabsStyle} activeTabStyle={styles.tabsStyle}>
                            <Followers />
                        </Tab>
                        <Tab heading='Following' tabStyle={styles.tabsStyle} activeTabStyle={styles.tabsStyle} onPress={Mixpanel.track("Following opened")}>
                            <Followings />
                        </Tab>
                    </Tabs>
                </Container>
            </MenuContext>
        );
    }
}

const menuContextStyles = {
    menuContextWrapper: styles.container,
    backdrop: styles.backdrop,
};

const mapStateToProps = state => ({
    token: state.user.token,
    page: state.activities.page,
    totalItems: state.activities.totalItems,
    payload: state.activities.payload,
    count: state.activities.count,
});

const mapDispatchToProps = dispatch => ({
    openDrawer: () => dispatch(openDrawer())
});

export default connect(mapStateToProps, mapDispatchToProps)(Influences);