angular.module('appSweet', ['ionic', 'appSweet.controllers', 'appSweet.factories', 'appSweet.routes', 'appSweet.services', 'appSweet.pagClienteDirective', 'appSweet.resumoPedidoDirective', 'appSweet.moduloPedido', 'appSweet.moduloLogin', 'appSweet.moduloNovoCliente', 'ngCordova', 'ngMask'])

.run(function ($ionicPlatform, $state) {

    //Parser server method
    Parse.initialize("kSKMWbyC1qwCenAWynxK4fY7KH4vXbfpHrYddi3X", "HcXj2gzELJwheFPUqmB0sJPXttbyjFx3ipPYf1pX");
    Parse.serverURL = 'https://parseapi.back4app.com';



    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        /* Valida se existe InApp Browser */
        if (window.cordova && window.cordova.InAppBrowser) {
            window.open = window.cordova.InAppBrowser.open;
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
        if (Parse.User.current()) {
            $state.go('menu.inicio')
        } else {
            if (window.localStorage.getItem('introducao') === "introOK") {
                $state.go('login');
            } else {
                $state.go('intro');
            }
        }

    });
})

.config(function ($ionicConfigProvider) {
    $ionicConfigProvider.views.maxCache(5);

    // note that you can also chain configs
    $ionicConfigProvider.backButton.text('Voltar');


    /* Opções do InAppBrowser */
    var defaultOptions = {
        clearcache: 'no',
        closebuttoncaption: 'Fechar'
    };

    document.addEventListener("deviceready", function () {
        $cordovaInAppBrowserProvider.setDefaultOptions(options)

    }, false);


});