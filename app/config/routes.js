(function() {
'use strict';

angular
    .module('neuralquestApp')
    .config(routes);

    function routes ($stateProvider, $urlRouterProvider) {
      $stateProvider
        .state('signup', {
          url: '/signup',
          controller: 'AuthCtrl as authCtrl',
          templateUrl: 'auth/signup.html',
          resolve: {
            "currentAuth": ["Auth", function(Auth){
              return Auth.$waitForAuth();
            }],
            requireNoAuth: function($state, Auth) {
              return Auth.$requireAuth().then(function(auth) {
                $state.go('accordion');
              }, function(error) {
                return;
              })
            }
          }
        })
        .state('login', {
          url: '/',
          controller: 'AuthCtrl as authCtrl',
          templateUrl: 'auth/login.html',
          resolve: {
            requireNoAuth: function($state, Auth) {
              return Auth.$requireAuth().then(function(auth) {
                $state.go('accordion');
              }, function(error) {
                return;
              })
            }
          }
        })
        .state('register', {
          url: '/register',
          controller: 'AuthCtrl as authCtrl',
          templateUrl: 'auth/register.html',
          resolve: {
            requireNoAuth: function($state, Auth) {
              return Auth.$requireAuth().then(function(auth) {
                $state.go('home');
              }, function(error) {
                return;
              })
            }
          }
        })
        .state('profile', {
          url: '/profile',
          controller: 'ProfileCtrl as profileCtrl',
          templateUrl: 'users/profile.html',
          resolve: {
            auth: function($state, Users, Auth) {
              return Auth.$requireAuth().catch(function() {
                $state.go('home');
              });
            },
            profile: function(Users, Auth) {
              return Auth.$requireAuth().then(function(auth) {
                console.log("you hit profile state!")
                return Users.getProfile(auth.uid).$loaded();
              });
            }
          }
        })
        .state('landing', {
          url: '/landing',
          controller: 'LandingCtrl as landingCtrl',
          templateUrl: 'users/landing.html',
          resolve: {
            auth: function($state, Users, Auth) {
              return Auth.$requireAuth().catch(function() {
                $state.go('home');
              });
            },
            profile: function(Users, Auth) {
              return Auth.$requireAuth().then(function(auth) {
                return Users.getProfile(auth.uid).$loaded();
              });
            }
          }
        })
        .state('lesson', {
          url: '/lesson',
          controller: 'LessonTemplateCtrl as lessonTemplateCtrl',
          templateUrl: 'lessons/text.template.html',
          resolve: {
            auth: function($state, Users, Auth) {
              return Auth.$requireAuth().catch(function() {
                $state.go('home');
              });
            }
          }
        })
        .state('temp', {
          url: '/temp',
          controller: 'TempCtrl as tempCtrl',
          templateUrl: 'templanding/temp.html',
        })
        .state('mission', {
          url: '/mission/:courseName',
          controller: 'MissionCtrl as missionCtrl',
          templateUrl: 'lessons/mission.template.html',
          resolve: {
            auth: function($state, Users, Auth) {
              return Auth.$requireAuth().catch(function() {
                $state.go('home');
              });
            },
            missionData: function(Missions, $stateParams) {
              return Missions.getShuffleData($stateParams.courseName);
            },
            lastEle: function(Missions) {
              return Missions.getLastElement();
            }
          }
        })
        .state('build', {
          url: '/build',
          controller: 'BuildCtrl as buildCtrl',
          templateUrl: 'build/build.html',
          resolve: {
            auth: function($state, Users, Auth) {
              return Auth.$requireAuth().catch(function() {
                $state.go('home');
              });
            }
          }
        })
        .state('accordion', {
          url: '/accordion',
          controller: 'AccordionCtrl as accordionCtrl',
          templateUrl: 'lessons/accordion/accordion.html',
          resolve: {
            auth: function($state, Users, Auth) {
              return Auth.$requireAuth().catch(function() {
                $state.go('home');
              });
            },
            accordionData: function(AccordionService) {
              return AccordionService.getLessons();
            }
          }
        })
        .state('missionComplete', {
          templateUrl: 'lessons/missioncomplete.html',
          resolve: {
            auth: function($state, Users, Auth) {
              return Auth.$requireAuth().catch(function() {
                $state.go('home');
              });
            }
          }
        })
        .state('resetPwd', {
          templateUrl: 'auth/resetPwd.html',
          controller: 'AuthCtrl as authCtrl'
        })
        .state('lesson2', {
          url: '/lesson2',
          controller: 'LessonTemplateCtrl as lessonTemplateCtrl',
          templateUrl: 'lessons/lesson.template.html'
        })
        .state('acetest', {
          url: '/acetest',
          controller: 'AceCtrl as aceCtrl',
          templateUrl: 'acetest/acetest.html'
        })
      $urlRouterProvider.otherwise('/accordion');
    };
})();