import json
import re


def parse_questions(text):
    questions = []
    # Split into question blocks
    blocks = re.split(r'--- QUESTION (\d+) ---', text.strip())
    
    # Process each block
    for i in range(1, len(blocks), 2):
        q_id = blocks[i].zfill(4)  # Ensure 4 digits
        content = blocks[i+1]
        
        # Split into question and answer
        parts = content.split('--- ANSWER ---', 1)
        if len(parts) != 2:
            continue
            
        question_text = parts[0].strip()
        answer_text = parts[1].strip()
        
        # Process images: [IMAGE: filename.jpg] -> <img src="Image/filename.jpg">
        def process_images(text):
            def replace_image(match):
                filename = match.group(1)
                return f'<img src="Image/{filename}">'
            return re.sub(r'\[IMAGE:\s*([^\]]+)\]', replace_image, text)
        
        question_html = process_images(question_text)
        answer_html = process_images(answer_text)
        
        questions.append({
            'id': q_id,
            'question': question_html,
            'answer': answer_html
        })
    
    return questions


def main():
    # Read the text file
    with open('questions.txt', 'r', encoding='utf-8') as f:
        text = f.read()
    
    # Parse questions
    questions = parse_questions(text)
    
    # Write to JSON
    with open('questions.json', 'w', encoding='utf-8') as f:
        json.dump(questions, f, indent=2, ensure_ascii=False)
    
    print(f'Successfully converted {len(questions)} questions to questions.json!')


if __name__ == '__main__':
    main()
