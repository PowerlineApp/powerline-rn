import { AsyncStorage } from 'react-native'
import { redux, publicAPI, privateAPI } from 'powerline/instances'
import { to } from 'powerline/utils'
import {
    LoginManager,
    AccessToken,
    GraphRequest,
    GraphRequestManager
} from 'react-native-fbsdk'
import { ImageCacheManager } from 'react-native-cached-image'
imageCache = ImageCacheManager()

// Requires phone authentication.
export const signInWithEmailAndPassword = async (
    username,
    password,
    code = null
) => {
    // Errors out if account does not exist.
    // await publicAPI.get('/users', { username })
    // const user = await privateAPI.get('/v2/security/login', {
    //     username,
    //     password
    // })

    const result = await to(publicAPI.get('/users', { username }))
    if (!result.success) {
        switch (result.error.error.request.status) {
            case 400: // Not sure what this means...
                return { success: false, error: 'Unknown' }
            case 404:
                return { success: false, type: 'username', error: 'NOT_EXISTS' }
        }
        return result
    }

    const authResult = await to(
        privateAPI.post(
            '/v2/security/login',
            {
                username,
                password,
                code
            },
            false
        )
    )

    return authResult
}

export const validateSignIn = async (username, code) => {
    return await to(privateAPI.post('/v2/security/login', { username, code }, false))
}

export const getTwilioCode = async phone => {
    return await to(publicAPI.post('/phone/verification', { phone }))
}

export const signUpWithEmailAndPassword = async ({
    username,
    password,
    firstName,
    lastName,
    email,
    country,
    zip,
    phone,
    code,
    agency
}) => {
    const result = await to(
        privateAPI.post(
            '/v2/security/registration',
            {
                firstName,
                lastName,
                email,
                username,
                password,
                country,
                zip,
                phone,
                code,
                agency
            },
            false
        )
    )

    console.warn('RESULT:', JSON.stringify(result, null, 4))
    redux.store.dispatch({
        type: 'API_STATE',
        payload: { token: result.data.token }
    })

    AsyncStorage.setItem('@auth:token', result.data.token)

    return result
}

export const signUpWithFacebook = async ({
    username,
    firstName,
    lastName,
    email,
    country,
    zip,
    agency
}) => {
    const accessToken = await AccessToken.getCurrentAccessToken()

    const result = await to(
        privateAPI.post(
            '/secure/registration-facebook',
            {
                firstName,
                lastName,
                email,
                emailConfirm: email,
                username,
                country,
                zip,
                agency,
                facebook_id: accessToken.userID,
                facebook_token: accessToken.accessToken
            },
            false
        )
    )

    redux.store.dispatch({
        type: 'API_STATE',
        payload: { token: result.data.token }
    })

    AsyncStorage.setItem('@auth:token', result.data.token)

    return result
}

export const signInWithFacebook = async () => {
    const scope = 'public_profile,email,user_friends'
    const permissions = scope.split(',')

    LoginManager.logOut()
    const loginResult = await LoginManager.logInWithReadPermissions(permissions)
    if (loginResult.isCancelled) return console.error('Cancelled')

    const accessToken = await AccessToken.getCurrentAccessToken()

    let result = await to(
        privateAPI.post('/secure/facebook/login', {
            facebookId: accessToken.userID,
            facebookToken: accessToken.accessToken
        }),
        'authData'
    )

    if (!result.success) {
        if (result.error.error.request.status === 302) {
            // Get firebase data
            const axios = require('axios')
            return axios
                .get(
                    `https://graph.facebook.com/v3.1/me?fields=email,name,first_name,last_name&access_token=${
                        accessToken.accessToken
                    }`
                )
                .then(async response => {
                    await AsyncStorage.removeItem('@auth:token')
                    const { data } = response

                    return {
                        success: false,
                        type: 'facebook',
                        data,
                        error: 'NOT_EXISTS'
                    }
                })
                .catch(err => {
                    return { success: false, error: err.message || err.toString() }
                })
        }
        return result
    }

    const { authData } = result

    // User account exists
    if (authData.token) {
        redux.store.dispatch({
            type: 'API_STATE',
            payload: { token: authData.token }
        })

        AsyncStorage.setItem('@auth:token', authData.token)

        let result = await to(automatedSignIn())
        return result
    } else {
        // TODO: Registration Facebook
        await AsyncStorage.removeItem('@auth:token')
        return { success: false, error: 'NOT_EXISTS' }
    }
}

const wait = time =>
    new Promise(resolve => {
        setTimeout(() => resolve(), time)
    })

export const automatedSignIn = async () => {
    const token = await AsyncStorage.getItem('@auth:token')
    if (!token) return { success: false, error: 'Token does not exist' }

    redux.store.dispatch({
        type: 'API_STATE',
        payload: { token }
    })

    var user = require('./user')
    var newsFeed = require('./newsFeed')
    var userGroups = require('./userGroups')
    var conferences = require('./conferences')
    var notifications = require('./notifications')
    var influences = require('./userInfluences')
    var agency = require('./agency')
    var services = require('./services')

    let userResult = await user.fetch().catch(e => {})
    if (userResult.error) return userResult

    let groupsResult = await userGroups.fetch()
    if (!groupsResult.success) return groupsResult

    let feedResult = await newsFeed.fetch()
    if (!feedResult.success) return feedResult

    let conferencesResult = await conferences.fetch()
    const inConference = Object.values(conferencesResult.conferences).length !== 0

    if (inConference) {
        let servicesResult = await services.fetch()
        if (!servicesResult) return servicesResult
    }

    await agency.fetch().catch(e => {
        console.error('err:', e.message)
    })

    // START: non-blocking requests

    // Load all of the newsFeeds for the standard groups (City, State, Country)
    const { local, state, country } = groupsResult.groups

    // Ignore errors for the following requests, because it doesn't matter if they
    // succeed or not, as we will request them again if the user navigates to the
    // appropriate screen. This is just to speed up the feel of the application.

    user.fetchRepresentatives().catch(e => {})

    newsFeed.fetch(local.id, 'local').catch(e => {})

    newsFeed.fetch(state.id, 'state').catch(e => {})

    newsFeed.fetch(country.id, 'country').catch(e => {})

    newsFeed.fetch('personal', 'personal').catch(e => {})

    notifications.fetch().catch(e => {})
    influences.fetchFollowings().catch(e => {})
    influences.fetchFollowers().catch(e => {})
    user.fetchPrivacySettings().catch(e => {})
    user.fetchBlocked().catch(e => {})

    // Download Conference Pictures..
    if (conferencesResult.conferences) {
        Object.values(conferencesResult.conferences).forEach(conference => {
            if (conference.image) {
                imageCache.downloadAndCacheUrl(conference.image)
            }
        })
    }

    // END: non-blocking requests
    let initialScreen = 'rootTabs'

    if (Object.values(conferencesResult.conferences).length > 0) {
        initialScreen = 'simpleHomeScreen'
    }

    console.warn('Initial:', initialScreen)

    return { success: true, initialScreen }
}

export const signOut = async () => {
    await AsyncStorage.removeItem('@auth:token')
    await AsyncStorage.removeItem(`@app:cache:state:attendees`)
    await AsyncStorage.removeItem(`@app:cache:state:events`)
    await AsyncStorage.removeItem('@app:cache:state:agency')
    const { Actions } = require('react-native-router-flux')
    Actions.reset('authSelection')
}
