export default () => ({ // eslint-disable-line

  // link file UUID
  id: '325eb0aa-c156-11e6-9bca-2b93a6856354',

  // canonical URL of the published page
  // "$url" get filled in by the ./configure script
  url: 'interactive.ftchinese.com/perils-of-perception/index.html',

  // To set an exact publish date do this:
  //       new Date('2016-05-17T17:11:22Z')
  publishedDate: new Date('2017-1'),

  headline: '测验：你有多了解你的国家？',

  // summary === standfirst (Summary is what the content API calls it)
  summary: '一个最新的跨国调查显示，人们并不太理解他所处的社会状态。通过以下测验，看看你和其他的FT读者相比，谁最了解自己的国家',

  topic: {
    name: 'FT数据新闻',
    url: 'http://www.ftchinese.com/tag/%E6%95%B0%E6%8D%AE%E6%96%B0%E9%97%BB',
  },

  relatedArticle: {
    text: '',
    url: 'https://www.ft.com/content/bed2e788-c154-11e6-9bca-2b93a6856354',
  },

  mainImage: {
    title: 'FT中文网测验：你有多了解你的国家？',
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
    { name: '史书华', url: 'http://www.ftchinese.com/search/%E5%8F%B2%E4%B9%A6%E5%8D%8E/relative_byline' },
    { name: '倪卫国', url: 'http://www.ftchinese.com/'},
  ],

  // Appears in the HTML <title>
  title: '测验：你有多了解你的国家？-FT中文网',

  // meta data
  description: '一个最新的跨国调查显示，人们并不太理解他所处的社会状态。通过以下测验，看看你和其他的FT读者相比，谁最了解自己的国家。',

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
