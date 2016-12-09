angular.module('appSweet.routes', [])

.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider

    /* Intro */
        .state('intro', {
        url: '/intro',
        templateUrl: 'templates/intro/intro.html',
        controller: 'introCtrl'
    })

    /* Login */
    .state('login', {
        url: '/login',
        templateUrl: 'templates/login/login.html',
        controller: 'loginCtrl'
    })

    /* Cadastro */
    .state('cadastro', {
        url: '/cadastro',
        templateUrl: 'templates/login/cadastro.html',
        controller: 'cadastroCtrl'
    })

    /* Reset Password */
    .state('resetpass', {
        url: '/resetpass',
        templateUrl: 'templates/login/resetpass.html',
        controller: 'resetPassCtrl'
    })

    /* Limbo */
    .state('limbo', {
        url: '/limbo',
        templateUrl: 'templates/login/limbo.html',
        controller: 'limboCtrl'
    })

    /* Inicio */
    .state('menu.inicio', {
        url: '/inicio',
        views: {
            'side-menu': {
                templateUrl: 'templates/usuario/inicio.html',
                controller: 'paginaHome'
            }

        }

    })

    /* Perfil */
    .state('menu.perfil', {
        url: '/perfil',
        views: {
            'side-menu': {
                templateUrl: 'templates/usuario/perfil.html',
                controller: 'promotorPerfil'
            }
        }
    })

    /* CD Perfil */
    .state('menu.cdperfil', {
        url: '/cd-perfil',
        views: {
            'side-menu': {
                templateUrl: 'templates/usuario/cd_perfil.html'
            }
        }
    })

    /* Lista clientes */
    .state('menu.meus_clientes', {
        url: '/meus-clientes',
        views: {
            'side-menu': {
                templateUrl: 'templates/cliente/meus_clientes.html',
                controller: 'meusClientesCtrl'
            }
        }
    })

    /* Novo cliente Escolher 1 */
    .state('menu.novo_cliente', {
        url: '/novo-cliente-esolher',
        views: {
            'side-menu': {
                templateUrl: 'templates/cadastro_cliente/novo_cliente_1_escolher.html',
                controller: 'novoClienteCtrl'
            }
        }
    })

    /* Novo cliente Salao Endereço 2 */
    .state('menu.novo_cliente_salao_endereco', {
        url: '/novo-cliente-salao-endereco',
        views: {
            'side-menu': {
                templateUrl: 'templates/cadastro_cliente/novo_cliente_2_salao_endereco.html',
                controller: 'novoClienteCtrl'
            }
        }
    })

    /* Novo cliente Profissional Endereço 2 */
    .state('menu.novo_cliente_profissional_endereco', {
        url: '/novo-cliente-profissional-endereco',
        views: {
            'side-menu': {
                templateUrl: 'templates/cadastro_cliente/novo_cliente_2_profissional_endereco.html',
                controller: 'novoClienteCtrl'
            }
        }
    })


    /* Novo cliente pessoa 3 */
    .state('menu.novo_cliente_salao', {
        url: '/novo-cliente-salao',
        views: {
            'side-menu': {
                templateUrl: 'templates/cadastro_cliente/novo_cliente_3_salao.html',
                controller: 'novoClienteCtrl'
            }
        }
    })

    /* Novo cliente pessoa 3 */
    .state('menu.novo_cliente_pessoa', {
        url: '/novo-cliente-pessoa',
        views: {
            'side-menu': {
                templateUrl: 'templates/cadastro_cliente/novo_cliente_4_salao_pessoa.html',
                controller: 'novoClienteCtrl'
            }
        }
    })

    /* Novo cliente contato 4 */
    .state('menu.novo_cliente_dados', {
        url: '/novo-cliente-dados',
        views: {
            'side-menu': {
                templateUrl: 'templates/cadastro_cliente/novo_cliente_5_dados.html',
                controller: 'novoClienteCtrl'
            }
        }
    })

    /* Novo cliente equipe 5*/
    .state('menu.novo_cliente_foto', {
        url: '/novo-cliente-foto',
        views: {
            'side-menu': {
                templateUrl: 'templates/cadastro_cliente/novo_cliente_5_foto.html',
                controller: 'novoClienteCtrl'
            }
        }
    })

    /* Novo cliente equipe*/
    .state('menu.novo_cliente_equipe', {
        url: '/novo-cliente-equipe',
        views: {
            'side-menu': {
                templateUrl: 'templates/cadastro_cliente/novo_cliente_equipe.html',
                controller: 'novoClienteCtrl'
            }
        }
    })




    /* Novo cliente resumo aprovar*/
    .state('menu.novo_cliente_resumo', {
        url: '/novo-cliente-resumo',
        views: {
            'side-menu': {
                templateUrl: 'templates/cadastro_cliente/novo_cliente_resumo.html',
                controller: 'novoClienteCtrl'
            }
        }
    })

    /* Pagina cliente */
    .state('menu.cliente', {
        url: '/cliente/:id',
        views: {
            'side-menu': {
                templateUrl: 'templates/cliente/cliente.html',
                controller: 'clienteCtrl'
            }
        }
    })

    /* Pagina Resumo do Pedido */
    .state('menu.cliente-pedido-resumo', {
        url: '/cliente-pedido-resumo/:id',
        views: {
            'side-menu': {
                templateUrl: 'templates/cliente/clientePedidoResumo.html'
            }
        }
    })

    /* Pagina Novo pedido - buscar cliente*/
    .state('menu.novo-pedido', {
        url: '/novo-pedido-busca-cliente',
        views: {
            'side-menu': {
                templateUrl: 'templates/pedido/pedidoNovoBuscaCliente.html',
                controller: 'meusClientesCtrl'
            }
        }
    })

    /* Pagina Novo pedido - Escolhe produtos*/
    .state('menu.novo-pedido-produtos', {
        url: '/novo-pedido-escolhe-produtos/:id',
        views: {
            'side-menu': {
                templateUrl: 'templates/pedido/pedidoNovoEscolheProdutos.html',
                controller: 'novoPedidoCtrl'
            }
        }
    })

    /* Pagina Novo pedido - Carrinho*/
    .state('menu.novo-pedido-carrinho', {
        url: '/novo-pedido-carrinho/:id',
        views: {
            'side-menu': {
                templateUrl: 'templates/pedido/pedidoNovoCarrinho.html',
                controller: 'novoPedidoCtrl'
            }
        }
    })

    /* Pagina Novo pedido - Checkout*/
    .state('menu.novo-pedido-checkout', {
        url: '/novo-pedido-checkout/:id',
        views: {
            'side-menu': {
                templateUrl: 'templates/pedido/pedidoNovoCheckout.html',
                controller: 'novoPedidoCtrl'
            }
        }
    })

    /* Pagina Novo pedido - Checkout*/
    .state('menu.novo-pedido-resumo', {
        url: '/novo-pedido-resumo/:id',
        views: {
            'side-menu': {
                templateUrl: 'templates/pedido/pedidoNovoResumo.html',
                controller: 'novoPedidoCtrl'
            }
        }
    })

    /* Pagina Configurações*/
    .state('menu.configuracoes', {
        url: '/config/',
        views: {
            'side-menu': {
                templateUrl: 'templates/configuracoes/configuracoes.html',
                controller: 'configCtrl'
            }
        }
    })

    /* Pagina Termos e Condições */
    .state('menu.termos', {
        url: '/termos/',
        views: {
            'side-menu': {
                templateUrl: 'templates/configuracoes/termos.html'
                    //                controller: 'configCtrl'
            }
        }
    })

    .state('menu', {
        url: '/side-menu',
        abstract: true,
        templateUrl: 'templates/menu.html'
    })





    ;

    // if none of the above states are matched, use this as the fallback

    $urlRouterProvider.otherwise('login');
    //$urlRouterProvider.otherwise('/side-menu/inicio');




});