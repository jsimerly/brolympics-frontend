import React from "react";
import GroupIcon from "@mui/icons-material/Group";
import SettingsIcon from "@mui/icons-material/Settings";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

const TeamEvent = () => (
  <div className="max-w-4xl mx-auto bg-white rounded-lg">
    <h2 className="mb-4 text-2xl font-bold text-gray-800">Team Event Format</h2>

    <div className="mb-6">
      <p className="leading-relaxed text-gray-600">
        In a team event, you will compete together as a team to accomplish a
        common goal, but not against other teams directly. The number of
        competitions or rounds you have to complete is determined by "Number of
        Competitions" in the Event Settings. After all competitions have been
        completed by all teams, scores will either be combined or averaged and
        scored against each other.
      </p>
    </div>

    <div className="p-4 mb-6 bg-gray-100 rounded-lg">
      <h3 className="mb-3 text-xl font-semibold text-gray-800">Key Points:</h3>
      <ul className="space-y-2">
        <li className="flex items-center">
          <GroupIcon className="mr-2 text-blue-500" />
          <span>Compete together as a team</span>
        </li>
        <li className="flex items-center">
          <SettingsIcon className="mr-2 text-blue-500" />
          <span>"Number of Competitions" determined by Event Settings</span>
        </li>
        <li className="flex items-center">
          <EqualizerIcon className="mr-2 text-blue-500" />
          <span>Scores are combined or averaged</span>
        </li>
        <li className="flex items-center">
          <CompareArrowsIcon className="mr-2 text-blue-500" />
          <span>Final scores are compared against other teams</span>
        </li>
      </ul>
    </div>

    <div className="p-4 border-l-4 border-yellow-400 bg-yellow-50">
      <h4 className="mb-2 text-lg font-semibold text-gray-800">
        Tie-Breaking Rule
      </h4>
      <p className="text-gray-600">
        If two teams tie on points, they will split the points. For example, if
        two teams tie for 1st and 2nd, they would receive (12 + 10) / 2 = 11
        points each.
      </p>
    </div>

    <div className="mt-6 text-gray-600">
      <EmojiEventsIcon className="inline-block mr-2 text-blue-500" />
      <span className="italic">
        Remember: You're working towards a common goal as a team, but your
        performance will be measured against other teams' results.
      </span>
    </div>
  </div>
);

export default TeamEvent;
