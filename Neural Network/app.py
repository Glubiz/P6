from flask import Flask
from nn import NeuralNetwork as NN
from multiprocessing import Process
from threading import Thread
import requests
import time

import webbrowser

app = Flask(__name__)

@app.route("/train/")
def train():
    print("Training...")
    thread = Thread(target = NN.Train(), args = (10, ))
    thread.start()
    return "200"
    
@app.route("/pred/")
def pred():
    print("Hi")
    Prediction = NN()
    return Prediction.Predict()

if __name__ == '__main__':
    app.run()

    