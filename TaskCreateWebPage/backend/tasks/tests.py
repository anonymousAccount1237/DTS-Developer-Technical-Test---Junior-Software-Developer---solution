from django.test import TestCase

from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from datetime import date
from .models import Task
from .serializers import TaskSerializer


class TaskModelTest(TestCase):
    """Test cases for the Task model"""
    
    def test_create_task_with_description(self):
        """Test creating a task with all fields"""
        task = Task.objects.create(
            title='Test Task',
            description='Test Description',
            status='pending',
            dueDate=date.today()
        )
        self.assertEqual(task.title, 'Test Task')
        self.assertEqual(task.description, 'Test Description')
    
    def test_create_task_without_description(self):
        """Test creating a task without description (optional field)"""
        task = Task.objects.create(
            title='Test Task',
            description='',
            status='pending',
            dueDate=date.today()
        )
        self.assertEqual(task.description, '')


class TaskSerializerTest(TestCase):
    """Test cases for the TaskSerializer"""
    
    def test_serializer_with_valid_data(self):
        """Test serializer with valid data"""
        task_data = {
            'title': 'Test Task',
            'description': 'Test Description',
            'status': 'pending',
            'dueDate': date.today().isoformat()
        }
        serializer = TaskSerializer(data=task_data)
        self.assertTrue(serializer.is_valid())
    
    def test_serializer_missing_required_fields(self):
        """Test serializer with missing required fields"""
        invalid_data = {'title': 'Test'}
        serializer = TaskSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('status', serializer.errors)
        self.assertIn('dueDate', serializer.errors)


class CreateTaskAPITest(APITestCase):
    """Test cases for the create_task API endpoint"""
    
    def setUp(self):
        self.url = '/api/tasks/create/'
        self.valid_payload = {
            'title': 'New Task',
            'description': 'Task Description',
            'status': 'pending',
            'dueDate': date.today().isoformat()
        }
    
    def test_create_task_with_valid_data(self):
        """Test creating a task with valid data"""
        response = self.client.post(
            self.url,
            data=self.valid_payload,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Task.objects.count(), 1)
        self.assertIn('id', response.data)
        self.assertEqual(response.data['title'], 'New Task')
    
    def test_create_task_without_description(self):
        """Test creating a task without optional description"""
        payload = self.valid_payload.copy()
        payload['description'] = ''
        response = self.client.post(
            self.url,
            data=payload,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Task.objects.get().description, '')
    
    def test_create_task_without_required_fields(self):
        """Test creating a task without required fields"""
        payload = {'title': 'Test'}
        response = self.client.post(
            self.url,
            data=payload,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Task.objects.count(), 0)
    
    def test_create_task_with_invalid_date_format(self):
        """Test creating a task with invalid date format"""
        payload = self.valid_payload.copy()
        payload['dueDate'] = 'not-a-date'
        response = self.client.post(
            self.url,
            data=payload,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
