angular.module('appSweet.moduloLogin', [])

.controller('loginCtrl', function ($scope, $window, $ionicPopup, $state, Core, $ionicHistory, $rootScope, $timeout, $filter) {

        $scope.$watch('user.username', function () {
            //$scope.user.username = $scope.user.username.toLowerCase().replace(/\s+/g, '');
            $scope.user.username = $filter('lowercase')($scope.user.username);
        });

        $scope.user = {};
        $ionicHistory.nextViewOptions({
            disableBack: true
        });

        $scope.$watchGroup(['user.username', 'user.password'], function (newVal) {
            var user = newVal[0] != undefined && newVal[0].length > 4,
                password = newVal[1] != undefined && newVal[1].length > 4;

            $scope.ready = !!(user && password);
        });


        $scope.login = function (user) {
            Core.userLogin(user.username, user.password);
        };


    }) // End Controller Login

.controller('cadastroCtrl', function ($scope, $state, Core, $rootScope) {

    $scope.user = {};
    $scope.$watchGroup(['user.username', 'user.fn', 'user.ln', 'user.celular', 'user.cpf', 'user.email', 'user.password'], function (newVal) {

        var valid = new RegExp(/^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][\d]\.|1[\d]{2}\.|[\d]{1,2}\.))((25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\.){2}(25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\]?$)/i);


        var user = newVal[0] != undefined && newVal[0].length > 4,
            fn = newVal[1] != undefined && newVal[1].length > 0,
            ln = newVal[2] != undefined && newVal[2].length > 0,
            celular = newVal[3] != undefined && newVal[3].length > 0,
            cpf = newVal[4] != undefined && newVal[4].length > 0,
            email = !!valid.test(newVal[5]),
            password = newVal[6] != undefined && newVal[6].length > 5;

        $scope.ready = !!(user && fn && ln && email && password);
    });

    $scope.signup = function (user) {
        if (user.password !== user.password2) {
            $scope.senhaerro = true;
        } else {

            Core.userSignup(user.username, user.fn, user.ln, user.celular, user.cpf, user.email, user.password);
        }
    };


})


.controller('limboCtrl', function ($scope, $state, $ionicHistory, Core) {

    if (!Parse.User.current()) {
        $state.go('login');
    }

    // Recupera nome do usuário logado
    $scope.nome = Parse.User.current().get('fn');

    // Função faz logout no Parse
    $scope.logout = function () {

        Parse.User.logOut();
        $state.go('login');
        $ionicHistory.clearCache();
        $ionicHistory.clearHistory();

    };

})


.controller('resetPassCtrl', function ($scope, Core) {

    $scope.user = {};
    $scope.$watch('user.email', function (newVal) {
        var valid = new RegExp(/^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][\d]\.|1[\d]{2}\.|[\d]{1,2}\.))((25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\.){2}(25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\]?$)/i);
        $scope.ready = !!valid.test(newVal)
    });


    $scope.reset = function (email) {
        console.log(email);
        Core.userReset(email);
    };


})