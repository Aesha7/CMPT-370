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
import db_accounts as ac
import db_events as ev

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
    return ac.get_account_id(request.get_json(), accounts_collection)


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
    return ac.submit_account(request.get_json(),accounts_collection)

@app.route("/add_family", methods=["POST"])
@cross_origin(origins="*")
def AddFamily():
    """Endpoint for adding family member; adds a family member to account. 
    Required request parameters: name, birthday, account_ID

    Returns:
        Response
    """
    return ac.add_family(request.get_json(),accounts_collection)

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
    return ac.delete_family(request.get_json(),accounts_collection)

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
    return ac.edit_family(request.get_json(),accounts_collection)

@app.route("/retrieve_family", methods=["GET"])
@cross_origin(origins="*")
def RetrieveFamily():
    """Endpoint for getting list of family members associated with account. 
    Required request parameters: account_ID

    Returns: Response containing list of family members
    Possible error messages:
        "Error: account not found"
    """
    return ac.retrieve_family(request.get_json(),accounts_collection)

@app.route("/retrieve_events", methods=["GET"])
@cross_origin(origins="*")
def RetrieveEvents():
    """Endpoint for getting list of all events in database. 
    Required request parameters: none

    Returns:
        Response containing list of events
    """
    return ev.retrieve(request.get_json(), events_collection)

@app.route("/retrieve_courses", methods=["GET"])
@cross_origin(origins="*")
def RetrieveCourses():
    """Endpoint for getting list of all courses in database. 
    Required request parameters: none

    Returns:
        Response containing list of courses
    """
    return ev.retrieve(request.get_json(), courses_collection)

@app.route("/get_course", methods=["GET"])
@cross_origin(origins="*")
def GetCourse():
    """Endpoint for getting a single course.
    Required request parameters: name

    Returns:
        Response containing course JSON data
    Possible error messages:
        "Error: event not found"
    """
    return ev.get(request.get_json(), courses_collection)
    
@app.route("/get_event", methods=["GET"])
@cross_origin(origins="*")
def GetEvent():
    """Endpoint for getting a single event.
    Required request parameters: name

    Returns:
        Response containing event JSON data
    Possible error messages:
        "Error: event not found"
    """
    return ev.get(request.get_json(), events_collection)

@app.route("/add_event", methods=["POST"])
@cross_origin(origins="*")
def AddEvent():
    """Endpoint for adding an event.

    Returns: Response
    Possible error messages:
        "Error: event name already exists"
    """
    # TODO: add event parameters
    return ev.add(request.get_json(), events_collection)

@app.route("/add_course", methods=["POST"])
@cross_origin(origins="*")
def AddCourse():
    """Endpoint for adding a course.

    Returns: Response
    Possible error messages:
        "Error: event name already exists"
    """
    # TODO: add event parameters
    return ev.add(request.get_json(), courses_collection)

@app.route("/add_course_user", methods=["POST"])
@cross_origin(origins="*")
def AddCourseToUser():
    """Endpoint for adding a course to a user's schedule. Also adds the user to the course's users list. 
    Required request parameters: account_ID, user_name, course_name

    Returns: Response
    Possible error messages:
        "Error: course not found"
        "Error: course already on user's course list"
        "Error: account not found"
        "Error: user not found"
    """
    request_data = request.get_json()
    resp = Response()
    resp.headers['Access-Control-Allow-Headers']="*"

    course = courses_collection.find_one({"name": request_data["course_name"]})
    enrolled = course["enrolled"]
    if not course:
        resp.status_code=400
        resp.data=json.dumps("Error: course not found")
        return resp
    
    account = accounts_collection.find_one({"_id": ObjectId(request_data["account_ID"])})
    if not account:
        resp.status_code=400
        resp.data=json.dumps("Error: account not found")
        return resp
    
    else:
        # Finds user and gets their current course list
        users = account["users"]
        user_found=False
        for user in users:
            if user["name"] == request_data["user_name"]:
                courses = user["courses"]
                user_id = user["_id"]
                user_found=True
                break

        if not user_found:
            resp.status_code=400
            resp.data=json.dumps("Error: user not found")
            return resp
        
        # Check if course already in list.
        for course in courses:
            if course["name"] == request_data["course_name"]:
                resp.status_code=400
                resp.data=dumps("Error: course already on user's course list")
                return resp
            
        courses.append(course)
        enrolled.append({"_id":user_id, "name":request_data["user_name"]})
        accounts_collection.update_one({"_id": ObjectId(request_data["account_ID"]), "users.name" :request_data["user_name"]}, 
                                               {"$set":{"users.$.courses" : courses}})
        courses_collection.update_one({"name": request_data["course_name"]}, 
                                               {"$set":{"enrolled" : enrolled}})
        return resp
    
@app.route("/add_event_user", methods=["POST"])
@cross_origin(origins="*")
def AddEventToUser():
    """Endpoint for adding a course to a user's schedule.
    Required request parameters: account_ID, user_name, event_name

    Returns: Response
    Possible error messages:
        "Error: event not found"
        "Error: event already on user's event list"
        "Error: account not found"
        "Error: user not found"
    """
    request_data = request.get_json()
    resp = Response()
    resp.headers['Access-Control-Allow-Headers']="*"

    event = events_collection.find_one({"name": request_data["event_name"]})
    if not event:
        resp.status_code=400
        resp.data=json.dumps("Error: event not found")
        return resp
    
    account = accounts_collection.find_one({"_id": ObjectId(request_data["account_ID"])})
    if not account:
        resp.status_code=400
        resp.data=json.dumps("Error: account not found")
        return resp
    
    else:
        # Finds user and gets their current event list
        users = account["users"]
        user_found=False
        for user in users:
            if user["name"] == request_data["user_name"]:
                events = user["events"]
                user_found=True
                user_id = user["_id"]
                break

        if not user_found:
            resp.status_code=400
            resp.data=json.dumps("Error: user not found")
            return resp
        
        # Check if event already in list
        for event in events:
            if event["name"] == request_data["event_name"]:
                resp.status_code=400
                resp.data=dumps("Error: event already on user's event list")
                return resp
            
        events.append(event)
        enrolled = event["enrolled"]
        enrolled.append({"_id":user_id, "name":request_data["user_name"]})
        accounts_collection.update_one({"_id": ObjectId(request_data["account_ID"]), "users.name" :request_data["user_name"]}, 
                                               {"$set":{"users.$.events" : events}})
        events_collection.update_one({"name": request_data["event_name"]}, 
                                               {"$set":{"enrolled" : enrolled}})
        return resp

@app.route("/retrieve_user_events", methods=["GET"])
@cross_origin(origins="*")
def RetrieveUserEvents():
    """Endpoint for getting list of events user is enrolled in. 
    Required request parameters: account_ID, name

    Returns: Response containing list of events user is enrolled in
    Notes: Currently returns all data associated with events user is registered in - this includes list of all users enrolled in event
    Possible error messages:
        "Error: account not found"
        "Error: user not found"
    """
    return (RetrieveUserEnrollments(request.get_json, "events"))
    
def RetrieveUserEnrollments(request_data, enrollmentType):
    """_summary_

    Args:
        request_data (Request): request
        enrollmentType (Str): "events" or "courses"

    Returns:
        _type_: _description_
    """
    resp = Response()
    resp.headers['Access-Control-Allow-Headers'] = '*'

    request_data = request.get_json()
    account= accounts_collection.find_one({"_id": ObjectId(request_data["account_ID"])})

    # Ensures account is found
    if not account:
        resp.status_code=400
        resp.data=dumps("Error: account not found")
        return resp
    
    # Finds user and gets their current course list
    users = account["users"]
    for user in users:
        if user["name"] == request_data["name"]:
            resp.data=dumps(user[enrollmentType])
            return resp

    else:
        resp.status_code=400
        resp.data=json.dumps("Error: user not found")
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
