export default AustralianCurrency = (value) => new Intl.NumberFormat('en-AU',{style:'currency', currency:'AUD'}).format(value);


