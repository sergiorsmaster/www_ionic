angular.module('appSweet.controllers', [])

/* Controller Introdução */
    .controller('introCtrl', function ($scope, $state, $ionicSlideBoxDelegate, $window) {

        /* Pega a altura da view para mostrar as 3 imagens */
        $scope.Height = $window.innerHeight - 44;
        $scope.Width = $window.innerWidth;

        // Called to navigate to the main app
        $scope.startApp = function () {
            $state.go('login');
            var jaViuIntro = "introOK";
            window.localStorage.setItem('introducao', jaViuIntro);

        };
        $scope.next = function () {
            $ionicSlideBoxDelegate.next();
        };
        $scope.previous = function () {
            $ionicSlideBoxDelegate.previous();
        };

        // Called each time the slide changes
        $scope.slideChanged = function (index) {
            $scope.slideIndex = index;
        };
    })

    /* Controller Tela inicial */
    .controller('paginaHome', function ($scope, $state, Core) {
        /* Verifica se o usuário está logado **********/
        if (!Parse.User.current()) {
            $state.go('login');
        } else if (Parse.User.current().get('status') == false) {
            $state.go('limbo');
        }

        $scope._SessionToken = Parse.User.current().get('sessionToken');
        Parse.User.become($scope._SessionToken).then(function (user) {
            console.log('sucesso');
            // The current user is now set to user.
        }, function (error) {
            console.log('erro');
            // The token could not be validated.
        });

        $scope.usuario = Parse.User.current().get('fn');

        /**********************************************/

    })


    /* Controller Perfil do Promotor */
    .controller('promotorPerfil', function ($scope, $state, Core) {
        /* Verifica se o usuário está logado **********/
        if (!Parse.User.current()) {
            $state.go('login');
        } else if (Parse.User.current().get('status') == false) {
            $state.go('limbo');
        }

        $scope._SessionToken = Parse.User.current().get('sessionToken');
        Parse.User.become($scope._SessionToken).then(function (user) {
            console.log('sucesso');
            // The current user is now set to user.
        }, function (error) {
            console.log('erro');
            // The token could not be validated.
        });

        $scope.promoNome = Parse.User.current().get('fn');
        $scope.promoSobrenome = Parse.User.current().get('ln');
        $scope.promoEmail = Parse.User.current().get('email');
        $scope.promoCelular = Parse.User.current().get('celular');
        $scope.promoCpf = Parse.User.current().get('cpf');

        /**********************************************/

    })

    /* Controller Lista de Clientes */
    .controller('meusClientesCtrl', function ($scope, getClientesAPI, $ionicLoading) {
        /* Verifica se o usuário está logado **********/
        if (!Parse.User.current()) {
            $state.go('login')
        } else if (!Parse.User.current().get('status')) {
            $state.go('limbo');
        }

        $scope._SessionToken = Parse.User.current().get('sessionToken');
        Parse.User.become($scope._SessionToken).then(function (user) {
            console.log('sucesso');
            // The current user is now set to user.
        }, function (error) {
            $state.go('limbo');
            console.log('erro');
            // The token could not be validated.
        });
        /**********************************************/


        /* Função carrega clientes */
        var carregarClientes = function () {

            $ionicLoading.show({
                template: '<ion-spinner></ion-spinner>'
            });

            var Clientes = Parse.Object.extend("Clientes");
            var query = new Parse.Query(Clientes);
            query.equalTo("promotorId", Parse.User.current());
            query.find({
                success: function (data) {

                    results = angular.toJson(data);
                    $scope.clientes = angular.fromJson(results);
                    $ionicLoading.hide();
                    console.log($scope.clientes);

                },

                error: function (error) {
                    $ionicLoading.hide();
                    alert("Error: " + error.code + " " + error.message);
                }

            });


        }(); //carregarClientes


    }) // Termina Controller


    /* Controller Pagina do cliente */
    .controller('clienteCtrl', function ($scope, $state, getClientesAPI, getPlaces) {

        /* Verifica se o usuário está logado **********/
        if (!Parse.User.current()) {
            $state.go('login')
        } else if (!Parse.User.current().get('status')) {
            $state.go('limbo');
        }
        /**********************************************/


        /* cliente_id é igual ao parametro passado na url */
        $scope.cliente_id = $state.params.id;

        /* Função carrega clientes através do ID */
        var carregaCliente = function () {

            $scope.cliente = [];
            var Cliente = Parse.Object.extend("Clientes");
            var query = new Parse.Query(Cliente);
            query.equalTo("objectId", $scope.cliente_id);
            query.find({
                success: function (data) {

                    var results = angular.toJson(data);

                    $scope.cliente = angular.fromJson(results);

                    var cliente = JSON.parse(results);

                    if (!cliente == '' && !cliente.length == 0) {

                        for (var i = 0; i < cliente.length; i++) {

                            // console.log('vai sergiao');
                            // console.log(cliente[i].endereco);

                            $scope.cliente = cliente[i];

                            window.localStorage.setItem('geolocation', angular.toJson($scope.cliente.endereco));
                            // {"endereco":{"cep":"01333-021","logradouro":"Rua Carlos Sampaio","complemento":"lado ímpar","bairro":"Bela Vista","localidade":"São Paulo","uf":"SP","unidade":"","ibge":"3550308","gia":"1004","local":"Salão","numero":222}}

                        }


                        var geolocation = JSON.parse(window.localStorage.getItem('geolocation'));

                        console.log(geolocation.logradouro);


                        // var p = getPlaces.getlaces('Rua José Flávio 556, 03642000 São Paulo');
                        var p = getPlaces.getlaces(geolocation.logradouro + ' ' + geolocation.numero + ', ' + geolocation.cep + ' ' +  geolocation.localidade);

                        $scope.p = p;

                        $scope.p.then(function(data) {
                            // can use data here

                            if (!data.data.results == '' && !data.data.results.length == 0) {

                                console.log(data.data.results);

                                for (var i = 0; i < data.data.results.length; i++) {

                                    // console.log(data.data.results[i].place_id);
                                    //console.log(data.data.results[i]);

                                    var latLng = new google.maps.LatLng(data.data.results[i].geometry.location.lat, data.data.results[i].geometry.location.lng);

                                    console.log(data.data.results[i].geometry.location.lat);

                                    var options = {timeout: 10000, enableHighAccuracy: true};

                                    // var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

                                    var mapOptions = {
                                        center: latLng,
                                        zoom: 8
                                    };


                                    var geocoder = new google.maps.Geocoder;

                                    console.log('place_id');
                                    console.log(data.data.results[i].place_id);


                                    // geocoder.geocode({'placeId': data.data.results[i].geometry.location.place_id};

                                    // geocoder.placeId = {'placeId': data.data.results[i].geometry.location.place_id};

                                    var map = new google.maps.Map(document.getElementById("map"), mapOptions);

                                    map.setZoom(11);
                                    map.setCenter(data.data.results[i].geometry.location);

                                    var marker = new google.maps.Marker({
                                        map: map,
                                        position: data.data.results[i].geometry.location
                                    });


                                    var infowindow = new google.maps.InfoWindow;

                                    // infowindow.setContent(data.data.results[i].formatted_address);

                                    infowindow.setContent(geolocation.logradouro + ' ' + geolocation.numero);

                                    infowindow.open(map, marker);

                                    $scope.map = map;

                                }



                            }else{


                            }


                            // var p = data.results[0].geometry.location


                        });


                    }


                    // console.log($scope.cliente);

                },

                error: function (error) {
                    alert("Error: " + error.code + " " + error.message);
                }

            });



            //        getClientesAPI.getclientes().success(function (data) {
            //            for (var i = 0; i < data.length; ++i) {
            //                if (data[i].id === $scope.cliente_id) {
            //                    $scope.cliente = data[i];
            //                    break;
            //                }
            //            }
            //        }).error(function (data, status) {
            //            console.log("erro");
            //            $scope.error_message = "ERRO - Não foi possível carregar o cliente. Por favor entre em contato com nossa central: suporte@sweethair.com.br ou (11) 2227-8600";
            //        });

        }();
    })


    /* Controller Configurações */
    .controller('configCtrl', function ($scope, $window, $ionicHistory, $state, $ionicPopup) {
        /* Verifica se o usuário está logado **********/
        if (!Parse.User.current()) {
            $state.go('login')
        } else if (!Parse.User.current().get('status')) {
            $state.go('limbo');
        }

        $scope._SessionToken = Parse.User.current().get('sessionToken');
        Parse.User.become($scope._SessionToken).then(function (user) {
            console.log('sucesso');
            // The current user is now set to user.
        }, function (error) {
            console.log('erro');
            Parse.User.logOut();
            $state.go('login');
            $ionicHistory.clearCache();
            $ionicHistory.clearHistory();
            // The token could not be validated.
        });
        /**********************************************/


        //$scope.currentUser = Parse.User.current()._serverData;
        //$scope.currentUser = Parse.User.current();

        $scope.apagaDadosLocalStorage = function () {
            $ionicHistory.clearCache();
            $ionicHistory.clearHistory();
            //$window.localStorage.clear();
        };

        // Função faz logout no Parse
        $scope.logout = function () {

            $ionicPopup.confirm({
                title: 'Sair',
                template: 'Tem certeza que deseja sair?',
                okType: 'button-positive',
                okText: 'Sim',
                cancelText: 'Cancelar'
            }).then(function (res) {
                if (res) {
                    Parse.User.logOut();
                    $state.go('login');
                    $ionicHistory.clearCache();
                    $ionicHistory.clearHistory();
                } else {
                }
            });
        };


    })