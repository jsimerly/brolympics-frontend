import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="px-4 py-8 text-white bg-primary">
        <h1 className="text-center header">Welcome to Brolympics!</h1>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto container-padding">
        {/* Description */}
        <section className="my-8">
          <h2 className="header-2 text-primary">What is Brolympics?</h2>
          <p className="text-light">
            Brolympics is a competition where many teams of two meet in a myriad
            of games to prove they're the best. From go-karting to beer die to
            trivia, you'll compete to gain as many points as possible throughout
            the weekend.
          </p>
        </section>

        {/* Rules */}
        <section className="my-8">
          <h2 className="header-2">Rules</h2>
          <div className="space-y-6">
            <div className="p-4 card">
              <h3 className="header-3 text-primary">Team Formation</h3>
              <ul className="list-disc list-inside text-light">
                <li>Teams always consist of 2 players.</li>
                <li>You choose your own partner for the competition.</li>
              </ul>
            </div>
            <div className="p-4 card">
              <h3 className="header-3 text-tertiary">Event Types</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="header-4">1. Head-to-Head Events</h4>
                  <ul className="list-disc list-inside text-light">
                    <li>Teams compete directly against each other.</li>
                    <li>
                      After round-robin, top 4 teams enter a bracket tournament.
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="header-4">2. Score-Based Events</h4>
                  <ul className="list-disc list-inside">
                    <li>
                      Teams compete against everyone's scores (e.g., trivia,
                      bowling).
                    </li>
                    <li>
                      Final rankings are determined by total scores or best
                      individual scores.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="p-4 card">
              <h3 className="header-3 text-red">Scoring</h3>
              <p className="mb-4 text-light">
                Scoring in the top 3 will earn bonus points.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="text-white bg-secondary-light">
                      <th className="px-4 py-2 text-left">Place</th>
                      <th className="px-4 py-2 text-left">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-gray-50">
                      <td className="px-4 py-2 border-t border-gray-200">
                        1st
                      </td>
                      <td className="px-4 py-2 border-t border-gray-200">
                        3 + 2nd place points
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border-t border-gray-200">
                        2nd
                      </td>
                      <td className="px-4 py-2 border-t border-gray-200">
                        2 + 3rd place points
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-4 py-2 border-t border-gray-200">
                        3rd
                      </td>
                      <td className="px-4 py-2 border-t border-gray-200">
                        2 + 4th place points
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border-t border-gray-200">
                        4th and below
                      </td>
                      <td className="px-4 py-2 border-t border-gray-200">
                        1 + previous place's points
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-4 py-2 border-t border-gray-200">
                        Last Place
                      </td>
                      <td className="px-4 py-2 border-t border-gray-200">1</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;
