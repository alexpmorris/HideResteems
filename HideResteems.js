// ==UserScript==
// @name         Hide ReSteems
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  Button to Toggle ReSTEEMs from a User's steemit.com or golos.io Profile and Feed Pages
// @author       @alexpmorris
// @match        https://steemit.com/*
// @match        https://golos.io/*
// @grant        none
// @require https://code.jquery.com/jquery-1.12.4.min.js
// @require https://greasyfork.org/scripts/6250-waitforkeyelements/code/waitForKeyElements.js?version=23756
// ==/UserScript==

(function() {
    'use strict';

    var isHiding = false;

    waitForKeyElements ("#posts_list", addReSteemToggleBtn);

    function addReSteemToggleBtn(userDiv) {

        var validUrl = document.URL;
        if (validUrl.startsWith("https://s")) validUrl = validUrl.replace("https://steemit.com/",""); else
            validUrl = validUrl.replace("https://golos.io/","");

        //language support for buttons
        var lang = localStorage.getItem("language");
        if ((lang == null) || (localStorage.getItem("language") == "en")) {
            var showResteemsBtnSrc = "https://steemitimages.com/DQmaRcPxCKNV45aPVaWMbBkP7WvJatgkKqtih7ZCfVsLs4r/button_show-resteems.png";
            var hideResteemsBtnSrc = "https://steemitimages.com/DQmQYXHkLv4A3h8pZ1ntQM1FTTT6knt5EaVUo7hdj2nNAcR/button_hide-resteems.png";
        } else {
            var showResteemsBtnSrc = "https://steemitimages.com/DQmQeP7KVWpKvm3eNepS8HuwHri6BAJaa8XLYvsyXUWP8E6/button_show-resteems_ru.png";
            var hideResteemsBtnSrc = "https://steemitimages.com/DQmVds1u5g4W1jRnLNtYDEK8Bnt8WaiA3ueg81HMY3fssav/button_hide-resteems_ru.png";
        }

        if ((userDiv !== null) && (validUrl.startsWith("@")) && ((validUrl.indexOf("/")==-1) || (validUrl.endsWith("/feed"))) ) {

            isHiding = false;
            var zNode       = document.createElement ('div');
            zNode.innerHTML = '<button id="rsButton" type="button"><img id="rsBtnImg" src="'+hideResteemsBtnSrc+'"></button>';
            zNode.setAttribute ('id', 'rsContainer');
            zNode.setAttribute ('style', 'width:120px; margin-bottom:5px;');
            userDiv.prepend(zNode);

            //activate new button
            document.getElementById ("rsButton").addEventListener (
                "click", ButtonClickAction, false);

            function ButtonClickAction (zEvent) {
                if (!isHiding) {
                    $("#rsBtnImg").attr('src', showResteemsBtnSrc);
                    if (validUrl.endsWith("/feed")) $(".PostSummary__reblogged_by").parent('').hide(); else
                        $(".PostSummary__reblogged_by").filter(function () {return ($(".UserNames",this)[0] == null);}).parent('').hide();
                } else {
                    $("#rsBtnImg").attr('src', hideResteemsBtnSrc);
                    $(".PostSummary__reblogged_by").parent('').show();
                }
                isHiding = !isHiding;

            }

        }
    }

})();
