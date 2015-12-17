(function() {
    'use strict';

    angular
        .module('neuralquestApp')
        .factory('Ace', ['$http','$q',Ace]);

    function Ace($http) {
        var service = {
            submitCode: submitCode
        };
        return service;

        ////////////////

        function submitCode(code) {
          
        }
    }
})();