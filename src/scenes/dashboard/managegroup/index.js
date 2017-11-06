import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import {
  Container,
  Content,
  Header,
  Body,
  Title,
  Left,
  Right,
  Label,
  Thumbnail,
  List,
  ListItem,
  Input,
  Button,
  Icon,
  Text
} from 'native-base';
import { TextInput } from 'react-native';
import { MenuContext } from 'react-native-popup-menu';
import PLColors from 'PLColors';
import PLImageSelector from '../../../common/PLImageSelector'
import { AccordionItem } from './components';
import * as Options from './options';
import styles from './styles';
import { updateGroupAvatar } from '../../../actions/groups'
class ManageGroup extends Component {
  static propTypes = {
    token: React.PropTypes.string
  };
  constructor(props) {
    super(props);
    this.state = {
      newAvatar: null
    }
    this.updateGroupAvatar = this.updateGroupAvatar.bind(this)
  }
  
  updateGroupAvatar(image) {
    const { token, group } = this.props;
    this.setState({newAvatar: image.path})
    updateGroupAvatar(token, group.id, image.data).then(res => console.log(res)).catch(err => console.log(err))
  }

  render() {
    const { group, dispatch, token } = this.props;

    return (
      <MenuContext customStyles={styles.menuContextStyles}>
        <Container style={styles.container}>
          <Header style={styles.header}>
            <Left>
              <Button transparent onPress={() => Actions.pop()}>
                <Icon active name="arrow-back" style={{ color: 'white' }} />
              </Button>
            </Left>
            <Body>
              <Title style={{ color: 'white' }}>Manage Group</Title>
            </Body>
            <Right>
              <Button transparent>
                <Text> </Text>
              </Button>
            </Right>
          </Header>
          <Content>
            <List style={styles.list}>
              <ListItem style={styles.groupHeaderContainer}>
                {this.props.group.avatar_file_path ?
                  <Thumbnail style={styles.avatar} square source={{ uri: (this.state.newAvatar ? this.state.newAvatar : this.props.group.avatar_file_path) }} /> :
                  <View style={styles.avatar} />
                }
                <Body>
                  <Text style={{ color: PLColors.main }}>
                    {this.props.group.official_name}
                  </Text>
                </Body>
                <Right>
                  <PLImageSelector onConfirm={this.updateGroupAvatar} iconSize={20} onError={err => console.log(err)} />
                </Right>
              </ListItem>
            </List>
            <List style={{ ...styles.list, ...styles.borderList }}>
              <AccordionItem title="Profile Setup">
                <Options.ProfileSetup dispatch={dispatch} token={token} group={group} />
              </AccordionItem>
              <AccordionItem title="Subscription Level">
                <Text>In Progress</Text>
                {/* <Options.SubscriptionLevel dispatch={dispatch} token={token} group={group} /> */}
              </AccordionItem>
              <AccordionItem title="Funraiser Setup">
                <Text>In Progress</Text>
              </AccordionItem>
              <AccordionItem title="Membership Control">
                <Options.MembershipControl
                  dispatch={dispatch}
                  token={token}
                  group={group}
                  groupId={group.id}
                  isOwnerManager={group.user_role === 'owner' || group.user_role === 'manager'}
                />
              </AccordionItem>
              <AccordionItem title="Group Permissions">
                <Options.GroupPermissions
                  dispatch={dispatch}
                  token={token}
                  groupId={group.id}
                  isOwnerManager={group.user_role === 'owner' || group.user_role === 'manager'}
                />
              </AccordionItem>
              <AccordionItem title="Manage Group Members">
                <Text>In Progress</Text>
              </AccordionItem>
              <AccordionItem title="Group Sections/Sub-Groups">
                <Text>In Progress</Text>
              </AccordionItem>
              <AccordionItem title="User Content Settings">
                <Options.UserContentSettings dispatch={dispatch} token={token} groupId={group.id} />
              </AccordionItem>
              <AccordionItem title="Invites">
                <Options.Invites dispatch={dispatch} token={token} groupId={group.id} />
              </AccordionItem>
              <AccordionItem title="Reports">
                <Options.Reports dispatch={dispatch} token={token} groupId={group.id} />
              </AccordionItem>
            </List>
          </Content>
        </Container>
      </MenuContext>
    );
  }
}

export default connect(state => ({
  token: state.user.token
}))(ManageGroup);