from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route('/')
def root():
    return "/ route 200 OK"

@app.route('/test')
def test():
    return "/test route 200 OK"


if __name__ == '__main__':
    app.run("0.0.0.0")
