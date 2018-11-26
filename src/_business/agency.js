import _ from 'lodash'
import { AsyncStorage } from 'react-native'
import { redux, privateAPI } from 'powerline/instances'
import { to } from 'powerline/utils'
import { ImageCacheManager } from 'react-native-cached-image'
imageCache = ImageCacheManager()

export const fetch = async (waitCache = true) => {
    const updateStore = agency => {
        redux.store.dispatch({
            type: 'SET_AGENCY_STATE',
            payload: agency
        })
    }

    const cacheItems = async agency => {
        if (Object.keys(agency).length > 0) {
            await imageCache.downloadAndCacheUrl(agency.banner)
            await imageCache.downloadAndCacheUrl(agency.splashScreen)
            const onboarding = agency.onboardingScreens || []

            onboarding.forEach(async screen => {
                await imageCache.downloadAndCacheUrl(screen.image)
            })
        }
        return true
    }

    // AsyncStorage.removeItem('@app:cache:state:agency')

    var agency = await AsyncStorage.getItem('@app:cache:state:agency')
    if (agency && Object.keys(agency).length > 0) {
        agency = JSON.parse(agency)
        if (waitCache) cacheItems(agency)
        updateStore(agency)
        return { success: true, agency }
    }

    const result = await to(privateAPI.get('/v2.2/user/agency'), 'agency')
    if (!result.success) return result

    agency = result.agency

    if (waitCache) await cacheItems(agency)
    updateStore(agency)

    AsyncStorage.setItem('@app:cache:state:agency', JSON.stringify(agency))

    return result
}
