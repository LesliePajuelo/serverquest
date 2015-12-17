(function() {
    'use strict';

    angular
        .module('neuralquestApp')
        .controller('BuildCtrl', ['Build','$scope',BuildCtrl]);

    /* @ngInject */
    function BuildCtrl(Build, $scope, $state) {
        var buildCtrl = this;
        
        buildCtrl.submitEle = submitEle;

        $scope.$watch('buildCtrl.eltoModify', function(newVal, oldVal){
            // console.log("Search was changed to:"+newVal);
            if(newVal && newVal.length >= 2){
                Build.getElementonDB(newVal).then(function(ele){
                    buildCtrl.build = ele;
                });
            };
        });

        $scope.$watch('buildCtrl.editMode', function(newVal, oldVal){
            if(newVal === 'build'){
                buildCtrl.build = {};
            };
        });

        ////////////////

        function submitEle() {
            Build.updateBuild(buildCtrl.build);
            buildCtrl.build = null;
            buildCtrl.editMode = null;
            buildCtrl.eltoModify = '';
        }
    }
})();