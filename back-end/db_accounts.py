# For additional documentation, please see server.py

from flask import Response
from bson.objectid import ObjectId
from bson.json_util import dumps

def _build_cors_preflight_response():
    response = Response()
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add('Access-Control-Allow-Headers', "*")
    response.headers.add('Access-Control-Allow-Methods', "*")
    return response

def submit_account(request_data, accounts_collection):
    account_details = {
        "email": request_data["email"],
        "waiver": request_data["waiver"],
        "password": request_data["password"],
        "phone": request_data["phone"],
        "staffLevel": 0,
        "users": [{
            "_id": ObjectId(),
            "name": request_data["name"],
            "birthday": request_data["birthday"],
            "level": 1,
            "phone": request_data["phone"],
            "isParent": True,
            "courses":[],
            "events":[],
            "news": False,
            "prom": True
        }]
    }
    
    # Response
    resp=Response()
    resp.headers['Access-Control-Allow-Headers'] = '*'

    # Checks if email is already in database
    if accounts_collection.find_one({"email": request_data["email"]}):
       resp.status_code=400
       resp.data = dumps("Email already in use!")
    
    else:
        # Adds document to collection 
        accounts_collection.insert_one(account_details)
        resp.data = dumps("Success")
    return resp

def get_account_id(request_data, accounts_collection):
    # TODO: assumes password is stored in plaintext 
    resp = Response()
    account = accounts_collection.find_one({"email": request_data["email"]})
    if account:
        if account["password"] == request_data["password"]:
            resp.data = dumps(str(account["_id"]))
        else:
            resp.data=dumps("Password does not match.")
            resp.status_code=400
    else:
        resp.data=dumps("Email not found.")
        resp.status_code=400
    return resp

def get_account_info(request_data, accounts_collection): 
    resp = Response()
    account = accounts_collection.find_one({"_id": ObjectId(request_data["_id"])})
    if not account:
        resp.data=dumps("Error: account not found")
        resp.status_code=400
        return resp
    account.pop("_id")
    # account.pop("users")
    account.pop("password")
    resp.data=dumps(account)
    return resp

def add_family(request_data, accounts_collection):
    resp=Response()
    resp.headers['Access-Control-Allow-Headers'] = '*'
    account_doc = accounts_collection.find_one({"_id": ObjectId(request_data["_id"])})
    user_details = {
        "_id": ObjectId(),
        "name": request_data["name"],
        "birthday": request_data["birthday"],
        "level": 1,
        "phone": request_data["phone"],
        "isParent": False,
        "events": [],
        "courses":[]
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
            resp.data=dumps("Error: name already in use")
            return resp
    
    else:
        resp.status_code=400
        resp.data=dumps("Error: account not found")
        return resp

    # Takes the existing list of family members and adds the new family member to it
    family_list.append(user_details)


    # Updates users list to new list
    accounts_collection.update_one({"_id": ObjectId(request_data["_id"])},{"$set":{"users":family_list}})
    resp.data=dumps("Success")
    return resp
    
def delete_family(request_data, accounts_collection):
    resp=Response()
    resp.headers['Access-Control-Allow-Headers'] = '*'
    account_doc = accounts_collection.find_one({"_id": ObjectId(request_data["_id"])})

    # Ensures account is found
    if account_doc:
        family_list = account_doc["users"]

        # Searches through account's list of family members to find one that matches name
        user_removed = False
        for user in family_list:
            if user["name"] == request_data["name"]:
                if user["isParent"]==True: #prevents user from deleting parent user 
                    resp.status_code=400
                    resp.data=dumps("Error: cannot delete parent")
                    return resp
                family_list.remove(user)
                # Updates users list to new list
                accounts_collection.update_one({"_id": ObjectId(request_data["_id"])},{"$set":{"users":family_list}})
                user_removed = True
                break
        if user_removed:
            resp.data=dumps("User successfully removed")
        else:
            resp.status_code=400
            resp.data=dumps("Error: user not found")
    
    else:
        resp.status_code=400
        resp.data=dumps("Error: account not found")
    return resp

def edit_family(request_data, accounts_collection):
    resp=Response()
    resp.headers['Access-Control-Allow-Headers'] = '*'
    account_doc = accounts_collection.find_one({"_id": ObjectId(request_data["_id"])})
    old_name = request_data["old_name"]
    new_name = request_data["new_name"]
    # birthday = request_data["birthday"]

    # Ensures account is found
    if account_doc:
        user = accounts_collection.find_one({"_id": ObjectId(request_data["_id"]), "users.name" :old_name})    
        if user: # Ensures user is found
            #Sets new birthday
            # if not (birthday == ""):
            #     accounts_collection.update_one(
            #         {"_id": ObjectId(request_data["account_ID"]), "users.name" :old_name}, 
            #         {"$set":{"users.$.birthday" : birthday}})
            
            #Sets new name. Must be done after all other updates, or the name will change and we won't be able to find the user. 
            if not (new_name == ""):
                if accounts_collection.find_one({"_id": ObjectId(request_data["_id"]), "users.name" :new_name}):
                    resp.status_code=400
                    resp.data=dumps("Error: user with name already exists in account") #Message also returned if old_name==new_name
                    return resp 
                        
                accounts_collection.update_one({"_id": ObjectId(request_data["_id"]), "users.name" :old_name}, 
                                               {"$set":{"users.$.name" : new_name}})
            resp.data=dumps("Success")

        else:
            resp.status_code=400
            resp.data=dumps("Error: No user by that name found")

    else:
        resp.status_code=400
        resp.data=dumps("Error: account not found")
        return resp

    return resp

def retrieve_family(request_data, accounts_collection):
    resp = Response()
    resp.headers['Access-Control-Allow-Headers'] = '*'

    account_doc = accounts_collection.find_one({"_id": ObjectId(request_data["_id"])})

    # Ensures account is found
    if account_doc:
        resp.data = dumps(account_doc["users"])

    else:
        resp.status_code=400
        resp.data=dumps("Error: account not found")
    return resp

def add_event(request_data, accounts_collection, ev_collection, ev_type):
    """Adds user to event/course Enrolled list, adds event/course to user's events/courses list. See server.py for further documentation."""
    resp = Response()
    resp.headers['Access-Control-Allow-Headers']="*"

    ev = ev_collection.find_one({"name": request_data["event_name"]})
    if not ev:
        resp.status_code=400
        resp.data=dumps("Error: event not found")
        return resp
    
    enrolled = ev["enrolled"] # list of students of event
    
    account = accounts_collection.find_one({"_id": ObjectId(request_data["_id"])})
    if not account:
        resp.status_code=400
        resp.data=dumps("Error: account not found")
        return resp
    
    else:
        # Finds user and gets their current course list
        users = account["users"]
        user_found=False
        for user in users:
            if user["name"] == request_data["user_name"]:
                if user["level"]<int(ev["level"]):
                    resp.status_code=400
                    resp.data=dumps("Error: user level too low")
                    return resp
                if ev_type=="course":
                    ev_list = user["courses"]
                else:
                    ev_list = user["events"]
                user_id = user["_id"]
                user_found=True
                break

        if not user_found:
            resp.status_code=400
            resp.data=dumps("Error: user not found")
            return resp
        
        # Check if course already in list.
        for ev in ev_list:
            if ev["name"] == request_data["event_name"]:
                resp.status_code=400
                resp.data=dumps("Error: event already on user's event list")
                return resp
        
        ev2 = {"name":request_data["event_name"],
              "_id":ev["_id"]}
        ev_list.append(ev2)
        enrolled.append({"_id":user_id, "name":request_data["user_name"]})

        # Checks which list to add event to
        if ev_type == "course":
            accounts_collection.update_one({"_id": ObjectId(request_data["_id"]), "users.name" :request_data["user_name"]}, 
                                               {"$set":{"users.$.courses" : ev_list}})
        else:
            accounts_collection.update_one({"_id": ObjectId(request_data["_id"]), "users.name" :request_data["user_name"]}, 
                                               {"$set":{"users.$.events" : ev_list}})
        ev_collection.update_one({"name": request_data["event_name"]}, 
                                               {"$set":{"enrolled" : enrolled}})
        return resp
    
def retrieve_enrollments(request_data, enrollmentType, accounts_collection):
    """_summary_

    Args:
        request_data (Request): request
        enrollmentType (Str): "events" or "courses"

    Returns:
        _type_: _description_
    """
    resp = Response()
    resp.headers['Access-Control-Allow-Headers'] = '*'

    account= accounts_collection.find_one({"_id": ObjectId(request_data["_id"])})

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
        resp.data=dumps("Error: user not found")
        return resp
    
def remove_event(request_data, accounts_collection, ev_collection, ev_type):
    """Removes a user from an event's enrolled list and removes the event from their event/course list."""
    resp = Response()
    resp.headers['Access-Control-Allow-Headers']="*"

    print("in python")
    ev = ev_collection.find_one({"name": request_data["event_name"]})
    if not ev:
        resp.status_code=400
        resp.data=dumps("Error: event not found")
        return resp
    
    enrolled = ev["enrolled"] # list of students of event
    
    account = accounts_collection.find_one({"_id": ObjectId(request_data["_id"])})
    if not account:
        resp.status_code=400
        resp.data=dumps("Error: account not found")
        return resp
    
    else:
        # Finds user and gets their current course list
        users = account["users"]
        user_found=False
        for user in users:
            if user["name"] == request_data["user_name"]:
                if ev_type=="course":
                    ev_list = user["courses"]
                else:
                    ev_list = user["events"]
                user_id = user["_id"]
                user_found=True
                break

        if not user_found:
            resp.status_code=400
            resp.data=dumps("Error: user not found")
            return resp
        
        # Check if event is in list
        for ev in ev_list:
            if ev["name"] == request_data["event_name"]:
                ev_list.remove(ev)
                enrolled.remove({"_id":user_id, "name":request_data["user_name"]})

                # Checks which list to remove event from
                if ev_type == "course":
                    accounts_collection.update_one({"_id": ObjectId(request_data["_id"]), "users.name" :request_data["user_name"]}, 
                                                    {"$set":{"users.$.courses" : ev_list}})
                else:
                    accounts_collection.update_one({"_id": ObjectId(request_data["_id"]), "users.name" :request_data["user_name"]}, 
                                                    {"$set":{"users.$.events" : ev_list}})
                ev_collection.update_one({"name": request_data["event_name"]}, 
                                                    {"$set":{"enrolled" : enrolled}})
                return resp
                break
        #If event not found on user's list:
        resp.status_code=400
        resp.data=dumps("Error: event not on user's list")
        return resp
    
def retrieve_account_enrollments(request_data, enrollmentType, accounts_collection):
    resp = Response()
    resp.headers['Access-Control-Allow-Headers'] = '*'

    account= accounts_collection.find_one({"_id": ObjectId(request_data["account_ID"])})

    # Ensures account is found
    if not account:
        resp.status_code=400
        resp.data=dumps("Error: account not found")
        return resp
    
    # Adds event lists of all users to response, with certain keys removed
    users = account["users"]
    ev_list=[]
    for user in users:
            user_info=user
            del user_info["birthday"]
            del user_info["isParent"]
            if enrollmentType == "courses":
                del user_info["events"]
            else:
                del user_info["courses"]
            ev_list.append(user_info)

    resp.data=dumps(ev_list)
    return resp

def edit_subscriptions(request_data, accounts_collection):
    resp = Response()
    resp.headers['Access-Control-Allow-Headers'] = '*'
    account= accounts_collection.find_one({"_id": ObjectId(request_data["_id"])})

    # Ensures account is found
    if not account:
        resp.status_code=400
        resp.data=dumps("Error: account not found")
        return resp
    
    accounts_collection.update_one({"_id": ObjectId(request_data["_id"])}, 
                                {"$set":{"prom" : request_data["prom"]}})
    accounts_collection.update_one({"_id": ObjectId(request_data["_id"])}, 
                            {"$set":{"news" : request_data["news"]}})
    return resp
    

    