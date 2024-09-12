import ScaleIcon from "@mui/icons-material/Scale";
import BarChartIcon from "@mui/icons-material/BarChart";
import TagIcon from "@mui/icons-material/Tag";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import FlagIcon from "@mui/icons-material/Flag";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

const HeadToHead = () => (
  <div className="max-w-4xl mx-auto bg-white rounded-lg">
    <h2 className="mb-4 text-2xl font-bold text-gray-800">
      Head to Head Format
    </h2>

    <div className="mb-6">
      <p className="leading-relaxed text-gray-600">
        In a head to head matchup, you will initially play a partial round
        robin. The number of matches you'll play is determined by the event
        setting "Number of Matches". After the partial round robin has been
        completed, you will move to a bracket stage where the top 4 players will
        compete for the podium.
      </p>
    </div>

    <h3 className="mb-3 text-xl font-semibold text-gray-800">
      Ranking and Tie Breaking
    </h3>
    <p className="mb-4 text-gray-600">
      To rank teams and move them to the playoffs, win rate takes priority (ties
      count as half wins). In the event of a tie to make the playoffs, the
      following rules are followed to determine which team(s) advance. If you
      are not tied for the playoffs and have the same win rate, your team will
      split points with other teams of the same win rate.
    </p>

    <div className="p-4 bg-gray-100 rounded-lg">
      <h4 className="mb-3 text-lg font-semibold text-gray-800">
        Tie Breakers:
      </h4>
      <ul className="space-y-2">
        <li className="flex items-center">
          <FlagIcon className="mr-2 text-blue-500" />
          <span>Head to Head Wins</span>
        </li>
        <li className="flex items-center">
          <EmojiEventsIcon className="mr-2 text-blue-500" />
          <span>Total Games Won</span>
        </li>
        <li className="flex items-center">
          <ScaleIcon className="mr-2 text-blue-500" />
          <span>Victory Margin</span>
        </li>
        <li className="flex items-center">
          <BarChartIcon className="mr-2 text-blue-500" />
          <span>Strength of Schedule</span>
        </li>
        <li className="flex items-center">
          <TagIcon className="mr-2 text-blue-500" />
          <span>Strength of Schedule Wins</span>
        </li>
        <li className="flex items-center">
          <HelpOutlineIcon className="mr-2 text-blue-500" />
          <span>Random</span>
        </li>
      </ul>
    </div>
  </div>
);

export default HeadToHead;
