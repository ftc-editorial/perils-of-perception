const fs = require('mz/fs');
const co = require('co');
const fetch = require('node-fetch');
const countries = require('./data/countries.js');

countries.forEach(country => {

  const key = country.en.toLowerCase().replace(/\s/g, '-');

  const url = `https://ft-ig-content-prod.s3.amazonaws.com/v1/ft-interactive/answer-api/2/2__perils-of-perception-survey-2016__${key}.json`;


  co(function *() {
    
    const data = yield fetch(url)
      .then(res => {
        console.log(`fetched ${key}`);
        return res.json();
      });
      
    yield fs.writeFile(`data/en/${key}.json`, JSON.stringify(data, null, 4), 'utf8');
  })
  .catch((err) => { 
    console.error(err);
  });
});