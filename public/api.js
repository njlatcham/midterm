module.exports = function apiCategoryDecider(taskStr){

  const WolframAlphaAPI = require('wolfram-alpha-api');
  const waApi = WolframAlphaAPI('ULL5QV-HEQ3H8K997');

  const strArray = [" "];//[" Book", " Movie", " Restaurant"];

  const resultsObj = {};

  const keywordObj = {
    book       : ["word"],//, "text", "book", "novel", "readability"],
    movie      : ["movie"]
    // restaurant : ["food", "restaurant"],
  };


  const wolframAPICall = (strInput) => {
    return waApi
    .getFull({
      input: strInput,
      format: 'plaintext',
    })
    .then((queryresult) => queryresult)
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
      strInput = taskStr + i;

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

  }
  initialize();
  return verdictMaker(resultsObj);

  // return resultsObj;
};
