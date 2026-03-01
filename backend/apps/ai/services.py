from apps.analytics.services import evaluate_day

def generate_ai_recommendations(user):
    evaluation = evaluate_day(user)
    risk = evaluation.get("burnout_risk", "Past")
    energy = evaluation.get("average_energy", 0)

    prompt = f"Foydalanuvchining o'rtacha energiyasi {energy}/5 va charchash xavfi {risk}. Tavsiyalar bering."

    if risk == "Yuqori":
        recommendation = "Charchash xavfi yuqori. Bugun tanaffus qiling, yuklamani kamaytiring va dam olishga e'tibor bering."
    elif energy < 3:
        recommendation = "Energiya darajasi pastroq. Avval muhim vazifalarni bajaring va tez-tez qisqa tanaffus qiling."
    else:
        recommendation = "Ishlar yaxshi ketmoqda. Shu ritmni saqlang, suv ichishni va muntazam ekran tanaffuslarini unutmang."

    return {
        "status": "muvaffaqiyatli",
        "prompt_generated": prompt,
        "recommendation": recommendation
    }
