/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@hotwired/stimulus-webpack-helpers/dist/stimulus-webpack-helpers.js":
/*!******************************************************************************************!*\
  !*** ./node_modules/@hotwired/stimulus-webpack-helpers/dist/stimulus-webpack-helpers.js ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "definitionForModuleAndIdentifier": () => (/* binding */ definitionForModuleAndIdentifier),
/* harmony export */   "definitionForModuleWithContextAndKey": () => (/* binding */ definitionForModuleWithContextAndKey),
/* harmony export */   "definitionsFromContext": () => (/* binding */ definitionsFromContext),
/* harmony export */   "identifierForContextKey": () => (/* binding */ identifierForContextKey)
/* harmony export */ });
/*
Stimulus Webpack Helpers 1.0.0
Copyright © 2021 Basecamp, LLC
 */
function definitionsFromContext(context) {
    return context.keys()
        .map((key) => definitionForModuleWithContextAndKey(context, key))
        .filter((value) => value);
}
function definitionForModuleWithContextAndKey(context, key) {
    const identifier = identifierForContextKey(key);
    if (identifier) {
        return definitionForModuleAndIdentifier(context(key), identifier);
    }
}
function definitionForModuleAndIdentifier(module, identifier) {
    const controllerConstructor = module.default;
    if (typeof controllerConstructor == "function") {
        return { identifier, controllerConstructor };
    }
}
function identifierForContextKey(key) {
    const logicalName = (key.match(/^(?:\.\/)?(.+)(?:[_-]controller\..+?)$/) || [])[1];
    if (logicalName) {
        return logicalName.replace(/_/g, "-").replace(/\//g, "--");
    }
}




/***/ }),

/***/ "./node_modules/@hotwired/stimulus/dist/stimulus.js":
/*!**********************************************************!*\
  !*** ./node_modules/@hotwired/stimulus/dist/stimulus.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Application": () => (/* binding */ Application),
/* harmony export */   "AttributeObserver": () => (/* binding */ AttributeObserver),
/* harmony export */   "Context": () => (/* binding */ Context),
/* harmony export */   "Controller": () => (/* binding */ Controller),
/* harmony export */   "ElementObserver": () => (/* binding */ ElementObserver),
/* harmony export */   "IndexedMultimap": () => (/* binding */ IndexedMultimap),
/* harmony export */   "Multimap": () => (/* binding */ Multimap),
/* harmony export */   "StringMapObserver": () => (/* binding */ StringMapObserver),
/* harmony export */   "TokenListObserver": () => (/* binding */ TokenListObserver),
/* harmony export */   "ValueListObserver": () => (/* binding */ ValueListObserver),
/* harmony export */   "add": () => (/* binding */ add),
/* harmony export */   "defaultSchema": () => (/* binding */ defaultSchema),
/* harmony export */   "del": () => (/* binding */ del),
/* harmony export */   "fetch": () => (/* binding */ fetch),
/* harmony export */   "prune": () => (/* binding */ prune)
/* harmony export */ });
/*
Stimulus 3.0.1
Copyright © 2021 Basecamp, LLC
 */
class EventListener {
    constructor(eventTarget, eventName, eventOptions) {
        this.eventTarget = eventTarget;
        this.eventName = eventName;
        this.eventOptions = eventOptions;
        this.unorderedBindings = new Set();
    }
    connect() {
        this.eventTarget.addEventListener(this.eventName, this, this.eventOptions);
    }
    disconnect() {
        this.eventTarget.removeEventListener(this.eventName, this, this.eventOptions);
    }
    bindingConnected(binding) {
        this.unorderedBindings.add(binding);
    }
    bindingDisconnected(binding) {
        this.unorderedBindings.delete(binding);
    }
    handleEvent(event) {
        const extendedEvent = extendEvent(event);
        for (const binding of this.bindings) {
            if (extendedEvent.immediatePropagationStopped) {
                break;
            }
            else {
                binding.handleEvent(extendedEvent);
            }
        }
    }
    get bindings() {
        return Array.from(this.unorderedBindings).sort((left, right) => {
            const leftIndex = left.index, rightIndex = right.index;
            return leftIndex < rightIndex ? -1 : leftIndex > rightIndex ? 1 : 0;
        });
    }
}
function extendEvent(event) {
    if ("immediatePropagationStopped" in event) {
        return event;
    }
    else {
        const { stopImmediatePropagation } = event;
        return Object.assign(event, {
            immediatePropagationStopped: false,
            stopImmediatePropagation() {
                this.immediatePropagationStopped = true;
                stopImmediatePropagation.call(this);
            }
        });
    }
}

class Dispatcher {
    constructor(application) {
        this.application = application;
        this.eventListenerMaps = new Map;
        this.started = false;
    }
    start() {
        if (!this.started) {
            this.started = true;
            this.eventListeners.forEach(eventListener => eventListener.connect());
        }
    }
    stop() {
        if (this.started) {
            this.started = false;
            this.eventListeners.forEach(eventListener => eventListener.disconnect());
        }
    }
    get eventListeners() {
        return Array.from(this.eventListenerMaps.values())
            .reduce((listeners, map) => listeners.concat(Array.from(map.values())), []);
    }
    bindingConnected(binding) {
        this.fetchEventListenerForBinding(binding).bindingConnected(binding);
    }
    bindingDisconnected(binding) {
        this.fetchEventListenerForBinding(binding).bindingDisconnected(binding);
    }
    handleError(error, message, detail = {}) {
        this.application.handleError(error, `Error ${message}`, detail);
    }
    fetchEventListenerForBinding(binding) {
        const { eventTarget, eventName, eventOptions } = binding;
        return this.fetchEventListener(eventTarget, eventName, eventOptions);
    }
    fetchEventListener(eventTarget, eventName, eventOptions) {
        const eventListenerMap = this.fetchEventListenerMapForEventTarget(eventTarget);
        const cacheKey = this.cacheKey(eventName, eventOptions);
        let eventListener = eventListenerMap.get(cacheKey);
        if (!eventListener) {
            eventListener = this.createEventListener(eventTarget, eventName, eventOptions);
            eventListenerMap.set(cacheKey, eventListener);
        }
        return eventListener;
    }
    createEventListener(eventTarget, eventName, eventOptions) {
        const eventListener = new EventListener(eventTarget, eventName, eventOptions);
        if (this.started) {
            eventListener.connect();
        }
        return eventListener;
    }
    fetchEventListenerMapForEventTarget(eventTarget) {
        let eventListenerMap = this.eventListenerMaps.get(eventTarget);
        if (!eventListenerMap) {
            eventListenerMap = new Map;
            this.eventListenerMaps.set(eventTarget, eventListenerMap);
        }
        return eventListenerMap;
    }
    cacheKey(eventName, eventOptions) {
        const parts = [eventName];
        Object.keys(eventOptions).sort().forEach(key => {
            parts.push(`${eventOptions[key] ? "" : "!"}${key}`);
        });
        return parts.join(":");
    }
}

const descriptorPattern = /^((.+?)(@(window|document))?->)?(.+?)(#([^:]+?))(:(.+))?$/;
function parseActionDescriptorString(descriptorString) {
    const source = descriptorString.trim();
    const matches = source.match(descriptorPattern) || [];
    return {
        eventTarget: parseEventTarget(matches[4]),
        eventName: matches[2],
        eventOptions: matches[9] ? parseEventOptions(matches[9]) : {},
        identifier: matches[5],
        methodName: matches[7]
    };
}
function parseEventTarget(eventTargetName) {
    if (eventTargetName == "window") {
        return window;
    }
    else if (eventTargetName == "document") {
        return document;
    }
}
function parseEventOptions(eventOptions) {
    return eventOptions.split(":").reduce((options, token) => Object.assign(options, { [token.replace(/^!/, "")]: !/^!/.test(token) }), {});
}
function stringifyEventTarget(eventTarget) {
    if (eventTarget == window) {
        return "window";
    }
    else if (eventTarget == document) {
        return "document";
    }
}

function camelize(value) {
    return value.replace(/(?:[_-])([a-z0-9])/g, (_, char) => char.toUpperCase());
}
function capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}
function dasherize(value) {
    return value.replace(/([A-Z])/g, (_, char) => `-${char.toLowerCase()}`);
}
function tokenize(value) {
    return value.match(/[^\s]+/g) || [];
}

class Action {
    constructor(element, index, descriptor) {
        this.element = element;
        this.index = index;
        this.eventTarget = descriptor.eventTarget || element;
        this.eventName = descriptor.eventName || getDefaultEventNameForElement(element) || error("missing event name");
        this.eventOptions = descriptor.eventOptions || {};
        this.identifier = descriptor.identifier || error("missing identifier");
        this.methodName = descriptor.methodName || error("missing method name");
    }
    static forToken(token) {
        return new this(token.element, token.index, parseActionDescriptorString(token.content));
    }
    toString() {
        const eventNameSuffix = this.eventTargetName ? `@${this.eventTargetName}` : "";
        return `${this.eventName}${eventNameSuffix}->${this.identifier}#${this.methodName}`;
    }
    get params() {
        if (this.eventTarget instanceof Element) {
            return this.getParamsFromEventTargetAttributes(this.eventTarget);
        }
        else {
            return {};
        }
    }
    getParamsFromEventTargetAttributes(eventTarget) {
        const params = {};
        const pattern = new RegExp(`^data-${this.identifier}-(.+)-param$`);
        const attributes = Array.from(eventTarget.attributes);
        attributes.forEach(({ name, value }) => {
            const match = name.match(pattern);
            const key = match && match[1];
            if (key) {
                Object.assign(params, { [camelize(key)]: typecast(value) });
            }
        });
        return params;
    }
    get eventTargetName() {
        return stringifyEventTarget(this.eventTarget);
    }
}
const defaultEventNames = {
    "a": e => "click",
    "button": e => "click",
    "form": e => "submit",
    "details": e => "toggle",
    "input": e => e.getAttribute("type") == "submit" ? "click" : "input",
    "select": e => "change",
    "textarea": e => "input"
};
function getDefaultEventNameForElement(element) {
    const tagName = element.tagName.toLowerCase();
    if (tagName in defaultEventNames) {
        return defaultEventNames[tagName](element);
    }
}
function error(message) {
    throw new Error(message);
}
function typecast(value) {
    try {
        return JSON.parse(value);
    }
    catch (o_O) {
        return value;
    }
}

class Binding {
    constructor(context, action) {
        this.context = context;
        this.action = action;
    }
    get index() {
        return this.action.index;
    }
    get eventTarget() {
        return this.action.eventTarget;
    }
    get eventOptions() {
        return this.action.eventOptions;
    }
    get identifier() {
        return this.context.identifier;
    }
    handleEvent(event) {
        if (this.willBeInvokedByEvent(event)) {
            this.invokeWithEvent(event);
        }
    }
    get eventName() {
        return this.action.eventName;
    }
    get method() {
        const method = this.controller[this.methodName];
        if (typeof method == "function") {
            return method;
        }
        throw new Error(`Action "${this.action}" references undefined method "${this.methodName}"`);
    }
    invokeWithEvent(event) {
        const { target, currentTarget } = event;
        try {
            const { params } = this.action;
            const actionEvent = Object.assign(event, { params });
            this.method.call(this.controller, actionEvent);
            this.context.logDebugActivity(this.methodName, { event, target, currentTarget, action: this.methodName });
        }
        catch (error) {
            const { identifier, controller, element, index } = this;
            const detail = { identifier, controller, element, index, event };
            this.context.handleError(error, `invoking action "${this.action}"`, detail);
        }
    }
    willBeInvokedByEvent(event) {
        const eventTarget = event.target;
        if (this.element === eventTarget) {
            return true;
        }
        else if (eventTarget instanceof Element && this.element.contains(eventTarget)) {
            return this.scope.containsElement(eventTarget);
        }
        else {
            return this.scope.containsElement(this.action.element);
        }
    }
    get controller() {
        return this.context.controller;
    }
    get methodName() {
        return this.action.methodName;
    }
    get element() {
        return this.scope.element;
    }
    get scope() {
        return this.context.scope;
    }
}

class ElementObserver {
    constructor(element, delegate) {
        this.mutationObserverInit = { attributes: true, childList: true, subtree: true };
        this.element = element;
        this.started = false;
        this.delegate = delegate;
        this.elements = new Set;
        this.mutationObserver = new MutationObserver((mutations) => this.processMutations(mutations));
    }
    start() {
        if (!this.started) {
            this.started = true;
            this.mutationObserver.observe(this.element, this.mutationObserverInit);
            this.refresh();
        }
    }
    pause(callback) {
        if (this.started) {
            this.mutationObserver.disconnect();
            this.started = false;
        }
        callback();
        if (!this.started) {
            this.mutationObserver.observe(this.element, this.mutationObserverInit);
            this.started = true;
        }
    }
    stop() {
        if (this.started) {
            this.mutationObserver.takeRecords();
            this.mutationObserver.disconnect();
            this.started = false;
        }
    }
    refresh() {
        if (this.started) {
            const matches = new Set(this.matchElementsInTree());
            for (const element of Array.from(this.elements)) {
                if (!matches.has(element)) {
                    this.removeElement(element);
                }
            }
            for (const element of Array.from(matches)) {
                this.addElement(element);
            }
        }
    }
    processMutations(mutations) {
        if (this.started) {
            for (const mutation of mutations) {
                this.processMutation(mutation);
            }
        }
    }
    processMutation(mutation) {
        if (mutation.type == "attributes") {
            this.processAttributeChange(mutation.target, mutation.attributeName);
        }
        else if (mutation.type == "childList") {
            this.processRemovedNodes(mutation.removedNodes);
            this.processAddedNodes(mutation.addedNodes);
        }
    }
    processAttributeChange(node, attributeName) {
        const element = node;
        if (this.elements.has(element)) {
            if (this.delegate.elementAttributeChanged && this.matchElement(element)) {
                this.delegate.elementAttributeChanged(element, attributeName);
            }
            else {
                this.removeElement(element);
            }
        }
        else if (this.matchElement(element)) {
            this.addElement(element);
        }
    }
    processRemovedNodes(nodes) {
        for (const node of Array.from(nodes)) {
            const element = this.elementFromNode(node);
            if (element) {
                this.processTree(element, this.removeElement);
            }
        }
    }
    processAddedNodes(nodes) {
        for (const node of Array.from(nodes)) {
            const element = this.elementFromNode(node);
            if (element && this.elementIsActive(element)) {
                this.processTree(element, this.addElement);
            }
        }
    }
    matchElement(element) {
        return this.delegate.matchElement(element);
    }
    matchElementsInTree(tree = this.element) {
        return this.delegate.matchElementsInTree(tree);
    }
    processTree(tree, processor) {
        for (const element of this.matchElementsInTree(tree)) {
            processor.call(this, element);
        }
    }
    elementFromNode(node) {
        if (node.nodeType == Node.ELEMENT_NODE) {
            return node;
        }
    }
    elementIsActive(element) {
        if (element.isConnected != this.element.isConnected) {
            return false;
        }
        else {
            return this.element.contains(element);
        }
    }
    addElement(element) {
        if (!this.elements.has(element)) {
            if (this.elementIsActive(element)) {
                this.elements.add(element);
                if (this.delegate.elementMatched) {
                    this.delegate.elementMatched(element);
                }
            }
        }
    }
    removeElement(element) {
        if (this.elements.has(element)) {
            this.elements.delete(element);
            if (this.delegate.elementUnmatched) {
                this.delegate.elementUnmatched(element);
            }
        }
    }
}

class AttributeObserver {
    constructor(element, attributeName, delegate) {
        this.attributeName = attributeName;
        this.delegate = delegate;
        this.elementObserver = new ElementObserver(element, this);
    }
    get element() {
        return this.elementObserver.element;
    }
    get selector() {
        return `[${this.attributeName}]`;
    }
    start() {
        this.elementObserver.start();
    }
    pause(callback) {
        this.elementObserver.pause(callback);
    }
    stop() {
        this.elementObserver.stop();
    }
    refresh() {
        this.elementObserver.refresh();
    }
    get started() {
        return this.elementObserver.started;
    }
    matchElement(element) {
        return element.hasAttribute(this.attributeName);
    }
    matchElementsInTree(tree) {
        const match = this.matchElement(tree) ? [tree] : [];
        const matches = Array.from(tree.querySelectorAll(this.selector));
        return match.concat(matches);
    }
    elementMatched(element) {
        if (this.delegate.elementMatchedAttribute) {
            this.delegate.elementMatchedAttribute(element, this.attributeName);
        }
    }
    elementUnmatched(element) {
        if (this.delegate.elementUnmatchedAttribute) {
            this.delegate.elementUnmatchedAttribute(element, this.attributeName);
        }
    }
    elementAttributeChanged(element, attributeName) {
        if (this.delegate.elementAttributeValueChanged && this.attributeName == attributeName) {
            this.delegate.elementAttributeValueChanged(element, attributeName);
        }
    }
}

class StringMapObserver {
    constructor(element, delegate) {
        this.element = element;
        this.delegate = delegate;
        this.started = false;
        this.stringMap = new Map;
        this.mutationObserver = new MutationObserver(mutations => this.processMutations(mutations));
    }
    start() {
        if (!this.started) {
            this.started = true;
            this.mutationObserver.observe(this.element, { attributes: true, attributeOldValue: true });
            this.refresh();
        }
    }
    stop() {
        if (this.started) {
            this.mutationObserver.takeRecords();
            this.mutationObserver.disconnect();
            this.started = false;
        }
    }
    refresh() {
        if (this.started) {
            for (const attributeName of this.knownAttributeNames) {
                this.refreshAttribute(attributeName, null);
            }
        }
    }
    processMutations(mutations) {
        if (this.started) {
            for (const mutation of mutations) {
                this.processMutation(mutation);
            }
        }
    }
    processMutation(mutation) {
        const attributeName = mutation.attributeName;
        if (attributeName) {
            this.refreshAttribute(attributeName, mutation.oldValue);
        }
    }
    refreshAttribute(attributeName, oldValue) {
        const key = this.delegate.getStringMapKeyForAttribute(attributeName);
        if (key != null) {
            if (!this.stringMap.has(attributeName)) {
                this.stringMapKeyAdded(key, attributeName);
            }
            const value = this.element.getAttribute(attributeName);
            if (this.stringMap.get(attributeName) != value) {
                this.stringMapValueChanged(value, key, oldValue);
            }
            if (value == null) {
                const oldValue = this.stringMap.get(attributeName);
                this.stringMap.delete(attributeName);
                if (oldValue)
                    this.stringMapKeyRemoved(key, attributeName, oldValue);
            }
            else {
                this.stringMap.set(attributeName, value);
            }
        }
    }
    stringMapKeyAdded(key, attributeName) {
        if (this.delegate.stringMapKeyAdded) {
            this.delegate.stringMapKeyAdded(key, attributeName);
        }
    }
    stringMapValueChanged(value, key, oldValue) {
        if (this.delegate.stringMapValueChanged) {
            this.delegate.stringMapValueChanged(value, key, oldValue);
        }
    }
    stringMapKeyRemoved(key, attributeName, oldValue) {
        if (this.delegate.stringMapKeyRemoved) {
            this.delegate.stringMapKeyRemoved(key, attributeName, oldValue);
        }
    }
    get knownAttributeNames() {
        return Array.from(new Set(this.currentAttributeNames.concat(this.recordedAttributeNames)));
    }
    get currentAttributeNames() {
        return Array.from(this.element.attributes).map(attribute => attribute.name);
    }
    get recordedAttributeNames() {
        return Array.from(this.stringMap.keys());
    }
}

function add(map, key, value) {
    fetch(map, key).add(value);
}
function del(map, key, value) {
    fetch(map, key).delete(value);
    prune(map, key);
}
function fetch(map, key) {
    let values = map.get(key);
    if (!values) {
        values = new Set();
        map.set(key, values);
    }
    return values;
}
function prune(map, key) {
    const values = map.get(key);
    if (values != null && values.size == 0) {
        map.delete(key);
    }
}

class Multimap {
    constructor() {
        this.valuesByKey = new Map();
    }
    get keys() {
        return Array.from(this.valuesByKey.keys());
    }
    get values() {
        const sets = Array.from(this.valuesByKey.values());
        return sets.reduce((values, set) => values.concat(Array.from(set)), []);
    }
    get size() {
        const sets = Array.from(this.valuesByKey.values());
        return sets.reduce((size, set) => size + set.size, 0);
    }
    add(key, value) {
        add(this.valuesByKey, key, value);
    }
    delete(key, value) {
        del(this.valuesByKey, key, value);
    }
    has(key, value) {
        const values = this.valuesByKey.get(key);
        return values != null && values.has(value);
    }
    hasKey(key) {
        return this.valuesByKey.has(key);
    }
    hasValue(value) {
        const sets = Array.from(this.valuesByKey.values());
        return sets.some(set => set.has(value));
    }
    getValuesForKey(key) {
        const values = this.valuesByKey.get(key);
        return values ? Array.from(values) : [];
    }
    getKeysForValue(value) {
        return Array.from(this.valuesByKey)
            .filter(([key, values]) => values.has(value))
            .map(([key, values]) => key);
    }
}

class IndexedMultimap extends Multimap {
    constructor() {
        super();
        this.keysByValue = new Map;
    }
    get values() {
        return Array.from(this.keysByValue.keys());
    }
    add(key, value) {
        super.add(key, value);
        add(this.keysByValue, value, key);
    }
    delete(key, value) {
        super.delete(key, value);
        del(this.keysByValue, value, key);
    }
    hasValue(value) {
        return this.keysByValue.has(value);
    }
    getKeysForValue(value) {
        const set = this.keysByValue.get(value);
        return set ? Array.from(set) : [];
    }
}

class TokenListObserver {
    constructor(element, attributeName, delegate) {
        this.attributeObserver = new AttributeObserver(element, attributeName, this);
        this.delegate = delegate;
        this.tokensByElement = new Multimap;
    }
    get started() {
        return this.attributeObserver.started;
    }
    start() {
        this.attributeObserver.start();
    }
    pause(callback) {
        this.attributeObserver.pause(callback);
    }
    stop() {
        this.attributeObserver.stop();
    }
    refresh() {
        this.attributeObserver.refresh();
    }
    get element() {
        return this.attributeObserver.element;
    }
    get attributeName() {
        return this.attributeObserver.attributeName;
    }
    elementMatchedAttribute(element) {
        this.tokensMatched(this.readTokensForElement(element));
    }
    elementAttributeValueChanged(element) {
        const [unmatchedTokens, matchedTokens] = this.refreshTokensForElement(element);
        this.tokensUnmatched(unmatchedTokens);
        this.tokensMatched(matchedTokens);
    }
    elementUnmatchedAttribute(element) {
        this.tokensUnmatched(this.tokensByElement.getValuesForKey(element));
    }
    tokensMatched(tokens) {
        tokens.forEach(token => this.tokenMatched(token));
    }
    tokensUnmatched(tokens) {
        tokens.forEach(token => this.tokenUnmatched(token));
    }
    tokenMatched(token) {
        this.delegate.tokenMatched(token);
        this.tokensByElement.add(token.element, token);
    }
    tokenUnmatched(token) {
        this.delegate.tokenUnmatched(token);
        this.tokensByElement.delete(token.element, token);
    }
    refreshTokensForElement(element) {
        const previousTokens = this.tokensByElement.getValuesForKey(element);
        const currentTokens = this.readTokensForElement(element);
        const firstDifferingIndex = zip(previousTokens, currentTokens)
            .findIndex(([previousToken, currentToken]) => !tokensAreEqual(previousToken, currentToken));
        if (firstDifferingIndex == -1) {
            return [[], []];
        }
        else {
            return [previousTokens.slice(firstDifferingIndex), currentTokens.slice(firstDifferingIndex)];
        }
    }
    readTokensForElement(element) {
        const attributeName = this.attributeName;
        const tokenString = element.getAttribute(attributeName) || "";
        return parseTokenString(tokenString, element, attributeName);
    }
}
function parseTokenString(tokenString, element, attributeName) {
    return tokenString.trim().split(/\s+/).filter(content => content.length)
        .map((content, index) => ({ element, attributeName, content, index }));
}
function zip(left, right) {
    const length = Math.max(left.length, right.length);
    return Array.from({ length }, (_, index) => [left[index], right[index]]);
}
function tokensAreEqual(left, right) {
    return left && right && left.index == right.index && left.content == right.content;
}

class ValueListObserver {
    constructor(element, attributeName, delegate) {
        this.tokenListObserver = new TokenListObserver(element, attributeName, this);
        this.delegate = delegate;
        this.parseResultsByToken = new WeakMap;
        this.valuesByTokenByElement = new WeakMap;
    }
    get started() {
        return this.tokenListObserver.started;
    }
    start() {
        this.tokenListObserver.start();
    }
    stop() {
        this.tokenListObserver.stop();
    }
    refresh() {
        this.tokenListObserver.refresh();
    }
    get element() {
        return this.tokenListObserver.element;
    }
    get attributeName() {
        return this.tokenListObserver.attributeName;
    }
    tokenMatched(token) {
        const { element } = token;
        const { value } = this.fetchParseResultForToken(token);
        if (value) {
            this.fetchValuesByTokenForElement(element).set(token, value);
            this.delegate.elementMatchedValue(element, value);
        }
    }
    tokenUnmatched(token) {
        const { element } = token;
        const { value } = this.fetchParseResultForToken(token);
        if (value) {
            this.fetchValuesByTokenForElement(element).delete(token);
            this.delegate.elementUnmatchedValue(element, value);
        }
    }
    fetchParseResultForToken(token) {
        let parseResult = this.parseResultsByToken.get(token);
        if (!parseResult) {
            parseResult = this.parseToken(token);
            this.parseResultsByToken.set(token, parseResult);
        }
        return parseResult;
    }
    fetchValuesByTokenForElement(element) {
        let valuesByToken = this.valuesByTokenByElement.get(element);
        if (!valuesByToken) {
            valuesByToken = new Map;
            this.valuesByTokenByElement.set(element, valuesByToken);
        }
        return valuesByToken;
    }
    parseToken(token) {
        try {
            const value = this.delegate.parseValueForToken(token);
            return { value };
        }
        catch (error) {
            return { error };
        }
    }
}

class BindingObserver {
    constructor(context, delegate) {
        this.context = context;
        this.delegate = delegate;
        this.bindingsByAction = new Map;
    }
    start() {
        if (!this.valueListObserver) {
            this.valueListObserver = new ValueListObserver(this.element, this.actionAttribute, this);
            this.valueListObserver.start();
        }
    }
    stop() {
        if (this.valueListObserver) {
            this.valueListObserver.stop();
            delete this.valueListObserver;
            this.disconnectAllActions();
        }
    }
    get element() {
        return this.context.element;
    }
    get identifier() {
        return this.context.identifier;
    }
    get actionAttribute() {
        return this.schema.actionAttribute;
    }
    get schema() {
        return this.context.schema;
    }
    get bindings() {
        return Array.from(this.bindingsByAction.values());
    }
    connectAction(action) {
        const binding = new Binding(this.context, action);
        this.bindingsByAction.set(action, binding);
        this.delegate.bindingConnected(binding);
    }
    disconnectAction(action) {
        const binding = this.bindingsByAction.get(action);
        if (binding) {
            this.bindingsByAction.delete(action);
            this.delegate.bindingDisconnected(binding);
        }
    }
    disconnectAllActions() {
        this.bindings.forEach(binding => this.delegate.bindingDisconnected(binding));
        this.bindingsByAction.clear();
    }
    parseValueForToken(token) {
        const action = Action.forToken(token);
        if (action.identifier == this.identifier) {
            return action;
        }
    }
    elementMatchedValue(element, action) {
        this.connectAction(action);
    }
    elementUnmatchedValue(element, action) {
        this.disconnectAction(action);
    }
}

class ValueObserver {
    constructor(context, receiver) {
        this.context = context;
        this.receiver = receiver;
        this.stringMapObserver = new StringMapObserver(this.element, this);
        this.valueDescriptorMap = this.controller.valueDescriptorMap;
        this.invokeChangedCallbacksForDefaultValues();
    }
    start() {
        this.stringMapObserver.start();
    }
    stop() {
        this.stringMapObserver.stop();
    }
    get element() {
        return this.context.element;
    }
    get controller() {
        return this.context.controller;
    }
    getStringMapKeyForAttribute(attributeName) {
        if (attributeName in this.valueDescriptorMap) {
            return this.valueDescriptorMap[attributeName].name;
        }
    }
    stringMapKeyAdded(key, attributeName) {
        const descriptor = this.valueDescriptorMap[attributeName];
        if (!this.hasValue(key)) {
            this.invokeChangedCallback(key, descriptor.writer(this.receiver[key]), descriptor.writer(descriptor.defaultValue));
        }
    }
    stringMapValueChanged(value, name, oldValue) {
        const descriptor = this.valueDescriptorNameMap[name];
        if (value === null)
            return;
        if (oldValue === null) {
            oldValue = descriptor.writer(descriptor.defaultValue);
        }
        this.invokeChangedCallback(name, value, oldValue);
    }
    stringMapKeyRemoved(key, attributeName, oldValue) {
        const descriptor = this.valueDescriptorNameMap[key];
        if (this.hasValue(key)) {
            this.invokeChangedCallback(key, descriptor.writer(this.receiver[key]), oldValue);
        }
        else {
            this.invokeChangedCallback(key, descriptor.writer(descriptor.defaultValue), oldValue);
        }
    }
    invokeChangedCallbacksForDefaultValues() {
        for (const { key, name, defaultValue, writer } of this.valueDescriptors) {
            if (defaultValue != undefined && !this.controller.data.has(key)) {
                this.invokeChangedCallback(name, writer(defaultValue), undefined);
            }
        }
    }
    invokeChangedCallback(name, rawValue, rawOldValue) {
        const changedMethodName = `${name}Changed`;
        const changedMethod = this.receiver[changedMethodName];
        if (typeof changedMethod == "function") {
            const descriptor = this.valueDescriptorNameMap[name];
            const value = descriptor.reader(rawValue);
            let oldValue = rawOldValue;
            if (rawOldValue) {
                oldValue = descriptor.reader(rawOldValue);
            }
            changedMethod.call(this.receiver, value, oldValue);
        }
    }
    get valueDescriptors() {
        const { valueDescriptorMap } = this;
        return Object.keys(valueDescriptorMap).map(key => valueDescriptorMap[key]);
    }
    get valueDescriptorNameMap() {
        const descriptors = {};
        Object.keys(this.valueDescriptorMap).forEach(key => {
            const descriptor = this.valueDescriptorMap[key];
            descriptors[descriptor.name] = descriptor;
        });
        return descriptors;
    }
    hasValue(attributeName) {
        const descriptor = this.valueDescriptorNameMap[attributeName];
        const hasMethodName = `has${capitalize(descriptor.name)}`;
        return this.receiver[hasMethodName];
    }
}

class TargetObserver {
    constructor(context, delegate) {
        this.context = context;
        this.delegate = delegate;
        this.targetsByName = new Multimap;
    }
    start() {
        if (!this.tokenListObserver) {
            this.tokenListObserver = new TokenListObserver(this.element, this.attributeName, this);
            this.tokenListObserver.start();
        }
    }
    stop() {
        if (this.tokenListObserver) {
            this.disconnectAllTargets();
            this.tokenListObserver.stop();
            delete this.tokenListObserver;
        }
    }
    tokenMatched({ element, content: name }) {
        if (this.scope.containsElement(element)) {
            this.connectTarget(element, name);
        }
    }
    tokenUnmatched({ element, content: name }) {
        this.disconnectTarget(element, name);
    }
    connectTarget(element, name) {
        var _a;
        if (!this.targetsByName.has(name, element)) {
            this.targetsByName.add(name, element);
            (_a = this.tokenListObserver) === null || _a === void 0 ? void 0 : _a.pause(() => this.delegate.targetConnected(element, name));
        }
    }
    disconnectTarget(element, name) {
        var _a;
        if (this.targetsByName.has(name, element)) {
            this.targetsByName.delete(name, element);
            (_a = this.tokenListObserver) === null || _a === void 0 ? void 0 : _a.pause(() => this.delegate.targetDisconnected(element, name));
        }
    }
    disconnectAllTargets() {
        for (const name of this.targetsByName.keys) {
            for (const element of this.targetsByName.getValuesForKey(name)) {
                this.disconnectTarget(element, name);
            }
        }
    }
    get attributeName() {
        return `data-${this.context.identifier}-target`;
    }
    get element() {
        return this.context.element;
    }
    get scope() {
        return this.context.scope;
    }
}

class Context {
    constructor(module, scope) {
        this.logDebugActivity = (functionName, detail = {}) => {
            const { identifier, controller, element } = this;
            detail = Object.assign({ identifier, controller, element }, detail);
            this.application.logDebugActivity(this.identifier, functionName, detail);
        };
        this.module = module;
        this.scope = scope;
        this.controller = new module.controllerConstructor(this);
        this.bindingObserver = new BindingObserver(this, this.dispatcher);
        this.valueObserver = new ValueObserver(this, this.controller);
        this.targetObserver = new TargetObserver(this, this);
        try {
            this.controller.initialize();
            this.logDebugActivity("initialize");
        }
        catch (error) {
            this.handleError(error, "initializing controller");
        }
    }
    connect() {
        this.bindingObserver.start();
        this.valueObserver.start();
        this.targetObserver.start();
        try {
            this.controller.connect();
            this.logDebugActivity("connect");
        }
        catch (error) {
            this.handleError(error, "connecting controller");
        }
    }
    disconnect() {
        try {
            this.controller.disconnect();
            this.logDebugActivity("disconnect");
        }
        catch (error) {
            this.handleError(error, "disconnecting controller");
        }
        this.targetObserver.stop();
        this.valueObserver.stop();
        this.bindingObserver.stop();
    }
    get application() {
        return this.module.application;
    }
    get identifier() {
        return this.module.identifier;
    }
    get schema() {
        return this.application.schema;
    }
    get dispatcher() {
        return this.application.dispatcher;
    }
    get element() {
        return this.scope.element;
    }
    get parentElement() {
        return this.element.parentElement;
    }
    handleError(error, message, detail = {}) {
        const { identifier, controller, element } = this;
        detail = Object.assign({ identifier, controller, element }, detail);
        this.application.handleError(error, `Error ${message}`, detail);
    }
    targetConnected(element, name) {
        this.invokeControllerMethod(`${name}TargetConnected`, element);
    }
    targetDisconnected(element, name) {
        this.invokeControllerMethod(`${name}TargetDisconnected`, element);
    }
    invokeControllerMethod(methodName, ...args) {
        const controller = this.controller;
        if (typeof controller[methodName] == "function") {
            controller[methodName](...args);
        }
    }
}

function readInheritableStaticArrayValues(constructor, propertyName) {
    const ancestors = getAncestorsForConstructor(constructor);
    return Array.from(ancestors.reduce((values, constructor) => {
        getOwnStaticArrayValues(constructor, propertyName).forEach(name => values.add(name));
        return values;
    }, new Set));
}
function readInheritableStaticObjectPairs(constructor, propertyName) {
    const ancestors = getAncestorsForConstructor(constructor);
    return ancestors.reduce((pairs, constructor) => {
        pairs.push(...getOwnStaticObjectPairs(constructor, propertyName));
        return pairs;
    }, []);
}
function getAncestorsForConstructor(constructor) {
    const ancestors = [];
    while (constructor) {
        ancestors.push(constructor);
        constructor = Object.getPrototypeOf(constructor);
    }
    return ancestors.reverse();
}
function getOwnStaticArrayValues(constructor, propertyName) {
    const definition = constructor[propertyName];
    return Array.isArray(definition) ? definition : [];
}
function getOwnStaticObjectPairs(constructor, propertyName) {
    const definition = constructor[propertyName];
    return definition ? Object.keys(definition).map(key => [key, definition[key]]) : [];
}

function bless(constructor) {
    return shadow(constructor, getBlessedProperties(constructor));
}
function shadow(constructor, properties) {
    const shadowConstructor = extend(constructor);
    const shadowProperties = getShadowProperties(constructor.prototype, properties);
    Object.defineProperties(shadowConstructor.prototype, shadowProperties);
    return shadowConstructor;
}
function getBlessedProperties(constructor) {
    const blessings = readInheritableStaticArrayValues(constructor, "blessings");
    return blessings.reduce((blessedProperties, blessing) => {
        const properties = blessing(constructor);
        for (const key in properties) {
            const descriptor = blessedProperties[key] || {};
            blessedProperties[key] = Object.assign(descriptor, properties[key]);
        }
        return blessedProperties;
    }, {});
}
function getShadowProperties(prototype, properties) {
    return getOwnKeys(properties).reduce((shadowProperties, key) => {
        const descriptor = getShadowedDescriptor(prototype, properties, key);
        if (descriptor) {
            Object.assign(shadowProperties, { [key]: descriptor });
        }
        return shadowProperties;
    }, {});
}
function getShadowedDescriptor(prototype, properties, key) {
    const shadowingDescriptor = Object.getOwnPropertyDescriptor(prototype, key);
    const shadowedByValue = shadowingDescriptor && "value" in shadowingDescriptor;
    if (!shadowedByValue) {
        const descriptor = Object.getOwnPropertyDescriptor(properties, key).value;
        if (shadowingDescriptor) {
            descriptor.get = shadowingDescriptor.get || descriptor.get;
            descriptor.set = shadowingDescriptor.set || descriptor.set;
        }
        return descriptor;
    }
}
const getOwnKeys = (() => {
    if (typeof Object.getOwnPropertySymbols == "function") {
        return (object) => [
            ...Object.getOwnPropertyNames(object),
            ...Object.getOwnPropertySymbols(object)
        ];
    }
    else {
        return Object.getOwnPropertyNames;
    }
})();
const extend = (() => {
    function extendWithReflect(constructor) {
        function extended() {
            return Reflect.construct(constructor, arguments, new.target);
        }
        extended.prototype = Object.create(constructor.prototype, {
            constructor: { value: extended }
        });
        Reflect.setPrototypeOf(extended, constructor);
        return extended;
    }
    function testReflectExtension() {
        const a = function () { this.a.call(this); };
        const b = extendWithReflect(a);
        b.prototype.a = function () { };
        return new b;
    }
    try {
        testReflectExtension();
        return extendWithReflect;
    }
    catch (error) {
        return (constructor) => class extended extends constructor {
        };
    }
})();

function blessDefinition(definition) {
    return {
        identifier: definition.identifier,
        controllerConstructor: bless(definition.controllerConstructor)
    };
}

class Module {
    constructor(application, definition) {
        this.application = application;
        this.definition = blessDefinition(definition);
        this.contextsByScope = new WeakMap;
        this.connectedContexts = new Set;
    }
    get identifier() {
        return this.definition.identifier;
    }
    get controllerConstructor() {
        return this.definition.controllerConstructor;
    }
    get contexts() {
        return Array.from(this.connectedContexts);
    }
    connectContextForScope(scope) {
        const context = this.fetchContextForScope(scope);
        this.connectedContexts.add(context);
        context.connect();
    }
    disconnectContextForScope(scope) {
        const context = this.contextsByScope.get(scope);
        if (context) {
            this.connectedContexts.delete(context);
            context.disconnect();
        }
    }
    fetchContextForScope(scope) {
        let context = this.contextsByScope.get(scope);
        if (!context) {
            context = new Context(this, scope);
            this.contextsByScope.set(scope, context);
        }
        return context;
    }
}

class ClassMap {
    constructor(scope) {
        this.scope = scope;
    }
    has(name) {
        return this.data.has(this.getDataKey(name));
    }
    get(name) {
        return this.getAll(name)[0];
    }
    getAll(name) {
        const tokenString = this.data.get(this.getDataKey(name)) || "";
        return tokenize(tokenString);
    }
    getAttributeName(name) {
        return this.data.getAttributeNameForKey(this.getDataKey(name));
    }
    getDataKey(name) {
        return `${name}-class`;
    }
    get data() {
        return this.scope.data;
    }
}

class DataMap {
    constructor(scope) {
        this.scope = scope;
    }
    get element() {
        return this.scope.element;
    }
    get identifier() {
        return this.scope.identifier;
    }
    get(key) {
        const name = this.getAttributeNameForKey(key);
        return this.element.getAttribute(name);
    }
    set(key, value) {
        const name = this.getAttributeNameForKey(key);
        this.element.setAttribute(name, value);
        return this.get(key);
    }
    has(key) {
        const name = this.getAttributeNameForKey(key);
        return this.element.hasAttribute(name);
    }
    delete(key) {
        if (this.has(key)) {
            const name = this.getAttributeNameForKey(key);
            this.element.removeAttribute(name);
            return true;
        }
        else {
            return false;
        }
    }
    getAttributeNameForKey(key) {
        return `data-${this.identifier}-${dasherize(key)}`;
    }
}

class Guide {
    constructor(logger) {
        this.warnedKeysByObject = new WeakMap;
        this.logger = logger;
    }
    warn(object, key, message) {
        let warnedKeys = this.warnedKeysByObject.get(object);
        if (!warnedKeys) {
            warnedKeys = new Set;
            this.warnedKeysByObject.set(object, warnedKeys);
        }
        if (!warnedKeys.has(key)) {
            warnedKeys.add(key);
            this.logger.warn(message, object);
        }
    }
}

function attributeValueContainsToken(attributeName, token) {
    return `[${attributeName}~="${token}"]`;
}

class TargetSet {
    constructor(scope) {
        this.scope = scope;
    }
    get element() {
        return this.scope.element;
    }
    get identifier() {
        return this.scope.identifier;
    }
    get schema() {
        return this.scope.schema;
    }
    has(targetName) {
        return this.find(targetName) != null;
    }
    find(...targetNames) {
        return targetNames.reduce((target, targetName) => target
            || this.findTarget(targetName)
            || this.findLegacyTarget(targetName), undefined);
    }
    findAll(...targetNames) {
        return targetNames.reduce((targets, targetName) => [
            ...targets,
            ...this.findAllTargets(targetName),
            ...this.findAllLegacyTargets(targetName)
        ], []);
    }
    findTarget(targetName) {
        const selector = this.getSelectorForTargetName(targetName);
        return this.scope.findElement(selector);
    }
    findAllTargets(targetName) {
        const selector = this.getSelectorForTargetName(targetName);
        return this.scope.findAllElements(selector);
    }
    getSelectorForTargetName(targetName) {
        const attributeName = this.schema.targetAttributeForScope(this.identifier);
        return attributeValueContainsToken(attributeName, targetName);
    }
    findLegacyTarget(targetName) {
        const selector = this.getLegacySelectorForTargetName(targetName);
        return this.deprecate(this.scope.findElement(selector), targetName);
    }
    findAllLegacyTargets(targetName) {
        const selector = this.getLegacySelectorForTargetName(targetName);
        return this.scope.findAllElements(selector).map(element => this.deprecate(element, targetName));
    }
    getLegacySelectorForTargetName(targetName) {
        const targetDescriptor = `${this.identifier}.${targetName}`;
        return attributeValueContainsToken(this.schema.targetAttribute, targetDescriptor);
    }
    deprecate(element, targetName) {
        if (element) {
            const { identifier } = this;
            const attributeName = this.schema.targetAttribute;
            const revisedAttributeName = this.schema.targetAttributeForScope(identifier);
            this.guide.warn(element, `target:${targetName}`, `Please replace ${attributeName}="${identifier}.${targetName}" with ${revisedAttributeName}="${targetName}". ` +
                `The ${attributeName} attribute is deprecated and will be removed in a future version of Stimulus.`);
        }
        return element;
    }
    get guide() {
        return this.scope.guide;
    }
}

class Scope {
    constructor(schema, element, identifier, logger) {
        this.targets = new TargetSet(this);
        this.classes = new ClassMap(this);
        this.data = new DataMap(this);
        this.containsElement = (element) => {
            return element.closest(this.controllerSelector) === this.element;
        };
        this.schema = schema;
        this.element = element;
        this.identifier = identifier;
        this.guide = new Guide(logger);
    }
    findElement(selector) {
        return this.element.matches(selector)
            ? this.element
            : this.queryElements(selector).find(this.containsElement);
    }
    findAllElements(selector) {
        return [
            ...this.element.matches(selector) ? [this.element] : [],
            ...this.queryElements(selector).filter(this.containsElement)
        ];
    }
    queryElements(selector) {
        return Array.from(this.element.querySelectorAll(selector));
    }
    get controllerSelector() {
        return attributeValueContainsToken(this.schema.controllerAttribute, this.identifier);
    }
}

class ScopeObserver {
    constructor(element, schema, delegate) {
        this.element = element;
        this.schema = schema;
        this.delegate = delegate;
        this.valueListObserver = new ValueListObserver(this.element, this.controllerAttribute, this);
        this.scopesByIdentifierByElement = new WeakMap;
        this.scopeReferenceCounts = new WeakMap;
    }
    start() {
        this.valueListObserver.start();
    }
    stop() {
        this.valueListObserver.stop();
    }
    get controllerAttribute() {
        return this.schema.controllerAttribute;
    }
    parseValueForToken(token) {
        const { element, content: identifier } = token;
        const scopesByIdentifier = this.fetchScopesByIdentifierForElement(element);
        let scope = scopesByIdentifier.get(identifier);
        if (!scope) {
            scope = this.delegate.createScopeForElementAndIdentifier(element, identifier);
            scopesByIdentifier.set(identifier, scope);
        }
        return scope;
    }
    elementMatchedValue(element, value) {
        const referenceCount = (this.scopeReferenceCounts.get(value) || 0) + 1;
        this.scopeReferenceCounts.set(value, referenceCount);
        if (referenceCount == 1) {
            this.delegate.scopeConnected(value);
        }
    }
    elementUnmatchedValue(element, value) {
        const referenceCount = this.scopeReferenceCounts.get(value);
        if (referenceCount) {
            this.scopeReferenceCounts.set(value, referenceCount - 1);
            if (referenceCount == 1) {
                this.delegate.scopeDisconnected(value);
            }
        }
    }
    fetchScopesByIdentifierForElement(element) {
        let scopesByIdentifier = this.scopesByIdentifierByElement.get(element);
        if (!scopesByIdentifier) {
            scopesByIdentifier = new Map;
            this.scopesByIdentifierByElement.set(element, scopesByIdentifier);
        }
        return scopesByIdentifier;
    }
}

class Router {
    constructor(application) {
        this.application = application;
        this.scopeObserver = new ScopeObserver(this.element, this.schema, this);
        this.scopesByIdentifier = new Multimap;
        this.modulesByIdentifier = new Map;
    }
    get element() {
        return this.application.element;
    }
    get schema() {
        return this.application.schema;
    }
    get logger() {
        return this.application.logger;
    }
    get controllerAttribute() {
        return this.schema.controllerAttribute;
    }
    get modules() {
        return Array.from(this.modulesByIdentifier.values());
    }
    get contexts() {
        return this.modules.reduce((contexts, module) => contexts.concat(module.contexts), []);
    }
    start() {
        this.scopeObserver.start();
    }
    stop() {
        this.scopeObserver.stop();
    }
    loadDefinition(definition) {
        this.unloadIdentifier(definition.identifier);
        const module = new Module(this.application, definition);
        this.connectModule(module);
    }
    unloadIdentifier(identifier) {
        const module = this.modulesByIdentifier.get(identifier);
        if (module) {
            this.disconnectModule(module);
        }
    }
    getContextForElementAndIdentifier(element, identifier) {
        const module = this.modulesByIdentifier.get(identifier);
        if (module) {
            return module.contexts.find(context => context.element == element);
        }
    }
    handleError(error, message, detail) {
        this.application.handleError(error, message, detail);
    }
    createScopeForElementAndIdentifier(element, identifier) {
        return new Scope(this.schema, element, identifier, this.logger);
    }
    scopeConnected(scope) {
        this.scopesByIdentifier.add(scope.identifier, scope);
        const module = this.modulesByIdentifier.get(scope.identifier);
        if (module) {
            module.connectContextForScope(scope);
        }
    }
    scopeDisconnected(scope) {
        this.scopesByIdentifier.delete(scope.identifier, scope);
        const module = this.modulesByIdentifier.get(scope.identifier);
        if (module) {
            module.disconnectContextForScope(scope);
        }
    }
    connectModule(module) {
        this.modulesByIdentifier.set(module.identifier, module);
        const scopes = this.scopesByIdentifier.getValuesForKey(module.identifier);
        scopes.forEach(scope => module.connectContextForScope(scope));
    }
    disconnectModule(module) {
        this.modulesByIdentifier.delete(module.identifier);
        const scopes = this.scopesByIdentifier.getValuesForKey(module.identifier);
        scopes.forEach(scope => module.disconnectContextForScope(scope));
    }
}

const defaultSchema = {
    controllerAttribute: "data-controller",
    actionAttribute: "data-action",
    targetAttribute: "data-target",
    targetAttributeForScope: identifier => `data-${identifier}-target`
};

class Application {
    constructor(element = document.documentElement, schema = defaultSchema) {
        this.logger = console;
        this.debug = false;
        this.logDebugActivity = (identifier, functionName, detail = {}) => {
            if (this.debug) {
                this.logFormattedMessage(identifier, functionName, detail);
            }
        };
        this.element = element;
        this.schema = schema;
        this.dispatcher = new Dispatcher(this);
        this.router = new Router(this);
    }
    static start(element, schema) {
        const application = new Application(element, schema);
        application.start();
        return application;
    }
    async start() {
        await domReady();
        this.logDebugActivity("application", "starting");
        this.dispatcher.start();
        this.router.start();
        this.logDebugActivity("application", "start");
    }
    stop() {
        this.logDebugActivity("application", "stopping");
        this.dispatcher.stop();
        this.router.stop();
        this.logDebugActivity("application", "stop");
    }
    register(identifier, controllerConstructor) {
        if (controllerConstructor.shouldLoad) {
            this.load({ identifier, controllerConstructor });
        }
    }
    load(head, ...rest) {
        const definitions = Array.isArray(head) ? head : [head, ...rest];
        definitions.forEach(definition => this.router.loadDefinition(definition));
    }
    unload(head, ...rest) {
        const identifiers = Array.isArray(head) ? head : [head, ...rest];
        identifiers.forEach(identifier => this.router.unloadIdentifier(identifier));
    }
    get controllers() {
        return this.router.contexts.map(context => context.controller);
    }
    getControllerForElementAndIdentifier(element, identifier) {
        const context = this.router.getContextForElementAndIdentifier(element, identifier);
        return context ? context.controller : null;
    }
    handleError(error, message, detail) {
        var _a;
        this.logger.error(`%s\n\n%o\n\n%o`, message, error, detail);
        (_a = window.onerror) === null || _a === void 0 ? void 0 : _a.call(window, message, "", 0, 0, error);
    }
    logFormattedMessage(identifier, functionName, detail = {}) {
        detail = Object.assign({ application: this }, detail);
        this.logger.groupCollapsed(`${identifier} #${functionName}`);
        this.logger.log("details:", Object.assign({}, detail));
        this.logger.groupEnd();
    }
}
function domReady() {
    return new Promise(resolve => {
        if (document.readyState == "loading") {
            document.addEventListener("DOMContentLoaded", () => resolve());
        }
        else {
            resolve();
        }
    });
}

function ClassPropertiesBlessing(constructor) {
    const classes = readInheritableStaticArrayValues(constructor, "classes");
    return classes.reduce((properties, classDefinition) => {
        return Object.assign(properties, propertiesForClassDefinition(classDefinition));
    }, {});
}
function propertiesForClassDefinition(key) {
    return {
        [`${key}Class`]: {
            get() {
                const { classes } = this;
                if (classes.has(key)) {
                    return classes.get(key);
                }
                else {
                    const attribute = classes.getAttributeName(key);
                    throw new Error(`Missing attribute "${attribute}"`);
                }
            }
        },
        [`${key}Classes`]: {
            get() {
                return this.classes.getAll(key);
            }
        },
        [`has${capitalize(key)}Class`]: {
            get() {
                return this.classes.has(key);
            }
        }
    };
}

function TargetPropertiesBlessing(constructor) {
    const targets = readInheritableStaticArrayValues(constructor, "targets");
    return targets.reduce((properties, targetDefinition) => {
        return Object.assign(properties, propertiesForTargetDefinition(targetDefinition));
    }, {});
}
function propertiesForTargetDefinition(name) {
    return {
        [`${name}Target`]: {
            get() {
                const target = this.targets.find(name);
                if (target) {
                    return target;
                }
                else {
                    throw new Error(`Missing target element "${name}" for "${this.identifier}" controller`);
                }
            }
        },
        [`${name}Targets`]: {
            get() {
                return this.targets.findAll(name);
            }
        },
        [`has${capitalize(name)}Target`]: {
            get() {
                return this.targets.has(name);
            }
        }
    };
}

function ValuePropertiesBlessing(constructor) {
    const valueDefinitionPairs = readInheritableStaticObjectPairs(constructor, "values");
    const propertyDescriptorMap = {
        valueDescriptorMap: {
            get() {
                return valueDefinitionPairs.reduce((result, valueDefinitionPair) => {
                    const valueDescriptor = parseValueDefinitionPair(valueDefinitionPair);
                    const attributeName = this.data.getAttributeNameForKey(valueDescriptor.key);
                    return Object.assign(result, { [attributeName]: valueDescriptor });
                }, {});
            }
        }
    };
    return valueDefinitionPairs.reduce((properties, valueDefinitionPair) => {
        return Object.assign(properties, propertiesForValueDefinitionPair(valueDefinitionPair));
    }, propertyDescriptorMap);
}
function propertiesForValueDefinitionPair(valueDefinitionPair) {
    const definition = parseValueDefinitionPair(valueDefinitionPair);
    const { key, name, reader: read, writer: write } = definition;
    return {
        [name]: {
            get() {
                const value = this.data.get(key);
                if (value !== null) {
                    return read(value);
                }
                else {
                    return definition.defaultValue;
                }
            },
            set(value) {
                if (value === undefined) {
                    this.data.delete(key);
                }
                else {
                    this.data.set(key, write(value));
                }
            }
        },
        [`has${capitalize(name)}`]: {
            get() {
                return this.data.has(key) || definition.hasCustomDefaultValue;
            }
        }
    };
}
function parseValueDefinitionPair([token, typeDefinition]) {
    return valueDescriptorForTokenAndTypeDefinition(token, typeDefinition);
}
function parseValueTypeConstant(constant) {
    switch (constant) {
        case Array: return "array";
        case Boolean: return "boolean";
        case Number: return "number";
        case Object: return "object";
        case String: return "string";
    }
}
function parseValueTypeDefault(defaultValue) {
    switch (typeof defaultValue) {
        case "boolean": return "boolean";
        case "number": return "number";
        case "string": return "string";
    }
    if (Array.isArray(defaultValue))
        return "array";
    if (Object.prototype.toString.call(defaultValue) === "[object Object]")
        return "object";
}
function parseValueTypeObject(typeObject) {
    const typeFromObject = parseValueTypeConstant(typeObject.type);
    if (typeFromObject) {
        const defaultValueType = parseValueTypeDefault(typeObject.default);
        if (typeFromObject !== defaultValueType) {
            throw new Error(`Type "${typeFromObject}" must match the type of the default value. Given default value: "${typeObject.default}" as "${defaultValueType}"`);
        }
        return typeFromObject;
    }
}
function parseValueTypeDefinition(typeDefinition) {
    const typeFromObject = parseValueTypeObject(typeDefinition);
    const typeFromDefaultValue = parseValueTypeDefault(typeDefinition);
    const typeFromConstant = parseValueTypeConstant(typeDefinition);
    const type = typeFromObject || typeFromDefaultValue || typeFromConstant;
    if (type)
        return type;
    throw new Error(`Unknown value type "${typeDefinition}"`);
}
function defaultValueForDefinition(typeDefinition) {
    const constant = parseValueTypeConstant(typeDefinition);
    if (constant)
        return defaultValuesByType[constant];
    const defaultValue = typeDefinition.default;
    if (defaultValue !== undefined)
        return defaultValue;
    return typeDefinition;
}
function valueDescriptorForTokenAndTypeDefinition(token, typeDefinition) {
    const key = `${dasherize(token)}-value`;
    const type = parseValueTypeDefinition(typeDefinition);
    return {
        type,
        key,
        name: camelize(key),
        get defaultValue() { return defaultValueForDefinition(typeDefinition); },
        get hasCustomDefaultValue() { return parseValueTypeDefault(typeDefinition) !== undefined; },
        reader: readers[type],
        writer: writers[type] || writers.default
    };
}
const defaultValuesByType = {
    get array() { return []; },
    boolean: false,
    number: 0,
    get object() { return {}; },
    string: ""
};
const readers = {
    array(value) {
        const array = JSON.parse(value);
        if (!Array.isArray(array)) {
            throw new TypeError("Expected array");
        }
        return array;
    },
    boolean(value) {
        return !(value == "0" || value == "false");
    },
    number(value) {
        return Number(value);
    },
    object(value) {
        const object = JSON.parse(value);
        if (object === null || typeof object != "object" || Array.isArray(object)) {
            throw new TypeError("Expected object");
        }
        return object;
    },
    string(value) {
        return value;
    }
};
const writers = {
    default: writeString,
    array: writeJSON,
    object: writeJSON
};
function writeJSON(value) {
    return JSON.stringify(value);
}
function writeString(value) {
    return `${value}`;
}

class Controller {
    constructor(context) {
        this.context = context;
    }
    static get shouldLoad() {
        return true;
    }
    get application() {
        return this.context.application;
    }
    get scope() {
        return this.context.scope;
    }
    get element() {
        return this.scope.element;
    }
    get identifier() {
        return this.scope.identifier;
    }
    get targets() {
        return this.scope.targets;
    }
    get classes() {
        return this.scope.classes;
    }
    get data() {
        return this.scope.data;
    }
    initialize() {
    }
    connect() {
    }
    disconnect() {
    }
    dispatch(eventName, { target = this.element, detail = {}, prefix = this.identifier, bubbles = true, cancelable = true } = {}) {
        const type = prefix ? `${prefix}:${eventName}` : eventName;
        const event = new CustomEvent(type, { detail, bubbles, cancelable });
        target.dispatchEvent(event);
        return event;
    }
}
Controller.blessings = [ClassPropertiesBlessing, TargetPropertiesBlessing, ValuePropertiesBlessing];
Controller.targets = [];
Controller.values = {};




/***/ }),

/***/ "./src/js/controllers/hello_controller.js":
/*!************************************************!*\
  !*** ./src/js/controllers/hello_controller.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _default)
/* harmony export */ });
/* harmony import */ var stimulus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! stimulus */ "./node_modules/stimulus/dist/stimulus.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



var _default = /*#__PURE__*/function (_Controller) {
  _inherits(_default, _Controller);

  var _super = _createSuper(_default);

  function _default() {
    _classCallCheck(this, _default);

    return _super.apply(this, arguments);
  }

  _createClass(_default, [{
    key: "connect",
    value: function connect() {
      this.sayHi('hello');
      this.styleUsername();
    }
  }, {
    key: "sayHi",
    value: function sayHi(controllerName) {
      console.log("Hello from the '".concat(controllerName, "' controller."), this.element);
    }
  }, {
    key: "greet",
    value: function greet(eventObj) {
      console.log('Hello from element:', this.element, eventObj.target);
      if (this.hasUsernameTarget) console.log("Greetings ".concat(this.usernameTarget.value ? this.usernameTarget.value : 'no one', "!"));
      this.counterValue++;
    }
  }, {
    key: "counterValueChanged",
    value: function counterValueChanged(newValue, oldValue) {
      console.log("Greeting count is ".concat(newValue));
    }
  }, {
    key: "usernameChange",
    value: function usernameChange(eventObj) {
      this.styleUsername();
    }
  }, {
    key: "styleUsername",
    value: function styleUsername() {
      var _this$usernameTarget$, _this$usernameTarget$2;

      if (!this.usernameTarget.value) (_this$usernameTarget$ = this.usernameTarget.classList).add.apply(_this$usernameTarget$, _toConsumableArray(this.emptyClasses));else (_this$usernameTarget$2 = this.usernameTarget.classList).remove.apply(_this$usernameTarget$2, _toConsumableArray(this.emptyClasses));
    }
  }]);

  return _default;
}(stimulus__WEBPACK_IMPORTED_MODULE_0__.Controller);

_defineProperty(_default, "targets", ['username']);

_defineProperty(_default, "values", {
  counter: Number
});

_defineProperty(_default, "classes", ['empty']);



/***/ }),

/***/ "./node_modules/hotkeys-js/dist/hotkeys.esm.js":
/*!*****************************************************!*\
  !*** ./node_modules/hotkeys-js/dist/hotkeys.esm.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ hotkeys)
/* harmony export */ });
/**! 
 * hotkeys-js v3.9.4 
 * A simple micro-library for defining and dispatching keyboard shortcuts. It has no dependencies. 
 * 
 * Copyright (c) 2022 kenny wong <wowohoo@qq.com> 
 * http://jaywcjlove.github.io/hotkeys 
 * Licensed under the MIT license 
 */

var isff = typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase().indexOf('firefox') > 0 : false; // 绑定事件

function addEvent(object, event, method, useCapture) {
  if (object.addEventListener) {
    object.addEventListener(event, method, useCapture);
  } else if (object.attachEvent) {
    object.attachEvent("on".concat(event), function () {
      method(window.event);
    });
  }
} // 修饰键转换成对应的键码


function getMods(modifier, key) {
  var mods = key.slice(0, key.length - 1);

  for (var i = 0; i < mods.length; i++) {
    mods[i] = modifier[mods[i].toLowerCase()];
  }

  return mods;
} // 处理传的key字符串转换成数组


function getKeys(key) {
  if (typeof key !== 'string') key = '';
  key = key.replace(/\s/g, ''); // 匹配任何空白字符,包括空格、制表符、换页符等等

  var keys = key.split(','); // 同时设置多个快捷键，以','分割

  var index = keys.lastIndexOf(''); // 快捷键可能包含','，需特殊处理

  for (; index >= 0;) {
    keys[index - 1] += ',';
    keys.splice(index, 1);
    index = keys.lastIndexOf('');
  }

  return keys;
} // 比较修饰键的数组


function compareArray(a1, a2) {
  var arr1 = a1.length >= a2.length ? a1 : a2;
  var arr2 = a1.length >= a2.length ? a2 : a1;
  var isIndex = true;

  for (var i = 0; i < arr1.length; i++) {
    if (arr2.indexOf(arr1[i]) === -1) isIndex = false;
  }

  return isIndex;
}

var _keyMap = {
  backspace: 8,
  tab: 9,
  clear: 12,
  enter: 13,
  return: 13,
  esc: 27,
  escape: 27,
  space: 32,
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  del: 46,
  delete: 46,
  ins: 45,
  insert: 45,
  home: 36,
  end: 35,
  pageup: 33,
  pagedown: 34,
  capslock: 20,
  num_0: 96,
  num_1: 97,
  num_2: 98,
  num_3: 99,
  num_4: 100,
  num_5: 101,
  num_6: 102,
  num_7: 103,
  num_8: 104,
  num_9: 105,
  num_multiply: 106,
  num_add: 107,
  num_enter: 108,
  num_subtract: 109,
  num_decimal: 110,
  num_divide: 111,
  '⇪': 20,
  ',': 188,
  '.': 190,
  '/': 191,
  '`': 192,
  '-': isff ? 173 : 189,
  '=': isff ? 61 : 187,
  ';': isff ? 59 : 186,
  '\'': 222,
  '[': 219,
  ']': 221,
  '\\': 220
}; // Modifier Keys

var _modifier = {
  // shiftKey
  '⇧': 16,
  shift: 16,
  // altKey
  '⌥': 18,
  alt: 18,
  option: 18,
  // ctrlKey
  '⌃': 17,
  ctrl: 17,
  control: 17,
  // metaKey
  '⌘': 91,
  cmd: 91,
  command: 91
};
var modifierMap = {
  16: 'shiftKey',
  18: 'altKey',
  17: 'ctrlKey',
  91: 'metaKey',
  shiftKey: 16,
  ctrlKey: 17,
  altKey: 18,
  metaKey: 91
};
var _mods = {
  16: false,
  18: false,
  17: false,
  91: false
};
var _handlers = {}; // F1~F12 special key

for (var k = 1; k < 20; k++) {
  _keyMap["f".concat(k)] = 111 + k;
}

var _downKeys = []; // 记录摁下的绑定键

var winListendFocus = false; // window是否已经监听了focus事件

var _scope = 'all'; // 默认热键范围

var elementHasBindEvent = []; // 已绑定事件的节点记录
// 返回键码

var code = function code(x) {
  return _keyMap[x.toLowerCase()] || _modifier[x.toLowerCase()] || x.toUpperCase().charCodeAt(0);
}; // 设置获取当前范围（默认为'所有'）


function setScope(scope) {
  _scope = scope || 'all';
} // 获取当前范围


function getScope() {
  return _scope || 'all';
} // 获取摁下绑定键的键值


function getPressedKeyCodes() {
  return _downKeys.slice(0);
} // 表单控件控件判断 返回 Boolean
// hotkey is effective only when filter return true


function filter(event) {
  var target = event.target || event.srcElement;
  var tagName = target.tagName;
  var flag = true; // ignore: isContentEditable === 'true', <input> and <textarea> when readOnly state is false, <select>

  if (target.isContentEditable || (tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT') && !target.readOnly) {
    flag = false;
  }

  return flag;
} // 判断摁下的键是否为某个键，返回true或者false


function isPressed(keyCode) {
  if (typeof keyCode === 'string') {
    keyCode = code(keyCode); // 转换成键码
  }

  return _downKeys.indexOf(keyCode) !== -1;
} // 循环删除handlers中的所有 scope(范围)


function deleteScope(scope, newScope) {
  var handlers;
  var i; // 没有指定scope，获取scope

  if (!scope) scope = getScope();

  for (var key in _handlers) {
    if (Object.prototype.hasOwnProperty.call(_handlers, key)) {
      handlers = _handlers[key];

      for (i = 0; i < handlers.length;) {
        if (handlers[i].scope === scope) handlers.splice(i, 1);else i++;
      }
    }
  } // 如果scope被删除，将scope重置为all


  if (getScope() === scope) setScope(newScope || 'all');
} // 清除修饰键


function clearModifier(event) {
  var key = event.keyCode || event.which || event.charCode;

  var i = _downKeys.indexOf(key); // 从列表中清除按压过的键


  if (i >= 0) {
    _downKeys.splice(i, 1);
  } // 特殊处理 cmmand 键，在 cmmand 组合快捷键 keyup 只执行一次的问题


  if (event.key && event.key.toLowerCase() === 'meta') {
    _downKeys.splice(0, _downKeys.length);
  } // 修饰键 shiftKey altKey ctrlKey (command||metaKey) 清除


  if (key === 93 || key === 224) key = 91;

  if (key in _mods) {
    _mods[key] = false; // 将修饰键重置为false

    for (var k in _modifier) {
      if (_modifier[k] === key) hotkeys[k] = false;
    }
  }
}

function unbind(keysInfo) {
  // unbind(), unbind all keys
  if (typeof keysInfo === 'undefined') {
    Object.keys(_handlers).forEach(function (key) {
      return delete _handlers[key];
    });
  } else if (Array.isArray(keysInfo)) {
    // support like : unbind([{key: 'ctrl+a', scope: 's1'}, {key: 'ctrl-a', scope: 's2', splitKey: '-'}])
    keysInfo.forEach(function (info) {
      if (info.key) eachUnbind(info);
    });
  } else if (typeof keysInfo === 'object') {
    // support like unbind({key: 'ctrl+a, ctrl+b', scope:'abc'})
    if (keysInfo.key) eachUnbind(keysInfo);
  } else if (typeof keysInfo === 'string') {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    // support old method
    // eslint-disable-line
    var scope = args[0],
        method = args[1];

    if (typeof scope === 'function') {
      method = scope;
      scope = '';
    }

    eachUnbind({
      key: keysInfo,
      scope: scope,
      method: method,
      splitKey: '+'
    });
  }
} // 解除绑定某个范围的快捷键


var eachUnbind = function eachUnbind(_ref) {
  var key = _ref.key,
      scope = _ref.scope,
      method = _ref.method,
      _ref$splitKey = _ref.splitKey,
      splitKey = _ref$splitKey === void 0 ? '+' : _ref$splitKey;
  var multipleKeys = getKeys(key);
  multipleKeys.forEach(function (originKey) {
    var unbindKeys = originKey.split(splitKey);
    var len = unbindKeys.length;
    var lastKey = unbindKeys[len - 1];
    var keyCode = lastKey === '*' ? '*' : code(lastKey);
    if (!_handlers[keyCode]) return; // 判断是否传入范围，没有就获取范围

    if (!scope) scope = getScope();
    var mods = len > 1 ? getMods(_modifier, unbindKeys) : [];
    _handlers[keyCode] = _handlers[keyCode].filter(function (record) {
      // 通过函数判断，是否解除绑定，函数相等直接返回
      var isMatchingMethod = method ? record.method === method : true;
      return !(isMatchingMethod && record.scope === scope && compareArray(record.mods, mods));
    });
  });
}; // 对监听对应快捷键的回调函数进行处理


function eventHandler(event, handler, scope, element) {
  if (handler.element !== element) {
    return;
  }

  var modifiersMatch; // 看它是否在当前范围

  if (handler.scope === scope || handler.scope === 'all') {
    // 检查是否匹配修饰符（如果有返回true）
    modifiersMatch = handler.mods.length > 0;

    for (var y in _mods) {
      if (Object.prototype.hasOwnProperty.call(_mods, y)) {
        if (!_mods[y] && handler.mods.indexOf(+y) > -1 || _mods[y] && handler.mods.indexOf(+y) === -1) {
          modifiersMatch = false;
        }
      }
    } // 调用处理程序，如果是修饰键不做处理


    if (handler.mods.length === 0 && !_mods[16] && !_mods[18] && !_mods[17] && !_mods[91] || modifiersMatch || handler.shortcut === '*') {
      if (handler.method(event, handler) === false) {
        if (event.preventDefault) event.preventDefault();else event.returnValue = false;
        if (event.stopPropagation) event.stopPropagation();
        if (event.cancelBubble) event.cancelBubble = true;
      }
    }
  }
} // 处理keydown事件


function dispatch(event, element) {
  var asterisk = _handlers['*'];
  var key = event.keyCode || event.which || event.charCode; // 表单控件过滤 默认表单控件不触发快捷键

  if (!hotkeys.filter.call(this, event)) return; // Gecko(Firefox)的command键值224，在Webkit(Chrome)中保持一致
  // Webkit左右 command 键值不一样

  if (key === 93 || key === 224) key = 91;
  /**
   * Collect bound keys
   * If an Input Method Editor is processing key input and the event is keydown, return 229.
   * https://stackoverflow.com/questions/25043934/is-it-ok-to-ignore-keydown-events-with-keycode-229
   * http://lists.w3.org/Archives/Public/www-dom/2010JulSep/att-0182/keyCode-spec.html
   */

  if (_downKeys.indexOf(key) === -1 && key !== 229) _downKeys.push(key);
  /**
   * Jest test cases are required.
   * ===============================
   */

  ['ctrlKey', 'altKey', 'shiftKey', 'metaKey'].forEach(function (keyName) {
    var keyNum = modifierMap[keyName];

    if (event[keyName] && _downKeys.indexOf(keyNum) === -1) {
      _downKeys.push(keyNum);
    } else if (!event[keyName] && _downKeys.indexOf(keyNum) > -1) {
      _downKeys.splice(_downKeys.indexOf(keyNum), 1);
    } else if (keyName === 'metaKey' && event[keyName] && _downKeys.length === 3) {
      /**
       * Fix if Command is pressed:
       * ===============================
       */
      if (!(event.ctrlKey || event.shiftKey || event.altKey)) {
        _downKeys = _downKeys.slice(_downKeys.indexOf(keyNum));
      }
    }
  });
  /**
   * -------------------------------
   */

  if (key in _mods) {
    _mods[key] = true; // 将特殊字符的key注册到 hotkeys 上

    for (var k in _modifier) {
      if (_modifier[k] === key) hotkeys[k] = true;
    }

    if (!asterisk) return;
  } // 将 modifierMap 里面的修饰键绑定到 event 中


  for (var e in _mods) {
    if (Object.prototype.hasOwnProperty.call(_mods, e)) {
      _mods[e] = event[modifierMap[e]];
    }
  }
  /**
   * https://github.com/jaywcjlove/hotkeys/pull/129
   * This solves the issue in Firefox on Windows where hotkeys corresponding to special characters would not trigger.
   * An example of this is ctrl+alt+m on a Swedish keyboard which is used to type μ.
   * Browser support: https://caniuse.com/#feat=keyboardevent-getmodifierstate
   */


  if (event.getModifierState && !(event.altKey && !event.ctrlKey) && event.getModifierState('AltGraph')) {
    if (_downKeys.indexOf(17) === -1) {
      _downKeys.push(17);
    }

    if (_downKeys.indexOf(18) === -1) {
      _downKeys.push(18);
    }

    _mods[17] = true;
    _mods[18] = true;
  } // 获取范围 默认为 `all`


  var scope = getScope(); // 对任何快捷键都需要做的处理

  if (asterisk) {
    for (var i = 0; i < asterisk.length; i++) {
      if (asterisk[i].scope === scope && (event.type === 'keydown' && asterisk[i].keydown || event.type === 'keyup' && asterisk[i].keyup)) {
        eventHandler(event, asterisk[i], scope, element);
      }
    }
  } // key 不在 _handlers 中返回


  if (!(key in _handlers)) return;

  for (var _i = 0; _i < _handlers[key].length; _i++) {
    if (event.type === 'keydown' && _handlers[key][_i].keydown || event.type === 'keyup' && _handlers[key][_i].keyup) {
      if (_handlers[key][_i].key) {
        var record = _handlers[key][_i];
        var splitKey = record.splitKey;
        var keyShortcut = record.key.split(splitKey);
        var _downKeysCurrent = []; // 记录当前按键键值

        for (var a = 0; a < keyShortcut.length; a++) {
          _downKeysCurrent.push(code(keyShortcut[a]));
        }

        if (_downKeysCurrent.sort().join('') === _downKeys.sort().join('')) {
          // 找到处理内容
          eventHandler(event, record, scope, element);
        }
      }
    }
  }
} // 判断 element 是否已经绑定事件


function isElementBind(element) {
  return elementHasBindEvent.indexOf(element) > -1;
}

function hotkeys(key, option, method) {
  _downKeys = [];
  var keys = getKeys(key); // 需要处理的快捷键列表

  var mods = [];
  var scope = 'all'; // scope默认为all，所有范围都有效

  var element = document; // 快捷键事件绑定节点

  var i = 0;
  var keyup = false;
  var keydown = true;
  var splitKey = '+';
  var capture = false; // 对为设定范围的判断

  if (method === undefined && typeof option === 'function') {
    method = option;
  }

  if (Object.prototype.toString.call(option) === '[object Object]') {
    if (option.scope) scope = option.scope; // eslint-disable-line

    if (option.element) element = option.element; // eslint-disable-line

    if (option.keyup) keyup = option.keyup; // eslint-disable-line

    if (option.keydown !== undefined) keydown = option.keydown; // eslint-disable-line

    if (option.capture !== undefined) capture = option.capture; // eslint-disable-line

    if (typeof option.splitKey === 'string') splitKey = option.splitKey; // eslint-disable-line
  }

  if (typeof option === 'string') scope = option; // 对于每个快捷键进行处理

  for (; i < keys.length; i++) {
    key = keys[i].split(splitKey); // 按键列表

    mods = []; // 如果是组合快捷键取得组合快捷键

    if (key.length > 1) mods = getMods(_modifier, key); // 将非修饰键转化为键码

    key = key[key.length - 1];
    key = key === '*' ? '*' : code(key); // *表示匹配所有快捷键
    // 判断key是否在_handlers中，不在就赋一个空数组

    if (!(key in _handlers)) _handlers[key] = [];

    _handlers[key].push({
      keyup: keyup,
      keydown: keydown,
      scope: scope,
      mods: mods,
      shortcut: keys[i],
      method: method,
      key: keys[i],
      splitKey: splitKey,
      element: element
    });
  } // 在全局document上设置快捷键


  if (typeof element !== 'undefined' && !isElementBind(element) && window) {
    elementHasBindEvent.push(element);
    addEvent(element, 'keydown', function (e) {
      dispatch(e, element);
    }, capture);

    if (!winListendFocus) {
      winListendFocus = true;
      addEvent(window, 'focus', function () {
        _downKeys = [];
      }, capture);
    }

    addEvent(element, 'keyup', function (e) {
      dispatch(e, element);
      clearModifier(e);
    }, capture);
  }
}

function trigger(shortcut) {
  var scope = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'all';
  Object.keys(_handlers).forEach(function (key) {
    var data = _handlers[key].find(function (item) {
      return item.scope === scope && item.shortcut === shortcut;
    });

    if (data && data.method) {
      data.method();
    }
  });
}

var _api = {
  setScope: setScope,
  getScope: getScope,
  deleteScope: deleteScope,
  getPressedKeyCodes: getPressedKeyCodes,
  isPressed: isPressed,
  filter: filter,
  trigger: trigger,
  unbind: unbind,
  keyMap: _keyMap,
  modifier: _modifier,
  modifierMap: modifierMap
};

for (var a in _api) {
  if (Object.prototype.hasOwnProperty.call(_api, a)) {
    hotkeys[a] = _api[a];
  }
}

if (typeof window !== 'undefined') {
  var _hotkeys = window.hotkeys;

  hotkeys.noConflict = function (deep) {
    if (deep && window.hotkeys === hotkeys) {
      window.hotkeys = _hotkeys;
    }

    return hotkeys;
  };

  window.hotkeys = hotkeys;
}




/***/ }),

/***/ "./src/css/app.css":
/*!*************************!*\
  !*** ./src/css/app.css ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/stimulus-notification/dist/stimulus-notification.es.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/stimulus-notification/dist/stimulus-notification.es.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ src_default)
/* harmony export */ });
/* harmony import */ var _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @hotwired/stimulus */ "./node_modules/@hotwired/stimulus/dist/stimulus.js");
/* harmony import */ var stimulus_use__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! stimulus-use */ "./node_modules/stimulus-use/dist/index.js");


class src_default extends _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__.Controller {
  initialize() {
    this.hide = this.hide.bind(this);
  }
  connect() {
    (0,stimulus_use__WEBPACK_IMPORTED_MODULE_1__.useTransition)(this);
    this.enter();
    this.timeout = setTimeout(this.hide, this.delayValue);
  }
  async hide() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    await this.leave();
    this.element.remove();
  }
}
src_default.values = {
  delay: {
    type: Number,
    default: 3e3
  }
};



/***/ }),

/***/ "./node_modules/stimulus-use/dist/index.js":
/*!*************************************************!*\
  !*** ./node_modules/stimulus-use/dist/index.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ApplicationController": () => (/* binding */ ApplicationController),
/* harmony export */   "ClickOutsideController": () => (/* binding */ ClickOutsideController),
/* harmony export */   "HoverController": () => (/* binding */ HoverController),
/* harmony export */   "IdleController": () => (/* binding */ IdleController),
/* harmony export */   "IntersectionController": () => (/* binding */ IntersectionController),
/* harmony export */   "LazyLoadController": () => (/* binding */ LazyLoadController),
/* harmony export */   "MutationController": () => (/* binding */ MutationController),
/* harmony export */   "ResizeController": () => (/* binding */ ResizeController),
/* harmony export */   "TargetMutationController": () => (/* binding */ TargetMutationController),
/* harmony export */   "TransitionController": () => (/* binding */ TransitionController),
/* harmony export */   "UseHover": () => (/* binding */ UseHover),
/* harmony export */   "UseMutation": () => (/* binding */ UseMutation),
/* harmony export */   "UseTargetMutation": () => (/* binding */ UseTargetMutation),
/* harmony export */   "UseVisibility": () => (/* binding */ UseVisibility),
/* harmony export */   "VisibilityController": () => (/* binding */ VisibilityController),
/* harmony export */   "WindowFocusController": () => (/* binding */ WindowFocusController),
/* harmony export */   "WindowResizeController": () => (/* binding */ WindowResizeController),
/* harmony export */   "useApplication": () => (/* binding */ useApplication),
/* harmony export */   "useClickOutside": () => (/* binding */ useClickOutside),
/* harmony export */   "useDebounce": () => (/* binding */ useDebounce),
/* harmony export */   "useDispatch": () => (/* binding */ useDispatch),
/* harmony export */   "useHotkeys": () => (/* binding */ useHotkeys),
/* harmony export */   "useHover": () => (/* binding */ useHover),
/* harmony export */   "useIdle": () => (/* binding */ useIdle),
/* harmony export */   "useIntersection": () => (/* binding */ useIntersection),
/* harmony export */   "useLazyLoad": () => (/* binding */ useLazyLoad),
/* harmony export */   "useMatchMedia": () => (/* binding */ useMatchMedia),
/* harmony export */   "useMemo": () => (/* binding */ useMemo),
/* harmony export */   "useMeta": () => (/* binding */ useMeta),
/* harmony export */   "useMutation": () => (/* binding */ useMutation),
/* harmony export */   "useResize": () => (/* binding */ useResize),
/* harmony export */   "useTargetMutation": () => (/* binding */ useTargetMutation),
/* harmony export */   "useThrottle": () => (/* binding */ useThrottle),
/* harmony export */   "useTransition": () => (/* binding */ useTransition),
/* harmony export */   "useVisibility": () => (/* binding */ useVisibility),
/* harmony export */   "useWindowFocus": () => (/* binding */ useWindowFocus),
/* harmony export */   "useWindowResize": () => (/* binding */ useWindowResize)
/* harmony export */ });
/* harmony import */ var _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @hotwired/stimulus */ "./node_modules/@hotwired/stimulus/dist/stimulus.js");
/* harmony import */ var hotkeys_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! hotkeys-js */ "./node_modules/hotkeys-js/dist/hotkeys.esm.js");
/*
Stimulus-Use 0.50.0-2
*/



const method = (controller, methodName) => {
    const method = controller[methodName];
    if (typeof method == 'function') {
        return method;
    }
    else {
        return (...args) => { };
    }
};
const composeEventName = (name, controller, eventPrefix) => {
    let composedName = name;
    if (eventPrefix === true) {
        composedName = `${controller.identifier}:${name}`;
    }
    else if (typeof eventPrefix === 'string') {
        composedName = `${eventPrefix}:${name}`;
    }
    return composedName;
};
const extendedEvent = (type, event, detail) => {
    const { bubbles, cancelable, composed } = event || { bubbles: true, cancelable: true, composed: true };
    if (event) {
        Object.assign(detail, { originalEvent: event });
    }
    const customEvent = new CustomEvent(type, {
        bubbles,
        cancelable,
        composed,
        detail
    });
    return customEvent;
};
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    const vertInView = rect.top <= windowHeight && rect.top + rect.height >= 0;
    const horInView = rect.left <= windowWidth && rect.left + rect.width >= 0;
    return vertInView && horInView;
}
function camelize(value) {
    return value.replace(/(?:[_-])([a-z0-9])/g, (_, char) => char.toUpperCase());
}

const defaultOptions$7 = {
    dispatchEvent: true,
    eventPrefix: true
};
const useIntersection = (controller, options = {}) => {
    const { dispatchEvent, eventPrefix } = Object.assign({}, defaultOptions$7, options);
    const targetElement = (options === null || options === void 0 ? void 0 : options.element) || controller.element;
    const callback = (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
            dispatchAppear(entry);
        }
        else if (controller.isVisible) {
            dispatchDisappear(entry);
        }
    };
    const dispatchAppear = (entry) => {
        controller.isVisible = true;
        method(controller, 'appear').call(controller, entry);
        if (dispatchEvent) {
            const eventName = composeEventName('appear', controller, eventPrefix);
            const appearEvent = extendedEvent(eventName, null, { controller, entry });
            targetElement.dispatchEvent(appearEvent);
        }
    };
    const dispatchDisappear = (entry) => {
        controller.isVisible = false;
        method(controller, 'disappear').call(controller, entry);
        if (dispatchEvent) {
            const eventName = composeEventName('disappear', controller, eventPrefix);
            const disappearEvent = extendedEvent(eventName, null, { controller, entry });
            targetElement.dispatchEvent(disappearEvent);
        }
    };
    const controllerDisconnect = controller.disconnect.bind(controller);
    const observer = new IntersectionObserver(callback, options);
    const observe = () => {
        observer.observe(targetElement);
    };
    const unobserve = () => {
        observer.unobserve(targetElement);
    };
    Object.assign(controller, {
        isVisible: false,
        disconnect() {
            unobserve();
            controllerDisconnect();
        }
    });
    observe();
    return [observe, unobserve];
};

class IntersectionComposableController extends _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__.Controller {
    constructor() {
        super(...arguments);
        this.isVisible = false;
    }
}
class IntersectionController extends IntersectionComposableController {
    constructor(context) {
        super(context);
        requestAnimationFrame(() => {
            const [observe, unobserve] = useIntersection(this, this.options);
            Object.assign(this, { observe, unobserve });
        });
    }
}

const useLazyLoad = (controller, options) => {
    const callback = (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !controller.isLoaded) {
            handleAppear();
        }
    };
    const handleAppear = (entry) => {
        const src = controller.data.get('src');
        if (!src)
            return;
        const imageElement = controller.element;
        controller.isLoading = true;
        method(controller, 'loading').call(controller, src);
        imageElement.onload = () => {
            handleLoaded(src);
        };
        imageElement.src = src;
    };
    const handleLoaded = (src) => {
        controller.isLoading = false;
        controller.isLoaded = true;
        method(controller, 'loaded').call(controller, src);
    };
    const controllerDisconnect = controller.disconnect.bind(controller);
    const observer = new IntersectionObserver(callback, options);
    const observe = () => {
        observer.observe(controller.element);
    };
    const unobserve = () => {
        observer.unobserve(controller.element);
    };
    Object.assign(controller, {
        isVisible: false,
        disconnect() {
            unobserve();
            controllerDisconnect();
        }
    });
    observe();
    return [observe, unobserve];
};

class LazyLoadComposableController extends _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__.Controller {
    constructor() {
        super(...arguments);
        this.isLoading = false;
        this.isLoaded = false;
    }
}
class LazyLoadController extends LazyLoadComposableController {
    constructor(context) {
        super(context);
        this.options = { rootMargin: '10%' };
        requestAnimationFrame(() => {
            const [observe, unobserve] = useLazyLoad(this, this.options);
            Object.assign(this, { observe, unobserve });
        });
    }
}

const defaultOptions$6 = {
    dispatchEvent: true,
    eventPrefix: true
};
const useResize = (controller, options = {}) => {
    const { dispatchEvent, eventPrefix } = Object.assign({}, defaultOptions$6, options);
    const targetElement = (options === null || options === void 0 ? void 0 : options.element) || controller.element;
    const callback = (entries) => {
        const [entry] = entries;
        method(controller, 'resize').call(controller, entry.contentRect);
        if (dispatchEvent) {
            const eventName = composeEventName('resize', controller, eventPrefix);
            const appearEvent = extendedEvent(eventName, null, {
                controller,
                entry
            });
            targetElement.dispatchEvent(appearEvent);
        }
    };
    const controllerDisconnect = controller.disconnect.bind(controller);
    const observer = new ResizeObserver(callback);
    const observe = () => {
        observer.observe(targetElement);
    };
    const unobserve = () => {
        observer.unobserve(targetElement);
    };
    Object.assign(controller, {
        disconnect() {
            unobserve();
            controllerDisconnect();
        }
    });
    observe();
    return [observe, unobserve];
};

class ResizeComposableController extends _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__.Controller {
}
class ResizeController extends ResizeComposableController {
    constructor(context) {
        super(context);
        requestAnimationFrame(() => {
            const [observe, unobserve] = useResize(this, this.options);
            Object.assign(this, { observe, unobserve });
        });
    }
}

const defaultOptions$5 = {
    events: ['click', 'touchend'],
    onlyVisible: true,
    dispatchEvent: true,
    eventPrefix: true
};
const useClickOutside = (controller, options = {}) => {
    const { onlyVisible, dispatchEvent, events, eventPrefix } = Object.assign({}, defaultOptions$5, options);
    const onEvent = (event) => {
        const targetElement = (options === null || options === void 0 ? void 0 : options.element) || controller.element;
        if (targetElement.contains(event.target) || (!isElementInViewport(targetElement) && onlyVisible)) {
            return;
        }
        if (controller.clickOutside) {
            controller.clickOutside(event);
        }
        if (dispatchEvent) {
            const eventName = composeEventName('click:outside', controller, eventPrefix);
            const clickOutsideEvent = extendedEvent(eventName, event, { controller });
            targetElement.dispatchEvent(clickOutsideEvent);
        }
    };
    const observe = () => {
        events === null || events === void 0 ? void 0 : events.forEach(event => {
            window.addEventListener(event, onEvent, false);
        });
    };
    const unobserve = () => {
        events === null || events === void 0 ? void 0 : events.forEach(event => {
            window.removeEventListener(event, onEvent, false);
        });
    };
    const controllerDisconnect = controller.disconnect.bind(controller);
    Object.assign(controller, {
        disconnect() {
            unobserve();
            controllerDisconnect();
        }
    });
    observe();
    return [observe, unobserve];
};

class ClickOutsideComposableController extends _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__.Controller {
}
class ClickOutsideController extends ClickOutsideComposableController {
    constructor(context) {
        super(context);
        requestAnimationFrame(() => {
            const [observe, unobserve] = useClickOutside(this, this.options);
            Object.assign(this, { observe, unobserve });
        });
    }
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

const defaultOptions$4 = {
    debug: false,
    logger: console,
    dispatchEvent: true,
    eventPrefix: true
};
class StimulusUse {
    constructor(controller, options = {}) {
        var _a, _b, _c;
        this.log = (functionName, args) => {
            if (!this.debug)
                return;
            this.logger.groupCollapsed(`%c${this.controller.identifier} %c#${functionName}`, 'color: #3B82F6', 'color: unset');
            this.logger.log(Object.assign({ controllerId: this.controllerId }, args));
            this.logger.groupEnd();
        };
        this.dispatch = (eventName, details = {}) => {
            if (this.dispatchEvent) {
                const { event } = details, eventDetails = __rest(details, ["event"]);
                const customEvent = this.extendedEvent(eventName, event || null, eventDetails);
                this.targetElement.dispatchEvent(customEvent);
                this.log('dispatchEvent', Object.assign({ eventName: customEvent.type }, eventDetails));
            }
        };
        this.call = (methodName, args = {}) => {
            const method = this.controller[methodName];
            if (typeof method == 'function') {
                return method.call(this.controller, args);
            }
        };
        this.extendedEvent = (name, event, detail) => {
            const { bubbles, cancelable, composed } = event || { bubbles: true, cancelable: true, composed: true };
            if (event) {
                Object.assign(detail, { originalEvent: event });
            }
            const customEvent = new CustomEvent(this.composeEventName(name), {
                bubbles,
                cancelable,
                composed,
                detail
            });
            return customEvent;
        };
        this.composeEventName = (name) => {
            let composedName = name;
            if (this.eventPrefix === true) {
                composedName = `${this.controller.identifier}:${name}`;
            }
            else if (typeof this.eventPrefix === 'string') {
                composedName = `${this.eventPrefix}:${name}`;
            }
            return composedName;
        };
        this.debug = (_b = (_a = options === null || options === void 0 ? void 0 : options.debug) !== null && _a !== void 0 ? _a : controller.application.stimulusUseDebug) !== null && _b !== void 0 ? _b : defaultOptions$4.debug;
        this.logger = (_c = options === null || options === void 0 ? void 0 : options.logger) !== null && _c !== void 0 ? _c : defaultOptions$4.logger;
        this.controller = controller;
        this.controllerId = controller.element.id || controller.element.dataset.id;
        this.targetElement = (options === null || options === void 0 ? void 0 : options.element) || controller.element;
        const { dispatchEvent, eventPrefix } = Object.assign({}, defaultOptions$4, options);
        Object.assign(this, { dispatchEvent, eventPrefix });
        this.controllerInitialize = controller.initialize.bind(controller);
        this.controllerConnect = controller.connect.bind(controller);
        this.controllerDisconnect = controller.disconnect.bind(controller);
    }
}

const defaultOptions$3 = {
    eventPrefix: true,
    bubbles: true,
    cancelable: true
};
class UseDispatch extends StimulusUse {
    constructor(controller, options = {}) {
        var _a, _b, _c, _d;
        super(controller, options);
        this.dispatch = (eventName, detail = {}) => {
            const { controller, targetElement, eventPrefix, bubbles, cancelable, log } = this;
            Object.assign(detail, { controller });
            const eventNameWithPrefix = composeEventName(eventName, this.controller, eventPrefix);
            const event = new CustomEvent(eventNameWithPrefix, {
                detail,
                bubbles,
                cancelable
            });
            targetElement.dispatchEvent(event);
            log('dispatch', { eventName: eventNameWithPrefix, detail, bubbles, cancelable });
            return event;
        };
        this.targetElement = (_a = options.element) !== null && _a !== void 0 ? _a : controller.element;
        this.eventPrefix = (_b = options.eventPrefix) !== null && _b !== void 0 ? _b : defaultOptions$3.eventPrefix;
        this.bubbles = (_c = options.bubbles) !== null && _c !== void 0 ? _c : defaultOptions$3.bubbles;
        this.cancelable = (_d = options.cancelable) !== null && _d !== void 0 ? _d : defaultOptions$3.cancelable;
        this.enhanceController();
    }
    enhanceController() {
        Object.assign(this.controller, { dispatch: this.dispatch });
    }
}
const useDispatch = (controller, options = {}) => {
    return new UseDispatch(controller, options);
};

const useApplication = (controller, options = {}) => {
    Object.defineProperty(controller, 'isPreview', {
        get() {
            return (document.documentElement.hasAttribute('data-turbolinks-preview') ||
                document.documentElement.hasAttribute('data-turbo-preview'));
        }
    });
    Object.defineProperty(controller, 'isConnected', {
        get() {
            return !!Array.from(this.context.module.connectedContexts).find(c => c === this.context);
        }
    });
    Object.defineProperty(controller, 'csrfToken', {
        get() {
            return this.metaValue('csrf-token');
        }
    });
    useDispatch(controller, options);
    Object.assign(controller, {
        metaValue(name) {
            const element = document.head.querySelector(`meta[name="${name}"]`);
            return element && element.getAttribute('content');
        }
    });
};

class ApplicationController extends _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__.Controller {
    constructor(context) {
        super(context);
        this.isPreview = false;
        this.isConnected = false;
        this.csrfToken = '';
        useApplication(this, this.options);
    }
}

const defaultEvents = ['mousemove', 'mousedown', 'resize', 'keydown', 'touchstart', 'wheel'];
const oneMinute = 60e3;
const defaultOptions$2 = {
    ms: oneMinute,
    initialState: false,
    events: defaultEvents,
    dispatchEvent: true,
    eventPrefix: true
};
const useIdle = (controller, options = {}) => {
    const { ms, initialState, events, dispatchEvent, eventPrefix } = Object.assign({}, defaultOptions$2, options);
    let isIdle = initialState;
    let timeout = setTimeout(() => {
        isIdle = true;
        dispatchAway();
    }, ms);
    const dispatchAway = (event) => {
        const eventName = composeEventName('away', controller, eventPrefix);
        controller.isIdle = true;
        method(controller, 'away').call(controller, event);
        if (dispatchEvent) {
            const clickOutsideEvent = extendedEvent(eventName, event || null, { controller });
            controller.element.dispatchEvent(clickOutsideEvent);
        }
    };
    const dispatchBack = (event) => {
        const eventName = composeEventName('back', controller, eventPrefix);
        controller.isIdle = false;
        method(controller, 'back').call(controller, event);
        if (dispatchEvent) {
            const clickOutsideEvent = extendedEvent(eventName, event || null, { controller });
            controller.element.dispatchEvent(clickOutsideEvent);
        }
    };
    const onEvent = (event) => {
        if (isIdle)
            dispatchBack(event);
        isIdle = false;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            isIdle = true;
            dispatchAway(event);
        }, ms);
    };
    const onVisibility = (event) => {
        if (!document.hidden)
            onEvent(event);
    };
    if (isIdle) {
        dispatchAway();
    }
    else {
        dispatchBack();
    }
    const controllerDisconnect = controller.disconnect.bind(controller);
    const observe = () => {
        events.forEach(event => {
            window.addEventListener(event, onEvent);
        });
        document.addEventListener('visibilitychange', onVisibility);
    };
    const unobserve = () => {
        clearTimeout(timeout);
        events.forEach(event => {
            window.removeEventListener(event, onEvent);
        });
        document.removeEventListener('visibilitychange', onVisibility);
    };
    Object.assign(controller, {
        disconnect() {
            unobserve();
            controllerDisconnect();
        }
    });
    observe();
    return [observe, unobserve];
};

class IdleComposableController extends _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__.Controller {
    constructor() {
        super(...arguments);
        this.isIdle = false;
    }
}
class IdleController extends IdleComposableController {
    constructor(context) {
        super(context);
        requestAnimationFrame(() => {
            const [observe, unobserve] = useIdle(this, this.options);
            Object.assign(this, { observe, unobserve });
        });
    }
}

class UseVisibility extends StimulusUse {
    constructor(controller, options = {}) {
        super(controller, options);
        this.observe = () => {
            this.controller.isVisible = !document.hidden;
            document.addEventListener('visibilitychange', this.handleVisibilityChange);
            this.handleVisibilityChange();
        };
        this.unobserve = () => {
            document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        };
        this.becomesInvisible = (event) => {
            this.controller.isVisible = false;
            this.call('invisible', event);
            this.log('invisible', { isVisible: false });
            this.dispatch('invisible', { event, isVisible: false });
        };
        this.becomesVisible = (event) => {
            this.controller.isVisible = true;
            this.call('visible', event);
            this.log('visible', { isVisible: true });
            this.dispatch('visible', { event, isVisible: true });
        };
        this.handleVisibilityChange = (event) => {
            if (document.hidden) {
                this.becomesInvisible(event);
            }
            else {
                this.becomesVisible(event);
            }
        };
        this.controller = controller;
        this.enhanceController();
        this.observe();
    }
    enhanceController() {
        const controllerDisconnect = this.controllerDisconnect;
        const disconnect = () => {
            this.unobserve();
            controllerDisconnect();
        };
        Object.assign(this.controller, { disconnect });
    }
}
const useVisibility = (controller, options = {}) => {
    const observer = new UseVisibility(controller, options);
    return [observer.observe, observer.unobserve];
};

class VisibilityComposableController extends _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__.Controller {
    constructor() {
        super(...arguments);
        this.isVisible = false;
    }
}
class VisibilityController extends VisibilityComposableController {
    constructor(context) {
        super(context);
        requestAnimationFrame(() => {
            const [observe, unobserve] = useVisibility(this, this.options);
            Object.assign(this, { observe, unobserve });
        });
    }
}

class UseHover extends StimulusUse {
    constructor(controller, options = {}) {
        super(controller, options);
        this.observe = () => {
            this.targetElement.addEventListener('mouseenter', this.onEnter);
            this.targetElement.addEventListener('mouseleave', this.onLeave);
        };
        this.unobserve = () => {
            this.targetElement.removeEventListener('mouseenter', this.onEnter);
            this.targetElement.removeEventListener('mouseleave', this.onLeave);
        };
        this.onEnter = (event) => {
            this.call('mouseEnter', event);
            this.log('mouseEnter', { hover: true });
            this.dispatch('mouseEnter', { hover: false });
        };
        this.onLeave = (event) => {
            this.call('mouseLeave', event);
            this.log('mouseLeave', { hover: false });
            this.dispatch('mouseLeave', { hover: false });
        };
        this.controller = controller;
        this.enhanceController();
        this.observe();
    }
    enhanceController() {
        const controllerDisconnect = this.controller.disconnect.bind(this.controller);
        const disconnect = () => {
            this.unobserve();
            controllerDisconnect();
        };
        Object.assign(this.controller, { disconnect });
    }
}
const useHover = (controller, options = {}) => {
    const observer = new UseHover(controller, options);
    return [observer.observe, observer.unobserve];
};

class HoverComposableController extends _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__.Controller {
}
class HoverController extends HoverComposableController {
    constructor(context) {
        super(context);
        requestAnimationFrame(() => {
            const [observe, unobserve] = useHover(this, this.options);
            Object.assign(this, { observe, unobserve });
        });
    }
}

class UseMutation extends StimulusUse {
    constructor(controller, options = {}) {
        super(controller, options);
        this.observe = () => {
            try {
                this.observer.observe(this.targetElement, this.options);
            }
            catch (error) {
                this.controller.application.handleError(error, 'At a minimum, one of childList, attributes, and/or characterData must be true', {});
            }
        };
        this.unobserve = () => {
            this.observer.disconnect();
        };
        this.mutation = (entries) => {
            this.call('mutate', entries);
            this.log('mutate', { entries });
            this.dispatch('mutate', { entries });
        };
        this.targetElement = (options === null || options === void 0 ? void 0 : options.element) || controller.element;
        this.controller = controller;
        this.options = options;
        this.observer = new MutationObserver(this.mutation);
        this.enhanceController();
        this.observe();
    }
    enhanceController() {
        const controllerDisconnect = this.controller.disconnect.bind(this.controller);
        const disconnect = () => {
            this.unobserve();
            controllerDisconnect();
        };
        Object.assign(this.controller, { disconnect });
    }
}
const useMutation = (controller, options = {}) => {
    const observer = new UseMutation(controller, options);
    return [observer.observe, observer.unobserve];
};

class MutationComposableController extends _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__.Controller {
}
class MutationController extends MutationComposableController {
    constructor(context) {
        super(context);
        requestAnimationFrame(() => {
            const [observe, unobserve] = useMutation(this, this.options);
            Object.assign(this, { observe, unobserve });
        });
    }
}

class UseTargetMutation extends StimulusUse {
    constructor(controller, options = {}) {
        super(controller, options);
        this.observe = () => {
            this.observer.observe(this.targetElement, {
                subtree: true,
                characterData: true,
                childList: true,
                attributes: true,
                attributeOldValue: true,
                attributeFilter: [this.targetSelector, this.scopedTargetSelector]
            });
        };
        this.unobserve = () => {
            this.observer.disconnect();
        };
        this.mutation = (entries) => {
            for (const mutation of entries) {
                switch (mutation.type) {
                    case 'attributes':
                        let newValue = mutation.target.getAttribute(mutation.attributeName);
                        let oldValue = mutation.oldValue;
                        if (mutation.attributeName === this.targetSelector || mutation.attributeName === this.scopedTargetSelector) {
                            let oldTargets = this.targetsUsedByThisController(oldValue);
                            let newTargets = this.targetsUsedByThisController(newValue);
                            let removedTargets = oldTargets.filter(target => !newTargets.includes(target));
                            let addedTargets = newTargets.filter(target => !oldTargets.includes(target));
                            removedTargets.forEach(target => this.targetRemoved(this.stripIdentifierPrefix(target), mutation.target, 'attributeChange'));
                            addedTargets.forEach(target => this.targetAdded(this.stripIdentifierPrefix(target), mutation.target, 'attributeChange'));
                        }
                        break;
                    case 'characterData':
                        let nodule = this.findTargetInAncestry(mutation.target);
                        if (nodule == null) {
                            return;
                        }
                        else {
                            let supportedTargets = this.targetsUsedByThisControllerFromNode(nodule);
                            supportedTargets.forEach((target) => {
                                this.targetChanged(this.stripIdentifierPrefix(target), nodule, 'domMutation');
                            });
                        }
                        break;
                    case 'childList':
                        let { addedNodes, removedNodes } = mutation;
                        addedNodes.forEach((node) => this.processNodeDOMMutation(node, this.targetAdded));
                        removedNodes.forEach((node) => this.processNodeDOMMutation(node, this.targetRemoved));
                        break;
                }
            }
        };
        this.controller = controller;
        this.options = options;
        this.targetElement = controller.element;
        this.identifier = controller.scope.identifier;
        this.identifierPrefix = `${this.identifier}.`;
        this.targetSelector = controller.scope.schema.targetAttribute;
        this.scopedTargetSelector = `data-${this.identifier}-target`;
        this.targets = options.targets || controller.constructor.targets;
        this.prefixedTargets = this.targets.map(target => `${this.identifierPrefix}${target}`);
        this.observer = new MutationObserver(this.mutation);
        this.enhanceController();
        this.observe();
    }
    processNodeDOMMutation(node, initialChangeModeAssumption) {
        let nodule = node;
        let change = initialChangeModeAssumption;
        let supportedTargets = [];
        if (nodule.nodeName == '#text' || this.targetsUsedByThisControllerFromNode(nodule).length == 0) {
            change = this.targetChanged;
            nodule = this.findTargetInAncestry(node);
        }
        else {
            supportedTargets = this.targetsUsedByThisControllerFromNode(nodule);
        }
        if (nodule == null) {
            return;
        }
        else if (supportedTargets.length == 0) {
            supportedTargets = this.targetsUsedByThisControllerFromNode(nodule);
        }
        supportedTargets.forEach((target) => {
            change.call(this, this.stripIdentifierPrefix(target), nodule, 'domMutation');
        });
    }
    findTargetInAncestry(node) {
        let nodule = node;
        let supportedTargets = [];
        if (nodule.nodeName != '#text') {
            supportedTargets = this.targetsUsedByThisControllerFromNode(nodule);
        }
        while (nodule.parentNode !== null && nodule.parentNode != this.targetElement && supportedTargets.length == 0) {
            nodule = nodule.parentNode;
            if (nodule.nodeName !== '#text') {
                let supportedTargets = this.targetsUsedByThisControllerFromNode(nodule);
                if (supportedTargets.length > 0) {
                    return nodule;
                }
            }
        }
        if (nodule.nodeName == '#text') {
            return null;
        }
        if (nodule.parentNode == null) {
            return null;
        }
        if (nodule.parentNode == this.targetElement) {
            if (this.targetsUsedByThisControllerFromNode(nodule).length > 0) {
                return nodule;
            }
            return null;
        }
        return null;
    }
    targetAdded(name, node, trigger) {
        let targetCallback = `${name}TargetAdded`;
        this.controller[targetCallback] && method(this.controller, targetCallback).call(this.controller, node);
        this.log('targetAdded', { target: name, node, trigger });
    }
    targetRemoved(name, node, trigger) {
        let targetCallback = `${name}TargetRemoved`;
        this.controller[targetCallback] && method(this.controller, targetCallback).call(this.controller, node);
        this.log('targetRemoved', { target: name, node, trigger });
    }
    targetChanged(name, node, trigger) {
        let targetCallback = `${name}TargetChanged`;
        this.controller[targetCallback] && method(this.controller, targetCallback).call(this.controller, node);
        this.log('targetChanged', { target: name, node, trigger });
    }
    targetsUsedByThisControllerFromNode(node) {
        if (node.nodeName == '#text' || node.nodeName == '#comment') {
            return [];
        }
        let nodeElement = node;
        return this.targetsUsedByThisController(nodeElement.getAttribute(this.scopedTargetSelector) || nodeElement.getAttribute(this.targetSelector));
    }
    targetsUsedByThisController(targetStr) {
        targetStr = targetStr || '';
        let targetsToCheck = this.stripIdentifierPrefix(targetStr).split(' ');
        return this.targets.filter(n => targetsToCheck.indexOf(n) !== -1);
    }
    stripIdentifierPrefix(target) {
        return target.replace(new RegExp(this.identifierPrefix, 'g'), '');
    }
    enhanceController() {
        const controllerDisconnect = this.controller.disconnect.bind(this.controller);
        const disconnect = () => {
            this.unobserve();
            controllerDisconnect();
        };
        Object.assign(this.controller, { disconnect });
    }
}
const useTargetMutation = (controller, options = {}) => {
    const observer = new UseTargetMutation(controller, options);
    return [observer.observe, observer.unobserve];
};

class TargetMutationComposableController extends _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__.Controller {
}
class TargetMutationController extends TargetMutationComposableController {
    constructor(context) {
        super(context);
        requestAnimationFrame(() => {
            const [observe, unobserve] = useTargetMutation(this, this.options);
            Object.assign(this, { observe, unobserve });
        });
    }
}

const useWindowResize = (controller) => {
    const callback = (event) => {
        const { innerWidth, innerHeight } = window;
        const payload = {
            height: innerHeight || Infinity,
            width: innerWidth || Infinity,
            event
        };
        method(controller, 'windowResize').call(controller, payload);
    };
    const controllerDisconnect = controller.disconnect.bind(controller);
    const observe = () => {
        window.addEventListener('resize', callback);
        callback();
    };
    const unobserve = () => {
        window.removeEventListener('resize', callback);
    };
    Object.assign(controller, {
        disconnect() {
            unobserve();
            controllerDisconnect();
        }
    });
    observe();
    return [observe, unobserve];
};

class WindowResizeComposableController extends _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__.Controller {
}
class WindowResizeController extends WindowResizeComposableController {
    constructor(context) {
        super(context);
        requestAnimationFrame(() => {
            const [observe, unobserve] = useWindowResize(this);
            Object.assign(this, { observe, unobserve });
        });
    }
}

const memoize = (controller, name, value) => {
    Object.defineProperty(controller, name, { value });
    return value;
};
const useMemo = (controller) => {
    var _a;
    (_a = controller.constructor.memos) === null || _a === void 0 ? void 0 : _a.forEach((getter) => {
        memoize(controller, getter, controller[getter]);
    });
};

class DebounceController extends _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__.Controller {
}
DebounceController.debounces = [];
const defaultWait$1 = 200;
const debounce = (fn, wait = defaultWait$1) => {
    let timeoutId = null;
    return function () {
        const args = arguments;
        const context = this;
        const callback = () => fn.apply(context, args);
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(callback, wait);
    };
};
const useDebounce = (controller, options) => {
    var _a;
    const constructor = controller.constructor;
    (_a = constructor.debounces) === null || _a === void 0 ? void 0 : _a.forEach((func) => {
        if (typeof func === 'string') {
            controller[func] = debounce(controller[func], options === null || options === void 0 ? void 0 : options.wait);
        }
        if (typeof func === 'object') {
            const { name, wait } = func;
            if (!name)
                return;
            controller[name] = debounce(controller[name], wait || (options === null || options === void 0 ? void 0 : options.wait));
        }
    });
};

class ThrottleController extends _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__.Controller {
}
ThrottleController.throttles = [];
const defaultWait = 200;
function throttle(func, wait = defaultWait) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            inThrottle = true;
            func.apply(context, args);
            setTimeout(() => (inThrottle = false), wait);
        }
    };
}
const useThrottle = (controller, options = {}) => {
    var _a;
    const constructor = controller.constructor;
    (_a = constructor.throttles) === null || _a === void 0 ? void 0 : _a.forEach((func) => {
        if (typeof func === 'string') {
            controller[func] = throttle(controller[func], options === null || options === void 0 ? void 0 : options.wait);
        }
        if (typeof func === 'object') {
            const { name, wait } = func;
            if (!name)
                return;
            controller[name] = throttle(controller[name], wait || (options === null || options === void 0 ? void 0 : options.wait));
        }
    });
};

const defineMetaGetter = (controller, metaName, suffix) => {
    const getterName = suffix ? `${camelize(metaName)}Meta` : camelize(metaName);
    Object.defineProperty(controller, getterName, {
        get() {
            return typeCast(metaValue(metaName));
        }
    });
};
function metaValue(name) {
    const element = document.head.querySelector(`meta[name="${name}"]`);
    return element && element.getAttribute('content');
}
function typeCast(value) {
    try {
        return JSON.parse(value);
    }
    catch (o_O) {
        return value;
    }
}
const useMeta = (controller, options = { suffix: true }) => {
    const metaNames = controller.constructor.metaNames;
    const suffix = options.suffix;
    metaNames === null || metaNames === void 0 ? void 0 : metaNames.forEach((metaName) => {
        defineMetaGetter(controller, metaName, suffix);
    });
    Object.defineProperty(controller, 'metas', {
        get() {
            const result = {};
            metaNames === null || metaNames === void 0 ? void 0 : metaNames.forEach((metaName) => {
                const value = typeCast(metaValue(metaName));
                if (value !== undefined && value !== null) {
                    result[camelize(metaName)] = value;
                }
            });
            return result;
        }
    });
};

const alpineNames = {
    enterFromClass: 'enter',
    enterActiveClass: 'enterStart',
    enterToClass: 'enterEnd',
    leaveFromClass: 'leave',
    leaveActiveClass: 'leaveStart',
    leaveToClass: 'leaveEnd'
};
const defaultOptions$1 = {
    transitioned: false,
    hiddenClass: 'hidden',
    preserveOriginalClass: true,
    removeToClasses: true
};
const useTransition = (controller, options = {}) => {
    var _a, _b, _c;
    const targetName = controller.element.dataset.transitionTarget;
    let targetFromAttribute;
    if (targetName) {
        targetFromAttribute = controller[`${targetName}Target`];
    }
    const targetElement = (options === null || options === void 0 ? void 0 : options.element) || targetFromAttribute || controller.element;
    if (!(targetElement instanceof HTMLElement || targetElement instanceof SVGElement))
        return;
    const dataset = targetElement.dataset;
    const leaveAfter = parseInt(dataset.leaveAfter || '') || options.leaveAfter || 0;
    const { transitioned, hiddenClass, preserveOriginalClass, removeToClasses } = Object.assign(defaultOptions$1, options);
    const controllerEnter = (_a = controller.enter) === null || _a === void 0 ? void 0 : _a.bind(controller);
    const controllerLeave = (_b = controller.leave) === null || _b === void 0 ? void 0 : _b.bind(controller);
    const controllerToggleTransition = (_c = controller.toggleTransition) === null || _c === void 0 ? void 0 : _c.bind(controller);
    async function enter(event) {
        if (controller.transitioned)
            return;
        controller.transitioned = true;
        controllerEnter && controllerEnter(event);
        const enterFromClasses = getAttribute('enterFrom', options, dataset);
        const enterActiveClasses = getAttribute('enterActive', options, dataset);
        const enterToClasses = getAttribute('enterTo', options, dataset);
        const leaveToClasses = getAttribute('leaveTo', options, dataset);
        if (!!hiddenClass) {
            targetElement.classList.remove(hiddenClass);
        }
        if (!removeToClasses) {
            removeClasses(targetElement, leaveToClasses);
        }
        await transition(targetElement, enterFromClasses, enterActiveClasses, enterToClasses, hiddenClass, preserveOriginalClass, removeToClasses);
        if (leaveAfter > 0) {
            setTimeout(() => {
                leave(event);
            }, leaveAfter);
        }
    }
    async function leave(event) {
        if (!controller.transitioned)
            return;
        controller.transitioned = false;
        controllerLeave && controllerLeave(event);
        const leaveFromClasses = getAttribute('leaveFrom', options, dataset);
        const leaveActiveClasses = getAttribute('leaveActive', options, dataset);
        const leaveToClasses = getAttribute('leaveTo', options, dataset);
        const enterToClasses = getAttribute('enterTo', options, dataset);
        if (!removeToClasses) {
            removeClasses(targetElement, enterToClasses);
        }
        await transition(targetElement, leaveFromClasses, leaveActiveClasses, leaveToClasses, hiddenClass, preserveOriginalClass, removeToClasses);
        if (!!hiddenClass) {
            targetElement.classList.add(hiddenClass);
        }
    }
    function toggleTransition(event) {
        controllerToggleTransition && controllerToggleTransition(event);
        if (controller.transitioned) {
            leave();
        }
        else {
            enter();
        }
    }
    async function transition(element, initialClasses, activeClasses, endClasses, hiddenClass, preserveOriginalClass, removeEndClasses) {
        const stashedClasses = [];
        if (preserveOriginalClass) {
            initialClasses.forEach(cls => element.classList.contains(cls) && cls !== hiddenClass && stashedClasses.push(cls));
            activeClasses.forEach(cls => element.classList.contains(cls) && cls !== hiddenClass && stashedClasses.push(cls));
            endClasses.forEach(cls => element.classList.contains(cls) && cls !== hiddenClass && stashedClasses.push(cls));
        }
        addClasses(element, initialClasses);
        removeClasses(element, stashedClasses);
        addClasses(element, activeClasses);
        await nextAnimationFrame();
        removeClasses(element, initialClasses);
        addClasses(element, endClasses);
        await afterTransition(element);
        removeClasses(element, activeClasses);
        if (removeEndClasses) {
            removeClasses(element, endClasses);
        }
        addClasses(element, stashedClasses);
    }
    function initialState() {
        controller.transitioned = transitioned;
        if (transitioned) {
            if (!!hiddenClass) {
                targetElement.classList.remove(hiddenClass);
            }
            enter();
        }
        else {
            if (!!hiddenClass) {
                targetElement.classList.add(hiddenClass);
            }
            leave();
        }
    }
    function addClasses(element, classes) {
        if (classes.length > 0) {
            element.classList.add(...classes);
        }
    }
    function removeClasses(element, classes) {
        if (classes.length > 0) {
            element.classList.remove(...classes);
        }
    }
    initialState();
    Object.assign(controller, { enter, leave, toggleTransition });
    return [enter, leave, toggleTransition];
};
function getAttribute(name, options, dataset) {
    const datasetName = `transition${name[0].toUpperCase()}${name.substr(1)}`;
    const datasetAlpineName = alpineNames[name];
    const classes = options[name] || dataset[datasetName] || dataset[datasetAlpineName] || ' ';
    return isEmpty(classes) ? [] : classes.split(' ');
}
async function afterTransition(element) {
    return new Promise(resolve => {
        const duration = Number(getComputedStyle(element).transitionDuration.split(',')[0].replace('s', '')) * 1000;
        setTimeout(() => {
            resolve(duration);
        }, duration);
    });
}
async function nextAnimationFrame() {
    return new Promise(resolve => {
        requestAnimationFrame(() => {
            requestAnimationFrame(resolve);
        });
    });
}
function isEmpty(str) {
    return str.length === 0 || !str.trim();
}

class TransitionComposableController extends _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__.Controller {
    constructor() {
        super(...arguments);
        this.transitioned = false;
    }
}
class TransitionController extends TransitionComposableController {
    constructor(context) {
        super(context);
        requestAnimationFrame(() => {
            useTransition(this, this.options);
        });
    }
}

class UseHotkeys extends StimulusUse {
    constructor(controller, hotkeysOptions) {
        super(controller, hotkeysOptions);
        this.bind = () => {
            for (const [hotkey, definition] of Object.entries(this.hotkeysOptions.hotkeys)) {
                const handler = definition.handler.bind(this.controller);
                (0,hotkeys_js__WEBPACK_IMPORTED_MODULE_1__["default"])(hotkey, definition.options, (e) => handler(e, e));
            }
        };
        this.unbind = () => {
            for (const hotkey in this.hotkeysOptions.hotkeys) {
                hotkeys_js__WEBPACK_IMPORTED_MODULE_1__["default"].unbind(hotkey);
            }
        };
        this.controller = controller;
        this.hotkeysOptions = hotkeysOptions;
        this.enhanceController();
        this.bind();
    }
    enhanceController() {
        if (this.hotkeysOptions.filter) {
            hotkeys_js__WEBPACK_IMPORTED_MODULE_1__["default"].filter = this.hotkeysOptions.filter;
        }
        const controllerDisconnect = this.controller.disconnect.bind(this.controller);
        const disconnect = () => {
            this.unbind();
            controllerDisconnect();
        };
        Object.assign(this.controller, { disconnect });
    }
}
const convertSimpleHotkeyDefinition = (definition) => {
    return {
        handler: definition[0],
        options: {
            element: definition[1]
        }
    };
};
const coerceOptions = (options) => {
    if (!options.hotkeys) {
        const hotkeys = {};
        Object.entries(options).forEach(([hotkey, definition]) => {
            Object.defineProperty(hotkeys, hotkey, {
                value: convertSimpleHotkeyDefinition(definition),
                writable: false,
                enumerable: true
            });
        });
        options = {
            hotkeys
        };
    }
    return options;
};
const useHotkeys = (controller, options) => {
    return new UseHotkeys(controller, coerceOptions(options));
};

const defaultOptions = {
    mediaQueries: {},
    dispatchEvent: true,
    eventPrefix: true,
    debug: false
};
class UseMatchMedia extends StimulusUse {
    constructor(controller, options = {}) {
        var _a, _b, _c, _d;
        super(controller, options);
        this.matches = [];
        this.callback = (event) => {
            const name = Object.keys(this.mediaQueries).find(name => this.mediaQueries[name] === event.media);
            if (!name)
                return;
            const { media, matches } = event;
            this.changed({ name, media, matches, event });
        };
        this.changed = (payload) => {
            const { name } = payload;
            if (payload.event) {
                this.call(camelize(`${name}_changed`), payload);
                this.dispatch(`${name}:changed`, payload);
                this.log(`media query "${name}" changed`, payload);
            }
            if (payload.matches) {
                this.call(camelize(`is_${name}`), payload);
                this.dispatch(`is:${name}`, payload);
            }
            else {
                this.call(camelize(`not_${name}`), payload);
                this.dispatch(`not:${name}`, payload);
            }
        };
        this.observe = () => {
            Object.keys(this.mediaQueries).forEach(name => {
                const media = this.mediaQueries[name];
                const match = window.matchMedia(media);
                match.addListener(this.callback);
                this.matches.push(match);
                this.changed({ name, media, matches: match.matches });
            });
        };
        this.unobserve = () => {
            this.matches.forEach(match => match.removeListener(this.callback));
        };
        this.controller = controller;
        this.mediaQueries = (_a = options.mediaQueries) !== null && _a !== void 0 ? _a : defaultOptions.mediaQueries;
        this.dispatchEvent = (_b = options.dispatchEvent) !== null && _b !== void 0 ? _b : defaultOptions.dispatchEvent;
        this.eventPrefix = (_c = options.eventPrefix) !== null && _c !== void 0 ? _c : defaultOptions.eventPrefix;
        this.debug = (_d = options.debug) !== null && _d !== void 0 ? _d : defaultOptions.debug;
        if (!window.matchMedia) {
            console.error('window.matchMedia() is not available');
            return;
        }
        this.enhanceController();
        this.observe();
    }
    enhanceController() {
        const controllerDisconnect = this.controller.disconnect.bind(this.controller);
        const disconnect = () => {
            this.unobserve();
            controllerDisconnect();
        };
        Object.assign(this.controller, { disconnect });
    }
}
const useMatchMedia = (controller, options = {}) => {
    const observer = new UseMatchMedia(controller, options);
    return [observer.observe, observer.unobserve];
};

class UseWindowFocus extends StimulusUse {
    constructor(controller, options = {}) {
        super(controller, options);
        this.observe = () => {
            if (document.hasFocus()) {
                this.becomesFocused();
            }
            else {
                console.log('i should be there');
                this.becomesUnfocused();
            }
            this.interval = setInterval(() => {
                this.handleWindowFocusChange();
            }, this.intervalDuration);
        };
        this.unobserve = () => {
            clearInterval(this.interval);
        };
        this.becomesUnfocused = (event) => {
            this.controller.hasFocus = false;
            this.call('unfocus', event);
            this.log('unfocus', { hasFocus: false });
            this.dispatch('unfocus', { event, hasFocus: false });
        };
        this.becomesFocused = (event) => {
            this.controller.hasFocus = true;
            this.call('focus', event);
            this.log('focus', { hasFocus: true });
            this.dispatch('focus', { event, hasFocus: true });
        };
        this.handleWindowFocusChange = (event) => {
            if (document.hasFocus() && !this.controller.hasFocus) {
                this.becomesFocused(event);
            }
            else if (!document.hasFocus() && this.controller.hasFocus) {
                this.becomesUnfocused(event);
            }
        };
        this.controller = controller;
        this.intervalDuration = options.interval || 200;
        this.enhanceController();
        this.observe();
    }
    enhanceController() {
        const controllerDisconnect = this.controllerDisconnect;
        const disconnect = () => {
            this.unobserve();
            controllerDisconnect();
        };
        Object.assign(this.controller, { disconnect });
    }
}
const useWindowFocus = (controller, options = {}) => {
    const observer = new UseWindowFocus(controller, options);
    return [observer.observe, observer.unobserve];
};

class WindowFocusComposableController extends _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__.Controller {
    constructor() {
        super(...arguments);
        this.hasFocus = false;
    }
}
class WindowFocusController extends WindowFocusComposableController {
    constructor(context) {
        super(context);
        requestAnimationFrame(() => {
            const [observe, unobserve] = useWindowFocus(this, this.options);
            Object.assign(this, { observe, unobserve });
        });
    }
}




/***/ }),

/***/ "./node_modules/stimulus/dist/stimulus.js":
/*!************************************************!*\
  !*** ./node_modules/stimulus/dist/stimulus.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Application": () => (/* reexport safe */ _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__.Application),
/* harmony export */   "AttributeObserver": () => (/* reexport safe */ _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__.AttributeObserver),
/* harmony export */   "Context": () => (/* reexport safe */ _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__.Context),
/* harmony export */   "Controller": () => (/* reexport safe */ _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__.Controller),
/* harmony export */   "ElementObserver": () => (/* reexport safe */ _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__.ElementObserver),
/* harmony export */   "IndexedMultimap": () => (/* reexport safe */ _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__.IndexedMultimap),
/* harmony export */   "Multimap": () => (/* reexport safe */ _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__.Multimap),
/* harmony export */   "StringMapObserver": () => (/* reexport safe */ _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__.StringMapObserver),
/* harmony export */   "TokenListObserver": () => (/* reexport safe */ _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__.TokenListObserver),
/* harmony export */   "ValueListObserver": () => (/* reexport safe */ _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__.ValueListObserver),
/* harmony export */   "add": () => (/* reexport safe */ _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__.add),
/* harmony export */   "defaultSchema": () => (/* reexport safe */ _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__.defaultSchema),
/* harmony export */   "del": () => (/* reexport safe */ _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__.del),
/* harmony export */   "fetch": () => (/* reexport safe */ _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__.fetch),
/* harmony export */   "prune": () => (/* reexport safe */ _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__.prune)
/* harmony export */ });
/* harmony import */ var _hotwired_stimulus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @hotwired/stimulus */ "./node_modules/@hotwired/stimulus/dist/stimulus.js");
/*
Stimulus 3.0.1
Copyright © 2021 Basecamp, LLC
 */



/***/ }),

/***/ "./node_modules/stimulus/dist/webpack-helpers.js":
/*!*******************************************************!*\
  !*** ./node_modules/stimulus/dist/webpack-helpers.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "definitionForModuleAndIdentifier": () => (/* reexport safe */ _hotwired_stimulus_webpack_helpers__WEBPACK_IMPORTED_MODULE_0__.definitionForModuleAndIdentifier),
/* harmony export */   "definitionForModuleWithContextAndKey": () => (/* reexport safe */ _hotwired_stimulus_webpack_helpers__WEBPACK_IMPORTED_MODULE_0__.definitionForModuleWithContextAndKey),
/* harmony export */   "definitionsFromContext": () => (/* reexport safe */ _hotwired_stimulus_webpack_helpers__WEBPACK_IMPORTED_MODULE_0__.definitionsFromContext),
/* harmony export */   "identifierForContextKey": () => (/* reexport safe */ _hotwired_stimulus_webpack_helpers__WEBPACK_IMPORTED_MODULE_0__.identifierForContextKey)
/* harmony export */ });
/* harmony import */ var _hotwired_stimulus_webpack_helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @hotwired/stimulus-webpack-helpers */ "./node_modules/@hotwired/stimulus-webpack-helpers/dist/stimulus-webpack-helpers.js");
/*
Stimulus 3.0.1
Copyright © 2021 Basecamp, LLC
 */



/***/ }),

/***/ "./src/js/controllers sync recursive \\.js$":
/*!****************************************!*\
  !*** ./src/js/controllers/ sync \.js$ ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./hello_controller.js": "./src/js/controllers/hello_controller.js"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./src/js/controllers sync recursive \\.js$";

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!***********************!*\
  !*** ./src/js/app.js ***!
  \***********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _css_app_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../css/app.css */ "./src/css/app.css");
/* harmony import */ var stimulus__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! stimulus */ "./node_modules/stimulus/dist/stimulus.js");
/* harmony import */ var stimulus_webpack_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! stimulus/webpack-helpers */ "./node_modules/stimulus/dist/webpack-helpers.js");
/* harmony import */ var stimulus_notification__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! stimulus-notification */ "./node_modules/stimulus-notification/dist/stimulus-notification.es.js");
 //import * as Turbo from '@hotwired/turbo'
//import './signalRTurboStreamElement'




var application = stimulus__WEBPACK_IMPORTED_MODULE_1__.Application.start();

var context = __webpack_require__("./src/js/controllers sync recursive \\.js$");

application.load((0,stimulus_webpack_helpers__WEBPACK_IMPORTED_MODULE_2__.definitionsFromContext)(context));
application.register('notification', stimulus_notification__WEBPACK_IMPORTED_MODULE_3__["default"]); // Turns Turbo Drive on/off (default on). 
// If off, we must opt-in to Turbo Drive on a per-link and per-form basis using data-turbo="true".
//Turbo.session.drive = true;
//// Turbo event listeners
//document.addEventListener('turbo:load', function (e) {
//  console.log('turbo:load', e);
//});
//document.addEventListener('turbo:visit', function (e) {
//  console.log('turbo:visit', e);
//});
//document.addEventListener('turbo:frame-load', function (e) {
//  console.log('turbo:frame-load', e);
//});
})();

/******/ })()
;
//# sourceMappingURL=app.js.map