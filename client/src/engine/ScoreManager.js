class ScoreManager {
  static INITIAL_SCORES = {
    career: 50, health: 50, finance: 50,
    relationships: 50, happiness: 50, knowledge: 50
  };

  /**
   * Apply score effects, clamped to 0-100
   */
  static updateScores(currentScores, effects) {
    const updated = { ...currentScores };
    Object.entries(effects).forEach(([key, value]) => {
      if (updated[key] !== undefined) {
        updated[key] = Math.max(0, Math.min(100, updated[key] + value));
      }
    });
    return updated;
  }

  /**
   * Calculate total score (average of 5 main scores, excluding knowledge)
   */
  static calculateTotal(scores) {
    const { career, health, finance, relationships, happiness } = scores;
    return Math.round((career + health + finance + relationships + happiness) / 5);
  }

  /**
   * Get achievements based on final scores
   */
  static getAchievements(scores) {
    const achievements = [];
    if (scores.career >= 85) achievements.push({ title: '💼 Career Master', desc: 'Exceptional career focus!' });
    if (scores.health >= 85) achievements.push({ title: '💪 Health Guru', desc: 'Outstanding health choices!' });
    if (scores.finance >= 85) achievements.push({ title: '💰 Financial Wizard', desc: 'Smart money management!' });
    if (scores.relationships >= 85) achievements.push({ title: '❤️ Social Butterfly', desc: 'Strong relationships built!' });
    if (scores.happiness >= 85) achievements.push({ title: '😊 Joy Seeker', desc: 'Maximum happiness achieved!' });
    if (scores.knowledge >= 85) achievements.push({ title: '🧠 Knowledge Champion', desc: 'A true lifelong learner!' });

    const total = ScoreManager.calculateTotal(scores);
    if (total >= 80) achievements.push({ title: '🌟 Balanced Life', desc: 'Well-rounded life choices!' });
    if (total >= 90) achievements.push({ title: '👑 Life Master', desc: 'Extraordinary life journey!' });

    return achievements;
  }
}

export default ScoreManager;