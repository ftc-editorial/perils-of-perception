export default () => ({ // eslint-disable-line

  // link file UUID
  id: '325eb0aa-c156-11e6-9bca-2b93a6856354',

  // canonical URL of the published page
  // "$url" get filled in by the ./configure script
  url: 'interactive.ftchinese.com/perils-of-perception/index.html',

  // To set an exact publish date do this:
  //       new Date('2016-05-17T17:11:22Z')
  publishedDate: new Date('2017-1'),

  headline: '测验：你有多认识全球？',

  // summary === standfirst (Summary is what the content API calls it)
  summary: '一个最新的调查显示，人们并不太理解他自己的国家。请参与以下测验，看看你和其他的FT读者相比，谁最了解自己的国家',

  topic: {
    name: 'FT Data',
    url: 'https://www.ft.com/ft-data',
  },

  relatedArticle: {
    text: '',
    url: 'https://www.ft.com/content/bed2e788-c154-11e6-9bca-2b93a6856354',
  },

  mainImage: {
    title: 'FT Perils of Perception quiz',
    description: 'Faces in a crowd',
    url: 'http://ig.ft.com/static/perilsofperception.jpg',
    width: 2048, // ensure correct width
    height: 1152, // ensure correct height
  },

  // Byline can by a plain string, markdown, or array of authors
  // if array of authors, url is optional
  byline: [
    { name: 'David Blood', url: 'https://www.ft.com/stream/authorsId/NTBmY2Q1M2ItNjVhOC00ZGRhLWE5MGEtNzgxMTc0ZDlhOWQ3-QXV0aG9ycw==' },
    { name: 'Ændrew Rininsland', url: 'https://www.ft.com/topics/authors/%C3%86ndrew_Rininsland' },
  ],

  // Appears in the HTML <title>
  title: 'How well do you really know your country?',

  // meta data
  description: 'A new poll shows how little many people know about their home countries. Take our quiz to see how you and other FT readers compare.',

  /*
  TODO: Select Twitter card type -
        "summary" or "summary_large_image"

        Twitter card docs:
        https://dev.twitter.com/cards/markup
  */
  twitterCard: 'summary_large_image',

  /*
  TODO: Do you want to tweak any of the
        optional social meta data?
  */
  // General social
  // socialImage: '',
  // socialHeadline: '',
  // socialSummary:  '',

  // TWITTER
  // twitterImage: '',
  // twitterCreator: '@individual's_account',
  // tweetText:  '',
  // twitterHeadline:  '',

  // FACEBOOK
  // facebookImage: '',
  // facebookHeadline: '',

  tracking: {

    /*

    Microsite Name

    e.g. guffipedia, business-books, baseline.
    Used to query groups of pages, not intended for use with
    one off interactive pages. If you're building a microsite
    consider more custom tracking to allow better analysis.
    Also used for pages that do not have a UUID for whatever reason
    */
    // micrositeName: '',

    /*
    Product name

    This will usually default to "IG"
    however another value may be needed
    */
    // product: '',
  },
});
