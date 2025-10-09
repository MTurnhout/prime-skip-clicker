const optionSkipButtonsDisableName = "option-skip-buttons-disable";
const optionNextEpisodeDisableName = "option-next-episode-disable";

const optionSkipButtonsDisableInput = document.getElementById(
  optionSkipButtonsDisableName
);
const optionNextEpisodeDisableInput = document.getElementById(
  optionNextEpisodeDisableName
);

document.addEventListener("DOMContentLoaded", () => {
  browser.storage.sync
    .get([optionSkipButtonsDisableName, optionNextEpisodeDisableName])
    .then((result) => {
      optionSkipButtonsDisableInput.checked =
        result[optionSkipButtonsDisableName] || false;
      optionNextEpisodeDisableInput.checked =
        result[optionNextEpisodeDisableName] || false;
    });
});

optionSkipButtonsDisableInput.addEventListener("change", () => {
  browser.storage.sync.set({
    [optionSkipButtonsDisableName]: optionSkipButtonsDisableInput.checked,
  });
});
optionNextEpisodeDisableInput.addEventListener("change", () => {
  browser.storage.sync.set({
    [optionNextEpisodeDisableName]: optionNextEpisodeDisableInput.checked,
  });
});
