import React from 'react'
import { connect } from 'react-redux'
import { ScrollView, View, Text, TouchableOpacity } from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons'

import styles from './styles'

class ConferenceEvents extends React.Component {
    // USe the header bar (Back) (Title) (Change Day)
    constructor(props) {
        super(props)

        const key = Object.keys(props.schedule)[0]

        this.state = {
            selectedIndex: 0,
            selected: key,
            label: this.getDateFromKey(key)
        }
    }

    next = () => {
        const { selectedIndex } = this.state
        const { schedule } = this.props
        const keys = Object.keys(schedule)
        const length = keys.length

        var target = selectedIndex + 1
        if (target >= length) {
            target = 0
        }

        this.setState({
            selectedIndex: target,
            selected: keys[target],
            label: this.getDateFromKey(keys[target])
        })
    }

    previous = () => {
        const { selectedIndex } = this.state
        const { schedule } = this.props
        const keys = Object.keys(schedule)
        const length = keys.length

        var target = selectedIndex - 1
        if (target < 0) {
            target = length - 1
        }

        this.setState({
            selectedIndex: target,
            selected: keys[target],
            label: this.getDateFromKey(keys[target])
        })
    }

    getDateFromKey(key) {
        const year = key.substr(0, 4)
        const month = key.substr(4, 2)
        const date = key.substr(6, 2)
        return new Date(`${month}/${date}/${year}`).toDateString()
    }

    getTimeFromDate(date) {
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
        return (
            <View style={{ flex: 1 }}>
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
                    <Text>
                        {this.props.schedule[this.state.selected].map(
                            (item, index) => {
                                return (
                                    <View key={item.id} style={styles.item}>
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
                                                {this.getTimeFromDate(
                                                    item.startDate
                                                )}
                                            </Text>
                                            <Text style={styles.endsAt}>
                                                Ends:{' '}
                                                {this.getTimeFromDate(item.endDate)}
                                            </Text>
                                        </View>
                                    </View>
                                )
                            }
                        )}
                    </Text>
                </ScrollView>
            </View>
        )
    }
}

const mapStateToProps = ({ schedule }) => ({
    schedule
})

export default connect(mapStateToProps)(ConferenceEvents)
