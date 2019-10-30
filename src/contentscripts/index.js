import './index.styl'

console.log('Content script working...9')

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    console.log("aaaa")
	console.log(message)
	setTimeout(function(){
		sendResponse({a:1,b:2})
	}, 5000)
	return true
})


function injectScript(file, node) {
	var s, th;
	th = document.getElementsByTagName(node)[0];
	s = document.createElement('script');
	s.setAttribute('type', 'text/javascript');
	s.setAttribute('src', file);
	return th.appendChild(s);
  };


  injectScript(chrome.extension.getURL('bedbjalpdghkamdpclmgcankaidmlggg/embed.js'), 'body');


