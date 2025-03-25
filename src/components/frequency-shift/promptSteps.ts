
import { PromptStep, IntentionSuggestion, VisualOverlayOption } from './types';

export const promptSteps: PromptStep[] = [
  {
    title: "Begin Your Frequency Shift",
    text: "Welcome, radiant soul. You didn't land here by accident. Something in you is ready to shift, align, and remember what it feels like to vibrate in your truth.\n\nBefore we go deeper, take a breath with me. Inhale presence… exhale the noise.\n\nNow tell me—what's calling you today?",
    options: [
      { text: "I want to feel better", tag: "mood_shift" },
      { text: "I want to explore my energy", tag: "chakra_journey" },
      { text: "I want to shift something deep", tag: "shadow_work" },
      { text: "I just want to listen and vibe", tag: "music_mode" },
      { text: "I don't know, I just felt drawn here", tag: "curiosity" }
    ]
  },
  // Feel Better Path
  {
    title: "Feel Better – Identify Discomfort",
    text: "We all have those days. You're not broken—you're simply out of tune. Let's gently recalibrate your energy and bring you back to your center.\n\nWhich part of you feels most out of sync right now?",
    options: [
      { text: "My body feels tense", tag: "root", frequency: 396, chakra: "Root" },
      { text: "I'm stuck in my head", tag: "crown", frequency: 963, chakra: "Crown" },
      { text: "My heart feels heavy", tag: "heart", frequency: 639, chakra: "Heart" },
      { text: "I just feel off", tag: "solar", frequency: 528, chakra: "Solar Plexus" }
    ]
  },
  // Explore Energy Path
  {
    title: "Explore Energy – Choose a Path",
    text: "Love that curiosity. Your energy is your compass, your mirror, your masterpiece. Let's explore it like sacred architecture.\n\nWhere would you like to begin?",
    options: [
      { text: "Chakra alignment", tag: "full_chakra" },
      { text: "Aura scan", tag: "intuitive_path" },
      { text: "Elemental energy", tag: "elemental_mode" },
      { text: "Surprise me", tag: "quantum_roll" }
    ]
  },
  // Shift Something Deep Path
  {
    title: "Shift Deeply – Choose What to Release",
    text: "You're ready to shift. That's powerful. The willingness to meet yourself is the beginning of transformation.\n\nIs there an emotion, memory, or belief you'd like to move through?",
    options: [
      { text: "Fear or anxiety", tag: "fear", frequency: 396, chakra: "Root" },
      { text: "Shame or guilt", tag: "shame", frequency: 417, chakra: "Sacral" },
      { text: "Old patterns", tag: "patterns", frequency: 741, chakra: "Throat" },
      { text: "Grief or loss", tag: "grief", frequency: 639, chakra: "Heart" },
      { text: "I'm not sure, I just feel it", tag: "general", frequency: 528, chakra: "Solar Plexus" }
    ]
  },
  // Just Listen and Vibe Path
  {
    title: "Just Vibe – Choose Your Sound",
    text: "Sometimes the soul just wants to bathe in sound. No goals, no fixing—just vibes.\n\nPick your vibe and I'll bring the frequency.",
    options: [
      { text: "Chill & grounded", tag: "chill", frequency: 396, chakra: "Root" },
      { text: "Uplifting & sparkly", tag: "uplifting", frequency: 528, chakra: "Solar Plexus" },
      { text: "Heart-opening", tag: "heart", frequency: 639, chakra: "Heart" },
      { text: "Cosmic float", tag: "cosmic", frequency: 963, chakra: "Crown" }
    ]
  },
  // Intuitive Journey Path
  {
    title: "Intuitive Journey – Guided Flow",
    text: "That's more than enough. Intuition brought you here—and that's the purest guidance of all.\n\nLet's do a soft scan and offer you a session based on your energetic field.",
    options: [
      { text: "Take me to my sound", tag: "random_recommendation" },
      { text: "Let me set an intention first", tag: "intention_path" },
      { text: "What does my energy say?", tag: "aura_prompt" }
    ]
  },
  // Visual Overlay Selection - New Step
  {
    title: "Visual Overlay – Choose Your Visual Vibe",
    text: "Want to enhance your journey with visuals?\n\nPick a visual frequency field that matches your vibe:",
    options: [
      { text: "Golden ripple aura", tag: "visual_gold", visualType: "gold" },
      { text: "Indigo fractal bloom", tag: "visual_indigo", visualType: "indigo" },
      { text: "Rose quartz wave", tag: "visual_pink", visualType: "pink" },
      { text: "Violet spiral mandala", tag: "visual_violet", visualType: "violet" },
      { text: "Just sound for now", tag: "visual_none", visualType: "none" }
    ]
  },
  // Session Recommendation - Final Step
  {
    title: "Your Frequency Match",
    text: "✨ You're aligned with [FREQUENCY] Hz ✨\n\nThis frequency supports your [CHAKRA / STATE]. Let it guide you inward, upward, and beyond.\n\nAre you ready to begin your sound journey?",
    options: [
      { text: "Yes, begin session", tag: "begin_session" },
      { text: "I want to learn more", tag: "learn_more" },
      { text: "Choose a different vibe", tag: "go_back" }
    ]
  }
];

export const visualOverlayOptions: VisualOverlayOption[] = [
  { 
    text: "Golden ripple aura", 
    tag: "visual_gold", 
    color: "from-yellow-200 to-amber-300",
    description: "A warm, flowing golden energy field that nurtures and protects."
  },
  { 
    text: "Indigo fractal bloom", 
    tag: "visual_indigo", 
    color: "from-indigo-400 to-blue-600",
    description: "Expanding geometric patterns in deep blues that stimulate insight."
  },
  { 
    text: "Rose quartz wave", 
    tag: "visual_pink", 
    color: "from-pink-200 to-rose-300",
    description: "Gentle pink waves of compassion and heart-centered healing."
  },
  { 
    text: "Violet spiral mandala", 
    tag: "visual_violet", 
    color: "from-purple-400 to-violet-600",
    description: "Swirling violet mandalas connecting you to higher consciousness."
  }
];

export const intentionSuggestions: IntentionSuggestion[] = [
  { text: "I choose peace." },
  { text: "I trust my path." },
  { text: "I am safe in my body." },
  { text: "I release what no longer serves me." },
  { text: "I am love, and I let it flow." }
];

export const midJourneyReflection = "You are doing beautifully. Let this sound be the soft bridge between where you've been and where you're becoming.";

export const frequencyGuideText = `Each frequency in this app is selected for its resonance with the body, mind, and subtle energy systems.

Here's a quick guide:

- 396 Hz – Releases fear, grounds the body (Root Chakra)
- 417 Hz – Clears negativity, unlocks flow (Sacral)
- 528 Hz – Transformation, DNA repair, love (Solar Plexus)
- 639 Hz – Heart healing, relationship energy (Heart)
- 741 Hz – Detox, inner truth (Throat)
- 852 Hz – Awakens intuition (Third Eye)
- 963 Hz – Divine connection, unity (Crown)

You'll be guided to the best frequency for your state, but you're always welcome to explore freely.`;

export const breathingPrompt = `Inhale slowly…
Feel the sound moving through your body.  
Exhale gently…  
Let go of anything that doesn't belong to this moment.`;

export const sessionCloseText = `Your frequency is now elevated. Stay here and soak it in, or take a moment to reflect.

What would you like to do next?`;

export const sessionCloseOptions = [
  { text: "Save this moment to my Timeline", tag: "save_session" },
  { text: "Set a new intention", tag: "reset_intention" },
  { text: "Return to Home", tag: "return_home" }
];
