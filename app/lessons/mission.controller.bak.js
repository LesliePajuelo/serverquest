//console.log alternative for code editor.
var nqConsole = function() {
  return({
      log: function(msg) {
        consoleDiv = document.getElementById('result');
        para = document.createElement('p');
        text = document.createTextNode(msg);
        para.appendChild(text);
        consoleDiv.appendChild(para);
      }
  });
}();


//show all elements
//show all elements up to a gate(code-editor/question);
  //keep track of current gate and next gate.
//if user solves it,
  //chagne the curernt to next one.
  //find out next gate and save it? 
  //give the user seqence# of the gate
  //open elements up to the next gate

//continue button : should show next element( not 10 ahead one)
//show all elments of page unless you have prompt type(code-ediotr, question);
//user should pass the prompt to see next gate(code-editor or question type)


/**
 *
 * Mission Template Controller
 *
 */

(function(){
  'use strict';

  angular.module('neuralquestApp')
    .controller('MissionCtrl', MissionCtrl);

  function MissionCtrl ($firebaseArray, FirebaseUrl, 
    $firebaseObject, Missions, missionData, 
    $scope, Build, Users, auth,
    $localStorage, $timeout
    ) {
    
    var missionCtrl = this;
    var editor;
    var ref = new Firebase(FirebaseUrl + '/NNFlat');
    var authData = ref.getAuth();
    var editorInitialized = false;

    processSnapshot(missionData);

    missionCtrl.processSnapshot = processSnapshot;
    missionCtrl.saveElement = saveElement;
    missionCtrl.isAdmin = isAdmin;
    missionCtrl.isBuildMode = isBuildMode;
    missionCtrl.reset = reset;
    missionCtrl.run = run;
    missionCtrl.initEditor = initEditor;

    getSequence();

    // init();

    // missionCtrl.isAdminMode = BuildSrv.isAdminMode;

    /*=============================================
    =            METHOD IMPLEMENTATION            =
    =============================================*/
    function initEditor(prompt) {
      if(!editorInitialized){
        initCodeEditor(prompt);
        trackCode();  
        editorInitialized = true;
      }
    }

    function lesliesFunc(val) {
      console.log(val);
    };

    function saveElement(data) {
      var refWrite = new Firebase(FirebaseUrl + '/users/' + authData.uid + '/');
      data = data + 10;
      refWrite.update({ currentSequence: data });
    };

    function processSnapshot(snapshot) {
      missionCtrl.elements = snapshot.val();
      for(var elem in missionCtrl.elements) {
        missionCtrl.title = missionCtrl.elements[elem].shuffle;
        missionCtrl.sequence = missionCtrl.elements[elem].sequence;
      }
      setNextShuffle(missionCtrl.sequence);
    };

    function setNextShuffle(sequence) {
      var nextSeq = sequence + 10;
      ref.orderByChild('sequence').equalTo(nextSeq).on('value', function(snapshot) {
        var element = snapshot.val();
        if (element) {
          missionCtrl.nextShuffle = element[nextSeq].shuffle;
        }
      });
    };

    function getSequence (){
      var refRead = new Firebase(FirebaseUrl + '/users/' + authData.uid + '/');
      refRead.orderByChild('currentSequence').on('value', function(snapshot){
       $scope.currentSequence = snapshot.val().currentSequence
      });
    };

    function isAdmin() {
      //check if the current user is admin
      var isAdmin = Users.getUserProfile(auth.uid).isAdmin;
      return isAdmin;
    }

    function isBuildMode() {
      //check if buildMode
      return Build.getBuildMode();
    }


    /* methods for Ace Editor */
    function initCodeEditor(prompt) {
      var codeEditor = document.getElementById("code-editor");
      if(codeEditor){
        editor = ace.edit("code-editor");
        editor.setTheme("ace/theme/monokai");
        editor.getSession().setMode("ace/mode/javascript");
        editor.setValue(prompt); 
        $localStorage.codeObj = prompt; 
      }
    };

    function trackCode() {
      if(editor){
        editor.on("change", function(posObj){
          $localStorage.codeObj = editor.getValue();
        });
      }
    };

    function reset(prompt) {
      //initial value will come from DB later. need to fix here.
      editor.setValue(prompt);
      editor.getSession().setUndoManager(new ace.UndoManager());
      $localStorage.codeObj = '';
      missionCtrl.codeResult = '';
    };

    function run(testCase) {
      document.getElementById('result').innerHTML = '';
      // console.log('aceCode script block', document.getElementsByClassName('aceCode'));
      $('.aceCode').remove();

      var temp; 
      temp = $localStorage.codeObj;
      $localStorage.codeObj = '';

      $timeout(function(){
        missionCtrl.codeResult = temp;

        appendToScript(temp);
        appendToScript(testCase);

      },100);


    }
      
    //append a given code to in the script tag. it will run the given code
    function appendToScript(code){
      var script = document.createElement('script');
      script.setAttribute('class', 'aceCode');
      try {
        script.appendChild(document.createTextNode(code));
        document.body.appendChild(script);
      } catch (e) {
        script.text = code;
        document.body.appendChild(script);
      }
    }    

  };

})();