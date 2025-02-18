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

const reverseMappings = (origMapping) => {
    const reversedMapping = {}
    for (const [key, value] of Object.entries(origMapping)) {
        reversedMapping[value] = key
    }
    return reversedMapping
}

module.exports = { transformToAPIFields, transformToDBFields }