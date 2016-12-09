angular.module('appSweet.moduloNovoCliente', [])

/* Controller Novo Cliente */
    .controller('novoClienteCtrl', function ($scope, $state, $cordovaCamera, $ionicPopup, $ionicHistory, $ionicLoading, $window, ClienteService, getClientesAPI, getEnderecoAPI, Core) {


        /* Verifica se o usuário está logado **********/
        if (!Parse.User.current()) {
            $state.go('login')
        } else if (!Parse.User.current().get('status')) {
            $state.go('limbo');
        }
        /**********************************************/


        /* Pega a altura da view para mostrar as 3 imagens */
        $scope.Height = ($window.innerHeight - 43) / 3;

        /* Mostra popup para avisar que a opção Cliente final está desabilitada */
        $scope.clienteDisabled = function () {
            $ionicPopup.alert({
                title: 'Ops!',
                template: "Desculpe, por enquanto esta função está desabilitada, em breve você poderá fazer seus pedidos para clinte finela também.",
                okType: 'button-balanced'
            });
        }

        /**********************************************
         Inicia cadastro de novo cliente
         **********************************************/

        // Inicia array
        $scope.novocliente = [];
        $scope.cliente = ClienteService.juntaObjeto();


        // Função para buscar o cep
        $scope.buscaCEP = function (cep) {

            if (!cep) {
                $ionicPopup.alert({
                    title: 'Ops!',
                    template: "Você precisa preencher o campo CEP para continuar.",
                    okType: 'button-positive'
                });

            } else {

                // Mostra loading
                $ionicLoading.show({
                    template: '<ion-spinner></ion-spinner>'
                });

                // Carrega a API de CEP e retorna o endereço
                getEnderecoAPI.getendereco(cep).success(function (data) {

                    // Mostra o restante do formulário com os dados de endereço
                    $scope.mostraEndereco = true;

                    // Se o status for "sucess", seta a variável novocliente com os dados
                    if (data.status === "success") {

                        $ionicLoading.hide();
                        $scope.novocliente.endereco = data.result[0];
                        $scope.novocliente.endereco.local = "Salão";
                    }

                    // Se o status for "error" mostra alert com mensagem de erro
                    else if (data.status === "error") {

                        $ionicLoading.hide();
                        $ionicPopup.alert({
                            title: 'Ops!',
                            template: "Não foi possível encontrar o CEP: " + cep + "<br>Por favor, tente novamente ou preencha o formulário manualmente",
                            okType: 'button-assertive'
                        });
                    }
                    console.log(data);

                }).error(function (data, status) {
                    console.log("erro");
                    $scope.error_message = "ERRO - Não foi possível carregar o cliente. Por favor entre em contato com nossa central: suporte@sweethair.com.br ou (11) 2227-8600";
                });

            }

        };

        //Cancela novo cliente
        $scope.cancelarnovocliente = function () {

            // Pergunta se o usuário tem certeza
            var cancela = $ionicPopup.confirm({
                title: 'Cancelar!',
                template: "Você tem certeza que deseja cancelar este cadastro?",
                okType: 'button-assertive'
            });
            cancela.then(function (res) {
                if (res) {
                    // Se tiver certeza, deleta Objeto com dados preechidos
                    apagaDadosStorage();
                    $ionicHistory.clearCache();
                    // Após deletar, volta a página inicial
                    $state.go('menu.novo_cliente');
                    console.log("cancelou novo cliente");
                    // Apaga histórico de navegação, e volta a home.
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });

                } else {
                    console.log('You are not sure');
                }
            });

        };

        // Função cria objeto no local storage e passa para próxima página
        // @key = nome da chave do objeto
        // @data = valores que vieram do formulário
        // @proximo = nome da próxima página
        $scope.clienteFormGo = function (key, data, proximo) {

            var matriz = new Object();
            if (key === "endereco") {
                matriz["endereco"] = data;
                if (data.local != "Salão") {
                    proximo = 'menu.novo_cliente_pessoa';
                    ClienteService.saveCliente("novocliente.salao", {});
                }
            }
            if (key === "salao") {
                matriz["salao"] = data;
            }
            if (key === "pessoa") {
                matriz["pessoa"] = data;
            }
            if (key === "dados") {
                matriz["dados"] = data;
            }

            // Usa o serviço ClienteService e cria um objeto no localstorage com os datos
            ClienteService.saveCliente("novocliente." + key, matriz);


            // Vai para a próxima página
            $state.go(proximo);
            console.log(data);
            if (key === "dados") {
                $scope.cliente = ClienteService.juntaObjeto();
                console.log($scope.cliente);
                $scope.alertaVerDados();
            }

        };


        $scope.clienteTipo = function (tipo) {
            // @ 1 = salao
            // @ 2 = Profissional cabeleireiro
            // @ 3 = cliente final
            // @ 0 = retorna valor

            if (!tipo) {
                var objt = JSON.parse(window.localStorage.getItem('novocliente.tipo'));
                if (!objt) {
                    var i = false;
                    console.log(i);
                } else {
                    var i = objt.cliente_tipo;
                    console.log("tipo");
                    console.log(i);
                }
            } else {
                var cliente_tipo = {
                    cliente_tipo: tipo
                }
                var i = window.localStorage.setItem('novocliente.tipo', JSON.stringify(cliente_tipo));
            }
            return i;
        };
        $scope.cliente_tipo = $scope.clienteTipo();


        // Primeiro Popup - Alerta para verificar os dados
        $scope.alertaVerDados = function () {
            var alertaPopup = $ionicPopup.alert({
                title: '<i class="icon ion-checkmark-circled calm font-50"></i><br>ATENÇÃO!',
                template: '<center>Antes de concluir, verifique se os dados cadastrados estão corretos</center>'
            });
        };

        // Segundo Popup - Confirma que os dados estão corretos e envia dados para o Parse
        $scope.aprovarCadNovoCliente = function () {
            var aprovarPopup = $ionicPopup.confirm({
                title: '<i class="icon ion-checkmark-circled balanced font-50"></i><br>QUASE LÁ!',
                template: '<center>Você confirma que verificou se os dados estão corretos?</center>',
                cancelText: 'NÃO', // String (default: 'Cancel'). The text of the Cancel button.
                okText: 'SIM' // String (default: 'OK'). The text of the OK button.
            });

            aprovarPopup.then(function (res) {
                if (res) {

                    // Junta os dados em um único objeto
                    // Envia dados para Parse
                    //$scope.juntaObjeto();
                    enviaNovoClienteToParse(ClienteService.juntaObjeto());

                    // Apaga histórico de navegação, e volta a home.
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });

                } else {
                    console.log('You are not sure');
                }
            });
        };

        // Terceiro Popup - Cadastro efetuado com sucesso
        $scope.mensagemCadastroEfetuado = function () {
            var aprovarPopup = $ionicPopup.alert({
                title: '<i class="icon ion-trophy energized font-50"></i><br>SUCESSO!',
                template: '<center>Você acaba de cadastrar o cliente com sucesso. Lembre-se de fazer o <b>primeiro pedido em até 15 dias</b> para manter a exclusividade.</center>'
            });
            aprovarPopup.then(function (res) {
                if (res) {
                    // Apaga localstorage
                    apagaDadosStorage();
                    $state.go('menu.inicio');
                }
            });
        };


        /* Envia dados para o Parse */
        function enviaNovoClienteToParse(objeto) {
            // Mostra loading
            $ionicLoading.show({
                template: '<ion-spinner></ion-spinner><br>Realizando cadastro'
            });

            var NovoCliente = Parse.Object.extend("Clientes");
            var novoCliente = new NovoCliente();

            novoCliente.set("promotorId", Parse.User.current());
            novoCliente.set(objeto);

            novoCliente.save(null, {
                success: function (novoCliente) {
                    $ionicLoading.hide();
                    // Mostra alerta de cadastro efetuado com sucesso
                    $scope.mensagemCadastroEfetuado();
                    // Execute any logic that should take place after the object is saved.
                    console.log('New object created with objectId: ' + novoCliente.id);
                },
                error: function (novoCliente, error) {
                    // Execute any logic that should take place if the save fails.
                    // error is a Parse.Error with an error code and message.
                    alert('Failed to create new object, with error code: ' + error.message);
                }
            });

        };


        /* Função Apaga Dados do LocalStorage */
        var apagaDadosStorage = function () {
            window.localStorage.removeItem('novocliente.endereco');
            window.localStorage.removeItem('novocliente.salao');
            window.localStorage.removeItem('novocliente.pessoa');
            window.localStorage.removeItem('novocliente.tipo');
            window.localStorage.removeItem('novocliente.dados');
        };


        // Camera
        $scope.tirarFoto = function () {
            var camOptions = {
                quality: 60,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: 1, //Camera.PictureSourceType.CAMERA,
                //allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 600,
                //targetHeight: 100,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: true,
                correctOrientation: true
            };

            $cordovaCamera.getPicture(camOptions).then(function (imageData) {
                // var image = document.getElementById('myImage');
                $scope.imagemsrc = "data:image/jpeg;base64," + imageData;
                window.localStorage.setItem('imagemcliente', imageURI);
            }, function (err) {
                console.log("ops, erro na camera" + err)
                // error
            });

        };
        $scope.pegarFoto = function () {

            var options = {
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: 0 //Camera.PictureSourceType.CAMERA,
            };

            $cordovaCamera.getPicture(options).then(function (imageURI) {
                //var image = document.getElementById('myImage');
                $scope.imagemsrc = imageURI;
                window.localStorage.setItem('imagemcliente', imageURI);
            }, function (err) {
                console.log(err);
                // error
            });

        };

        $scope.loadFoto = function () {

            var out = window.localStorage.getItem('imagemcliente');

            return out;
        };


    }) // Fim do Controller