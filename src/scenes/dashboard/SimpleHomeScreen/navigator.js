import _ from 'lodash'
import { Actions } from 'react-native-router-flux'
//import { redux } from 'powerline/instances'
import { Keyboard } from 'react-native'

class Navigator {
    constructor() {
        this.navigationStack = []
    }

    setState = state => {
        var navOptions = _.merge(
            {},
            {
                rightItem: null,
                leftItem: null,
                onBack: null,
                back: null,
                content: null,
                title: null,
                addonComponent: null
            },
            state
        )

        this.navigationStack.push(navOptions)
        // redux.store.dispatch({
        //     type: 'NAVIGATIONBAR_STATE',
        //     payload: navOptions
        // })
    }

    getConfig = () => {
        return this.navigationStack[this.navigationStack.length - 1]
    }

    replaceConfig = config => {
        let current = this.getConfig()
        const a = (navOptions = _.merge(
            {},
            {
                key: current.key,
                rightItem: null,
                leftItem: null,
                onBack: null,
                back: null,
                content: null,
                title: null,
                addonComponent: null
            },
            config
        ))

        if (a.back && !a.onBack) {
            a.onBack = this.pop
        }

        this.navigationStack[this.navigationStack.length - 1] = a
        // redux.store.dispatch({
        //     type: 'SET_NAVIGATIONBAR_STATE',
        //     payload: a
        // })
    }

    goTo = (key, navOptions, props = {}) => {
        // Check if the previous scene was the next scene, if so..
        // Then we should pop!

        // Check if the scene is the current scene,
        // if so..  Do nadda.

        const isActive = key =>
            Actions.currentScene === key || Actions.currentScene === `_${key}`

        if (isActive(key)) return console.warn('Not going anywhere, already there.')

        const page = Actions[key]
        if (!page) throw new Error('There is not a navigation route for key:', key)

        navOptions = _.merge(
            {},
            {
                key,
                rightItem: null,
                leftItem: null,
                onBack: null,
                back: null,
                content: null,
                title: null,
                addonComponent: null
            },
            navOptions
        )

        if (navOptions.back && !navOptions.onBack) {
            navOptions.onBack = this.pop
        }

        this.navigationStack.push(navOptions)

        Keyboard.dismiss()
        page(props)
        // redux.store.dispatch({
        //     type: 'SET_NAVIGATIONBAR_STATE',
        //     payload: navOptions
        // })
    }

    pop = () => {
        const options = this.navigationStack[this.navigationStack.length - 2]
        this.navigationStack.push(options)
        Keyboard.dismiss()
        Actions.pop()
        // redux.store.dispatch({
        //     type: 'SET_NAVIGATIONBAR_STATE',
        //     payload: options
        // })
    }
}

export const instance = new Navigator()
