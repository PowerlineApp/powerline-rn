import React from 'react'
import { connect } from 'react-redux'
import { ScrollView, View, TouchableOpacity, Platform } from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons'
import {
  fetchEvents
} from "PLActions";
import {
    Container,
    Header,
    Content,
    Button,
    Icon,
    ListItem,
    Text,
    Title,
    Left,
    Right,
    Body,
    Input,
    Spinner
} from "native-base";
import commonColor from "../../../configs/commonColor";

import styles from './styles'

class ConferenceEvents extends React.Component {
    // USe the header bar (Back) (Title) (Change Day)
    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: 0,
            data: [],
            loading: true
        }
    }

    componentDidMount() {
      const { token, conferences } = this.props;

      if(conferences && conferences.data.length > 0) {
          this.props.fetchEvents(token, conferences.data[0].id).then(({data}) => {
            console.log('data-----', data);
            this.setState({data: Object.keys(data).map(key => ([...data[key]])), loading: false})
          });
      }
    }

    componentWillReceiveProps(nextProps) {
    //   console.log("componentWillReceiveProps at conferenceevents", nextProps);
    //   if (nextProps.conferences && nextProps.schedule !== this.state.schedule) {
    //     const key = Object.keys(nextProps.schedule)[0]

    //     this.setState({
    //         selected: key,
    //         label: this.getDateFromKey(key)
    //     });
    //   }
    }

    onBack = () => {
        this.props.navigation.goBack();
      };

    next = () => {
        const { selectedIndex, data, loading } = this.state
        if (loading) return
        if (selectedIndex === data.length - 1) return
        this.setState(p => ({selectedIndex: (p.selectedIndex + 1) % data.length}))
    }

    previous = () => {
        const { selectedIndex, data, loading } = this.state
        if (loading) return
        if (selectedIndex === 0) return
        this.setState(p => ({selectedIndex: (p.selectedIndex - 1)}))
    }

    getDateFromKey(key) {
        const year = key.substr(0, 4)
        const month = key.substr(4, 2)
        const date = key.substr(6, 2)
        return new Date(`${month}/${date}/${year}`).toDateString()
    }

    getTimeFromDate(date) {
        if (!date) return ''
        var time = date.substr(11)
        time = time.substr(0, 5)
        var parts = time.split(':')
        var hours = parts[0]
        var minutes = parts[1]
        var pm = false
        if (Number(hours) > 12) {
            hours = hours - 12
            pm = true
        }

        if (Number(hours) === 12) {
            pm = true
        }

        return `${hours}:${minutes} ${pm ? 'PM' : 'AM'}`
    }

    render() {
        console.log(this.state, !this.state.loading && this.state.data && this.state.data[this.state.selectedIndex])
        return (
            <Container style={{ backgroundColor: "#fff" }}>
                <Header
                    androidStatusBarColor={commonColor.statusBarLight}
                    iosBarStyle="dark-content"
                    style={Platform.OS === "ios" ? styles.iosHeader : styles.aHeader}
                >
                    <Left>
                    <Button
                        transparent
                        onPress={() => this.onBack()}
                        style={{ width: 200, height: 50 }}
                    >
                        <Icon active name="arrow-back" style={{ color: "#6A6AD5" }} />
                    </Button>
                    </Left>
                    <Body>
                    <Title
                        style={
                        Platform.OS === "ios"
                            ? styles.iosHeaderTitle
                            : styles.aHeaderTitle
                        }
                    >
                        Events
                    </Title>
                    </Body>
                    <Right>
                    
                    </Right>
                </Header>
                <View style={styles.header}>
                    <TouchableOpacity onPress={this.previous}>
                        <Text style={styles.btnLabel}>Previous</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerLabel}>{this.state.label}</Text>
                    <TouchableOpacity onPress={this.next}>
                        <Text style={styles.btnLabel}>Next</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView style={styles.container}>
                    {!this.state.loading && this.state.data && this.state.data[this.state.selectedIndex].map(
                        (item, index) => {
                            return (
                                <View key={index} key={item.id} style={styles.item}>
                                    <Text style={styles.title}>{item.name}</Text>
                                    <Text style={styles.location}>
                                        {item.location}
                                    </Text>
                                    <Text style={styles.label}>
                                        {item.label}
                                    </Text>
                                    <View style={styles.times}>
                                        <Text style={styles.startsAt}>
                                            Starts:{' '}
                                            {this.getTimeFromDate(item.start_date)}
                                        </Text>
                                        <Text style={styles.endsAt}>
                                            Ends:{' '}
                                            {this.getTimeFromDate(item.end_date)}
                                        </Text>
                                    </View>
                                </View>
                            )
                        }
                    )}
                </ScrollView>
            </Container>
        )
    }
}

function bindAction(dispatch) {
  return {
    fetchEvents: (token, id) => dispatch(fetchEvents(token, id)),
  };
}

const mapStateToProps = state => ({
    conferences: state.conferences,
    token: state.user.token,
    schedule: state.schedule,
})

export default connect(mapStateToProps, bindAction)(ConferenceEvents)
