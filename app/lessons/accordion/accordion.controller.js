(function() {
    'use strict';

  angular
    .module('neuralquestApp')
    .controller('AccordionCtrl', AccordionCtrl);

  
  function AccordionCtrl(FirebaseUrl, $firebaseObject, $firebaseArray, accordionData, Users, Auth) {
    var accordionCtrl = this;
    var getLessons = getLessons;
    var ref = new Firebase(FirebaseUrl + '/NNFlat');
    var userRef = new Firebase(FirebaseUrl + '/users');

    accordionCtrl.oneAtATime = true;

    accordionCtrl.init = init;
    accordionCtrl.init();
    accordionCtrl.isNotString = isNotString;
    accordionCtrl.openFirstOne = openFirstOne;
    accordionCtrl.updateUserPosition = updateUserPosition;

    /*======================================
    =            IMPLEMENTATION            =
    ======================================*/

    function init() {
      accordionCtrl.allEl = accordionData;
      accordionCtrl.track = makeLocalObject(accordionCtrl.allEl);
      console.log(Auth.$getAuth());
      console.log(Users.getProfile(Auth.$getAuth().uid));
      accordionCtrl.currentUser = Users.getProfile(Auth.$getAuth().uid);
      accordionCtrl.currentUser.$loaded().then(function() {
        var currSeq = accordionCtrl.currentUser.currentSequence;
        ref.orderByChild('sequence')
           .equalTo(currSeq)
           .on('value', function(snapshot) {
             var data = snapshot.val();
             accordionCtrl.currentUser.currentLesson = data[currSeq].course;
             accordionCtrl.currentUser.currentShuffle = data[currSeq].shuffle;
           });
      });
    };

    function openFirstOne(index) {
      if(index === 0){
        return true;
      } else {
        return false;
      }
    };

    //get a list of step, course or shuffle.
    function getComponent(allElements, targetKey){ 
      var result = {};
      for(var key in allElements){
        if(!allElements[key][targetKey]){
          result[allElements[key][targetKey]] = true;
        }
      }
      return result;
    };

    function updateUserPosition(shuffleName) {
      var authData = userRef.getAuth();
      var refWrite = new Firebase(FirebaseUrl + '/users/' + authData.uid + '/');
      ref.orderByChild('shuffle').equalTo(shuffleName)
         .limitToFirst(1)
         .on('value', function(snapshot) {
           var element = snapshot.val();
           for (var key in element) {
             var data = parseInt(key);
           }
           refWrite.update({ currentSequence: data });
         });
    };

    function makeLocalObject(allElements) {
      var result = {}
      for(var numberKey in allElements) {
        var element = allElements[numberKey];
        var step = element['step'];
        var course = element['course'];
        var shuffle = element['shuffle'];

        if(!result[step]) {
          result[step] = {}
        }
        if(!result[step][course]) {
          result[step][course] = {}
        }
        if(!result[step][course][shuffle]) {
          result[step][course][shuffle] = {}
        }
        result[step][course][shuffle][element] = true; 
        
      }
      return result;
    };

    function isNotString(val) {
      if(typeof val === "string"){
        return false;
      } else {
        return true;
      }
    }
  };

})();