from flask import Flask
app = Flask(__name__)

@app.route("/files/<user>/<name>")
def get_page(user, name):
	return ""

if __name__ == "__main__":
	app.run()