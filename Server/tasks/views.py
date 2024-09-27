import json
import uuid
from bson import ObjectId
from pymongo import MongoClient

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from rest_framework import status  # If you are using Django REST framework

# MongoDB client setup
client = MongoClient('mongodb://localhost:27017/')
db = client['taskrabbit']

# Custom JSON encoder to handle ObjectId
class JSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return json.JSONEncoder.default(self, obj)

@csrf_exempt
@require_POST
def CreateTasksView(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)  # Load the request body into JSON
            print(data)

            employee_id = data.get('employee_id')  # Get the Employee ID from the data
            new_task = data.get('task')  # Get the new task from the data assuming it is under new_task key
            
            task_id = str(uuid.uuid4())

            if not employee_id or not new_task:
                return JsonResponse({"message": "Employee ID or Task key is empty"}, status=status.HTTP_400_BAD_REQUEST)

            new_task['task_id'] = task_id  # Creating an unique task_id for the new task
            collection = db['all_tasks']  # Access the 'all_tasks' collection

            # Inserting the new task in the collection
            result = collection.update_one(
                    {'employee_id': employee_id},
                    {'$push': {'tasks': new_task}},
                    upsert=True  # ensures if there are no existing data
                )

            if result.matched_count > 0:
                message =  "Task appended successfully to the existing employee ID"
            else:
                message = "New task created for the employee ID"
            
            # Prepare a response containing the inserted document ID
            response_data = {
                'message': message,
                'task_id': task_id,
                'employee_id': employee_id
            }
            return JsonResponse(response_data, status=status.HTTP_201_CREATED, encoder=JSONEncoder)
        
        except Exception as e:
            # Handle any errors that occur during the process
            return JsonResponse({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    # Redundant due to @require_POST, but good practice
    return JsonResponse({"message": "Only POST methods are allowed"}, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
def GetTasksView(request, employee_id):
    if request.method == 'GET':
        try:
            collection = db['all_tasks']
            
            #print(employee_id, type(employee_id))
            tasks_data = collection.find_one({'tasks.assigned_to': employee_id},{'_id': 0, 'tasks': 1})
            #print(tasks_data)
            
            if tasks_data:
                all_tasks = tasks_data.get('tasks',[])

                return JsonResponse({'employee_id':employee_id, 'all_tasks': all_tasks},status=status.HTTP_200_OK)
            else:
                return JsonResponse({"message": "No tasks found for the employee"},status = status.HTTP_200_OK)
        except Exception as e:
            return JsonResponse({'error': str(e)},status=status.HTTP_400_BAD_REQUEST)
    else:
        return JsonResponse({"message":"Only GET methods is allowed on this endpoint"},status=status.HTTP_400_BAD_REQUEST)

