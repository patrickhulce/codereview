angular.module("issues",[])
	.controller('IssuesCtrl', ['$scope',
        function($scope) {
            var defaultSeverity = function() {
                return $scope.severityOptions[0];
            };

            $scope.issues = [];
            $scope.severityOptions = ['Good', 'Ugly', 'Bad'];
            $scope.issue = {};

            $scope.filteredIssues = function(problem) {
            	var user = $scope.selectedPerson.id;
            	var file = $scope.selectedFile.name;
            	if(user === undefined || file === undefined || problem.name === undefined) return [];
            	var filtered = [];
            	for(var i=0;i<$scope.issues.length;i++) {
            		var issue = $scope.issues[i];
            		if(issue.problem == problem.name && issue.file == file) filtered.push(issue);
            	}
            	return filtered;
            };

            $scope.selectIssue = function(index) {
                $scope.issue = $scope.issues[index];
                $scope.issue.index = index;
            }

            $scope.newIssue = function() {
                $scope.issue = {
                    'index': -1,
                    'severity': defaultSeverity()
                };
            }

            $scope.addIssue = function(problem) {
            	$scope.issue.problem = problem.name;
            	$scope.issue.file = $scope.selectedFile.name;
                $scope.issues.push($scope.issue);
                $scope.newIssue();
            }
            $scope.deleteIssue = function() {
                $scope.issues.splice($scope.issue.index, 1);
                $scope.newIssue();
            }

            $scope.newIssue();
        }
    ]);