export default () => ({ // eslint-disable-line

  // link file UUID
  id: '325eb0aa-c156-11e6-9bca-2b93a6856354',

  // canonical URL of the published page
  // "$url" get filled in by the ./configure script
  url: 'https://ig.ft.com/sites/quiz/perils-of-perception/2016/',

  // To set an exact publish date do this:
  //       new Date('2016-05-17T17:11:22Z')
  publishedDate: new Date('2016-12-16T17:00:00Z'),

  headline: '你真的了解你的国家吗?',

  // summary === standfirst (Summary is what the content API calls it)
  summary: '一项新的民意调查表明鲜有人了解他们的国家。做一做我们的题目吧，然后比较一下你自己和其他读者的答案。',

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
  title: '你真的了解你的国家吗?',

  // meta data
  description: '一项新的民意调查表明鲜有人了解他们的国家。做一做我们的题目吧，然后比较一下你自己和其他读者的答案。',


  twitterCard: 'summary_large_image',

 

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
