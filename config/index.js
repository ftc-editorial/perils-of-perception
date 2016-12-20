import article from './article';
import getFlags from './flags';
import getOnwardJourney from './onward-journey';
// import data from './data';

export default async function() {
  const d = await article();//疑问：为什么这里要用await呢，article()并不需要异步执行啊
  const flags = await getFlags();
  const onwardJourney = await getOnwardJourney();
  /*
  An experimental demo that gets content from the API
  and overwrites some model values. This requires the Link File
  to have been published. Also next-es-interface.ft.com probably
  isn't a reliable source. Also this has no way to prevent development
  values being seen in productions... use with care.

  try {
    const a = (await axios(`https://next-es-interface.ft.com/content/${d.id}`)).data;
    d.headline = a.title;
    d.byline = a.byline;
    d.summary = a.summaries[0];
    d.title = d.title || a.title;
    d.description = d.description || a.summaries[1] || a.summaries[0];
    d.publishedDate = new Date(a.publishedDate);
    f.comments = a.comments;
  } catch (e) {
    console.log('Error getting content from content API');
  }

  */

  return {
    ...d,//把d这个对象拆开
    flags,
    onwardJourney,
    // data,
  };
}
