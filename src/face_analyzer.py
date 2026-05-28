import cv2
import numpy as np
from deepface import DeepFace
from typing import Dict, List, Tuple

class FaceAnalyzer:
    def __init__(self):
        self.emotions = ['neutral', 'happy', 'surprise', 'confused']
        
    def analyze_frame(self, frame) -> Dict:
        """Analyze emotions in a single frame"""
        try:
            result = DeepFace.analyze(
                frame, 
                actions=['emotion'],
                enforce_detection=False
            )
            
            # Filter and normalize emotions to our simplified set
            emotions = result[0]['emotion'] if isinstance(result, list) else result['emotion']
            filtered_emotions = {
                'neutral': emotions['neutral'],
                'happy': emotions['happy'],
                'surprise': emotions['surprise'],
                'confused': (emotions['sad'] + emotions['fear']) / 2  # Approximating confusion
            }
            
            # Normalize to ensure sum = 100
            total = sum(filtered_emotions.values())
            normalized_emotions = {k: (v/total)*100 for k, v in filtered_emotions.items()}
            
            return normalized_emotions
            
        except Exception as e:
            print(f"Error in face analysis: {str(e)}")
            return {emotion: 0 for emotion in self.emotions}