var App = angular.module('App', ['pascalprecht.translate','ngRoute','ApiModel','ngSanitize','ngLoadScript','ngMeta']);

App.config(function($routeProvider,ngMetaProvider) {
    $routeProvider

      // route for the home page
      .when('/', {
        templateUrl : 'lib/pages/home.html',
        controller  : 'appCtrl'
      })
      // route for the about page
      .when('/terms', {
        templateUrl : 'lib/pages/terms.html',
        controller  : 'appCtrl'
      })
      .when('/privacy', {
        templateUrl : 'lib/pages/privacy.html',
        controller  : 'appCtrl'
      })
      .when('/guides', {
        templateUrl : 'lib/pages/guides.html',
        controller  : 'appCtrl'
      })
      // route for the contact page
      .when('/view/:orderId', {
        templateUrl : 'lib/pages/test.html',
        controller  : 'pageCtrl'
      })
      .when('/view/:orderId/:slug', {
        templateUrl : 'lib/pages/test.html',
        controller  : 'pageCtrl',
      })
      .when('/event/:eventId', {
        templateUrl : 'lib/pages/event.html',
        controller  : 'pageCtrl'
      })
      .when('/event/:eventId/:slug', {
        templateUrl : 'lib/pages/event.html',
        controller  : 'pageCtrl'
      })
      .otherwise({
                redirectTo: '/'
            });
  });
App.run(['ngMeta', function(ngMeta) {
  ngMeta.init();
}]);
App.filter('ucfirst', function() {
    return function(input, all) {
      var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
      return (!!input) ? input.replace(reg, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
    }
  });
App.filter("un_slug", [ function(){
 return function(str){
    try {
      return (str || '').replace(/-/g, ' ');
    } catch(e) {
      console.error("error in un_slug", e);
      return (str || '');
    }
  }
 }
]);
App.filter("remove_under", [ function(){
 return function(str){
    try {
      return (str || '').replace(/_/g, ' ');
    } catch(e) {
      console.error("error in remove_under", e);
      return (str || '');
    }
  }
 }
]);
App.filter('removeAt', function() {
    return function (value) {
        var s = value;
 var n = s.indexOf('@');
  s = s.substring(0, n != -1 ? n : s.length);
  return s;
    };

  });
App.controller('pageCtrl', function ($scope,$timeout,  $window,$translate,$route,$routeParams,ngMeta,$filter, $location,AppRestangular,anchorSmoothScroll,urlService) {

$scope.$route = $route;


$scope.$location = $location;
     $scope.$routeParams = $routeParams;
     $scope.name = 'pageController';
  if($routeParams.eventId){
    $scope.order_id = $routeParams.eventId
    $scope.pageType = "event";
  }else{
    var the_id = $routeParams.orderId;
    var claveType = the_id.charAt(0).toUpperCase();
    if(claveType == "X"){
      $scope.order_id = the_id.substr(1);
      $scope.pageType = "place";
    }else{
      $scope.order_id = the_id;
      $scope.pageType = "eat";
      console.log("is an eat");
    }

  }
  $scope.message = 'Look! I am an about page.';
  $scope.openInApp = () =>{

    var hash = window.location.hash.split("/");
    console.log(hash);
    if(hash[1] == 'view'){
      var the_id = hash[2].split("?");
      var claveType = the_id[0].charAt(0);
      console.log('clavetype: '+claveType);
      if(claveType == "x"){
        var elID = the_id[0];
      }else{
          var elID = "f"+the_id[0];
      }
      console.log("citywiz://id?cityclave="+elID);

      //deeplink.open("citywiz://id?cityclave="+elID);
      window.open("citywiz://id?cityclave="+elID);
    }
  }
  $scope.openInApptest = () =>{

    var hash = window.location.hash.split("/");
    console.log(hash);
    if(hash[1] == 'view'){
      var the_id = hash[2].split("?");
      var claveType = the_id[0].charAt(0);
      console.log('clavetype: '+claveType);
      if(claveType == "x"){
        var elID = the_id[0];
      }else{
          var elID = "f"+the_id[0];
      }
      console.log("citywiz://id?cityclave="+elID);

      //deeplink.open("citywiz://id?cityclave="+elID);
      window.location.replace("citywiz://id?cityclave="+elID);
    }
  }
//load data
$scope.gotoElement = function (eID){
      // set the location.hash to the id of
      // the element you wish to scroll to.
      urlService.setUrl(eID);
      //$location.hash(eID);
      $location.url("/"+eID);


    };
/************* load dynamic data based on guide ************/
  $scope.loadDetails = function() {
$scope.loaded = false;
    itemdata.get().then(function(data) {

    $scope.card = data;
    if($scope.pageType == 'place'){
      console.log("is place: "+JSON.stringify(data));
    }
    var unslug_cat = $filter('un_slug')(data.cat);
    unslug_cat = $filter('ucfirst')(unslug_cat);
    if(data.cat == 'nightlife'){
    var text = unslug_cat+" en "+data.city;
  }else{
    var text = unslug_cat+" food en "+data.city;
  }
  if($scope.pageType == 'place'){
    var text = unslug_cat;
  };
    ngMeta.setTitle(data.name);
    ngMeta.setTag('description', text);
    ngMeta.setTag('vport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    ngMeta.setTag('image', data.social_imgs[0].img_path);
       //$scope.viewResult();
       // after data has finished loading
       //$scope.viewResult(data.latitude,data.longitude);



        setTimeout(function() {


       $scope.loaded = true;
       $scope.lang = function(){ return $translate.use();}
       $scope.$apply();


    }, 1000);


});


  };
if($scope.pageType == 'eat'){
  var itemdata = AppRestangular.one("id", $scope.order_id);
}else if($scope.pageType = 'place'){
  var itemdata = AppRestangular.one("placeid", $scope.order_id);
}else if($scope.pageType == 'event'){
  var itemdata = AppRestangular.one("eventid", $scope.order_id);
}

  $scope.loadDetails();
//load data ends
});
App.controller('appCtrl', function ($scope,$timeout,  $window,$translate,$route, $location,ngMeta,$routeParams,anchorSmoothScroll,urlService) {
 $scope.$route = $route;
$scope.$location = $location;
     $scope.$routeParams = $routeParams;
     $scope.name = 'appCtrl';
  $scope.helloworld = "hey! hello world!";
  $scope.data = {
  cb2: 'es'
};
  ngMeta.setTag('image', 'http://citywiz.imgix.net/citywiz_cover.png');
   $scope.changeLanguage = function (key) {
    $translate.use(key);
  };
 $scope.gotoElement = function (eID){
      // set the location.hash to the id of
      // the element you wish to scroll to.
      //$location.hash(eID);

      // call $anchorScroll()
      anchorSmoothScroll.scrollTo(eID);

    };

setTimeout(function() {


       $scope.loaded = true;
       var hash = urlService.getUrl();
       $scope.lang = function(){ return $translate.use();}
       if(hash){
            anchorSmoothScroll.scrollTo(hash);
       }
       $scope.$apply();


    }, 500);
});
App.config(['$translateProvider', function ($translateProvider) {
        $translateProvider.translations('en', {
            LANGBOARD: "Your own restaurant ordering app and website",
            APPBOARD: "Get new orders from people visiting your city",
            APPBOARD2: "You're in control with our tools",
            DOWNAPP: "Get the free app!",
            VIEWBLOG: "Your own restaurant ordering app and website",
            APPHERO2: "Promote your restaurant in the Citywiz app and get orders for your restaurant or food truck from our fastest growing local tourism app.",
            APPHERO3: "Your customers can track their orders and receive status notifications. Aditionally you can edit menus, manage orders, set times and send tickets to the kitchen with our printer.",
            PRICINGHERO: "Grow your online sales and connect with more customers",
            ABOUTUSTITLE:"We believe life is easier when you know what's around you.",
            APPABOUTUS: "<p>Citywiz is a free and easy-to-use iPhone\® and Android\® App that will guide you to discover and connect to everything local \(currently in Puerto Rico\).</p><p>If you’re looking for a place to eat, go for a night out, get the intel of nearby events or searching for an adventure on our beautiful island, our app will help you stay connected to everything your city has to offer.</p><p>New city-wizards \(guides\) will be added regularly for you to discover cool and essential things like food, outdoor adventures, music, art, culture and more.</p>",
            TEAMTITLE: "How wonderful to meet you!",
            TEAM: "<p>We are a small but passionate Puerto Rican team focused on delivering new and fun technology products that will help you search and discover.</p>",
            DOWNLOADTITLE: "Your restaurant, Your brand — Online!",
            DOWNLOAD: "We help local restaurants and foodtrucks grow their brand and earn more money by providing online ordering from their own website or app (whitelabel) and tailored marketing tools.",
            DOWNLOADSMALL: "We help local restaurants and foodtrucks grow their brand and earn more money.",
            ARTICLESHERO: "If your restaurant does not have a website, we will build one for you and if it already has, we will integrate the online orders. Have your own mobile app and bring your presence to the app stores and to your clients phones . We'll build your custom mobile app para iPhone and Android.",
            INSTAGRAMCOPY: "Follow our Instagram where we feature Puerto Rico's top places and food tru the lens of awesome local photographers/tourists who love the island and you should follow. Tap on the images for info and credit.",
            PRICINGBASIC: "No problem, get more visits and orders by promoting it on our popular tourism app Citywiz Puerto Rico",
            PRICINGBASICTITLE: "Do you already have an online ordering service for your restaurant?",
            BASICF1: "We will premium feature your restaurant on Citywiz tourism App with a link to your own page or service",
            BASICF2: "1 monthly participation on our Email marketing via Newsletter / Special Anouncements",
            BASICF3: "1 bi-monthly post on Citywiz Social Media profile on Instagram",
            BASICF4: "Supply your own marketing photos",
            BASICPF1: "Unlimited orders commission free",
            BASICPF2: "Your Own Ordering Website (whitelabel)",
            BASICPF3: "Real time order notifications",
            BASICPF4: "SMS(text) and email order status notifications",
            BASICPF5: "Order status tracking page",
            BASICPF7: "Receive orders from Citywiz 'turisteo' App & Citywiz To Go restaurant aggragtor page",
            BASICPF6: "QR code Dine-in Menu Page",
            BASICPF8: "Includes all features on Citywiz Promo Plan",
            BASICPF9: "+",
            BASICPF10: "Accept all major online payment types (credit cards, Paypal)",
            BASICPF11: "Receive orders on your own android phone or tablet or on your merchant website",
            BASICPF12: "Your own restaurant iPhone & Android App",
            BASICPF13: "Your own restaurant landing web page",
            BASICPF14: "Links to your current delivery apps",
            BASICPF15: "Includes all features on Online-Orders Basic Plan",
            BASICPF16: "Join Now",
        })
        .translations('es', {
            BASICPF16: "Únete Ahora",
            BASICPF15: "Incluye todo lo del Online-Orders Basic Plan",
            BASICPF14: "Enlaces a sus aplicaciones actuales de entrega",
            BASICPF13: "Landing web page para tu restaurante",
            BASICPF12: "Su propio app movil de restaurante para iPhone y Android",
            BASICPF11: "Reciba pedidos en su propio teléfono o tableta Android o en su pagina web de comerciante",
            BASICPF10: "Acepte todos los principales tipos de pago en línea (Tarjetas de crédito, Paypal)",
            BASICPF9: "+",
            BASICPF6: "Código QR para página de menú (Dine-in)",
            BASICPF7: "Reciba pedidos de la aplicación Citywiz 'turisteo' y la página del agregador de restaurantes Citywiz To Go",
            BASICPF8: "Incluye todo lo del Citywiz Promo Plan",
            BASICPF1: "Pedidos ilimitados sin comisiones",
            BASICPF2: "Su propia pagina web de pedidos (whitelabel)",
            BASICPF3: "Notificaciones de pedidos en tiempo real",
            BASICPF4: "Notificaciones del estado de pedidos por SMS (texto) e email",
            BASICPF5: "Página para tracking del estado del pedido",
            BASICF4: "Proporcione sus propias fotos para el marketing",
            BASICF3: "1 publicación bimensual en el perfil de Citywiz Social Media en Instagram",
            BASICF2: "1 participación mensual en nuestro marketing por correo electrónico a través de Newsletter / Anuncios especiales",
            BASICF1: "Destacaremos su restaurante en la aplicación de turismo de Citywiz con un enlace a su propia página o servicio",
            LANGBOARD: "Su propia aplicación y sitio web para su restaurante",
            APPBOARD: "Recibe pedidos de personas que visitan tu ciudad",
            APPBOARD2: "Tienes el control con nuestras herramientas",
            DOWNAPP: "¡Descarga el app gratis!",
            VIEWBLOG: "Su propia aplicación y sitio web para su restaurante",
            APPHERO2: "Promociona tu restaurante en el app de Citywiz y obten ordenes para su restaurante o food truck desde nuestra aplicación de turisteo local de mas rapido crecimiento en Puerto Rico.",
            APPHERO3: "Sus clientes pueden rastrear sus pedidos y recibir notificaciones de estado por mensajes de texto. Ademas puedes editar menús, administrar pedidos, establecer horarios y enviar tickets a la cocina con nuestra impresora.",
            PRICINGHERO: "Haga crecer sus ventas en línea y conéctese con más clientes",
            ABOUTUSTITLE:"La vida es más fácil cuando sabes lo que te rodea.",
            APPABOUTUS: "<p>Citywiz es una aplicación de iPhone\® y Android\® gratuita y fácil de usar que te ayudará a descubrir y conectarte con todo lo que te rodea \(actualmente en Puerto Rico\).</p><p>Si estás buscando un lugar para comer, salir de paseo, obtener información de eventos cercanos o buscando una aventura en nuestra hermosa isla, nuestra aplicación te ayudará a mantenerte conectado con todo lo que tu ciudad tiene para ofrecer.</p><p>Nuevos city-wizards \(guías\) serán añadidos regularmente para que continúes descubriendo cosas nuevas y esenciales como comida, aventura, música, arte, cultura y mucho más.</p>",
            TEAMTITLE: "¡Qué maravilloso conocerte!",
            TEAM: "<p>Somos un pequeño pero apasionado equipo puertorriqueño enfocado en brindar nuevos y divertidos productos tecnológicos que te ayudarán a buscar y descubrir.</p>",
            DOWNLOADTITLE: "¡Su restaurante, Su marca — Online!",
            DOWNLOAD: "Ayudamos a los restaurantes y foodtrucks locales a crecer su marca y ganar más dinero a través de pedidos en línea desde su propio sitio web o aplicación (whitelabel) y herramientas de mercadeo a su medida.",
            DOWNLOADSMALL: "Ayudamos a los restaurantes y foodtrucks locales a crecer su marca y ganar más dinero.",
            ARTICLESHERO: "Si tu restaurante no tiene website te construimos uno y si ya tiene le integramos las ordenes online. Tenga su propia aplicación móvil y lleve su presencia a las tiendas de aplicaciones y a los teléfonos de sus clientes. Construiremos su aplicación móvil personalizada para iPhone y Android.",
            INSTAGRAMCOPY: "Sigue nuestro Instagram donde presentamos los mejores lugares y comida de Puerto Rico capturados por increíbles fotógrafos / turisteros locales que aman la isla y los cuales debe seguir. Toque las imágenes para obtener información y crédito.",
            PRICINGBASIC: "No hay problema, obtenga más visitas y ventas promocionándo su restaurante en nuestra popular aplicación de turismo Citywiz Puerto Rico",
            PRICINGBASICTITLE: "¿Ya tienes un servicio de pedidos online para tu restaurante?",

        });
$translateProvider.useSanitizeValueStrategy(null);
$translateProvider.preferredLanguage('es');
}]);
App.service('anchorSmoothScroll', function(){

    this.scrollTo = function(eID) {

        // This scrolling function
        // is from http://www.itnewb.com/tutorial/Creating-the-Smooth-Scroll-Effect-with-JavaScript

        var startY = currentYPosition();
        var stopY = elmYPosition(eID);
        var distance = stopY > startY ? stopY - startY : startY - stopY;
        if (distance < 100) {
            scrollTo(0, stopY); return;
        }
        var speed = Math.round(distance / 100);
        if (speed >= 20) speed = 20;
        var step = Math.round(distance / 25);
        var leapY = stopY > startY ? startY + step : startY - step;
        var timer = 0;
        if (stopY > startY) {
            for ( var i=startY; i<stopY; i+=step ) {
                setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
                leapY += step; if (leapY > stopY) leapY = stopY; timer++;
            } return;
        }
        for ( var i=startY; i>stopY; i-=step ) {
            setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
            leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
        }

        function currentYPosition() {
            // Firefox, Chrome, Opera, Safari
            if (self.pageYOffset) return self.pageYOffset;
            // Internet Explorer 6 - standards mode
            if (document.documentElement && document.documentElement.scrollTop)
                return document.documentElement.scrollTop;
            // Internet Explorer 6, 7 and 8
            if (document.body.scrollTop) return document.body.scrollTop;
            return 0;
        }

        function elmYPosition(eID) {
            var elm = document.getElementById(eID);
            var y = elm.offsetTop;
            var node = elm;
            while (node.offsetParent && node.offsetParent != document.body) {
                node = node.offsetParent;
                y += node.offsetTop;
            } return y;
        }

    };

});
App.service('urlService', function() {
  var urlHash;

  var setUrl = function(hash) {
      urlHash = hash;
  };

  var getUrl = function(){
      return urlHash;
  };

  return {
    setUrl: setUrl,
    getUrl: getUrl
  };

});
