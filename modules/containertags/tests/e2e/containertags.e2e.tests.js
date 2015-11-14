'use strict';

describe('Containertags E2E Tests:', function () {
  describe('Test containertags page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3000/containertags');
      expect(element.all(by.repeater('containertag in containertags')).count()).toEqual(0);
    });
  });
});
