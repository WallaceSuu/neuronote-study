import openai
from api.models import *
import os


def getPDFInfo(user_key):
    pdf_list = uploadPDF.objects.filter(user=user_key)
    pdf_info = []
    if not pdf_list.exists():
        return {"error": "No PDFs found"}
    for pdf in pdf_list:
        pdf_info.append({"pdf_file": pdf.pdf_file, "pdf_name": pdf.pdf_name, "key": pdf.pdf_key})
    return pdf_info

def generate_summary(pdf):
    client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    # Get the absolute path of the PDF file
    pdf_path = pdf.pdf_file.path

    file = client.files.create(
        file=open(pdf_path, "rb"),
        purpose="assistants"
    )

    assistant = client.beta.assistants.create(
        model="gpt-4o-mini",
        instructions="You are a helpful assistant that summarizes PDF documents and provides a list of key points on the given document's main topic.",
        tools=[{"type": "file_search"}],
        file_ids=[file.id]
    )

    thread = client.beta.threads.create()

    client.beta.threads.messages.create(
        thread_id=thread.id,
        role="user",
        content="Please summarize this PDF document and provide key points."
    )
    
    run = client.beta.threads.runs.create_and_poll(
        thread_id=thread.id,
        assistant_id=assistant.id
    )

    if run.status == "completed":
        messages = client.beta.threads.messages.list(thread_id=thread.id)
        return messages.data[0].content[0].text.value
    else:
        raise Exception(f"Failed to generate summary, status: {run.status}")
    
    

