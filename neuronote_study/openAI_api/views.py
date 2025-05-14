from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from api.models import *
from .util import *
import openai

# Create your views here.

class GetUserPDFsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            # Get PDFs that don't have any associated notes
            extracted_pdfs = uploadPDF.objects.filter(
                user=request.user
            ).exclude(
                pdf_key__in=note.objects.values_list('note_key__pdf_key', flat=True)
            ).order_by('-created_at')
            
            pdf_data = [{
                'pdf_id': pdf.pdf_key,
                'pdf_name': pdf.pdf_name,
                'created_at': pdf.created_at,
                'file_url': request.build_absolute_uri(pdf.pdf_file.url) if pdf.pdf_file else None
            } for pdf in extracted_pdfs]
            
            return Response({
                'status': 'success',
                'pdfs': pdf_data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class createNoteView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            pdf_key = request.data.get('pdf_key')
            if not pdf_key:
                return Response({
                    'status': 'error',
                    'message': 'PDF key is required'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Get the PDF object
            pdf = uploadPDF.objects.get(pdf_key=pdf_key, user=request.user)
            
            # Generate summary using OpenAI
            try:
                note_text = generate_summary_and_title(pdf)["text"]
                note_title = generate_summary_and_title(pdf)["title"]
            except Exception as e:
                return Response({
                    'status': 'error',
                    'message': f'Failed to generate summary or title: {str(e)}'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            # Create the note
            new_note = note.objects.create(
                note_title=note_title,
                note_text=note_text,
                user=request.user,
                note_key=pdf
            )
            
            return Response({
                'status': 'success',
                'message': 'Note created successfully',
                'note_id': new_note.id,
                'note_text': note_text,
                'note_title': note_title
            }, status=status.HTTP_201_CREATED)
            
        except uploadPDF.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'PDF not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ProcessPDFsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            # Get the PDFs that were just uploaded
            pdfs = uploadPDF.objects.filter(
                user=request.user
            ).order_by('-created_at')[:1]  # Get only the most recently uploaded PDF
            
            if not pdfs.exists():
                return Response({
                    'status': 'error',
                    'message': 'No PDFs found to process'
                }, status=status.HTTP_404_NOT_FOUND)
            
            # Process each PDF and create notes
            results = []
            for pdf in pdfs:
                # Create note for the PDF
                note_request = request._request
                note_request.data = {'pdf_key': pdf.pdf_key}
                note_response = createNoteView().post(note_request)
                results.append({
                    'pdf_id': pdf.pdf_key,
                    'pdf_name': pdf.pdf_name,
                    'status': 'success' if note_response.status_code == status.HTTP_201_CREATED else 'failed',
                    'message': note_response.data.get('message', '')
                })
            
            return Response({
                'status': 'success',
                'results': results
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetNotesView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            # Get all notes for the current user
            user_notes = note.objects.filter(user=request.user).order_by('-created_at')
            
            notes_data = [{
                'note_title': note_obj.note_title,
                'note_id': note_obj.id,
                'pdf_id': note_obj.note_key.pdf_key,
                'pdf_name': note_obj.note_key.pdf_name,
                'note_text': note_obj.note_text,
                'created_at': note_obj.created_at
            } for note_obj in user_notes]
            
            return Response({
                'status': 'success',
                'notes': notes_data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class generateFlashcardsView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            note_id = request.data.get('note_id')
            
            if not note_id:
                return Response({
                    'status': 'error',
                    'message': 'Note ID is required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            note_obj = note.objects.get(id=note_id)
            note_text = note_obj.note_text

            flashcard_data = generate_flashcards(note_text)
            flashcard_question = flashcard_data.get("flashcard_question")
            flashcard_answers = flashcard_data.get("flashcard_answers")

            new_flashcard = flashcard.objects.create(
                flashcard_title=note_obj.note_title,
                flashcard_question=flashcard_question,
                user=request.user,
                note=note_obj
            )

            # Parse the lettered format answers
            formatted_answers = []
            for line in flashcard_answers.split('\n'):
                line = line.strip()
                if line and line[0] in 'ABCDE' and '. ' in line:
                    # Extract the answer text after the letter and dot
                    answer_text = line.split('. ', 1)[1].strip()
                    is_correct = answer_text.startswith('*') or '*' in answer_text
                    if is_correct:
                        # Remove the asterisk from the answer text
                        answer_text = answer_text.replace('*', '')
                    
                    new_flashcard_answer = flashcard_answer.objects.create(
                        flashcard_answer=new_flashcard,
                        answer_text=answer_text,
                        is_correct=is_correct
                    )
                    new_flashcard_answer.save()
                    formatted_answers.append({
                        'text': answer_text,
                        'is_correct': is_correct
                    })

            new_flashcard.save()

            return Response({
                'status': 'success',
                'flashcard': {
                    'id': new_flashcard.id,
                    'title': new_flashcard.flashcard_title,
                    'question': new_flashcard.flashcard_question,
                    'answers': formatted_answers
                }
            }, status=status.HTTP_200_OK)

        except note.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'Note not found'
            }, status=status.HTTP_404_NOT_FOUND)
            
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class getFlashcardsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, note_id=None):
        try:
            # Get flashcards for the current user
            user_flashcards = flashcard.objects.filter(user=request.user)
            
            # If note_id is provided, filter flashcards by note
            if note_id:
                user_flashcards = user_flashcards.filter(note_id=note_id)
            
            user_flashcards = user_flashcards.order_by('-created_at')
            
            flashcards_data = []
            for flashcard_obj in user_flashcards:
                # Get all answers for this flashcard
                answers = flashcard_obj.flashcard_answers.all()
                formatted_answers = [{
                    'text': answer.answer_text,
                    'is_correct': answer.is_correct
                } for answer in answers]
                
                flashcards_data.append({
                    'id': flashcard_obj.id,
                    'title': flashcard_obj.flashcard_title, 
                    'question': flashcard_obj.flashcard_question,
                    'answers': formatted_answers,
                    'created_at': flashcard_obj.created_at,
                    'note': flashcard_obj.note.id
                })

            return Response({
                'status': 'success',
                'flashcards': flashcards_data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
