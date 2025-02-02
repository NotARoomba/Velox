describe('UI', () => {
  beforeAll(async () => {
    await device.launchApp();
    await device.disableSynchronization();
    // await new Promise(resolve => setTimeout(resolve, 8000));
  });

  // beforeEach(async () => {
  //   await device.reloadReactNative();
  // });

  const LanguageCodes =
  ["en"
  , "es"
  , "zh"
  , "fr"
  , "de"
  , "ru"
  , "ja"
  , "ko"];
  for (let i = 0; i < LanguageCodes.length; i++) {
    it(`screenshots_${LanguageCodes[i]}`, async () => {
      await new Promise(resolve => setTimeout(resolve, 8000));
      if (i !== 0) {
        // await waitFor(element(by.id('settings_button'))).toBeVisible().withTimeout(8000)
        await element(by.id('settings_button')).tap();
        await element(by.id('language_scrollview')).scroll(200, 'right');
        await new Promise(resolve => setTimeout(resolve, 500));
        await element(by.id('back_button')).tap();
      } else {
        // await waitFor(element(by.id('settings_button'))).toBeVisible().withTimeout(8000)
        await element(by.id('settings_button')).tap();
        await element(by.id('slider_button_0')).tap();
        await element(by.id('back_button')).tap();
      }
      // screenshot 1
      await device.takeScreenshot(`${LanguageCodes[i]}_home_page`);

      await element(by.id('play_button')).tap();

      await device.takeScreenshot(`${LanguageCodes[i]}_play_page`);

      await element(by.id('match_button')).tap();
      await element(by.id('start_game_button')).tap();

      await device.takeScreenshot(`${LanguageCodes[i]}_game_page`);

      await device.reloadReactNative()
    });
  }
});
