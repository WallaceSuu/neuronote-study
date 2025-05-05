from django.core.management.base import BaseCommand
from api.models import User, uploadPDF, note

class Command(BaseCommand):
    help = 'Safely deletes all data in the correct order to avoid foreign key constraints'

    def handle(self, *args, **options):
        # First delete all notes
        note.objects.all().delete()
        self.stdout.write(self.style.SUCCESS('Successfully deleted all notes'))
        
        # Then delete all PDFs
        uploadPDF.objects.all().delete()
        self.stdout.write(self.style.SUCCESS('Successfully deleted all PDFs'))
        
        # Finally delete all users
        User.objects.all().delete()
        self.stdout.write(self.style.SUCCESS('Successfully deleted all users')) 