export default (promise, dataKey = 'data') => {
    return promise
        .then(data => {
            return {
                success: true,
                [dataKey]: data
            }
        })
        .catch(error => {
            return { success: false, error }
        })
}
