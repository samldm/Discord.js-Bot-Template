const AdvancedClient = require('../structure/Client');
const Logger = require('../utils/Logger');

const fs = require('fs');
const path = require('path');


module.exports = class TestsManager
{
  /**
   * @typedef {("init_start"|"init_end"|"ready")} TestFlags
   */

  /**
   * Tests Manager
   * @param {AdvancedClient} client Client
   */
  constructor(client) {
    this.run = process.argv.pop() == "--run-tests" ? true : false;
    this.config = require('../../config/managerConfig').testsManager;
    this.client = client;
    this.tests = [];
    if (this.run)
      Logger.info("All tests will be executed.");
  }

  async fetchTests() {
    if (!this.run) return null;
    this.tests = [];
    let tests_path = path.resolve(__dirname, "../../", this.config.tests_path);
    Logger.log("Fetching tests.");
    try {
      let tests = await fs.readdirSync(tests_path);
      tests.forEach((file) => {
        if (!file.endsWith(".js")) return;
        let test = require(path.resolve(tests_path, file));
        if (test instanceof Function) test(this.client);
        if (test instanceof Object && test.when) {
            this.tests.push(test);
        }
      });
    } catch(e) {
      Logger.error(`Test failed\n${e.stack}`);
    }
    return this;
  }

  /**
   * 
   * @param {TestFlags} step 
   */
  runTests(step) {
    if (!this.run) return null;
    this.tests.forEach((t) => {
      if (t.when == step) {
        if (t.name) Logger.log(`Running test "${t.name}"`);
        try {
          t.test(this.client);
        } catch(e) {
          if (t.name) Logger.error(`Test "${t.name}" failed.\n${e}`);
          else Logger.error(`A test failed.\n${e}`);
        }
      }
    });
  }
}