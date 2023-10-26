# General API note: when an invalid request is sent by the client (ex. trying an invalid password/email combination) the status code of the response is set to 400

from flask import Flask
from flask import request
from flask import Response
from flask import abort
from flask import make_response
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from flask_cors import CORS, cross_origin
import json
from bson.objectid import ObjectId
from bson.json_util import dumps

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
events_collection = db["events_collection"]
courses_collection = db["courses_collection"]

app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


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

#app.config['CORS_HEADERS'] = 'Content-Type' # CORS setup

#Routes 
@app.route("/")
@cross_origin(origins='*')
def hello_world():
    return "Hello, World!"

@app.route('/get_id')
@cross_origin(origins='*')
def GetAccountID():
    """Retrieves the _id of an account from an email and password. An _id currently gives read/write access to most values in the account document. 
    Required request parameters: email, password



    Returns:
        Response: contains _id of database document with given email if successful, else has status_code 400
        Possible error messages: "Password is incorrect", "Email not found"
    """
    # TODO: assumes password is stored in plaintext 
    resp = Response()
    request_data = request.get_json()
    account = accounts_collection.find_one({"email": request_data["email"]})
    if account:
        if account["password"] == request_data["password"]:
            resp.data = json.dumps(str(account["_id"]))
        else:
            resp.data=json.dumps("Password incorrect")
            resp.status_code=400
    else:
        resp.data=json.dumps("Email not found")
        resp.status_code=400
    
    return resp

# Test function - returns response with status_code 400 and an error message in resp.data
@app.route('/test_error')
@cross_origin(origins='*')
def resource():
    error_message = json.dumps({'Message': 'error message'})
    resp = Response()
    resp.status_code=400
    resp.data=error_message
    return resp




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
       resp.status_code=400
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

    resp=Response()
    resp.headers['Access-Control-Allow-Headers'] = '*'

    request_data = request.get_json()
    account_doc = accounts_collection.find_one({"_id": ObjectId(request_data["account_ID"])})
    user_details = {
        "name": request_data["name"],
        "birthday": request_data["birthday"],
        "isParent": False,
        "events": []
    }

    # Ensures account is found
    if account_doc:
        family_list = account_doc["users"]

        # Searches through account's list of family members to find if name already used
        name_exists = False
        for user in family_list:
            if user["name"] == request_data["name"]:
                name_exists = True
                break

        if name_exists:
            resp.status_code=400
            resp.data=json.dumps("Error: name already in use")
            return resp
    
    else:
        resp.status_code=400
        resp.data=json.dumps("Error: account not found")
        return resp

    # Takes the existing list of family members and adds the new family member to it
    family_list.append(user_details)


    # Updates users list to new list
    accounts_collection.update_one({"_id": ObjectId(request_data["account_ID"])},{"$set":{"users":family_list}})
    resp.data=json.dumps("Success")
    return resp

@app.route("/remove_family", methods=["POST"])
@cross_origin(origins="*")
def DeleteFamily():
    """Endpoint for deleting family member; deletes a family member to account. 
    Required request parameters: name, account_ID

    Returns:
        Response
    
    Possible Responses (frontend should handle): 
        "User successfully removed"
        "Error: account not found"
        "Error: user not found"
    """
    # Response
    resp=Response()
    resp.headers['Access-Control-Allow-Headers'] = '*'

    request_data = request.get_json()
    account_doc = accounts_collection.find_one({"_id": ObjectId(request_data["account_ID"])})

    # Ensures account is found
    if account_doc:
        family_list = account_doc["users"]

        # Searches through account's list of family members to find one that matches name
        user_removed = False
        for user in family_list:
            if user["name"] == request_data["name"]:
                family_list.remove(user)
                # Updates users list to new list
                accounts_collection.update_one({"_id": ObjectId(request_data["account_ID"])},{"$set":{"users":family_list}})
                user_removed = True
                break
        if user_removed:
            resp.data=json.dumps("User successfully removed")
        else:
            resp.status_code=400
            resp.data=json.dumps("Error: user not found")
    
    else:
        resp.status_code=400
        resp.data=json.dumps("Error: account not found")

    return resp

@app.route("/edit_family", methods=["POST"])
@cross_origin(origins="*")
def EditFamily():
    """Endpoint for adding editing family member; edits a family member's details. 
    Required request parameters: old_name, new_name, birthday, account_ID. To keep a field the same, send an empty string.

    Note: if new_name is already used, the user's name will not be changed and an error message will be sent as a response. However, all other modifications will still happen. 

    Returns:
        Response
            Possible response data: "Success", "Error: No user by that name found",  "Error: account not found", "Error: user with name already exists in account"
    """
    # TODO: untested! test when frontend has ability to edit family member
    # TODO: add any required error testing

    resp=Response()
    resp.headers['Access-Control-Allow-Headers'] = '*'

    request_data = request.get_json()
    account_doc = accounts_collection.find_one({"_id": ObjectId(request_data["account_ID"])})
    old_name = request_data["old_name"]
    new_name = request_data["new_name"]
    birthday = request_data["birthday"]

    # Ensures account is found
    if account_doc:
        family_list = account_doc["users"]

        # Searches through account's list of family members to find user
        user_found = False
        for user in family_list: # Probably should just ask the collection instead of for loop, but this is easier
            if user["name"] == old_name:
                user_found = True
                break
        

        if user_found:
            #Sets new birthday
            if not (birthday == ""):
                # Error here
                accounts_collection.update_one({"_id":"acount_ID", "users.list" :{"$elemMatch" : {"name" : "old_name"}}}, {"$set":{"users.list.$.birthday" : "birthday"}})
            
            #Sets new name. Must be done after all other updates, or the name will change and we won't be able to find the user. 
            if not (new_name == ""):
                for user in family_list:
                    if user["name"] == new_name: # Looks for user with new_name
                        resp.status_code=400
                        resp.data=json.dumps("Error: user with name already exists in account")
                        return resp 
                        
                accounts_collection.update_one({"_id":"acount_ID", "users.list" :{"$elemMatch" : {"name" : "old_name"}}}, {"$set":{"users.list.$.name" : "new_name"}})
            resp.data=json.dumps("Success")

        else:
            resp.status_code=400
            resp.data=json.dumps("Error: No user by that name found")

    else:
        resp.status_code=400
        resp.data=json.dumps("Error: account not found")
        return resp

    return resp

@app.route("/retrieve_family", methods=["GET"])
@cross_origin(origins="*")
def RetrieveFamily():
    """Endpoint for getting list of family members associated with account. 
    Required request parameters: account_ID

    Returns: Response containing list of family members
    Possible error messages:
        "Error: account not found"
    """

    resp = Response()
    resp.headers['Access-Control-Allow-Headers'] = '*'

    request_data = request.get_json()
    account_doc = accounts_collection.find_one({"_id": ObjectId(request_data["account_ID"])})

    # Ensures account is found
    if account_doc:
        resp.data = json.dumps(account_doc["users"])

    else:
        resp.status_code=400
        resp.data=json.dumps("Error: account not found")
    return resp

@app.route("/retrieve_events", methods=["GET"])
@cross_origin(origins="*")
def RetrieveEvents():
    """Endpoint for getting list of all events in database. 
    Required request parameters: none

    Returns:
        Response containing list of events
    """

    resp = Response()
    resp.headers['Access-Control-Allow-Headers'] = '*'
    events = events_collection.find()
    event_list=[]
    for event in events:
        event_list.append(event)
    resp.data = dumps(event_list)
    return resp

@app.route("/retrieve_courses", methods=["GET"])
@cross_origin(origins="*")
def RetrieveCourses():
    """Endpoint for getting list of all courses in database. 
    Required request parameters: none

    Returns:
        Response containing list of courses
    """

    resp = Response()
    resp.headers['Access-Control-Allow-Headers'] = '*'
    courses = courses_collection.find()
    course_list=[]
    for course in courses:
        course_list.append(course)
    resp.data = dumps(course_list)
    return resp

@app.route("/add_event", methods=["POST"])
@cross_origin(origins="*")
def AddEvent():
    """Endpoint for adding an event.

    Returns: Response
    Possible error messages:
        "Error: event name already exists"
    """
    # TODO: add event parameters

    request_data = request.get_json()
    event_details = {
        "name": request_data["name"],
    }

    resp=Response()
    resp.headers['Access-Control-Allow-Headers'] = '*'

    if events_collection.find_one({"name": request_data["name"]}):
        resp.status_code=400
        resp.data=json.dumps("Error: event name already exists")
        return resp
    else:
        events_collection.insert_one(event_details)
    return resp

@app.route("/add_course", methods=["POST"])
@cross_origin(origins="*")
def AddCourse():
    """Endpoint for adding a course.

    Returns: Response
    Possible error messages:
        "Error: course name already exists"
    """
    # TODO: add event parameters

    request_data = request.get_json()
    course_details = {
        "name": request_data["name"],
    }

    resp=Response()
    resp.headers['Access-Control-Allow-Headers'] = '*'

    if courses_collection.find_one({"name": request_data["name"]}):
        resp.status_code=400
        resp.data=json.dumps("Error: course name already exists")
        return resp
    else:
        courses_collection.insert_one(course_details)
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
