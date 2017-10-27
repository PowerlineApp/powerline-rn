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
import PLColors from 'PLColors';

import { AccordionItem } from './components';
import * as Options from './options';
import styles from './styles';

class ManageGroup extends Component {
  static propTypes = {
    token: React.PropTypes.string
  };

  render() {
    const { group } = this.props;
    WARN(JSON.stringify(this.props.group, null, 2));
    return (
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
                <Thumbnail style={styles.avatar} square source={{ uri: this.props.group.avatar_file_path }} /> :
                <View style={styles.avatar} />
              }
              <Body>
                <Text style={{ color: PLColors.main }}>
                  {this.props.group.official_name}
                </Text>
              </Body>
            </ListItem>
            <ListItem style={{ height: 30 }} />
            <AccordionItem title="Profile Setup">
              <Options.ProfileSetup group={group} />
            </AccordionItem>
            <AccordionItem title="Subscription Level">
              <Text>NEXTONE</Text>
            </AccordionItem>
            <AccordionItem title="Funraiser Setup">
              <Text>NEXTONE</Text>
            </AccordionItem>
            <AccordionItem title="Membership Control">
              <Text>NEXTONE</Text>
            </AccordionItem>
            <AccordionItem title="Group Permissions">
              <Text>NEXTONE</Text>
            </AccordionItem>
            <AccordionItem title="Manage Group Members">
              <Text>NEXTONE</Text>
            </AccordionItem>
            <AccordionItem title="Group Sections/Sub-Groups">
              <Text>NEXTONE</Text>
            </AccordionItem>
            <AccordionItem title="Invites">
              <Input placeholder="Enter email addresses" />
              <Text>Use comma to separate addressed, e.g. kate@email.com, john@doe.com</Text>
              <Button block style={{ backgroundColor: PLColors.main }}>
                <Label style={{color: 'white'}}>Send</Label>
              </Button>
            </AccordionItem>
            <AccordionItem title="Reports">
              <Button block style={{ backgroundColor: PLColors.main }}>
                <Label style={{color: 'white'}}>Export Roster</Label>
              </Button>
            </AccordionItem>
          </List>
        </Content>
      </Container>
    );
  }
}

export default connect()(ManageGroup);