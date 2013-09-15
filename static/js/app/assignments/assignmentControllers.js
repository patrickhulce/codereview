angular.module("assignments",[])
	.controller("AssignmentCtrl",['$scope',function($scope) {
		$scope.mode = 'code';
		$scope.selectedPerson = {};
		$scope.assignment = {
			title : 'HW01',
			files : [{'name': 'intro.ml', 'problems':[{'name': 'int_of_gem','signature': 'let int_of_gem'}]}, {'name': 'treasure.ml', 'problems':[{'name': 'int_of_gem','signature': 'let int_of_gem'}]}],
			people : [{ 'id' : 'phulce', 'name' : 'Patrick', 'email': "phulce@wharton.edu"}, {'id' : 'joe', 'name':"John","email":"jdoe@seas.edu"}]
		};
		$scope.selectPerson = function(index) {
			$scope.selectedPerson = $scope.assignment.people[index];
		};
	}])
	.controller("AssignmentCodeCtrl",['$scope',function($scope) {
		$scope.selectedFile = {};
		$scope.selectFile = function(index) {
			$scope.selectedFile = $scope.assignment.files[index];
		};
	}])
	.controller("AssignmentSettingsCtrl",['$scope',function($scope) {
		$scope.addPerson = function() {
			$scope.assignment.people.push({});
		};
		$scope.deletePerson = function(index) {
			$scope.assignment.people.splice(index,1);
		}
		$scope.addFile = function() {
			$scope.assignment.files.push({
				problems : []
			});
		};
		$scope.deleteFile = function(index) {
			$scope.assignment.files.splice(index,1);
		};
		$scope.addProblem = function(file) {
			file.problems.push({});
		};
		$scope.deleteProblem = function(file, index) {
			file.problems.splice(index,1);
		};


	}]);