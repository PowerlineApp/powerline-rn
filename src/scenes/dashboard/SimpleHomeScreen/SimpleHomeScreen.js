import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { CachedImage } from 'react-native-img-cache'
import {
    Platform,
    ScrollView,
    Alert,
    Linking,
    View,
    Text,
    TouchableOpacity,
    TextInput
} from 'react-native'
import { Actions } from 'react-native-router-flux'
import Ionicon from 'react-native-vector-icons/Ionicons'

import {
  fetchConferences,
  listServices,
} from "PLActions";

import styles from './styles'
const  homeNavigator = require('./navigator');

class SimpleHomeScreen extends React.Component {
    constructor(props) {
      super(props)
     
      this.state = {
        items: [
          {
              label: 'Home',
              icon: 'md-home',
              onPress: this.gotoFeed
          },
          {
              label: 'Schedule',
              icon: 'md-calendar',
              onPress: this.gotoSchedule
          },
          {
              label: 'Attendees',
              icon: 'md-contacts',
              onPress: this.gotoAttendees
          },
          {
              label: 'Feed',
              icon: 'md-star',
              onPress: () => this.gotoFeed(false)
          },
          {
              label: 'New Post',
              icon: 'md-add',
              onPress: this.gotoCreatePost
          },
          {
              label: 'My Reps',
              icon: 'md-book',
              onPress: this.gotoRepresentatives
          }
        ],
        conferences: [],
        conciergeServices: [],
      };
    }

    componentDidMount() {
      const { token } = this.props;
      this.props.fetchConferences(token).then(data => {
      });
      this.props.listServices(token).then(data => {
      });
    }

    componentWillReceiveProps(nextProps) {
      console.log('conferences---', this.state.conferences);
      console.log('nextConferences----', nextProps);
      if (nextProps.conferences && this.state.conferences.length === 0) {
        if (nextProps.conciergeServices && this.state.conciergeServices.length === 0) {
          if (Object.values(nextProps.conciergeServices.data).length > 0) {
            this.state.items.push({
                label: 'Services',
                icon: 'ios-link',
                onPress: () => this.gotoServices()
             })
            this.setState({ conciergeServices: nextProps.conciergeServices.data });

            
          }
        }
        if (Object.values(nextProps.conferences.data).length > 0) {
          this.setState({ conferences: nextProps.conferences.data });
          const conference = nextProps.conferences.data[0];
          this.setState({ conference });
          if (conference && conference.links) {
              conference.links.forEach(link => {
                const url = Platform.OS === 'android' ? link.androidUrl : link.iosUrl;
                this.state.items.push({
                  label: link.label,
                  onPress: () => {
                    if(url) {
                      Linking.openURL(url);
                    } else {
                      Alert.alert("Error", "The url is invalid");
                    }
                  },  
                  icon: 'ios-link'
                })
              })
          }
        }
      }
    }

    gotoSchedule = () => {
      const { conference } = this.state;
      if(conference) {
        homeNavigator.instance.goTo('conferenceEvents', {
          title: 'Events',
          back: true,
        })
      }
    }

    gotoAttendees = () => {
      const { conference } = this.state;
      if(conference) {
        homeNavigator.instance.goTo(
            'conferenceAttendees',
            {
                title: 'Attendees',
                back: true,
                id: conference.id
            }
        )
      }
    }

    gotoCalendar = () => {}

    gotoProfile = () => {
        homeNavigator.instance.goTo('profile', {
            title: 'My Profile',
            back: true
        })
    }

    gotoFeed = (home = true) => {
      if (!home) {
        if (this.state.conference) {
          this.props.dispatch({
            type: 'NEWSFEED_STATE',
            payload: { activeGroup: this.state.conference.groupId }
          })
        }
      } else {
        this.props.dispatch({
            type: 'NEWSFEED_STATE',
            payload: { activeGroup: 'all' }
        })
      }

      homeNavigator.instance.goTo('originalHome', {
          content: (
              <TextInput
                  style={{ flex: 1, color: 'white' }}
                  onChangeText={this.onSearchQueryChanged}
                  placeholder="Search groups, people, topics"
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
              />
          ),
          back: true
      });
    }

    gotoRepresentatives = () => {
      homeNavigator.instance.goTo('representatives', {
        title: 'Representatives',
        back: true
      })
    }

    gotoServices = () => {
      homeNavigator.instance.goTo('services', {
        title: 'Services',
        back: true
      })
    }

    gotoCreatePost = () => {
      // this.gotoFeed(false)
      setTimeout(() => {
          homeNavigator.instance.goTo(
              'newpost',
              {
                  title: `New post`,
                  back: true
              },
              {
                  _selectedGroup: this.state.conference.groupId,
                  scope: {
                      group: true,
                      type: 'post'
                  }
              }
          )
      }, 1000)
    }

    requestServices = () => {
      if(this.props.conciergeServices) {
        let services = Object.values(this.props.conciergeServices)
        if (services.length === 0) {
            return Alert.alert(
                'Not available',
                'There are no services available for this group.'
            )
        }

        let labels = services.map((service, index) => service.message)

        this.props.dispatch({
            type: 'SET_ACTIONSHEET_STATE',
            payload: {
                isVisible: true,
                title: 'Select one...',
                options: labels.concat('Cancel'),
                cancelButtonIndex: labels.length,
                onPress: async index => {
                    if (index == null) return
                    let service = services[index]

                    this.props.dispatch({
                        type: 'ACTIONSHEET_STATE',
                        payload: { isVisible: false }
                    })

                    let result = await require('./').services.request(
                        service.id
                    )
                    if (result.success) {
                        return Alert.alert(
                            'Thanks!',
                            'Your service request has been received and we will take care of it as soon as possible.'
                        )
                    } else {
                        if (result.error.error.request.status === 400) {
                            return Alert.alert(
                                'Info',
                                'You can only request a service once every ten minutes.'
                            )
                        } else {
                            return Alert.alert(
                                'Uh oh..',
                                'An unexpected error has occured, please try again later.'
                            )
                        }
                    }
                }
            }
        })
      } 
    }

    render() {
      return (
        <ScrollView style={styles.container}>
          {this.state.conference && this.state.conference.image && (
              <CachedImage
                  source={{ uri: this.state.conference.image }}
                  style={styles.header}
              />
          )}

          <View style={styles.wrapper}>
            {this.state.items.map((item, index) => {
                return (
                    <TouchableOpacity
                        style={styles.item}
                        index={item.label}
                        onPress={item.onPress}>
                        <View style={styles.iconContainer}>
                            <Ionicon
                                name={item.icon}
                                size={32}
                                color="white"
                            />
                        </View>
                        <Text style={styles.label}>{item.label}</Text>
                    </TouchableOpacity>
                )
            })}
          </View>
        </ScrollView>
      )
    }
}

function bindAction(dispatch) {
  return {
    openDrawer: () => {
      Keyboard.dismiss();
      dispatch(openDrawer());
    },
    loadUserGroups: token => dispatch(loadUserGroups(token)),
    dispatch: a => dispatch(a),
    setGroup: (data, token, id) => dispatch(setGroup(data, token, id)),
    fetchConferences: token => dispatch(fetchConferences(token)),
    listServices: token => dispatch(listServices(token)),
  };
}

const mapStateToProps = state => ({
    token: state.user.token,
    conferences: state.conferences,
    conciergeServices: state.conciergeServices
});

export default connect(mapStateToProps, bindAction)(SimpleHomeScreen)
