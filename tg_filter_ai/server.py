from flask import Flask, request
import json
from model import TGFilterModel
from utils import import_data
import torch

app = Flask(__name__)

# Initialize model.
df = import_data("data.txt")
model = TGFilterModel("bert-base-uncased")
model.load_model("saved_models/version_1.model")

@app.route("/", methods=["POST"])
def classify():
    data = request.get_json(silent=True)
    text = data.get("text")
    return json.dumps({
        "class": model.infer(text)
    })

if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)