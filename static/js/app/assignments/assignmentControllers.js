angular.module("assignments", [])
    .controller("AssignmentCtrl", ['$scope', '$http',
        function($scope, $http) {
            $scope.mode = 'code';
            $scope.selectedPerson = {};
            $scope.assignment = {};
            $scope.selectPerson = function(index) {
                $scope.selectedPerson = $scope.assignment.people[index];
            };
            $http.get("assignment_default.json")
                .success(function(data) {
                    $scope.assignment = data;
                });
            $scope.loadAssignment = function() {
                $http.get("/projects/" + $scope.assignment.title)
                    .success(function(data) {
                        $scope.setAssignment(data);
                    });
            };
            $scope.saveAssignment = function() {
                $http.post("/projects/" + $scope.assignment.title, $scope.assignment)
                    .success(function(data) {
                        if(data.status == 'success') alert("Saved successfully");
                    });
            }

            $scope.setAssignment = function(json) {
                $scope.assignment = json;
            }

            var interval = setInterval(function() {
                $scope.saveAssignment();
            }, 60000);
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
                if ($scope.selectedAssessment.issues === undefined) $scope.selectedAssessment.issues = [];
                $scope.isSelected = true;
            });
        }
    ])
    .controller("AssignmentSettingsCtrl", ['$scope', '$filter',
        function($scope, $filter) {
            $scope.severityOptions = app.settings.severityOptions;

            $scope.exportText = function() {
                $scope.ioText = $filter("json")($scope.assignment);
                $scope.setAssignment(json);
            };

            $scope.importText = function() {
                var json = $.parseJSON($scope.ioText);
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
                $scope.assignment.issueTemplates.splice(index, 1);
            };
        }
    ])
    .controller("AssignmentEmailCtrl", ['$scope', '$compile',
        function($scope, $compile) {
            $scope.email = {
                'grade': "",
                'comments': "",
                'data': {}
            };

            $scope.renderEmail = function() {
                var tmps = $scope.assignment.emailTemplate;
                var body = tmps.preamble.replace("%NAME%", $scope.selectedPerson.name);
                body += "\nGrade : " + $scope.email.grade;
                body += "\n" + $scope.email.comments;
                body += "\n" + $('.issues-template').text();
                body += tmps.postscript;
                return body;
            };

            $scope.allData = function() {
                var ret = {
                    'qualityData': [],
                    'testData': [],
                    'severityData': [],
                    'problems': [],
                    'issues': []
                };
                for (var fileId in $scope.selectedPerson.assessments) {
                    var file = utils.find($scope.assignment.files, function(file) {
                        return file.id == fileId;
                    });
                    var problems = $scope.selectedPerson.assessments[fileId];
                    for (var problemId in problems) {
                        var problem = utils.find(file.problems, function(prob) {
                            return problemId == prob.id;
                        });
                        var problemOut = problems[problemId];
                        problemOut.name = problem.name;
                        problemOut.filename = file.name;
                        ret.problems.push(problemOut);
                        ret.issues.push.apply(ret.issues, problemOut.issues);
                    }
                }
                var qualityGroups = utils.groupBy(ret.problems, function(prob) {
                    return prob.quality;
                });
                var testGroups = utils.groupBy(ret.problems, function(prob) {
                    return prob.testing;
                });
                var severityGroups = utils.groupBy(ret.issues, function(issue) {
                    return issue.severity;
                });
                var countFunc = function(kvp) {
                    return {
                        'name': kvp.key,
                        'count': kvp.value.length
                    };
                };
                ret.qualityData = utils.map(utils.dictionaryToArray(qualityGroups), countFunc);
                ret.testData = utils.map(utils.dictionaryToArray(testGroups), countFunc);
                ret.severityData = utils.map(utils.dictionaryToArray(severityGroups), countFunc);
                return ret;
            };

            $scope.percentForGroup = function(row, list) {
                //var max = Math.max.apply(null,utils.map(list,function(r) { return r.count }));
                var max = utils.reduce(list, 0, function(x, y) {
                    return x.count + y
                });
                return row.count * 100 / max;
            };

            $scope.$watch("selectedPerson.id", function() {
                if ($scope.selectedPerson.emailData === undefined) {
                    $scope.selectedPerson.emailData = {
                        'grade': "",
                        'comments': ""
                    };
                }
                $scope.email = $scope.selectedPerson.emailData;
                $scope.email.data = $scope.allData();
            });
        }
    ]);
