# For additional documentation, please see server.py

from flask import Response
from bson.objectid import ObjectId
from bson.json_util import dumps

def retrieve(request_data, collection):
    resp = Response()
    resp.headers['Access-Control-Allow-Headers'] = '*'
    ev = collection.find()
    ev_list=[]
    for i in ev:
        ev_list.append(i)
    resp.data = dumps(ev_list)
    return resp

def get(request_data, collection):
    resp = Response()
    resp.headers['Access-Control-Allow-Headers'] = '*'
    ev = collection.find_one({"name": request_data["name"]})
    if ev:
        resp.data=dumps(ev)
        return resp
    else:
        resp.data=dumps("Error: course not found")
        resp.status_code=400
        return resp

    
def add(request_data, ev_collection, accounts_collection):
    resp=Response()
    resp.headers['Access-Control-Allow-Headers'] = '*'

    # Checks to see if user is a staff account
    account= accounts_collection.find_one({"_id": ObjectId(request_data["account_ID"])})
    if not account:
        resp.status_code=400
        resp.data=dumps("Error: account not found")
        return resp
    if not (account["staffLevel"]>0):
        resp.status_code=400
        resp.data=dumps("Error: you do not have permission to perform this action")
        return resp

    event_details = {
        "name": request_data["name"],
        "enrolled": []
    }

    if ev_collection.find_one({"name": request_data["name"]}):
        resp.status_code=400
        resp.data=dumps("Error: event name already exists")
        return resp
    else:
        ev_collection.insert_one(event_details)
        return resp
    
def delete(request_data, collection,accounts_collection,ev_type):
    resp=Response()
    resp.headers['Access-Control-Allow-Headers'] = '*'

    # Checks to see if user is a staff account
    account= accounts_collection.find_one({"_id": ObjectId(request_data["account_ID"])})
    if not account:
        resp.status_code=400
        resp.data=dumps("Error: account not found")
        return resp
    if not (account["staffLevel"]>0):
        resp.status_code=400
        resp.data=dumps("Error: you do not have permission to perform this action")
        return resp
    

    ev = collection.find_one({"name": request_data["name"]})

    # version of event document that users have:
    ev_doc = {"name":request_data["name"],
              "_id":ev["_id"]
    }
    if not ev:
        resp.status_code=400
        resp.data=dumps("Error: event not found")
        return resp
    
    # Goes through all users from enrolled list, finds that user, and removes event from their list
    for user in ev["enrolled"]:
        account_doc=accounts_collection.find_one({"users._id": user["_id"]})
        for user in account_doc["users"]:
            if user["name"] == request_data["user_name"]:
                if ev_type=="course":
                    ev_list = user["courses"]
                else:
                    ev_list = user["events"]
                
                print(ev_list)
                print(ev_doc)
                ev_list.remove(ev_doc)

                #TODO: fix, doesn't access correct account
                # Checks which list to remove event from
                if ev_type == "course":
                    accounts_collection.update_one({"_id": ObjectId(request_data["account_ID"]), "users.name" :request_data["user_name"]}, 
                                                    {"$set":{"users.$.courses" : ev_list}})
                else:
                    accounts_collection.update_one({"_id": ObjectId(request_data["account_ID"]), "users.name" :request_data["user_name"]}, 
                                                    {"$set":{"users.$.events" : ev_list}})
                break

    # if collection.find_one({"name": request_data["name"]}):
    #     collection.delete_one({"name": request_data["name"]})
    #     return resp
    
    return resp
