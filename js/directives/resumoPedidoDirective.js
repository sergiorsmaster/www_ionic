angular.module('appSweet.resumoPedidoDirective', [])

.directive('shResumoPedido', [function () {
    return {
        restrict: "E",
        scope: {
            pedidoObjeto: "="
        },
        templateUrl: "templates/pedido/directives/pedidoResumoTemplate.html"


    };


}]);