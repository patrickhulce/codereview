import os
import smtplib

from email.mime.text import MIMEText
from flask import Flask, redirect, url_for, jsonify, request, json

app = Flask(__name__)

def get_project_path(project):
	return "data/_projects/%s.json" % project.lower().replace("[^a-z0-9]","")

def get_email_config():
	config = {}
	with open("email.pref","r") as f:
		config["server"] = f.readline().strip()
		config["from_addr"] = f.readline().strip()
		config["user"] = f.readline().strip()
		config["password"] = f.readline().strip()
	return config

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

@app.route("/email",methods=['POST'])
def send_email():
	try:
		email_config = get_email_config()
		if request.method == 'POST' and email_config is not None:
			data = json.loads(request.data)

			me = email_config['from_addr']
			you = data['to_addr']

			msg = MIMEText(data['body'])
			msg['From'] = me
			msg['To'] = you
			msg['Subject'] = data['subject']

			try:
				s = smtplib.SMTP(email_config['server'])
				s.starttls()
				s.login(email_config['user'], email_config['password'])
				s.sendmail(me, [you, me], msg.as_string())
				s.quit()
				return jsonify(status='success')
			except Exception as ex:
				return jsonify(status='error',details=str(ex))
		return jsonify(status='error',details="No email config present")
	except Exception as ex:
		return jsonify(status='error',details=str(ex))


if __name__ == "__main__":
	app.run(port=8000)