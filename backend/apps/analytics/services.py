from django.utils import timezone
from datetime import timedelta
from apps.planning.models import DailyPlan
from .models import EnergyLog

def evaluate_day(user, date=None):
    if not date:
        date = timezone.now().date()
        
    plans = DailyPlan.objects.filter(user=user, start_time__date=date)
    logs = EnergyLog.objects.filter(plan__in=plans)

    if not plans.exists() and not logs.exists():
        return {
            "average_energy": 0,
            "burnout_risk": "Past",
            "productivity_score": 0
        }

    # Evaluate
    average_energy = round(sum(log.energy for log in logs) / len(logs), 2) if logs else 0
    average_stress = round(sum(log.stress for log in logs) / len(logs), 2) if logs else 0
    
    completed_plans = plans.filter(completed=True).count()
    productivity_score = int((completed_plans / plans.count()) * 100) if plans.count() > 0 else 0

    if average_stress > 3.5 and average_energy < 2.5:
        burnout_risk = "Yuqori"
    elif average_stress > 2.5 or average_energy < 3:
        burnout_risk = "O'rta"
    else:
        burnout_risk = "Past"

    return {
        "average_energy": average_energy,
        "burnout_risk": burnout_risk,
        "productivity_score": productivity_score,
        "total_plans": plans.count(),
        "completed_plans": completed_plans
    }


def _date_window(days):
    today = timezone.localdate()
    start_date = today - timedelta(days=days - 1)
    return [start_date + timedelta(days=offset) for offset in range(days)]


def get_progress_series(user, days=7):
    dates = _date_window(days)
    progress = []

    for current_date in dates:
        plans = DailyPlan.objects.filter(user=user, start_time__date=current_date)
        logs = EnergyLog.objects.filter(plan__in=plans)

        total_plans = plans.count()
        completed_plans = plans.filter(completed=True).count()
        avg_energy = round(sum(log.energy for log in logs) / len(logs), 2) if logs else 0
        focus_seconds = sum(plan.focus_seconds for plan in plans)
        productivity = int((completed_plans / total_plans) * 100) if total_plans > 0 else 0

        progress.append(
            {
                "date": current_date.isoformat(),
                "total_plans": total_plans,
                "completed_plans": completed_plans,
                "average_energy": avg_energy,
                "focus_minutes": round(focus_seconds / 60, 1),
                "productivity_score": productivity,
            }
        )

    return progress


def get_results_summary(user, days=14):
    dates = reversed(_date_window(days))
    results = []

    for current_date in dates:
        plans = DailyPlan.objects.filter(user=user, start_time__date=current_date).order_by("start_time")
        logs = EnergyLog.objects.filter(plan__in=plans)

        if not plans.exists() and not logs.exists():
            continue

        results.append(
            {
                "date": current_date.isoformat(),
                "total_plans": plans.count(),
                "completed_plans": plans.filter(completed=True).count(),
                "focus_minutes": round(sum(plan.focus_seconds for plan in plans) / 60, 1),
                "average_energy": round(sum(log.energy for log in logs) / len(logs), 2) if logs else 0,
                "average_focus": round(sum(log.focus for log in logs) / len(logs), 2) if logs else 0,
                "average_stress": round(sum(log.stress for log in logs) / len(logs), 2) if logs else 0,
                "tasks": [
                    {
                        "id": plan.id,
                        "title": plan.title,
                        "completed": plan.completed,
                        "focus_minutes": round(plan.focus_seconds / 60, 1),
                    }
                    for plan in plans
                ],
            }
        )

    return results
