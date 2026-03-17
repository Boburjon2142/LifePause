#!/usr/bin/env python
import os
import sys
from pathlib import Path


def main():
    project_root = Path(__file__).resolve().parent
    backend_dir = project_root / "backend"

    sys.path.insert(0, str(backend_dir))
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")

    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Activate the virtual environment and install dependencies first."
        ) from exc

    execute_from_command_line([sys.argv[0], *sys.argv[1:]])


if __name__ == "__main__":
    main()
