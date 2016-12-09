angular.module('appSweet.services', [])


/* Get Clientes */
.factory('getClientesAPI', function ($http, Core) {
    var _getclientes = function () {
        return $http.get('js/json/lista_clientes.json');
    };

    var _gravaClienteStorage = function (cliente) {
        return window.localStorage.setItem('cliente', JSON.stringify(cliente));
    };

    var _loadClienteStorage = function () {
        var cliente = window.localStorage.getItem('cliente');
        if (!cliente) {
            return {
                cliente: []
            }
        }
        return JSON.parse(cliente);
    }
    return {
        getclientes: _getclientes,
        gravaClienteStorage: _gravaClienteStorage,
        loadClienteStorage: _loadClienteStorage
    };

})


/* Get Produtos  e Categorias*/
.factory('getProdutosAPI', function ($http) {
    var _getCategorias = function () {
        return $http.get('js/json/categorias.json');
    };
    var _getProdutos = function () {
        return $http({
            method: 'GET',
            url: 'https://parseapi.back4app.com/classes/Products',
            headers: {
                'X-Parse-Application-Id': 'kSKMWbyC1qwCenAWynxK4fY7KH4vXbfpHrYddi3X',
                'X-Parse-REST-API-Key': 'yh3XFTiYnEHjeMeuZVZz6qmvbpJNbyQfoKksSqhn',
                'Content-Type': 'application/json'
            }

        });

    };
    return {
        getCategorias: _getCategorias,
        getProdutos: _getProdutos
    };

})



.factory('getPlaces', function ($http, Core) {

    var _getplaces = function (address) {

        // var address = ['Rua José Flávio 556, 03642000 São Paulo'];

        // return JSON.stringify('http://maps.googleapis.com/maps/api/geocode/json?address=' + addressesArray[x] + '&sensor=false');
        // return JSON.stringify('http://maps.googleapis.com/maps/api/geocode/json?address=Rua José Flávio 556, 03642000 São Paulo&sensor=false');

        // return angular.fromJson(angular.toJson($http.get('http://maps.googleapis.com/maps/api/geocode/json?address=Rua José Flávio 556, 03642000 São Paulo&sensor=false')));

        console.log('places by address');
        console.log(address);

        return $http.get('http://maps.googleapis.com/maps/api/geocode/json?address=' + address.toString() + '&sensor=false');

    };

    return {
        getlaces: _getplaces
    };

})




/************** Veio do plugin **************
        http://market.ionic.io/themes/deepbluekit
        **********************************************/

// CartService is an example of service using localStorage 
// to persist items of the cart.
.factory('CartService', [function () {

    var svc = {};

    svc.saveCart = function (cart) {

        window.localStorage.setItem('cart', JSON.stringify(cart));

        // var itens = window.localStorage.getItem('cart');


        // var total = JSON.parse(itens);

        //      if(!itens){
        //          window.localStorage.setItem('cart', JSON.stringify(cart));
        //      } else {
        //       console.log(itens.length);
        //        for(var i = 0; i < itens.length; i++)
        //          {
        //              if (cart.products.id === itens[i].id){
        //                  
        //            console.log("ja tem no carrinho" + itens.length);
        //             //$scope.rowData[i].itemHr = 25;
        //              break; 
        //              }    
        //          }
        //      }
        //    

    };

    svc.loadCart = function () {
        var cart = window.localStorage.getItem('cart');
        if (!cart) {
            return {
                products: []
            }
        }
        return JSON.parse(cart);
    };

    svc.resetCart = function () {
        var cart = window.localStorage.removeItem('cart');
        //    var cart =  { products : [ ] };
        //    svc.saveCart(cart);
        return cart;
    };



    svc.getTotal = function (cart) {
        var out = 0;
        if (!cart || !cart.products || !angular.isArray(cart.products)) {
            return out;
        }
        for (var i = 0; i < cart.products.length; i++) {
            out += JSON.parse(cart.products[i].price * cart.products[i].quant);
        }
        return out;
    };

    svc.getTotalItens = function (cart) {
        var out = 0;
        if (!cart || !cart.products || !angular.isArray(cart.products)) {
            return out;
        }
        for (var i = 0; i < cart.products.length; i++) {
            out += JSON.parse(cart.products[i].quant);
        }
        return out;
    };


    return svc;

}])

.factory('ClienteService', [function ($ionicPopup, $state, $ionicLoading) {

    var svc = {};

    // Salva dados no localstorage
    svc.saveCliente = function (cliente, dados) {

        window.localStorage.setItem(cliente, JSON.stringify(dados));

    };


    svc.arrumaData = function (str) {
        var separa = str.split(".");

        return separa[0];
        console.log("Arruma executou");
        console.log(separa);

        //Usar:  ClienteService.arrumaData(str);

    };

    /* Função junta objetos em um só */
    svc.juntaObjeto = function () {

        /* Função juntar 2 objetos em 1 só */
        function extend(obj, src) {
            for (var key in src) {
                if (src.hasOwnProperty(key)) obj[key] = src[key];
            }
            return obj;
        };

        // Pega o ID do promotor usuário do app e coloca em um objeto
        var obj1 = {
            sc_promotorId: Parse.User.current().get('p_id'),
            status: true
        };

        // Pega os dados objetos dos 3 localstorage
        var obj2 = JSON.parse(window.localStorage.getItem('novocliente.tipo'));
        var obj3 = JSON.parse(window.localStorage.getItem('novocliente.endereco'));
        var obj4 = JSON.parse(window.localStorage.getItem('novocliente.salao'));
        var obj5 = JSON.parse(window.localStorage.getItem('novocliente.pessoa'));
        var obj6 = JSON.parse(window.localStorage.getItem('novocliente.dados'));

        // Junta os objetos acima
        var objeto1 = extend(obj1, obj2);
        var objeto2 = extend(obj3, obj4);
        var objeto3 = extend(obj5, obj6);

        var juntatudo1 = extend(objeto1, objeto2);

        // Retorna o objeto total
        return extend(juntatudo1, objeto3);

        //Usar:  ClienteService.juntaObjeto();
    };



    svc.loadCliente = function () {
        var novoCliente = window.localStorage.getItem('cliente');
        if (!novoCliente) {
            return {
                novocliente: []
            }
        }
        return JSON.parse(novoCliente);
    };


    return svc;

}])

/* Get Endereço 
@cep 
*/
.factory('getEnderecoAPI', ['$http', function ($http) {
    var Enderecocompleto = {};
    Enderecocompleto.getendereco = function (cep) {
        return $http({
            method: 'post',
            url: 'https://sweethairapp.net.br/index.php?route=api/rest_api/getaddressbyzip',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: 'zip=' + cep
        });
    };
    return Enderecocompleto;


}]);