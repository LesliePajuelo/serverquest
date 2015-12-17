'use strict';

describe('simple test', function () {
  it('should be true', function () {
    function test(){
      return true;
    }
    expect(test()).to.be.true;
  });
});

