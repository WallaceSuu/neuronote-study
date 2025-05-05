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

def generate_summary(pdf):
    client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    # Get the absolute path of the PDF file
    pdf_path = pdf.pdf_file.path

    # Extract text from PDF
    pdf_text = extract_text_from_pdf(pdf_path)
    
    if not pdf_text.strip():
        raise Exception("Could not extract text from PDF")

    # Create the completion
    response = client.chat.completions.create(
        model="gpt-4o-mini-2024-07-18",
        messages=[
            {"role": "system", "content": "You are a helpful assistant that summarizes documents and provides a list of key points on the given document's main topic."},
            {"role": "user", "content": f"Please summarize the following document and provide key points:\n\n{pdf_text}"}
        ],
        max_tokens=1000,
        temperature=0.7
    )

    return response.choices[0].message.content
    
    

