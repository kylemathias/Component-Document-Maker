//var allComponents = $('n-call-out,n-card-band,n-fancy-callout,n-feature-tiles,n-hero,n-image-3tabs,n-image-with-tiles,n-intro,n-offset-cards,n-prose,n-quote-band,n-quote-band-tabbed,n-section-header,n-showcase,n-side-x-side,n-side-x-side-2-tabs,n-tabbed-band,n-tabbed-band-tiles,n-title'); //all components
var allComponents = []; //all components
console.log("icon clicked, background script ran");
//console.log(allComponents);
var currentDomain = window.location.href;
console.log(currentDomain);
var elements = [];
if (currentDomain.includes("quickwires.html")) {

  elements[0] = {};
} else {
  elements = $('n-page');
}
//console.log(elements);
//console.log(elements[0].outerHTML);
/*
$('a[href*="http://"]:not([href*="https://www.netapp.com/"])').each(function(index){
    $(this).attr('href',"https://www.netapp.com/"+$(this).attr('href'))
});
*/


var arrayOfComponents = [];

//for (var i = 0; i < allComponents.length; i++) {
// arrayOfComponents[i] = allComponents[i];
//}
//var pageMetaValues = $('head > meta');
var pageMetaValues ="";

var rawMetaHtml = '';

var htmlToSend='';

for(var i = 0; i < elements.length; i++){
htmlToSend = htmlToSend +  elements[i].outerHTML;
}







testSend();
//sendMessage();

function sendMessage() {
  chrome.runtime.sendMessage({
    greeting: "hello"
  }, function (response) {

    console.log(response.farewell);
  });
}

function testSend() {
  //var htmlToSend = "";
  //for (var i = 0; i < allComponents.length; i++) {
    //htmlToSend += allComponents[i].innerHTML;

  //}
  console.log(htmlToSend);
  chrome.runtime.sendMessage(htmlToSend);

}