'use strict';

/**
 * @license
 * 
 * (c) Tom Wiesing 2022 - licensed under the Terms of the MIT License, see "LICENSE" file.
 * 
 * Instead of displaying a notification, automatically focus a window when it is "ready".
 * 
 * The idea of this extension is based on https://github.com/kagesenshi/gnome-shell-extension-stealmyfocus.
 * It has been cleanly rewritten using ES2021, and none of the original code is reused.
 */

const Main = imports.ui.main;

// Uncomment the lines below for logging, so that all the log() calls work.
// This should only be done during development, and is not needed for production use.

// const ExtensionUtils = imports.misc.extensionUtils;
// const Me = ExtensionUtils.getCurrentExtension();

class Extension {
    /**
     * handle for the 'window-demands-attention' event handler
     * @type {number|null} 
     */
    #wdaHandle = null;

    /**
     * Enables this extension
     */
    enable() {
        this.#wdaHandle = global.display.connect('window-demands-attention', this.#handleWindowDemandsAttention);
        // log(`${Me.metadata.name}: #wdaHandle=${JSON.stringify(this.#wdaHandle)}`);
    }

    /**
     * Disables this extension
     */
    disable() {
        if (this.#wdaHandle === null) return;
        // log(`${Me.metadata.name}: Removing handle ${this.#wdaHandle}`);
        global.display.disconnect(this.#wdaHandle);
        this.#wdaHandle = null;
    }

    /**
     * Handler that gets called when the 'window-demands-attention' event is triggered.
     * @param {*} display 
     * @param {*} window 
     * @returns 
     */
    #handleWindowDemandsAttention = (display, window) => {
        if(this.#windowIsBlocklisted(window)){
            // log(`${Me.metadata.name}: Skip focusing ${JSON.stringify(window.title)}`);
            return;
        } 

        // log(`${Me.metadata.name}: Focusing ${JSON.stringify(window.title)}`);
        Main.activateWindow(window);
    }

    /**
     * List of window titles that are blocked from being auto-focused.
     * @type {Array<string>}
     */
    #blockList = [];

    /**
     * Checks if the window is blocklisted and focusing it should be skipped.
     * @param {*} window 
     * @returns {boolean}
     */
    #windowIsBlocklisted(window) {
        /** @type {string} */
        const title = window.title.toLowerCase();
        return this.#blockList.some(value => value.toLowerCase().includes(title))
    }
}

/** Enabled this extension */
function init() {
    return new Extension();
}
