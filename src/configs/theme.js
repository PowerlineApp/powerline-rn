import ScaleSheet from 'react-native-scalesheet'

const main = '#020860'
const secondary = '#61C1FF'
const background = '#E2E7EA'
const purple = 'rgb(109,122,216)'
const rootTabBarHeight = 64
const navBarHeight = 56

const hexToRgb = hex => {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b
    })

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
        ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16)
          }
        : null
}

export default {
    main,
    secondary,
    background,
    purple,
    rootTabBarHeight,
    navBarHeight,
    alpha: (hex, opacity) => {
        const rgb = hexToRgb(hex)
        if (!rgb) return hex
        return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`
    },
    pageContainer: ScaleSheet.create({
        flex: 1,
        backgroundColor: background,
        marginBottom: rootTabBarHeight
    })
}
