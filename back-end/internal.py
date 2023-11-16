# Contains functions meant for use within other backend functions; these should NOT be directly accessible to client
from bson.objectid import ObjectId

from flask import Response

def clear_user_schedule(user_ID, events_col, courses_col):
    #TODO: COMPLETE TESTING
    """Removes a user from all events and courses. Does not affect user itself. Errors printed to server console. 

    Args:
        user_ID (_type_): ID of user to be removed
        events_col (_type_): _description_
        courses_col (_type_): _description_
    """
    for ev in events_col.find({"enrolled._id": ObjectId(user_ID)}):
        print(ev)
        users_list=ev["enrolled"]
        print(users_list)
        users_list = [i for i in users_list if not (i['_id'] == ObjectId(user_ID))] 
        print(users_list)
        events_col.update_one({"_id": ev["_id"]}, 
                            {"$set":{"enrolled" : users_list}})
        
    for ev in courses_col.find({"enrolled._id": ObjectId(user_ID)}):
        users_list=ev["enrolled"]
        users_list = [i for i in users_list if not (i['_id'] == ObjectId(user_ID))] 
        courses_col.update_one({"_id": ev["_id"]}, 
                            {"$set":{"enrolled" : users_list}})
    return Response() #REMOVE RESPONSE() WHEN TESTING COMPLETE
