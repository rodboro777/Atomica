# Inspired by https://github.com/susanli2016/NLP-with-Python/blob/master/Text_Classification_With_BERT.ipynb

from model import TGFilterModel
from utils import import_data

# Initialize model.
model = TGFilterModel("bert-base-uncased", 5, 10)

# Train the model.
model.train()