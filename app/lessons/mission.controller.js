//console.log alternative for code editor.
var nq_gate = {
  gateNeededEleNum: 0
};

//this function will need to be added to an answer block of a test case.
function openGate() {
  if(nq_gate.gateNeededEleNum > 0){
    nq_gate.gateNeededEleNum -= 1;
    console.log('currentGateNum', nq_gate.gateNeededEleNum);
  }
}
function resetGate() {
  nq_gate.gateNeededEleNum = 0;
  // console.log('gate count reset');
}

var nqConsole = function() {
  return({
      log: function(msg) {
        consoleDiv = document.getElementById('result');
        para = document.createElement('p');
        text = document.createTextNode(msg);
        para.appendChild(text);
        consoleDiv.appendChild(para);
      },
      alert: function(msg) {
        consoleDiv = document.getElementById('result');
        alert = document.createElement('code');
        text = document.createTextNode(msg);
        alert.appendChild(text);
        consoleDiv.appendChild(alert);
      }
  });
}();

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
    $scope, Build, Users, auth, lastEle,
    $localStorage, $timeout, $state
    ) {
    
    var missionCtrl = this;
    var editor;
    var ref = new Firebase(FirebaseUrl + '/NNFlat');
    var authData = ref.getAuth();
    var editorInitialized = false;
    
    missionCtrl.lastElement = lastEle;
    console.log('lastEl',missionCtrl.lastElement);
    processSnapshot(missionData);
    
    
    missionCtrl.gate = nq_gate;
    missionCtrl.processSnapshot = processSnapshot;
    missionCtrl.saveElement = saveElement;
    missionCtrl.isAdmin = isAdmin;
    missionCtrl.isBuildMode = isBuildMode;
    missionCtrl.reset = reset;
    missionCtrl.run = run;
    missionCtrl.initEditor = initEditor;
    missionCtrl.checkGate = checkGate;
    missionCtrl.showCodeAnswer = showCodeAnswer;
    missionCtrl.multipleChoiceChecker = multipleChoiceChecker;
    resetGate();
    checkGateNeededEle();

    
    // init();

    // missionCtrl.isAdminMode = BuildSrv.isAdminMode;

    function multipleChoiceChecker(answer) {
      if (answer) {
        openGate();
      }
    }


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
      // console.log('you are here', data);
      // console.log('you are here', lastEle[data].sequence);
      //if last page show complete template.
      var lastEleKey = Object.keys(lastEle);
      if( (data) == lastEleKey ){
        console.log('you are here!!!!!');
        $timeout(function(){
          $state.go('missionComplete');
        },100)
      } else {
        data = data + 10;
        refWrite.update({ currentSequence: data });
        console.log('nextSeq',data);

        resetGate();  
      }
    };

    function processSnapshot(snapshot) {
      missionCtrl.elements = snapshot.val();
      var lastEleKey = Object.keys(lastEle);
      
      for(var elem in missionCtrl.elements) {
        missionCtrl.title = missionCtrl.elements[elem].shuffle;
        missionCtrl.sequence = missionCtrl.elements[elem].sequence;
      }
      if(missionCtrl.sequence <= lastEleKey){
        console.log('setting next shuffle');
        setNextShuffle(missionCtrl.sequence);  
      }
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
    };

    function isBuildMode() {
      //check if buildMode
      return Build.getBuildMode();
    };

    function checkGate() {
      return nq_gateOpen;
    };
    
    function checkGateNeededEle() {
      for(var key in missionCtrl.elements){
        var type = missionCtrl.elements[key].type;
        if(type === "question" || type === "code-editor"){
          missionCtrl.gate.gateNeededEleNum += 1;
        }
      }
      console.log('gateNeededEleNum',missionCtrl.gate.gateNeededEleNum);
    }

    //-------------------------//
    /* methods for Ace Editor */
    //-------------------------//
    function initCodeEditor(prompt) {
      var codeEditor = document.getElementById("code-editor");
      if(codeEditor){
        // console.log('codeeditor',codeEditor[i]);
        editor = ace.edit("code-editor");
        editor.setTheme("ace/theme/monokai");
        editor.getSession().setMode("ace/mode/javascript");
        editor.setValue(prompt, 1); 
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
      editor.setValue(prompt, 1);
      editor.getSession().setUndoManager(new ace.UndoManager());
      $localStorage.codeObj = '';
      missionCtrl.codeResult = '';
    };

    function showCodeAnswer(answer){
      editor.setValue(answer, 1);
      editor.getSession().setUndoManager(new ace.UndoManager());
      $localStorage.codeObj = '';
      missionCtrl.codeResult = '';
      openGate();
    }

    function run(testCase) {
      document.getElementById('result').innerHTML = '';
      // console.log('aceCode script block', document.getElementsByClassName('aceCode'));
      $('.aceCode').remove();
      console.log('testcase', testCase);

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