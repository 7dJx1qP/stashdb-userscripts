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
        insertAfter,
        getClosestAncestor,
    } = unsafeWindow.stashdb;

    function updateVisibility(dropdown) {
        for (const sceneCard of document.querySelectorAll('.SceneCard')) {
            sceneCard.parentElement.classList.remove('d-none');
        }
        if (dropdown.value === 'OWNED') {
            for (const node of document.querySelectorAll('.match-no')) {
                const sceneCard = getClosestAncestor(node, '.SceneCard');
                sceneCard.parentElement.classList.add('d-none');
            }
        }
        else if (dropdown.value === 'MISSING') {
            for (const node of document.querySelectorAll('.match-yes')) {
                const sceneCard = getClosestAncestor(node, '.SceneCard');
                sceneCard.parentElement.classList.add('d-none');
            }
        }
    }

    stashdb.addEventListener('page', evt => {
        const { stashType, stashId, action } = evt.detail;

        waitForElementByXpath("//div[contains(@class, 'navbar-nav')]", (xpath, el) => {
            if ((stashType === 'scenes' && !stashId && !action) ||
                (stashType === 'performers' && stashId && !action) ||
                (stashType === 'studios' && stashId && !action)) {
                waitForElementClass('scene-sort', (className, el) => {
                    if (!document.querySelector('.visible-filter')) {
                        const dropdownContainer = createElementFromHTML(`<div class="visible-filter w-auto">
                        <select class="w-auto form-select">
                            <option value="ALL" selected="">Show All</option>
                            <option value="OWNED">Show Owned</option>
                            <option value="MISSING">Show Missing</option>
                        </select>
                    </div>`);
                        insertAfter(dropdownContainer, el[0].parentElement);

                        const dropdown = document.querySelector('.visible-filter select');
                        dropdown.addEventListener('change', evt => {
                            updateVisibility(dropdown);
                        })
                    }
                });
            }
        });


    });

    stashdb.addEventListener('scenecard', evt => {
        const { sceneEl } = evt.detail;
        const dropdown = document.querySelector('.visible-filter select');
        sceneEl.parentElement.classList.remove('d-none');
        if (dropdown.value === 'OWNED' && sceneEl.querySelector('.match-no')) {
            sceneEl.parentElement.classList.add('d-none');
        }
        else if (dropdown.value === 'MISSING' && sceneEl.querySelector('.match-yes')) {
            sceneEl.parentElement.classList.add('d-none');
        }
    });




})();