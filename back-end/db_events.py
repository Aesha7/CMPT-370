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
    
    coach = accounts_collection.find_one({"email":request_data["coach_email"]})
    if not coach:
        resp.status_code=400
        resp.data=dumps("Error: coach account not found")
        return resp
    if not (account["staffLevel"]>0):
        resp.status_code=400
        resp.data=dumps("Error: target coach account is not a staff account")
        return resp
    parent_found=False
    for user in coach["users"]:
        if user["isParent"]==True:
            coach_name=user["name"]
            parent_found = True
            break
    if not parent_found:
        resp.status_code=400
        resp.data=dumps("Error: parent not found")
        return resp

    event_details = {
        "name": request_data["name"],
        "desc": request_data["desc"],
        "start": {
            "year": request_data["startYear"],
            "month": request_data["startMonth"],
            "date": request_data["startDate"],
            "hour": request_data["startHour"],
            "minute": request_data["startMin"],
        },
        "end": {
            "year": request_data["endYear"],
            "month": request_data["endMonth"],
            "date": request_data["endDate"],
            "hour": request_data["endHour"],
            "minute": request_data["endMin"],
        },
        "level": request_data["level"],
        "enrolled": [],
        "capacity": request_data["capacity"],
        "coach": coach_name,
        "coach_email": request_data["coach_email"]
    }

    if ev_collection.find_one({"name": request_data["name"]}):
        resp.status_code=400
        resp.data=dumps("Error: event name already exists")
        return resp
    else:
        ev_collection.insert_one(event_details) #adds event to event/course col
        coach_ev_list = coach["teaching"]
        coach_ev_list.append(event_details["_id"])
        accounts_collection.update_one({"email":request_data["coach_email"]},{"$set":{"teaching" : coach_ev_list}}) # updates coach's teaching list
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
    
    ev = collection.find_one({"name": request_data["event_name"]})
    if not ev:
        resp.status_code=400
        resp.data=dumps("Error: event not found")
        return resp
    ev_id = ev["_id"]

    # Goes through all users from enrolled list, finds that user, and removes event from their list
    for user1 in ev["enrolled"]:
        account_doc=accounts_collection.find_one({"users._id": user1["_id"]})
        if not account_doc:
            print("Error: a user wasn't found") # Happens if a user or their account was deleted, but their name still exists on a course
        else:
            for user2 in account_doc["users"]:
                if user1["_id"] == user2["_id"]:
                    if ev_type=="course":
                        ev_list = user2["courses"]
                    else:
                        ev_list = user2["events"]

                    #Copies the user's event/course list, excluding the event to be deleted
                    ev_list = [i for i in ev_list if not (i['name'] == request_data["event_name"])] 

                    # Checks which list to remove event from, then replaces the user's course/event list with ev_list
                    if ev_type == "course":
                        accounts_collection.update_one({"users._id": user2["_id"]}, 
                                                        {"$set":{"users.$.courses" : ev_list}})
                    else:
                        accounts_collection.update_one({"users._id": user2["_id"]}, 
                                                        {"$set":{"users.$.events" : ev_list}})
                    break

    # Finds coach and removes event from their "teaching" list
    coach_teaching_list = accounts_collection.find_one({"email":ev["coach_email"]})["teaching"]
    coach_teaching_list = [i for i in coach_teaching_list if not (i == ev_id)]
    accounts_collection.update_one({"email":ev["coach_email"]},{"$set":{"teaching":coach_teaching_list}})

    # Delete event
    collection.delete_one({"name": request_data["event_name"]})
    return resp
