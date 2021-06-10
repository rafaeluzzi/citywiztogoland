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
            LANGBOARD: "Local Discovery Guides",
            APPBOARD: "Your App for Puerto Rico tourism!",
            DOWNAPP: "Get the free app!",
            VIEWBLOG: "View guides & articles",
            APPHERO2: "Citywiz helps you discover #EcoAdventure #Food #Culture #Attractions #Events. Discover and connect to everything local.",
            ABOUTUSTITLE:"We believe life is easier when you know what's around you.",
            APPABOUTUS: "<p>Citywiz is a free and easy-to-use iPhone\® and Android\® App that will guide you to discover and connect to everything local \(currently in Puerto Rico\).</p><p>If you’re looking for a place to eat, go for a night out, get the intel of nearby events or searching for an adventure on our beautiful island, our app will help you stay connected to everything your city has to offer.</p><p>New city-wizards \(guides\) will be added regularly for you to discover cool and essential things like food, outdoor adventures, music, art, culture and more.</p>",
            TEAMTITLE: "How wonderful to meet you!",
            TEAM: "<p>We are a small but passionate Puerto Rican team focused on delivering new and fun technology products that will help you search and discover.</p>",
            DOWNLOADTITLE: "Start discovering your city now!",
            DOWNLOAD: "Our FREE app is available now for iPhone and Android. Download now and get started!",
            ARTICLESHERO: "Discover places to visit, places to eat or stay and meet other tourists through our articles.",
            INSTAGRAMCOPY: "Follow our Instagram where we feature Puerto Rico's top places and food tru the lens of awesome local photographers/tourists who love the island and you should follow. Tap on the images for info and credit."

        })
        .translations('es', {
            LANGBOARD: "Guías de descubrimiento local",
            APPBOARD: "Tu App pal' turisteo!",
            DOWNAPP: "¡Descarga el app gratis!",
            VIEWBLOG: "Ver guías y artículos",
            APPHERO2: "CityWiz te ayuda a descubrir #aventureo #foodeo #turisteo #cultura en Puerto Rico. Descubre y conéctate a todo lo local.",
            ABOUTUSTITLE:"La vida es más fácil cuando sabes lo que te rodea.",
            APPABOUTUS: "<p>Citywiz es una aplicación de iPhone\® y Android\® gratuita y fácil de usar que te ayudará a descubrir y conectarte con todo lo que te rodea \(actualmente en Puerto Rico\).</p><p>Si estás buscando un lugar para comer, salir de paseo, obtener información de eventos cercanos o buscando una aventura en nuestra hermosa isla, nuestra aplicación te ayudará a mantenerte conectado con todo lo que tu ciudad tiene para ofrecer.</p><p>Nuevos city-wizards \(guías\) serán añadidos regularmente para que continúes descubriendo cosas nuevas y esenciales como comida, aventura, música, arte, cultura y mucho más.</p>",
            TEAMTITLE: "¡Qué maravilloso conocerte!",
            TEAM: "<p>Somos un pequeño pero apasionado equipo puertorriqueño enfocado en brindar nuevos y divertidos productos tecnológicos que te ayudarán a buscar y descubrir.</p>",
            DOWNLOADTITLE: "¡Comienza a descubrir tu ciudad ya!",
            DOWNLOAD: "Nuestra aplicación GRATIS ya está disponible para iPhone\® y Android\®. ¡Descargue ahora y comienza a descubrir!",
            ARTICLESHERO: "Descubre lugares para visitar, sitios para comer o quedarse y conoce a otros turistas a través de nuestros artículos.",
            INSTAGRAMCOPY: "Sigue nuestro Instagram donde presentamos los mejores lugares y comida de Puerto Rico capturados por increíbles fotógrafos / turisteros locales que aman la isla y los cuales debe seguir. Toque las imágenes para obtener información y crédito."
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
