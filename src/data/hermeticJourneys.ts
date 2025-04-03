
import { HealingFrequency } from "./frequencies";

export interface HermeticJourney {
  id: string;
  title: string;
  frequency: number;
  chakra: string;
  visualTheme: string;
  audioDescription: string;
  affirmation: string;
  guidedPrompt: string;
  sessionFlow: string[];
  tag: string;
  principle: string;
}

export const hermeticJourneys: HermeticJourney[] = [
  {
    id: "mentalism",
    title: "The All is Mind – Journey of Conscious Creation",
    frequency: 963,
    chakra: "Crown",
    visualTheme: "Violet geometric grid expanding outward",
    audioDescription: "963Hz ambient tones with ethereal textures",
    affirmation: "My thoughts are the origin of my reality.",
    guidedPrompt: 
      "Bring your awareness to the center of your mind.\n" +
      "What are you currently creating with your thoughts?\n" +
      "Can you shift them toward expansion, clarity, and peace?\n" +
      "You are the mind of the All.",
    sessionFlow: [
      "Show affirmation + visual overlay",
      "Play 963Hz track",
      "Display journal/intention prompt mid-session",
      "Save reflection to timeline"
    ],
    tag: "hermetic_mentalism",
    principle: "Mentalism"
  },
  {
    id: "correspondence",
    title: "As Above, So Below – The Mirror Within",
    frequency: 852,
    chakra: "Third Eye",
    visualTheme: "Indigo fractal mirror patterns",
    audioDescription: "852Hz layered with soft chimes and harmonics",
    affirmation: "I shift my world by shifting within.",
    guidedPrompt: 
      "What outer situation feels out of alignment?\n" +
      "Reflect inward—what does this reveal about your inner world?\n" +
      "As you harmonize within, observe what shifts externally.",
    sessionFlow: [
      "Visual: Kaleidoscopic geometry overlays",
      "Audio: 852Hz ambient mirror tones",
      "Journal prompt during session",
      "Save to timeline under \"Correspondence\""
    ],
    tag: "hermetic_correspondence",
    principle: "Correspondence"
  },
  {
    id: "vibration",
    title: "Everything Moves – Frequency Alignment Journey",
    frequency: 528,
    chakra: "Solar Plexus",
    visualTheme: "Golden wave pulses",
    audioDescription: "528Hz over soft lo-fi ambient textures",
    affirmation: "I align with the frequency of my highest self.",
    guidedPrompt: 
      "Tune into your body. Where do you feel stuck energy?\n" +
      "Visualize sound waves washing through you.\n" +
      "Let your frequency rise into clarity.",
    sessionFlow: [
      "Pulse animation synced to audio",
      "Journal prompt after breathwork moment",
      "User selects dominant vibe post-session (calm, energized, etc.)",
      "Timeline tag: \"Vibration Alignment\""
    ],
    tag: "hermetic_vibration",
    principle: "Vibration"
  },
  {
    id: "polarity",
    title: "Duality as Teacher – Harmony Within Opposites",
    frequency: 639,
    chakra: "Heart",
    visualTheme: "Yin-yang glow with blended gradients",
    audioDescription: "639Hz layered with soft percussive heartbeat",
    affirmation: "I find harmony within all contrasts.",
    guidedPrompt: 
      "Where in your life are you resisting one side of the polarity?\n" +
      "What is the opposite trying to teach you?\n" +
      "Balance is your bridge to power.",
    sessionFlow: [
      "Opening dual-tone animation",
      "Breath + journal prompt after midpoint",
      "Close with intention to harmonize opposing forces",
      "Timeline tag: \"Polarity Integration\""
    ],
    tag: "hermetic_polarity",
    principle: "Polarity"
  },
  {
    id: "rhythm",
    title: "Riding the Cycles – Flow with the Universe",
    frequency: 417,
    chakra: "Sacral",
    visualTheme: "Flowing wave animations",
    audioDescription: "417Hz paired with oceanic ambience",
    affirmation: "I ride the rhythm of life with grace.",
    guidedPrompt: 
      "What cycle are you currently in?\n" +
      "Are you in resistance or surrender?\n" +
      "Allow the rhythm to guide your next aligned action.",
    sessionFlow: [
      "Tidal wave visual sync",
      "Audio loop with rhythmic breathing guide",
      "Prompt: \"Write a mantra for this phase.\"",
      "Timeline tag: \"Rhythmic Awareness\""
    ],
    tag: "hermetic_rhythm",
    principle: "Rhythm"
  },
  {
    id: "cause-effect",
    title: "Conscious Creator – You Are the Spark",
    frequency: 741,
    chakra: "Throat",
    visualTheme: "Ripple-to-reality animation",
    audioDescription: "741Hz with bell tones and intention pulses",
    affirmation: "I act with conscious intent.",
    guidedPrompt: 
      "What ripple will your next choice send out?\n" +
      "Speak your intention. Let it vibrate through reality.\n" +
      "The effect begins now.",
    sessionFlow: [
      "Spoken word intro over 741Hz base",
      "Guided visualization: seed → ripple → blossom",
      "Audio rises with user's breath pacing",
      "Journal reflection + affirmation lock-in",
      "Timeline tag: \"Cause Initiated\""
    ],
    tag: "hermetic_cause_effect",
    principle: "Cause & Effect"
  },
  {
    id: "gender",
    title: "Sacred Union – Balancing the Divine Energies",
    frequency: 396,
    chakra: "Root",
    visualTheme: "Interweaving currents of soft red and silver",
    audioDescription: "396Hz deep grounding tone with soft feminine melodies",
    affirmation: "I embody both stillness and flow.",
    guidedPrompt: 
      "Where do you lead from force? Where do you lead from feeling?\n" +
      "Invite your masculine and feminine into union.\n" +
      "Let this inner balance guide your outer world.",
    sessionFlow: [
      "Grounding animation + breath sync",
      "Balance visualization: one energy flows in, one flows out",
      "Mid-session journaling: \"What does balance look like in you?\"",
      "Timeline tag: \"Gender Integration\""
    ],
    tag: "hermetic_gender",
    principle: "Gender"
  }
];

// Helper function to find a journey by principle
export function getJourneyByPrinciple(principleName: string): HermeticJourney | undefined {
  return hermeticJourneys.find(journey => 
    journey.principle.toLowerCase() === principleName.toLowerCase()
  );
}

// Helper function to find a journey by tag
export function getJourneyByTag(tag: string): HermeticJourney | undefined {
  return hermeticJourneys.find(journey => journey.tag === tag);
}
