module.exports = function apiCategoryDecider(strInput){

  const WolframAlphaAPI = require('wolfram-alpha-api');
  const waApi = WolframAlphaAPI('ULL5QV-HEQ3H8K997');
  const request = require('request');
  let searchOT =  'https://opentable.herokuapp.com/api/restaurants?city=Toronto&per_page=25&name=' + strInput;

  const resultsObj = {};

  const keywordObj = {
    book       : ["word", "book", "text"],
    movie      : ["movie", "academyaward"]
  };

//*******************************************************






};// closes mod.exp
