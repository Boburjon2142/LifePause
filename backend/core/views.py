from pathlib import Path

from django.conf import settings
from django.http import Http404
from django.views.generic import TemplateView


class FrontendAppView(TemplateView):
    template_name = "frontend_dist/index.html"

    def get_template_names(self):
        template_path = Path(settings.BASE_DIR) / self.template_name
        if not template_path.exists():
            raise Http404(
                "Frontend build topilmadi. Avval frontend papkasida `npm run build` ishga tushiring."
            )
        return [self.template_name]
