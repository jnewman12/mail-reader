var app = angular.module("myApp", []);

app.config(function($routeProvider) {
	$routeProvider.when('/', {
		templateUrl: 'templates/home.html',
		controller: 'HomeController'
	})
	.when('/settings', {
		templateUrl: 'templates/settings.html',
		controller: 'SettingsController'
	})
	.otherwise({
		redirectTo: '/'
	});
});

app.service('mailService', ['$http', '$q', function($http, $q) {
	var getMail = function() {
		return $http({
			method: 'GET',
			url: '/api/mail'
		})
	};

	var sendEmail = function(mail) {
		var d = $q.defer();
		$http({
			method: 'POST',
			dat: mail,
			url: '/api/send'
		}).success(function(data, status, headers) {
			d.resolve(data);
		}).error(function(data, status, headers) {
			d.reject(data);
		});
		return d.promise;
	};

	return {
		getMail: getMail,
		sendEmail: sendEmail
	};

}]);

app.controller('HomeController', function($scope) {
	$scope.selectedMail;

	$scope.setSelectedMail = function(mail) {
		$scope.selectedMail = mail;
	}

	$scope.isSelected = function(mail) {
		if ($scope.selectedMail) {
			return $scope.selectedMail = mail;
		}
	}
});

app.controller('MailListingController', ['$scope', 'mailService', 
	function($scope, mailService) {
		$scope.email = [];

		mailService.getMail()
		.success(function(data, status, headers) {
			$scope.email = data.all
		})
		.error(function(data, status, headers){
		  /* handle error */
	  });
  }
]);

app.controller('ContentController', ['$scope', '$rootScope', 'mailService', function($scope, $rootScope, mailService) {
	$scope.showingReply = false;
	$scope.reply = {};

	$scope.toggleReplyForm = function() {
	  $scope.showingReply = !$scope.showingReply;
	  $scope.reply = {};
	  $scope.reply.to = $scope.selectedMail.from.join(', ');
	  $scope.reply.body = "\n\n ------------------------------------------------- \n\n" + $scope.selectedMail.body;
	};

	$scope.sendReply = function() {
		$scope.showingReply = false;
		$rootScope.loading = true
		mailService.sendEmail($scope.reply)
		.then(function(status) {
			$rootScope.loading = false;
		}, function(error) {
			$rootScope.loading = false;
		});
	}

	$scope.$watch('selectedMail', function(evt) {
		$scope.showingReply = false;
		$scope.reply = {};
	});
}]);

app.controller('SettingsController', function($scope) {
	$scope.settings = {
		name: 'James',
		email: 'james@mail.com',
		age: 24
	}
	$scope.updateSettings = function() {
		console.log('function called');
	}
});