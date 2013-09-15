var app = {
	settings : {
		'dataUrl' : 'http://localhost:8000/',
        'severityOptions' : ['Awful', 'Bad', 'Ugly', 'Minor', 'Neutral']
	}
};

angular.module("codereview", ['ui.bootstrap','files','assignments','assessments']);
    
