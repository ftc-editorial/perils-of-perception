/* exported writeAd, slotStr, reloadBanners, checkB, clearEvents*/
/* jshint ignore:start */
var adchID = '1000';
var sectionsWithSide = document.querySelectorAll('.block-container.has-side');
var sections = document.querySelectorAll('.block-container, .footer-container, .bn-ph, .mpu-container, #story_main_mpu');

function SetCookie (name, value , sec , path , domain) {  
    var argv = SetCookie.arguments,
        argc = SetCookie.arguments.length,
        expires = new Date(),
        secure = (argc > 5) ? argv[5] : false;
    path = (argc > 3) ? argv[3] : null;
    domain = (argc > 4) ? argv[4] : null;
   if(sec === null || sec === '') {sec = 600 * (24 * 60 * 60 * 1000);}
    else {sec = 1000*sec;}
    expires.setTime (expires.getTime() + sec);
    document.cookie = name + '=' + escape (value) +((expires === null) ? '' : ('; expires=' + expires.toGMTString())) +((path === null) ? '/' : ('; path=' + path)) +((domain === null) ? '' : ('; domain=' + domain)) +((secure === true) ? '; secure' : '');  
}
function GetCookie(name){
    var start = document.cookie.indexOf(name+'='),
        len = start+name.length+1,
        end = document.cookie.indexOf(';',len);
    if ((!start) && (name !== document.cookie.substring(0,name.length))) {return null;}
    if (start === -1) {return null;}
    if (end === -1) {end = document.cookie.length; }
    return decodeURIComponent(document.cookie.substring(len,end));
}
function stickyBottomPrepare() {
  gNavOffsetY = findTop(document.querySelector('.o-nav__placeholder'));
  bodyHeight = getBodyHeight(gNavOffsetY);
  if (typeof recommendInner === 'object') {
    gRecomendOffsetY = findTop(recommendInner);
  }
  if (document.getElementById('story-action-placeholder')) {
    gShareOffsetY = findTop(document.getElementById('story-action-placeholder'));
  }

  if (document.getElementById('audio-placeholder')) {
    gAudioOffsetY = findTop(document.getElementById('audio-placeholder'));
  }

  w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

  // console.log (w);
  //     console.log (hasSideWidth); 
  if (sectionsWithSide.length > 0) {
    for (var i=0; i<sectionsWithSide.length; i++) {
      sectionClassName[i] = sectionsWithSide[i].className;       
      if (w < hasSideWidth) {
        sectionClassNameNew[i] = sectionClassName[i].replace(/ fixmain| fixside| bottommain| bottomside| sticktop/g,'');
        if (sectionClassNameNew[i] !== sectionClassName[i]) {
          // remove sticky side on mobile phone
          sectionClassName[i] = sectionClassNameNew[i];
          sectionsWithSide[i].className = sectionClassNameNew[i];
        }
      } else if (!/fixmain|fixside|bottommain|bottomside|sticktop/.test(sectionClassName[i])) {
        //calculate heights only when the sticky classes are not present
        containerTop[i] = findTop(sectionsWithSide[i]);
        mainHeight[i] = sectionsWithSide[i].querySelector('.content-inner').offsetHeight;
        sideHeight[i] = sectionsWithSide[i].querySelector('.side-inner').offsetHeight + defaultPadding;
        minHeight[i] = Math.min(mainHeight[i], sideHeight[i]);
        maxHeight[i] = Math.max(mainHeight[i], sideHeight[i]);
      }
      //sectionsWithSide[i].querySelector('.side-inner').style.backgroundColor = 'grey';
    }
  }

  viewablesInit();
}
function findTop(obj) {
  var curtop = 0;
  /*
  if (obj.offsetParent) {
    do {
      curtop += obj.offsetTop;
    } while ((obj = obj.offsetParent));
    */
    return curtop;
}

function getBodyHeight() {
  var w = window,
  d = document,
  e = d.documentElement,
  g = d.getElementsByTagName('body')[0],
  y = w.innerHeight|| e.clientHeight|| g.clientHeight;
  return y;
}


function viewablesInit() {
  if (sections.length > 0 && typeof window.gPageId === 'string' && window.gPageId !== '') {
    var sectionTypes = {
      'block': 0,
      'banner': 0,
      'mpu': 0,
      'storympu':0,
      'footer': 0
    };
    window.bBlocked = 'unknown';
    for (var j=0; j<sections.length; j++) {
      var top = findTop(sections[j]);
      var height = sections[j].offsetHeight;
      var sectionType = 'other';
      var viewedStatus;
      var minimumHeight = 0;
      var minimumTime = 1000;
      var bannerFrame;
      var adchValue = '';
      var adPositionValue = '';
      var isAdContainer = false;
      if (typeof viewables[j] === 'object' && viewables[j].viewed) {
        viewedStatus = viewables[j].viewed;
      } else {
        viewedStatus = false;
      }


      if (sections[j].className.indexOf('bn-ph') >= 0) {
        if (j===0 && typeof top !== 'number' && document.getElementById('topad') && sections[j].previousSibling.offsetTop > 0) {
          top = sections[j].previousSibling.offsetTop;
          height = sections[j].previousSibling.offsetHeight;
        }
        sectionType = 'banner';
        minimumHeight = 0.5;
        isAdContainer = true;
      } else if (sections[j].id === 'story_main_mpu') {
        sectionType = 'storympu';
        minimumHeight = 0.5;
        isAdContainer = true;
      } else if (sections[j].className.indexOf('mpu-container') >= 0) {
        sectionType = 'mpu';
        minimumHeight = 0.5;
        isAdContainer = true;
      } else if (sections[j].className.indexOf('footer') >= 0) {
        sectionType = 'footer';
      } else if (sections[j].className.indexOf('block') >= 0) {
        sectionType = 'block';
      }

      if (isAdContainer === true) {
        bannerFrame = sections[j].querySelector('.banner-iframe');
        if (bannerFrame !== null) {
          adchValue = bannerFrame.getAttribute('data-adch') || '';
          adPositionValue = bannerFrame.getAttribute('data-adPosition') || '';
        }
      }

      sectionTypes[sectionType] ++;
      if (typeof top === 'number') {
        viewables[j] = {
          id: sectionType + '-' + sectionTypes[sectionType],
          top: top,
          height: height,
          minimum: minimumHeight,
          time: minimumTime,
          viewed: viewedStatus,
          adch: adchValue,
          adPosition: adPositionValue
        };
        if (j === 0) {
          window.bBlocked = 'no';
        }
      } else {
        viewables[j] = '';
        if (j === 0) {
          window.bBlocked = 'yes';
        }
        // if (j === 0) {
        //   setTimeout(function(){
        //     ga('send','event', 'home', 'In View Error Catch: 019', window.isBlocked + ': ' + sections[0].offsetTop +'/' + sections[4].offsetTop + ',' + sections[4].offsetHeight + '/' + sections[4].style.display +'/'+ sections[4].className, {'nonInteraction':1});
        //   }, 1000);
        // }
      }
      sections[j].setAttribute('data-id', sectionType + '-' + sectionTypes[sectionType]);
      //sections[j].id = sectionType + '-' + sectionTypes[sectionType];
    }
  }
}



function adReachability() {
  var thirdPartyVendors = {
    'dcR': '_dc',
    'mmR': '_mm',
    'szR': '_sz',
    'amR': '_am'
  };
  var adParameter = '';
  var adReachabilityStatus;
  for (var k in thirdPartyVendors) {
      if (thirdPartyVendors.hasOwnProperty(k)) {
         //user[k] = data[k];
         //console.log (k + ': ' + thirdPartyVendors[k]);
         adReachabilityStatus = GetCookie(k);
         if (adReachabilityStatus === 'reachable') {
          adParameter += '&' + thirdPartyVendors[k] + '=1';
         } else if (adReachabilityStatus === null) {
          adParameter += '&' + thirdPartyVendors[k] + '=2';
         }
      }
  }
  return adParameter;
}

function trackAd(adAction, adLabel, reachabilityStatus) {
  var adLoadTime;
  var adTimeSpent;
  if (typeof window.ga === 'function') {
    adLoadTime = new Date().getTime();
    adTimeSpent = adLoadTime - window.adStartTime;
    ga('send','event','Third Party Ad', adAction + ' - all', adLabel, {'nonInteraction':1});
    ga('send', 'timing', 'Third Party Ad', adAction, adTimeSpent, adLabel);
    // console.log (reachabilityStatus);
    if (reachabilityStatus !== undefined && reachabilityStatus !== '') {
      ga('send','event','Third Party Ad', adAction + ' - ' + reachabilityStatus, adLabel, {'nonInteraction':1});
    }
    if (typeof window.startTime === 'number') {
      adLoadTime = new Date().getTime();
      adTimeSpent = adLoadTime - window.startTime;
      ga('send', 'timing', 'Third Party Ad', adAction + ' VS Page Start', adTimeSpent, adLabel);
    }
    try {
      //console.log (adAction + ' - ' + reachabilityStatus + ' ' + adLabel + ': ' + adTimeSpent);
    } catch (ignore) {
    }
  }
}

function checkAd(adOptions, adDomContainer) {
  // to be on the safe side
  // use setTimeout so that the third party script will be 
  // captured in the innerHTML in all browsers
  var img;
  var passDomCheck = false;
  var adDomImgs = 0;
  var adDomObjects = 0;
  var adDomIFrames = 0;
  var adDomVideos = 0;
  var adName = '';
  var fallbackImgContainer = adDomContainer.getElementsByTagName('div')[0];
  var thirdPartyVendor = '';
  var reachabilityStatus = ''; // reachable, unreachable, unknown
  var cookieSeconds = 60 * 30;
  var expression;
  var regex;

  if (adOptions.checking === true) {
    adName = adOptions.adClient + ' ' + adOptions.adWidth + 'x' + adOptions.adHeight + ' ' + adOptions.adNote;
    if (adOptions.thirdPartyVendor !== undefined) {
      thirdPartyVendor = adOptions.thirdPartyVendor;
    } else if (/doubleclick|adsafeprotected\.com\/.*\/dc\//i.test(adOptions.fallBackImg)) {
      thirdPartyVendor = 'dcR';
    }
    if (adOptions.checkingTime === 0) {
      if (thirdPartyVendor !== '') {
        // Check reachability status
        reachabilityStatus = GetCookie (thirdPartyVendor) || 'unknown';
        adOptions.reachabilityStatus = reachabilityStatus;
        //adOptions.thirdPartyVendor = thirdPartyVendor;
      }
      trackAd('Impression Track Start', adName, reachabilityStatus);
      //SetCookie(thirdPartyVendor, 'unknown', cookieSeconds, '/');
    } else {
      if (adOptions.reachabilityStatus !== undefined ) {
        reachabilityStatus = adOptions.reachabilityStatus;
      //console.log (reachabilityStatus);
      }
      if (adOptions.thirdPartyVendor !== undefined) {
        thirdPartyVendor = adOptions.thirdPartyVendor;
      }
    }
    //console.log (thirdPartyVendor);
    //Dom Check
    if (adDomContainer === null) {
      passDomCheck = false;
      //console.log ('no dom yet');
    } else if (adOptions.checkDom === true) {
      adDomImgs = adDomContainer.getElementsByTagName('img').length;
      adDomObjects = adDomContainer.getElementsByTagName('object').length;
      adDomIFrames = adDomContainer.getElementsByTagName('iframe').length;
      adDomVideos = adDomContainer.getElementsByTagName('video').length;
      if (adDomImgs > 0 || adDomIFrames > 0 || adDomObjects > 0 || adDomVideos > 0) {
        passDomCheck = true;
      } else {
        passDomCheck = false;
      }
    } else {
      passDomCheck = true;
    }
    if (passDomCheck === true) {
      adOptions.checking = false;
      trackAd('Impression Track Success', adName, reachabilityStatus);
      SetCookie(thirdPartyVendor, 'reachable', cookieSeconds, '/');
    } else if (adOptions.checkingTime < adOptions.checkingTimeMax) {
      //else if we still have time to check
      //check again in 1 second
      adOptions.checkingTime += 1;
      setTimeout(function(){
        checkAd(adOptions, adDomContainer);
      }, 1000);
    } else {
      //else if time runs out
      //tell Google Analytics ad has failed to load
      //load the fallback image
      trackAd('Impression Track Fail Main', adName, reachabilityStatus);
      SetCookie(thirdPartyVendor, 'unreachable', cookieSeconds, '/');
      if (adOptions.fallBackImg !== undefined && adOptions.fallBackImg !== '') {
      expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
      regex = new RegExp(expression);
        if (adOptions.fallBackImg.match(regex)) {
          img = new Image();
          img.src = adOptions.fallBackImg; 
          img.onload = function() {
            //fallback image is loaded successfully
            //tell Google Analytics that ad has loaded through the fallback
            //adDomContainer.style.backgroundImage = 'url('+ img.src +')';
            fallbackImgContainer.innerHTML = '<img src="' + img.src + '">';
            trackAd('Impression Track Success', adName, reachabilityStatus);
            trackAd('Impression Track Fallback Image', adName, reachabilityStatus);
          };
          img.onerror = function() {
            //fallback image is not loaded successfully
            //tell Google Analytics that fallback image has also failed
            trackAd('Impression Track Fail Fallback', adName, reachabilityStatus);
          };
        } else {
          trackAd('Impression Track Fail Fallback Invalid', adName, reachabilityStatus);
          ga('send','event','FallBack Image Error', adName, adOptions.fallBackImg, {'nonInteraction':1});
        }
      }
    }
  }
}

function checkAdLoad() {
	var el;
	var aTag;
    var videoTag;
    var iFrameTag;
    var imgTag;
	var divTag;
	var objTag;
	var tagLength;
	if (window.adUnitTrack === '5') {
		el = document.body;
	} else if (document.getElementById(window.adUnitIds[window.adUnitTrack])) {
		el = document.getElementById(window.adUnitIds[window.adUnitTrack]);
	}
	if (typeof el === 'object') {
		aTag = el.getElementsByTagName("a").length || 0;
    	videoTag = el.getElementsByTagName("video").length || 0;
    	iFrameTag = el.getElementsByTagName("iframe").length || 0;
    	imgTag = el.getElementsByTagName("img").length || 0;
    	divTag = el.getElementsByTagName("div").length || 0;
    	objTag = el.getElementsByTagName("object").length || 0;
    	tagLength = aTag + videoTag + iFrameTag + imgTag + divTag + objTag;
		if (tagLength > 0) {
			trackAd ('Loaded Something', window.adPositionTrack + ' ' + window.adIdTrack);
		} else {
			setTimeout(function(){
				checkAdLoad();
			},1000);
		}
	} else {
		trackAd ('ID ' + window.adUnitIds[window.adUnitTrack] + ' not found', window.adPositionTrack + ' ' + window.adIdTrack);
	}
	try {
		//console.log ('check ad load!');
	} catch(ignore) {

	}
}


function adLoadStatus(eventAction, eventLabel) {
  ga('send','event', 'Ad Load', eventAction, eventLabel, {'nonInteraction':1});
}


function setDolphinSlot(key){
  //定义slot随机数实现联动互斥功能
  var rString = window.dolRand?"&slot="+window.dolRand:"",
      cString = GetCookie(key),
      x;
  if(!cString){return rString;}
  window.cArray = cString.split(";");
  for(x in window.cArray){
      if (window.cArray.hasOwnProperty(x)) {
          window.cArray[x]=window.cArray[x].replace("|","=");
          rString += "&_"+window.cArray[x];
      }
  }
  return rString;
}
/* jshint ignore:end */

window.dolRand = Math.round(Math.random()*1000000);//定义slot随机数实现联动互斥功能 
var slotStr=setDolphinSlot('USER_KV');

// try {
//   console.log ('slotStr Set to ' + slotStr);
// } catch (ignore) {

// }

var adCount = {};
var adMax = {};
var adPositions = {
  'banner': ['0001','0006','0007','0008'],
  'tagbanner': ['0010'],
  'mpu': ['0003', '0004', '0005'],
  'tagmpu': ['0012', '0013'],
  'storympu': ['0005', '0003', '0004', '0003'],
  'ipadhomempu': ['0003', '0004'],
  'ipadstorympu': ['0005'],
  'phonebanner': ['0101', '0114'],
  'phonempu': ['0003'],
  //'phonestorybanner': ['0101', '0115'],
  'phonestorybanner': ['0101'],
  'phonestorybannersponsor': ['0109', '0109'],
  'phonestorympu': ['0004','0120'],
  'phonestoryiphonempu': ['0110'],
  'phonestoryandroidmpu': ['0111'],
  'phonefullpage': ['0107'],
  'phonestorympuVW': ['0119'],
  'phonehomempu': ['0118', '0003'],
  'phonetagmpu': ['0119','0004','0120']
};
var uaString;
var w1;
var w2;
var isWeChat = (/micromessenger/i.test(uaString));
function initAds() {
  uaString = navigator.userAgent || navigator.vendor || '';
  // First get the browser width
  // On an mobile phone, this may return a larger value if
  // 1.  viewport meta is not added
  // or 2. Dom is not properly rendered
  w1 = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  // However, screen.availWidth usually gets the correct value
  // Which is very useful to determine a mobile phone
  w2 = window.screen.availWidth || 0;
  if (w2>0 && w1>w2) {
    w1 = w2;
  }
  for(var x in adPositions){
    if (adPositions.hasOwnProperty(x)) {
        adCount[x] = 0;
        adMax[x] = adPositions[x].length;
    }
  }
}
var gaLoaded = false;
var eventsToSend = [];
function sendEvent(ec, ea, el, ei) {
  if (gaLoaded === true) {
    ga('send','event',ec, ea, el, ei);
  } else {
    // push this to an array for GA to send after loading JS
    eventsToSend.push({
      'ec': ec,
      'ea': ea,
      'el': el,
      'ei': ei
    });
  }
}

function clearEvents() {
  var l = eventsToSend.length;
  for (var i=0; i<l; i++) {
    ga('send', 'event', eventsToSend[i].ec, eventsToSend[i].ea, eventsToSend[i].el, eventsToSend[i].ei);
  }
  eventsToSend = [];
  gaLoaded = true;
}

function writeAd(adType, returnSrc) {
  var adFileName;
  var currentAdCount;
  var adPosition;
  var iframeSrc;
  var adWidth;
  var adHeight;
  var iframeHTML;
  var adch = adchID;
  var bannerBG = '';
  var wechatAdHTML = '';
  var debugString = '';



  // use UserAgent to determine iOS and Android devices
  var TouchDevice = false;
  if (/iPad/i.test(uaString) && /mpu/.test(adType)) {
    //if iPad, mpu ads change to iPad apps
    adch = '2021';
    TouchDevice = true;
    adType = (adType === 'mpu') ? 'ipadhomempu' : 'ipadstorympu';
  } else if (/OS [0-9]+\_/i.test(uaString) && (/iPhone/i.test(uaString) || /iPod/i.test(uaString))) {
    adch = '2022';
    TouchDevice = true;
  } else if (/Android|micromessenger/i.test(uaString) || w1 <= 490){
    // if uaString shows Android or browser width is less than 490
    // sometime browser width is not correct in Android phone
    adch = '2023';
    TouchDevice = true;
  }
  var adchURL = window.location.href.replace(/^.*adchannelID=([0-9]{4}).*$/g,'$1');
  var fromURL = false;
  if (/^[0-9]{4}$/.test(adchURL)) {
    adch = adchURL;
    fromURL = true;
  }
  if (typeof(window.FTadchannelID)!=='undefined' && window.FTadchannelID && !fromURL) {
    adch = window.FTadchannelID;
    fromURL = true;
  }
  //2022(iPhone) + 2023(Android) + 2056(Smart City)
  if ((adch === '2022' || adch === '2023' || fromURL) && TouchDevice) {
    // if it's a sponsored story

    if (adType.indexOf('banner') >=0) {
      adType = 'phonebanner';
    } else if (adType === 'mpu' || adType === 'homempu') {
      adType = 'phonehomempu';
    } else if (adType === 'tagmpu' || adType === 'taginlinempu') {
      adType = 'phonetagmpu';
    } else if (adType === 'storybanner') {
      adType = 'phonestorybanner';
    } else if (adType === 'storympu') {
      adType = 'phonestorympu';
    } else if (adType === 'storympuVW') {
      adType = 'phonestorympuVW';
    } else if (adType === 'homempuVW') {
      adType = 'phonehomempuVW';
    } else if (adType === 'fullpage') {
      adType = 'phonefullpage';
    }
    if (window.sponsorMobile === true) {
      
      if (adType === 'phonebanner') {
        adType = 'phonestorybannersponsor';
      } else if (adType === 'phonestorympu') {
        adType = (adch === '2022')?'phonestoryiphonempu':'phonestoryandroidmpu';
      }
      adch = adchID;
      //adType = 'phonestorympu';
    }
  }

  if (window.pageTheme === 'luxury') {
    bannerBG = '&bg=e0cdac';
  } else if (window.pageTheme === 'ebook') {
    bannerBG = '&bg=777777';
  }

  adFileName = (/banner/i.test(adType) && adCount[adType] === 0 && /^(1200|1300|1500)$/i.test(adch)) ? 't' : 'a';
  currentAdCount = adCount[adType];
  //console.log (currentAdCount + '/' + adMax[adType]);
  if (currentAdCount !== undefined && currentAdCount < adMax[adType]) {
    adPosition = adPositions[adType][currentAdCount];
    iframeSrc = '/m/marketing/'+adFileName+'.html?v=20161009143608' + bannerBG + '#adid='+ adch + adPosition + '&pid='+adType+adCount[adType];
    if (/mpu/.test(adType)) {
      adWidth = '300';
      adHeight = '250';
    } else if (/phone.*banner/.test(adType)) {
      adWidth = '100%';
      adHeight = '50';
    } else if (/phonefullpage/.test(adType)) {
      adWidth = '0';
      adHeight = '0';
    } else {
      adWidth = '969';
      adHeight = '90';
    }
    if (isWeChat === true) {
      slotStr = '';
      var c = adch + adPosition;
      var adP = '';
      if (1<0 && c==='20220101') {
      } else {
        window.adType = adType;
        wechatAdHTML = '<div class="banner-iframe" style="width: 100%; " data-adch="'+adch+'" data-adPosition="'+adPosition+'"><scr';
        wechatAdHTML += 'ipt src="http://dolphin.ftimg.net/s?z=ft&c=' + c + slotStr + adP + '&_fallback=0" charset="gbk">';
        wechatAdHTML += '</scr';
        wechatAdHTML += 'ipt></div>';
        // console.log (adType + adCount[adType]);
      }
    } else {
      iframeHTML = '<iframe class="banner-iframe" data-adch="'+adch+'" data-adPosition="'+adPosition+'" id="' + adType + adCount[adType] + '" width="'+ adWidth +'" height="'+ adHeight + '" frameborder="0" scrolling="no" marginwidth="0" marginheight="0" src="'+ iframeSrc +'" data-src="'+ iframeSrc +'" data-ad-type="'+ adType +'" data-ad-count=' + adCount[adType] + '></iframe>';
    }
    //console.log ('this ad is displayed: ' + adType);
  } else {
    //console.log ('no need to display this ad: ' + adType);
    iframeSrc = '';
    iframeHTML = '';
    var bannerContainers = document.querySelectorAll('.bn-ph');
    var mpuContainers = document.querySelectorAll('.mpu-container, #story_main_mpu');
    // console.log ((currentAdCount < adMax[adType]) + '/' + currentAdCount + '/' + adType);
    // console.log (/mpu/.test(adType));
    // console.log (currentAdCount);
    // console.log (mpuContainers[currentAdCount].className);
    if (/banner/.test(adType) && bannerContainers && bannerContainers[currentAdCount]) {
      bannerContainers[currentAdCount].style.display = 'none';
    } else if (/mpu/.test(adType) && mpuContainers && mpuContainers[currentAdCount]) {
      mpuContainers[currentAdCount].style.display = 'none';
    }
  }

  if (typeof window.gDebugAd === 'string') {
    debugString = window.gDebugAd.replace('adcode_for_debug', adch + adPosition);
  }

  
  adCount[adType] = adCount[adType] + 1;
  if (returnSrc === true) {
    return  iframeSrc + debugString;
  } else if (isWeChat === true) {
    // record the ad impression
    try {
      if (typeof adPosition === 'string') {
        sendEvent('Ad Impression', adch, adPosition, {'nonInteraction':1});
      }
    } catch (ignore) {

    }

    //deal with WeChat Sharing Bug
    // where WeChat grabs iframe src instead of the real url for sharing
    return wechatAdHTML + debugString;
  } else {
    return iframeHTML + debugString;
  }
  
}

var bannerIframeContainers = [];
function reloadBanners() {
  var bannerIframes;
  var i = 0;
  if (bannerIframeContainers.length === 0) {
    bannerIframes = document.querySelectorAll('.banner-iframe');
    for (i=0; i<bannerIframes.length; i++) {
      bannerIframeContainers[i] = bannerIframes[i].parentNode;
    }
  }
  adCount = {};
  initAds();
  for (i=0; i<bannerIframeContainers.length; i++) {
    var thisiFrame = bannerIframeContainers[i].querySelector('.banner-iframe');
    var thisSrc;
    var adType;
    var thisAdCount;
    if (thisiFrame !== null) {
      thisSrc = thisiFrame.getAttribute('data-src');
      adType = thisiFrame.getAttribute('data-ad-type');
      thisAdCount = thisiFrame.getAttribute('data-ad-count');
    } else {
      thisSrc = '';
      adType = '';
      thisAdCount = 0;
    }

    //console.log (thisSrc);
    var newSrc = writeAd(adType, true);
    if (thisSrc !== newSrc) {
      bannerIframeContainers[i].innerHTML = writeAd(adType);
      //console.log ('different: (' + i + ')' + thisSrc + '|' + newSrc);
    } else {
      //console.log ('same: (' + i + ')' + thisSrc + '|' + newSrc);
    }
  }
}

var isBlocked = 'unknown';

// test if ad blocker is turned on
function checkB() {
  var test = document.createElement('div');
  test.innerHTML = '&nbsp;';
  test.className = 'adsbox';
  document.body.appendChild(test);
  window.setTimeout(function() {
    if (test.offsetHeight === 0) {
      //document.body.classList.add('adblock');
      isBlocked = 'yes';
    } else {
      isBlocked = 'no';
    }
    test.remove();
  }, 100);
}

initAds();
if (isWeChat === true) {
  document.documentElement.className += ' is-wechat';
}