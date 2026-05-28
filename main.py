import os
from src.interview_coach import InterviewCoach, Question

def clear_screen():
    os.system('cls' if os.name == 'nt' else 'clear')

def print_header():
    print("="*50)
    print("       AI Interview Coach - Practice Session       ")
    print("="*50)
    print()

def get_user_input(prompt: str) -> str:
    print(prompt)
    print("\nYour response (type 'exit' to end session):")
    lines = []
    while True:
        line = input()
        if line.lower() == 'exit':
            return 'exit'
        if line.strip() == '':
            break
        lines.append(line)
    return '\n'.join(lines)

def main():
    clear_screen()
    print_header()
    
    # Initialize the interview coach
    coach = InterviewCoach()
    
    print("Welcome to your AI Interview Practice Session!")
    print("\nChoose difficulty level:")
    print("1. Easy")
    print("2. Medium")
    print("3. Hard")
    
    difficulty_map = {
        "1": "easy",
        "2": "medium",
        "3": "hard"
    }
    
    choice = input("\nEnter your choice (1-3): ")
    difficulty = difficulty_map.get(choice, "medium")
    
    session_active = True
    while session_active:
        clear_screen()
        print_header()
        
        # Get next question
        question = coach.get_next_question(difficulty)
        print(f"\nQuestion: {question.text}\n")
        
        # Get user's response
        response = get_user_input("")
        
        if response.lower() == 'exit':
            session_active = False
            continue
            
        # Analyze response and provide feedback
        print("\nAnalyzing your response...")
        feedback = coach.analyze_response(question, response)
        
        # Save response and feedback
        coach.save_response(question, response, feedback)
        
        print("\nFeedback:")
        print("-" * 50)
        print(feedback)
        print("-" * 50)
        
        input("\nPress Enter to continue...")

    print("\nThank you for using AI Interview Coach!")
    print("Keep practicing and good luck with your interviews!")

if __name__ == "__main__":
    main()