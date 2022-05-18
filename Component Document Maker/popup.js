console.log("this is popup.js");
var query = {
    active: true,
    currentWindow: true
};
var reviewDomain = "https://ntapwwwprodstage-web9.azurewebsites.net";
//this runs the function on popup open
chrome.tabs.query(query, callback);

//this is a list of components that we will build html for. 
//We use postion [x][0] for the component name
//[x][1] is the file name
//[x][2] is the component html tag name
var listOfComponents = [
    ['Accordions', 'Accordions.html', 'n-accordion-band', ''],
    ['Back to Top', 'Back_to_Top.html', 'n-back-to-top', ''],
    ['Callout', 'Callout.html', 'n-call-out', ''],
    ['Card Band With Images', 'Card_Band_Images.html', 'n-card-band-images', ''],
    ['Card Band', 'Card_Band.html', 'n-card-band', ''],
    ['Fancy Callout', 'Fancy_Callout.html', 'n-fancy-callout', ''],
    ['Feature Tiles', 'Feature_Tiles.html', 'n-feature-tiles', ''],
    ['Hero', 'Hero_Full.html', 'n-hero', ''],
    ['Image with 3 Tabs', 'Image_with_3_Tabs.html', 'n-image-3tabs', ''],
    ['Image with Tiles', 'Image_with_Tiles.html', 'n-image-with-tiles', ''],
    ['Intro', 'Intro.html', 'n-intro', ''],
    ['Logo Band', 'Logo_Band.html', 'n-logo-band', ''],
    ['Offset Cards', 'Offset_Cards.html', 'n-offset-cards', ''],
    ['Page Component', 'Page_Component.html', 'n-page', ''],
    ['Page Guidelines', 'Page_Guidelines.html', 'n-page-guidelines', ''],
    ['Press Release Article', 'Press_Release_Article.html', 'n-press-release-article', ''],
    ['Product Comparison Table', 'Product_Comparison_Table.html', 'n-product-comparison-table', ''],
    ['Prose Author Bio', 'Prose_Author_Bio.html', 'n-prose-author-bio', ''],
    ['Prose Block Quote', 'Prose_Block_Quote.html', 'n-prose-block-quote', ''],
    ['Prose Customer Metadata', 'Prose_Customer_Metadata.html', 'n-prose-meta-side-bar', ''],
    ['Prose Event Card', 'Prose_Event_Card.html', 'n-prose-event-card', ''],
    ['Prose Event Sidebar', 'Prose_Event_Sidebar.html', 'n-prose-event-sidebar', ''],
    ['Prose Full-Width Illustration', 'Prose_Full-Width_Illustration.html', 'n-prose-illustration-full-width', ''],
    ['Prose II', 'Prose_II.html', 'n-prose-segment', ''],
    ['Prose Inline Media Player', 'Prose_Inline_Media_Player.html', 'n-prose-inline-media', ''],
    ['Prose Listicle', 'Prose_Listicle.html', 'n-prose-listicle', ''],
    ['Prose Rich Text Aside', 'Prose_Rich_Text_Aside.html', 'n-prose-aside', ''],
    ['Prose Table of Contents', 'Prose_Table_of_Contents.html', 'n-prose-table-of-contents', ''],
    ['Prose', 'Prose.html', 'n-prose', ''],
    ['ProseGroup Region', 'ProseGroup_Region.html', ' ', ''],
    ['Quote Band Tabbed', 'Quote_Band_Tabbed.html', 'n-quote-band-tabbed', ' '],
    ['Quote Band', 'Quote_Band.html', 'n-quote-band', ' '],
    ['Section Header', 'Section_HEader.html', 'n-section-header', ''],
    ['SEO - URL & Breadcrumb', 'SEO-_URL_Breadcrumb.html', 'seo-url-breadcrumb', ''],
    ['Showcase Product', 'Showcase_Product.html', 'n-showcase', ''],
    ['Side x Side', 'Side_x_Side.html', 'n-side-x-side', ''],
    ['Side by Side 2 Tab', 'Side_x_Side_2_Tabs.html', 'n-side-x-side-tabs', ''],
    ['Stat Band', 'Stat_Band.html', 'n-stat-band', ''],
    ['Tabbed Band with Tiles', 'Tabbed_Band_Tiles.html', 'n-tabbed-band-tiles', ''],
    ['Tabbed Band', 'Tabbed_Band.html', 'n-tabbed-band', ''],
    ['Title', 'Title.html', 'n-title', ''],
    ['', 'Page_Component.html', 'n-prose-left-aside', ''],
    ['', 'Page_Component.html', 'n-prose-right-aside', ''],
    ['', 'Page_Component.html', 'n-prose-main', ''],
    ['', 'Page_Component.html', 'n-prose-full-width', '']
]
//this is a list of TCM ids and names for there corresponding levels in the CMS hierarchy
//[x][0] Component name for the level
//[x][1] Component number for the page level in the TCM id
//[x][2] Component number for the Component level in the TCM id
//[x][3] Component name for the Component level in the TCM id
var listOfTcmIDs = [    
    ['040', '19', '4', '020C'],
    ['050 NL', '20', '15', '030C NL'],
    ['050 JA', '22', '16', '030C JA'],
    ['050 ES', '23', '14', '030C ES'],
    ['050 DE', '24', '9', '030C DE'],
    ['050 KO', '25', '12', '030C KO'],
    ['050 RU', '26', '17', '030C RU'],
    ['050 FR', '27', '10', '030C FR'],
    ['050 IT', '28', '11', '030C IT'],
    ['050 ZH-HANT', '29', '13', '030C ZH-HANT'],
    ['050 ZH-HANS', '30', '18', '030C ZH-HANS'],
];


var wordDocHtml = "";
var componentSearchString = "";

for (var i = 0; i < listOfComponents.length; i++) {
    if (listOfComponents[i][2] !== " ") {
        componentSearchString += listOfComponents[i][2] + ",";
    }
}
if (componentSearchString.charAt(componentSearchString.length - 1) === ",") {
    //remove the last comma
    componentSearchString = componentSearchString.substring(0, componentSearchString.length - 1);
}
//console.log(componentSearchString);

//this function populate the list of components with corresponding html
//it then proceeds to call the function related to what url is currently open in the user's current tab
function addComponentsHtmlToArray(currentTab) {
    var client = new XMLHttpRequest();
    for (i = 0; i < listOfComponents.length; i++) {
        //console.log("current i");
        //console.log(i);
        (function (i) {
            client[i] = new XMLHttpRequest();
            //path is the parent menu item id + the file name
            client[i].open('POST', 'Templates' + '/' + listOfComponents[i][1]);
            client[i].onreadystatechange = function () {
                //console.log("client ");
                //console.log(client[i]);
                if (client[i].readyState == 4 && client[i].status == 200) {
                    listOfComponents[i][3] = client[i].response;

                    //console.log(listOfComponents[i][0]);
                    //console.log(listOfComponents[i][3]);
                    if ((i + 1) >= listOfComponents.length) {
                        console.log("Loaded.");

                        //after components are loaded into the array, what function do we want to call?
                        if (currentTab.url.startsWith("https://ntapwwwprodstage-web9.azurewebsites.net/quickwires.html") || currentTab.url.startsWith("https://ntapwwwtest-web9.azurewebsites.net/quickwires.html")) {
                            findComponentsInURL(currentTab);
                        } else {
                            if (currentTab.url.startsWith("https://ntapwwwprodstage-web9.azurewebsites.net/") || currentTab.url.startsWith("https://ntapwwwtest-web9.azurewebsites.net/")) {
                                $.get(currentTab.url, function (data) {
                                    //console.log(data);
                                    generateReviewHtml(data, currentTab);

                                }).fail(function () {
                                    setMessage(null, null, "Error: Could not load the page.(<a href='https://ntapwwwprodstage-web9.azurewebsites.net/' target ='_blank'>Review</a> Down?)");
                                    stopLoader();
                                });
                            }
                        }
                    }
                }
            }
            client[i].send();
        })(i);
    }
}


function stopLoader() {
    $('#page > div > h3').html('Loaded!');
    $('#page > div > i.loader__tile.loader__tile__1').css('animation-name', 'none');
    $('#page > div > i.loader__tile.loader__tile__2').css('animation-name', 'none');
    $('#page > div > i.loader__tile.loader__tile__3').css('animation-name', 'none');
    $('#page > div > i.loader__tile.loader__tile__4').css('animation-name', 'none');
    $('#page > div > i.loader__tile.loader__tile__5').css('animation-name', 'none');
    $('#page > div > i.loader__tile.loader__tile__6').css('animation-name', 'none');
    $('#page > div > i.loader__tile.loader__tile__7').css('animation-name', 'none');
    $('#page > div > i.loader__tile.loader__tile__8').css('animation-name', 'none');
    $('#page > div > i.loader__tile.loader__tile__9').css('animation-name', 'none');
}
//setTimeout(stopLoader, 3 * 1000);
//hide loder while working on page
//stopLoader();

//set what we are quering for, we want the active tab and is a current window


//create a document
function download(filename, text) {
    //following meta tag is needed to help format the html for word
    text = "<meta http-equiv='Content-Type' content='text/html; charset=UTF-8'></meta>" + text;
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

var currentTab;
//this will run if the popup is opened
function callback(tabs) {
    currentTab = tabs[0]; // there will be only one in this array
    console.log(currentTab); // also has properties like currentTab.id
    var reviewUrl = document.createElement('a');
    reviewUrl.href = "https://ntapwwwprodstage-web9.azurewebsites.net/";
    reviewUrl.target = "_blank";
    reviewUrl.innerHTML = "Stage Environment";

    var quickWire = document.createElement('a');
    quickWire.href = "https://ntapwwwprodstage-web9.azurewebsites.net/quickwires.html";
    quickWire.target = "_blank";
    quickWire.innerHTML = "Quickwires";

    if (currentTab.url.startsWith("https://ntapwwwprodstage-web9.azurewebsites.net/") != true && currentTab.url.startsWith("https://ntapwwwtest-web9.azurewebsites.net/") != true && currentTab.url.startsWith("https://www.netapp.com/") != true) {
        
        //to do
        replaceButtonWIthLink(reviewDomain, " Review ");
        setMessage("To Get Started", "To use this extension, please navigate to NetApp.com's " + reviewUrl.outerHTML + " or to create a new page use this extension on our mock up tool " + quickWire.outerHTML + " <sup>™</sup>", "Navigate to Review");
        stopLoader();

    } else {
        if (currentTab.url.startsWith("https://www.netapp.com/")) {
            stopLoader();
            document.getElementById("main-heading").innerHTML = "We Are On netapp.com";
            var reviewUrl = currentTab.url.replace("https://www.netapp.com/", "https://ntapwwwprodstage-web9.azurewebsites.net/");
            var pageLink = document.createElement("a");
            pageLink.setAttribute("target", "_blank");
            pageLink.innerHTML = "Review Link";
            pageLink.href = reviewUrl;
            //console.log(pageLink.outerHTML);
            replaceButtonWIthLink(reviewUrl, " Review");
            setMessage("We are on the Live Site", "You are on the live site of netapp.com. If you would like to get a Word document version of this page, you can do so at this " + pageLink.outerHTML + " or to create a new page use this extension on our mock up tool " + quickWire.outerHTML + " <sup>™</sup>", "Navigate to Review");
        }
        var components = currentTab.url.split("#"); //get the string after "#" in the URL    
        if (currentTab.url.startsWith("https://ntapwwwprodstage-web9.azurewebsites.net/quickwires.html")|| currentTab.url.startsWith("https://ntapwwwtest-web9.azurewebsites.net/quickwires.html")) {
            setMessage("We are on the Quickwires<sup>™</sup> page", "Your document is being generated and will be available to download shortly.", "Generating Document...");
            addComponentsHtmlToArray(currentTab);
        } else {
            if (currentTab.url.startsWith("https://ntapwwwprodstage-web9.azurewebsites.net/") || currentTab.url.startsWith("https://ntapwwwtest-web9.azurewebsites.net/")) {
                setMessage("We Are On a Stage Page", "Your document is being generated and will be available to download shortly.", "Generating Document...");
                addComponentsHtmlToArray(currentTab);
            }
        }



    }





    function runFileBuilder() {
        chrome.tabs.executeScript(null, {
            file: "jquery-3.6.0.slim.min.js"
        });
    }


}
function replaceButtonWIthLink(link, buttonText) {
    var svgArrowRigth = "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='currentColor' class='bi bi-box-arrow-in-right' viewBox='0 0 16 16'>"+
    "<image xlink:href='media/box-arrow-in-right.svg'/>"+
    "</svg>";

    document.getElementById("download-btn").innerHTML = buttonText + svgArrowRigth;
    document.getElementById("download-btn").addEventListener("click", function () {
        window.open(link);
    });
    document.getElementById("download-btn").removeAttribute("disabled");
}

function setMessage(heading, parapgraph, loaderHeading) {

    if (heading == null) {
        //do nothing
    } else {
        document.getElementById("main-heading").innerHTML = heading;
    }

    if (parapgraph == null) {
        //do nothing
    } else {
        document.getElementById("main-paragraph").innerHTML = parapgraph;
    }

    if (loaderHeading == null) {
        //do nothing
    } else {
        document.getElementById("loader-heading").innerHTML = loaderHeading;
    }


}

function findComponentsInURL(currentTab) {
    var selectCompontMessage = "To generate a component document select the components from the drop-down menu on the right-hand side."
    if (currentTab.url.includes("#") == true) {
        var components = currentTab.url.split("#"); //get the string after "#" in the URL
        console.log(components);
        if (components.length > 1 && components[1] != "") {
            components = components[1].split(".");
            for (var i = 0; i < components.length; i++) {

                components[i] = components[i].replace(/[0-9]|\&/g, '');
                //console.log(components[i]);
                if (components[i] == "" || components[i] == '') {

                }
            }
            //remove empty strings 
            components = components.filter(Boolean);
            buildQuickWiresHtml(components);
        } else {
            setMessage("We Are on the Quickwires<sup>™</sup> page", selectCompontMessage, "</br>");
            stopLoader();
        }
    } else {
        setMessage("We Are on the Quickwires<sup>™</sup> page", selectCompontMessage, "</br>");
        stopLoader();
    }

}

function buildQuickWiresHtml(components) {
    var tempDiv = document.createElement("div");
    wordDocHtml += getComponentHtml("seo-url-breadcrumb");
    wordDocHtml += getComponentHtml("n-page");

    //add each component html to the word document
    for (var i = 0; i < components.length; i++) {
        for (var j = 0; j < listOfComponents.length; j++) {
            if (components[i] == listOfComponents[j][2])
                wordDocHtml = wordDocHtml + listOfComponents[j][3];
        }

    }
    tempDiv.innerHTML = wordDocHtml;
    //$(tempDiv).find("table").attr("style", "border: 4px solid green;");
    //tempDiv = addNewBorder(tempDiv);


    //add download function
    document.getElementById("download-btn").addEventListener("click", function () {
        download("quickwires-" + getCurentTimeStamp() + ".doc", tempDiv.innerHTML);

    });

    //enable the button
    const button = document.getElementById("download-btn");
    button.disabled = false;

    //set success message
    setMessage(null, null, "Document Ready!");
    stopLoader();
}

function addNewBorder(element) {
    $(element).find("table").attr("style", "border: 3px solid green;");
    return element;
}

function generateReviewHtml(pageHtml, currentTab) {
    var htmlObject = document.createElement('html');
    htmlObject.innerHTML = pageHtml;

    var documentName = generateDocumentName(htmlObject);

    //add seo to the document
    //wordDocHtml += 'data:application/vnd.ms-word;charset=utf-8,';
    //wordDocHtml += "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
    wordDocHtml += getComponentHtml("n-page-guidelines");
    wordDocHtml += populateSEOhtml(htmlObject, currentTab);
    wordDocHtml += buildWebProdHtml(htmlObject, currentTab);
    wordDocHtml += buildPageComponentHtml(htmlObject);
    //wordDocHtml += "</body></html>";



    document.getElementById("download-btn").addEventListener("click", function () {
        download(documentName + getCurentTimeStamp() + ".doc", wordDocHtml);

    });

    setMessage(null, null, "Document Ready!");
    const button = document.getElementById("download-btn");
    button.disabled = false;
    stopLoader();
}

function generateDocumentName(htmlObject) {
    var documentName = "";
    var title = $(htmlObject).find("head > title");

    if (typeof title[0] !== 'undefined') {
        var pageTitle = title[0].innerText.split("|");
        documentName = pageTitle[0].trim();

    } else {
        var tempALink = document.createElement('a');
        tempALink.href = currentTab.url;

        documentName = tempALink.pathname;
    }
    return documentName;

}

function populateSEOhtml(htmlObject, currentTab) {
    //create a temporary object to hold the html
    var seoObject = document.createElement('div');
    seoObject.innerHTML = getComponentHtml("seo-url-breadcrumb");
    var pageSEO = $(htmlObject).find("body > n-seo-region > div");
    var seoImage = $(htmlObject).find("meta[property='og:image']");
    var seoDescription = $(htmlObject).find("meta[name='description']");
    var seoTitle = $(htmlObject).find("head > title");
    //console.log(pageSEO);
    $(seoObject).find("#heading-append").after(appendCmsInfo(getCommentInfoFrom(pageSEO, "ComponentID"), toBrowserTime(getCommentInfoFrom(pageSEO, "ComponentModified"))));

    var imageLink = document.createElement("img");
    if (typeof seoImage[0] !== 'undefined') {
        imageLink.src = seoImage[0].content;
    }





    //create a link from the current tab
    var url = currentTab.url.replace("https://ntapwwwprodstage-web9.azurewebsites.net/", "https://www.netapp.com/");
    var liveLink = document.createElement('a');
    liveLink.setAttribute("target", "_blank");
    liveLink.innerHTML = url;
    liveLink.href = url;

    var reviewLink = document.createElement('a');
    reviewLink.setAttribute("target", "_blank");
    reviewLink.innerHTML = currentTab.url;
    reviewLink.href = currentTab.url;

    //set values in SEO html    
    $(seoObject).find("#live-url").html(liveLink);
    $(seoObject).find("#review-url").html(reviewLink);
    $(seoObject).find("#seo-image").html(createImageHtml(imageLink));
    if (typeof seoDescription[0] !== 'undefined') {
        $(seoObject).find("#page-description").html(seoDescription[0].content);
    }
    if (typeof seoTitle[0] !== 'undefined') {
        $(seoObject).find("#page-title").html(seoTitle[0].innerHTML);
    }

    if (typeof seoTitle[0] == 'undefined' && typeof seoDescription[0] == 'undefined' && typeof seoImage[0] == 'undefined') {
        seoObject = addNewBorder(seoObject);
    }


    return seoObject.innerHTML;
}

function buildWebProdHtml(htmlObject, currentTab) {
    var pageObject = document.createElement('div');
    pageObject.innerHTML = getComponentHtml("n-page");
    var pageSEO = $(htmlObject).find("body");
    var breadCrumb = $(htmlObject).find("n-breadcrumb");

    //create a link from the current tab
    var url = currentTab.url.replace("https://ntapwwwprodstage-web9.azurewebsites.net/", "https://www.netapp.com/");
    var liveLink = document.createElement('a');
    liveLink.setAttribute("target", "_blank");
    liveLink.innerHTML = url;
    liveLink.href = url;

    var reviewLink = document.createElement('a');
    reviewLink.setAttribute("target", "_blank");
    reviewLink.innerHTML = currentTab.url;
    reviewLink.href = currentTab.url;

    $(pageObject).find("#heading-append").after(appendCmsInfo(getCommentInfoFrom(pageSEO, "PageID"), toBrowserTime(getCommentInfoFrom(pageSEO, "PageModified"))));
    $(pageObject).find("#page-url").html(liveLink);
    $(pageObject).find("#stage-url").html(reviewLink);

    var metaTags = $(htmlObject).find("meta[property='article:tag'], meta[name='AssetType'], meta[name='AssetSubtype'], meta[name='AssetDescriptor'], meta[name='TargetAudience'], meta[name='BuyerStage'], meta[name='JobTitlesFunctions'], meta[name='Campaign'], meta[name='ProgramTopic'], meta[name='Event'], meta[name='EventDescriptor'], meta[name='SessionType'], meta[name='Department'], meta[name='Product'], meta[name='Services'], meta[name='Geo'], meta[name='GeoRegion'], meta[name='CountryRegion'], meta[name='Hyperscaler'], meta[name='Industry']");

    for (var i = 0; i < metaTags.length; i++) {
        var metaTag = metaTags[i];
        var metaTagName = metaTag.getAttribute("name");
        var metaProperty = metaTag.getAttribute("property");
        var metaTagValue = metaTag.getAttribute("content");
        $(pageObject).find("#tag-" + metaTagName).html(metaTagValue);
        if (metaProperty == "article:tag") {
            $(pageObject).find("#tag-Custom").html(metaTagValue);
        }
    }

    if (typeof breadCrumb[0] !== 'undefined') {
        $(pageObject).find("#breadcrumb").html(createBreadCrumb(breadCrumb[0]));
        $(pageObject).find("#breadcrumb-enabled").html("Yes");
    }

    return pageObject.innerHTML;
}

function getComponentHtml(componentName) {
    for (var i = 0; i < listOfComponents.length; i++) {
        if (listOfComponents[i][2] == componentName) {
            return listOfComponents[i][3];
        }
    }
}

function createBreadCrumb(htmlObject) {
    $(htmlObject).find("a").each(function () {
        createLinkData(this, "link")
    });
    var breadCrumbLinks = $(htmlObject).find("li > a, li > span");
    var breadCrumb = document.createElement('p');




    for (var i = 0; i < breadCrumbLinks.length; i++) {

        breadCrumb.innerHTML += " <a href='" + breadCrumbLinks[i].href + "'>" + breadCrumbLinks[i].innerHTML + "</a> ";
        if (i != breadCrumbLinks.length - 1) {
            breadCrumb.innerHTML += "&nbsp;/&nbsp;";
        }
    }

    return breadCrumb.innerHTML;

}

function getCurentTimeStamp() {

    const today = new Date(Date.now());
    var monthDatYear = today.toLocaleDateString();
    monthDatYear = monthDatYear.replace(/\//g, "-");
    var currentTime = today.toLocaleTimeString();
    currentTime = currentTime.replace(/\:/g, "_");
    currentTime = currentTime.replace(/\s/g, "");
    var zone = new Date().toLocaleTimeString('en-us', {
        timeZoneName: 'short'
    }).split(' ')[2];

    var finalTimeStamp = monthDatYear + "-" + currentTime + "-" + zone;


    return finalTimeStamp;
}

function toBrowserTime(dateGiven) {
    //console.log(dateGiven);
    const today = new Date(dateGiven + "Z");
    // console.log(today);
    var monthDatYear = today.toLocaleDateString();
    monthDatYear = monthDatYear.replace(/\//g, "-");
    var currentTime = today.toLocaleTimeString();
    //currentTime = currentTime.replace(/\:/g, "_");
    currentTime = currentTime.replace(/\s/g, "");
    var zone = new Date().toLocaleTimeString('en-us', {
        timeZoneName: 'short'
    }).split(' ')[2];

    var finalTimeStamp = monthDatYear + "-" + currentTime + "-" + zone;


    return finalTimeStamp;
}

function createLinkData(aObject, returnType) {
    var linkText = "";
    var linkHref = "";

    var currentTabUrl = document.createElement('a');
    currentTabUrl.href = currentTab.url;

    if (typeof aObject !== 'undefined') {
        if (aObject.href == "https://ntapwwwprodstage-web9.azurewebsites.net/popup.html") {
            aObject.href = currentTab.url;
        }

        aObject.href = aObject.href.replace("popup.html", currentTabUrl.pathname);
    }

    if (typeof aObject !== 'undefined') {
        $(aObject).find('title').remove();
    }

    if (typeof aObject !== 'undefined') {
    if (aObject.classList.contains("cta--video")) {
        var videoJson = new Object();
        videoJson = aObject.dataset;
        videoJson = JSON.parse(videoJson.nBc);


        //console.log("json: ");
        //console.log(videoJson);
        var videoId = videoJson.videoId;
        var accountId = videoJson.accountId;
        if (accountId == undefined) {
            accountId = "260701648001";
        }
        var brightCoveUrl = "https://players.brightcove.net/" + accountId + "/default_default/index.html?videoId=" + videoId;

        linkHref = "<a href='" + brightCoveUrl + "'>" + brightCoveUrl + "</a>";
        linkText = aObject.innerText;

        // console.log(linkHref);
    } else {
        aObject.href = aObject.href.replace(window.location.origin, reviewDomain);
        linkHref = "<a href='" + aObject.href + "'>" + aObject.href + "</a>";
        linkText = aObject.innerText;
    }
}


    if (returnType == "link") {
        return linkHref;
    } else if (returnType == "linkText") {
        return linkText;
    }
}

function createIframeLink(iframeObject) {
    var linkText = "";
    var linkHref = "";

    if (typeof $(iframeObject).attr("data-src") !== 'undefined') {
        linkHref = $(iframeObject).attr("data-src");
        linkText = $(iframeObject).attr("data-src");
    }
    linkHref = removeStartingSlashesFromString(linkHref);
    var linkHtml = "<a href='" + linkHref + "'>" + linkHref + "</a>";
    return linkHtml;

}

function removeStartingSlashesFromString(string) {
    console.log("run function: " + string);
    var returnString = string;
    if (string.charAt(0) == "/") {
        string = string.substring(1);
        string = removeStartingSlashesFromString(string);
    }
    return string;


}

function buildPageComponentHtml(htmlObject) {
    var pageComponents = $(htmlObject).find(componentSearchString);
    console.log(pageComponents);
    var pageComponentHtml = "";

    for (var i = 0; i < pageComponents.length; i++) {

        if (pageComponents[i].localName == "n-accordion-band") {
            pageComponentHtml += buildAccordionBandHtml(pageComponents[i]);
        }
        if (pageComponents[i].localName == "n-back-to-top") {
            pageComponentHtml += buildBackToTopHtml(pageComponents[i]);
        }
        if (pageComponents[i].localName == "n-call-out") {
            pageComponentHtml += buildCallOut(pageComponents[i]);
        }
        if (pageComponents[i].localName == "n-card-band-images") {
            pageComponentHtml += buildCardBandImages(pageComponents[i]);
        }
        if (pageComponents[i].localName == "n-card-band") {
            pageComponentHtml += buildCardBandHtml(pageComponents[i]);
        }
        if (pageComponents[i].localName == "n-fancy-callout") {
            pageComponentHtml += buildFancyCallout(pageComponents[i]);
        }
        if (pageComponents[i].localName == "n-feature-tiles") {
            pageComponentHtml += buildFeatureTiles(pageComponents[i]);
        }
        if (pageComponents[i].localName == "n-hero") {
            pageComponentHtml += buildHero(pageComponents[i]);
        }
        if (pageComponents[i].localName == "n-image-3tabs") {
            pageComponentHtml += buildImageWithTabs(pageComponents[i]);
        }
        if (pageComponents[i].localName == "n-image-with-tiles") {
            pageComponentHtml += buildImageWithTiles(pageComponents[i]);
        }
        if (pageComponents[i].localName == "n-intro") {
            pageComponentHtml += buildIntro(pageComponents[i]);
        }
        if (pageComponents[i].localName == "n-logo-band") {
            pageComponentHtml += buildLogoBand(pageComponents[i]);
        }
        if (pageComponents[i].localName == "n-product-comparison-table") {
            pageComponentHtml += buildProductComparisonTable(pageComponents[i]);
        }
        if (pageComponents[i].localName == "n-offset-cards") {
            pageComponentHtml += buildOffSetCards(pageComponents[i]);
        }
        if (pageComponents[i].localName == "n-quote-band") {
            //quote band components are in quote band tabs component. We need to make sure the current quote band is not in the quote band tabs.
            var isQuoteTab = false;
            if (pageComponents[i].parentNode.parentNode.className == "tab-content-container") {
                isQuoteTab = true;
            }
            if (isQuoteTab === false) {
                pageComponentHtml += buildQuoteBand(pageComponents[i]);
            }
        }
        if (pageComponents[i].localName == "n-quote-band-tabbed") {
            pageComponentHtml += buildQuoteBandTabbed(pageComponents[i]);
        }
        if (pageComponents[i].localName == "n-section-header") {
            pageComponentHtml += buildSectionHeader(pageComponents[i]);
        }
        if (pageComponents[i].localName == "n-showcase") {
            pageComponentHtml += buildShowcase(pageComponents[i]);
        }
        if (pageComponents[i].localName == "n-side-x-side") {
            pageComponentHtml += buildSideXSide(pageComponents[i]);
        }
        if (pageComponents[i].localName == "n-side-x-side-tabs") {
            pageComponentHtml += buildSideXSideTabs(pageComponents[i]);
        }
        if (pageComponents[i].localName == "n-stat-band") {
            pageComponentHtml += buildStatBand(pageComponents[i]);
        }
        if (pageComponents[i].localName == "n-title") {
            pageComponentHtml += buildTitle(pageComponents[i]);
        }
        if (pageComponents[i].localName == "n-tabbed-band") {
            pageComponentHtml += buildTabbedBand(pageComponents[i]);
        }
        if (pageComponents[i].localName == "n-tabbed-band-tiles") {
            pageComponentHtml += buildTabbedBandTiles(pageComponents[i]);
        }
        if (pageComponents[i].localName == "n-prose-left-aside") {
            pageComponentHtml += buildProseLeftAside(pageComponents[i]);
        }
        if (pageComponents[i].localName == "n-prose-right-aside") {
            pageComponentHtml += buildProseRightAside(pageComponents[i]);
        }

        if ((pageComponents[i].localName == "n-prose-segment" && $(pageComponents[i]).attr("data-ntap-analytics-region") == "ProseRegionArticle") || (pageComponents[i].localName == "n-prose-segment" && pageComponents[i].firstElementChild.localName == "n-xpm-eyebrow")) {
            pageComponentHtml += buildProseArticle(pageComponents[i]);
        }
        if (pageComponents[i].localName == "n-prose-listicle") {
            pageComponentHtml += buildProseListicle(pageComponents[i]);
        }

        if (pageComponents[i].localName == "n-prose-table-of-contents") {

        }

        if (pageComponents[i].localName == "n-prose-inline-media") {
            pageComponentHtml += buildProseInlineMedia(pageComponents[i]);
        }
        if (pageComponents[i].localName == "n-prose-author-bio") {
            pageComponentHtml += buildProseAuthorBio(pageComponents[i]);
        }
        if (pageComponents[i].localName == "n-prose-event-card") {
            pageComponentHtml += proseEventCard(pageComponents[i]);
        }

        if (pageComponents[i].localName == "n-prose-full-width") {
            pageComponentHtml += buildProseFullWidth(pageComponents[i]);
        }

        if(pageComponents[i].localName == "n-press-release-article") {
            pageComponentHtml += buildPressReleaseArticle(pageComponents[i]);
        }

    }

    pageComponentHtml = cleanUpHtml(pageComponentHtml);

    return pageComponentHtml;
}

function cleanUpHtml(pageComponentHtml) {
    var chromeDomain = window.location.origin;

    /*
    //repllace all chrome domain href with netapp domain
    pageComponentHtml = pageComponentHtml.replace(chromeDomain, reviewDomain);

    //replace all chrome domain with current tab url
    pageComponentHtml = pageComponentHtml.replace(chromeDomain, currentTab.url);
    pageComponentHtml = pageComponentHtml.replace("/popup.html", "");
    pageComponentHtml = pageComponentHtml.replace(chromeDomain + "/popup.html", currentTab.url);
    pageComponentHtml = pageComponentHtml.replace(chromeDomain, currentTab.url);
    pageComponentHtml = pageComponentHtml.replace('href="/', 'href="' +reviewDomain+'/');
    */


    return pageComponentHtml;
}


//this function will get the first comment for the giving object, and return the name of the Id requested.
function getCommentInfoFrom(htmlObject, nameOfId) {
    var tcmId = "";
    var comments = getComments(htmlObject);   

    //this section is needed because customer story components place there tcm ids in the parents comment.
    //So we will check parent nodes for comments, and try to get a TCM id form there.
    if(typeof htmlObject.length>0) {    
    if (comments.length === 0) {
        if(typeof htmlObject.parentNode !== "undefined") {
        comments = getComments(htmlObject.parentNode);
        }
    }
    if (comments.length === 0) {              
        comments = getComments(htmlObject.parentNode.parentNode);        
    } 
}   
    
    for (var i = 0; i < comments.length; i++) {
        var breakThisLoop = false;
        var currentComment = comments[i].data;
        currentComment = currentComment.substring(currentComment.indexOf("{"));        
        
       
        //if we do not have a valid comment with json in it, we want to skip this comment.
        if(isJsonString(currentComment)==false){
        break;
        }

        //this will take the current comment, check to see if it contains any key that matches the nameOfId
        //if it dose, we will then return that value from the comment.
        JSON.parse(currentComment, function (key, value) {            
            if (key == nameOfId) {                
                tcmId = value;                
                breakThisLoop = true;
            }
            return value;
        });


        //if we have found the id we want, we can break out of the loop.
        if (breakThisLoop == true) {
            break;
        }
    }

    return tcmId;

}

//check if we have a valir json string
function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

//this function will get all the comments for the giving object and return it in a object array.
function getComments(htmlObject) {
    var comments = [];
    $(htmlObject).contents().filter(function () {
        //nodeType == 8 is a comment       
        if (this.nodeType == 8) {
            comments.push(this);
        }

    });
    return comments;
}

//this function will create cms html links for a giving tcmID with a date modified provided
function appendCmsInfo(tcmID, componentModDate) {
    var appendingHtml = "";
    var cmsLinkSection = "<p id='cms-link' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>CMS link(s):<br> " + createCmsLinks(tcmID) + "<span style='color: black;'></span></em></p>";


    var cmsDateModifiedSection = "<p id='cms-link' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>Component Modified: " + componentModDate + "<span style='color: black;'></span></em></p>";
    appendingHtml = cmsLinkSection + cmsDateModifiedSection;

    //console.log(tcmID);

    return appendingHtml;

}

function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

//this function will create html for a given image object that we can then insert into a html page
function createImageHtml(imageObject) {
    //console.log("imageObject: ");
    //console.log(imageObject);
    var imageHtml = "";
    var imageSrc = imageObject.src;
    var aLinktext = imageObject.src;
    if (imageSrc.startsWith("data:image")) {
        //if we start with a data image, get the dataset src
        imageSrc = imageObject.dataset.src;
        aLinktext = imageObject.dataset.src;

        //if the image starts with a slash, add the review domain
        if (imageSrc.startsWith("/")) {
            imageSrc = reviewDomain + imageSrc;
        }

    }
    var imageAlt = imageObject.alt;
    var imageTitle = imageObject.title;
    var imageWidth = "200";
    var imageId = imageObject.id;
    var imageClass = imageObject.className;
    var imageStyle = imageObject.style;
    //create dom html img element
    imageSrc = imageSrc.replace(window.location.origin, reviewDomain);
    aLinktext = aLinktext.replace(window.location.origin, "");
    //imageHtml = "<img src='" + imageSrc + "' alt='" + imageAlt + "' title='" + imageTitle + "' width='" + imageWidth + "' id='" + imageId + "' class='" + imageClass + "' style='" + imageStyle + "' data-set:>";
    imageHtml += "<a href='" + imageSrc + "' target='_blank'>" + aLinktext + "</a>";

    return imageHtml;
}

//this function will create CMS links for a giving tcmID for a component. Based on the TCM id level, it will produce the proper links.
function createCmsLinks(tcmID) {
    var tcmLinks = "";
    //this is the tcm number for the level it is on
    var tcmNumberLevel = tcmID.substring(tcmID.indexOf("tcm:") + 4, tcmID.indexOf("-"));
    var indexOfTcmNumber = 0;
    for (var i = 0; i < listOfTcmIDs.length; i++) {
        if (listOfTcmIDs[i][1] == tcmNumberLevel) {
            indexOfTcmNumber = i;
            break;
        }
    }
    console.log(tcmID.replace(tcmNumberLevel, listOfTcmIDs[0][2]));
    // create the 020 if we are not on a component, tmcID 4
    if (!tcmID.includes("-64")) {
        tcmLinks += "<a href='https://sites-cm-netapp-production.tridion.sdlproducts.com/WebUI/item.aspx?tcm=16#id=" + tcmID.replace(tcmNumberLevel, listOfTcmIDs[0][2]) + "'>" + listOfTcmIDs[0][3] + " " + tcmID.replace(tcmNumberLevel, listOfTcmIDs[0][2]) + " </a><br>";
    }

    //create component link for 040
    if (tcmID.includes("-64")) {
        tcmLinks += "<a href='https://sites-cm-netapp-production.tridion.sdlproducts.com/WebUI/item.aspx?tcm=64#id=" + tcmID.replace(tcmNumberLevel, listOfTcmIDs[0][1]) + "'>" + listOfTcmIDs[0][0] + " " + tcmID.replace(tcmNumberLevel, listOfTcmIDs[0][1]) + " </a><br>";

    }


    //if we have a TCM id in the 050, make the 030 Link too.
    if (!tcmID.includes("-64") && (tcmID.includes("tcm:20-") || tcmID.includes("tcm:22-") || tcmID.includes("tcm:24-") || tcmID.includes("tcm:25-") || tcmID.includes("tcm:26-") || tcmID.includes("tcm:27-") || tcmID.includes("tcm:28-") || tcmID.includes("tcm:29-") || tcmID.includes("tcm:30-"))) {
        tcmLinks += "<a href='https://sites-cm-netapp-production.tridion.sdlproducts.com/WebUI/item.aspx?tcm=16#id=" + tcmID.replace(tcmNumberLevel, listOfTcmIDs[indexOfTcmNumber][2]) + "'>" + listOfTcmIDs[indexOfTcmNumber][3] + " " + tcmID.replace(tcmNumberLevel, listOfTcmIDs[indexOfTcmNumber][2]) + " </a><br>";
    }

    //creat the 040 or 050 link we have
    if (!tcmID.includes("-64")) {
        tcmLinks += "<a href='https://sites-cm-netapp-production.tridion.sdlproducts.com/WebUI/item.aspx?tcm=16#id=" + tcmID + "'>" + listOfTcmIDs[indexOfTcmNumber][0] + " " + tcmID + " </a>";
    } else {
        //if we are not on a 19 page, make 050 link
        if (tcmNumberLevel != "19") {
            tcmLinks += "<a href='https://sites-cm-netapp-production.tridion.sdlproducts.com/WebUI/item.aspx?tcm=64#id=" + tcmID + "'>" + listOfTcmIDs[indexOfTcmNumber][0] + " " + tcmID + " </a>";
        }

    }



    return tcmLinks;
}

//tables in word when converted from HTMl do no put borders on the table. This funciton will add boarders to any table tag in a given html object
function formatInLineTable(object) {
    $(object).find("img").removeAttr("width");
    $(object).find("img").attr("width", "640px");
    $(object).find("table, th, td").attr("border", "1");
    return object;
}


function buildAccordionBandHtml(currentComponent) {
    var tempObject = document.createElement('div');
    tempObject.innerHTML = getComponentHtml("n-accordion-band");

    //add cms info to the word dock html
    $(tempObject).find("#heading-append").after(appendCmsInfo(getCommentInfoFrom(currentComponent.parentNode, "ComponentID"), toBrowserTime(getCommentInfoFrom(currentComponent.parentNode, "ComponentModified"))));
    $(tempObject).find("#delete-for-content").remove();

    var naccordions = $(currentComponent).find("div.n-accordions");

    for (var i = 0; i < naccordions.length; i++) {
        //get the content we need
        var headline = $(naccordions[i]).find("span.n-accordion-title");
        var subhead = $(naccordions[i]).find("span.n-accordion-subheader");
        var bodyAndCTA = $(naccordions[i]).find("n-xpm-richtext, a.cta");        

        //if we find more than 3 accordions, we need to add a new section to the html document
        
            var accordionSection = "<tr>" +
                "<td style='width: 467.2pt; border: solid black 1.0pt; border-top: none; background: #E7E6E6; padding: 0in 0in 0in 0in;' valign='top'>\n" +
                "<p style='margin: 0in; text-align: center; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em><span style='color: black;'>Accordion " + (i + 1) + "</span></em></p>\n" +
                "</td>" +
                "</tr>" +
                "<tr style='height: 54.6pt;'>" +
                "<td id ='accordion-" + (i + 1) + "' style='width: 467.2pt; border: solid black 1.0pt; border-top: none; padding: 0in 0in 0in 0in;' valign='top'>" +
                "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Headline]&nbsp;</strong></p>" +
                "<p id = 'a" + (i + 1) + "-h1'style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>&nbsp;</strong></p>" +
                "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Sub-head]&nbsp;</strong></p>" +
                "<p id = 'a" + (i + 1) + "-sh1'style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>&nbsp;</strong></p>" +             
                "</td>" +
                "</tr>" +
                "<tr style='height: 12.75pt;'>" +
                "<td style='width: 467.2pt; border: solid black 1.0pt; border-top: none; background: #E7E6E6; padding: 0in 0in 0in 0in;' valign='top'>" +
                "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em><span style='color: black;'>Image</span></em></p>" +
                "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>&nbsp;</strong></p>" +
                "</td>" +
                "</tr>" +
                "<tr style='height: 89.7pt;'>" +
                "<td style='width: 467.2pt; border: solid black 1.0pt; border-top: none; padding: 0in 0in 0in 0in;' valign='top'>" +
                "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em><span style='color: gray;'>Source:</span></em><span style='color: gray;'>&nbsp;</span></p>" +
                "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em><span style='color: gray;'>Digital team to deliver&nbsp;</span></em><span style='color: gray;'>&nbsp;</span></p>" +
                "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em><span style='color: gray;'>Alt text:</span></em><em><span style='color: #44546a;'>&nbsp;</span></em><span style='color: #44546a;'>&nbsp;</span></p>" +
                "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><span style='color: #44546a;'>&nbsp;</span></p>" +
                "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'>&nbsp;</p>" +
                "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><span style='color: gray;'>&nbsp;</span></p>" +
                "</td>" +
                "</tr>"

            $(tempObject).find("#append-tag").append(accordionSection);

        

        if (typeof headline[0] !== 'undefined') {
            $(tempObject).find("#a" + (i + 1) + "-h1").html(headline[0].innerHTML);
        }

        if (typeof subhead[0] !== 'undefined') {
            $(tempObject).find("#a" + (i + 1) + "-sh1").html(subhead[0].innerHTML);
        }
        var ctaCount = 0;
        var bodyCount = 0;

        for(var j=0; j<bodyAndCTA.length; j++){
            if(bodyAndCTA[j].localName == "n-xpm-richtext"){
                bodyCount++;
               var bodySection =  "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Body]</strong></p>" +
                "<p id = 'a" + (i + 1) + "-body-"+bodyCount+"' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>&nbsp;</strong></p>";
                $(tempObject).find('#accordion-' + (i + 1)).append(bodySection);
                $(tempObject).find("#a" + (i + 1) + "-body-" + bodyCount).html(formatInLineTable(bodyAndCTA[j]).innerHTML);
            }

            if(bodyAndCTA[j].localName == "a"){
                ctaCount++;
                var ctaSection = "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[CTA " + ctaCount + "]</strong></p>" +
                "<p id = 'a" + (i + 1) + "-cta" + ctaCount + "'style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>" +
                "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Link " +ctaCount + "]</strong></p>" +
                "<p id = 'a" + (i + 1) + "-link" + ctaCount + "' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>";
                $(tempObject).find('#accordion-' + (i + 1)).append(ctaSection);
                $(tempObject).find("#a" + (i + 1) + "-cta" + ctaCount).html(createLinkData(bodyAndCTA[j], "linkText"));
                $(tempObject).find("#a" + (i + 1) + "-link" + ctaCount).html(createLinkData(bodyAndCTA[j], "link"));
            }

        }
       
    }




    return tempObject.innerHTML;
}

//to-do
function buildBackToTopHtml(currentComponent) {
    var tempObject = document.createElement("div");
    tempObject.innerHTML = getComponentHtml("n-back-to-top");
    $(tempObject).find("#heading-append").after(appendCmsInfo(getCommentInfoFrom(currentComponent.parentNode, "ComponentID"), toBrowserTime(getCommentInfoFrom(currentComponent.parentNode, "ComponentModified"))));


    return tempObject.innerHTML;
}

function buildCallOut(currentComponent) {
    var tempObject = document.createElement("div");
    tempObject.innerHTML = getComponentHtml("n-call-out");
    $(tempObject).find("#heading-append").after(appendCmsInfo(getCommentInfoFrom(currentComponent.parentNode, "ComponentID"), toBrowserTime(getCommentInfoFrom(currentComponent.parentNode, "ComponentModified"))));

    var headline = $(currentComponent).find("n-secondary > n-content > h1");
    var body = $(currentComponent).find("n-xpm-richtext");
    var cta = $(currentComponent).find("a.cta");

    if (typeof headline[0] !== 'undefined') {
        $(tempObject).find("#a1-h1").html(headline[0].innerHTML);
    }

    if (typeof body[0] !== 'undefined') {
        $(tempObject).find("#a1-body").html(body[0].innerHTML);
    }

    if (typeof cta[0] !== 'undefined') {
        $(tempObject).find("#a1-cta1").html(createLinkData(cta[0], "linkText"));
        $(tempObject).find("#a1-link1").html(createLinkData(cta[0], "link"));
    }

    if (typeof cta[1] !== 'undefined') {
        $(tempObject).find("#a1-cta2").html(createLinkData(cta[1], "linkText"));
        $(tempObject).find("#a1-link2").html(createLinkData(cta[1], "link"));
    }
    if (cta.length > 2) {
        for (var i = 2; i < cta.length; i++) {
            var addAnotherCtaSection = "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[CTA " + (i + 1) + "]</strong></p>" +
                "<p id = 'a1-cta" + (i + 1) + "' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>" +
                "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Link " + (i + 1) + "]</strong></p>" +
                "<p id = 'a1-link" + (i + 1) + "' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>"
            $(tempObject).find("#page-content").append(addAnotherCtaSection);
            $(tempObject).find("#a1-cta" + (i + 1) + "").html(createLinkData(cta[i], "linkText"));
            $(tempObject).find("#a1-link" + (i + 1) + "").html(createLinkData(cta[i], "link"));
        }

    }

    return tempObject.innerHTML;
}

function buildCardBandImages(currentComponent) {
    var tempObject = document.createElement("div");
    tempObject.innerHTML = getComponentHtml("n-card-band-images");
    $(tempObject).find("#heading-append").after(appendCmsInfo(getCommentInfoFrom(currentComponent, "ComponentID"), toBrowserTime(getCommentInfoFrom(currentComponent, "ComponentModified"))));

    var cards = $(currentComponent).find("div.n-card-band-images-item");

    for (var i = 0; i < cards.length; i++) {
        //get the content we need
        var headline = $(cards[i]).find("n-content > div > h2");
        var body = $(cards[i]).find("n-xpm-richtext");
        var cta = $(cards[i]).find("n-content > div > n-button-group").find("a.cta");
        var images = $(cards[i]).find("n-xpm-image > img");


        //if we find more than 3 accordions, we need to add a new section to the html document
        if (i > 2) {
            var cardSection =
                "<tr>" +
                "<td style='width: 151.45pt;border-right: 1pt solid windowtext;border-bottom: 1pt solid windowtext;border-left: 1pt solid windowtext;border-top: none;background: rgb(231, 230, 230);padding: 0in;height: 16.55pt;border-image: initial;vertical-align: top;'>" +
                "<p id='card-" + (i + 1) + "' style='margin-right:0in;margin-left:0in;font-size:16px;font-family:Times New Roman,serif;margin:0in;text-align:center;'><em><span style='font-size:15px;font-family:Calibri,sans-serif;color:black;'>Card " + (i + 1) + "</span></em></p>" +
                "</td>" +
                "</tr>" +
                "<tr>" +
                "<td style='width: 151.45pt;border-right: 1pt solid windowtext;border-bottom: 1pt solid windowtext;border-left: 1pt solid windowtext;border-top: none;background: rgb(231, 230, 230);padding: 0in;height: 16.55pt;border-image: initial;vertical-align: top;'>" +
                "<p style='margin-right:0in;margin-left:0in;font-size:16px;font-family:Times New Roman,serif;margin:0in;'><em><span style='font-size:15px;font-family:Calibri,sans-serif;color:black;'>Image</span></em></p>" +
                "</td>" +
                "</tr>" +
                "<tr>" +
                "<td style='width: 151.45pt;border-right: 1pt solid windowtext;border-bottom: 1pt solid windowtext;border-left: 1pt solid windowtext;border-top: none;padding: 0in;height: 104.55pt;border-image: initial;vertical-align: top;'>" +
                "<p style='margin-right:0in;margin-left:0in;font-size:16px;font-family:Times New Roman,serif;margin:0in;'><em><span style='font-size:15px;font-family:Calibri,sans-serif;color:gray;'>Source:</span></em><span style='font-size:15px;font-family:  Calibri,sans-serif;color:gray;'>&nbsp;</span></p>" +
                "<p style='margin-right:0in;margin-left:0in;font-size:16px;font-family:Times New Roman,serif;margin:0in;'><em><span id='a" + (i + 1) + "-image-source' style='font-size:15px;font-family:Calibri,sans-serif;color:gray;'>&nbsp;</span></em><span style='font-size:15px;font-family:Calibri,sans-serif;color:gray;'>&nbsp;</span></p>" +
                "   <p style='margin-right:0in;margin-left:0in;font-size:16px;font-family:Times New Roman,serif;margin:0in;'><em><span style='font-size:15px;font-family:Calibri,sans-serif;color:gray;'>Alt text:</span></em><em><span style='font-size:15px;font-family:Calibri,sans-serif;color:#44546A;'>&nbsp;</span></em><span style='font-size:15px;font-family:Calibri,sans-serif;color:#44546A;'>&nbsp;</span></p>" +
                "    <p style='margin-right:0in;margin-left:0in;font-size:16px;font-family:Times New Roman,serif;margin:0in;'><span id ='a" + (i + 1) + "-image-alt-text'style='font-size:15px;font-family:Calibri,sans-serif;color:#44546A;'>&nbsp;</span></p>                " +
                "</td>" +
                "</tr>" +
                "<tr>" +
                "<td id='card-" + (i + 1) + "-content' style='width: 151.45pt;border-right: 1pt solid windowtext;border-bottom: 1pt solid windowtext;border-left: 1pt solid windowtext;border-top: none;padding: 0in;height: 34.45pt;border-image: initial;vertical-align: top;'>" +
                "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Headline]&nbsp;</strong></p>" +
                "<p id = 'a" + (i + 1) + "-h1'style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>&nbsp;</strong></p> " +
                "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Body]</strong></p>" +
                "<p id = 'a" + (i + 1) + "-body' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>&nbsp;</strong></p>" +
                "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>&nbsp;</strong></p>" +
                "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[CTA 1]</strong></p>" +
                "   <p id = 'a" + (i + 1) + "-cta1'style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>" +
                "   <p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Link 1]</strong></p>" +
                "   <p id = 'a" + (i + 1) + "-link1' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>" +
                "   <p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[CTA 2]</strong></p>" +
                "   <p id = 'a" + (i + 1) + "-cta2' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>" +
                "   <p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Link 2]</strong></p>" +
                "   <p id = 'a" + (i + 1) + "-link2' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>" +
                "</td>            " +
                "</tr>     ";

            $(tempObject).find("#append-tag").append(cardSection);

        }

        if (typeof images[0] !== 'undefined') {
            $(tempObject).find("#a" + (i + 1) + "-image-source").html((createImageHtml(images[0])));
            $(tempObject).find("#a" + (i + 1) + "-image-alt-text").html(images[0].alt);
        }

        if (typeof headline[0] !== 'undefined') {
            $(tempObject).find("#a" + (i + 1) + "-h1").html(headline[0].innerHTML);
        }



        if (typeof body[0] !== 'undefined') {
            $(tempObject).find("#a" + (i + 1) + "-body").html(body[0].innerHTML);
        }

        if (typeof cta[0] !== 'undefined') {
            $(tempObject).find("#a" + (i + 1) + "-cta1").html(createLinkData(cta[0], "linkText"));
            $(tempObject).find("#a" + (i + 1) + "-link1").html(createLinkData(cta[0], "link"));
        }

        if (typeof cta[1] !== 'undefined') {
            $(tempObject).find("#a" + (i + 1) + "-cta2").html(createLinkData(cta[1], "linkText"));
            $(tempObject).find("#a" + (i + 1) + "-link2").html(createLinkData(cta[1], "link"));
        }

        if (cta.length > 2) {
            for (var j = 2; j < cta.length; j++) {
                var addAnotherCtaSection = "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[CTA " + (j + 1) + "]</strong></p>" +
                    "<p id = 'a" + (i + 1) + "-cta" + (j + 1) + "' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>" +
                    "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Link " + (j + 1) + "]</strong></p>" +
                    "<p id = 'a" + (i + 1) + "-link" + (j + 1) + "' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>"
                $(tempObject).find("#card-" + (i + 1) + "-content").append(addAnotherCtaSection);
                $(tempObject).find("#a" + (i + 1) + "-cta" + (j + 1)).html(createLinkData(cta[j], "linkText"));
                $(tempObject).find("#a" + (i + 1) + "-link" + (j + 1)).html(createLinkData(cta[j], "link"));
            }

        }

    }
    return tempObject.innerHTML;
}

function buildCardBandHtml(currentComponent) {
    var tempObject = document.createElement("div");
    tempObject.innerHTML = getComponentHtml("n-card-band");

    $(tempObject).find("#heading-append").after(appendCmsInfo(getCommentInfoFrom(currentComponent, "ComponentID"), toBrowserTime(getCommentInfoFrom(currentComponent, "ComponentModified"))));
    $(tempObject).find("#delete-for-content").html("");
    var cards = $(currentComponent).find("div.n-card-band-item");

    var cardsToMake = cards.length;
    if (cardsToMake >= 3) {

    } else {
        cardsToMake = 3;
    }

    for (var i = 0; i < cardsToMake; i++) {
        var newCard = "<tr>" +
            "<td style='width: 151.45pt;border-right: 1pt solid windowtext;border-bottom: 1pt solid windowtext;border-left: 1pt solid windowtext;border-top: none;background: rgb(231, 230, 230);padding: 0in;height: 16.55pt;border-image: initial;vertical-align: top;'>" +
            "<p id='card-" + (i + 1) + "' style='margin-right:0in;margin-left:0in;font-size:16px;font-family:Times New Roman,serif;margin:0in;text-align:center;'><em><span style='font-size:15px;font-family:Calibri,sans-serif;color:black;'>Card " + (i + 1) + "</span></em></p>" +
            "</td>" +
            "</tr>" +
            "<tr>" +
            "<td style='width: 151.45pt;border-right: 1pt solid windowtext;border-bottom: 1pt solid windowtext;border-left: 1pt solid windowtext;border-top: none;padding: 0in;height: 34.45pt;border-image: initial;vertical-align: top;'>" +
            "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Headline]&nbsp;</strong></p>" +
            "<p id = 'a" + (i + 1) + "-h1'style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>&nbsp;</strong></p> " +
            "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Body]</strong></p>" +
            "<p id = 'a" + (i + 1) + "-body' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>&nbsp;</strong></p>" +
            "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>&nbsp;</strong></p>" +
            "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[CTA 1]</strong></p>" +
            "   <p id = 'a" + (i + 1) + "-cta1'style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>" +
            "   <p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Link 1]</strong></p>" +
            "   <p id = 'a" + (i + 1) + "-link1' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>" +
            "   <p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[CTA 2]</strong></p>" +
            "   <p id = 'a" + (i + 1) + "-cta2' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>" +
            "   <p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Link 2]</strong></p>" +
            "   <p id = 'a" + (i + 1) + "-link2' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>" +
            "</td>            " +
            "</tr>     ";
        $(tempObject).find("#append-tag").append(newCard);

    }

    for (var i = 0; i < cards.length; i++) {
        //get the content we need
        var headline = $(cards[i]).find("h2");
        var body = $(cards[i]).find("n-xpm-richtext");
        var cta = $(cards[i]).find("n-content > n-button-group").find("a.cta");





        if (typeof headline[0] !== 'undefined') {
            $(tempObject).find("#a" + (i + 1) + "-h1").html(headline[0].innerHTML);
        }

        if (typeof body[0] !== 'undefined') {
            $(tempObject).find("#a" + (i + 1) + "-body").html(body[0].innerHTML);
        }

        if (typeof cta[0] !== 'undefined') {
            $(tempObject).find("#a" + (i + 1) + "-cta1").html(createLinkData(cta[0], "linkText"));
            $(tempObject).find("#a" + (i + 1) + "-link1").html(createLinkData(cta[0], "link"));
        }

        if (typeof cta[1] !== 'undefined') {
            $(tempObject).find("#a" + (i + 1) + "-cta2").html(createLinkData(cta[1], "linkText"));
            $(tempObject).find("#a" + (i + 1) + "-link2").html(createLinkData(cta[1], "link"));
        }

    }

    return tempObject.innerHTML;
}

function buildFancyCallout(currentComponent) {
    var tempObject = document.createElement("div");
    tempObject.innerHTML = getComponentHtml("n-fancy-callout");


    $(tempObject).find("#heading-append").after(appendCmsInfo(getCommentInfoFrom(currentComponent.parentNode, "ComponentID"), toBrowserTime(getCommentInfoFrom(currentComponent.parentNode, "ComponentModified"))));

    var headline = $(currentComponent).find("n-secondary > n-content > h1");
    var body = $(currentComponent).find("n-xpm-richtext");
    var cta = $(currentComponent).find("a.cta");
    var images = $(currentComponent).find("n-primary > picture > img");

    if (typeof headline[0] !== 'undefined') {
        $(tempObject).find("#a1-h1").html(headline[0].innerHTML);
    }

    if (typeof body[0] !== 'undefined') {
        $(tempObject).find("#a1-body").html(body[0].innerHTML);
    }

    if (typeof cta[0] !== 'undefined') {
        $(tempObject).find("#a1-cta1").html(createLinkData(cta[0], "linkText"));
        $(tempObject).find("#a1-link1").html(createLinkData(cta[0], "link"));
    }

    if (typeof cta[1] !== 'undefined') {
        $(tempObject).find("#a1-cta2").html(createLinkData(cta[1], "linkText"));
        $(tempObject).find("#a1-link2").html(createLinkData(cta[1], "link"));
    }
    if (cta.length > 2) {
        for (var i = 2; i < cta.length; i++) {
            var addAnotherCtaSection = "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[CTA " + (i + 1) + "]</strong></p>" +
                "<p id = 'a1-cta" + (i + 1) + "' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>" +
                "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Link " + (i + 1) + "]</strong></p>" +
                "<p id = 'a1-link" + (i + 1) + "' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>"
            $(tempObject).find("#page-content").append(addAnotherCtaSection);
            $(tempObject).find("#a1-cta" + (i + 1) + "").html(createLinkData(cta[i], "linkText"));
            $(tempObject).find("#a1-link" + (i + 1) + "").html(createLinkData(cta[i], "link"));
        }

    }

    if (typeof images[0] !== 'undefined') {
        $(tempObject).find("#a1-image-source").html((createImageHtml(images[0])));
        $(tempObject).find("#a1-image-alt-text").html(images[0].alt);
    }

    return tempObject.innerHTML;
}

function buildFeatureTiles(currentComponent) {
    var tempObject = document.createElement("div");
    tempObject.innerHTML = getComponentHtml("n-feature-tiles");
    $(tempObject).find("#heading-append").after(appendCmsInfo(getCommentInfoFrom(currentComponent.parentNode, "ComponentID"), toBrowserTime(getCommentInfoFrom(currentComponent.parentNode, "ComponentModified"))));

    $(tempObject).find("#delete-for-content").remove();
    var tiles = $(currentComponent).find("div.feature-tile-item");

    var primaryHeadline = $(currentComponent).find("n-primary > n-content > h1");
    var primaryCta = $(currentComponent).find("n-primary > n-content > a.cta");

    if (typeof primaryHeadline[0] !== 'undefined') {
        $(tempObject).find("#primary-headline").html(primaryHeadline[0].innerHTML);
    }

    if (typeof primaryCta[0] !== 'undefined') {
        $(tempObject).find("#primary-cta").html(createLinkData(primaryCta[0], "linkText"));
        $(tempObject).find("#primary-link").html(createLinkData(primaryCta[0], "link"));
    }





    var tilesToMake = tiles.length;
    if (tilesToMake >= 4) {

    } else {
        tilesToMake = 4;
    }

    for (var i = 0; i < tilesToMake; i++) {
        var newTile = "<tr style='height: 25.9pt;'>" +
            "<td style='width:  475.25pt; border: solid windowtext 1.0pt; border-top: none; padding: 0in 0in 0in 0in;' valign='top'> " +
            "<p style='margin: 0in; text-align: center; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong><em>Tile " + (i + 1) + "</em></strong></p>" +
            "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Headline]</strong></p>" +
            "<p id = 'a" + (i + 1) + "-h1'style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>&nbsp;</strong></p>" +
            "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>&nbsp;</strong></p>" +
            "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Link]</strong></p>" +
            "<p id = 'a" + (i + 1) + "-link1'style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'></p>" +
            "</td>  " +
            "</tr>";
        $(tempObject).find("#append-tag").append(newTile);
    }

    for (var i = 0; i < tiles.length; i++) {
        //get the content we need
        var headline = $(tiles[i]).find("n-xpm-text");
        var noCtaContent = $(tiles[i]).find("n-content > p");
        var cta = $(tiles[i]).find("a");





        if (typeof headline[0] !== 'undefined') {
            $(tempObject).find("#a" + (i + 1) + "-h1").html(headline[0].innerHTML);
        } else {
            if (typeof noCtaContent[0] !== 'undefined') {
                $(tempObject).find("#a" + (i + 1) + "-h1").html(noCtaContent[0].innerHTML);
            }
        }


        if (typeof cta[0] !== 'undefined') {
            $(tempObject).find("#a" + (i + 1) + "-link1").html(createLinkData(cta[0], "link"));
        }

    }

    return tempObject.innerHTML;
}

function buildHero(currentComponent) {
    var tempObject = document.createElement("div");
    tempObject.innerHTML = getComponentHtml("n-hero");
    $(tempObject).find("#heading-append").after(appendCmsInfo(getCommentInfoFrom(currentComponent.parentNode, "ComponentID"), toBrowserTime(getCommentInfoFrom(currentComponent.parentNode, "ComponentModified"))));

    var headline = $(currentComponent).find("n-primary > n-content > h1");
    var body = $(currentComponent).find("n-xpm-richtext");
    var cta = $(currentComponent).find("n-button-group").find("a.cta");
    var images = $(currentComponent).find("n-secondary > img");

    var eyeBrow = $(currentComponent).find("n-eyebrow > a.eyebrow");

    if (typeof eyeBrow[0] !== "undefined" && eyeBrow[0].innerHTML != "") {
        var eyeBrowSection = "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Eyebrow CTA]</strong></p>" +
            "<p id = 'a1-cta-eye' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>" +
            "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Eyebrow Link]</strong></p>" +
            "<p id = 'a1-link-eye' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>";
        $(tempObject).find("#page-content").before(eyeBrowSection);
        $(tempObject).find("#a1-cta-eye").html(createLinkData(eyeBrow[0], "linkText"));
        $(tempObject).find("#a1-link-eye").html(createLinkData(eyeBrow[0], "link"));

    }

    if (typeof headline[0] !== 'undefined') {
        $(tempObject).find("#a1-h1").html(headline[0].innerHTML);
    }

    if (typeof body[0] !== 'undefined') {
        $(tempObject).find("#a1-body").html(body[0].innerHTML);
    }

    if (typeof cta[0] !== 'undefined') {
        $(tempObject).find("#a1-cta1").html(createLinkData(cta[0], "linkText"));
        $(tempObject).find("#a1-link1").html(createLinkData(cta[0], "link"));
    }

    if (typeof cta[1] !== 'undefined') {
        $(tempObject).find("#a1-cta2").html(createLinkData(cta[1], "linkText"));
        $(tempObject).find("#a1-link2").html(createLinkData(cta[1], "link"));
    }
    if (cta.length > 2) {
        for (var i = 2; i < cta.length; i++) {
            var addAnotherCtaSection = "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[CTA " + (i + 1) + "]</strong></p>" +
                "<p id = 'a1-cta" + (i + 1) + "' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>" +
                "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Link " + (i + 1) + "]</strong></p>" +
                "<p id = 'a1-link" + (i + 1) + "' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>"
            $(tempObject).find("#page-content").append(addAnotherCtaSection);
            $(tempObject).find("#a1-cta" + (i + 1) + "").html(createLinkData(cta[i], "linkText"));
            $(tempObject).find("#a1-link" + (i + 1) + "").html(createLinkData(cta[i], "link"));
        }

    }

    if (typeof images[0] !== 'undefined') {
        $(tempObject).find("#a1-image-source").html((createImageHtml(images[0])));
        $(tempObject).find("#a1-image-alt-text").html(images[0].alt);
    }

    return tempObject.innerHTML;
}

function buildImageWithTabs(currentComponent) {
    var tempObject = document.createElement("div");
    tempObject.innerHTML = getComponentHtml("n-image-3tabs");
    $(tempObject).find("#heading-append").after(appendCmsInfo(getCommentInfoFrom(currentComponent.parentNode, "ComponentID"), toBrowserTime(getCommentInfoFrom(currentComponent.parentNode, "ComponentModified"))));
    $(tempObject).find("#delete-for-content").remove();

    var image = $(currentComponent).find("img");

    if (typeof image[0] !== 'undefined') {
        $(tempObject).find("#a1-image-source").html((createImageHtml(image[0])));
        $(tempObject).find("#a1-image-alt-text").html(image[0].alt);
    }

    var tabs = $(currentComponent).find("n-primary > article > div.tab-content-container");
    //console.log(tabs);
    var makeThisManyTabs = 0;

    if (tabs.length < 3) {
        makeThisManyTabs = 3;
    } else {
        makeThisManyTabs = tabs.length;
    }

    for (var i = 0; i < makeThisManyTabs; i++) {
        var tabSection = "<tr style='height: 16.55pt;'>" +
            "<td style='width: 151.45pt; border: solid windowtext 1.0pt; border-top: none; background: #E7E6E6; padding: 0in 0in 0in 0in;' valign='top'>" +
            "<p style='margin: 0in; text-align: center; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em><span style='color: black;'>Tab " + (i + 1) + "</span></em></p>" +
            "</td>" +
            "</tr>" +           
            "<tr  style='height: 16.55pt;'>" +
            "<td style='width: 151.45pt; border: solid windowtext 1.0pt; border-top: none; background: #E7E6E6; padding: 0in 0in 0in 0in;' valign='top'>" +
            "<p style='margin: 0in; text-align: center; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em><span style='color: black;'>Tab Title</span></em></p>" +
            "</td>            " +
            "</tr>" +
            "<tr style='height: 16.55pt;'>" +
            "<td style='width: 620px; border-color: currentcolor black black; border-style: none solid solid; border-width: medium 1pt 1pt; border-image: none 100% / 1 / 0 stretch; padding: 0in;' valign='top'>" +
            "<p id= 'tab-title-" + (i + 1) + "' style='margin-right:0in;margin-left:0in;font-size:16px;font-family:Times New Roman,serif;margin:0in;'><em><span style='font-size:15px;font-family:Calibri,sans-serif;color:gray;'></span></em><span style='font-size:15px;font-family:  Calibri,sans-serif;color:gray;'>&nbsp;</span></p>                                               " +
            "</td>" +
            "</tr>" +
            "<tr style='height: 16px;'>" +
            "<td style='width: 620px; border-color: currentcolor black black; border-style: none solid solid; border-width: medium 1pt 1pt; border-image: none 100% / 1 / 0 stretch; background: none 0% 0% repeat scroll #e7e6e6; padding: 0in; height: 16px;' valign='top'>" +
            "<p style='margin: 0in; text-align: center; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em><span style='color: black;'>Heading/Copy/Call to Action</span></em></p>" +
            "</td>" +
            "</tr>" +
            "<tr style='height: 34.45pt;'>" +
            "<td id='page-section-" + (i + 1) + "' style='width: 151.45pt; border: solid windowtext 1.0pt; border-top: none; padding: 0in 0in 0in 0in;' valign='top'>" +            
            "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Headline]&nbsp;</strong></p>" +
            "<p id = 'a" + (i + 1) + "-h1'style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>&nbsp;</strong></p>                " +
            "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Body]</strong></p>" +
            "<p id = 'a" + (i + 1) + "-body' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>&nbsp;</strong></p>" +
            "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>&nbsp;</strong></p>" +
            "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[CTA 1]</strong></p>" +
            "<p id = 'a" + (i + 1) + "-cta1'style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>" +
            "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Link 1]</strong></p>" +
            "<p id = 'a" + (i + 1) + "-link1' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>" +
            "</td>" +
            "</tr>";
        $(tempObject).find("#append-tag").append(tabSection);
    }



    for (var i = 0; i < tabs.length; i++) {
        //get the content we need
        var headline = $(tabs[i]).find("n-content > h1");
        var body = $(tabs[i]).find("n-xpm-richtext");
        var cta = $(tabs[i]).find("n-content > n-button-group").find("a.cta");
        var tabTitle = $(tabs[i].parentElement).attr("data-tab-title");
        //console.log("tabTitle");
        //console.log(tabTitle);
        var eyeBrow = $(tabs[i]).find("n-eyebrow > a.eyebrow");

        if (typeof eyeBrow[0] !== "undefined" && eyeBrow[0].innerHTML != "") {
            var eyeBrowSection = "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Eyebrow CTA]</strong></p>" +
                "<p id = 'a" + (i + 1) + "-cta-eye' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>" +
                "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Eyebrow Link]</strong></p>" +
                "<p id = 'a" + (i + 1) + "-link-eye' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>";
            $(tempObject).find("#a" + (i + 1) + "-tt").after(eyeBrowSection);
            $(tempObject).find("#a" + (i + 1) + "-cta-eye").html(createLinkData(eyeBrow[0], "linkText"));
            $(tempObject).find("#a" + (i + 1) + "-link-eye").html(createLinkData(eyeBrow[0], "link"));

        }



        //if we find more than 3 accordions, we need to add a new section to the html document
        if (typeof tabTitle !== "undefined") {
            $(tempObject).find("#tab-title-" + (i + 1)).html(tabTitle);
        }


       

        if (typeof headline[0] !== 'undefined') {
            $(tempObject).find("#a" + (i + 1) + "-h1").html(headline[0].innerHTML);
        }



        if (typeof body[0] !== 'undefined') {
            $(tempObject).find("#a" + (i + 1) + "-body").html(body[0].innerHTML);
        }

        if (typeof cta[0] !== 'undefined') {
            $(tempObject).find("#a" + (i + 1) + "-cta1").html(createLinkData(cta[0], "linkText"));
            $(tempObject).find("#a" + (i + 1) + "-link1").html(createLinkData(cta[0], "link"));
        }



        if (cta.length > 1) {
            for (var j = 1; j < cta.length; j++) {
                var addAnotherCtaSection = "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[CTA " + (j + 1) + "]</strong></p>" +
                    "<p id = 'a" + (i + 1) + "-cta" + (j + 1) + "' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>" +
                    "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Link " + (j + 1) + "]</strong></p>" +
                    "<p id = 'a" + (i + 1) + "-link" + (j + 1) + "' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>"
                $(tempObject).find("#page-section-" + (i + 1) + "").append(addAnotherCtaSection);
                $(tempObject).find("#a" + (i + 1) + "-cta" + (j + 1) + "").html(createLinkData(cta[j], "linkText"));
                $(tempObject).find("#a" + (i + 1) + "-link" + (j + 1) + "").html(createLinkData(cta[j], "link"));
            }

        }

    }

    return tempObject.innerHTML;
}

function buildImageWithTiles(currentComponent) {
    var tempObject = document.createElement("div");
    tempObject.innerHTML = getComponentHtml("n-image-with-tiles");
    $(tempObject).find("#heading-append").after(appendCmsInfo(getCommentInfoFrom(currentComponent, "ComponentID"), toBrowserTime(getCommentInfoFrom(currentComponent, "ComponentModified"))));
    $(tempObject).find("#delete-for-content").remove();
    var tiles = $(currentComponent).find("div.n-image-with-tile");
    var image = $(currentComponent).find("n-primary > img");

    if (typeof image[0] !== 'undefined') {
        $(tempObject).find("#a1-image-source").html((createImageHtml(image[0])));
        $(tempObject).find("#a1-image-alt-text").html(image[0].alt);
    }

    var tilesToMake = tiles.length;
    if (tilesToMake >= 4) {

    } else {
        tilesToMake = 4;
    }

    for (var i = 0; i < tilesToMake; i++) {
        var newTile = "<tr style='height: 25.9pt;'>" +
            "<td style='width:  475.25pt; border: solid windowtext 1.0pt; border-top: none; padding: 0in 0in 0in 0in;' valign='top'> " +
            "<p style='margin: 0in; text-align: center; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong><em>Tile " + (i + 1) + "</em></strong></p>" +
            "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Headline]</strong></p>" +
            "<p id = 'a" + (i + 1) + "-h1'style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>&nbsp;</strong></p>" +
            "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Body]</strong></p>" +
            "<p id = 'a" + (i + 1) + "-body'style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>&nbsp;</strong></p>" +
            "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[CTA]</strong></p>" +
            "<p id = 'a" + (i + 1) + "-cta1'style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>&nbsp;</strong></p>" +
            "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Link]</strong></p>" +
            "<p id = 'a" + (i + 1) + "-link1'style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'></p>" +
            "</td>  " +
            "</tr>";
        $(tempObject).find("#append-tag").append(newTile);
    }

    for (var i = 0; i < tiles.length; i++) {
        var headline = $(tiles[i]).find("n-content > h2");
        var body = $(tiles[i]).find("n-content > n-xpm-richtext");
        var linkText = $(tiles[i]).find("n-content > n-button-group > p > n-xpm-text");
        var link = $(tiles[i]).find("a");

        if (typeof headline[0] !== 'undefined') {
            $(tempObject).find("#a" + (i + 1) + "-h1").html(headline[0].innerHTML + "</br>");
        } else {
            $(tempObject).find("#a" + (i + 1) + "-h1").html("&nbsp;</br>");
        }

        if (typeof body[0] !== 'undefined') {
            $(tempObject).find("#a" + (i + 1) + "-body").html(body[0].innerHTML + "</br>");
        } else {
            $(tempObject).find("#a" + (i + 1) + "-body").html("&nbsp;</br>");
        }

        if (typeof linkText[0] !== 'undefined') {
            $(tempObject).find("#a" + (i + 1) + "-cta1").html(linkText[0].innerHTML + "</br>");
        } else {
            $(tempObject).find("#a" + (i + 1) + "-cta1").html("&nbsp;</br>");
        }

        if (typeof link[0] !== 'undefined') {
            $(tempObject).find("#a" + (i + 1) + "-link1").html(createLinkData(link[0], "link") + "</br>");
        } else {
            $(tempObject).find("#a" + (i + 1) + "-link1").html("&nbsp;</br>");
        }

    }


    return tempObject.innerHTML;
}

function buildIntro(currentComponent) {
    var tempObject = document.createElement("div");
    tempObject.innerHTML = getComponentHtml("n-intro");
    $(tempObject).find("#heading-append").after(appendCmsInfo(getCommentInfoFrom(currentComponent.parentNode, "ComponentID"), toBrowserTime(getCommentInfoFrom(currentComponent.parentNode, "ComponentModified"))));
    var headline = $(currentComponent).find("n-primary > n-content > h1");
    var subHead = $(currentComponent).find("n-primary > n-content > h2");
    var body = $(currentComponent).find("n-xpm-richtext");
    var cta = $(currentComponent).find("n-button-group").find("a.cta");
    var images = $(currentComponent).find("n-secondary > img");


    if (typeof headline[0] !== 'undefined') {
        $(tempObject).find("#a1-h1").html(headline[0].innerHTML + "</br>");
    }

    if (typeof subHead[0] !== 'undefined') {
        $(tempObject).find("#a1-h2").html(subHead[0].innerHTML + "</br>");
    }

    if (typeof body[0] !== 'undefined') {
        $(tempObject).find("#a1-body").html(body[0].innerHTML + "</br>");
    }

    if (typeof cta[0] !== 'undefined') {
        $(tempObject).find("#a1-cta1").html(createLinkData(cta[0], "linkText"));
        $(tempObject).find("#a1-link1").html(createLinkData(cta[0], "link") + "</br>");
    }

    if (typeof cta[1] !== 'undefined') {
        $(tempObject).find("#a1-cta2").html(createLinkData(cta[1], "linkText"));
        $(tempObject).find("#a1-link2").html(createLinkData(cta[1], "link") + "</br>");
    }
    if (cta.length > 2) {
        for (var i = 2; i < cta.length; i++) {
            var addAnotherCtaSection = "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[CTA " + (i + 1) + "]</strong></p>" +
                "<p id = 'a1-cta" + (i + 1) + "' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>" +
                "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Link " + (i + 1) + "]</strong></p>" +
                "<p id = 'a1-link" + (i + 1) + "' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>"
            $(tempObject).find("#page-content").append(addAnotherCtaSection);
            $(tempObject).find("#a1-cta" + (i + 1) + "").html(createLinkData(cta[i], "linkText") + "</br>");
            $(tempObject).find("#a1-link" + (i + 1) + "").html(createLinkData(cta[i], "link") + "</br>");
        }

    }

    if (typeof images[0] !== 'undefined') {
        $(tempObject).find("#a1-image-source").html((createImageHtml(images[0])));
        $(tempObject).find("#a1-image-alt-text").html(images[0].alt);
    }


    return tempObject.innerHTML;
}

function buildLogoBand(currentComponent) {
    var tempObject = document.createElement("div");
    tempObject.innerHTML = getComponentHtml("n-logo-band");
    $(tempObject).find("#heading-append").after(appendCmsInfo(getCommentInfoFrom(currentComponent, "ComponentID"), toBrowserTime(getCommentInfoFrom(currentComponent, "ComponentModified"))));
    $(tempObject).find("#delete-for-content").remove();
    var logoCards = $(currentComponent).find("li.n-logo-item").not(".n-logo-item--view-all");

    for (var i = 0; i < logoCards.length; i += 2) {
        var logoCardRow = "<tr>" +
            "<td style='width: 151.45pt;border-right: 1pt solid windowtext;border-bottom: 1pt solid windowtext;border-left: 1pt solid windowtext;border-top: none;background: rgb(231, 230, 230);padding: 0in;height: 16.55pt;border-image: initial;vertical-align: top;'>" +
            "<p id='card-" + (i + 1) + "' style='margin-right:0in;margin-left:0in;font-size:16px;font-family:Times New Roman,serif;margin:0in;text-align:center;'><em><span style='font-size:15px;font-family:Calibri,sans-serif;color:black;'>Logo Card " + (i + 1) + "</span></em></p>" +
            " </td>" +
            "<td style='width: 151.45pt;border-right: 1pt solid windowtext;border-bottom: 1pt solid windowtext;border-left: 1pt solid windowtext;border-top: none;background: rgb(231, 230, 230);padding: 0in;height: 16.55pt;border-image: initial;vertical-align: top;'>" +
            "<p id='card-" + (i + 2) + "' style='margin-right:0in;margin-left:0in;font-size:16px;font-family:Times New Roman,serif;margin:0in;text-align:center;'><em><span style='font-size:15px;font-family:Calibri,sans-serif;color:black;'>Logo Card " + (i + 2) + "</span></em></p>" +
            "</td>" +
            "</tr>" +
            "<tr>" +
            "<td style='width: 151.45pt;border-right: 1pt solid windowtext;border-bottom: 1pt solid windowtext;border-left: 1pt solid windowtext;border-top: none;background: rgb(231, 230, 230);padding: 0in;height: 16.55pt;border-image: initial;vertical-align: top;'>" +
            "<p style='margin-right:0in;margin-left:0in;font-size:16px;font-family:Times New Roman,serif;margin:0in;'><em><span style='font-size:15px;font-family:Calibri,sans-serif;color:black;'>Logo Image</span></em></p>" +
            "</td>" +
            "<td style='width: 151.45pt;border-right: 1pt solid windowtext;border-bottom: 1pt solid windowtext;border-left: 1pt solid windowtext;border-top: none;background: rgb(231, 230, 230);padding: 0in;height: 16.55pt;border-image: initial;vertical-align: top;'>" +
            "<p style='margin-right:0in;margin-left:0in;font-size:16px;font-family:Times New Roman,serif;margin:0in;'><em><span style='font-size:15px;font-family:Calibri,sans-serif;color:black;'>Logo Image</span></em></p>" +
            "</td>" +
            "</tr>" +
            "<tr>" +
            "<td style='width: 151.45pt;border-right: 1pt solid windowtext;border-bottom: 1pt solid windowtext;border-left: 1pt solid windowtext;border-top: none;padding: 0in;height: 104.55pt;border-image: initial;vertical-align: top;'>" +
            "<p style='margin-right:0in;margin-left:0in;font-size:16px;font-family:Times New Roman,serif;margin:0in;'><em><span style='font-size:15px;font-family:Calibri,sans-serif;color:gray;'>Source:</span></em><span style='font-size:15px;font-family:  Calibri,sans-serif;color:gray;'>&nbsp;</span></p>" +
            "<p style='margin-right:0in;margin-left:0in;font-size:16px;font-family:Times New Roman,serif;margin:0in;'><em><span id='a" + (i + 1) + "-image-source' style='font-size:15px;font-family:Calibri,sans-serif;color:gray;'>&nbsp;</span></em><span style='font-size:15px;font-family:Calibri,sans-serif;color:gray;'>&nbsp;</span></p>" +
            "<p style='margin-right:0in;margin-left:0in;font-size:16px;font-family:Times New Roman,serif;margin:0in;'><em><span style='font-size:15px;font-family:Calibri,sans-serif;color:gray;'>Alt text:</span></em><em><span style='font-size:15px;font-family:Calibri,sans-serif;color:#44546A;'>&nbsp;</span></em><span style='font-size:15px;font-family:Calibri,sans-serif;color:#44546A;'>&nbsp;</span></p>" +
            "<p style='margin-right:0in;margin-left:0in;font-size:16px;font-family:Times New Roman,serif;margin:0in;'><span id ='a" + (i + 1) + "-image-alt-text'style='font-size:15px;font-family:Calibri,sans-serif;color:#44546A;'>&nbsp;</span></p>                " +
            "</td>" +
            "<td style='width: 151.45pt;border-right: 1pt solid windowtext;border-bottom: 1pt solid windowtext;border-left: 1pt solid windowtext;border-top: none;padding: 0in;height: 104.55pt;border-image: initial;vertical-align: top;'>" +
            "<p style='margin-right:0in;margin-left:0in;font-size:16px;font-family:Times New Roman,serif;margin:0in;'><em><span style='font-size:15px;font-family:Calibri,sans-serif;color:gray;'>Source:</span></em><span style='font-size:15px;font-family:  Calibri,sans-serif;color:gray;'>&nbsp;</span></p>" +
            "<p style='margin-right:0in;margin-left:0in;font-size:16px;font-family:Times New Roman,serif;margin:0in;'><em><span id='a" + (i + 2) + "-image-source' style='font-size:15px;font-family:Calibri,sans-serif;color:gray;'>&nbsp;</span></em><span style='font-size:15px;font-family:Calibri,sans-serif;color:gray;'>&nbsp;</span></p>" +
            "<p style='margin-right:0in;margin-left:0in;font-size:16px;font-family:Times New Roman,serif;margin:0in;'><em><span style='font-size:15px;font-family:Calibri,sans-serif;color:gray;'>Alt text:</span></em><em><span style='font-size:15px;font-family:Calibri,sans-serif;color:#44546A;'>&nbsp;</span></em><span style='font-size:15px;font-family:Calibri,sans-serif;color:#44546A;'>&nbsp;</span></p>" +
            "<p style='margin-right:0in;margin-left:0in;font-size:16px;font-family:Times New Roman,serif;margin:0in;'><span id ='a" + (i + 2) + "-image-alt-text'style='font-size:15px;font-family:Calibri,sans-serif;color:#44546A;'>&nbsp;</span></p>                " +
            "</td>              " +
            "</tr>" +
            "<tr>" +
            "<td style='width: 151.45pt;border-right: 1pt solid windowtext;border-bottom: 1pt solid windowtext;border-left: 1pt solid windowtext;border-top: none;padding: 0in;height: 34.45pt;border-image: initial;vertical-align: top;'>                " +
            "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Link]</strong></p>" +
            "<p id = 'a" + (i + 1) + "-link1' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>      " +
            "</td>" +
            "<td style='width: 151.45pt;border-right: 1pt solid windowtext;border-bottom: 1pt solid windowtext;border-left: 1pt solid windowtext;border-top: none;padding: 0in;height: 34.45pt;border-image: initial;vertical-align: top;'>                " +
            "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Link]</strong></p>" +
            "<p id = 'a" + (i + 2) + "-link1' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p> " +
            "</td>" +
            "</tr>";
        $(tempObject).find("#append-tag").append(logoCardRow);

    }

    for (var i = 0; i < logoCards.length; i++) {
        var cta = $(logoCards[i]).find("a");
        var image = $(logoCards[i]).find("img");

        if (typeof cta[0] !== 'undefined') {
            $(tempObject).find("#a" + (i + 1) + "-link1").html(createLinkData(cta[0], "link"));
        }

        if (typeof image[0] !== 'undefined') {
            $(tempObject).find("#a" + (i + 1) + "-image-source").html((createImageHtml(image[0])));
            $(tempObject).find("#a" + (i + 1) + "-image-alt-text").html(image[0].alt);
        }
        if (logoCards[i].classList.contains("n-logo-item--view-all")) {
            var span = $(logoCards[i]).find("span");
            if (typeof span[0] !== 'undefined') {
                $(tempObject).find("#card-" + (i + 1)).html("<em><span style='font-size:15px;font-family:Calibri,sans-serif;color:black;'>" + span[0].innerHTML + "</span></em>");
                var addAnotherCtaSection = "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[CTA]</strong></p>" +
                    "<p id = 'a" + (i + 1) + "-cta' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>";
                $(tempObject).find("#a" + (i + 1) + "-link1").append(addAnotherCtaSection);

                $(tempObject).find("#a" + (i + 1) + "-cta").after(createLinkData(cta[0], "linkText"));
            }

        }

    }
    //todo: make view all card if one exist.
    var viewAllCard = $(currentComponent).find("li.n-logo-item.n-logo-item--view-all");
    //console.log(viewAllCard);

    var logoCardRow = "<tr >" +
        "<td style='width: 151.45pt;border-right: 1pt solid windowtext;border-bottom: 1pt solid windowtext;border-left: 1pt solid windowtext;border-top: none;background: rgb(231, 230, 230);padding: 0in;height: 16.55pt;border-image: initial;vertical-align: top;'>" +
        "<p id='card-1' style='margin-right:0in;margin-left:0in;font-size:16px;font-family:Times New Roman,serif;margin:0in;text-align:center;'><em><span style='font-size:15px;font-family:Calibri,sans-serif;color:black;'>View All Card</span></em></p>" +
        "</td>" +
        "</tr>" +
        "<tr >" +
        "<td style='width: 151.45pt;border-right: 1pt solid windowtext;border-bottom: 1pt solid windowtext;border-left: 1pt solid windowtext;border-top: none;background: rgb(231, 230, 230);padding: 0in;height: 16.55pt;border-image: initial;vertical-align: top;'>" +
        "<p id = 'a-view-all-link-enable' style='margin-right:0in;margin-left:0in;font-size:16px;font-family:Times New Roman,serif;margin:0in;'><em><span style='font-size:15px;font-family:Calibri,sans-serif;color:black;'>Enable?: No</span></em></p>" +
        "</td>" +
        "</tr>" +
        "<tr >" +
        "<td style='width: 151.45pt;border-right: 1pt solid windowtext;border-bottom: 1pt solid windowtext;border-left: 1pt solid windowtext;border-top: none;padding: 0in;height: 104.55pt;border-image: initial;vertical-align: top;'>" +
        "</td>" +
        "</tr>" +
        "<tr >" +
        "<td style='width: 151.45pt;border-right: 1pt solid windowtext;border-bottom: 1pt solid windowtext;border-left: 1pt solid windowtext;border-top: none;padding: 0in;height: 34.45pt;border-image: initial;vertical-align: top;'>" +
        "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Link]</strong></p>" +
        "<p id = 'a-view-all-link' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>" +
        "</td>" +
        "</tr>";
    $(tempObject).find("#append-tag").append(logoCardRow);

    if (typeof viewAllCard[0] !== 'undefined') {
        var cta = $(viewAllCard[0]).find("a");
        var span = $(viewAllCard[0]).find("span");
        if (typeof cta[0] !== 'undefined') {
            $(tempObject).find("#a-view-all-link").html(createLinkData(cta[0], "link"));
        }
        if (typeof span[0] !== 'undefined') {
            $(tempObject).find("#a-view-all-link-enable").html("<em><span style='font-size:15px;font-family:Calibri,sans-serif;color:black;'>Enable?: Yes</span></em>");
        }
    }







    return tempObject.innerHTML;
}

function buildOffSetCards(currentComponent) {
    var tempObject = document.createElement("div");
    tempObject.innerHTML = getComponentHtml("n-offset-cards");
    $(tempObject).find("#heading-append").after(appendCmsInfo(getCommentInfoFrom(currentComponent.parentNode, "ComponentID"), toBrowserTime(getCommentInfoFrom(currentComponent.parentNode, "ComponentModified"))));

    var mainHeadline = $(currentComponent).find("n-primary > n-content > h1");

    if (typeof mainHeadline[0] !== 'undefined') {
        $(tempObject).find("#main-headline").html(mainHeadline[0].innerHTML);
    }

    $(tempObject).find("#delete-for-content").remove();
    var tiles = $(currentComponent).find("a.offset-card-item-inner");


    var tilesToMake = tiles.length;
    if (tilesToMake >= 4) {

    } else {
        tilesToMake = 4;
    }

    for (var i = 0; i < tilesToMake; i++) {
        var newTile = "<tr style='height: 25.9pt;'>" +
            "<td style='width:  475.25pt; border: solid windowtext 1.0pt; border-top: none; padding: 0in 0in 0in 0in;' valign='top'> " +
            "<p style='margin: 0in; text-align: center; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong><em>Tile " + (i + 1) + "</em></strong></p>" +
            "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Headline]</strong></p>" +
            "<p id = 'a" + (i + 1) + "-h1'style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>&nbsp;</strong></p>" +
            "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Body]</strong></p>" +
            "<p id = 'a" + (i + 1) + "-body'style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>&nbsp;</strong></p>" +
            "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[CTA]</strong></p>" +
            "<p id = 'a" + (i + 1) + "-cta1'style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>&nbsp;</strong></p>" +
            "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Link]</strong></p>" +
            "<p id = 'a" + (i + 1) + "-link1'style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'>&nbsp;</br></p>" +
            "</td>  " +
            "</tr>";
        $(tempObject).find("#append-tag").append(newTile);
    }

    for (var i = 0; i < tiles.length; i++) {
        var headline = $(tiles[i]).find("n-content > h2");
        var body = $(tiles[i]).find("n-content > n-xpm-richtext");
        var linkText = $(tiles[i]).find("n-content > n-button-group > p > n-xpm-text");
        var link = tiles[i];

        if (typeof headline[0] !== 'undefined') {
            $(tempObject).find("#a" + (i + 1) + "-h1").html(headline[0].innerHTML + "</br>");
        } else {
            $(tempObject).find("#a" + (i + 1) + "-h1").html("&nbsp;</br>");
        }

        if (typeof body[0] !== 'undefined') {
            $(tempObject).find("#a" + (i + 1) + "-body").html(body[0].innerHTML + "</br>");
        } else {
            $(tempObject).find("#a" + (i + 1) + "-body").html("&nbsp;</br>");
        }

        if (typeof linkText[0] !== 'undefined') {
            $(tempObject).find("#a" + (i + 1) + "-cta1").html(linkText[0].innerHTML + "</br>");
        } else {
            $(tempObject).find("#a" + (i + 1) + "-cta1").html("&nbsp;</br>");
        }


        if (typeof link !== 'undefined') {
            $(tempObject).find("#a" + (i + 1) + "-link1").html(createLinkData(link, "link") + "</br>");

        } else {
            $(tempObject).find("#a" + (i + 1) + "-link1").html("&nbsp;</br>");
        }

    }

    return tempObject.innerHTML;
}

function buildPressReleaseArticle(currentComponent) {
    var tempObject = document.createElement("div");
    tempObject.innerHTML = getComponentHtml("n-press-release-article");
    $(tempObject).find("#heading-append").after(appendCmsInfo(getCommentInfoFrom(currentComponent, "ComponentID"), toBrowserTime(getCommentInfoFrom(currentComponent, "ComponentModified"))));
    var rtf = $(currentComponent).find("n-press-release-article-contact").find("n-richtext");
    var subheading = $(currentComponent).find("p.n-article-subheading");
    //these selctors one is for old articles, the other is for new articles
    var body = $(currentComponent).find("n-press-release-article-main > n-content > article > n-content > n-richtext, n-press-release-article-main > n-content > article > n-content > div");
    //this location currently wont return an acurate value
    var location = $(currentComponent).find("n-content > div > p:nth-child(1) > strong");
    var titleComponent = $(currentComponent.parentNode).find("n-title");

    if(typeof rtf[0] !== 'undefined'){
        $(tempObject).find("#rtf").html(rtf[0].innerHTML);
    }

    if(typeof subheading[0] !== 'undefined'){
        $(tempObject).find("#a1-subheading").html(subheading[0].innerHTML);
    }

    if(typeof body[0] !== 'undefined'){
        $(tempObject).find("#a1-body").html(body[0].innerHTML);
    }

    if(typeof titleComponent[0] !== 'undefined'){
        var theme = $(titleComponent[0]).attr('n-theme');
        var headline = $(titleComponent[0]).find("h1");
        var images = $(titleComponent[0]).find("n-secondary > img");
    
        var eyeBrow = $(titleComponent[0]).find("n-eyebrow > a.eyebrow");
    
        //this section dosent need to be here because press release articles dont have a theme, but if they get added later, this will be needed
        if (typeof eyeBrow[0] !== "undefined" && eyeBrow[0].innerHTML != "") {
            var eyeBrowSection = "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Eyebrow CTA]</strong></p>" +
                "<p id = 'a1-cta-eye' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>" +
                "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Eyebrow Link]</strong></p>" +
                "<p id = 'a1-link-eye' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>";
            $(tempObject).find("#page-content").before(eyeBrowSection);
            $(tempObject).find("#a1-cta-eye").html(createLinkData(eyeBrow[0], "linkText"));
            $(tempObject).find("#a1-link-eye").html(createLinkData(eyeBrow[0], "link"));
    
        }
    
        if (typeof theme !== "undefined") {
            $(tempObject).find("#theme").html("Theme: " + theme);
        }
    
        if (typeof headline[0] !== "undefined") {
            $(tempObject).find("#a1-h1").html(headline[0].innerHTML);
        }
        if (typeof images[0] !== 'undefined') {
            $(tempObject).find("#a1-image-source").html((createImageHtml(images[0])));
            $(tempObject).find("#a1-image-alt-text").html(images[0].alt);
        }
    }

    
    return tempObject.innerHTML;


}

function buildProductComparisonTable(currentComponent) {
    var tempObject = document.createElement("div");
    tempObject.innerHTML = getComponentHtml("n-product-comparison-table");
    $(tempObject).find("#heading-append").after(appendCmsInfo(getCommentInfoFrom(currentComponent.parentNode, "ComponentID"), toBrowserTime(getCommentInfoFrom(currentComponent.parentNode, "ComponentModified"))));
    $(currentComponent).find("img").removeAttr("width");
    $(currentComponent).find("img").attr("width", "640px");
    $(currentComponent).find("table, th, td").attr("border", "1");
    $(tempObject).find("#append-tag").html(currentComponent.innerHTML);

    return tempObject.outerHTML;
}

function buildProseMetaSideBar(currentComponent) {
    var tempObject = document.createElement("div");
    tempObject.innerHTML = getComponentHtml("n-prose-meta-side-bar");
    $(tempObject).find("#heading-append").after(appendCmsInfo(getCommentInfoFrom(currentComponent.parentNode, "ComponentID"), toBrowserTime(getCommentInfoFrom(currentComponent.parentNode, "ComponentModified"))));

    return tempObject.innerHTML;
}

function buildProseByline(currentComponent) {
    var tempObject = document.createElement("div");
    tempObject.innerHTML = getComponentHtml("n-prose-byline");
    $(tempObject).find("#heading-append").after(appendCmsInfo(getCommentInfoFrom(currentComponent.parentNode, "ComponentID"), toBrowserTime(getCommentInfoFrom(currentComponent.parentNode, "ComponentModified"))));

    return tempObject.innerHTML;
}

function buildProseTagList(currentComponent) {
    var tempObject = document.createElement("div");
    tempObject.innerHTML = getComponentHtml("n-prose-tag-list");
    $(tempObject).find("#heading-append").after(appendCmsInfo(getCommentInfoFrom(currentComponent.parentNode, "ComponentID"), toBrowserTime(getCommentInfoFrom(currentComponent.parentNode, "ComponentModified"))));

    return tempObject.innerHTML;
}

function buildProseGroupRegion(currentComponent) {
    var tempObject = document.createElement("div");
    tempObject.innerHTML = getComponentHtml("n-prose-group-region");
    $(tempObject).find("#heading-append").after(appendCmsInfo(getCommentInfoFrom(currentComponent.parentNode, "ComponentID"), toBrowserTime(getCommentInfoFrom(currentComponent.parentNode, "ComponentModified"))));

    return tempObject.innerHTML;
}

function buildQuoteBand(currentComponent) {
    var tempObject = document.createElement("div");
    tempObject.innerHTML = getComponentHtml("n-quote-band");
    $(tempObject).find("#heading-append").after(appendCmsInfo(getCommentInfoFrom(currentComponent, "ComponentID"), toBrowserTime(getCommentInfoFrom(currentComponent, "ComponentModified"))));

    var headline = $(currentComponent).find("n-primary > n-content > blockquote > h2");
    var body = $(currentComponent).find("n-primary > n-content > blockquote > p, n-primary > n-content > blockquote > div");
    var cta = $(currentComponent).find("n-button-group").find("a.cta");
    var images = $(currentComponent).find("n-secondary-image > img");
    var logoImage = $(currentComponent).find("n-primary > n-content > p > img");
    var theme = $(currentComponent).attr('n-theme');


    var eyeBrow = $(currentComponent).find("n-eyebrow > a.eyebrow");

    if (typeof eyeBrow[0] !== "undefined" && eyeBrow[0].innerHTML != "") {
        var eyeBrowSection = "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Eyebrow CTA]</strong></p>" +
            "<p id = 'a1-cta-eye' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>" +
            "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Eyebrow Link]</strong></p>" +
            "<p id = 'a1-link-eye' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>";
        $(tempObject).find("#page-content").before(eyeBrowSection);
        $(tempObject).find("#a1-cta-eye").html(createLinkData(eyeBrow[0], "linkText"));
        $(tempObject).find("#a1-link-eye").html(createLinkData(eyeBrow[0], "link"));

    }

    if (typeof logoImage[0] !== "undefined") {
        $(tempObject).find("#a1-image-logo-source").html(createImageHtml(logoImage[0]));
        $(tempObject).find("#a1-image-logo-alt-text").html(logoImage[0].alt);
    }

    if (typeof headline[0] !== 'undefined') {
        $(tempObject).find("#a1-h1").html(headline[0].innerHTML);
    }

    if (typeof body[0] !== 'undefined') {
        var bodyText = "";
        //there are imported customer stories, this loop will combine innner text of all paragraphs into one string
        for(var i = 0; i < body.length; i++) {
            bodyText += body[i].innerHTML;
        }
        $(tempObject).find("#a1-body").html(bodyText);
    }

    if (typeof cta[0] !== 'undefined') {
        $(tempObject).find("#a1-cta1").html(createLinkData(cta[0], "linkText"));
        $(tempObject).find("#a1-link1").html(createLinkData(cta[0], "link"));
    }

    if (typeof cta[1] !== 'undefined') {
        $(tempObject).find("#a1-cta2").html(createLinkData(cta[1], "linkText"));
        $(tempObject).find("#a1-link2").html(createLinkData(cta[1], "link"));
    }
    if (cta.length > 2) {
        for (var i = 2; i < cta.length; i++) {
            var addAnotherCtaSection = "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[CTA " + (i + 1) + "]</strong></p>" +
                "<p id = 'a1-cta" + (i + 1) + "' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>" +
                "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Link " + (i + 1) + "]</strong></p>" +
                "<p id = 'a1-link" + (i + 1) + "' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>"
            $(tempObject).find("#page-content").append(addAnotherCtaSection);
            $(tempObject).find("#a1-cta" + (i + 1) + "").html(createLinkData(cta[i], "linkText"));
            $(tempObject).find("#a1-link" + (i + 1) + "").html(createLinkData(cta[i], "link"));
        }

    }

    if (typeof images[0] !== 'undefined') {
        $(tempObject).find("#a1-image-source").html((createImageHtml(images[0])));
        $(tempObject).find("#a1-image-alt-text").html(images[0].alt);
    }

    if (typeof theme !== 'undefined') {
        $(tempObject).find("#theme").html('<em><span style="color: black;">Theme: </span></em>' + theme);
    }

    return tempObject.innerHTML;
}

function buildQuoteBandTabbed(currentComponent) {
    var tempObject = document.createElement("div");
    tempObject.innerHTML = getComponentHtml("n-quote-band-tabbed");
    $(tempObject).find("#heading-append").after(appendCmsInfo(getCommentInfoFrom(currentComponent, "ComponentID"), toBrowserTime(getCommentInfoFrom(currentComponent, "ComponentModified"))));
    $(tempObject).find("#delete-for-content").remove();

    var tabHeadings = $(currentComponent).find("n-primary-tabs > n-tab-list > ul > li.tab-link");
    var tabs = $(currentComponent).find("n-primary-tabs > div.tab-content");

    var tabsToMake = tabs.length;
    if (tabsToMake >= 3) {

    } else {
        tabsToMake = 3;
    }

    for (var i = 0; i < tabsToMake; i++) {
        var tabSection = "<tr style='height: 12.45pt;'>" +
            "<td colspan='4' style='width: 475.25pt; border: solid windowtext 1.0pt; border-top: none; background: #E7E6E6; padding: 0in 0in 0in 0in;' valign='top'>" +
            "<p style='margin: 0in; text-align: center; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em><span style='color: black;'>Tab " + (i + 1) + "</span></em></p>" +
            "</td>" +
            "</tr>" +
            "<tr style='height: 12.45pt;'>" +
            "<td colspan='4' style='width: 475.25pt; border: solid windowtext 1.0pt; border-top: none; background: #E7E6E6; padding: 0in 0in 0in 0in;' valign='top'>" +
            "<p style='margin: 0in; text-align: center; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em><span style='color: black;'>Tab Title</span></em></p>" +
            "</td>" +
            "</tr>" +
            "<tr style='height: 12.45pt;'>" +
            "<td style='width: 620px; border-color: currentcolor black black; border-style: none solid solid; border-width: medium 1pt 1pt; border-image: none 100% / 1 / 0 stretch; padding: 0in;' valign='top'>" +
            "<p id = 'tab-title" + (i + 1) + "' style='margin-right:0in;margin-left:0in;font-size:16px;font-family:Times New Roman,serif;margin:0in;'><em><span style='font-size:15px;font-family:Calibri,sans-serif;color:gray;'>&nbsp;</span></em><span style='font-size:15px;font-family:  Calibri,sans-serif;color:gray;'>&nbsp;</span></p>                                   " +
            "</td>" +
            "</tr>" +
            "<tr style='height: 12.45pt;'>" +
            "<td colspan='4' style='width: 475.25pt; border: solid windowtext 1.0pt; border-top: none; background: #E7E6E6; padding: 0in 0in 0in 0in;' valign='top'>" +
            "<p style='margin: 0in; text-align: center; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em><span style='color: black;'>Logo</span></em></p>" +
            "</td>" +
            "</tr>" +
            "<tr style='height: 26.7pt;'>" +
            "<td style='width: 620px; border-color: currentcolor black black; border-style: none solid solid; border-width: medium 1pt 1pt; border-image: none 100% / 1 / 0 stretch; padding: 0in; height: 96px;' valign='top'>" +
            "<p style='margin-right:0in;margin-left:0in;font-size:16px;font-family:Times New Roman,serif;margin:0in;'><em><span style='font-size:15px;font-family:Calibri,sans-serif;color:gray;'>Source:</span></em><span style='font-size:15px;font-family:  Calibri,sans-serif;color:gray;'>&nbsp;</span></p>" +
            "<p style='margin-right:0in;margin-left:0in;font-size:16px;font-family:Times New Roman,serif;margin:0in;'><em><span id='a" + (i + 1) + "-image-logo-source' style='font-size:15px;font-family:Calibri,sans-serif;color:gray;'>&nbsp;</span></em><span style='font-size:15px;font-family:Calibri,sans-serif;color:gray;'>&nbsp;</span></p>" +
            "<p style='margin-right:0in;margin-left:0in;font-size:16px;font-family:Times New Roman,serif;margin:0in;'><em><span style='font-size:15px;font-family:Calibri,sans-serif;color:gray;'>Alt text:</span></em><em><span style='font-size:15px;font-family:Calibri,sans-serif;color:#44546A;'>&nbsp;</span></em><span style='font-size:15px;font-family:Calibri,sans-serif;color:#44546A;'>&nbsp;</span></p>" +
            "<p style='margin-right:0in;margin-left:0in;font-size:16px;font-family:Times New Roman,serif;margin:0in;'><span id ='a" + (i + 1) + "-image-logo-alt-text'style='font-size:15px;font-family:Calibri,sans-serif;color:#44546A;'>&nbsp;</span></p>                                    " +
            "</td>" +
            "</tr>" +
            "<tr style='height: 12.45pt;'>" +
            "<td colspan='4' style='width: 475.25pt; border: solid windowtext 1.0pt; border-top: none; background: #E7E6E6; padding: 0in 0in 0in 0in;' valign='top'>" +
            "<p style='margin: 0in; text-align: center; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em><span style='color: black;'>Heading/Copy/Call to Action</span></em></p>" +
            "</td>" +
            "</tr>" +
            "<tr style='height: 54.6pt;'>" +
            "<td id= 'page-content" + (i + 1) + "' style='width: 620px; border-color: currentcolor black black; border-style: none solid solid; border-width: medium 1pt 1pt; border-image: none 100% / 1 / 0 stretch; padding: 0in; height: 160px;' valign='top'>" +
            "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Headline Quote]&nbsp;</strong></p>" +
            "<p id = 'a" + (i + 1) + "-h1'style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>&nbsp;</strong></p>        " +
            "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Body]</strong></p>" +
            "<p id = 'a" + (i + 1) + "-body' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>&nbsp;</strong></p>" +
            "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>&nbsp;</strong></p>" +
            "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[CTA 1]</strong></p>" +
            "<p id = 'a" + (i + 1) + "-cta1'style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>" +
            "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Link 1]</strong></p>" +
            "<p id = 'a" + (i + 1) + "-link1' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>" +
            "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[CTA 2]</strong></p>" +
            "<p id = 'a" + (i + 1) + "-cta2' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>" +
            "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Link 2]</strong></p>" +
            "<p id = 'a" + (i + 1) + "-link2' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>" +
            "</td>" +
            "</tr>" +
            "<tr style='height: 12.75pt;'>" +
            "<td style='width: 620px; border-color: currentcolor black black; border-style: none solid solid; border-width: medium 1pt 1pt; border-image: none 100% / 1 / 0 stretch; background: none 0% 0% repeat scroll #e7e6e6; padding: 0in; height: 32px;' valign='top'>" +
            "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em><span style='color: black;'>Main Image</span></em></p>" +
            "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>&nbsp;</strong></p>" +
            "</td>" +
            "</tr>" +
            "<tr style='height: 26.7pt;'>" +
            "<td style='width: 620px; border-color: currentcolor black black; border-style: none solid solid; border-width: medium 1pt 1pt; border-image: none 100% / 1 / 0 stretch; padding: 0in; height: 96px;' valign='top'>" +
            "<p style='margin-right:0in;margin-left:0in;font-size:16px;font-family:Times New Roman,serif;margin:0in;'><em><span style='font-size:15px;font-family:Calibri,sans-serif;color:gray;'>Source:</span></em><span style='font-size:15px;font-family:  Calibri,sans-serif;color:gray;'>&nbsp;</span></p>" +
            "<p style='margin-right:0in;margin-left:0in;font-size:16px;font-family:Times New Roman,serif;margin:0in;'><em><span id='a" + (i + 1) + "-image-source' style='font-size:15px;font-family:Calibri,sans-serif;color:gray;'>&nbsp;</span></em><span style='font-size:15px;font-family:Calibri,sans-serif;color:gray;'>&nbsp;</span></p>" +
            "<p style='margin-right:0in;margin-left:0in;font-size:16px;font-family:Times New Roman,serif;margin:0in;'><em><span style='font-size:15px;font-family:Calibri,sans-serif;color:gray;'>Alt text:</span></em><em><span style='font-size:15px;font-family:Calibri,sans-serif;color:#44546A;'>&nbsp;</span></em><span style='font-size:15px;font-family:Calibri,sans-serif;color:#44546A;'>&nbsp;</span></p>" +
            "<p style='margin-right:0in;margin-left:0in;font-size:16px;font-family:Times New Roman,serif;margin:0in;'><span id ='a" + (i + 1) + "-image-alt-text'style='font-size:15px;font-family:Calibri,sans-serif;color:#44546A;'>&nbsp;</span></p>                                    " +
            "</td>" +
            "</tr>";
        $(tempObject).find("#append-tag").append(tabSection);
    }

    for (var i = 0; i < tabHeadings.length; i++) {
        //console.log(tabHeadings[i]);
        $(tempObject).find("#tab-title" + (i + 1)).html(tabHeadings[i].innerHTML);
    }

    for (var i = 0; i < tabs.length; i++) {
        var headline = $(tabs[i]).find(" n-primary > n-content > blockquote > h2");
        var body = $(tabs[i]).find(" n-primary > n-content > blockquote > p");
        var cta = $(tabs[i]).find("n-button-group").find("a.cta");
        var images = $(tabs[i]).find("n-secondary-image > img");
        var logoImage = $(tabs[i]).find("n-primary > n-content > p > img");
        var theme = $(tabs[i]).attr('n-theme');


        var eyeBrow = $(tabs[i]).find("n-eyebrow > a.eyebrow");

        if (typeof eyeBrow[0] !== "undefined" && eyeBrow[0].innerHTML != "") {
            var eyeBrowSection = "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Eyebrow CTA]</strong></p>" +
                "<p id = 'a" + (i + 1) + "1-cta-eye' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>" +
                "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Eyebrow Link]</strong></p>" +
                "<p id = 'a" + (i + 1) + "-link-eye' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>";
            $(tempObject).find("#page-content").before(eyeBrowSection);
            $(tempObject).find("#a" + (i + 1) + "-cta-eye").html(createLinkData(eyeBrow[0], "linkText"));
            $(tempObject).find("#a" + (i + 1) + "-link-eye").html(createLinkData(eyeBrow[0], "link"));

        }

        if (typeof logoImage[0] !== "undefined") {
            $(tempObject).find("#a" + (i + 1) + "-image-logo-source").html(createImageHtml(logoImage[0], "link"));
            $(tempObject).find("#a" + (i + 1) + "-image-logo-alt-text").html(logoImage[0].alt);
        }

        if (typeof headline[0] !== 'undefined') {
            $(tempObject).find("#a" + (i + 1) + "-h1").html(headline[0].innerHTML);
        }

        if (typeof body[0] !== 'undefined') {
            $(tempObject).find("#a" + (i + 1) + "-body").html(body[0].innerHTML);
        }

        if (typeof cta[0] !== 'undefined') {
            $(tempObject).find("#a" + (i + 1) + "-cta1").html(createLinkData(cta[0], "linkText"));
            $(tempObject).find("#a" + (i + 1) + "-link1").html(createLinkData(cta[0], "link"));
        }

        if (typeof cta[1] !== 'undefined') {
            $(tempObject).find("#a" + (i + 1) + "-cta2").html(createLinkData(cta[1], "linkText"));
            $(tempObject).find("#a" + (i + 1) + "-link2").html(createLinkData(cta[1], "link"));
        }
        if (cta.length > 2) {
            for (var j = 2; j < cta.length; j++) {
                var addAnotherCtaSection = "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[CTA " + (j + 1) + "]</strong></p>" +
                    "<p id = 'a" + (i + 1) + "-cta" + (j + 1) + "' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>" +
                    "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Link " + (j + 1) + "]</strong></p>" +
                    "<p id = 'a" + (i + 1) + "-link" + (j + 1) + "' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>"
                $(tempObject).find("#page-content" + (i + 1)).append(addAnotherCtaSection);
                $(tempObject).find("#a" + (i + 1) + "-cta" + (j + 1) + "").html(createLinkData(cta[j], "linkText"));
                $(tempObject).find("#a" + (i + 1) + "-link" + (j + 1) + "").html(createLinkData(cta[j], "link"));
            }

        }

        if (typeof images[0] !== 'undefined') {
            $(tempObject).find("#a" + (i + 1) + "-image-source").html(createImageHtml(images[0], "link"));
            $(tempObject).find("#a" + (i + 1) + "-image-alt-text").html(images[0].alt);
        }

        if (typeof theme !== 'undefined') {
            $(tempObject).find("#theme").html('<em><span style="color: black;">Theme: </span></em>' + theme);
        }

    }

    return tempObject.innerHTML;
}

function buildSectionHeader(currentComponent) {
    var tempObject = document.createElement("div");
    tempObject.innerHTML = getComponentHtml("n-section-header");
    $(tempObject).find("#heading-append").after(appendCmsInfo(getCommentInfoFrom(currentComponent, "ComponentID"), toBrowserTime(getCommentInfoFrom(currentComponent, "ComponentModified"))));

    var headline = $(currentComponent).find("n-primary > n-content > h1");
    var body = $(currentComponent).find("n-xpm-richtext");
    var cta = $(currentComponent).find("n-button-group").find("a.cta");

    if (typeof headline[0] !== 'undefined') {
        $(tempObject).find("#a1-h1").html(headline[0].innerHTML + "&nbsp;<br/>");
    }

    if (typeof body[0] !== 'undefined') {
        $(tempObject).find("#a1-body").html(body[0].innerHTML);
    }

    if (typeof cta[0] !== 'undefined') {
        $(tempObject).find("#a1-cta1").html(createLinkData(cta[0], "linkText"));
        $(tempObject).find("#a1-link1").html(createLinkData(cta[0], "link"));
    }

    if (typeof cta[1] !== 'undefined') {
        $(tempObject).find("#a1-cta2").html(createLinkData(cta[1], "linkText"));
        $(tempObject).find("#a1-link2").html(createLinkData(cta[1], "link"));
    }
    if (cta.length > 2) {
        for (var i = 2; i < cta.length; i++) {
            var addAnotherCtaSection = "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[CTA " + (i + 1) + "]</strong></p>" +
                "<p id = 'a1-cta" + (i + 1) + "' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>" +
                "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Link " + (i + 1) + "]</strong></p>" +
                "<p id = 'a1-link" + (i + 1) + "' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>"
            $(tempObject).find("#page-content").append(addAnotherCtaSection);
            $(tempObject).find("#a1-cta" + (i + 1) + "").html(createLinkData(cta[i], "linkText"));
            $(tempObject).find("#a1-link" + (i + 1) + "").html(createLinkData(cta[i], "link"));
        }

    }


    return tempObject.innerHTML;
}

function buildShowcase(currentComponent) {
    var tempObject = document.createElement("div");
    tempObject.innerHTML = getComponentHtml("n-showcase");
    $(tempObject).find("#heading-append").after(appendCmsInfo(getCommentInfoFrom(currentComponent.parentNode, "ComponentID"), toBrowserTime(getCommentInfoFrom(currentComponent.parentNode, "ComponentModified"))));

    var leftBarHeadline = $(currentComponent).find("n-primary > n-content > h1");

    if (typeof leftBarHeadline[0] !== 'undefined') {
        $(tempObject).find("#a1-left-h1").html(leftBarHeadline[0].innerHTML + "&nbsp;<br/>");
    }

    var cards = $(currentComponent).find("n-secondary > div.n-card");

    for (var i = 0; i < cards.length; i++) {
        //get the content we need
        var headline = $(cards[i]).find("n-content > h2");
        var body = $(cards[i]).find("n-content > div > n-richtext");
        var cta = $(cards[i]).find("n-content > n-button-group").find("a.cta");
        var images = $(cards[i]).find("n-content > img");

        //if we find more than 3 accordions, we need to add a new section to the html document
        if (i > 2) {
            var cardSection =
                "<tr>" +
                "<td style='width: 475.25pt;border-right: 1pt solid windowtext;border-bottom: 1pt solid windowtext;border-left: 1pt solid windowtext;border-top: none;background: rgb(231, 230, 230);padding: 0in;height: 16.55pt;border-image: initial;vertical-align: top;'>" +
                "<p id='card-" + (i + 1) + "' style='margin-right:0in;margin-left:0in;font-size:16px;font-family:Times New Roman,serif;margin:0in;text-align:center;'><em><span style='font-size:15px;font-family:Calibri,sans-serif;color:black;'>Card " + (i + 1) + "</span></em></p>" +
                "</td>" +
                "</tr>" +
                "<tr>" +
                "<td style='width: 475.25pt;border-right: 1pt solid windowtext;border-bottom: 1pt solid windowtext;border-left: 1pt solid windowtext;border-top: none;background: rgb(231, 230, 230);padding: 0in;height: 16.55pt;border-image: initial;vertical-align: top;'>" +
                "<p style='margin-right:0in;margin-left:0in;font-size:16px;font-family:Times New Roman,serif;margin:0in;'><em><span style='font-size:15px;font-family:Calibri,sans-serif;color:black;'>Image</span></em></p>" +
                "</td>" +
                "</tr>" +
                "<tr>" +
                "<td style='width: 475.25pt;border-right: 1pt solid windowtext;border-bottom: 1pt solid windowtext;border-left: 1pt solid windowtext;border-top: none;padding: 0in;height: 104.55pt;border-image: initial;vertical-align: top;'>" +
                "<p style='margin-right:0in;margin-left:0in;font-size:16px;font-family:Times New Roman,serif;margin:0in;'><em><span style='font-size:15px;font-family:Calibri,sans-serif;color:gray;'>Source:</span></em><span style='font-size:15px;font-family:  Calibri,sans-serif;color:gray;'>&nbsp;</span></p>" +
                "<p style='margin-right:0in;margin-left:0in;font-size:16px;font-family:Times New Roman,serif;margin:0in;'><em><span id='a" + (i + 1) + "-image-source' style='font-size:15px;font-family:Calibri,sans-serif;color:gray;'>&nbsp;</span></em><span style='font-size:15px;font-family:Calibri,sans-serif;color:gray;'>&nbsp;</span></p>" +
                "   <p style='margin-right:0in;margin-left:0in;font-size:16px;font-family:Times New Roman,serif;margin:0in;'><em><span style='font-size:15px;font-family:Calibri,sans-serif;color:gray;'>Alt text:</span></em><em><span style='font-size:15px;font-family:Calibri,sans-serif;color:#44546A;'>&nbsp;</span></em><span style='font-size:15px;font-family:Calibri,sans-serif;color:#44546A;'>&nbsp;</span></p>" +
                "    <p style='margin-right:0in;margin-left:0in;font-size:16px;font-family:Times New Roman,serif;margin:0in;'><span id ='a" + (i + 1) + "-image-alt-text'style='font-size:15px;font-family:Calibri,sans-serif;color:#44546A;'>&nbsp;</span></p>                " +
                "</td>" +
                "</tr>" +
                "<tr>" +
                "<td style='width: 475.25pt;border-right: 1pt solid windowtext;border-bottom: 1pt solid windowtext;border-left: 1pt solid windowtext;border-top: none;padding: 0in;height: 34.45pt;border-image: initial;vertical-align: top;'>" +
                "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Headline]&nbsp;</strong></p>" +
                "<p id = 'a" + (i + 1) + "-h1'style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>&nbsp;</strong></p> " +
                "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Body]</strong></p>" +
                "<p id = 'a" + (i + 1) + "-body' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>&nbsp;</strong></p>" +
                "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>&nbsp;</strong></p>" +
                "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[CTA]</strong></p>" +
                "   <p id = 'a" + (i + 1) + "-cta1'style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>" +
                "   <p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Link]</strong></p>" +
                "   <p id = 'a" + (i + 1) + "-link1' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>" +
                "</td>            " +
                "</tr>     ";

            $(tempObject).find("#append-tag").append(cardSection);

        }

        if (typeof images[0] !== 'undefined') {
            $(tempObject).find("#a" + (i + 1) + "-image-source").html((createImageHtml(images[0])));
            $(tempObject).find("#a" + (i + 1) + "-image-alt-text").html(images[0].alt);
        }

        if (typeof headline[0] !== 'undefined') {
            $(tempObject).find("#a" + (i + 1) + "-h1").html(headline[0].innerHTML);
        }



        if (typeof body[0] !== 'undefined') {
            $(tempObject).find("#a" + (i + 1) + "-body").html(body[0].innerHTML);
        }

        if (typeof cta[0] !== 'undefined') {
            $(tempObject).find("#a" + (i + 1) + "-cta1").html(createLinkData(cta[0], "linkText"));
            $(tempObject).find("#a" + (i + 1) + "-link1").html(createLinkData(cta[0], "link"));
        }

        if (typeof cta[1] !== 'undefined') {
            $(tempObject).find("#a" + (i + 1) + "-cta1").html(createLinkData(cta[1], "linkText"));
            $(tempObject).find("#a" + (i + 1) + "-link1").html(createLinkData(cta[1], "link"));
        }

    }

    return tempObject.innerHTML;
}

function buildSideXSide(currentComponent) {
    var tempObject = document.createElement("div");
    tempObject.innerHTML = getComponentHtml("n-side-x-side");

    if (currentComponent.parentNode.localName == "n-prose-full-width") {
        $(tempObject).find("#heading-append").after(appendCmsInfo(getCommentInfoFrom(currentComponent, "ComponentID"), toBrowserTime(getCommentInfoFrom(currentComponent, "ComponentModified"))));
    } else {
        $(tempObject).find("#heading-append").after(appendCmsInfo(getCommentInfoFrom(currentComponent.parentNode, "ComponentID"), toBrowserTime(getCommentInfoFrom(currentComponent.parentNode, "ComponentModified"))));
    }

    var headline = $(currentComponent).find("n-primary > n-content > h1");
    var body = $(currentComponent).find("n-xpm-richtext");
    var cta = $(currentComponent).find("n-button-group").find("a.cta");
    var images = $(currentComponent).find("n-secondary > img");
    var videoOverlay = $(currentComponent).find(" n-secondary > a.cta");
    var threeDDemo = $(currentComponent).find("n-secondary > n-3d-demo > a");

    var eyeBrow = $(currentComponent).find("n-eyebrow > a.eyebrow");

    if (typeof eyeBrow[0] !== "undefined" && eyeBrow[0].innerHTML != "") {
        var eyeBrowSection = "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Eyebrow CTA]</strong></p>" +
            "<p id = 'a1-cta-eye' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>" +
            "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Eyebrow Link]</strong></p>" +
            "<p id = 'a1-link-eye' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>";
        $(tempObject).find("#page-content").before(eyeBrowSection);
        $(tempObject).find("#a1-cta-eye").html(createLinkData(eyeBrow[0], "linkText"));
        $(tempObject).find("#a1-link-eye").html(createLinkData(eyeBrow[0], "link"));

    }

    if (typeof headline[0] !== 'undefined') {
        $(tempObject).find("#a1-h1").html(headline[0].innerHTML);
    }

    if (typeof body[0] !== 'undefined') {
        $(tempObject).find("#a1-body").html(body[0].innerHTML);
    }

    if (typeof cta[0] !== 'undefined') {
        $(tempObject).find("#a1-cta1").html(createLinkData(cta[0], "linkText"));
        $(tempObject).find("#a1-link1").html(createLinkData(cta[0], "link"));
    }

    if (typeof cta[1] !== 'undefined') {
        $(tempObject).find("#a1-cta2").html(createLinkData(cta[1], "linkText"));
        $(tempObject).find("#a1-link2").html(createLinkData(cta[1], "link"));
    }
    if (cta.length > 2) {
        for (var i = 2; i < cta.length; i++) {
            var addAnotherCtaSection = "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[CTA " + (i + 1) + "]</strong></p>" +
                "<p id = 'a1-cta" + (i + 1) + "' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>" +
                "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Link " + (i + 1) + "]</strong></p>" +
                "<p id = 'a1-link" + (i + 1) + "' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>"
            $(tempObject).find("#page-content").append(addAnotherCtaSection);
            $(tempObject).find("#a1-cta" + (i + 1) + "").html(createLinkData(cta[i], "linkText"));
            $(tempObject).find("#a1-link" + (i + 1) + "").html(createLinkData(cta[i], "link"));
        }

    }

    if (typeof images[0] !== 'undefined') {
        $(tempObject).find("#a1-image-source").html((createImageHtml(images[0])));
        $(tempObject).find("#a1-image-alt-text").html(images[0].alt);
    }

    if (typeof videoOverlay[0] !== "undefined") {
        var videoImage = $(videoOverlay[0]).find("img");
        $(tempObject).find("#a1-overlay").html("Video: </br>" + createLinkData(videoOverlay[0], "link"));
        $(tempObject).find("#a1-image-source").html((createImageHtml(videoImage[0])));
        $(tempObject).find("#a1-image-alt-text").html(videoImage[0].alt);

    }

    if (typeof threeDDemo[0] !== "undefined") {
        $(tempObject).find("#a1-overlay").html("3D Demo: </br>" + threeDDemo[0].title);
    }



    return tempObject.innerHTML;
}

function buildSideXSideTabs(currentComponent) {
    var tempObject = document.createElement("div");
    tempObject.innerHTML = getComponentHtml("n-side-x-side-tabs");
    $(tempObject).find("#heading-append").after(appendCmsInfo(getCommentInfoFrom(currentComponent, "ComponentID"), toBrowserTime(getCommentInfoFrom(currentComponent, "ComponentModified"))));
    var images = $(currentComponent).find("n-secondary > img");
    var videoOverlay = $(currentComponent).find(" n-secondary > a.cta");
    var threeDDemo = $(currentComponent).find("n-secondary > n-3d-demo > a");

    if (typeof images[0] !== 'undefined') {
        $(tempObject).find("#a1-image-source").html((createImageHtml(images[0])));
        $(tempObject).find("#a1-image-alt-text").html(images[0].alt);
    }

    if (typeof videoOverlay[0] !== "undefined") {
        var videoImage = $(videoOverlay[0]).find("img");
        $(tempObject).find("#a1-overlay").html("Video: </br>" + createLinkData(videoOverlay[0], "link"));
        $(tempObject).find("#a1-image-source").html((createImageHtml(videoImage[0])));
        $(tempObject).find("#a1-image-alt-text").html(videoImage[0].alt);

    }

    if (typeof threeDDemo[0] !== "undefined") {
        $(tempObject).find("#a1-overlay").html("3D Demo: </br>" + threeDDemo[0].title);
    }

    var tabs = $(currentComponent).find("n-primary > n-tabs > div.tab-content");

    for (var i = 0; i < tabs.length; i++) {
        var headline = $(tabs[i]).find("n-content > h1");
        var body = $(tabs[i]).find("n-xpm-richtext");
        var cta = $(tabs[i]).find("n-button-group").find("a.cta");
        var tabTitle = $(tabs[i]).attr("data-tab-title");

        if (typeof tabTitle !== "undefined") {
            $(tempObject).find("#tab-title" + (i + 1)).html(tabTitle);

        }


        var eyeBrow = $(tabs[i]).find("n-eyebrow > a.eyebrow");

        if (typeof eyeBrow[0] !== "undefined" && eyeBrow[0].innerHTML != "") {
            var eyeBrowSection = "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Eyebrow CTA]</strong></p>" +
                "<p id = 'a" + (i + 1) + "-cta-eye' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>" +
                "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Eyebrow Link]</strong></p>" +
                "<p id = 'a" + (i + 1) + "-link-eye' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>";
            $(tempObject).find("#page-content" + (i + 1) + "").before(eyeBrowSection);
            $(tempObject).find("#a" + (i + 1) + "-cta-eye").html(createLinkData(eyeBrow[0], "linkText"));
            $(tempObject).find("#a" + (i + 1) + "-link-eye").html(createLinkData(eyeBrow[0], "link"));

        }

        if (typeof headline[0] !== 'undefined') {
            $(tempObject).find("#a" + (i + 1) + "-h1").html(headline[0].innerHTML);
        }

        if (typeof body[0] !== 'undefined') {
            $(tempObject).find("#a" + (i + 1) + "-body").html(body[0].innerHTML);
        }

        if (typeof cta[0] !== 'undefined') {
            $(tempObject).find("#a" + (i + 1) + "-cta1").html(createLinkData(cta[0], "linkText"));
            $(tempObject).find("#a" + (i + 1) + "-link1").html(createLinkData(cta[0], "link"));
        }

        if (typeof cta[1] !== 'undefined') {
            $(tempObject).find("#a" + (i + 1) + "-cta2").html(createLinkData(cta[1], "linkText"));
            $(tempObject).find("#a" + (i + 1) + "-link2").html(createLinkData(cta[1], "link"));
        }
        if (cta.length > 2) {
            for (var j = 2; j < cta.length; j++) {
                var addAnotherCtaSection = "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[CTA " + (j + 1) + "]</strong></p>" +
                    "<p id = 'a" + (i + 1) + "-cta" + (j + 1) + "' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>" +
                    "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Link " + (j + 1) + "]</strong></p>" +
                    "<p id = 'a" + (i + 1) + "-link" + (j + 1) + "' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>"
                $(tempObject).find("#page-content1").append(addAnotherCtaSection);
                $(tempObject).find("#a" + (i + 1) + "-cta" + (j + 1) + "").html(createLinkData(cta[j], "linkText"));
                $(tempObject).find("#a" + (i + 1) + "-link" + (j + 1) + "").html(createLinkData(cta[j], "link"));
            }

        }



    }



    return tempObject.innerHTML;
}

function buildStatBand(currentComponent) {
    var tempObject = document.createElement("div");
    tempObject.innerHTML = getComponentHtml("n-stat-band");
    $(tempObject).find("#heading-append").after(appendCmsInfo(getCommentInfoFrom(currentComponent.parentNode, "ComponentID"), toBrowserTime(getCommentInfoFrom(currentComponent.parentNode, "ComponentModified"))));

    var theme = $(currentComponent).attr('n-theme');
    var headline = $(currentComponent).find("h1");
    var stats = $(currentComponent).find("ul.n-stat-band-items > li");



    if (typeof theme !== "undefined") {
        $(tempObject).find("#theme").html("Theme: " + theme);
    }

    if (typeof headline[0] !== "undefined") {
        $(tempObject).find("#a1-h1").html(headline[0].innerHTML);
    }

    for (var i = 0; i < 3; i++) {
        if (typeof stats[i] !== "undefined") {
            var text = $(stats[i]);

            if (typeof stats[i] !== "undefined") {
                $(tempObject).find("#stat" + (i + 1) + "-remove").remove();
                $(tempObject).find("#stat" + (i + 1) + "-text").html(stats[i].innerText);
            }





        }
    }

    return tempObject.innerHTML;
}

function buildTabbedBandTiles(currentComponent) {
    var tempObject = document.createElement("div");
    tempObject.innerHTML = getComponentHtml("n-tabbed-band-tiles");
    $(tempObject).find("#heading-append").after(appendCmsInfo(getCommentInfoFrom(currentComponent.parentNode, "ComponentID"), toBrowserTime(getCommentInfoFrom(currentComponent.parentNode, "ComponentModified"))));

    var headline = $(currentComponent).find("n-primary > div > n-content > h1");
    var body = $(currentComponent).find("n-xpm-richtext");
    var cta = $(currentComponent).find("n-content").find("a.cta");
    var images = $(currentComponent).find("n-secondary > img");

    var eyeBrow = $(currentComponent).find("n-eyebrow > a.eyebrow");

    if (typeof eyeBrow[0] !== "undefined" && eyeBrow[0].innerHTML != "") {
        var eyeBrowSection = "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Eyebrow CTA]</strong></p>" +
            "<p id = 'a1-cta-eye' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>" +
            "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Eyebrow Link]</strong></p>" +
            "<p id = 'a1-link-eye' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>";
        $(tempObject).find("#page-content").before(eyeBrowSection);
        $(tempObject).find("#a1-cta-eye").html(createLinkData(eyeBrow[0], "linkText"));
        $(tempObject).find("#a1-link-eye").html(createLinkData(eyeBrow[0], "link"));

    }

    if (typeof headline[0] !== 'undefined') {
        $(tempObject).find("#a1-h1").html(headline[0].innerHTML);
    }

    if (typeof body[0] !== 'undefined') {
        $(tempObject).find("#a1-body").html(body[0].innerHTML);
    }

    if (typeof cta[0] !== 'undefined') {
        $(tempObject).find("#a1-cta1").html(createLinkData(cta[0], "linkText"));
        $(tempObject).find("#a1-link1").html(createLinkData(cta[0], "link"));
    }

    if (typeof cta[1] !== 'undefined') {
        $(tempObject).find("#a1-cta2").html(createLinkData(cta[1], "linkText"));
        $(tempObject).find("#a1-link2").html(createLinkData(cta[1], "link"));
    }
    if (cta.length > 2) {
        for (var i = 2; i < cta.length; i++) {
            var addAnotherCtaSection = "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[CTA " + (i + 1) + "]</strong></p>" +
                "<p id = 'a1-cta" + (i + 1) + "' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>" +
                "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Link " + (i + 1) + "]</strong></p>" +
                "<p id = 'a1-link" + (i + 1) + "' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>"
            $(tempObject).find("#page-content").append(addAnotherCtaSection);
            $(tempObject).find("#a1-cta" + (i + 1) + "").html(createLinkData(cta[i], "linkText"));
            $(tempObject).find("#a1-link" + (i + 1) + "").html(createLinkData(cta[i], "link"));
        }

    }

    if (typeof images[0] !== 'undefined') {
        $(tempObject).find("#a1-image-source").html((createImageHtml(images[0])));
        $(tempObject).find("#a1-image-alt-text").html(images[0].alt);
    }
    var tabs = $(currentComponent).find("n-secondary > div.tab-content");

    $(tempObject).find("#delete-for-content").remove();

    for (var j = 0; j < tabs.length; j++) {
        var tabHtml = "<tr  style='height: 17.5pt;'>" +
            "            <td colspan='2' style='width: 475.25pt; border: solid windowtext 1.0pt; border-top: none; background: #E7E6E6; padding: 0in 0in 0in 0in;' valign='top'>" +
            "                <p style='margin: 0in; text-align: center; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em><span style='color: black;'>Tab " + (j + 1) + "</span></em></p>" +
            "            </td>" +
            "        </tr>" +
            "        <tr  style='height: 17.5pt;'>" +
            "            <td colspan='2' style='width: 475.25pt; border: solid windowtext 1.0pt; border-top: none; background: #E7E6E6; padding: 0in 0in 0in 0in;' valign='top'>" +
            "                <p style='margin: 0in; text-align: center; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em><span style='color: black;'>Tab title</span></em></p>" +
            "            </td>" +
            "        </tr>" +
            "        <tr  style='height: 17.5pt;'>" +
            "            <td colspan='2' style='width: 475.25pt; border: solid windowtext 1.0pt; border-top: none; padding: 0in 0in 0in 0in;' valign='top'>" +
            "                <p id = 'tab-title-" + (j + 1) + "' style='margin: 0in; text-align: center; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em><span></span></em></p>" +
            "            </td>" +
            "        </tr> ";
        $(tempObject).find("#append-tag").append(tabHtml);

        var tabTitle = $(tabs[j]).attr("data-tab-title");

        if (typeof tabTitle !== "undefined") {
            $(tempObject).find("#tab-title-" + (j + 1)).html(tabTitle);

        }

        var tiles = $(tabs[j]).find("div > div > a.slider-item, div > div > div.slider-item");


        var tilesToMake = tiles.length;
        if (tilesToMake < 4) {
            tilesToMake = 4;
        }

        for (var i = 0; i < tilesToMake; i++) {
            var newTile = "<tr style='height: 25.9pt;'>" +
                "<td style='width:  475.25pt; border: solid windowtext 1.0pt; border-top: none; padding: 0in 0in 0in 0in;' valign='top'> " +
                "<p style='margin: 0in; text-align: center; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong><em>Tile " + (i + 1) + "</em></strong></p>" +
                "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Headline]</strong></p>" +
                "<p id = 'tab-" + (j + 1) + "-tile" + (i + 1) + "-h1'style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>&nbsp;</strong></p>" +
                "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Body]</strong></p>" +
                "<p id = 'tab-" + (j + 1) + "-tile" + (i + 1) + "-body'style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>&nbsp;</strong></p>" +
                "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[CTA]</strong></p>" +
                "<p id = 'tab-" + (j + 1) + "-tile" + (i + 1) + "-cta1'style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>&nbsp;</strong></p>" +
                "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Link]</strong></p>" +
                "<p id = 'tab-" + (j + 1) + "-tile" + (i + 1) + "-link1'style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'></p>" +
                "</td>  " +
                "</tr>";
            $(tempObject).find("#append-tag").append(newTile);
        }

        for (var i = 0; i < tiles.length; i++) {
            var headline = $(tiles[i]).find("n-content > h1");
            var body = $(tiles[i]).find("n-content > div > n-xpm-richtext, n-content > n-xpm-richtext");
            var linkText = $(tiles[i]).find("n-content > n-button-group > p.cta");
            var link = tiles[i];

            if (typeof headline[0] !== 'undefined') {
                $(tempObject).find("#tab-" + (j + 1) + "-tile" + (i + 1) + "-h1").html(headline[0].innerHTML + "</br>");
            } else {
                $(tempObject).find("#tab-" + (j + 1) + "-tile" + (i + 1) + "-h1").html("&nbsp;</br>");
            }

            if (typeof body[0] !== 'undefined') {
                $(tempObject).find("#tab-" + (j + 1) + "-tile" + (i + 1) + "-body").html(body[0].innerHTML + "</br>");
            } else {
                $(tempObject).find("#tab-" + (j + 1) + "-tile" + (i + 1) + "-body").html("&nbsp;</br>");
            }

            if (typeof linkText[0] !== 'undefined') {
                $(tempObject).find("#tab-" + (j + 1) + "-tile" + (i + 1) + "-cta1").html(linkText[0].innerHTML + "</br>");
            } else {
                $(tempObject).find("#tab-" + (j + 1) + "-tile" + (i + 1) + "-cta1").html("&nbsp;</br>");
            }

            if (typeof tiles[i] !== 'undefined' && $(tiles[i]).attr('href') !== undefined) {
                $(tempObject).find("#tab-" + (j + 1) + "-tile" + (i + 1) + "-link1").html(createLinkData(tiles[i], "link") + "</br>");
            } else {
                $(tempObject).find("#tab-" + (j + 1) + "-tile" + (i + 1) + "-link1").html("&nbsp;</br>");
            }

        }
    }

    return tempObject.innerHTML;
}

function buildTabbedBand(currentComponent) {
    var tempObject = document.createElement("div");
    tempObject.innerHTML = getComponentHtml("n-tabbed-band");
    $(tempObject).find("#heading-append").after(appendCmsInfo(getCommentInfoFrom(currentComponent, "ComponentID"), toBrowserTime(getCommentInfoFrom(currentComponent, "ComponentModified"))));
    $(tempObject).find("#delete-for-content").remove();



    var theme = $(currentComponent).attr('n-theme');
    var tabs = $(currentComponent).find("div.tab-content");

    if (typeof theme !== "undefined") {
        $(tempObject).find("#theme").html("Theme: " + theme);
    }

    var tabSectionsToMake = tabs.length;

    if (tabSectionsToMake < 3) {
        tabSectionsToMake = 3;
    }

    for (var i = 0; tabSectionsToMake > i; i++) {
        var newTab = "<tr  style='height: 16.55pt;'>" +
            "<td style='width: 151.45pt; border: solid windowtext 1.0pt; border-top: none; background: #E7E6E6; padding: 0in 0in 0in 0in;' valign='top'>" +
            "<p style='margin: 0in; text-align: center; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em><span style='color: black;'>Tab " + (i + 1) + "</span></em></p>" +
            "</td>            " +
            "</tr>" +
            "<tr  style='height: 16.55pt;'>" +
            "<td style='width: 151.45pt; border: solid windowtext 1.0pt; border-top: none; background: #E7E6E6; padding: 0in 0in 0in 0in;' valign='top'>" +
            "<p style='margin: 0in; text-align: center; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em><span style='color: black;'>Tab Title</span></em></p>" +
            "</td>            " +
            "</tr>" +
            "<tr style='height: 16.55pt;'>" +
            "<td style='width: 620px; border-color: currentcolor black black; border-style: none solid solid; border-width: medium 1pt 1pt; border-image: none 100% / 1 / 0 stretch; padding: 0in;' valign='top'>" +
            "<p id= 'tab-title-" + (i + 1) + "' style='margin-right:0in;margin-left:0in;font-size:16px;font-family:Times New Roman,serif;margin:0in;'><em><span style='font-size:15px;font-family:Calibri,sans-serif;color:gray;'></span></em><span style='font-size:15px;font-family:  Calibri,sans-serif;color:gray;'>&nbsp;</span></p>                                               " +
            "</td>" +
            "</tr>" +
            "<tr style='height: 16px;'>" +
            "<td style='width: 620px; border-color: currentcolor black black; border-style: none solid solid; border-width: medium 1pt 1pt; border-image: none 100% / 1 / 0 stretch; background: none 0% 0% repeat scroll #e7e6e6; padding: 0in; height: 16px;' valign='top'>" +
            "<p style='margin: 0in; text-align: center; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em><span style='color: black;'>Heading/Copy/Call to Action</span></em></p>" +
            "</td>" +
            "</tr>" +
            "<tr style='height: 54.6pt;'>" +
            "<td id= 'tab" + (i + 1) + "-content' style='width: 620px; border-color: currentcolor black black; border-style: none solid solid; border-width: medium 1pt 1pt; border-image: none 100% / 1 / 0 stretch; padding: 0in; height: 160px;' valign='top'>" +
            "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Headline]&nbsp;</strong></p>" +
            "<p id = 'a" + (i + 1) + "-h1'style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>&nbsp;</strong></p>                " +
            "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Body]</strong></p>" +
            "<p id = 'a" + (i + 1) + "-body' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>&nbsp;</strong></p>" +
            "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>&nbsp;</strong></p>" +
            "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[CTA 1]</strong></p>" +
            "<p id = 'a" + (i + 1) + "-cta1'style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>" +
            "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Link 1]</strong></p>" +
            "<p id = 'a" + (i + 1) + "-link1' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>" +
            "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[CTA 2]</strong></p>" +
            "<p id = 'a" + (i + 1) + "-cta2' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>" +
            "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Link 2]</strong></p>" +
            "<p id = 'a" + (i + 1) + "-link2' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>" +
            "</td>" +
            "</tr>" +
            "<tr style='height: 12.75pt;'>" +
            "<td style='width: 620px; border-color: currentcolor black black; border-style: none solid solid; border-width: medium 1pt 1pt; border-image: none 100% / 1 / 0 stretch; background: none 0% 0% repeat scroll #e7e6e6; padding: 0in; height: 32px;' valign='top'>" +
            "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em><span style='color: black;'>Image</span></em></p>" +
            "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>&nbsp;</strong></p>" +
            "</td>" +
            "</tr>" +
            "<tr style='height: 26.7pt;'>" +
            "<td style='width: 620px; border-color: currentcolor black black; border-style: none solid solid; border-width: medium 1pt 1pt; border-image: none 100% / 1 / 0 stretch; padding: 0in; height: 96px;' valign='top'>" +
            "<p style='margin-right:0in;margin-left:0in;font-size:16px;font-family:Times New Roman,serif;margin:0in;'><em><span style='font-size:15px;font-family:Calibri,sans-serif;color:gray;'>Source:</span></em><span style='font-size:15px;font-family:  Calibri,sans-serif;color:gray;'>&nbsp;</span></p>" +
            "<p style='margin-right:0in;margin-left:0in;font-size:16px;font-family:Times New Roman,serif;margin:0in;'><em><span id='a" + (i + 1) + "-image-source' style='font-size:15px;font-family:Calibri,sans-serif;color:gray;'>&nbsp;</span></em><span style='font-size:15px;font-family:Calibri,sans-serif;color:gray;'>&nbsp;</span></p>" +
            "<p style='margin-right:0in;margin-left:0in;font-size:16px;font-family:Times New Roman,serif;margin:0in;'><em><span style='font-size:15px;font-family:Calibri,sans-serif;color:gray;'>Alt text:</span></em><em><span style='font-size:15px;font-family:Calibri,sans-serif;color:#44546A;'>&nbsp;</span></em><span style='font-size:15px;font-family:Calibri,sans-serif;color:#44546A;'>&nbsp;</span></p>" +
            "<p style='margin-right:0in;margin-left:0in;font-size:16px;font-family:Times New Roman,serif;margin:0in;'><span id ='a" + (i + 1) + "-image-alt-text'style='font-size:15px;font-family:Calibri,sans-serif;color:#44546A;'>&nbsp;</span></p>                                    " +
            "</td>" +
            "</tr>";
        $(tempObject).find("#append-tag").append(newTab);

    }

    for (var i = 0; i < tabs.length; i++) {
        var images = $(tabs[i]).find("n-secondary > img");
        var videoOverlay = $(tabs[i]).find(" n-secondary > a.cta");
        var threeDDemo = $(tabs[i]).find("n-secondary > n-3d-demo > a");

        if (typeof images[0] !== 'undefined') {
            $(tempObject).find("#a" + (i + 1) + "-image-source").html((createImageHtml(images[0])));
            $(tempObject).find("#a" + (i + 1) + "-image-alt-text").html(images[0].alt);
        }

        if (typeof videoOverlay[0] !== "undefined") {
            var videoImage = $(videoOverlay[0]).find("img");
            $(tempObject).find("#a" + (i + 1) + "-image-source").before("Video: </br>" + createLinkData(videoOverlay[0], "link"));
            $(tempObject).find("#a" + (i + 1) + "-image-source").html((createImageHtml(videoImage[0])));
            $(tempObject).find("#a" + (i + 1) + "-image-alt-text").html(videoImage[0].alt);

        }

        if (typeof threeDDemo[0] !== "undefined") {
            $(tempObject).find("#a" + (i + 1) + "-image-source").html("3D Demo: </br>" + threeDDemo[0].title);
        }


        var headline = $(tabs[i]).find("n-content > h1");
        var body = $(tabs[i]).find("n-xpm-richtext");
        var cta = $(tabs[i]).find("n-button-group").find("a.cta");
        var tabTitle = $(tabs[i]).attr("data-tab-title");

        if (typeof tabTitle !== "undefined") {
            $(tempObject).find("#tab-title-" + (i + 1)).html(tabTitle);

        }


        var eyeBrow = $(tabs[i]).find("n-eyebrow > a.eyebrow");

        if (typeof eyeBrow[0] !== "undefined" && eyeBrow[0].innerHTML != "") {
            var eyeBrowSection = "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Eyebrow CTA]</strong></p>" +
                "<p id = 'a" + (i + 1) + "-cta-eye' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>" +
                "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Eyebrow Link]</strong></p>" +
                "<p id = 'a" + (i + 1) + "-link-eye' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>";
            $(tempObject).find("#tab" + (i + 1) + "-content").before(eyeBrowSection);
            $(tempObject).find("#a" + (i + 1) + "-cta-eye").html(createLinkData(eyeBrow[0], "linkText"));
            $(tempObject).find("#a" + (i + 1) + "-link-eye").html(createLinkData(eyeBrow[0], "link"));

        }

        if (typeof headline[0] !== 'undefined') {
            $(tempObject).find("#a" + (i + 1) + "-h1").html(headline[0].innerHTML + "</br>");
        }

        if (typeof body[0] !== 'undefined') {
            $(tempObject).find("#a" + (i + 1) + "-body").html(body[0].innerHTML);
        }

        if (typeof cta[0] !== 'undefined') {
            $(tempObject).find("#a" + (i + 1) + "-cta1").html(createLinkData(cta[0], "linkText"));
            $(tempObject).find("#a" + (i + 1) + "-link1").html(createLinkData(cta[0], "link"));
        }

        if (typeof cta[1] !== 'undefined') {
            $(tempObject).find("#a" + (i + 1) + "-cta2").html(createLinkData(cta[1], "linkText"));
            $(tempObject).find("#a" + (i + 1) + "-link2").html(createLinkData(cta[1], "link"));
        }
        if (cta.length > 2) {
            for (var j = 2; j < cta.length; j++) {
                var addAnotherCtaSection = "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[CTA " + (j + 1) + "]</strong></p>" +
                    "<p id = 'a" + (i + 1) + "-cta" + (j + 1) + "' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>" +
                    "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Link " + (j + 1) + "]</strong></p>" +
                    "<p id = 'a" + (i + 1) + "-link" + (j + 1) + "' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>"
                $(tempObject).find("#tab" + (i + 1) + "-content").append(addAnotherCtaSection);
                $(tempObject).find("#a" + (i + 1) + "-cta" + (j + 1) + "").html(createLinkData(cta[j], "linkText"));
                $(tempObject).find("#a" + (i + 1) + "-link" + (j + 1) + "").html(createLinkData(cta[j], "link"));
            }

        }
    }




    return tempObject.innerHTML;
}

function buildTitle(currentComponent) {
    var tempObject = document.createElement("div");
    tempObject.innerHTML = getComponentHtml("n-title");
    $(tempObject).find("#heading-append").after(appendCmsInfo(getCommentInfoFrom(currentComponent.parentNode, "ComponentID"), toBrowserTime(getCommentInfoFrom(currentComponent.parentNode, "ComponentModified"))));
    var theme = $(currentComponent).attr('n-theme');
    var headline = $(currentComponent).find("h1");
    var images = $(currentComponent).find("n-secondary > img");

    var eyeBrow = $(currentComponent).find("n-eyebrow > a.eyebrow");

    if (typeof eyeBrow[0] !== "undefined" && eyeBrow[0].innerHTML != "") {
        var eyeBrowSection = "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Eyebrow CTA]</strong></p>" +
            "<p id = 'a1-cta-eye' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>" +
            "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Eyebrow Link]</strong></p>" +
            "<p id = 'a1-link-eye' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>";
        $(tempObject).find("#page-content").before(eyeBrowSection);
        $(tempObject).find("#a1-cta-eye").html(createLinkData(eyeBrow[0], "linkText"));
        $(tempObject).find("#a1-link-eye").html(createLinkData(eyeBrow[0], "link"));

    }

    if (typeof theme !== "undefined") {
        $(tempObject).find("#theme").html("Theme: " + theme);
    }

    if (typeof headline[0] !== "undefined") {
        $(tempObject).find("#a1-h1").html(headline[0].innerHTML);
    }
    if (typeof images[0] !== 'undefined') {
        $(tempObject).find("#a1-image-source").html((createImageHtml(images[0])));
        $(tempObject).find("#a1-image-alt-text").html(images[0].alt);
    }

    return tempObject.innerHTML;
}

function buildProseLeftAside(currentProseLeftAside) {
    var proseLeftAsideItems = $(currentProseLeftAside).find("n-prose-meta-side-bar, n-prose-table-of-contents, n-prose-aside");
    var proseHtml = "";

    for (var i = 0; i < proseLeftAsideItems.length; i++) {
        if (proseLeftAsideItems[i].localName == "n-prose-meta-side-bar") {
            proseHtml += buildProseMetaSideBar(proseLeftAsideItems[i]);
        }

        if (proseLeftAsideItems[i].localName == "n-prose-table-of-contents") {
            proseHtml += buildProseTableOfContents(proseLeftAsideItems[i]);
        }

        if (proseLeftAsideItems[i].localName == "n-prose-aside") {
            proseHtml += buildProseAside(proseLeftAsideItems[i]);
        }

    }

    return proseHtml;

}

function buildProseRightAside(currentProseRightAside) {
    var proseRightAsideComponents = $(currentProseRightAside).find("n-prose-event-sidebar");
    var proseRightHTML = "";

    for (var i = 0; i < proseRightAsideComponents.length; i++) {
        if (proseRightAsideComponents[i].localName == "n-prose-event-sidebar") {
            proseRightHTML += proseEventSideBar(proseRightAsideComponents[i]);
        }
    }
    return proseRightHTML;
}

//no longer used. Kept for reference
function buildProseMain(currentProseMain) {
    var proseMainItems = $(currentProseMain).find("n-prose-segment, n-prose-listicle, n-prose-inline-media, n-prose-author-bio, n-prose-event-card");
    var proseMainHTML = "";

    for (var i = 0; i < proseMainItems.length; i++) {
        console.log(proseMainItems[i]);
        if ((proseMainItems[i].localName == "n-prose-segment" && $(proseMainItems[i]).attr("data-ntap-analytics-region") == "ProseRegionArticle") || (proseMainItems[i].localName == "n-prose-segment" && proseMainItems[i].firstElementChild.localName == "n-xpm-eyebrow") ) {
            proseMainHTML += buildProseArticle(proseMainItems[i]);
        }
        if (proseMainItems[i].localName == "n-prose-listicle") {
            proseMainHTML += buildProseListicle(proseMainItems[i]);
        }

        if (proseMainItems[i].localName == "n-prose-table-of-contents") {

        }

        if (proseMainItems[i].localName == "n-prose-inline-media") {
            proseMainHTML += buildProseInlineMedia(proseMainItems[i]);
        }
        if (proseMainItems[i].localName == "n-prose-author-bio") {
            proseMainHTML += buildProseAuthorBio(proseMainItems[i]);
        }
        if (proseMainItems[i].localName == "n-prose-event-card") {
            proseMainHTML += proseEventCard(proseMainItems[i]);
        }


    }

    return proseMainHTML;
}

function buildProseListicle(currentComponent) {
    var tempObject = document.createElement("div");
    tempObject.innerHTML = getComponentHtml('n-prose-listicle');

    $(tempObject).find("#heading-append").after(appendCmsInfo(getCommentInfoFrom(currentComponent, "ComponentID"), toBrowserTime(getCommentInfoFrom(currentComponent, "ComponentModified"))));
    $(tempObject).find("#page-content").html("");

    var listicleSection = $(currentComponent).find("section");

    var listiclesToMake = listicleSection.length;


    //make at least 3 listicle sections plus one empty section.
    if (listicleSection.length < 3) {
        listiclesToMake = 4;
    } else {
        listiclesToMake = listicleSection.length + 1;
    }

    for (var i = 0; i < listiclesToMake; i++) {
        var index = 1 + i;
        var listicleSectionHTML =
            "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Number]&nbsp;</strong></p>" +
            "<p id = 'number-" + index + "'style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'>&nbsp;</p>" +
            "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Headline]</strong></p>" +
            "<p id = 'headline-" + index + "'style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'>&nbsp;</p>" +
            "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Body]</strong></p>" +
            "<p id ='body-" + index + "'style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'>&nbsp;</p>" +
            "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'>&nbsp;</p>";
        $(tempObject).find("#page-content").append(listicleSectionHTML);
    }

    for (var i = 0; i < listicleSection.length; i++) {
        var index = 1 + i;
        var number = $(listicleSection[i]).find("span");
        var headline = $(listicleSection[i]).find("h4");
        var body = $(listicleSection[i]).find("n-richtext");

        if (typeof number[0] !== "undefined") {
            $(tempObject).find("#number-" + index).html(number[0].innerHTML + "<br/>");
        }

        if (typeof headline[0] !== "undefined") {
            $(tempObject).find("#headline-" + index).html(headline[0].innerHTML + "<br/>");
        }

        if (typeof body[0] !== "undefined") {
            $(tempObject).find("#body-" + index).html(body[0].innerHTML);
        }
    }


    return tempObject.innerHTML;

}

function buildProseFullWidth(currentFullWidth) {
    var proseFullWidthContent = $(currentFullWidth).find("n-prose-illustration-full-width, n-prose-block-quote");
    var fullWidthHTml = "";

    for (var i = 0; i < proseFullWidthContent.length; i++) {
        if (proseFullWidthContent[i].localName == "n-prose-illustration-full-width") {
            fullWidthHTml += buildProseFullWidthIllustration(proseFullWidthContent[i]);
        }
        if (proseFullWidthContent[i].localName == "n-prose-block-quote") {
            fullWidthHTml += buildProseBlockQuote(proseFullWidthContent[i]);
        }

    }

    return fullWidthHTml;


}

function buildProseMetaSideBar(currentComponent) {
    var tempObject = document.createElement("div");
    tempObject.innerHTML = getComponentHtml("n-prose-meta-side-bar");
    $(tempObject).find("#heading-append").after(appendCmsInfo(getCommentInfoFrom(currentComponent.firstElementChild, "ComponentID"), toBrowserTime(getCommentInfoFrom(currentComponent.firstElementChild, "ComponentModified"))));

    var heading = $(currentComponent).find("n-content > div.meta-side-bar-logo-container > h4");
    var body = $(currentComponent).find("n-content > div.meta-side-bar-content-container");
    var image = $(currentComponent).find("n-content > div.meta-side-bar-logo-container > img");

    if (typeof heading[0] !== "undefined") {
        $(tempObject).find("#a1-h1").html(heading[0].innerHTML);
    }

    if (typeof body[0] !== "undefined") {
        //add review URL to each link
        $(body).find("a").each(function () {
            createLinkData(this, "link")
        });
        $(tempObject).find("#a1-body").html(body[0].innerHTML);
    }

    if (typeof image[0] !== 'undefined') {
        $(tempObject).find("#a1-image-source").html((createImageHtml(image[0])));
        $(tempObject).find("#a1-image-alt-text").html(image[0].alt);
    }

    return tempObject.innerHTML;
}

function buildProseTableOfContents(currentComponent) {
    var tempObject = document.createElement("div");
    tempObject.innerHTML = getComponentHtml("n-prose-table-of-contents");
    $(tempObject).find("#heading-append").after(appendCmsInfo(getCommentInfoFrom(currentComponent, "ComponentID"), toBrowserTime(getCommentInfoFrom(currentComponent, "ComponentModified"))));

    var heading = $(currentComponent).find("header");
    var rteBody = $(currentComponent).find("n-xpm-richtext");
    var cta = $(currentComponent).find("a.cta");
    var toc = $(currentComponent).find("nav");

    if (typeof heading[0] !== "undefined") {
        $(tempObject).find("#a1-h1").html(heading[0].innerHTML);
    }

    if (typeof rteBody[0] !== "undefined") {
        $(tempObject).find("#rte-body").html(rteBody[0].innerHTML);
    }


    if (typeof cta[0] !== 'undefined') {
        if (cta.length > 0) {
            $(tempObject).find("#use-cta").html("Yes");
        }
        $(tempObject).find("#a1-cta1").html(createLinkData(cta[0], "linkText"));
        $(tempObject).find("#a1-link1").html(createLinkData(cta[0], "link") + "</br>");
    } else {
        $(tempObject).find("#use-cta").html("No");
    }

    if (cta.length > 1) {
        for (var i = 1; i < cta.length; i++) {
            var addAnotherCtaSection = "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[CTA " + (i + 1) + "]</strong></p>" +
                "<p id = 'a1-cta" + (i + 1) + "' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>" +
                "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Link " + (i + 1) + "]</strong></p>" +
                "<p id = 'a1-link" + (i + 1) + "' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>"
            $(tempObject).find("#page-content").append(addAnotherCtaSection);
            $(tempObject).find("#a1-cta" + (i + 1) + "").html(createLinkData(cta[i], "linkText") + "</br>");
            $(tempObject).find("#a1-link" + (i + 1) + "").html(createLinkData(cta[i], "link") + "</br>");
        }

    }
    if (typeof toc[0] !== "undefined") {
        var subHeadCount = $(toc[0]).find("ul.dashed-list").length;

        //if we have sub headings, set the sub heading yes/no
        if (subHeadCount > 0) {
            $(tempObject).find("#use-secondary-heading").html("Yes");
        } else {
            $(tempObject).find("#use-secondary-heading").html("No");
        }

        $(toc).find("a").each(function () {
            createLinkData(this, "link")
        });
        $(tempObject).find("#nav-table").html(toc[0].innerHTML);
    }



    return tempObject.innerHTML;
}

function buildProseAside(currentComponent) {
    var tempObject = document.createElement("div");
    tempObject.innerHTML = getComponentHtml("n-prose-aside");
    $(tempObject).find("#heading-append").after(appendCmsInfo(getCommentInfoFrom(currentComponent.firstElementChild, "ComponentID"), toBrowserTime(getCommentInfoFrom(currentComponent.firstElementChild, "ComponentModified"))));

    var rtfContent = $(currentComponent).find("n-xpm-richtext");

    if (typeof rtfContent[0] !== "undefined") {
        $(tempObject).find("#rtf-body").html(rtfContent[0].innerHTML);
    }

    return tempObject.innerHTML;
}

function buildProseArticle(currentProseSegment) {
    var tempObject = document.createElement("div");
    tempObject.innerHTML = getComponentHtml("n-prose-segment");
    $(tempObject).find("#heading-append").after(appendCmsInfo(getCommentInfoFrom(currentProseSegment, "ComponentID"), toBrowserTime(getCommentInfoFrom(currentProseSegment, "ComponentModified"))));
    //remove current text in the Html Template
    $(tempObject).find("#page-content").html("");

    var getContentElements = $(currentProseSegment).children("n-xpm-eyebrow, h2, h3, n-xpm-richtext, n-button-group");
    getContentElements = getContentElements.add($(currentProseSegment).find("article > h2, article > h3, article > n-xpm-richtext, article > n-button-group"));
  

    var bodyCount = 0;
    var mainHeadingCount = 0;
    var secondaryHeadingCount = 0;

    for (var i = 0; i < getContentElements.length; i++) {
        var index = (i + 1);

        if (getContentElements[i].localName == "n-xpm-eyebrow") {
            if (typeof getContentElements[i] != "undefined" && getContentElements[i].innerHTML != "") {

                var eyeBrowSection = "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Eyebrow CTA]</strong></p>" +
                    "<p id = 'a" + index + "-cta-eye' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>" +
                    "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Eyebrow Link]</strong></p>" +
                    "<p id = 'a" + index + "-link-eye' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p><br/>";
                $(tempObject).find("#page-content").append(eyeBrowSection);
                var currentEyeBrow = $(getContentElements[i]).find("a.eyebrow");
                if (typeof currentEyeBrow[0] !== "undefined") {
                    if (currentEyeBrow[0].innerText != "") {
                        $(tempObject).find("#a" + index + "-cta-eye").html(createLinkData(currentEyeBrow[0], "linkText") + "<br/>");
                        $(tempObject).find("#a" + index + "-link-eye").html(createLinkData(currentEyeBrow[0], "link") + "<br/>");
                    }
                }


            }
        }
        if (getContentElements[i].localName == "h2") {
            mainHeadingCount++;
            var mainHeadingSection = "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Main Heading]</strong></p>" +
                "<p id = 'a" + index + "-main-heading' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p><br/>";
            $(tempObject).find("#page-content").append(mainHeadingSection);
            $(tempObject).find("#a" + index + "-main-heading").html(getContentElements[i].innerHTML + "<br/>");
        }
        if (getContentElements[i].localName == "h3") {
            secondaryHeadingCount++;
            var mainHeadingSection = "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Secondary Heading]</strong></p>" +
                "<p id = 'a" + index + "-secondary-heading' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p><br/>";
            $(tempObject).find("#page-content").append(mainHeadingSection);
            $(tempObject).find("#a" + index + "-secondary-heading").html(getContentElements[i].innerHTML + "<br/>");
        }
        if (getContentElements[i].localName == "n-xpm-richtext") {
            bodyCount++;
            getContentElements[i] = formatInLineTable(getContentElements[i]);
            var bodySection = "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Body " + bodyCount + "]</strong></p>" +
                "<p id = 'a" + index + "-body" + bodyCount + "' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p><br/>";
            $(tempObject).find("#page-content").append(bodySection);
            $(tempObject).find("#a" + index + "-body" + bodyCount).html(getContentElements[i].innerHTML + "<br/>");
        }

        if (getContentElements[i].localName == "n-button-group") {
            var cta = $(getContentElements[i]).find("a.cta");
            if (cta.length > 1) {
                for (var j = 0; j < cta.length; j++) {
                    var addAnotherCtaSection = "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[CTA " + (j + 1) + "]</strong></p>" +
                        "<p id = 'a" + index + "-cta" + (j + 1) + "' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>" +
                        "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Link " + (j + 1) + "]</strong></p>" +
                        "<p id = 'a" + index + "-link" + (j + 1) + "' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>"
                    $(tempObject).find("#page-content").append(addAnotherCtaSection);
                    $(tempObject).find("#a" + index + "-cta" + (j + 1) + "").html(createLinkData(cta[j], "linkText"));
                    $(tempObject).find("#a" + index + "-link" + (j + 1) + "").html(createLinkData(cta[j], "link"));
                }

            }

        }




    }


    return tempObject.innerHTML;

}

function buildProseFullWidthIllustration(currentComponent) {
    var tempObject = document.createElement("div");
    tempObject.innerHTML = getComponentHtml('n-prose-illustration-full-width');

    $(tempObject).find("#heading-append").after(appendCmsInfo(getCommentInfoFrom(currentComponent, "ComponentID"), toBrowserTime(getCommentInfoFrom(currentComponent, "ComponentModified"))));

    var cta = $(currentComponent).find("a.cta");
    var image = $(currentComponent).find("img");
    var caption = $(currentComponent).find("figcaption");

    if (typeof image[0] !== "undefined") {
        $(tempObject).find("#a1-image-source").html((createImageHtml(image[0])));
        $(tempObject).find("#a1-image-alt-text").html(image[0].alt + "<br/>");
    }

    if (typeof caption[0] !== "undefined") {
        $(tempObject).find("#a1-caption").html(caption[0].innerHTML + "<br/>");
    }
    if (typeof cta[0] !== "undefined") {
        $(tempObject).find("#a1-video").html(createLinkData(cta[0], "link") + "<br/>");
    }


    return tempObject.innerHTML;

}

function buildProseBlockQuote(currentComponent) {
    var tempObject = document.createElement("div");
    tempObject.innerHTML = getComponentHtml('n-prose-block-quote');

    $(tempObject).find("#heading-append").after(appendCmsInfo(getCommentInfoFrom(currentComponent, "ComponentID"), toBrowserTime(getCommentInfoFrom(currentComponent, "ComponentModified"))));

    var body = $(currentComponent).find("n-content > blockquote > h2");
    var attribution = $(currentComponent).find("n-content > blockquote > p");
    var cta = $(currentComponent).find("n-button-group").find("a.cta");
    var theme = $(currentComponent).attr("n-theme");
    console.log(theme);

    if (typeof theme != "") {
        $(tempObject).find("#a1-theme").html(theme + "<br/>");
    }

    var eyeBrow = $(currentComponent).find("n-eyebrow > a.eyebrow");

    if (typeof eyeBrow[0] !== "undefined" && eyeBrow[0].innerHTML != "") {
        var eyeBrowSection = "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Eyebrow CTA]</strong></p>" +
            "<p id = 'a1-cta-eye' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>" +
            "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Eyebrow Link]</strong></p>" +
            "<p id = 'a1-link-eye' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>";
        $(tempObject).find("#page-content").before(eyeBrowSection);
        $(tempObject).find("#a1-cta-eye").html(createLinkData(eyeBrow[0], "linkText"));
        $(tempObject).find("#a1-link-eye").html(createLinkData(eyeBrow[0], "link"));

    }

    if (typeof attribution[0] !== 'undefined') {
        $(tempObject).find("#a1-attribution").html(attribution[0].innerHTML);
    }

    if (typeof body[0] !== 'undefined') {
        $(tempObject).find("#a1-body").html(body[0].innerHTML);
    }

    if (typeof cta[0] !== 'undefined') {
        $(tempObject).find("#a1-cta1").html(createLinkData(cta[0], "linkText"));
        $(tempObject).find("#a1-link1").html(createLinkData(cta[0], "link"));
    }

    if (typeof cta[1] !== 'undefined') {
        $(tempObject).find("#a1-cta2").html(createLinkData(cta[1], "linkText"));
        $(tempObject).find("#a1-link2").html(createLinkData(cta[1], "link"));
    }
    if (cta.length > 2) {
        for (var i = 2; i < cta.length; i++) {
            var addAnotherCtaSection = "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[CTA " + (i + 1) + "]</strong></p>" +
                "<p id = 'a1-cta" + (i + 1) + "' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>" +
                "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Link " + (i + 1) + "]</strong></p>" +
                "<p id = 'a1-link" + (i + 1) + "' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>"
            $(tempObject).find("#page-content").append(addAnotherCtaSection);
            $(tempObject).find("#a1-cta" + (i + 1) + "").html(createLinkData(cta[i], "linkText"));
            $(tempObject).find("#a1-link" + (i + 1) + "").html(createLinkData(cta[i], "link"));
        }

    }


    return tempObject.innerHTML;


}

function buildProseInlineMedia(currentComponent) {
    var tempObject = document.createElement("div");
    tempObject.innerHTML = getComponentHtml('n-prose-inline-media');

    $(tempObject).find("#heading-append").after(appendCmsInfo(getCommentInfoFrom(currentComponent, "ComponentID"), toBrowserTime(getCommentInfoFrom(currentComponent, "ComponentModified"))));

    var cta = $(currentComponent).find("a.cta");
    var iframeMedia = $(currentComponent).find("iframe");
    var image = $(currentComponent).find("img");
    var caption = $(currentComponent).find("figcaption");

    if (typeof image[0] !== "undefined") {
        $(tempObject).find("#a1-image-source").html((createImageHtml(image[0])));
        $(tempObject).find("#a1-image-alt-text").html(image[0].alt + "<br/>");
    }

    if (typeof caption[0] !== "undefined") {
        $(tempObject).find("#a1-caption").html(caption[0].innerHTML + "<br/>");
    }
    if (typeof cta[0] !== "undefined") {
        $(tempObject).find("#a1-media").html(createLinkData(cta[0], "link") + "<br/>");
    }

    if (typeof iframeMedia[0] !== "undefined") {
        $(tempObject).find("#a1-media").html(createIframeLink(iframeMedia[0]) + "<br/>");
    }


    return tempObject.innerHTML;
}

function buildProseAuthorBio(currentComponent) {
    var tempObject = document.createElement("div");
    tempObject.innerHTML = getComponentHtml('n-prose-author-bio');

    $(tempObject).find("#heading-append").after(appendCmsInfo(getCommentInfoFrom(currentComponent, "ComponentID"), toBrowserTime(getCommentInfoFrom(currentComponent, "ComponentModified"))));

    var name = $(currentComponent).find("h4");
    var body = $(currentComponent).find("n-xpm-richtext");
    var cta = $(currentComponent).find("n-button-group").find("a.cta");
    var twitterLink = $(currentComponent).find("a[title='Twitter']");
    var linkedInLink = $(currentComponent).find("a[title='LinkedIn']");
    var images = $(currentComponent).find("img");

    if (typeof images[0] !== 'undefined') {
        $(tempObject).find("#a1-image-source").html((createImageHtml(images[0])));
        $(tempObject).find("#a1-image-alt-text").html(images[0].alt);
    }

    if (typeof twitterLink[0] !== "undefined") {
        $(tempObject).find("#a1-twitter").html(createLinkData(twitterLink[0], "link") + "<br/>");
    }
    if (typeof linkedInLink[0] !== "undefined") {
        $(tempObject).find("#a1-linkedin").html(createLinkData(linkedInLink[0], "link") + "<br/>");
    }

    if (typeof name[0] !== "undefined") {
        $(tempObject).find("#a1-author-name").html(name[0].innerHTML + "<br/>");
    }



    if (typeof body[0] !== 'undefined') {
        $(tempObject).find("#a1-body").html(body[0].innerHTML);
    }

    if (typeof cta[0] !== 'undefined') {
        $(tempObject).find("#a1-cta1").html(createLinkData(cta[0], "linkText"));
        $(tempObject).find("#a1-link1").html(createLinkData(cta[0], "link"));
    }

    if (cta.length > 1) {
        for (var i = 1; i < cta.length; i++) {
            var addAnotherCtaSection = "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[CTA " + (i + 1) + "]</strong></p>" +
                "<p id = 'a1-cta" + (i + 1) + "' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>" +
                "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Link " + (i + 1) + "]</strong></p>" +
                "<p id = 'a1-link" + (i + 1) + "' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>"
            $(tempObject).find("#page-content").append(addAnotherCtaSection);
            $(tempObject).find("#a1-cta" + (i + 1) + "").html(createLinkData(cta[i], "linkText"));
            $(tempObject).find("#a1-link" + (i + 1) + "").html(createLinkData(cta[i], "link"));
        }

    }


    return tempObject.innerHTML;
}

function proseEventSideBar(currentComponent) {
    var tempObject = document.createElement("div");
    tempObject.innerHTML = getComponentHtml('n-prose-event-sidebar');

    $(tempObject).find("#heading-append").after(appendCmsInfo(getCommentInfoFrom(currentComponent, "ComponentID"), toBrowserTime(getCommentInfoFrom(currentComponent, "ComponentModified"))));
    var headline = $(currentComponent).find(" div.prose-event-sidebar-title-container > h3");
    var subHead = $(currentComponent).find("div.prose-event-sidebar-event-type-container");
    var cta = $(currentComponent).find("n-button-group").find("a.cta");


    if (typeof headline[0] !== 'undefined') {
        $(tempObject).find("#a1-h1").html(headline[0].innerHTML + "</br>");
    }

    if (typeof subHead[0] !== 'undefined') {
        $(tempObject).find("#a1-h2").html(subHead[0].innerHTML + "</br>");
    }

    if (typeof cta[0] !== 'undefined') {
        $(tempObject).find("#a1-cta1").html(createLinkData(cta[0], "linkText"));
        $(tempObject).find("#a1-link1").html(createLinkData(cta[0], "link") + "</br>");
    }

    if (cta.length > 1) {
        for (var i = 1; i < cta.length; i++) {
            var addAnotherCtaSection = "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[CTA " + (i + 1) + "]</strong></p>" +
                "<p id = 'a1-cta" + (i + 1) + "' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>" +
                "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Link " + (i + 1) + "]</strong></p>" +
                "<p id = 'a1-link" + (i + 1) + "' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>"
            $(tempObject).find("#page-content").append(addAnotherCtaSection);
            $(tempObject).find("#a1-cta" + (i + 1) + "").html(createLinkData(cta[i], "linkText") + "</br>");
            $(tempObject).find("#a1-link" + (i + 1) + "").html(createLinkData(cta[i], "link") + "</br>");
        }

    }


    return tempObject.innerHTML;
}

function proseEventCard(currentComponent) {
    var tempObject = document.createElement("div");
    tempObject.innerHTML = getComponentHtml('n-prose-event-card');
    $(tempObject).find("#heading-append").after(appendCmsInfo(getCommentInfoFrom(currentComponent, "ComponentID"), toBrowserTime(getCommentInfoFrom(currentComponent, "ComponentModified"))));
    var headline = $(currentComponent).find("div.prose-event-card-title-container > h3");
    var subHead = $(currentComponent).find("div.prose-event-card-event-type-container");
    var body = $(currentComponent).find("div.prose-event-card-description-container");

    var cta = $(currentComponent).find("n-button-group").find("a.cta");
    var images = $(currentComponent).find("n-secondary > img");


    if (typeof headline[0] !== 'undefined') {
        $(tempObject).find("#a1-h1").html(headline[0].innerHTML + "</br>");
    }

    if (typeof subHead[0] !== 'undefined') {
        $(tempObject).find("#a1-h2").html(subHead[0].innerHTML + "</br>");
    }

    if (typeof body[0] !== 'undefined') {
        $(tempObject).find("#a1-body").html(body[0].innerHTML + "</br>");
    }

    if (typeof cta[0] !== 'undefined') {
        $(tempObject).find("#a1-cta1").html(createLinkData(cta[0], "linkText"));
        $(tempObject).find("#a1-link1").html(createLinkData(cta[0], "link") + "</br>");
    }

    if (cta.length > 1) {
        for (var i = 1; i < cta.length; i++) {
            var addAnotherCtaSection = "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[CTA " + (i + 1) + "]</strong></p>" +
                "<p id = 'a1-cta" + (i + 1) + "' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>" +
                "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Link " + (i + 1) + "]</strong></p>" +
                "<p id = 'a1-link" + (i + 1) + "' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>"
            $(tempObject).find("#page-content").append(addAnotherCtaSection);
            $(tempObject).find("#a1-cta" + (i + 1) + "").html(createLinkData(cta[i], "linkText") + "</br>");
            $(tempObject).find("#a1-link" + (i + 1) + "").html(createLinkData(cta[i], "link") + "</br>");
        }

    }

    if (typeof images[0] !== 'undefined') {
        $(tempObject).find("#a1-image-source").html((createImageHtml(images[0])));
        $(tempObject).find("#a1-image-alt-text").html(images[0].alt);
    }

    return tempObject.innerHTML;
}

function proseRegionTwo(currentComponent) {
    var tempObject = document.createElement("div");
    tempObject.innerHTML = getComponentHtml('n-prose-region-two');
    $(tempObject).find("#heading-append").after(appendCmsInfo(getCommentInfoFrom(currentComponent, "ComponentID"), toBrowserTime(getCommentInfoFrom(currentComponent, "ComponentModified"))));
    var headline = $(currentComponent).find("div.prose-region-two-title-container > h3");
    var subHead = $(currentComponent).find("div.prose-region-two-event-type-container");
    var body = $(currentComponent).find("div.prose-region-two-description-container");
    var cta = $(currentComponent).find("n-button-group").find("a.cta");
    var images = $(currentComponent).find("n-secondary > img");

    if (typeof headline[0] !== 'undefined') {
        $(tempObject).find("#a1-h1").html(headline[0].innerHTML + "</br>");
    }

    if (typeof subHead[0] !== 'undefined') {
        $(tempObject).find("#a1-h2").html(subHead[0].innerHTML + "</br>");
    }

    if (typeof body[0] !== 'undefined') {
        $(tempObject).find("#a1-body").html(body[0].innerHTML + "</br>");
    }

    if (typeof cta[0] !== 'undefined') {
        $(tempObject).find("#a1-cta1").html(createLinkData(cta[0], "linkText"));
        $(tempObject).find("#a1-link1").html(createLinkData(cta[0], "link") + "</br>");
    }


}