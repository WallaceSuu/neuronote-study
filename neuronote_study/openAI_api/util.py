import openai
from api.models import *
import os
import pdfplumber


def getPDFInfo(user_key):
    pdf_list = uploadPDF.objects.filter(user=user_key)
    pdf_info = []
    if not pdf_list.exists():
        return {"error": "No PDFs found"}
    for pdf in pdf_list:
        pdf_info.append({"pdf_file": pdf.pdf_file, "pdf_name": pdf.pdf_name, "key": pdf.pdf_key})
    return pdf_info

def extract_text_from_pdf(pdf_path):
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() + "\n\n"
    return text

def generate_summary_and_title(pdf):
    client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    # Get the absolute path of the PDF file
    pdf_path = pdf.pdf_file.path

    # Extract text from PDF
    pdf_text = extract_text_from_pdf(pdf_path)
    
    if not pdf_text.strip():
        raise Exception("Could not extract text from PDF")

    # Create the completion
    text_response = client.chat.completions.create(
        model="gpt-4o-mini-2024-07-18",
        messages=[
            {"role": "system", "content": "You are a helpful assistant that summarizes documents and provides a list of key points on the given document's main topic."},
            {"role": "user", "content": f"Please summarize the following document and provide key points:\n\n{pdf_text}, feel free to add your own notes to the text when needed. Also feel free to add emojis to the text when needed for better readability and comprehension."}
        ],
        max_tokens=1000,
        temperature=0.7
    )

    title_response = client.chat.completions.create(
        model="gpt-4o-mini-2024-07-18",
        messages=[
            {"role": "system", "content": "You are a helpful assistant that generates titles for documents."},
            {"role": "user", "content": f"Please generate a title for the following document:\n\n{pdf_text}, please generate a title that sums up the main topic of the document and that is a plain string of text with no headings or other formatting."}
        ],
        max_tokens=30,
        temperature=1.2
    )

    return {
        "text": text_response.choices[0].message.content,
        "title": title_response.choices[0].message.content
        }

def generate_flashcards(note_text):
    client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    flashcard_question = client.chat.completions.create(
        model="gpt-4o-mini-2024-07-18",
        messages=[
            {"role": "system", "content": "You are a helpful assistant that generates questions for a given text of summary notes."},
            {"role": "user", "content": f"Please generate a purposeful question for studying the following text, only use what is provided in the text with small variations:\n\n{note_text}"}
        ],
        max_tokens=100,
        temperature=0.7
    )
    
    flashcard_answers = client.chat.completions.create(
        model="gpt-4o-mini-2024-07-18",
        messages=[
            {"role": "system", "content": "You are a helpful assistant that generates answers for a given text of summary notes."},
            {"role": "user", "content": f"""
                                        You are a multiple-choice quiz generator.

                                        Task:
                                        Generate one multiple-choice question using the provided question and reference text.

                                        Inputs:
                                        - Question: {flashcard_question.choices[0].message.content}
                                        - Reference Text: {note_text}

                                        Output Format (strict):
                                        1. Provide 5 answer options labeled A–E.
                                        2. Mark exactly ONE correct answer with a leading asterisk (*).
                                        3. Do NOT explain the answer.
                                        4. Follow this exact format with no additional text:

                                        Q: <question text>
                                        A. <option>
                                        B. <option>
                                        C. <option>
                                        D. <option>
                                        E. <option>

                                        Example (format only):
                                        Q: What is 2 + 2?
                                        A. 3
                                        B. 5
                                        C. *4
                                        D. 6
                                        E. 9

                                        Begin:
                                        """
                                        }
        ],
        max_tokens=300,
        temperature=1.2
    )

    print(flashcard_answers.choices[0].message.content)

    return {
        "flashcard_question": flashcard_question.choices[0].message.content,
        "flashcard_answers": flashcard_answers.choices[0].message.content
    }

def get_previous_messages(note_id):
    fetched_results = chat_message.objects.filter(note_id=note_id).order_by('created_at')

    old_messages = []
    for message in fetched_results:
        old_messages.append({
            "role": message.role,
            "content": message.message
        })

    return old_messages

def generate_assistant_chat_message(old_messages, new_message):
    client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    full_messages = old_messages + [{"role": "user", "content": new_message}]

    response = client.chat.completions.create(
        model="gpt-4o-mini-2024-07-18",
        messages=full_messages,
        max_tokens=1000,
        temperature=0.7
    )

    return response.choices[0].message.content



    
    

