/**
 * Created by Osei Fortune on 7/2/15.
 */
angular.module('appSweet.factories', [])
    .factory('Core', function ($ionicPopup, $state, $ionicLoading) {

        var core = {};

        core.userSignup = function (username, fn, ln, celular, cpf, email, password) {

            $ionicLoading.show({
                template: '<ion-spinner></ion-spinner>'
            });

            var user = new Parse.User();
            user.set("username", username);
            user.set("password", password);
            user.set("email", email);
            user.set("fn", fn);
            user.set("ln", ln);
            user.set("celular", celular);
            user.set("cpf", cpf);
            user.set("status", false);

            user.signUp(null, {
                success: function (user) {

                    $ionicLoading.hide();

                    $ionicPopup.alert({
                        title: '<i class="icon ion-trophy energized font-50"></i><br>SUCESSO!',
                        template: 'Já recebemos seu cadastro, lembre-se, você deve entrar com seu nome de usuário (<b>' + username + '</b>) e senha escolhida.',
                        okText: 'ENTENDI',
                        okType: 'button-balanced'
                    });

                    //$state.go('menu.inicio');
                    $state.go('limbo');
                },
                error: function (user, error) {
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: 'Ops!',
                        template: error.message,
                        okType: 'button-balanced'
                    });
                }
            });


        };

        core.userLogin = function (username, password) {


            $ionicLoading.show({
                template: '<ion-spinner></ion-spinner>'
            });

            Parse.User.logIn(username, password, {
                success: function (user) {
                    $ionicLoading.hide();
                    $state.go('menu.inicio');
                },
                error: function (user, error) {
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: 'Ops!',
                        template: error.message,
                        okType: 'button-balanced'
                    });
                }
            });

        };

        core.userReset = function (email) {

            $ionicLoading.show({
                template: '<ion-spinner></ion-spinner>'
            });

            Parse.User.requestPasswordReset(email, {
                success: function () {
                    $ionicLoading.hide();
                    // Password reset request was sent successfully
                    $ionicPopup.alert({
                        title: 'Success',
                        template: 'password was sent to ' + email,
                        okType: 'button-balanced'
                    });
                    $state.go('login');
                },
                error: function (error) {
                    $ionicLoading.hide();
                    // Password reset failed
                    $ionicPopup.alert({
                        title: 'Ops!',
                        template: "Error: " + error.code + " " + error.message,
                        okType: 'button-balanced'
                    });
                }
            });
        };


        return core;
    });