'use strict';

describe('simple test', function () {
  it('should be true', function () {
    function test(){
      return true;
    }
    expect(test()).to.be.true;
  });
});



/**
 *
 * tried to implement testing for states, not working for now.
 *
 */


// require('angular');
// require('angular-mocks');
// var neuralquestApp = require('./app');


// describe('states tests', function () {

//   var rootScope, state, injector,  mockLocalStorage, httpBackend;

//   beforeEach(angular.mock.module('neuralquestApp'));

//   beforeEach(inject(function($rootScope, $state, $injector, $httpBackend) {
//       rootScope = $rootScope;
//       state = $state;
//       injector = $injector;
//       httpBackend = $httpBackend;
//   }));

//   it('Should have /login route, template, and controller', function () {
//     // expect(state('/login').to.be.a("object"));
//     expect(state('/login')).to.equal('/login');
//     // expect($route.routes['/login'].controller).to.be('AuthCtrl');
//     // expect($route.routes['/login'].templateUrl).to.be('auth/login.html');
//   });
// });
