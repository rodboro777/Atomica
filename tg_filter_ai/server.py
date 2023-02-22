from flask import Flask, request
from flask_cors import CORS
import json
from model import TGFilterModel
from utils import import_data

app = Flask(__name__)
cors = CORS(app, origins="*")

# Initialize model.
df = import_data("data.txt")
model = TGFilterModel("bert-base-uncased")
model.load_model("saved_models/version_1.model")

@app.route("/", methods=["POST"])
def classify():
    print("called!!!")
    data = request.get_json(silent=True)
    text = data.get("text")
    res = model.infer(text)
    return json.dumps(res)

if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)