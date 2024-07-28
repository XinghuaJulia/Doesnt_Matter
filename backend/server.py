from flask import Flask, request, jsonify
import os
import base64
import tensorflow as tf
from tensorflow.keras.models import load_model
import numpy as np
import matplotlib.pyplot as plt
import json
import cv2

from flask_cors import CORS, cross_origin


app = Flask(__name__)

CORS(app, resources={r'/*': {'origins': '*'}})


@app.route("/")
def home():
    return jsonify({"message": "Hello from backend"})

@app.route("/", methods=['POST'])
def upload():
    file = request.get_data('image')

    processed = json.loads(file)["image"]

    # data = base64.b64decode(processed).decode('utf-8')

        
    def readb64(encoded_data):
        nparr = np.frombuffer(base64.b64decode(encoded_data), np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        return img


    img_test = readb64(processed)


    resize = tf.image.resize(img_test, (256,256))


    loaded_model = load_model(os.path.join('./models','trashclassifier4.h5'))

    arr = loaded_model.predict(np.expand_dims(resize/255, 0))

    yhat_list = arr.tolist()[0]
    max_index = yhat_list.index(max(yhat_list))

    lst = ['cardboard', 'cigarette butt',
           'e-waste', 'glass', 'medical waste',
           'metal waste', 'paper waste','plastic waste']
    result = lst[max_index - 1]

    # result = 'cigarette'

    # # if max_index == 0:
    # #     result = 'cigarette'
    # # elif max_index == 1:
    # #     result = 'plastic bag'
    # # elif max_index == 2:
    # #     result = 'platic bottle'
    # # elif max_index == 3:
    # #     result = 'plastic container'
    # # else:
    # #     result = 'plastic cup'

    return jsonify({"message": result})

    # return jsonify({"message": "hi from POST req"})



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000,debug=True)