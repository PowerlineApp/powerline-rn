import React, {Component} from 'react';
import { View, Clipboard } from 'react-native';
import { connect } from 'react-redux';
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
    Text,
    Card
} from 'native-base';
import Fields from './fields';
import PLColors from 'PLColors';
import { updateUserProfile } from 'PLActions';
import {showToast} from 'PLToast';
class MyInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            first_name: props.profile.first_name,
            last_name: props.profile.last_name,
            bio: props.profile.bio,
            zip: props.profile.zip,
            address1: props.profile.address1,
            address2: props.profile.address2,
            city: props.profile.city,
            state: props.profile.state,
            email: props.profile.email,
            phone: props.profile.phone,
            birth: props.profile.birth,
            sex: props.profile.sex,
            race: props.profile.race,
            marital_status: props.profile.marital_status,
            employment_status: props.profile.employment_status,
            philosophy: props.profile.philosophy,
            
        };
        this.updateProperty = this.updateProperty.bind(this);
    }


    updateProperty (key, value) {
        let data = {};
        this.setState(state => {
            state[key] = value;
            return state;
        });

        data[key] = value;
        updateUserProfile(this.props.token, data)
            .then(response => console.log(response))
            .catch(err => console.log(err));
    }

    render() {
        return (
            <Content>
                <Card>
                    <List>
                        <View style={{padding: 20}}>
                            <Label>Account Details</Label>
                        </View>
                        <ListItem>
                            <View style={{paddingHorizontal: 10, flexDirection: 'row'}}>
                                <Icon name='contact' color={PLColors.main} style={{marginRight: 10}} />
                                <Text style={{color: 'grey'}}>First Name:</Text>
                            </View>
                            <Text>{this.state.first_name}</Text>
                        </ListItem>
                        <ListItem>
                            <View style={{paddingHorizontal: 10, flexDirection: 'row'}}>
                                <Icon name='contact' color={PLColors.main} style={{marginRight: 10}} />
                                <Text style={{color: 'grey'}}>Last Name:</Text>
                            </View>
                            <Text>{this.state.last_name}</Text>
                        </ListItem>
                        <ListItem>
                            <View style={{paddingHorizontal: 10, flexDirection: 'row'}}>
                                <Icon name='contact' color={PLColors.main} style={{marginRight: 10}} />
                                <Text style={{color: 'grey'}}>Username:</Text>
                            </View>
                            <Text>{this.props.profile.username}</Text>
                        </ListItem>
                        <ListItem onPress={() => {Clipboard.setString(this.props.referal_code); showToast('Referral code copied to Clipboard.');}}>
                            <View style={{paddingHorizontal: 10, flexDirection: 'row'}}>
                                <Icon name='contact' color={PLColors.main} style={{marginRight: 10}} />
                                <Text style={{color: 'grey'}}>My Referral Code:</Text>
                            </View>
                            <Text>{this.props.referal_code}</Text>
                        </ListItem>
                        <View style={{padding: 20}}>
                            <Label>Interests</Label>
                        </View>
                        <Fields value={this.state.bio} label='Bio' onSave={(value) => this.updateProperty('bio', value)} />
                        <Fields value={this.state.interests} label='interests:' onSave={(value) =>  this.updateProperty('interests', value)} />
                        <View style={{padding: 20}}>
                            <Label>Contact Information</Label>
                        </View>
                        <Fields value={this.state.address1} label='Street Address:' onSave={(value) =>  this.updateProperty('address1', value)} />
                        <Fields value={this.state.address2} label='Apt / Suite:' onSave={(value) =>  this.updateProperty('address2', value)} />
                        <Fields value={this.state.zip} label='Zip Code:' onSave={(value) =>  this.updateProperty('zip', value)} />
                        <Fields value={this.state.city} label='City:' onSave={(value) =>  this.updateProperty('city', value)} />
                        <Fields value={this.state.state} label='State:' onSave={(value) =>  this.updateProperty('state', value)} />
                        <Fields value={this.state.country} label='Country:' onSave={(value) =>  this.updateProperty('country', value)} />
                        <Fields value={this.state.email} label='Email:' onSave={(value) =>  this.updateProperty('email', value)} />
                        {/* <Fields value={this.state.phone} label='Phone:' onSave={(value) =>  this.updateProperty('phone', value)} /> */}
                        <ListItem>
                            <View style={{paddingHorizontal: 10, flexDirection: 'row'}}>
                                <Icon name='contact' color={PLColors.main} style={{marginRight: 10}} />
                                <Text style={{color: 'grey'}}>Phone:</Text>
                            </View>
                            <Text>{this.state.phone}</Text>
                        </ListItem>
                        <View style={{padding: 20}}>
                            <Label>Personal Information</Label>
                        </View>
                        <Fields date value={this.state.birth} label='Date of Birth:' onSave={(value) =>  this.updateProperty('birth', value)} />
                        <Fields value={this.state.sex} label='Sex:' onSave={(value) =>  this.updateProperty('sex', value)} />
                        <Fields value={this.state.race} label='Race:' onSave={(value) =>  this.updateProperty('race', value)} />
                        <Fields value={this.state.marital_status} label='Marital Status:' onSave={(value) =>  this.updateProperty('marital_status', value)} />
                        <View style={{padding: 20}}>
                            <Label>Employment and Education</Label>
                        </View>
                        <Fields value={this.state.employment_status} label='Employment Status:' onSave={(value) =>  this.updateProperty('employment_status', value)} />
                        <View style={{padding: 20}}>
                            <Label>Politics</Label>
                        </View>
                        <Fields value={this.state.philosophy} label='Philosophy:' onSave={(value) =>  this.updateProperty('philosophy', value)} />
                        <Fields value={this.state.party} label='Party:' onSave={(value) =>  this.updateProperty('party', value)} />
                        <Fields value={this.state.donor} label='Donor:' onSave={(value) =>  this.updateProperty('donor', value)} />
                        <View style={{padding: 20}}>
                            <Text style={{fontSize: 10, color: 'grey'}}>All information collected here is used for anonymous, aggregate reporting purposes. You will be informed before joining any group that wants access any of this information.</Text>
                        </View>
                    </List>
                </Card>
            </Content>
        );
    }
}

const mapState = (state) => ({
    profile: state.user.profile
});

export default connect(mapState)(MyInfo);