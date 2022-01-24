import requests
import time

class NeuralNetwork:
    def __init__(self, chainID = 1):
        self.chainID = chainID
        self.ID = "daDF64HderJ325AFfsd#2efs"
            
    def Train():
        print("Train")
        
    def Predict(self):
        tries = 0
        response = requests.get("https://SafemoonGlubiz.com/Prices")
        while (response.status_code != 200 and tries < 10):
            time.sleep(6)
            tries += 1
        print(response.json())
        return response.json()