// StashDB Userscript Library
// Exports utility functions and a StashDB class that emits events whenenever a page navigation change is detected
// version 0.1.0

(function () {
    'use strict';

    const css = GM_getResourceText("IMPORTED_CSS");
    GM_addStyle(css);

    const STASH_IMAGE = 'data:image/png;base64,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';

    const stashdb = function () {

        const { fetch: originalFetch } = window;
        const stashdbListener = new EventTarget();

        unsafeWindow.fetch = async (...args) => {
            let [resource, config ] = args;
            // request interceptor here
            const response = await originalFetch(resource, config);
            // response interceptor here
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                const data = await response.clone().json();
                stashdbListener.dispatchEvent(new CustomEvent('response', { 'detail': data }));
            }
            return response;
        };

        class Logger {
            constructor(enabled) {
                this.enabled = enabled;
            }
            debug() {
                if (!this.enabled) return;
                console.debug(...arguments);
            }
        }

        function waitForElementId(elementId, callBack, time) {
            time = (typeof time !== 'undefined') ? time : 100;
            window.setTimeout(() => {
                const element = document.getElementById(elementId);
                if (element) {
                    callBack(elementId, element);
                } else {
                    waitForElementId(elementId, callBack);
                }
            }, time);
        }

        function waitForElementClass(elementId, callBack, time) {
            time = (typeof time !== 'undefined') ? time : 100;
            window.setTimeout(() => {
                const element = document.getElementsByClassName(elementId);
                if (element.length > 0) {
                    callBack(elementId, element);
                } else {
                    waitForElementClass(elementId, callBack);
                }
            }, time);
        }

        function waitForElementByXpath(xpath, callBack, time) {
            time = (typeof time !== 'undefined') ? time : 100;
            window.setTimeout(() => {
                const element = getElementByXpath(xpath);
                if (element) {
                    callBack(xpath, element);
                } else {
                    waitForElementByXpath(xpath, callBack);
                }
            }, time);
        }

        function getElementByXpath(xpath, contextNode) {
            return document.evaluate(xpath, contextNode || document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        }

        function getElementsByXpath(xpath, contextNode) {
            return document.evaluate(xpath, contextNode || document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
        }

        function getClosestAncestor(el, selector, stopSelector) {
            let retval = null;
            while (el) {
                if (el.matches(selector)) {
                    retval = el;
                    break
                } else if (stopSelector && el.matches(stopSelector)) {
                    break
                }
                el = el.parentElement;
            }
            return retval;
        }

        function insertAfter(newNode, existingNode) {
            existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
        }

        function createElementFromHTML(htmlString) {
            const div = document.createElement('div');
            div.innerHTML = htmlString.trim();

            // Change this to div.childNodes to support multiple top-level nodes.
            return div.firstChild;
        }


        function setNativeValue(element, value) {
            const valueSetter = Object.getOwnPropertyDescriptor(element, 'value').set;
            const prototype = Object.getPrototypeOf(element);
            const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;

            if (valueSetter && valueSetter !== prototypeValueSetter) {
                prototypeValueSetter.call(element, value);
            } else {
                valueSetter.call(element, value);
            }
        }

        function updateTextInput(element, value) {
            setNativeValue(element, value);
            element.dispatchEvent(new Event('input', { bubbles: true }));
        }

        function concatRegexp(reg, exp) {
            let flags = reg.flags + exp.flags;
            flags = Array.from(new Set(flags.split(''))).join();
            return new RegExp(reg.source + exp.source, flags);
        }

        function sortElementChildren(node) {
            const items = node.childNodes;
            const itemsArr = [];
            for (const i in items) {
                if (items[i].nodeType == Node.ELEMENT_NODE) { // get rid of the whitespace text nodes
                    itemsArr.push(items[i]);
                }
            }

            itemsArr.sort((a, b) => {
                return a.innerHTML == b.innerHTML
                    ? 0
                    : (a.innerHTML > b.innerHTML ? 1 : -1);
            });

            for (let i = 0; i < itemsArr.length; i++) {
                node.appendChild(itemsArr[i]);
            }
        }

        function xPathResultToArray(result) {
            let node = null;
            const nodes = [];
            while (node = result.iterateNext()) {
                nodes.push(node);
            }
            return nodes;
        }

        const reloadImg = url =>
            fetch(url, { cache: 'reload', mode: 'no-cors' })
            .then(() => document.body.querySelectorAll(`img[src='${url}']`)
            .forEach(img => img.src = url));

        function isInViewport(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }

        const checkLabel = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" class="svg-inline--fa fa-check fa-w-16 fa-icon fa-fw" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path></svg>';
        const timesLabel = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" class="svg-inline--fa fa-times fa-w-11 fa-icon fa-fw" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512"><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg>';
        const clearLabel = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="ban" class="svg-inline--fa fa-ban fa-w-16 fa-icon fa-fw" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M367.2 412.5L99.5 144.8C77.1 176.1 64 214.5 64 256c0 106 86 192 192 192c41.5 0 79.9-13.1 111.2-35.5zm45.3-45.3C434.9 335.9 448 297.5 448 256c0-106-86-192-192-192c-41.5 0-79.9 13.1-111.2 35.5L412.5 367.2zM512 256c0 141.4-114.6 256-256 256S0 397.4 0 256S114.6 0 256 0S512 114.6 512 256z"/></svg>';
        const starLabel = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="star" class="svg-inline--fa fa-star fa-w-16 fa-icon fa-fw" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>';

        class StashDB extends EventTarget {
            constructor({ pageUrlCheckInterval = 50, logging = false } = {}) {
                super();
                this.stashUrl = 'http://localhost:9999';
                this.loggedIn = false;
                this.userName = null;
                this.log = new Logger(logging);
                this._pageUrlCheckInterval = pageUrlCheckInterval;
                this.fireOnHashChangesToo = true;
                this.pageURLCheckTimer = setInterval(() => {
                    // Loop every 500ms
                    if (this.lastPathStr !== location.pathname || this.lastQueryStr !== location.search || (this.fireOnHashChangesToo && this.lastHashStr !== location.hash)) {
                        this.lastPathStr = location.pathname;
                        this.lastQueryStr = location.search;
                        this.lastHashStr = location.hash;
                        this.gmMain();
                    }
                }, this._pageUrlCheckInterval);
                stashdbListener.addEventListener('response', (evt) => {
                    //this.processScenes(evt.detail);
                    //this.processPerformers(evt.detail);
                    this.dispatchEvent(new CustomEvent('stashdb:response', { 'detail': evt.detail }));
                });
            }
            async callGQL(reqData) {
                const options = {
                    method: 'POST',
                    body: JSON.stringify(reqData),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
                if (this.stashApiKey) {
                    options.headers.ApiKey = this.stashApiKey;
                }

                return new Promise((resolve, reject) => {
                    GM.xmlHttpRequest({
                        method: "POST",
                        url: this.stashUrl + '/graphql',
                        data: JSON.stringify(reqData),
                        headers: {
                            "Content-Type": "application/json"
                        },
                        onload: response => {
                            resolve(JSON.parse(response.response));
                        },
                        onerror: reject
                    });
                });
            }
            async findSceneByStashId(id) {
                const reqData = {
                    "variables": { id },
                    "query": `query FindSceneByStashId($id: String!) {
                        findScenes(scene_filter: {stash_id: {value: $id, modifier: EQUALS}}) {
                            scenes {
                                title
                                stash_ids {
                                    endpoint
                                    stash_id
                                }
                                id
                            }
                        }
                    }`
                }
                return this.callGQL(reqData);
            }
            /*async processScenes(data) {
                if (data?.data?.queryScenes?.scenes) {
                    return Promise.all(data?.data?.queryScenes?.scenes.map(scene => this.processListScene(scene.id)));
                }
            }*/
            async processListScene(stashId, sceneEl) {
                const data = await this.findSceneByStashId(stashId);
                const localId = data?.data?.findScenes?.scenes[0]?.id;
                waitForElementByXpath(`//div[@class='card-footer']//a[contains(@href,'${stashId}')]`, async (xpath, el) => {
                    await this.addSceneMarker(stashId, localId, el.parentElement, sceneEl);
                });
            }
            async processPageScene(stashId) {
                const data = await this.findSceneByStashId(stashId);
                const localId = data?.data?.findScenes?.scenes[0]?.id;
                waitForElementByXpath(`//div[contains(@class,'scene-info')]/div[@class='card-header']/div[@class='float-end']`, async (xpath, el) => {
                    await this.addSceneMarker(stashId, localId, el, getClosestAncestor(el, '.scene-info'));
                });
            }
            async processSearchScene(stashId, sceneEl) {
                const data = await this.findSceneByStashId(stashId);
                const localId = data?.data?.findScenes?.scenes[0]?.id;
                waitForElementByXpath(`//a[contains(@href,'${stashId}')]//h5`, async (xpath, el) => {
                    el.classList.add('d-flex');
                    const markerEl = await this.addSceneMarker(stashId, localId, el, sceneEl);
                    markerEl.classList.add('ms-auto');
                });
            }
            async addSceneMarker(stashId, localId, parentElement, sceneEl) {
                let markerEl = parentElement.querySelector('.stash_id_match');
                if (!markerEl) {
                    let label = localId ? checkLabel : timesLabel;

                    const sceneState = JSON.parse(await GM.getValue(stashId, '{"ignored":false,"wanted":false}'));
                    if (sceneState.ignored) {
                        sceneEl.classList.add('stash_id_ignored');
                        label = clearLabel;
                    }
                    else if (sceneState.wanted) {
                        sceneEl.classList.add('stash_id_wanted');
                        label = starLabel;
                    }

                    markerEl = createElementFromHTML(`<div class="stash_id_match scene_match"><a>${label}</a></div>`);
                    markerEl.classList.add(localId ? 'match-yes' : 'match-no');

                    let dropdownEl;
                    markerEl.addEventListener('mouseenter', evt => {
                        dropdownEl = createElementFromHTML(`<div class="menu" style="height: 55px; width: 40px; background: transparent; position: fixed; z-index: 1;"></div>`);
                        markerEl.appendChild(dropdownEl);

                        const rect = document.body.getBoundingClientRect();
                        const rect2 = evt.currentTarget.getBoundingClientRect();
                        const x = rect2.left;// - rect.left;
                        const y = rect2.top;// - rect.top;
                        dropdownEl.style.left = `${x}px`;
                        dropdownEl.style.top = `${y}px`;

                        dropdownEl.addEventListener("click", evt => {
                            evt.preventDefault();
                            evt.stopImmediatePropagation();
                        });

                        const menuEl = createElementFromHTML(`<div class="dropdown-menu" style="display: flex; flex-direction: column; background: white; position: absolute; top: 5px; left: 25px; padding: 8px; border-radius: 4px; width: 180px; font-size: 14px; font-weight: normal"></div>`);
                        dropdownEl.appendChild(menuEl);

                        if (localId) {
                            const localLink = this.stashUrl + '/scenes/' + localId;
                            const gotoSceneEl = createElementFromHTML(`<a class="dropdown-item" style="color: black; padding: 5px; text-decoration: none">Go to Scene</a>`);
                            gotoSceneEl.addEventListener("click", evt => {
                                evt.preventDefault();
                                evt.stopImmediatePropagation();
                                window.open(
                                    localLink,
                                    '_blank'
                                );
                            });
                            menuEl.appendChild(gotoSceneEl);
                        }
                        else {
                            const ignoreEl = createElementFromHTML(`<a class="dropdown-item" style="color: black; padding: 5px; text-decoration: none"></a>`);
                            const wishlistEl = createElementFromHTML(`<a class="dropdown-item" style="color: black; padding: 5px; text-decoration: none">></a>`);

                            if (sceneState.ignored) {
                                ignoreEl.innerText = 'Clear Ignore';

                                ignoreEl.addEventListener("click", async evt => {
                                    evt.preventDefault();
                                    evt.stopImmediatePropagation();
                                    sceneState.ignored = false;
                                    sceneEl.classList.remove('stash_id_ignored');
                                    markerEl.querySelector('a').innerHTML = timesLabel;
                                    GM.setValue(stashId, JSON.stringify(sceneState));
                                    menuEl.remove();
                                });
                    
                                  menuEl.append(ignoreEl);
                            }
                            else if (sceneState.wanted) {
                                wishlistEl.innerText = 'Remove From Wishlist';
                    
                                wishlistEl.addEventListener("click", async evt => {
                                    evt.preventDefault();
                                    evt.stopImmediatePropagation();
                                    sceneState.wanted = false;
                                    sceneEl.classList.remove('stash_id_wanted');
                                    markerEl.querySelector('a').innerHTML = timesLabel;
                                    GM.setValue(stashId, JSON.stringify(sceneState));
                                    menuEl.remove();
                                });
                    
                                  menuEl.append(wishlistEl);
                            }
                            else {
                                wishlistEl.innerText = 'Add to Wishlist';
                                ignoreEl.innerText = 'Ignore Scene';
                    
                                wishlistEl.addEventListener("click", async evt => {
                                    evt.preventDefault();
                                    evt.stopImmediatePropagation();
                                    sceneState.wanted = true;
                                    sceneEl.classList.add('stash_id_wanted');
                                    markerEl.querySelector('a').innerHTML = starLabel;
                                    GM.setValue(stashId, JSON.stringify(sceneState));
                                    menuEl.remove();
                                });

                                ignoreEl.addEventListener("click", async evt => {
                                    evt.preventDefault();
                                    evt.stopImmediatePropagation();
                                    sceneState.ignored = true;
                                    sceneEl.classList.add('stash_id_ignored');
                                    markerEl.querySelector('a').innerHTML = clearLabel;
                                    GM.setValue(stashId, JSON.stringify(sceneState));
                                    menuEl.remove();
                                });

                                menuEl.append(wishlistEl);
                                menuEl.append(ignoreEl);
                            }
                        }

                        if(!isInViewport(menuEl)) {
                            dropdownEl.style.left = `${x-150}px`;
                            dropdownEl.style.top = `${y-80}px`;
                        }

                    });
                    markerEl.addEventListener('mouseleave', () => {
                        dropdownEl.remove();
                    });
                    parentElement.appendChild(markerEl);
                }
                return markerEl;
            }
            async createStashPerformerLink(stashId, callback) {
                const reqData = {
                    "variables": {
                        "performer_filter": {
                            "stash_id": {
                                "value": stashId,
                                "modifier": "EQUALS"
                            }
                        }
                    },
                    "query": `query FindPerformers($filter: FindFilterType, $performer_filter: PerformerFilterType) {
                        findPerformers(filter: $filter, performer_filter: $performer_filter) {
                            count
                            performers {
                                id
                            }
                        }
                    }`
                }
                const results = await this.callGQL(reqData);
                if (results.data.findPerformers.count === 0) return;
                const performerId = results.data.findPerformers.performers[0].id;
                const performerUrl = `${this.stashUrl}/performers/${performerId}`;
                const performerLink = document.createElement('a');
                performerLink.classList.add('stash-performer-link');
                performerLink.href = performerUrl;
                const stashIcon = document.createElement('img');
                stashIcon.src = STASH_IMAGE;
                performerLink.appendChild(stashIcon);
                performerLink.setAttribute('target', '_blank');
                callback(performerLink);
            }
            addStashPerformerLinks() {
                if (!document.querySelector('.stash-performer-link')) {
                    for (const searchPerformer of document.querySelectorAll('div.PerformerCard a')) {
                        const url = new URL(searchPerformer.href);
                        const stashId = url.pathname.replace('/performers/', '');
                        const searchPerformerHeader = searchPerformer.querySelector('div.card-footer > h5');
                        this.createStashPerformerLink(stashId, function (performerLink) {
                            searchPerformerHeader.appendChild(performerLink);
                            performerLink.addEventListener('click', function (event) {
                                event.preventDefault();
                                window.open(performerLink.href, '_blank');
                            });
                        });
                    }
                }
            }
            addStashPerformerLink() {
                if (!document.querySelector('.stash-performer-link')) {
                    const header = document.querySelector('.card-header h3');
                    const stashId = window.location.pathname.replace('/performers/', '');
                    this.createStashPerformerLink(stashId, function (performerLink) {
                        header.appendChild(performerLink);
                    });
                }
            }
            addStashScenePerformerLink() {
                if (!document.querySelector('.stash-performer-link')) {
                    const header = document.querySelector('.scene-performers');
                    for (const scenePerformer of document.querySelectorAll('a.scene-performer')) {
                        const url = new URL(scenePerformer.href);
                        const stashId = url.pathname.replace('/performers/', '');
                        this.createStashPerformerLink(stashId, function (performerLink) {
                        header.insertBefore(performerLink, scenePerformer);
                        });
                    }
                }
            }
            addStashSearchPerformerLink() {
                if (!document.querySelector('.stash-performer-link')) {
                    for (const searchPerformer of document.querySelectorAll('a.SearchPage-performer')) {
                        const url = new URL(searchPerformer.href);
                        const stashId = url.pathname.replace('/performers/', '');
                        const searchPerformerHeader = searchPerformer.querySelector('div.card > div.ms-3 > h4 > span');
                        this.createStashPerformerLink(stashId, function (performerLink) {
                            searchPerformerHeader.parentElement.insertBefore(performerLink, searchPerformerHeader);
                            performerLink.addEventListener('click', function (event) {
                                event.preventDefault();
                                window.open(performerLink.href, '_blank');
                            });
                        });
                    }
                }
            }
            matchUrl(location, fragment) {
                const regexp = concatRegexp(new RegExp(location.origin), fragment);
                this.log.debug(regexp, location.href.match(regexp));
                return location.href.match(regexp) != null;
            }
            gmMain() {
                const location = window.location;
                this.log.debug(URL, window.location);

                waitForElementByXpath('//button[contains(@class, "login-button")]|//span[text()="Logged in as"]/following-sibling::a', async (xpath, el) => {
                    this.loggedIn = el.tagName === 'A';
                    this.userName = this.loggedIn ? el.innerText : null;

                    if (this.loggedIn && !document.querySelector('.settings-box')) {
                        const gearIcon = `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="gear" class="svg-inline--fa fa-gear fa-w-16 fa-icon fa-fw" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336c44.2 0 80-35.8 80-80s-35.8-80-80-80s-80 35.8-80 80s35.8 80 80 80z"/></svg>`;
                        const settingsEl = createElementFromHTML(`<a class="nav-link">${gearIcon}</a>`);
                        el.parentElement.appendChild(settingsEl);
                        const settingsMenuEl = createElementFromHTML(`<div class="box settings-box bg-dark" style="display: none;">
                            <div class="field">
                                <label class="label">Stash Address</label>
                                <div class="control">
                                    <input id="address" class="input" type="text" placeholder="Stash Address (http://localhost:9999)" value="">
                                </div>
                            </div>
                      
                            <div class="field">
                                <label class="label">Local Stash API Key <sub>(Not StashDB API)</sub></label>
                                <div class="control">
                                    <input id="apiKey" class="input" type="text" placeholder="Stash API Key if using Authentication" value="">
                                </div>
                            </div>
                        </div>`);
                        settingsEl.appendChild(settingsMenuEl);

                        settingsEl.addEventListener('click', evt => {
                            if (settingsMenuEl.style.display === 'none') {
                                settingsMenuEl.style.display = 'block';
                            }
                            else {
                                settingsMenuEl.style.display = 'none';
                            }
                        });

                        settingsMenuEl.addEventListener('click', evt => {
                            evt.stopPropagation();
                        });

                        this.stashUrl = await GM.getValue('stashAddress', 'http://localhost:9999');
                        const stashAddress = document.getElementById('address');
                        stashAddress.value = this.stashUrl;
                        stashAddress.addEventListener('change', async () => {
                            await GM.setValue('stashAddress', stashAddress.value || 'http://localhost:9999');
                        });

                        this.stashApiKey = await GM.getValue('stashApiKey', '');
                        const stashApiKey = document.getElementById('apiKey');
                        stashApiKey.value = this.stashApiKey;
                        stashApiKey.addEventListener('change', async () => {
                            await GM.setValue('stashApiKey', stashApiKey.value || '');
                        });
                    }

                    const [_, stashType, stashId, action] = location.pathname.split('/');
                    if (location.pathname === '/' ||
                        (stashType === 'scenes' && !stashId) ||
                        (stashType === 'performers' && stashId && !action) ||
                        (stashType === 'studios' && stashId && !action) ||
                        (stashType === 'tags' && stashId && !action)) {
                        waitForElementByXpath('(//div[contains(@class, "HomePage-scenes")]/div[@class="col"]|//div[@class="scenes-list"]/div[@class="row"]/div[@class="col-3"])/div[contains(@class, "SceneCard")]', (xpath, el) => {
                            const sceneCards = document.querySelectorAll('.row .SceneCard');
                            for (const sceneCard of sceneCards) {
                                const stashId = getElementByXpath("./div[@class='card-footer']//a/@href", sceneCard).value.replace('/scenes/', '');
                                this.processListScene(stashId, sceneCard);
                            }
                        });
                    }
                    else if (stashType === 'scenes' && stashId && !action) {
                        this.processPageScene(stashId);
                    }
                    else if (stashType === 'search' && stashId && !action) {
                        waitForElementByXpath('//div[@class="SearchPage"]/div[@class="row"]/div[@class="col-6"]/h3[text()="Scenes"]', (xpath, el) => {
                            const sceneCards = document.querySelectorAll('.SearchPage-scene');
                            for (const sceneCard of sceneCards) {
                                const stashId = sceneCard.href.split('/').pop();
                                this.processSearchScene(stashId, sceneCard);
                            }
                        });
                    }

                    if (stashType === 'performers' && !stashId) {
                        waitForElementClass('PerformerCard', (className, el) => {
                            this.addStashPerformerLinks();
                        });
                    }
                    if (stashType === 'performers' && stashId && !action) {
                        waitForElementClass('PerformerInfo', (className, el) => {
                            this.addStashPerformerLink();
                        });
                    }
                    else if (stashType === 'scenes' && stashId && !action) {
                        waitForElementClass('scene-performers', (className, el) => {
                            this.addStashScenePerformerLink();
                        });
                    }
                    else if (stashType === 'search' && stashId && !action) {
                        waitForElementClass('SearchPage-performer', (className, el) => {
                            this.addStashSearchPerformerLink();
                        });
                    }

                    if (location.pathname === '/') {
                        this.log.debug('[Navigation] Home Page');
                    }
                    this.dispatchEvent(new CustomEvent('page', { 'detail': { stashType, stashId, action } }));
                });
            }
        }
        
        return {
            stashdb: new StashDB({ logging: false }),
            StashDB,
            waitForElementId,
            waitForElementClass,
            waitForElementByXpath,
            getElementByXpath,
            getElementsByXpath,
            getClosestAncestor,
            insertAfter,
            createElementFromHTML,
            setNativeValue,
            updateTextInput,
            sortElementChildren,
            xPathResultToArray,
            reloadImg,
            Logger,
        };
    };

    if (!unsafeWindow.stashdb) {
        unsafeWindow.stashdb = stashdb();
    }
})();