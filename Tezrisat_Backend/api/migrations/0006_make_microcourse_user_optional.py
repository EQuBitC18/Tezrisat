from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0005_userprofile_encrypted_openai_key"),
    ]

    operations = [
        migrations.AlterField(
            model_name="microcourse",
            name="user",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="microcourses",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
    ]
