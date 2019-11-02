import './index.styl'

console.log('Content script working...13')

function injectScript(file, node) {
	var s, th;
	th = document.getElementsByTagName(node)[0];
	s = document.createElement('script');
	s.setAttribute('type', 'text/javascript');
	s.setAttribute('src', file);
	return th.appendChild(s);
  };

  function injectStyle(file, node) {
	var s, th;
	th = document.getElementsByTagName(node)[0];
	let link= document.createElement('link');
	link.rel  = 'stylesheet';
	link.type = 'text/css';
	link.href = file;
	link.media = 'all';
	return th.appendChild(link);
  };

  injectStyle(chrome.extension.getURL('contentScripts.css'), 'head')
  injectScript(chrome.extension.getURL('embed.js'), 'body');
  
