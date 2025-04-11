import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from '@/pages/Home';
import Meditations from '@/pages/Meditations';
import HermeticPrinciples from '@/pages/HermeticPrinciples';
import FrequencyShifting from '@/pages/FrequencyShifting';
import JourneyTemplates from '@/pages/JourneyTemplates';
import JourneyPlayer from '@/pages/JourneyPlayer';
import Admin from '@/pages/Admin';
import JourneyAudioAdmin from '@/pages/admin/JourneyAudioAdmin';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/meditations",
    element: <Meditations />,
  },
  {
    path: "/hermetic-principles",
    element: <HermeticPrinciples />,
  },
  {
    path: "/frequency-shifting",
    element: <FrequencyShifting />,
  },
  {
    path: '/journey-templates',
    element: <JourneyTemplates />
  },
  {
    path: '/journey-player/:journeyId',
    element: <JourneyPlayer />
  },
  {
    path: '/admin',
    element: <Admin />
  },
  {
    path: '/admin/journey-audio-admin',
    element: <JourneyAudioAdmin />
  }
]);

function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

export default App;
