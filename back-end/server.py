from flask import Flask
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

# Connecting to MongoDB: 
# DB password: CPj0i24mLlKvkskt
uri = "mongodb+srv://CMPT370Team25DB:CPj0i24mLlKvkskt@cmpt370db.godfxkb.mongodb.net/?retryWrites=true&w=majority"
# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))
# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

#Access database and collection "db_1" (placeholder collection)
db = client.CMPT370_Team25
my_collection = db["db_1"]


def readDocuments(collection):
    """Example function for retrieving document. 

    Args:
        collection (Collection): collection to be accessed
    """
    result = collection.find()
    if result:
        for doc in result:
            print("Name: "+ doc['name'])
            print("Email: "+ doc['email'])
    else:
        print("Error: no documents found.")

# readDocuments(my_collection)

def addDocument(collection,doc):
    """Example function for adding a document to a collection.

    Args:
        collection (Collection): collection to be accessed
        doc (String): key-value pairs that define document
    """
    collection.insert_one(doc)

# newDocument = {"name":"John Doe", "email": "john@email.com", "age": 69}
# addDocument(my_collection,newDocument)

app = Flask(__name__)
@app.route("/members")
def members():
    return {"members": ["M1", "M2", "M3"]}

if(__name__ == "__main__"):
    app.run(debug=True)


# To run: cd into the back-end directory

# Set-ExecutionPolicy Unrestricted -Scope Process
# (Allows you to run the script to start the venv)

# .\windowsVenv\Scripts\activate
# to actually start the venv

# py server.py
# to actually run the back end server

# Kiran: When I tried to run the front end I got an error: 'error:03000086:digital envelope routines::initialization error'
#Fix was to run the following in the terminal 
#set NODE_OPTIONS=--openssl-legacy-provider


#CTRL + c to stop the local server




######### TO RUN THE FRONT END ##########

# cd into front-end
# npm start
