from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route('/', methods=['GET'])
def index():
    return "Haloo"


if __name__ == "__main__":
    app.run(debug=True)
