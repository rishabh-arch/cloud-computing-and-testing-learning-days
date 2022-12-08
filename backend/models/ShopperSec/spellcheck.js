var axios = require("axios").default;


 

module.exports=(word,cb)=>{
    
var options = {
    method: 'POST',
    url: 'https://jspell-checker.p.rapidapi.com/check',
    headers: {
      'content-type': 'application/json',
      'x-rapidapi-key': '2e300bcd8emsh99d38f4070913fap198a3cjsnb376f3f10790',
      'x-rapidapi-host': 'jspell-checker.p.rapidapi.com'
    },
    data: {
      language: 'enUS',
      fieldvalues: word,
      config: {
        forceUpperCase: false,
        ignoreIrregularCaps: false,
        ignoreFirstCaps: true,
        ignoreNumbers: true,
        ignoreUpper: false,
        ignoreDouble: false,
        ignoreWordsWithNumbers: true
      }
    }
  };
    axios.request(options).then(function (response) {
	cb(response.data.elements[0].errors);
}).catch(function (error) {
	cb(error);
});
}