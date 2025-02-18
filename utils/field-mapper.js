/**
 * Transforms api formatted fields to db formatted fields. 
 * @param {*} apiData 
 * @param {*} fieldMappings 
 * @returns 
 */
const transformToDBFields = (apiData, fieldMappings) => {
    const dbData = {}
    for (const [apiField, value] of Object.entries(apiData)) {
        if (apiField in fieldMappings) {
            dbData[fieldMappings[apiField]] = value
        } else {
            dbData[apiField] = value
        }
    }
    return dbData
}

/**
 * Transforms db formatted fields to api formatted fields.
 * @param {*} dbData 
 * @param {*} fieldMappings 
 * @returns 
 */
const transformToAPIFields = (dbData, fieldMappings) => {
    const apiData = {}
    fieldMappings = reverseMappings(fieldMappings)
    for (const [dbField, value] of Object.entries(dbData)) {
        if (dbField in fieldMappings) {
            apiData[fieldMappings[dbField]] = value
        } else {
            apiData[dbField] = value
        }
    }
    return apiData
}

/**
 * Reverses the mapping of an object passed in. Key - Value becomes Value - Key
 * @param {*} origMapping 
 * @returns 
 */
const reverseMappings = (origMapping) => {
    const reversedMapping = {}
    for (const [key, value] of Object.entries(origMapping)) {
        reversedMapping[value] = key
    }
    return reversedMapping
}

module.exports = { transformToAPIFields, transformToDBFields }