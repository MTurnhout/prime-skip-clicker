class PrimeSkipClicker {
  static #skipButtonFilter = "button.atvwebplayersdk-skipelement-button";

  #observerHtmlStyle = new MutationObserver(this.#handleSkipButtons.bind(this));

  /**
   * Start observing the document body for skip buttons.
   */
  start() {
    this.#observerHtmlStyle.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  /**
   * Handle mutations to find and process skip buttons.
   * @param {MutationRecord[]} mutationsList
   */
  #handleSkipButtons(mutationsList) {
    for (const mutation of mutationsList) {
      for (const addedNode of mutation.addedNodes) {
        if (addedNode.nodeType !== Node.ELEMENT_NODE) continue;

        if (addedNode.matches(PrimeSkipClicker.#skipButtonFilter)) {
          this.#handleSkipButton(addedNode);
        } else {
          const skipButton = addedNode.querySelector(
            PrimeSkipClicker.#skipButtonFilter
          );
          if (skipButton) {
            this.#handleSkipButton(skipButton);
          }
        }
      }
    }
  }

  /**
   * Click the skip button if it is visible,
   * and set up a listener to click it when it becomes visible.
   * @param {HTMLElement} skipButton
   */
  #handleSkipButton(skipButton) {
    if (skipButton.checkVisibility()) {
      skipButton.click();
    }
    skipButton.addEventListener("visibilitychange", (event) => {
      if (event.target.visibilityState === "visible") {
        skipButton.click();
      }
    });
  }
}

const primeSkipClicker = new PrimeSkipClicker();
primeSkipClicker.start();
