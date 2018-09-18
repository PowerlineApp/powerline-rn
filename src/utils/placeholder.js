/**
 * @flow
 */

type Type = 'post' | 'petition' | 'comment' | 'replie';

const postsPlaceholders = [
  "Let's do this.",
  "Today is a great day to take action.",
  "Write what you mean and mean what you write! But don't be mean!",
  "Don't hate the game. Change it.",
  "To build a movement, focus on changing hearts and minds. Storytelling is key.",
  "Great leaders amplify marginalized voices and help others speak for themselves.",
  "Keep the conversation going! Stay engaged to get your post boosted.",
  "Words have #power. Choose them wisely, @Friend.",
  "If you want to go fast, go alone. If you want to go far, join a Powerline group.",
  "If your post gets boosted, everyone in the group gets notified.",
  "Shorter posts have a better chance at going viral.",
  "When speaking the truth, think about what others will hear.",
  "Democracy is more than voting.",
  "Authors of boosted posts can invite all the upvoters to any group.",
  "Ask your followers to share this with their followers. Go viral!",
  "Change is inevitable. Progress is optional. - Tony Robbins",
  "You can fight the old. Or you can build the new.",
  "You are enough. Keep fighting the good fight!",
];

const petitionsPlaceholders = [
  "Start by telling a story. Then, close with a call for action.",
  "Share a vision. Inspire people to take a stand. Explain.",
  "Explain how their support creates pressure for change.",
  "Are you asking people to call their elected leaders? Contact information is in the Menu!",
  "You're a great leader, you know that?",
  "Why should someone support you? Make it personal. Make it relatable.",
  "How big is this issue? Why is it important? Why should people care? Personalize your story.",
  "Be clear about your goal and your objectives.",
  "Never doubt that a small group of thoughtful, committed citizens can change the world. Indeed, it's the only thing that ever has. - Margaret Mead.",
];

const commentsPlaceholders = [
  "It's all about different perspectives. Be kind.",
  "Don't attack people. Understand them.",
  "Listen first. Then ask questions.",
  "What's more important? Your solution or solving the problem?",
  "Stepping back can help you step forward.",
  "Revelations are better than zingers.",
  "Keep an open mind.",
  "Are we still on topic?",
  "Don't forget to breathe.",
  "Let's be honest -- and open-minded.",
  "Gratitude dissolves negativity.",
  "Not everyone speaks the same way.",
  "Put yourself in their shoes.",
  "Share this post with your followers.",
];

function randomMaxInt(max: number): number {
    return Math.floor(Math.random() * max);
}

function generatePlaceholder(type: Type): string {
  switch (type) {
    case 'post': {
      const index = randomMaxInt(postsPlaceholders.length);
      return postsPlaceholders[index];
    }
    case 'petition': {
      const index = randomMaxInt(petitionsPlaceholders.length);
      return petitionsPlaceholders[index];
    }
    case 'comment':
    {
      const index = randomMaxInt(petitionsPlaceholders.length);
      return commentsPlaceholders[index];
    }
    case 'replie': {
      const index = randomMaxInt(petitionsPlaceholders.length);
      return commentsPlaceholders[index];
    }
    default:
      return '';
  }
}

export default generatePlaceholder;