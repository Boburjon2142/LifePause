from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('planning', '0004_recurringplan_repeat_days'),
    ]

    operations = [
        migrations.AddField(
            model_name='dailyplan',
            name='life_area',
            field=models.CharField(choices=[('health', 'Health'), ('learning', 'Learning'), ('finance', 'Finance'), ('personal', 'Personal / Emotional')], default='personal', max_length=20),
        ),
        migrations.AddField(
            model_name='dailyplan',
            name='sticker',
            field=models.CharField(blank=True, max_length=8),
        ),
        migrations.AddField(
            model_name='recurringplan',
            name='life_area',
            field=models.CharField(choices=[('health', 'Health'), ('learning', 'Learning'), ('finance', 'Finance'), ('personal', 'Personal / Emotional')], default='personal', max_length=20),
        ),
        migrations.AddField(
            model_name='recurringplan',
            name='sticker',
            field=models.CharField(blank=True, max_length=8),
        ),
    ]
