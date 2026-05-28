import os
from typing import List, Dict
import openai
from dotenv import load_dotenv
import nltk
from nltk.tokenize import sent_tokenize
import numpy as np

class Question:
    def __init__(self, text: str, category: str, difficulty: str):
        self.text = text
        self.category = category
        self.difficulty = difficulty
        self.user_response = ""
        self.feedback = ""

class InterviewCoach:
    def __init__(self):
        load_dotenv()
        openai.api_key = os.getenv("OPENAI_API_KEY")
        self.questions_bank = self._initialize_questions()
        
    def _initialize_questions(self) -> List[Question]:
        """Initialize a basic set of interview questions"""
        questions = [
            Question(
                "Tell me about yourself.",
                "behavioral",
                "easy"
            ),
            Question(
                "What are your greatest strengths?",
                "behavioral",
                "medium"
            ),
            Question(
                "Where do you see yourself in 5 years?",
                "behavioral",
                "medium"
            ),
            Question(
                "Describe a challenging situation at work and how you handled it.",
                "behavioral",
                "hard"
            )
        ]
        return questions
    
    def get_next_question(self, difficulty: str = None) -> Question:
        """Get the next question based on difficulty"""
        available_questions = self.questions_bank
        if difficulty:
            available_questions = [q for q in available_questions if q.difficulty == difficulty]
        return np.random.choice(available_questions)
    
    def analyze_response(self, question: Question, response: str) -> str:
        """Analyze the user's response using OpenAI"""
        try:
            prompt = f"""
            Analyze this interview response to the question: "{question.text}"
            
            Response: "{response}"
            
            Provide constructive feedback in these areas:
            1. Content relevance
            2. Clarity and structure
            3. Specific improvements
            Keep the feedback concise and actionable.
            """
            
            response = openai.Completion.create(
                engine="text-davinci-003",
                prompt=prompt,
                max_tokens=200,
                temperature=0.7
            )
            
            feedback = response.choices[0].text.strip()
            return feedback
            
        except Exception as e:
            return f"Error analyzing response: {str(e)}"
    
    def save_response(self, question: Question, response: str, feedback: str):
        """Save the user's response and feedback"""
        question.user_response = response
        question.feedback = feedback