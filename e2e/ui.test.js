describe('UI', () => {
  beforeAll(async () => {
    // await device.launchApp();
    await device.disableSynchronization();
    // await new Promise(resolve => setTimeout(resolve, 8000));
// adb -s emulator-5554 shell "settings put global window_animation_scale 1.0"
// adb -s emulator-5554 shell "settings put global transition_animation_scale 1.0"
// adb -s emulator-5554 shell "settings put global animator_duration_scale 1.0"
  });

  beforeEach(async () => {
    await device.disableSynchronization();
  });

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
      await device.disableSynchronization();
      await new Promise(resolve => setTimeout(resolve, 8000));
      if (i !== 0) {
        await element(by.id('settings_button')).tap();
        await element(by.id('language_scrollview')).scroll(200, 'right');
        await new Promise(resolve => setTimeout(resolve, 500));
        await element(by.id('back_button')).tap();
      } else {
        //need to undo animations programatically
        await new Promise(resolve => setTimeout(resolve, 10000));
        await device.reloadReactNative();
        await device.disableSynchronization();
        await new Promise(resolve => setTimeout(resolve, 10000));
        await element(by.id('settings_button')).tap();
        await element(by.id('slider_button_0')).tap();
        await element(by.id('back_button')).tap();
      }
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
