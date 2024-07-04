import os
import base64
import tensorflow as tf
from tensorflow.keras.models import load_model
import numpy as np
import matplotlib.pyplot as plt
import json
import cv2

img_path = './testing_img/plasticcontainer_0.jpg'

def read_file_as_base64(file_path):
    with open(file_path, 'rb') as file:
        file_content = file.read()
        base64_encoded_data = base64.b64encode(file_content)
        base64_string = base64_encoded_data.decode('utf-8')
    return base64_string

base64_image_data = read_file_as_base64(img_path)


def readb64(encoded_data):
   nparr = np.frombuffer(base64.b64decode(encoded_data), np.uint8)
   img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
   return img


img_test = readb64(base64_image_data)




resize = tf.image.resize(img_test, (256,256))


loaded_model = load_model(os.path.join('./models','trashclassifier.h5'))

arr = loaded_model.predict(np.expand_dims(resize/255, 0))

yhat_list = arr.tolist()[0]
max_index = yhat_list.index(max(yhat_list))
print(max_index)

if max_index == 0:
  print('cigarette')
elif max_index == 1:
  print('plastic bag')
elif max_index == 2:
  print('plastic bottle')
elif max_index == 3:
  print('plastic container')
else:
  print('plastic cup')