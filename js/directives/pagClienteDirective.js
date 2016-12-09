angular.module('appSweet.pagClienteDirective', [])

.directive('shClientePage', [function () {
    return {
        restrict: "E",
        scope: {
            clienteObjeto: "="
        },
        templateUrl: "templates/cliente/directives/cliente_page.html",
        link: function (scope, element, attrs, ctrl) {

            /* Função exibe imagem padrão caso não tenha foto do cliente */
            scope.getBackgroundStyle = function (imagepath) {
                if (!imagepath) {
                    imagepath = "cliente_no_image.jpg";
                }

                return {
                    'background-image': 'url(img/clientes/' + imagepath + ')'
                }
            };



        },
        controller: function ($scope, ClienteService) {

            /* Função controla Tabs da página Cliente (Detalhes - Pedidos - Produtos) */
            $scope.toggleTabCliente = function (clienteUrl) {

                //Se btn_out_* for verdadeiro, adiciona a classe button-outline nos botões da tab.
                $scope.btn_out_1 = true;
                $scope.btn_out_2 = true;
                $scope.btn_out_3 = true;

                //Pega a variavel passada na função
                $scope.templateUrl = clienteUrl;

                //Se 1 exibe Detalhes do cliente
                if ($scope.templateUrl == 1) {
                    $scope.templateUrl = "templates/cliente/parts/clienteDetalhes.html";
                    $scope.btn_out_1 = !$scope.btn_out_1;
                }
                //Se 2 exibe Pedidos do cliente
                if ($scope.templateUrl == 2) {
                    $scope.templateUrl = "templates/cliente/parts/clientePedidos.html";
                    $scope.btn_out_2 = !$scope.btn_out_2;
                }
                //Se 3 exibe Produtos do cliente
                if ($scope.templateUrl == 3) {
                    $scope.templateUrl = "templates/cliente/parts/clienteProdutos.html";
                    $scope.btn_out_3 = !$scope.btn_out_3;
                }
            };


            /* Abrir link inApp Browser */
            $scope.openLink = function (linkurl) {
                window.open(linkurl, '_blank');
            };

            $scope.mostradata = function (str) {
                var separa = str.split("T");
                var arruma = separa[0].split("-");
                var Data = arruma[2] + "/" + arruma[1] + "/" + arruma[0];

                return Data;

            };

        }
    };


}]);