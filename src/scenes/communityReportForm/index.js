import React, {Component} from 'react'
import {Platform, View, StyleSheet, Image} from 'react-native'
import {
    Container, Header, Content, Button, Icon, ListItem, Text, Title,
    Left, Right, Body, Input, Spinner, Badge, H1, H2, H3, Textarea, Form, Small
} from "native-base";

// style
import commonColor from "../../configs/commonColor";

const styles = {
    headerStyle: {
        backgroundColor: commonColor.segmentBackgroundColor,
    },
    leftBtnStyle: {width: 200, height: 50, color: '#fff'},
    containerStyle: {backgroundColor: '#FEFEFEFE'},
    headerTitleStyle: {
        fontSize: 18,
        fontWeight: '500',
        color: '#EEE'
        // color: commonColor.brandPrimary
    },
    card: {
        shadowOpacity: 0.3,
        shadowRadius: 3,
        backgroundColor: '#FFF',
        margin: 16,
        padding: 8,
        shadowOffset: {
            height: 2,
            width: 2
        },
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#ffffffac',
        marginBottom: 8
    },
    categoriesContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    categoriesTitle: {
        marginBottom: 8,
        color: 'gray'
    },
    row: {flexDirection: 'row'},
    categoriesTitlecontainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 8
    },
    counter: {
        textAlign: 'right',
        color: 'gray'
    },
    small: {
        color: 'gray',
        fontSize: 12
    },
    attachmentUpload: {
        width: 45,
        height: 45,
        tintColor: 'gray'
    }
}

const categories = [
    {categorie: 'General', subCategories: ['Trash', 'Pothole', 'Graffiti', 'Lost Item', 'Abandoned Property']},
    {categorie: 'Noise', subCategories: ['Neighbor', 'Animal', 'Construction']},
    {categorie: 'Professional', subCategories: ['Inappropriate Conduct', 'Abuse of Authority']},
    {categorie: 'Safety Hazards', subCategories: ['Flooding', 'Downed Tree', 'Downed Electrical Lines', 'Rabid Animal']}
]

class CommunityReportForm extends Component {
    state = {
        text: ''
    }
    renderCategories () {
        const chosenCategories = ['Flooding', 'Trash', 'Neighbor']
        const colors = [
             '#007bff', // primary:
             '#6c757d', // secondary:
             '#28a745', // success:
             '#dc3545', // danger:
             '#ffc107', // warning:
             '#17a2b8' // info:
        ]
        const color = index => [{primary: 1}, {danger: 1}, {secondary: 1}, {success: 1}][index % 4]
        return chosenCategories.map((category, index) => <Badge key={index} style={{marginHorizontal: 3, backgroundColor: colors[index % 6]}}>
            <Text>{category}</Text>
        </Badge>)
    }

    onChangeText = (text) => this.setState({text})

    render () {
        const {small, attachmentUpload, counter, card, categoriesTitlecontainer, row, categoriesTitle, categoriesContainer, categoriesButton, centerContainer, rightContainer, leftContainer, headerStyle, leftBtnStyle, containerStyle, headerTitleStyle} = styles
        return (
            <Container style={containerStyle}>
                <Header androidStatusBarColor={commonColor.statusBarLight}
                        iosBarStyle="dark-content" style={headerStyle}>
                    <Left>
                        <Button transparent onPress={this.onBack} style={leftBtnStyle}>
                        <Icon active name="arrow-back" style={{ color: "#EEE" }} />
                        </Button>
                    </Left>
                    <Body>
                        <Title style={headerTitleStyle}> Community </Title>
                    </Body>
                    <Right>
                        <View />
                    </Right>
                </Header>
                <Content>
                    <View style={card}>
                        <View style={categoriesTitlecontainer}>
                            <H3 style={categoriesTitle}>Categories</H3>
                            <Icon name='menu' />
                        </View>
                        <View style={categoriesContainer}>
                            {this.renderCategories()}
                        </View>
                    </View>
                    <View style={card}>
                        <H3 style={categoriesTitle}>Observation</H3>
                        <Form>
                            <Textarea rowSpan={6} onChangeText={this.onChangeText} placeholder="Leave a note... this is a placeholder..." />
                        </Form>
                        <Text style={counter}>{this.state.text.length}/2500</Text>
                    </View>
                    <View style={card}>
                        <H3 style={categoriesTitle}>Attachments</H3>
                        <Text style={small}>Leave some images or videos here...</Text>
                        <View style={{width: '100%', flexDirection: 'row', justifyContent: 'flex-start'}}>
                            <Button transparent style={{ marginTop: 8, height: 45, backgroundColor: '#efefef', width: 60, borderRadius: 8, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.attachImage()}>
                                <Icon name='md-add-circle' style={{color: commonColor.segmentBackgroundColor, fontSize: 28}} />
                            </Button>
                        </View>
                    </View>
                </Content>
                <View style={{padding: 16}}>
                    <Button style={{width: '100%', justifyContent: 'center', backgroundColor: commonColor.segmentBackgroundColor}}>
                        <H3 style={{color: '#FEFEFE'}}>
                            Publish
                        </H3>
                    </Button>
                </View>

            </Container>
        )
    }
}

export default CommunityReportForm;