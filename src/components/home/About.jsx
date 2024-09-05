import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-neutralDark">
      {/* Header */}
      <header className="px-4 py-8 text-white bg-blue-600">
        <h1 className="mb-4 text-3xl font-bold text-center">
          Welcome to Brolympics!
        </h1>
      </header>

      {/* Description */}
      <section className="px-4 pt-4">
        <h2 className="mb-4 text-2xl font-semibold">What is Brolympics?</h2>
        <p className="text-gray-700">
          Brolympics is a competition where many teams of two meet in a myrad of
          games to prove they're the best. From go-karting to beer die to
          trivia, you'll compete in to gain as many points as possible
          throughout the weekend.
        </p>
      </section>

      {/* Description */}
      <section className="px-4 py-4">
        <h2 className="mb-2 text-2xl font-semibold">Rules</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Team Formation</h3>
            <p>• Teams always consist of 2 players.</p>
            <p>• You choose your own partner for the competition.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Event Types</h3>
            <p>1. Head-to-Head Events:</p>
            <ul className="ml-4 list-disc list-inside">
              <p>• Teams compete directly against each other.</p>
              <p>
                • After round-robin, top 4 teams enter a bracket tournament.
              </p>
            </ul>
            <p>2. Score-Based Events:</p>
            <ul className="ml-4 list-disc list-inside">
              <p>
                • Teams compete against everyone's scores (e.g., trivia,
                bowling).
              </p>
              <p>
                • Final rankings are determined by total scores or best
                individual scores.
              </p>
            </ul>
          </div>
          <div>
            <h3 className="mb-2 text-lg font-semibold">Scoring</h3>
            <p className="mb-2">Scoring in the top 3 will earn bonus points.</p>
            <table className="w-full border border-collapse border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 border border-gray-300">Place</th>
                  <th className="px-4 py-2 border border-gray-300">Points</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">1st</td>
                  <td className="px-4 py-2 border border-gray-300">
                    3 + 2nd place points
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">2nd</td>
                  <td className="px-4 py-2 border border-gray-300">
                    2 + 3rd place points
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">3rd</td>
                  <td className="px-4 py-2 border border-gray-300">
                    2 + 4th place points
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">
                    4th and below
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    1 + previous place's points
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border border-gray-300">
                    Last Place
                  </td>
                  <td className="px-4 py-2 border border-gray-300"> 1 </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
