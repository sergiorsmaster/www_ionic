angular.module('appSweet.moduloPedido', [])

/* Controller Cria Novo pedido 
 Este controller pega todas as páginas referente ao pedido */

.controller('novoPedidoCtrl', function ($scope, $window, $ionicPopup, $state, $ionicSlideBoxDelegate, $ionicListDelegate, $ionicModal, $ionicHistory, $ionicLoading, $timeout, getProdutosAPI, getClientesAPI, CartService) {

        /* Verifica se o usuário está logado **********/
        if (!Parse.User.current()) {
            $state.go('login')
        } else if (!Parse.User.current().get('status')) {
            $state.go('limbo');
        }
        /**********************************************/

        /* cliente_id é igual ao parametro passado na url */
        $scope.cliente_id = $state.params.id;
        //console.log($scope.cliente_id);


        /* Abre modal com a página de detalhes do cliente */
        $ionicModal.fromTemplateUrl('cliente.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });


        /* Função carrega cliente através do ID */
        var carregaCliente = function () {
            getClientesAPI.getclientes().success(function (data) {
                for (var i = 0; i < data.length; ++i) {
                    if (data[i].id === $scope.cliente_id) {
                        $scope.cliente = data[i];
                        //grava cliente no local storage
                        getClientesAPI.gravaClienteStorage($scope.cliente);
                        break;
                    }
                }
            }).error(function (data, status) {
                console.log("erro");
                $scope.error_message = "ERRO - Não foi possível carregar o cliente. Por favor entre em contato com nossa central: suporte@sweethair.com.br ou (11) 2227-8600";
            });

        }();


        /* compensa altura do corpo da tab de produdos para ter scroll */
        $scope.Height = $window.innerHeight - 176;
        //$scope.Width = $window.innerWidth;

        /* template com a lista de produtos */
        $scope.templatelist = "templates/pedido/parts/pedidoProdutosList.html";

        /* Função Busca produtos e Categorias */
        var carregarProdutos = function () {

            // Busca categorias de produtos
            var categorias = [];
            getProdutosAPI.getCategorias().success(function (data) {

                $scope.categorias = data;
                /*
                 categorias = angular.toJson(data);
                 $scope.categorias = data;
                 console.log('$scope.categorias');
                 console.log(categorias);
                 */
                // console.log($scope.categorias);

                $ionicSlideBoxDelegate.update();

            }).error(function (data, status) {
                console.log("erro");
                $scope.error_message = "ERRO - Não foi possível carregar categorias";
            });

            // Busca produtos
            var results = [];
            getProdutosAPI.getProdutos().success(function (data) {

                results = angular.toJson(data.results);
                $scope.produtos = angular.fromJson(results);
                console.log($scope.produtos);

                // console.log(results);

                $ionicSlideBoxDelegate.update();

            }).error(function (data, status) {
                console.log("erro");
                $scope.error_message = "ERRO - Não foi possível carregar produtos. Por favor entre em contato com nossa central: suporte@sweethair.com.br ou (11) 2227-8600";
            });
        }();


        /***** CARRINHO *****/

        //using the CartService to load cart from localStorage
        $scope.cart = CartService.loadCart();

        // private method to add a product to cartq
        var addProductToCart = function (product) {

            var itens = JSON.parse(window.localStorage.getItem('cart'));
            if (!itens == '' && !itens.products.length == 0) {

                var carrinho = JSON.parse(JSON.stringify(product));

                for (var i = 0; i < itens.products.length; i++) {

                    if (itens.products[i].product_id === carrinho.product_id) {

                        $scope.cart.products.splice(i, 1);
                        break;

                    }

                }


            }

            $scope.cart.products.push(product);
            CartService.saveCart($scope.cart);

        };


        $scope.getTotal = CartService.getTotal;
        $scope.getTotalItens = CartService.getTotalItens;

        // removes product from cart (making in persistent)
        $scope.dropProduct = function ($index) {

            console.log('drop product by index');

            console.log($index);
            $scope.cart.products.splice($index, 1);
            CartService.saveCart($scope.cart);
            CartService.loadCart();
            $scope.temProduto();
            // as this method is triggered in an <ion-option-button>
            // we close the list after that (not strictly needed)
            $ionicListDelegate.closeOptionButtons();
            $ionicHistory.clearCache();

        };

        /* Função para abrir o popup Escolher quantidade de produtos */
        $scope.addProduct = function (produto, id_produto, $index) {

            //Variavel quantidade de produtos
            $scope.prodQuant = 0;

            /* Função adiciona ou remove a quantidade desejada */
            $scope.modalQuant = function (a) {

                // - 1 ao valor da quantidade de produtos
                if (a == 'menos') {
                    // A quantidade não pode ser menor que 0
                    if ($scope.prodQuant > 0) {
                        $scope.prodQuant = $scope.prodQuant - 1;
                        // $scope.prodQuant - 1;
                    }
                }
                // + 1 ao valor da quantidade de produtos
                else if (a == 'mais') {
                    $scope.prodQuant = $scope.prodQuant + 1;
                    // $scope.prodQuant + 1;
                }
            };

            $scope.quantAnterior = $scope.quantItem(id_produto);

            $scope.prodQuant = $scope.quantItem(id_produto);

            // Template do PopUp
            var quantProdutoPopup = $ionicPopup.show({
                template: '<div class="num-popup-control"><button class="button button-clear icon ion-minus button-positive" ng-click="modalQuant(\'menos\')"></button><input type="number" ng-model="prodQuant" class="num-popup-prod"><button class="button button-clear icon ion-plus button-positive" ng-click="modalQuant(\'mais\')"></button><div>',
                title: 'Qual a quantidade?',
                subTitle: 'Por favor preencha abaixo',
                scope: $scope,
                buttons: [
                    {
                        text: 'Cancelar'
                    },
                    {
                        text: '<b>OK</b>',
                        type: 'button-positive',
                        onTap: function (res) {

                            if ($scope.prodQuant < $scope.quantAnterior) {
                                console.log('$scope.removeItem(produto)');
                                $scope.removeItem(produto);
                            }

                            return $scope.prodQuant;
                        }
                    }
                ]
            });

            /* Executa a ação do Popup */
            quantProdutoPopup.then(function (res) {
                if (res >= 1) {
                    //adiciona o valor quant no objeto produto
                    produto.quant = res;
                    //Executa a função adicionar produto ao carrinho
                    addProductToCart(produto);
                    return true;

                }
            });
        }; // end addProduct

        /**
         * Calcula quantidade individual dos ítens do carrinho
         * @param {type} id_produto
         * @returns {Number}
         */
        $scope.quantItem = function (id_produto) {

            var cart = JSON.parse(localStorage.getItem('cart'));
            var out = 0;
            if (cart != null) {
                angular.forEach(cart.products, function (value, key) {
                    if (value.product_id == id_produto)
                        out += value.quant;
                });
            }
            return out;

        };

        $scope.removeItem = function (id_produto) {
            $scope.cart.products.splice(id_produto, 1);
            CartService.saveCart($scope.cart);
            CartService.loadCart();
        };

        // Verifica se tem produto no pedido, caso não tenha retorna false.
        // Estou usando para o botão APROVAR PEDIDO do carrinho só aparecer caso tenha produtos.
        $scope.temProduto = function () {
            var cart = JSON.parse(window.localStorage.getItem('cart'));
            //Se existe produto no localstorage...
            if (cart && cart.products.length > 0) {
                return true;
            }
        };

        // Cancela o pedido e retorna para a página de lista de clientes
        $scope.cancelarPedido = function (pag) {
            // Abre popup perguntando se tem certeza
            var confirmPopup = $ionicPopup.confirm({
                title: 'Cancelar pedido',
                template: 'Tem certeza que deseja cancelar este pedido?',
                buttons: [{
                    text: 'Cancelar'
                }, {
                    text: 'Sim',
                    type: 'button-positive',
                    onTap: function (e) {
                        return true;
                    }
                }]
            });
            // Se a resposta for SIM...
            confirmPopup.then(function (res) {
                if (res) {
                    //Volta para a página escolher cliente
                    //$state.go('menu.novo-pedido');
                    if (pag === 2) {
                        //Apaga localstorage do cliente
                        window.localStorage.removeItem('cliente');
                        //Apaga localstorage do carrinho
                        window.localStorage.removeItem('cart');
                        $ionicHistory.goBack(-2);
                    } else if (pag === 3) {
                        //Apaga localstorage do cliente
                        window.localStorage.removeItem('cliente');
                        //Apaga localstorage do carrinho
                        window.localStorage.removeItem('cart');
                        //Apaga localstorage do checkout
                        window.localStorage.removeItem('checkout');
                        $ionicHistory.goBack(-3);
                    } else {
                        //Apaga localstorage do carrinho
                        window.localStorage.removeItem('cart');
                        //Apaga localstorage do cliente
                        window.localStorage.removeItem('cliente');
                        $ionicHistory.goBack();
                    }
                    //Apaga cache da página
                    $ionicHistory.clearCache();
                }
            });
        };


        /****** ENVIA PEDIDO *****/

        // Popup caso a escolha da entrega for transportadora
        $scope.confirmTransportadora = function (checkout) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'ATENÇÃO',
                template: 'Você concorda com a  redução de <b>5%</b> na sua comissão para os custos desta entrega?'
            });

            confirmPopup.then(function (res) {
                if (res) {
                    $scope.gravaPedido(checkout);
                } else {
                    console.log('You are not sure');
                }
            });
        };

        // Data de hoje
        $scope.dataAtualFormatada = function () {
            var data = new Date();
            var dia = data.getDate();
            if (dia.toString().length == 1)
                dia = "0" + dia;
            var mes = data.getMonth() + 1;
            if (mes.toString().length == 1)
                mes = "0" + mes;
            var ano = data.getFullYear();
            return dia + "/" + mes + "/" + ano;
        };

        // Mostra o loading com a mensagem
        $scope.loadingshow = function () {
            $ionicLoading.show({
                template: 'Enviando seu pedido, por favor não feche o aplicativo.<br><br>Enviando...',
            });
        };

        // Grava pedido no localstorage
        $scope.gravaPedido = function (checkout) {
            // Cria a data atual
            $scope.checkout.data = $scope.dataAtualFormatada();
            // Grava dados no localstorage
            window.localStorage.setItem('checkout', JSON.stringify(checkout));
            console.log(checkout);
            console.log($scope.dataAtualFormatada());
            // Mostra o loading
            $scope.loadingshow();
            // Apos 3 segundos vai para a página resumo do pedido
            $timeout(function () {
                $ionicLoading.hide();
                $state.go('menu.novo-pedido-resumo', {
                    'id': $scope.cliente_id
                });
            }, 3000);

        }

        // Grava pedido no localstorage
        $scope.checkout = {};
        $scope.enviaPedido = function (checkout) {
            $scope.checkout.data = $scope.dataAtualFormatada();
            window.localStorage.setItem('checkout', JSON.stringify(checkout));
            console.log(checkout);
            console.log($scope.dataAtualFormatada());
            $scope.loadingshow();
            $timeout(function () {
                $ionicLoading.hide();
                $state.go('menu.novo-pedido-resumo', {
                    'id': $scope.cliente_id
                });
            }, 3000);
        };


        // Verifica pedido ante de gravar no localstorage
        $scope.checkout = {};
        $scope.enviaPedido = function (checkout) {

            if (checkout.frete == "transportadora") {
                $scope.confirmTransportadora(checkout);

            } else {
                $scope.gravaPedido(checkout);

            }
        };


        /**** RESUMO DO PEDIDO ****/


        // Modal concluir pedido
        $scope.concluirPedido = function () {
            var concluirPopup = $ionicPopup.alert({
                title: '<i class="icon ion-checkmark-circled balanced font-50"></i><br>SUCESSO!',
                template: '<center>Enquanto seu pedido aguarda liberação, você pode editar a vontade.<br>Após isso, por favor entre em contato com seu Centro de Distribuição.</center>'
            });

            concluirPopup.then(function (res) {
                //apaga histórico de navegação, para voltar a home.
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $state.go('menu.inicio');
            });
        };


    }) // End Controller