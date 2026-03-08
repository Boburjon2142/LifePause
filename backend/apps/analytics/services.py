from django.utils import timezone
from datetime import timedelta
from apps.planning.models import DailyPlan
from .models import EnergyLog, MorningCheckIn, EveningReflection, FutureSelfGoal


LIFE_AREA_META = {
    "health": {"label": "Sog'liq", "icon": "💪", "color": "emerald"},
    "learning": {"label": "O'rganish", "icon": "📚", "color": "cyan"},
    "finance": {"label": "Moliya", "icon": "💸", "color": "amber"},
    "personal": {"label": "Shaxsiy", "icon": "🧘", "color": "violet"},
}

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
        "completed_plans": completed_plans,
        "life_areas": get_life_area_summary(user, date=date),
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
                        "life_area": plan.life_area,
                        "sticker": plan.sticker,
                    }
                    for plan in plans
                ],
            }
        )

    return results


def get_life_area_summary(user, date=None):
    target_date = date or timezone.localdate()
    plans = DailyPlan.objects.filter(user=user, start_time__date=target_date)
    summary = []

    for area_key, meta in LIFE_AREA_META.items():
        area_plans = plans.filter(life_area=area_key)
        total = area_plans.count()
        completed = area_plans.filter(completed=True).count()
        focus_minutes = round(sum(plan.focus_seconds for plan in area_plans) / 60, 1) if total else 0
        area_logs = EnergyLog.objects.filter(plan__in=area_plans)
        average_energy = round(sum(log.energy for log in area_logs) / len(area_logs), 2) if area_logs else 0
        summary.append({
            "key": area_key,
            **meta,
            "total_plans": total,
            "completed_plans": completed,
            "focus_minutes": focus_minutes,
            "average_energy": average_energy,
            "completion_rate": int((completed / total) * 100) if total else 0,
        })

    return summary


def get_growth_snapshot(user):
    today = timezone.localdate()
    morning = MorningCheckIn.objects.filter(user=user, date=today).first()
    reflection = EveningReflection.objects.filter(user=user).first()
    goals = list(FutureSelfGoal.objects.filter(user=user).values("horizon", "title", "description"))

    prompts = [
        "Bugun nimalar yaxshi ketdi?",
        "Buguningizni mazmunli qilgan narsa nima bo'ldi?",
        "Bugungi kichik yutug'ingiz nima edi?",
        "Ertaga nimani yaxshiroq qilmoqchisiz?",
    ]

    return {
        "morning_checkin": {
            "exists": bool(morning),
            "main_focus": morning.main_focus if morning else "",
            "priority_habit": morning.priority_habit if morning else "",
            "energy_level": morning.energy_level if morning else 3,
        },
        "latest_reflection": {
            "exists": bool(reflection),
            "date": reflection.date.isoformat() if reflection else None,
            "prompt": reflection.prompt if reflection else prompts[today.day % len(prompts)],
            "response": reflection.response if reflection else "",
            "mood": reflection.mood if reflection else "",
        },
        "future_goals": goals,
        "reflection_prompt": prompts[today.day % len(prompts)],
    }
