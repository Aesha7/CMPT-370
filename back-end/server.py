from flask import Flask
from flask import request
from flask import Response
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from flask_cors import CORS, cross_origin
import json

# Connecting to MongoDB: 
# DB password: CPj0i24mLlKvkskt
# DB API key: mCh55pfNYQJMiQbeVKaljoU5CqDOdQp9aaGvo9IA8jxLhr9G22UvtSuy8LdFF64U (probably don't need this)
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
accounts_collection = db["accounts_collection"]


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
CORS(app)

#app.config['CORS_HEADERS'] = 'Content-Type' # CORS setup

@app.route("/")
@cross_origin(origins='*')
def hello_world():
    return "Hello, World!"


@app.route('/view_account_list')
@cross_origin(origins='*')
def ViewAccountList():
    """Returns a list of all account names.

    Returns:
        _type_: _description_
    """
    result = my_collection.find()
    response_body = ""
    if result:
        for doc in result:
            response_body = response_body +"\n" +((doc["name"]))
    else:
        print("Error: no documents found.")
    return response_body

@app.route("/submit_application", methods=["POST"])
@cross_origin(origins="*")
def SubmitAccount():
    """Endpoint for account registration; registers an account with provided information. 

    Returns:
        Response
    """
    request_data = request.get_json()
    account_details = {
        "email": request_data["email"],
        "waiver": request_data["waiver"],
        "password": request_data["password"],
        "phone": request_data["phone"],
        "staffLevel": 0,
        "users": [{
            "name": request_data["name"],
            "birthday": request_data["birthday"],
            "isParent": True
        }]
    }
    

    # Response
    resp=Response()
    resp.headers['Access-Control-Allow-Headers'] = '*'

    # Checks if email is already in database
    if accounts_collection.find_one({"email": request_data["email"]}):
       resp.data = json.dumps("Email already in use!")
    
    else:
        # Adds document to collection 
        accounts_collection.insert_one(account_details)
        resp.data = json.dumps("Success")  

    return resp

@app.route("/add_family", methods=["POST"])
@cross_origin(origins="*")
def AddFamily():
    """Endpoint for adding family member; adds a family member to account. 
    Required request parameters: name, birthday, account_ID

    Returns:
        Response
    """
    # TODO: untested! test when frontend has ability to add family member
    # TODO: add any required error testing, response data (make sure name doesn't already exist in account)
    request_data = request.get_json()
    account_doc = accounts_collection.find_one({"_id": request_data["account_ID"]})
    user_details = {
        "name": request_data["name"],
        "birthday": request_data["birthday"],
        "isParent": False
    }

    # Takes the existing list of family members and adds the new family member to it
    new_users_list = account_doc["users"].append(user_details)
    
    # Response
    resp=Response()
    resp.headers['Access-Control-Allow-Headers'] = '*'

    # Updates users list to new list
    accounts_collection.update_one(account_doc,{"$set":{"users":new_users_list}})
    return resp

if(__name__ == "__main__"):
    app.run(debug=True)

# Connects to database
database = db.DB_Connection()


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
