angular.module("assignments", [])
    .controller("AssignmentCtrl", ['$scope', '$http',
        function($scope, $http) {
            $scope.mode = 'code';
            $scope.selectedPerson = {};
            $scope.assignment = {};
            $scope.titleChanged = false;

            $scope.selectPerson = function(index) {
                $scope.selectedPerson = $scope.assignment.people[index];
            };

            $http.get("assignment_default.json")
                .success(function(data) {
                    $scope.assignment = data;
                    $scope.loadAssignment();
                    $scope.fixAssignment();
                });

            $scope.loadAssignment = function() {
                $http.get("/projects/" + $scope.assignment.title)
                    .success(function(data) {
                        $scope.titleChanged = false;
                        $scope.setAssignment(data);
                    });
            };
            $scope.saveAssignment = function() {
                $scope.fixAssignment();
                $http.post("/projects/" + $scope.assignment.title, $scope.assignment)
                    .success(function(data) {
                        $scope.titleChanged = false;
                        console.log(data);
                        if (data.status == "success") $.bootstrapGrowl("Assignment Saved!");
                        else $.bootstrapGrowl("Error saving assignment", {
                            type: 'danger'
                        });
                    })
                    .error(function() {
                        $.bootstrapGrowl("Error saving assignment", {
                            type: 'danger'
                        });
                    });
            }
            $scope.setAssignment = function(assignment) {
                $scope.assignment = assignment;
            };

            $scope.fixAssignment = function() {
                var a = $scope.assignment;
                if (a.people === undefined) a.people = [];
                if (a.files === undefined) a.files = [];
                if (a.issueTemplates === undefined) a.issueTemplates = [];
            }

            $scope.$watch('assignment.title', function(newVal, oldVal) {
                $scope.titleChanged = newVal != oldVal;
            });

            var interval = setInterval(function() {
                if (!$scope.titleChanged) $scope.saveAssignment();
            }, 60000);

            Mousetrap.bind(['command+s', 'ctrl+s'], function() {
                $scope.saveAssignment();
                return false;
            })
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
            };

            $scope.importText = function() {
                var json = $.parseJSON($scope.ioText);
                $scope.setAssignment(json);
                $scope.fixAssignment();
            };

            $scope.addPerson = function() {
                $scope.fixAssignment();
                $scope.assignment.people.push({});
            };
            $scope.deletePerson = function(index) {
                $scope.fixAssignment();
                $scope.assignment.people.splice(index, 1);
            }
            $scope.addFile = function() {
                $scope.fixAssignment();
                $scope.assignment.files.push({
                    'id': utils.newGuid(),
                    'problems': []
                });
            };
            $scope.deleteFile = function(index) {
                $scope.fixAssignment();
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
                $scope.fixAssignment();
                $scope.assignment.issueTemplates.push({});
            };
            $scope.deleteIssueTemplate = function(index) {
                $scope.fixAssignment();
                $scope.assignment.issueTemplates.splice(index, 1);
            };
        }
    ])
    .controller("AssignmentEmailCtrl", ['$scope', '$compile', '$http',
        function($scope, $compile, $http) {
            $scope.email = {
                'styleGrade': "",
                'testingGrade': "",
                'comments': "",
                'data': {}
            };

            $scope.sendEmail = function() {
                var person = $scope.selectedPerson;
                var data = {
                    "to_addr": person.email,
                    "body": $('#email-preview').text(),
                    "subject": "[CIS120] Style Comments " + $scope.assignment.title
                };
                $http.post("/email", data)
                    .success(function(data) {
                        console.log(data);
                        if (data.status == "success")
                            $.bootstrapGrowl("Email sent to " + person.email);
                        else
                            $.bootstrapGrowl("Error sending email", {
                                type: 'danger'
                            });
                    })
                    .error(function(data) {
                        console.log(data);
                        $.bootstrapGrowl("Error sending email", {
                            type: 'danger'
                        });
                    });
            };

            $scope.renderEmail = function() {
                var tmps = $scope.assignment.emailTemplate;
                var issueText = $('.issues-template').text();
                issueText = issueText.replace(/\n+/g, "\n");
                var body = tmps.preamble.replace("%NAME%", $scope.selectedPerson.name);
                body += "\nGrade:\nStyle: " + $scope.email.styleGrade + "/10, Tests: " + $scope.email.testingGrade + "/5";
                body += "\n" + $scope.email.comments;
                body += "\n" + issueText;
                body += tmps.postscript;
                return body;
            };

            $scope.suggestedScore = function() {
                var data = $scope.allData();
                return app.settings.scoreFunction(data.qualityData, data.testData, data.severityData);
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
                var max = utils.reduce(list, 0, function(x, y) {
                    return x.count + y;
                });
                return row.count * 100 / max;
            };

            $scope.displayNameFor = function(type, name) {
                switch (type) {
                    case 'quality':
                        return app.settings.qualityDisplayNames[name];
                    case 'testing':
                        return app.settings.testingDisplayNames[name];
                    case 'severity':
                        return app.settings.severityDisplayNames[name];
                }
            };

            $scope.$watch("selectedPerson.id", function() {
                if ($scope.selectedPerson.emailData === undefined) {
                    $scope.selectedPerson.emailData = {
                        'styleGrade': "",
                        'testingGrade': "",
                        'comments': ""
                    };
                }
                $scope.email = $scope.selectedPerson.emailData;
                $scope.email.data = $scope.allData();
            });
        }
    ]);
