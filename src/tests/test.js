const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert')
var capabilities = {
    "os": "OS X",
    "os_version": "Mojave",
    "browserName": "Chrome",
    "browser_version": "85",
    "browserstack.user": process.env.BROWSERSTACK_USERNAME || "",
    "browserstack.key": process.env.BROWSERSTACK_ACCESS_KEY || "",
    "browserstack.local": "true"
};

(async function test() {
    var driver = new Builder().usingServer('http://hub-cloud.browserstack.com/wd/hub').withCapabilities(capabilities).build();

    try {
        await driver.get("http://bs-local.com:45691/check")
        let body = await driver.wait(until.elementLocated(By.css("body")), 3000)
        let text = await body.getText()
        await assert.strictEqual(text, "Up and running")
        await driver.executeScript('browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "Local page accessible"}}');
    }

    catch (e) {
        console.log(e);
        await driver.executeScript('browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "An error occured"}}');
        await driver.quit();
        process.exit(1) // exit with non-zero to fail CI job
    }

    finally {
        await driver.quit();
    }
})();