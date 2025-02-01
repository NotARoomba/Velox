describe('Example', () => {
  beforeAll(async () => {
    await device.launchApp();
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
    it(`take screenshots in ${LanguageCodes[i]}`, async () => {
      if (i !== 0) {
        await element(by.id('settings_button')).tap();
        await element(by.id('language_scrollview')).scroll(50, 'left');
        await element(by.id('settings_back_button')).tap();
      }
      // screenshot 1
      await takeScreenshot(`${LanguageCodes[i]}_home_page`);
    });
  }
});
