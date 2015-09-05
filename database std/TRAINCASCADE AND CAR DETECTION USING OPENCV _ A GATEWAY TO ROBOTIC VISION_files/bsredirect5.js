function dv_rolloutManager(handlersDefsArray, baseHandler) {
    this.handle = function () {
        var errorsArr = [];

        var handler = chooseEvaluationHandler(handlersDefsArray);
        if (handler) {
            var errorObj = handleSpecificHandler(handler);
            if (errorObj === null)
                return errorsArr;
            else {
                var debugInfo = handler.onFailure();
                if (debugInfo) {
                    for (var key in debugInfo) {
                        if (debugInfo.hasOwnProperty(key)) {
                            if (debugInfo[key] !== undefined || debugInfo[key] !== null) {
                                errorObj[key] = encodeURIComponent(debugInfo[key]);
                            }
                        }
                    }
                }
                errorsArr.push(errorObj);
            }
        }

        var errorObjHandler = handleSpecificHandler(baseHandler);
        if (errorObjHandler) {
            errorObjHandler['dvp_isLostImp'] = 1;
            errorsArr.push(errorObjHandler);
        }
        return errorsArr;
    }

    function handleSpecificHandler(handler) {
        var url;
        var errorObj = null;

        try {
            url = handler.createRequest();
            if (url) {
                if (!handler.sendRequest(url))
                    errorObj = createAndGetError('sendRequest failed.', url, handler.getVersion(), handler.getVersionParamName(), handler.dv_script);
            }
            else
                errorObj = createAndGetError('createRequest failed.', url, handler.getVersion(), handler.getVersionParamName(), handler.dv_script);
        }
        catch (e) {
            errorObj = createAndGetError(e.name + ': ' + e.message, url, handler.getVersion(), handler.getVersionParamName(), (handler ? handler.dv_script : null));
        }

        return errorObj;
    }

    function createAndGetError(error, url, ver, versionParamName, dv_script) {
        var errorObj = {};
        errorObj[versionParamName] = ver;
        errorObj['dvp_jsErrMsg'] = encodeURIComponent(error);
        if (dv_script && dv_script.parentElement && dv_script.parentElement.tagName && dv_script.parentElement.tagName == 'HEAD')
            errorObj['dvp_isOnHead'] = '1';
        if (url)
            errorObj['dvp_jsErrUrl'] = url;
        return errorObj;
    }

    function chooseEvaluationHandler(handlersArray) {
        var config = window._dv_win.dv_config;
        var index = 0;
        var isEvaluationVersionChosen = false;
        if (config.handlerVersionSpecific) {
            for (var i = 0; i < handlersArray.length; i++) {
                if (handlersArray[i].handler.getVersion() == config.handlerVersionSpecific) {
                    isEvaluationVersionChosen = true;
                    index = i;
                    break;
                }
            }
        }
        else if (config.handlerVersionByTimeIntervalMinutes) {
            var date = config.handlerVersionByTimeInputDate || new Date();
            var hour = date.getUTCHours();
            var minutes = date.getUTCMinutes();
            index = Math.floor(((hour * 60) + minutes) / config.handlerVersionByTimeIntervalMinutes) % (handlersArray.length + 1);
            if (index != handlersArray.length) //This allows a scenario where no evaluation version is chosen
                isEvaluationVersionChosen = true;
        }
        else {
            var rand = config.handlerVersionRandom || (Math.random() * 100);
            for (var i = 0; i < handlersArray.length; i++) {
                if (rand >= handlersArray[i].minRate && rand < handlersArray[i].maxRate) {
                    isEvaluationVersionChosen = true;
                    index = i;
                    break;
                }
            }
        }

        if (isEvaluationVersionChosen == true && handlersArray[index].handler.isApplicable())
            return handlersArray[index].handler;
        else
            return null;
    }    
}

function dv_GetParam(url, name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    if (results == null)
        return null;
    else
        return results[1];
}

function dv_SendErrorImp(serverUrl, errorsArr) {

    for (var j = 0; j < errorsArr.length; j++) {
        var errorQueryString = '';
        var errorObj = errorsArr[j];
        for (key in errorObj) {
            if (errorObj.hasOwnProperty(key)) {
                if (key.indexOf('dvp_jsErrUrl') == -1) {
                    errorQueryString += '&' + key + '=' + errorObj[key];
                }
                else {
                    var params = ['ctx', 'cmp', 'plc', 'sid'];
                    for (var i = 0; i < params.length; i++) {
                        var pvalue = dv_GetParam(errorObj[key], params[i]);
                        if (pvalue) {
                            errorQueryString += '&dvp_js' + params[i] + '=' + pvalue;
                        }
                    }
                }
            }
        }

        var windowProtocol = 'http:';
        var sslFlag = '&ssl=0';
        if (window.location.protocol === 'https:') {
            windowProtocol = 'https:';
            sslFlag = '&ssl=1';
        }
        var errorImp = windowProtocol + '//' + serverUrl + sslFlag + errorQueryString;
        dv_sendRequest(errorImp);
    }
}

function dv_sendRequest(url) {
    document.write('<scr' + 'ipt language="javascript" src="' + url + '"></scr' + 'ipt>');
}

function dv_GetRnd() {
    return ((new Date()).getTime() + "" + Math.floor(Math.random() * 1000000)).substr(0, 16);
}

function doesBrowserSupportHTML5Push() {
    "use strict";
    return typeof window.parent.postMessage === 'function' && window.JSON;
}
    

function dvBsrType() {
    'use strict';
    var that = this;
    var eventsForDispatch = {};


    this.pubSub = new function () {

        var subscribers = [];

        this.subscribe = function(eventName, uid, actionName, func) {
            if (!subscribers[eventName + uid])
                subscribers[eventName + uid] = [];
            subscribers[eventName + uid].push({ Func: func, ActionName: actionName });
        };

        this.publish = function (eventName, uid) {
            var actionsResults = [];
            if (eventName && uid && subscribers[eventName + uid] instanceof Array)
                for (var i = 0; i < subscribers[eventName + uid].length; i++) {
                    var funcObject = subscribers[eventName + uid][i];
                    if (funcObject && funcObject.Func && typeof funcObject.Func == "function" && funcObject.ActionName) {
                        var isSucceeded = runSafely(function () {
                            return funcObject.Func(uid);
                        });
                        actionsResults.push(encodeURIComponent(funcObject.ActionName) + '=' + (isSucceeded ? '1' : '0'));
                    }
                }
            return actionsResults.join('&');
        };
    };

    this.domUtilities = new function () {

        this.addImage = function (url, parentElement) {
            var image = parentElement.ownerDocument.createElement("img");
            image.width = 0;
            image.height = 0;
            image.style.display = 'none';
            image.src = appendCacheBuster(url);
            parentElement.insertBefore(image, parentElement.firstChild);
        };

        this.addScriptResource = function (url, parentElement) {
            var scriptElem = parentElement.ownerDocument.createElement("script");
            scriptElem.type = 'text/javascript';
            scriptElem.src = appendCacheBuster(url);
            parentElement.insertBefore(scriptElem, parentElement.firstChild);
        };

        this.addScriptCode = function (srcCode, parentElement) {
            var scriptElem = parentElement.ownerDocument.createElement("script");
            scriptElem.type = 'text/javascript';
            scriptElem.innerHTML = srcCode;
            parentElement.insertBefore(scriptElem, parentElement.firstChild);
        };

        this.addHtml = function(srcHtml, parentElement) {
            var divElem = parentElement.ownerDocument.createElement("div");
            divElem.style = "display: inline";
            divElem.innerHTML = srcHtml;
            parentElement.insertBefore(divElem, parentElement.firstChild);
        };
    };

    this.resolveMacros = function (str, tag) {
        var viewabilityData = tag.getViewabilityData();
        var viewabilityBuckets = viewabilityData && viewabilityData.buckets ? viewabilityData.buckets : {};
        var upperCaseObj = objectsToUpperCase(tag, viewabilityData, viewabilityBuckets);
        var newStr = str.replace('[DV_PROTOCOL]', upperCaseObj.DV_PROTOCOL);
        newStr = newStr.replace('[PROTOCOL]', upperCaseObj.PROTOCOL);
        newStr = newStr.replace(/\[(.*?)\]/g, function (match, p1) {
            var value = upperCaseObj[p1];
            if (value === undefined || value === null)
                value = '[' + p1 + ']';
            return encodeURIComponent(value);
        });
        return newStr;
    };

    this.settings = new function () {
    };

    this.tagsType = function () { };

    this.tagsPrototype = function () {
        this.add = function(tagKey, obj) {
            if (!that.tags[tagKey])
                that.tags[tagKey] = new that.tag();
            for (var key in obj)
                that.tags[tagKey][key] = obj[key];
        };
    };

    this.tagsType.prototype = new this.tagsPrototype();
    this.tagsType.prototype.constructor = this.tags;
    this.tags = new this.tagsType();

    this.tag = function () { }
    this.tagPrototype = function () {
        this.set = function (obj) {
            for (var key in obj)
                this[key] = obj[key];
        };
        
        this.getViewabilityData = function () {
        };
    };

    this.tag.prototype = new this.tagPrototype();
    this.tag.prototype.constructor = this.tag;


    this.getTagObjectByService = function (serviceName) {
    
        for (var impressionId in this.tags) {
            if (typeof this.tags[impressionId] === 'object'
                && this.tags[impressionId].services
                && this.tags[impressionId].services[serviceName]
                && !this.tags[impressionId].services[serviceName].isProcessed) {
                this.tags[impressionId].services[serviceName].isProcessed = true;
                return this.tags[impressionId];
            }
        }
        

        return null;
    };

    this.addService = function (impressionId, serviceName, paramsObject) {

        if (!impressionId || !serviceName)
            return;

        if (!this.tags[impressionId])
            return;
        else {
            if (!this.tags[impressionId].services)
                this.tags[impressionId].services = { };

            this.tags[impressionId].services[serviceName] = {
                params: paramsObject,
                isProcessed: false
            };
        }
    };

    this.Enums = {
        BrowserId: { Others: 0, IE: 1, Firefox: 2, Chrome: 3, Opera: 4, Safari: 5 },
        TrafficScenario: { OnPage: 1, SameDomain: 2, CrossDomain: 128 }
    };

    this.CommonData = {};

    var runSafely = function (action) {
        try {
            var ret = action();
            return ret !== undefined ? ret : true;
        } catch (e) { return false; }
    };

    var objectsToUpperCase = function () {
        var upperCaseObj = {};
        for (var i = 0; i < arguments.length; i++) {
            var obj = arguments[i];
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    upperCaseObj[key.toUpperCase()] = obj[key];
                }
            }
        }
        return upperCaseObj;
    };

    var appendCacheBuster = function (url) {
        if (url !== undefined && url !== null && url.match("^http") == "http") {
            if (url.indexOf('?') !== -1) {
                if (url.slice(-1) == '&')
                    url += 'cbust=' + dv_GetRnd();
                else
                    url += '&cbust=' + dv_GetRnd();
            }
            else
                url += '?cbust=' + dv_GetRnd();
        }
        return url;
    };

    this.dispatchRegisteredEventsFromAllTags = function () {
        for (var impressionId in this.tags) {
            if (typeof this.tags[impressionId] !== 'function' && typeof this.tags[impressionId] !== 'undefined')
                dispatchEventCalls(impressionId, this);
        }
    };

    var dispatchEventCalls = function (impressionId, dvObj) {
        var tag = dvObj.tags[impressionId];
        var eventObj = eventsForDispatch[impressionId];
        if (typeof eventObj !== 'undefined' && eventObj != null) {
            var url = tag.protocol + '//' + tag.ServerPublicDns + "/bsevent.gif?impid=" + impressionId + '&' + createQueryStringParams(eventObj);
            dvObj.domUtilities.addImage(url, tag.tagElement.parentElement);
            eventsForDispatch[impressionId] = null;
        }
    };

    this.registerEventCall = function (impressionId, eventObject, timeoutMs) {
        addEventCallForDispatch(impressionId, eventObject);

        if (typeof timeoutMs === 'undefined' || timeoutMs == 0 || isNaN(timeoutMs))
            dispatchEventCallsNow(this, impressionId, eventObject);
        else {
            if (timeoutMs > 2000)
                timeoutMs = 2000;

            var dvObj = this;
            setTimeout(function () {
                dispatchEventCalls(impressionId, dvObj);
            }, timeoutMs);
        }
    };

    var dispatchEventCallsNow = function (dvObj, impressionId, eventObject) {
        addEventCallForDispatch(impressionId, eventObject);
        dispatchEventCalls(impressionId, dvObj);
    };

    var addEventCallForDispatch = function (impressionId, eventObject) {
        for (var key in eventObject) {
            if (typeof eventObject[key] !== 'function' && eventObject.hasOwnProperty(key)) {
                if (!eventsForDispatch[impressionId])
                    eventsForDispatch[impressionId] = {};
                eventsForDispatch[impressionId][key] = eventObject[key];
            }
        }
    };

    if (window.addEventListener) {
        window.addEventListener('unload', function () { that.dispatchRegisteredEventsFromAllTags(); }, false);
        window.addEventListener('beforeunload', function () { that.dispatchRegisteredEventsFromAllTags(); }, false);
    }
    else if (window.attachEvent) {
        window.attachEvent('onunload', function () { that.dispatchRegisteredEventsFromAllTags(); }, false);
        window.attachEvent('onbeforeunload', function () { that.dispatchRegisteredEventsFromAllTags(); }, false);
    }
    else {
        window.document.body.onunload = function () { that.dispatchRegisteredEventsFromAllTags(); };
        window.document.body.onbeforeunload = function () { that.dispatchRegisteredEventsFromAllTags(); };
    }

    var createQueryStringParams = function (values) {
        var params = '';
        for (var key in values) {
            if (typeof values[key] !== 'function') {
                var value = encodeURIComponent(values[key]);
                if (params === '')
                    params += key + '=' + value;
                else
                    params += '&' + key + '=' + value;
            }
        }

        return params;
    };

 
}

function dv_baseHandler(){function B(c,b,d,e,k,a,t){var i,n,m;m=window._dv_win.dv_config&&window._dv_win.dv_config.bst2tid?window._dv_win.dv_config.bst2tid:dv_GetRnd();var H,B=window.parent.postMessage&&window.JSON,h=!0,q=!1;if("0"==dv_GetParam(c.dvparams,"t2te")||window._dv_win.dv_config&&!0==window._dv_win.dv_config.supressT2T)q=!0;if(B&&!1==q)try{q="https://cdn3.doubleverify.com/bst2tv3.html";window._dv_win&&(window._dv_win.dv_config&&window._dv_win.dv_config.bst2turl)&&(q=window._dv_win.dv_config.bst2turl);
var D="bst2t_"+m,p;if(document.createElement&&(p=document.createElement("iframe")))p.name=p.id="iframe_"+dv_GetRnd(),p.width=0,p.height=0,p.id=D,p.style.display="none",p.src=q;H=p;if(window._dv_win.document.body)window._dv_win.document.body.insertBefore(H,window._dv_win.document.body.firstChild),h=!0;else{var J=0,K=function(){if(window._dv_win.document.body)try{window._dv_win.document.body.insertBefore(H,window._dv_win.document.body.firstChild)}catch(a){}else J++,150>J&&setTimeout(K,20)};setTimeout(K,
20);h=!1}}catch(V){}q=c.rand;p="__verify_callback_"+q;q="__tagObject_callback_"+q;window[p]=function(a){try{if(void 0==a.ResultID)document.write(1!=a?c.tagsrc:c.altsrc);else switch(a.ResultID){case 1:a.Passback?document.write(decodeURIComponent(a.Passback)):document.write(c.altsrc);break;case 2:case 3:document.write(c.tagsrc)}}catch(b){}};var L="http:",M="http:",N="0";"https"==window._dv_win.location.toString().match("^https")&&(L="https:","https"==t.src.match("^https")&&(M="https:",N="1"));window[q]=
function(a){try{var b={};b.protocol=L;b.ssl=N;b.dv_protocol=M;b.serverPublicDns=a.ServerPublicDns;b.ServerPublicDns=a.ServerPublicDns;b.tagElement=t;b.redirect=c;b.impressionId=a.ImpressionID;window._dv_win.$dvbsr.tags.add(a.ImpressionID,b)}catch(d){}};void 0==c.dvregion&&(c.dvregion=0);var D="http:",O="0";"https"==window.location.toString().match("^https")&&(D="https:",O="1");try{for(var f=d,w=0;10>w&&f!=window.top;)w++,f=f.parent;d.depth=w;var j=R(d);n="&aUrl="+encodeURIComponent(j.url);i="&aUrlD="+
j.depth;var P=d.depth+e;k&&d.depth--}catch(W){i=n=P=d.depth=""}void 0!=c.aUrl&&(n="&aUrl="+c.aUrl);var C;e=function(){try{return!!window.sessionStorage}catch(a){return!0}};k=function(){try{return!!window.localStorage}catch(a){return!0}};j=function(){var a=document.createElement("canvas");if(a.getContext&&a.getContext("2d")){var b=a.getContext("2d");b.textBaseline="top";b.font="14px 'Arial'";b.textBaseline="alphabetic";b.fillStyle="#f60";b.fillRect(0,0,62,20);b.fillStyle="#069";b.fillText("!image!",
2,15);b.fillStyle="rgba(102, 204, 0, 0.7)";b.fillText("!image!",4,17);return a.toDataURL()}return null};try{f=[];f.push(["lang",navigator.language||navigator.browserLanguage]);f.push(["tz",(new Date).getTimezoneOffset()]);f.push(["hss",e()?"1":"0"]);f.push(["hls",k()?"1":"0"]);f.push(["odb",typeof window.openDatabase||""]);f.push(["cpu",navigator.cpuClass||""]);f.push(["pf",navigator.platform||""]);f.push(["dnt",navigator.doNotTrack||""]);f.push(["canv",j()]);var l=f.join("=!!!=");if(null==l||""==
l)C="";else{for(var e=function(b){for(var a="",d,c=7;0<=c;c--)d=b>>>4*c&15,a+=d.toString(16);return a},k=[1518500249,1859775393,2400959708,3395469782],l=l+String.fromCharCode(128),x=Math.ceil((l.length/4+2)/16),y=Array(x),j=0;j<x;j++){y[j]=Array(16);for(f=0;16>f;f++)y[j][f]=l.charCodeAt(64*j+4*f)<<24|l.charCodeAt(64*j+4*f+1)<<16|l.charCodeAt(64*j+4*f+2)<<8|l.charCodeAt(64*j+4*f+3)}y[x-1][14]=8*(l.length-1)/Math.pow(2,32);y[x-1][14]=Math.floor(y[x-1][14]);y[x-1][15]=8*(l.length-1)&4294967295;for(var l=
1732584193,f=4023233417,w=2562383102,E=271733878,F=3285377520,r=Array(80),z,s,u,v,G,j=0;j<x;j++){for(var g=0;16>g;g++)r[g]=y[j][g];for(g=16;80>g;g++)r[g]=(r[g-3]^r[g-8]^r[g-14]^r[g-16])<<1|(r[g-3]^r[g-8]^r[g-14]^r[g-16])>>>31;z=l;s=f;u=w;v=E;G=F;for(g=0;80>g;g++){var Q=Math.floor(g/20),S=z<<5|z>>>27,A;c:{switch(Q){case 0:A=s&u^~s&v;break c;case 1:A=s^u^v;break c;case 2:A=s&u^s&v^u&v;break c;case 3:A=s^u^v;break c}A=void 0}var T=S+A+G+k[Q]+r[g]&4294967295;G=v;v=u;u=s<<30|s>>>2;s=z;z=T}l=l+z&4294967295;
f=f+s&4294967295;w=w+u&4294967295;E=E+v&4294967295;F=F+G&4294967295}C=e(l)+e(f)+e(w)+e(E)+e(F)}}catch(X){C=null}d=(window._dv_win&&window._dv_win.dv_config&&window._dv_win.dv_config.verifyJSCURL?dvConfig.verifyJSCURL+"?":D+"//rtb"+c.dvregion+".doubleverify.com/verifyc.js?")+c.dvparams+"&num=5&srcurlD="+d.depth+"&callback="+p+"&jsTagObjCallback="+q+"&ssl="+O+"&refD="+P+"&htmlmsging="+(B?"1":"0")+"&guid="+m+(null!=C?"&aadid="+C:"");b="dv_url="+encodeURIComponent(b);if(!1==h||a)d=d+("&dvp_isBodyExistOnLoad="+
(h?"1":"0"))+("&dvp_isOnHead="+(a?"1":"0"));if((a=window[I("=@42E:@?")][I("2?46DE@C~C:8:?D")])&&0<a.length){h=[];h[0]=window.location.protocol+"//"+window.location.hostname;for(m=0;m<a.length;m++)h[m+1]=a[m];a=h.reverse().join(",")}else a=null;a&&(b+="&ancChain="+encodeURIComponent(a));if(!1==/MSIE (\d+\.\d+);/.test(navigator.userAgent)||7<new Number(RegExp.$1)||2E3>=n.length+i.length+d.length)d+=i,b+=n;if(void 0!=window._dv_win.$dvbsr.CommonData.BrowserId&&void 0!=window._dv_win.$dvbsr.CommonData.BrowserVersion&&
void 0!=window._dv_win.$dvbsr.CommonData.BrowserIdFromUserAgent)a=window._dv_win.$dvbsr.CommonData.BrowserId,i=window._dv_win.$dvbsr.CommonData.BrowserVersion,n=window._dv_win.$dvbsr.CommonData.BrowserIdFromUserAgent;else{a=[{id:4,brRegex:"OPR|Opera",verRegex:"(OPR/|Version/)"},{id:1,brRegex:"MSIE|Trident/7.*rv:11|rv:11.*Trident/7",verRegex:"(MSIE |rv:)"},{id:2,brRegex:"Firefox",verRegex:"Firefox/"},{id:0,brRegex:"Mozilla.*Android.*AppleWebKit(?!.*Chrome.*)|Linux.*Android.*AppleWebKit.* Version/.*Chrome",
verRegex:null},{id:0,brRegex:"AOL/.*AOLBuild/|AOLBuild/.*AOL/|Puffin|Maxthon|Valve|Silk|PLAYSTATION|PlayStation|Nintendo|wOSBrowser",verRegex:null},{id:3,brRegex:"Chrome",verRegex:"Chrome/"},{id:5,brRegex:"Safari|(OS |OS X )[0-9].*AppleWebKit",verRegex:"Version/"}];n=0;i="";m=navigator.userAgent;for(h=0;h<a.length;h++)if(null!=m.match(RegExp(a[h].brRegex))){n=a[h].id;if(null==a[h].verRegex)break;m=m.match(RegExp(a[h].verRegex+"[0-9]*"));null!=m&&(i=m[0].match(RegExp(a[h].verRegex)),i=m[0].replace(i[0],
""));break}a=h=U();i=h===n?i:"";window._dv_win.$dvbsr.CommonData.BrowserId=a;window._dv_win.$dvbsr.CommonData.BrowserVersion=i;window._dv_win.$dvbsr.CommonData.BrowserIdFromUserAgent=n}d+="&brid="+a+"&brver="+i+"&bridua="+n;return d+"&eparams="+encodeURIComponent(I(b))}function R(c){try{if(1>=c.depth)return{url:"",depth:""};var b,d=[];d.push({win:window.top,depth:0});for(var e,k=1,a=0;0<k&&100>a;){try{if(a++,e=d.shift(),k--,0<e.win.location.toString().length&&e.win!=c)return 0==e.win.document.referrer.length||
0==e.depth?{url:e.win.location,depth:e.depth}:{url:e.win.document.referrer,depth:e.depth-1}}catch(t){}b=e.win.frames.length;for(var i=0;i<b;i++)d.push({win:e.win.frames[i],depth:e.depth+1}),k++}return{url:"",depth:""}}catch(n){return{url:"",depth:""}}}function I(c){new String;var b=new String,d,e,k;for(d=0;d<c.length;d++)k=c.charAt(d),e="!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~".indexOf(k),0<=e&&(k="!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~".charAt((e+
47)%94)),b+=k;return b}function U(){try{if("function"===typeof window.callPhantom)return 99;try{if("function"===typeof window.top.callPhantom)return 99}catch(c){}if(void 0!=window.opera&&void 0!=window.history.navigationMode||void 0!=window.opr&&void 0!=window.opr.addons&&"function"==typeof window.opr.addons.installExtension)return 4;if(void 0!=window.chrome&&"function"==typeof window.chrome.csi&&"function"==typeof window.chrome.loadTimes&&void 0!=document.webkitHidden&&(!0==document.webkitHidden||
!1==document.webkitHidden))return 3;if(void 0!=window.mozInnerScreenY&&"number"==typeof window.mozInnerScreenY&&void 0!=window.mozPaintCount&&0<=window.mozPaintCount&&void 0!=window.InstallTrigger&&void 0!=window.InstallTrigger.install)return 2;if(void 0!=document.uniqueID&&"string"==typeof document.uniqueID&&(void 0!=document.documentMode&&0<=document.documentMode||void 0!=document.all&&"object"==typeof document.all||void 0!=window.ActiveXObject&&"function"==typeof window.ActiveXObject))return 1;
var b=!1;try{var d=document.createElement("p");d.innerText=".";d.style="text-shadow: rgb(99, 116, 171) 20px -12px 2px";b=void 0!=d.style.textShadow}catch(e){}return 0<Object.prototype.toString.call(window.HTMLElement).indexOf("Constructor")&&b&&void 0!=window.innerWidth&&void 0!=window.innerHeight?5:0}catch(k){return 0}}this.createRequest=function(){var c=!1,b=window,d=0,e=!1;try{for(dv_i=0;10>=dv_i;dv_i++)if(null!=b.parent&&b.parent!=b)if(0<b.parent.location.toString().length)b=b.parent,d++,c=!0;
else{c=!1;break}else{0==dv_i&&(c=!0);break}}catch(k){c=!1}0==b.document.referrer.length?c=b.location:c?c=b.location:(c=b.document.referrer,e=!0);var a=document.getElementsByTagName("script");for(dv_i in a)if(a[dv_i].src){var t=a[dv_i].src;if(t=t&&t.match(/bsredirect5(_plain)?\.js\?callback=/)?t.replace(/^.+?callback=(.+?)(&|$)/,"$1"):null)if((this.redirect=eval(t+"()"))&&!this.redirect.done)return this.redirect.done=!0,b=B(this.redirect,c,b,d,e,a[dv_i]&&a[dv_i].parentElement&&a[dv_i].parentElement.tagName&&
"HEAD"===a[dv_i].parentElement.tagName,a[dv_i]),b+="&"+this.getVersionParamName()+"="+this.getVersion()}};this.isApplicable=function(){return!0};this.onFailure=function(){};this.sendRequest=function(c){dv_sendRequest(c);return!0};if(window.debugScript&&(!window.minDebugVersion||10>=window.minDebugVersion))window.DvVerify=B,window.createRequest=this.createRequest;this.getVersionParamName=function(){return"ver"};this.getVersion=function(){return"21"}};


function dv_bs5_main(dv_baseHandlerIns, dv_handlersDefs) {

    this.baseHandlerIns = dv_baseHandlerIns;
    this.handlersDefs = dv_handlersDefs;

    this.exec = function () {
        try {
            window._dv_win = (window._dv_win || window);
            window._dv_win.$dvbsr = (window._dv_win.$dvbsr || new dvBsrType());

            window._dv_win.dv_config = window._dv_win.dv_config || {};
            window._dv_win.dv_config.bsErrAddress = window._dv_win.dv_config.bsAddress || 'rtb0.doubleverify.com';
            
            var errorsArr = (new dv_rolloutManager(this.handlersDefs, this.baseHandlerIns)).handle();
            if (errorsArr && errorsArr.length > 0)
                dv_SendErrorImp(window._dv_win.dv_config.bsErrAddress + '/verifyc.js?ctx=818052&cmp=1619415&num=5', errorsArr);
        }
        catch (e) {
            try {
                dv_SendErrorImp(window._dv_win.dv_config.bsErrAddress + '/verifyc.js?ctx=818052&cmp=1619415&num=5&dvp_isLostImp=1', { dvp_jsErrMsg: encodeURIComponent(e) });
            } catch (e) { }
        }
    }
}

try {
    window._dv_win = window._dv_win || window;
    var dv_baseHandlerIns = new dv_baseHandler();
	

    var dv_handlersDefs = [];

    if(!window.debugScript) {
        (new dv_bs5_main(dv_baseHandlerIns, dv_handlersDefs)).exec();
    }
} catch (e) { }