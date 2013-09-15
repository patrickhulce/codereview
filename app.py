from flask import Flask, redirect, url_for
app = Flask(__name__)

@app.route("/")
def index():
	return redirect(url_for('static',filename='index.html'))

@app.route("/files/<project>/<user>/<name>/<ext>")
def get_page(project, user, name, ext):
	sanitized = "[^a-z]+"
	project = project.replace(sanitized,"")
	user = user.replace(sanitized,"")
	name = name.replace(sanitized,"")
	ext = ext.replace(sanitized,"")
	filepath = "data/%s/%s/%s.%s" % (project, user, name, ext)
	with open(filepath,"r") as f:
		return f.read()

if __name__ == "__main__":
	app.run(port=8000)