import React, { useState } from "react";
import MenteeCodingProfiles from "./MenteeCodingProfiles";
import {
  FaUsers,
  FaTrophy,
  FaTasks,
  FaStar,
  FaChartLine,
  FaCode,
  FaFire,
} from "react-icons/fa";

const MentorDefaultDash = ({ onMentorUpdate }) => {
  const [mentor] = useState(JSON.parse(localStorage.getItem("Mentor")));
  const Level = mentor?.Qlevel_count || {};
  const Topic = mentor?.topic_count || {};

  /* ---------- Clean Solid Stat Card (No Strip) ---------- */
  const StatCard = ({ title, value, icon: Icon, bg }) => (
    <div
      className={`rounded-xl p-6 ${bg}
                  border border-gray-200 dark:border-gray-700
                  shadow-sm hover:shadow-md
                  transition-all duration-300`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
            {title}
          </p>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
            {value}
          </h3>
        </div>
        <Icon className="text-gray-400 dark:text-gray-500" size={26} />
      </div>
    </div>
  );

  const DifficultyCard = ({ level, count, color, bgColor, textColor }) => (
    <div
      className={`relative overflow-hidden rounded-xl ${bgColor} p-5
                  hover:shadow-md transition-all duration-300 hover:scale-105`}
    >
      <div className="flex flex-col items-center justify-center space-y-2">
        <div
          className={`w-16 h-16 rounded-full ${color.replace(
            "border",
            "bg"
          )}/10 flex items-center justify-center`}
        >
          <span className={`text-3xl font-bold ${textColor}`}>
            {count || 0}
          </span>
        </div>
        <span
          className={`text-sm font-bold ${textColor} uppercase tracking-wide`}
        >
          {level}
        </span>
      </div>
      <div className="absolute top-2 right-2">
        <FaCode className={`${textColor} opacity-20`} size={20} />
      </div>
    </div>
  );

  const TopicBadge = ({ topic, count }) => (
    <div
      className="inline-flex items-center gap-2 px-4 py-2
                 bg-gray-100 dark:bg-gray-700
                 rounded-full border border-gray-200 dark:border-gray-600"
    >
      <FaFire className="text-orange-500" size={14} />
      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        {topic}
      </span>
      <span
        className="text-xs font-bold text-white
                   bg-gray-800 dark:bg-gray-600
                   px-2 py-0.5 rounded-full"
      >
        {count}
      </span>
    </div>
  );

  const getTotalProblems = () =>
    (Level.Easy || 0) + (Level.Medium || 0) + (Level.Hard || 0);

  return (
    <div className="space-y-8 px-2">
      {/* ---------- Top Stats ---------- */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Questions Assigned"
            value={mentor?.total_q || 0}
            icon={FaTasks}
            bg="bg-red-100 dark:bg-red-900/30"
          />

          <StatCard
            title="Team Score"
            value={mentor?.score || 0}
            icon={FaStar}
            bg="bg-green-100 dark:bg-green-900/30"
          />

          <StatCard
            title="Team Ranking"
            value={mentor?.Mentorteam?.team_rank || "--"}
            icon={FaTrophy}
            bg="bg-blue-100 dark:bg-blue-900/30"
          />

          <StatCard
            title="Total Mentees"
            value={mentor?.Mentorteam?.team_members?.length || 0}
            icon={FaUsers}
            bg="bg-purple-100 dark:bg-purple-900/30"
          />
        </div>
      </section>

      {/* ---------- Main Grid ---------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Team Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <FaUsers className="text-blue-600 dark:text-blue-400" size={22} />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Your Team
              </h2>
            </div>
          </div>
          <div className="p-6">
            <MenteeCodingProfiles
              mentor={mentor}
              onMentorUpdate={onMentorUpdate}
            />
          </div>
        </div>

        {/* Stats Column */}
        <div className="space-y-6">
          {/* Difficulty */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <FaCode
                  className="text-gray-700 dark:text-gray-300"
                  size={20}
                />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Problem Difficulty
                </h2>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400 font-semibold">
                Total: {getTotalProblems()}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <DifficultyCard
                level="Easy"
                count={Level.Easy}
                color="border-green-500"
                bgColor="bg-green-50 dark:bg-green-900/20"
                textColor="text-green-600 dark:text-green-400"
              />

              <DifficultyCard
                level="Medium"
                count={Level.Medium}
                color="border-yellow-500"
                bgColor="bg-yellow-50 dark:bg-yellow-900/20"
                textColor="text-yellow-600 dark:text-yellow-400"
              />

              <DifficultyCard
                level="Hard"
                count={Level.Hard}
                color="border-red-500"
                bgColor="bg-red-50 dark:bg-red-900/20"
                textColor="text-red-600 dark:text-red-400"
              />
            </div>
          </div>

          {/* Topics */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <FaChartLine
                className="text-gray-700 dark:text-gray-300"
                size={20}
              />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Topic Distribution
              </h2>
            </div>

            <div className="flex flex-wrap gap-3">
              {Object.entries(Topic).length > 0 ? (
                Object.entries(Topic).map(([key, val]) => (
                  <TopicBadge key={key} topic={key} count={val} />
                ))
              ) : (
                <div className="w-full text-center py-8">
                  <FaCode
                    className="mx-auto text-gray-300 dark:text-gray-600 mb-3"
                    size={48}
                  />
                  <p className="text-gray-500 dark:text-gray-400">
                    No topics assigned yet
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    Start by adding problems to your mentees
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDefaultDash;

