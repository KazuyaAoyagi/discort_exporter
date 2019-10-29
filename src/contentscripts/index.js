import './index.styl'

console.log('Content script working...6')

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    console.log("aaaa")
	console.log(message)
	setTimeout(function(){
		sendResponse({a:1,b:2})
	}, 5000)
	return true
})