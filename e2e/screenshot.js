const { execSync } = require("child_process");

const SCREENSHOT_OPTIONS = {
  timeout: 10000,
  killSignal: "SIGKILL",
};

let screenshotIndex = 0;

export const takeScreenshot = () => {
  screenshotIndex += 1;
  const fileName = `screenshot-${screenshotIndex}.png`;
  if (device.getPlatform() === "android") {
    const fileAddress = `/sdcard/${fileName}`;
    execSync(`adb shell screencap ${fileAddress}`, SCREENSHOT_OPTIONS);
    execSync(
      `adb pull ${fileAddress} $(pwd)/android/fastlane/metadata/android/en-US/images/phoneScreenshots/`,
      SCREENSHOT_OPTIONS,
    );
  } else {
    const fileAddress = `$(pwd)/ios/screenshots/${fileName}`;
    execSync(
      `xcrun simctl io booted screenshot ${fileAddress}`,
      SCREENSHOT_OPTIONS,
    );
  }
};