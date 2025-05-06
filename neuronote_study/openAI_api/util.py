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
            {"role": "user", "content": f"Please summarize the following document and provide key points:\n\n{pdf_text}"}
        ],
        max_tokens=1000,
        temperature=0.7
    )

    title_response = client.chat.completions.create(
        model="gpt-4o-mini-2024-07-18",
        messages=[
            {"role": "system", "content": "You are a helpful assistant that generates titles for documents."},
            {"role": "user", "content": f"Please generate a title for the following document:\n\n{pdf_text}"}
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
            {"role": "user", "content": f"Please generate four wrong answers and one correct answer for the following question; make the false answers plausible:\n\n{flashcard_question} using the following text:\n\n{note_text}, separate the answers with the character '|' also highlight the correct answer with the characters '**'"}
        ],
        max_tokens=100,
        temperature=1.2
    )

    return {
        "flashcard_question": flashcard_question.choices[0].message.content,
        "flashcard_answers": flashcard_answers.choices[0].message.content
    }

    
    

