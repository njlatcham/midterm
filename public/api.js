module.exports = function apiCategoryDecider(strInput){

  const WolframAlphaAPI = require('wolfram-alpha-api');
  const waApi = WolframAlphaAPI('ULL5QV-HEQ3H8K997');
  const request = require('request');
  let searchStr =  'https://opentable.herokuapp.com/api/restaurants?city=Toronto&per_page=25&name=' + process.argv[2];

  const resultsObj = {};

  const keywordObj = {
    book       : ["word", "book", "text"],
    movie      : ["movie", "academyaward"]
  };


  request(searchStr, function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body); // Print the HTML for the Google homepage.
  });



  const wolframAPICall = (strInput) => {
    return waApi
    .getFull({
      input: strInput,
      format: 'plaintext',
    })
    .then((queryresult) => queryresult) //return queryresult
    .catch((err) => {
      console.error(err);
      return {}
    })
  };

  const compareWordCounter = (compareWord, queryresult) => {
    let intMatches = JSON.stringify(queryresult).replace(/\s/g, '').toLowerCase().split(compareWord.toLowerCase()).length - 1;
    return intMatches;
  };

  async function initialize(){

    for (let i of strArray){
      strInput = strInput + i;

      for (keywordCategory in keywordObj){

        if (!resultsObj[keywordCategory]) {
          resultsObj[keywordCategory] = 0;
        }

        for (let j of keywordObj[keywordCategory]){
          try {
            const compareWord = j;
            const apiResults = await wolframAPICall(strInput);
            const matchCount = compareWordCounter(compareWord, apiResults);
            resultsObj[keywordCategory] += matchCount;
          }
          catch (err){
            console.error(err);
          }
        }
      }
    };
  };

  const verdictMaker = (resultsObj) => {
      let tempValue = 0;
      let verdict = "";

      for (category in resultsObj){

        if (tempValue < resultsObj[category]){
          verdict = category;
          tempValue = resultsObj[category];
        }
      }
      return verdict
    }

  };
  initialize();
  return verdictMaker(resultsObj);

  // return resultsObj;
