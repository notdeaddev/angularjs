'use strict';

describe('$anchorScroll', function() {
  beforeEach(function() {
    jasmine.addMatchers({
      toBeInViewport: function() {
        return {
          compare: function(id) {
            var result = {
              pass: browser.driver.
                executeScript(_script_isInViewport, id).
                then(function(isInViewport) {
                  result.message = 'Expected #' + id + (isInViewport ? ' not' : '') +
                                   ' to be in viewport';
                  return isInViewport;
                })
            };

            return result;
          }
        };
      },
      toHaveTop: function() {
        return {
          compare: function(id, expectedTop) {
            var result = {
              pass: browser.driver.
                executeScript(_script_getTop, id).
                then(function(actualTop) {
                  // Some browsers may report have +/-1 pixel deviation
                  var passed = Math.abs(expectedTop - actualTop) <= 1;
                  result.message = 'Expected #' + id + '\'s top' + (passed ? ' not' : '') +
                                   ' to be ' + expectedTop + ', but it was ' + actualTop;
                  return passed;
                })
            };

            return result;
          }
        };
      }
    });
  });

  describe('basic functionality', function() {
    beforeEach(async function() {
      await loadFixture('anchor-scroll');
    });

    it('should scroll to #bottom when clicking #top and vice versa', async function() {
      expect('top').toBeInViewport();
      expect('bottom').not.toBeInViewport();

      await element(by.id('top')).click();
      await waitForInViewport('bottom');
      await waitForNotInViewport('top');
      expect('top').not.toBeInViewport();
      expect('bottom').toBeInViewport();

      await element(by.id('bottom')).click();
      await waitForInViewport('top');
      await waitForNotInViewport('bottom');
      expect('top').toBeInViewport();
      expect('bottom').not.toBeInViewport();
    });
  });

  describe('with `yOffset`', function() {
    var yOffset = 50;
    var buttons = element.all(by.repeater('x in [1, 2, 3, 4, 5]'));
    var anchors = element.all(by.repeater('y in [1, 2, 3, 4, 5]'));

    beforeEach(async function() {
      await loadFixture('anchor-scroll-y-offset');
    });

      it('should scroll to the correct anchor when clicking each button', async function() {
        var size = await browser.driver.executeScript(
          'return document.getElementById("anchor-5").getBoundingClientRect().height');
        var tempHeight = size - 10;
        await scrollToTop();

        await execWithTempViewportHeight(tempHeight, async function() {
          var count = await buttons.count();
          for (var i = 0; i < count; i++) {
            var button = buttons.get(i);
            var anchorId = 'anchor-' + (i + 1);
            await button.click();
            await waitForInViewport(anchorId);
            expect(anchorId).toBeInViewport();
          }
          await waitForTop('anchor-5', yOffset);
          expect('anchor-5').toHaveTop(yOffset);
        });
      });

      it('should automatically scroll when navigating to a URL with a hash', async function() {
        var lastAnchorId = 'anchor-5';
        var size = await browser.driver.executeScript(
          'return document.getElementById("' + lastAnchorId + '").getBoundingClientRect().height');
        var tempHeight = size - 10;
        await scrollToTop();

        await execWithTempViewportHeight(tempHeight, async function() {
        // Test updating `$location.url()` from within the app
        expect(lastAnchorId).not.toBeInViewport();

        await browser.setLocation('#' + lastAnchorId);
        await waitForInViewport(lastAnchorId);
        await waitForTop(lastAnchorId, yOffset);
        expect(lastAnchorId).toBeInViewport();
        expect(lastAnchorId).toHaveTop(yOffset);

        // Test navigating to the URL directly
        await scrollToTop();
        await waitForNotInViewport(lastAnchorId);

        await browser.refresh();
        await waitForInViewport(lastAnchorId);
        await waitForTop(lastAnchorId, yOffset);
        expect(lastAnchorId).toBeInViewport();
        expect(lastAnchorId).toHaveTop(yOffset);
      });
    });

      it('should not scroll "overzealously"', async function() {
        var lastButton = buttons.last();
        var lastAnchorId = 'anchor-5';

        if (browser.params.browser === 'firefox') return;

        var size = await browser.driver.executeScript(
          'return document.getElementById("' + lastAnchorId + '").getBoundingClientRect().height');
        var tempHeight = size + (yOffset / 2);
        await scrollToTop();

        await execWithTempViewportHeight(tempHeight, async function() {
        await scrollIntoView(lastAnchorId);
        await waitForTop(lastAnchorId, yOffset / 2);
        expect(lastAnchorId).toHaveTop(yOffset / 2);

        await lastButton.click();
        await waitForInViewport(lastAnchorId);
        await waitForTop(lastAnchorId, yOffset);
        expect(lastAnchorId).toBeInViewport();
        expect(lastAnchorId).toHaveTop(yOffset);
      });
    });
  });

  // Helpers
  // Those are scripts executed in the browser, stop complaining about
  // `document` not being defined.
  /* eslint-disable no-undef */
  function _script_getTop(id) {
    var elem = document.getElementById(id);
    var rect = elem.getBoundingClientRect();

    return rect.top;
  }

  function _script_isInViewport(id) {
    var elem = document.getElementById(id);
    var rect = elem.getBoundingClientRect();
    var docElem = document.documentElement;

    return (rect.top < docElem.clientHeight) &&
           (rect.bottom > 0) &&
           (rect.left < docElem.clientWidth) &&
           (rect.right > 0);
  }
  /* eslint-enable */

  function execWithTempViewportHeight(tempHeight, fn) {
    return setViewportHeight(tempHeight).then(function(oldHeight) {
      return Promise.resolve(fn()).finally(function() {
        return setViewportHeight(oldHeight);
      });
    });
  }

  function scrollIntoView(id) {
    return browser.driver.executeScript('document.getElementById("' + id + '").scrollIntoView()');
  }

  function scrollToTop() {
    return browser.driver.executeScript('window.scrollTo(0, 0)');
  }

  function waitForInViewport(id) {
    return browser.wait(function() {
      return browser.driver.executeScript(_script_isInViewport, id);
    }, 2000);
  }

  function waitForNotInViewport(id) {
    return browser.wait(function() {
      return browser.driver.executeScript(_script_isInViewport, id).then(function(isInViewport) {
        return !isInViewport;
      });
    }, 2000);
  }

  function waitForTop(id, expectedTop) {
    return browser.wait(function() {
      return browser.driver.executeScript(_script_getTop, id).then(function(actualTop) {
        return Math.abs(expectedTop - actualTop) <= 1;
      });
    }, 2000);
  }

  function setViewportHeight(newHeight) {
    return browser.driver.
      executeScript('return document.documentElement.clientHeight').
      then(function(oldHeight) {
        var heightDiff = newHeight - oldHeight;
        var win = browser.driver.manage().window();

        return win.getSize().then(function(size) {
          return win.
            setSize(size.width, size.height + heightDiff).
            then(function() { return oldHeight; });
        });
      });
  }
});
