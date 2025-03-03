const displayCurrency = (amount) => {
    const formatedCurrency = amount.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
    })

    return formatedCurrency
}

export default displayCurrency