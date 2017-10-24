import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import {
    Container,
    Content,
    Header,
    Left,
    Right,
    Label,
    Text,
    Button,
    Icon,
    Title,
    Body,
    Footer,
    Textarea,
    View,
    List,
    ListItem,
    Thumbnail,
    Toast
} from 'native-base';
const PLColors = require('PLColors');
import SuggestionBox from '../../../common/suggestionBox';
import styles from './styles';
import {
    Dimensions,
    ScrollView
} from 'react-native';
import { showToast } from 'PLToast';

const { width, height } = Dimensions.get('window');
import { inviteUpvotersToGroup } from 'PLActions';
import randomPlaceholder from '../../../utils/placeholder';
import CommunityView from '../../../components/CommunityView';
const POST_MAX_LENGTH = 5000;

class GroupInvite extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedGroupIndex: -1,
        };
    }

    toggleCommunity() {
        this.setState({
            showCommunity: !this.state.showCommunity
        });
    }

    selectGroupList(index) {
        this.setState({
            selectedGroupIndex: index,
        });
    }

    invite() {
        const { token, grouplist, entityId: id, entityType: type } = this.props;
        const { selectedGroupIndex } = this.state;
        let groupId = null;
        if (selectedGroupIndex == -1) {
            alert('Please select Group.');
            return;
        }
        groupId = grouplist[selectedGroupIndex].id;
        
        inviteUpvotersToGroup(token, id, groupId, type)
            .then(data => {
                if (data.status === 204) {
                    showToast('Invites sends Successful!');
                    Actions.pop();
                }
            })
            .catch(err => {

            });
    }

    render() {
        const { grouplist, profile } = this.props;
        const { selectedGroupIndex } = this.state;

        return (
            <Container style={styles.container}>
                <Header style={styles.header}>
                    <Left>
                        <Button transparent onPress={() => Actions.pop()} style={{ width: 50, height: 50 }}  >
                            <Icon active name='arrow-back' style={{ color: 'white' }} />
                        </Button>
                    </Left>
                    <Body>
                        <Label style={{ color: 'white', width: width - 150 }} numberOfLines={1}>Invite to which group?</Label>
                    </Body>
                    <Right>
                        <Button transparent onPress={() => this.invite()}>
                            <Label style={{ color: 'white' }}>Invite</Label>
                        </Button>
                    </Right>
                </Header>

                <ScrollView>
                    <View style={styles.main_content}>
                        <List>
                            <ListItem style={styles.community_container} onPress={() => this.toggleCommunity()}>
                                <View style={styles.avatar_container}>
                                    <View style={styles.avatar_wrapper}>
                                        <Thumbnail square style={styles.avatar_img} source={{ uri: profile.avatar_file_name + '&w=50&h=50&auto=compress,format,q=95' }} />
                                    </View>
                                    <View style={styles.avatar_subfix} />
                                </View>
                                <Body style={styles.community_text_container}>
                                    <Text style={{ color: 'white' }}>
                                        {selectedGroupIndex == -1 ? 'Select a community' : grouplist[selectedGroupIndex].official_name}
                                    </Text>
                                </Body>
                            </ListItem>
                        </List>
                        <View>
                            <CommunityView
                                light
                                grouplist={grouplist}
                                onPress={this.selectGroupList.bind(this)}
                            />
                        </View>
                    </View>
                </ScrollView>
            </Container>
        );
    }
}

const mapStateToProps = state => ({
    token: state.user.token,
    grouplist: state.groups.others,
    profile: state.user.profile,
});

export default connect(mapStateToProps)(GroupInvite);
