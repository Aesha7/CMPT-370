from mongoengine import *
import datetime

class Person(Document):
   _id = IntField(required=True)
   firstname = StringField(max_length=50, required=True)
   surname = StringField(max_lenght=50, required=True)
   middlename = StringField(max_length=50)
   birthday = datetime.datetime(required=True)
   emergency_contact = StringField(max_length=50)
   phone = IntField(required=True)
   # TODO: extra details (class registration, etc)

   def __init__(self, firstname):
      # TODO: finish initialization
      self.firstname=firstname


class Child(Person):
   def __init__(self, *args, **values):
      super().__init__(*args, **values)

class Adult(Person):
   def __init__(self, *args, **values):
      super().__init__(*args, **values)

class Account(Document):
   _id = IntField(required=True)
   primary_user_id = IntField(required=True) # ID of account holder
   users = [] # list of associated user IDs 

class Course(Document):
   _id = IntField(required=True)
   name = StringField(required=True)
   description = StringField()
   level = IntField()
   enrolled = []
   



