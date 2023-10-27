# For additional documentation, please see server.py

from flask import Response
from bson.objectid import ObjectId
from bson.json_util import dumps

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
            "isParent": True,
            "courses":[],
            "events":[]
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
            resp.data=dumps("Password incorrect")
            resp.status_code=400
    else:
        resp.data=dumps("Email not found")
        resp.status_code=400
    return resp

def add_family(request_data, accounts_collection):
    resp=Response()
    resp.headers['Access-Control-Allow-Headers'] = '*'
    account_doc = accounts_collection.find_one({"_id": ObjectId(request_data["account_ID"])})
    user_details = {
        "_id": ObjectId(),
        "name": request_data["name"],
        "birthday": request_data["birthday"],
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
    accounts_collection.update_one({"_id": ObjectId(request_data["account_ID"])},{"$set":{"users":family_list}})
    resp.data=dumps("Success")
    return resp
    
def delete_family(request_data, accounts_collection):
    resp=Response()
    resp.headers['Access-Control-Allow-Headers'] = '*'
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
    account_doc = accounts_collection.find_one({"_id": ObjectId(request_data["account_ID"])})
    old_name = request_data["old_name"]
    new_name = request_data["new_name"]
    birthday = request_data["birthday"]

    # Ensures account is found
    if account_doc:
        user = accounts_collection.find_one({"_id": ObjectId(request_data["account_ID"]), "users.name" :old_name})    
        if user: # Ensures user is found
            #Sets new birthday
            if not (birthday == ""):
                accounts_collection.update_one(
                    {"_id": ObjectId(request_data["account_ID"]), "users.name" :old_name}, 
                    {"$set":{"users.$.birthday" : birthday}})
            
            #Sets new name. Must be done after all other updates, or the name will change and we won't be able to find the user. 
            if not (new_name == ""):
                if accounts_collection.find_one({"_id": ObjectId(request_data["account_ID"]), "users.name" :new_name}):
                    resp.status_code=400
                    resp.data=dumps("Error: user with name already exists in account") #Message also returned if old_name==new_name
                    return resp 
                        
                accounts_collection.update_one({"_id": ObjectId(request_data["account_ID"]), "users.name" :old_name}, 
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

    account_doc = accounts_collection.find_one({"_id": ObjectId(request_data["account_ID"])})

    # Ensures account is found
    if account_doc:
        resp.data = dumps(account_doc["users"])

    else:
        resp.status_code=400
        resp.data=dumps("Error: account not found")
    return resp