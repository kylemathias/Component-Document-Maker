function sendPasteToContentScript(toBePasted) {
        
    toBePasted = "test Value";
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {data: toBePasted});
    });
}