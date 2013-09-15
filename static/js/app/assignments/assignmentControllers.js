angular.module("assignments", [])
    .controller("AssignmentCtrl", ['$scope',
        function($scope) {
            $scope.mode = 'code';
            $scope.selectedPerson = {};
            $scope.assignment = {
                title: 'HW01',
                files: [{
                	'id': 1,
                    'name': 'intro.ml',
                    'problems': [{
                    	'id':1,
                        'name': 'int_of_gem',
                        'signature': 'let int_of_gem'
                    },{
                    	'id':2,
                        'name': 'int_of_treasure',
                        'signature': 'let rec int_of_treasure'
                    },{
                    	'id':3,
                        'name': 'int_of_treasur23e',
                        'signature': 'let rec int_of_treasure'
                    },{
                    	'id':4,
                        'name': 'sd',
                        'signature': 'let rec int_of_treasure'
                    },{
                    	'id':5,
                        'name': 'gdsg',
                        'signature': 'let rec int_of_treasure'
                    },{
                    	'id':6,
                        'name': 'werw',
                        'signature': 'let rec int_of_treasure'
                    },{
                    	'id':7,
                        'name': '2352',
                        'signature': 'let rec int_of_treasure'
                    },{
                    	'id':8,
                        'name': 'sdfsdf',
                        'signature': 'let rec int_of_treasure'
                    },{
                    	'id':9,
                        'name': '23523dsfds',
                        'signature': 'let rec int_of_treasure'
                    },{
                    	'id':10,
                        'name': 'asa',
                        'signature': 'let rec int_of_treasure'
                    },{
                    	'id':11,
                        'name': 'asdher',
                        'signature': 'let rec int_of_treasure'
                    }]
                }, {
                	'id': 20,
                    'name': 'treasure.ml',
                    'problems': [{
                	'id': 24,
                        'name': 'int_of_gem_treasure',
                        'signature': 'let int_of_gem'
                    }]
                }],
                people: [{
                    'id': 'phulce',
                    'name': 'Patrick',
                    'email': "phulce@wharton.edu"
                }, {
                    'id': 'joe',
                    'name': "John",
                    "email": "jdoe@seas.edu"
                }],
                issueTemplates : [{
                	'name' : 'Ugly indentation',
                	'description': 'Check your spaces for tabs settings',
                	'severity' : 'Awful'
                }]
            };
            $scope.selectPerson = function(index) {
                $scope.selectedPerson = $scope.assignment.people[index];
            };
        }
    ])
    .controller("AssignmentCodeCtrl", ['$scope',
        function($scope) {
            $scope.selectedFile = {};
            $scope.selectFile = function(index) {
                $scope.selectedFile = $scope.assignment.files[index];
            };
            $scope.scrollToTop = function() {
                $('html,body').animate({
                	'scrollTop': 0
                }, 500);
            };

            $scope.isSelected = false;
            $scope.selectedProblem = {};
            $scope.selectProblem = function(index) {
                $scope.selectedProblem = $scope.selectedFile.problems[index];
                var offset = utils.getYPositionOfText($scope.selectedProblem.signature, $('#code-view'));
                $('html,body').animate({
                    'scrollTop': offset - 150
                }, 200);
            };

            $scope.$watch("selectedPerson.id + selectedFile.id + selectedProblem.id", function() {
                $scope.isSelected = false;
                var person = $scope.selectedPerson;
                var file = $scope.selectedFile.id;
                var problem = $scope.selectedProblem.id;
                if (person.id === undefined || file === undefined || problem === undefined) return;
                if (person.assessments === undefined) person.assessments = {};
                if (person.assessments[file] === undefined) person.assessments[file] = {};
                if (person.assessments[file][problem] === undefined) person.assessments[file][problem] = {};
                $scope.selectedAssessment = person.assessments[file][problem];
                if($scope.selectedAssessment.issues === undefined) $scope.selectedAssessment.issues = [];
                $scope.isSelected = true;
            });
        }
    ])
    .controller("AssignmentSettingsCtrl", ['$scope','$filter',
        function($scope,$filter) {
        	$scope.severityOptions = app.settings.severityOptions;

        	$scope.exportText = function() {
        		$scope.ioText = $filter("json")($scope.assignment);
        	};

        	$scope.importText = function() {
        		var json = $.parseJSON($scope.ioText);
        		$scope.assignment = json;
        	};

            $scope.addPerson = function() {
                $scope.assignment.people.push({});
            };
            $scope.deletePerson = function(index) {
                $scope.assignment.people.splice(index, 1);
            }
            $scope.addFile = function() {
                $scope.assignment.files.push({
                    'id': utils.newGuid(),
                    'problems': []
                });
            };
            $scope.deleteFile = function(index) {
                $scope.assignment.files.splice(index, 1);
            };
            $scope.addProblem = function(file) {
                file.problems.push({
                    'id': utils.newGuid()
                });
            };
            $scope.deleteProblem = function(file, index) {
                file.problems.splice(index, 1);
            };
            $scope.addIssueTemplate = function() {
            	$scope.assignment.issueTemplates.push({});
            };
            $scope.deleteIssueTemplate = function(index) {
            	$scope.assignment.issueTemplates.splice(index,1);
            };
        }
    ]);
