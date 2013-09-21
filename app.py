import os
from flask import Flask, redirect, url_for, jsonify, request
app = Flask(__name__)

def get_project_path(project):
	return "data/_projects/%s.json" % project.lower().replace("[^a-z0-9]","")

@app.route("/")
def index():
	return redirect(url_for('static',filename='index.html'))

@app.route("/files/<project>/<user>/<name>/<ext>")
def get_page(project, user, name, ext):
	sanitized = "[^A-Za-z0-9]+"
	project = project.lower().replace(sanitized,"")
	user = user.lower().replace(sanitized,"")
	name = name.replace(sanitized,"")
	ext = ext.replace(sanitized,"")
	filepath = "data/%s/%s/%s.%s" % (project, user, name, ext)
	try:
		with open(filepath,"r") as f:
			return f.read()
	except:
		return "No file found"

@app.route("/projects/<project>",methods=['GET','POST'])
def get_project(project):
	if not os.path.exists("data/_projects"):
		os.makedirs("data/_projects")
	path = get_project_path(project)
	if request.method == 'POST':
		try:
			with open(path,"w") as f:
				f.write(request.data)
				return jsonify(status="success")
		except Exception as ex:
			return jsonify(status='error',details=str(ex))
	try:
		with open(path,"r") as f:
			return f.read()
	except:
		return jsonify(title='New Project')

if __name__ == "__main__":
	app.run(port=8000)