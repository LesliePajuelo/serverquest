(function() {
    'use strict';

  angular
    .module('neuralquestApp')
    .controller('AccordionCtrl', AccordionCtrl);

  
  function AccordionCtrl(FirebaseUrl, $firebaseObject, $firebaseArray) {
    var accordionCtrl = this;
    var getLessons = getLessons;

    accordionCtrl.oneAtATime = true;

    accordionCtrl.init = init;
    accordionCtrl.init();
    accordionCtrl.isNotString = isNotString;
    accordionCtrl.openFirstOne = openFirstOne;

    /*======================================
    =            IMPLEMENTATION            =
    ======================================*/

    function init() {
      getLessons('NNFlat');
    }

    function openFirstOne(index) {
      console.log('index:', index);
      if(index === 0){
        return true;
      } else {
        return false;
      }
    }

    function getLessons(lessonData) {
      var ref = new Firebase(FirebaseUrl);
      accordionCtrl.track = $firebaseArray(ref.child(lessonData));
      //
      // accordionCtrl.steps = getSteps(accordionCtrl.track);
      // accordionCtrl.courses = getCourses(accordionCtrl.steps);
    }

    function getStep(steps){
      var steps = [];
      //process steps data to only filter steps I need.
      return stesp;
    }

    function getCourses(courses){
      var courses = [];
      //process sources data to only filter steps I need.
      return courses;
    }

    function isNotString(val) {
      // console.log('val', val);
      if(typeof val === "string"){
        console.log('is string', val);
        // console.log('is string', val);
        return false;
      } else {
        return true;
      }
    }

  }
})();