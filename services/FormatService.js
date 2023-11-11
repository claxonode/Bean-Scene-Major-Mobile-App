export function AustralianDate(date) {
    const isoDate = new Date(date)
    const dateString = isoDate.toDateString("en-AU")
    const timeString = isoDate.toLocaleTimeString("en-AU")

    return `${dateString} ${timeString}`
}

export function ShortDate(date) {
    const isoDate = new Date(date)
    const dateString = isoDate.toLocaleDateString("en-AU",{day:'numeric',month:'numeric'})
    const timeString = isoDate.toLocaleTimeString("en-AU")

    return `${dateString} ${timeString}`
}


export function AustralianCurrency(value) {
    return new Intl.NumberFormat('en-AU',{style:'currency', currency:'AUD'}).format(value);
}