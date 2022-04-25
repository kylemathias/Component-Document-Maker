console.log("this is popup.js");
var query = {
    active: true,
    currentWindow: true
};
var reviewDomain = "https://ntapwwwprodstage-web9.azurewebsites.net";
//this runs the function on popup open
chrome.tabs.query(query, callback);
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
    ['Product Comparison Table', 'Product_Comparison_Table.html', 'n-product-comparison-table', ''],
    ['Prose Block Quote', 'Prose_Block_Quote.html', ' ', ''],
    ['Prose Customer Metadata', 'Prose_Customer_Metadata.html', 'n-prose-meta-side-bar', ''],
    ['Prose Full-Width Illustration', 'Prose_Full-Width_Illustration.html', 'n-prose-illustration-full-width', ''],
    ['Prose II', 'Prose_II.html', 'prose-region-article', ''],
    ['Prose Inline Media Player', 'Prose_Inline_Media_Player.html', 'n-prose-inline-media', ''],
    ['Prose Listicle', 'Prose_Listicle.html', 'n-prose-listicle', ''],
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
    ['Webprod_Info', 'Page_Component.html', 'web-prod-info', ''],
    ['', 'Page_Component.html', 'n-prose-left-aside', ''],
    ['', 'Page_Component.html', 'n-prose-right-aside', ''],
    ['', 'Page_Component.html', 'n-prose-main', ''],
]

var listOfTcmIDs = [
    //Level Number, Local TCM#, Global TCM#
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
//it then proceeds to call the function related to what url is currently open
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
                        if (currentTab.url.startsWith("https://ntapwwwprodstage-web9.azurewebsites.net/quickwires.html")) {
                            findComponentsInURL(currentTab);
                        } else {
                            if (currentTab.url.startsWith("https://ntapwwwprodstage-web9.azurewebsites.net/")) {
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

    if (currentTab.url.startsWith("https://ntapwwwprodstage-web9.azurewebsites.net/") != true && currentTab.url.startsWith("https://www.netapp.com/") != true) {
        stopLoader();

        setMessage("To Get Started", "To use this extension, please navigate to NetApp.com's " + reviewUrl.outerHTML + " or to create a new page use this extension on our mock up tool " + quickWire.outerHTML + " <sup>™</sup>", "&nbsp;");

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
            setMessage("We are on the Live Site", "You are on the live site of netapp.com. If you would like to get a Word document version of this page, you can do so at this " + pageLink.outerHTML + " or to create a new page use this extension on our mock up tool " + quickWire.outerHTML + " <sup>™</sup>", "&nbsp;");
        }
        var components = currentTab.url.split("#"); //get the string after "#" in the URL    
        if (currentTab.url.startsWith("https://ntapwwwprodstage-web9.azurewebsites.net/quickwires.html")) {
            setMessage("We are on the Quickwires<sup>™</sup> page", "Your document is being generated and will be available to download shortly.", "Generating Document...");
            addComponentsHtmlToArray(currentTab);
        } else {
            if (currentTab.url.startsWith("https://ntapwwwprodstage-web9.azurewebsites.net/")) {
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
        }else {
            setMessage("We Are on the Quickwires<sup>™</sup> page", selectCompontMessage, "</br>");
            stopLoader();
        }
    } else {
        setMessage("We Are on the Quickwires<sup>™</sup> page", selectCompontMessage, "</br>");
        stopLoader();
    }

}

function buildQuickWiresHtml(components) {

    wordDocHtml = wordDocHtml + getComponentHtml("seo-url-breadcrumb");

    //add each component html to the word document
    for (var i = 0; i < components.length; i++) {
        for (var j = 0; j < listOfComponents.length; j++) {
            if (components[i] == listOfComponents[j][2])
                wordDocHtml = wordDocHtml + listOfComponents[j][3];
        }

    }

    //add download function
    document.getElementById("download-btn").addEventListener("click", function () {
        download("quickwires-" + getCurentTimeStamp() + ".doc", wordDocHtml);

    });

    //enable the button
    const button = document.getElementById("download-btn");
    button.disabled = false;

    //set success message
    setMessage(null, null, "Document Ready!");
    stopLoader();
}



function generateReviewHtml(pageHtml, currentTab) {
    var htmlObject = document.createElement('html');
    htmlObject.innerHTML = pageHtml;

    var documentName = generateDocumentName(htmlObject);

    //add seo to the document
    //wordDocHtml += 'data:application/vnd.ms-word;charset=utf-8,';
    //wordDocHtml += "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
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
    var title = htmlObject.getElementsByTagName("title")[0].innerHTML;
    var pageTitle = title.split("|");
    documentName = pageTitle[0].trim();
    var zone = new Date().toLocaleTimeString('en-us', {
        timeZoneName: 'short'
    }).split(' ')[2]
    return documentName;

}

function populateSEOhtml(htmlObject, currentTab) {
    //create a temporary object to hold the html
    var seoObject = document.createElement('div');
    seoObject.innerHTML = getComponentHtml("seo-url-breadcrumb");
    var pageSEO = $(htmlObject).find("body > n-seo-region > div");
    //console.log(pageSEO);
    $(seoObject).find("#heading-append").after(appendCmsInfo(getCommentInfoFrom(pageSEO, "ComponentID"), toBrowserTime(getCommentInfoFrom(pageSEO, "ComponentModified"))));


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

    //set link in SEO html
    $(seoObject).find("#live-url").html(liveLink);
    $(seoObject).find("#review-url").html(reviewLink);

    return seoObject.innerHTML;
}

function buildWebProdHtml(htmlObject, currentTab) {
    var webProdObject = document.createElement('div');
    webProdObject.innerHTML = getComponentHtml("web-prod-info");
    var pageSEO = $(htmlObject).find("body");

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

    $(webProdObject).find("#heading-append").after(appendCmsInfo(getCommentInfoFrom(pageSEO, "PageID"), toBrowserTime(getCommentInfoFrom(pageSEO, "PageModified"))));
    $(webProdObject).find("#page-url").html(liveLink);
    $(webProdObject).find("#stage-url").html(reviewLink);

    var metaTags = $(htmlObject).find("meta[property='article:tag'], meta[name='AssetType'], meta[name='AssetSubtype'], meta[name='AssetDescriptor'], meta[name='TargetAudience'], meta[name='BuyerStage'], meta[name='JobTitlesFunctions'], meta[name='Campaign'], meta[name='ProgramTopic'], meta[name='Event'], meta[name='EventDescriptor'], meta[name='SessionType'], meta[name='Department'], meta[name='Product'], meta[name='Services'], meta[name='Geo'], meta[name='GeoRegion'], meta[name='CountryRegion'], meta[name='Hyperscaler'], meta[name='Industry']");

    for (var i = 0; i < metaTags.length; i++) {
        var metaTag = metaTags[i];
        var metaTagName = metaTag.getAttribute("name");
        var metaProperty = metaTag.getAttribute("property");
        var metaTagValue = metaTag.getAttribute("content");
        $(webProdObject).find("#tag-" + metaTagName).html(metaTagValue);
        if (metaProperty == "article:tag") {
            $(webProdObject).find("#tag-Custom").html(metaTagValue);
        }
    }

    return webProdObject.innerHTML;
}

function getComponentHtml(componentName) {
    for (var i = 0; i < listOfComponents.length; i++) {
        if (listOfComponents[i][2] == componentName) {
            return listOfComponents[i][3];
        }
    }
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


    if (returnType == "link") {
        return linkHref;
    } else if (returnType == "linkText") {
        return linkText;
    }
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
            //quote band components are in quote band tabs. We need to make sure the current quote band is not in the quote band tabs.
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
            //pageComponentHtml += buildProseRightAside(pageComponents[i]);
        }
        if (pageComponents[i].localName == "n-prose-main") {
            pageComponentHtml += buildProseMain(pageComponents[i]);
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


function getCommentInfoFrom(htmlObject, nameOfId) {
    var tcmId = "";
    var comments = getComments(htmlObject);
    //console.log('tcm id comments: ');
    //console.log(comments);
    //loop through the comments
    for (var i = 0; i < comments.length; i++) {
        var breakThisLoop = false;
        var currentComment = comments[i].data;
        currentComment = currentComment.substring(currentComment.indexOf("{"));
        //console.log('current index of {: ');
        //console.log(currentComment.indexOf('{'));
        if (currentComment.indexOf('{') != 0) {
            continue;
        }
        //console.log("currentComment: ");
        //console.log(currentComment);
        const currentCommentObject = JSON.parse(currentComment, function (key, value) {
            if (key == nameOfId) {
                tcmId = value;
                breakThisLoop = true;
            }
            return value;
        });
        //console.log(currentCommentObject);



        if (breakThisLoop == true) {
            break;
        }
    }

    return tcmId;

}

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


function buildAccordionBandHtml(currentComponent) {
    var tempObject = document.createElement('div');
    tempObject.innerHTML = getComponentHtml("n-accordion-band");

    //add cms info to the word dock html
    $(tempObject).find("#heading-append").after(appendCmsInfo(getCommentInfoFrom(currentComponent.parentNode, "ComponentID"), toBrowserTime(getCommentInfoFrom(currentComponent.parentNode, "ComponentModified"))));

    var naccordions = $(currentComponent).find("div.n-accordions");

    for (var i = 0; i < naccordions.length; i++) {
        //get the content we need
        var headline = $(naccordions[i]).find("span.n-accordion-title");
        var subhead = $(naccordions[i]).find("span.n-accordion-subheader");
        var body = $(naccordions[i]).find("n-xpm-richtext");
        var cta = $(naccordions[i]).find("a.cta");

        //if we find more than 3 accordions, we need to add a new section to the html document
        if (i > 2) {
            var accordionSection = "<tr>" +
                "<td style='width: 467.2pt; border: solid black 1.0pt; border-top: none; background: #E7E6E6; padding: 0in 0in 0in 0in;' valign='top'>\n" +
                "<p style='margin: 0in; text-align: center; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em><span style='color: black;'>Accordion " + (i + 1) + "</span></em></p>\n" +
                "</td>" +
                "</tr>" +
                "<tr style='height: 54.6pt;'>" +
                "<td style='width: 467.2pt; border: solid black 1.0pt; border-top: none; padding: 0in 0in 0in 0in;' valign='top'>" +
                "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Headline]&nbsp;</strong></p>" +
                "<p id = 'a" + (i + 1) + "-h1'style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>&nbsp;</strong></p>" +
                "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Sub-head]&nbsp;</strong></p>" +
                "<p id = 'a" + (i + 1) + "-sh1'style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>&nbsp;</strong></p>" +
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

        }

        if (typeof headline[0] !== 'undefined') {
            $(tempObject).find("#a" + (i + 1) + "-h1").html(headline[0].innerHTML);
        }

        if (typeof subhead[0] !== 'undefined') {
            $(tempObject).find("#a" + (i + 1) + "-sh1").html(subhead[0].innerHTML);
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
            $(tempObject).find("#a" + (i + 1) + "-cta1").html(createLinkData(cta[1], "linkText"));
            $(tempObject).find("#a" + (i + 1) + "-link1").html(createLinkData(cta[1], "link"));
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
            $(tempObject).find("#a" + (i + 1) + "-link1").html(createLinkData(primaryCta[0], "link"));
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
            "<tr style='height: 34.45pt;'>" +
            "<td id='page-section-" + (i + 1) + "' style='width: 151.45pt; border: solid windowtext 1.0pt; border-top: none; padding: 0in 0in 0in 0in;' valign='top'>" +
            "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Tab title]&nbsp;</strong></p>" +
            "<p id = 'a" + (i + 1) + "-tt'style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>&nbsp;</strong></p>" +
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
        var images = $(tabs[i]).find("n-xpm-image > img");
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
            $(tempObject).find("#a" + (i + 1) + "-tt").html(tabTitle);
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

function buildProseTableOfContents(currentComponent) {
    var tempObject = document.createElement("div");
    tempObject.innerHTML = getComponentHtml("n-prose-table-of-contents");
    $(tempObject).find("#heading-append").after(appendCmsInfo(getCommentInfoFrom(currentComponent.parentNode, "ComponentID"), toBrowserTime(getCommentInfoFrom(currentComponent.parentNode, "ComponentModified"))));

    return tempObject.innerHTML;
}

function buildProseAside(currentComponent) {
    var tempObject = document.createElement("div");
    tempObject.innerHTML = getComponentHtml("n-prose-aside");
    $(tempObject).find("#heading-append").after(appendCmsInfo(getCommentInfoFrom(currentComponent.parentNode, "ComponentID"), toBrowserTime(getCommentInfoFrom(currentComponent.parentNode, "ComponentModified"))));

    return tempObject.innerHTML;
}

function buildProseEventSideBar(currentComponent) {
    var tempObject = document.createElement("div");
    tempObject.innerHTML = getComponentHtml("n-prose-event-sidebar");
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

    var headline = $(currentComponent).find(" n-primary > n-content > blockquote > h2");
    var body = $(currentComponent).find(" n-primary > n-content > blockquote > p");
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
    $(tempObject).find("#heading-append").after(appendCmsInfo(getCommentInfoFrom(currentComponent.parentNode, "ComponentID"), toBrowserTime(getCommentInfoFrom(currentComponent.parentNode, "ComponentModified"))));

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

        if (proseLeftAsideItems[i].localName == "n-prose-table-of-contents") {}

        if (proseLeftAsideItems[i].localName == "n-prose-aside") {

        }

    }

    return proseHtml;

}

function buildProseMain(currentProseMain) {
    var proseMainItems = $(currentProseMain).find("n-prose-segment");
    var proseMainHTML = "";

    for (var i = 0; i < proseMainItems.length; i++) {
        if (proseMainItems[i].localName == "n-prose-segment" && $(proseMainItems[i]).attr("data-ntap-analytics-region") == "ProseRegionArticle") {
            proseMainHTML += buildProseArticle(proseMainItems[i]);
        }

        if (proseMainItems[i].localName == "n-prose-table-of-contents") {}

        if (proseMainItems[i].localName == "n-prose-aside") {

        }

    }

    return proseMainHTML;
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

function buildProseArticle(currentProseSegment) {
    var tempObject = document.createElement("div");
    tempObject.innerHTML = getComponentHtml("prose-region-article");
    $(tempObject).find("#heading-append").after(appendCmsInfo(getCommentInfoFrom(currentProseSegment, "ComponentID"), toBrowserTime(getCommentInfoFrom(currentProseSegment, "ComponentModified"))));
    $(tempObject).find("#page-content").html("");

    var getContentElements = $(currentProseSegment).children("a.eyebrow, h2, n-xpm-rich-text");

    for (var i = 0; i < getContentElements.length; i++) {
        var index = (i + 1);
        if (getContentElements[i].localName == "a" && getContentElements[i].className == "eyebrow") {
            if (typeof getContentElements[i] !== "undefined" && getContentElements[i].innerHTML != "") {
                var eyeBrowSection = "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Eyebrow CTA]</strong></p>" +
                    "<p id = 'a" + index + "-cta-eye' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>" +
                    "<p style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><strong>[Eyebrow Link]</strong></p>" +
                    "<p id = 'a" + index + "-link-eye' style='margin: 0in; line-height: normal; font-size: 11pt; font-family: Calibri, sans-serif;'><em>&nbsp;</em></p>";
                $(tempObject).find("#page-content").append(eyeBrowSection);
                $(tempObject).find("#a" + index + "-cta-eye").html(createLinkData(getContentElements[i], "linkText"));
                $(tempObject).find("#a" + index + "-link-eye").html(createLinkData(getContentElements[i], "link"));

            }
        }
        if (getContentElements[i].localName == "h2") {
            //$(tempObject).find("#page-content").append(buildHeadline(getContentElements[i]));
        }
        if (getContentElements[i].localName == "n-xpm-rich-text") {

        }



    }


    return tempObject.innerHTML;

}