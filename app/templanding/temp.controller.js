/**
 *
 * temp: may change the name later.
 *
 */

(function(){
  'use strict';
  
  angular.module('neuralquestApp')
    .controller('TempCtrl', TempCtrl);

    function TempCtrl(Auth, $state, Users) {
      var tempCtrl = this;
      tempCtrl.logout = logout;
      tempCtrl.setProfile = setProfile;

      /*=============================================
      =            METHOD IMPLEMENTATION            =
      =============================================*/

      function logout(){
        Auth.$unauth();
        $state.go('home');
        Users.currentUser = '';
      };

      function setProfile(){
        $state.go('profile');
      };
      
    };

})();

