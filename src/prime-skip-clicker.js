class PrimeSkipClicker {
  static #skipButtonsFilter = "button.atvwebplayersdk-skipelement-button";
  static #nextEpisodeButtonFilter = "div.atvwebplayersdk-nextupcard-button";
  static #optionSkipButtonsDisableName = "option-skip-buttons-disable";
  static #optionNextEpisodeDisableName = "option-next-episode-disable";

  static #skipButtonsDisabled = false;
  static #nextEpisodeDisabled = false;

  /** @type {MutationObserver} */
  static #mutationObserver;

  /**
   * Start observing the document body for skip buttons.
   */
  static init() {
    if (this.#mutationObserver) return;
    this.#mutationObserver = new MutationObserver(
      this.#handleMutations.bind(this)
    );

    this.#restoreSettings();

    this.#mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  /**
   * Handle mutations to find and process the buttons.
   * @param {MutationRecord[]} mutationsList
   */
  static #handleMutations(mutationsList) {
    for (const mutation of mutationsList) {
      for (const addedNode of mutation.addedNodes) {
        if (addedNode.nodeType !== Node.ELEMENT_NODE) continue;

        this.#findButton(
          addedNode,
          this.#skipButtonsFilter,
          () => !this.#skipButtonsDisabled
        );
        this.#findButton(
          addedNode,
          this.#nextEpisodeButtonFilter,
          () => !this.#nextEpisodeDisabled
        );
      }
    }
  }

  /**
   * Find a button matching the filter in the node or its children.
   * @param {Node} node
   * @param {string} filter
   * @param {Function} enabledFunction Function that returns true if the button should be clicked.
   */
  static #findButton(node, filter, enabledFunction) {
    if (node.matches(filter)) {
      this.#handleButton(node, enabledFunction);
    } else {
      const button = node.querySelector(filter);
      if (button) {
        this.#handleButton(button, enabledFunction);
      }
    }
  }

  /**
   * Click the skip button if it is visible,
   * and set up a listener to click it when it becomes visible.
   * @param {HTMLElement} skipButton
   * @param {Function} enabledFunction Function that returns true if the button should be clicked.
   */
  static #handleButton(skipButton, enabledFunction) {
    if (skipButton.checkVisibility() && enabledFunction()) {
      skipButton.click();
    }
    skipButton.addEventListener("visibilitychange", (event) => {
      if (event.target.visibilityState === "visible" && enabledFunction()) {
        skipButton.click();
      }
    });
  }

  /**
   * Restore settings from storage and listen for changes.
   */
  static #restoreSettings() {
    browser.storage.sync
      .get([
        this.#optionSkipButtonsDisableName,
        this.#optionNextEpisodeDisableName,
      ])
      .then((result) => {
        this.#skipButtonsDisabled =
          result[this.#optionSkipButtonsDisableName] || false;
        this.#nextEpisodeDisabled =
          result[this.#optionNextEpisodeDisableName] || false;
      });

    browser.storage.onChanged.addListener((changes, area) => {
      if (area !== "sync") return;
      if (this.#optionSkipButtonsDisableName in changes) {
        this.#skipButtonsDisabled =
          changes[this.#optionSkipButtonsDisableName].newValue;
      }
      if (this.#optionNextEpisodeDisableName in changes) {
        this.#nextEpisodeDisabled =
          changes[this.#optionNextEpisodeDisableName].newValue;
      }
    });
  }
}

PrimeSkipClicker.init();
