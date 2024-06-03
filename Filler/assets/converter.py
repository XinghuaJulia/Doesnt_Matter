# from tensorflow import keras
# import tensorflowjs as tfjs

# def importModel(modelPath):
#     model = keras.models.load_model(modelPath)
#     tfjs.converters.save_keras_model(model, "tfjsmodel")

# importModel("modelDirectory")

import tensorflow as tf

def load_graph(frozen_graph_file):
    with tf.gfile.GFile(frozen_graph_file, 'rb') as f:
        graph_def = tf.GraphDef()
        graph_def.ParseFromString(f.read())
    with tf.Graph().as_default() as graph:
        tf.import_graph_def(graph_def, name = 'prefix')
    return graph

if __name__ == '__main__':
    graph = load_graph('trashmodel.pb')
    for op in graph.get_operations():
        abc = graph.get_tensor_by_name(op.name + ':0')
        print(abc)
        