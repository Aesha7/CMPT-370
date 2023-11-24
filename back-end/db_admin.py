# For additional documentation, please see server.py

# Account staffLevel:
# Customer: 0
# Coach: 1
#[Placeholder]:2
#Admin: 3

from flask import Response
from bson.objectid import ObjectId
from bson.json_util import dumps

def change_staff_level(request_data, accounts_collection):
    resp=Response()
    resp.headers['Access-Control-Allow-Headers'] = '*'
    user_account = accounts_collection.find_one({"email": request_data["email"]})
    admin_account= accounts_collection.find_one({"_id": ObjectId(request_data["admin_ID"])})

    #Ensures admin account is found and that the admin account has a staffLevel of at least 3
    if not admin_account:
        resp.status_code=400
        resp.data=dumps("Error: admin account not found")
        return resp
    if not (admin_account["staffLevel"]>2):
        resp.status_code=400
        resp.data=dumps("Error: you do not have permission to perform this action")
        return resp

    # Ensures user account is found
    if not user_account:
        resp.status_code=400
        resp.data=dumps("Error: user account not found")
        return resp

    if user_account["staffLevel"]>2:
        resp.status_code=400
        resp.data=dumps("Error: target account's staff level is too high to change.")
    
    accounts_collection.update_one({"email": request_data["email"]}, 
                                                    {"$set":{"staffLevel" : request_data["level"]}})
    return resp

def add_event_user(request_data, accounts_collection, ev_collection, ev_type):
    resp = Response()
    resp.headers['Access-Control-Allow-Headers']="*"

    user_account = accounts_collection.find_one({"email": request_data["email"]})
    admin_account= accounts_collection.find_one({"_id": ObjectId(request_data["admin_ID"])})

    if not admin_account:
        resp.status_code=400
        resp.data=dumps("Error: admin account not found")
        return resp
    if not (admin_account["staffLevel"]>0):
        resp.status_code=400
        resp.data=dumps("Error: you do not have permission to perform this action")
        return resp

    ev = ev_collection.find_one({"name": request_data["event_name"]})
    if not ev:
        resp.status_code=400
        resp.data=dumps("Error: event not found")
        return resp
    
    enrolled = ev["enrolled"] # list of students of event
    
    if not user_account:
        resp.status_code=400
        resp.data=dumps("Error: target account not found")
        return resp
    
    else:
        # Finds user and gets their current course list
        users = user_account["users"]
        user_found=False
        for user in users:
            if user["name"] == request_data["user_name"]:
                if user["level"]<int(ev["level"]):
                    resp.status_code=400
                    resp.data=dumps("Error: user level too low")
                    return resp
                if int(ev["capacity"]) <= len(enrolled): 
                    resp.status_code=400
                    resp.data=dumps("Error: event full") #TODO: UNTESTED
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
                print(request_data["event_name"])
                resp.status_code=400
                resp.data=dumps("Error: event already on user's event list")
                return resp
        
        ev2 = {"name":request_data["event_name"],
              "_id":ev["_id"]}
        ev_list.append(ev2)
        enrolled.append({"_id":user_id, "name":request_data["user_name"]})

        # Checks which list to add event to
        if ev_type == "course":
            accounts_collection.update_one({"email": request_data["email"], "users.name" :request_data["user_name"]}, 
                                               {"$set":{"users.$.courses" : ev_list}})
        else:
            accounts_collection.update_one({"email":request_data["email"], "users.name" :request_data["user_name"]}, 
                                               {"$set":{"users.$.events" : ev_list}})
        ev_collection.update_one({"name": request_data["event_name"]}, 
                                               {"$set":{"enrolled" : enrolled}})
        return resp
    
def get_account_info(request_data, accounts_collection): 
    resp = Response()
    resp.headers['Access-Control-Allow-Headers']="*"
    user_account = accounts_collection.find_one({"email": request_data["email"]})
    admin_account= accounts_collection.find_one({"_id": ObjectId(request_data["admin_ID"])})

    if not admin_account:
        resp.status_code=400
        resp.data=dumps("Error: admin account not found")
        return resp
    if not (admin_account["staffLevel"]>0):
        resp.status_code=400
        resp.data=dumps("Error: you do not have permission to perform this action")
        return resp
    if not user_account:
        resp.data=dumps("Error: user account not found")
        resp.status_code=400
        return resp
    user_account.pop("_id")
    user_account.pop("password")
    resp.data=dumps(user_account)
    return resp

def remove_event(request_data, accounts_collection, ev_collection, ev_type):
    resp = Response()
    resp.headers['Access-Control-Allow-Headers']="*"

    user_account = accounts_collection.find_one({"email": request_data["email"]})
    admin_account= accounts_collection.find_one({"_id": ObjectId(request_data["admin_ID"])})

    if not admin_account:
        resp.status_code=400
        resp.data=dumps("Error: admin account not found")
        return resp
    if not (admin_account["staffLevel"]>0):
        resp.status_code=400
        resp.data=dumps("Error: you do not have permission to perform this action")
        return resp
    if not user_account:
        resp.data=dumps("Error: user account not found")
        resp.status_code=400
        return resp

    ev = ev_collection.find_one({"name": request_data["event_name"]})
    if not ev:
        resp.status_code=400
        resp.data=dumps("Error: event not found")
        return resp
    
    enrolled = ev["enrolled"] # list of students of event
    
    # Finds user and gets their current course list
    users = user_account["users"]
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
                accounts_collection.update_one({"email": request_data["email"], "users.name" :request_data["user_name"]}, 
                                                {"$set":{"users.$.courses" : ev_list}})
            else:
                accounts_collection.update_one({"email": request_data["email"], "users.name" :request_data["user_name"]}, 
                                                {"$set":{"users.$.events" : ev_list}})
            ev_collection.update_one({"name": request_data["event_name"]}, 
                                                {"$set":{"enrolled" : enrolled}})
            return resp

    #If event not found on user's list:
    resp.status_code=400
    resp.data=dumps("Error: event not on user's list")
    return resp

def get_all_accounts(request_data, accounts_collection): 
    resp = Response()
    resp.headers['Access-Control-Allow-Headers']="*"
    admin_account= accounts_collection.find_one({"_id": ObjectId(request_data["admin_ID"])})

    if not admin_account:
        resp.status_code=400
        resp.data=dumps("Error: admin account not found")
        return resp
    if not (admin_account["staffLevel"]>0):
        resp.status_code=400
        resp.data=dumps("Error: you do not have permission to perform this action")
        return resp
    
    # Goes through all accounts in collection, takes their email and stafflevel and adds them to a new dict, then adds that dict to the response list
    account_list = []
    accounts = accounts_collection.find()
    for account in accounts:
        account_dict = {}
        account_dict["email"] = account.pop("email")
        account_dict["staffLevel"] = account.pop("staffLevel")
        account_list.append(account_dict)

    resp.data=dumps(account_list)
    return resp


# same as get_all_accounts but for more info
# def get_all_accounts_all_info(request_data, accounts_collection):
#     resp = Response()
#     resp.headers['Access-Control-Allow-Headers']="*"
#     admin_account= accounts_collection.find_one({"_id": ObjectId(request_data["admin_ID"])})

#     if not admin_account:
#         resp.status_code=400
#         resp.data=dumps("Error: admin account not found")
#         return resp
#     if not (admin_account["staffLevel"]>0):
#         resp.status_code=400
#         resp.data=dumps("Error: you do not have permission to perform this action")
#         return resp
    
#         # Goes through all accounts in collection, takes their email and stafflevel and adds them to a new dict, then adds that dict to the response list
#     account_list = []
#     accounts = accounts_collection.find()
#     for account in accounts:
#         account_dict = {}
#         account_dict["name"] = account.pop("name")
#         account_dict["email"] = account.pop("email")
#         account_dict["staffLevel"] = account.pop("staffLevel")
#         account_list.append(account_dict)

#     resp.data=dumps(account_list)
#     return resp

# get list of account_ID's
def get_account_object_list(request_data, accounts_collection):
    resp = Response()
    resp.headers['Access-Control-Allow-Headers']="*"
    admin_account= accounts_collection.find_one({"_id": ObjectId(request_data["admin_ID"])})

    if not admin_account:
        resp.status_code=400
        resp.data=dumps("Error: admin account not found")
        return resp
    if not (admin_account["staffLevel"]>0):
        resp.status_code=400
        resp.data=dumps("Error: you do not have permission to perform this action")
        return resp
    
    accountObjList = []
    accounts = accounts_collection.find()
    for account in accounts:
        accountObjList.append(account)
    
    resp.data=dumps(accountObjList)
    return resp
            


def change_level(request_data, accounts_collection):
    resp = Response()
    resp.headers['Access-Control-Allow-Headers']="*"
    admin_account= accounts_collection.find_one({"_id": ObjectId(request_data["admin_ID"])})
    user_account = accounts_collection.find_one({"email": request_data["email"]})
    level = request_data["level"]

    if not admin_account:
        resp.status_code=400
        resp.data=dumps("Error: admin account not found")
        return resp
    if not (admin_account["staffLevel"]>0):
        resp.status_code=400
        resp.data=dumps("Error: you do not have permission to perform this action")
        return resp

    if not user_account:
        resp.data=dumps("Error: user account not found")
        resp.status_code=400
        return resp
    
    # Finds user and edits their level
    users = user_account["users"]
    for user in users:
        if user["name"] == request_data["name"]:
            if level == "+": # Increments level
                accounts_collection.update_one({"email": request_data["email"], "users.name" :request_data["name"]}, 
                                               {"$set":{"users.$.level" : user["level"]+1}})
            elif level == "-": # Decrements level
                if user["level"]>1:
                    accounts_collection.update_one({"email": request_data["email"], "users.name" :request_data["name"]}, 
                                               {"$set":{"users.$.level" : user["level"]-1}})
                else:
                    resp.status_code=400
                    resp.data=dumps("Error: user's level is too low to decrement")

            elif isinstance(level, int):
                accounts_collection.update_one({"email": request_data["email"], "users.name" :request_data["name"]}, 
                                               {"$set":{"users.$.level" : level}})
            else:
                resp.status_code=400
                resp.data=dumps("Error: invalid request")
            return resp

    resp.status_code=400
    resp.data=dumps("Error: user not found")
    return resp