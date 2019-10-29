// OnInstall handler
chrome.runtime.onInstalled.addListener(details => {
  console.log(details)
})

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
	console.log(message)
	setTimeout(function(){
		sendResponse({a:1,b:2})
	}, 5000)
	return true
})