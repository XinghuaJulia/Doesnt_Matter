from flask import Flask, request, jsonify
import os
import base64
import tensorflow as tf
from tensorflow.keras.models import load_model
import numpy as np
import json


app = Flask(__name__)


@app.route("/")
def home():
    return jsonify({"message": "Hello from backend"})

@app.route("/", methods=['POST'])
def upload():
    file = request.get_data('image')

    processed = json.loads(file)["image"]

    # data = base64.b64decode(processed).decode('utf-8')

    data = base64.b64decode(processed).decode('utf-8')

    # # Load the image to predict
    img = tf.image.resfile(data, (256,256))
    x = data.img_to_array(img)



    loaded_model = load_model(os.path.join('./models/trashclassifier.keras','trashclassifier.keras'))

    # Make the prediction
    prediction = loaded_model.predict(np.expand_dims(x/255, 0))
        
    return prediction



if __name__ == '__main__':
    app.run(debug=True)