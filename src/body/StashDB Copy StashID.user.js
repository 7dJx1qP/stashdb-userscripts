(function() {
    'use strict';

    const {
        stashdb,
        StashDB,
        waitForElementId,
        waitForElementClass,
        waitForElementByXpath,
        getElementByXpath,
        sortElementChildren,
        createElementFromHTML,
    } = unsafeWindow.stashdb;

    function createTooltipElement() {
        const copyTooltip = document.createElement('span');
        copyTooltip.setAttribute('id', 'copy-tooltip');
        copyTooltip.innerText = 'Copied!';
        copyTooltip.classList.add('fade', 'hide');
        copyTooltip.style.position = "absolute";
        copyTooltip.style.left = '0px';
        copyTooltip.style.top = '0px';
        copyTooltip.style.marginLeft = '40px';
        copyTooltip.style.padding = '5px 12px';
        copyTooltip.style.backgroundColor = '#000000df';
        copyTooltip.style.borderRadius = '4px';
        copyTooltip.style.color = '#fff';
        document.body.appendChild(copyTooltip);
        return copyTooltip;
    }

    function createCopyButton() {
        const copyBtn = document.createElement('button');
        copyBtn.setAttribute('id', 'copy-stashid');
        copyBtn.title = 'Copy to clipboard';
        copyBtn.innerHTML = `<svg class="svg-inline--fa" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path fill="#FFFFFF" d="M384 96L384 0h-112c-26.51 0-48 21.49-48 48v288c0 26.51 21.49 48 48 48H464c26.51 0 48-21.49 48-48V128h-95.1C398.4 128 384 113.6 384 96zM416 0v96h96L416 0zM192 352V128h-144c-26.51 0-48 21.49-48 48v288c0 26.51 21.49 48 48 48h192c26.51 0 48-21.49 48-48L288 416h-32C220.7 416 192 387.3 192 352z"/></svg><span class="ms-1">Copy StashID</span>`;
        copyBtn.classList.add('btn', 'btn-secondary', 'btn-sm', 'minimal', 'ml-1');
        copyBtn.addEventListener('click', evt => {
            GM_setClipboard(window.location.pathname.split('/').pop());
            const copyTooltip = createTooltipElement();
            const rect = document.body.getBoundingClientRect();
            const rect2 = evt.currentTarget.getBoundingClientRect();
            const x = rect2.left - rect.left;
            const y = rect2.top - rect.top;
            copyTooltip.classList.add('show');
            copyTooltip.style.left = `${x}px`;
            copyTooltip.style.top = `${y}px`;
            setTimeout(() => {
                copyTooltip.remove();
            }, 500);
        });
        return copyBtn;
    }

    stashdb.addEventListener('page', evt => {
        const { stashType, stashId, action } = evt.detail;

        waitForElementByXpath("//div[contains(@class, 'navbar-nav')]", (xpath, el) => {
            if ((stashType === 'scenes' && stashId && !action) ||
                (stashType === 'performers' && stashId && !action) ||
                (stashType === 'studios' && stashId && !action)) {
                if (!document.getElementById('copy-stashid')) {
                    el.appendChild(createCopyButton());
                }
                else {
                    document.getElementById('copy-stashid').style.display = 'inline-block';
                }
            }
            else if (document.getElementById('copy-stashid')) {
                document.getElementById('copy-stashid').style.display = 'none';
            }
        });


    });




})();