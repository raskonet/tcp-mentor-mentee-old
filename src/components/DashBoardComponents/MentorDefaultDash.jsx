import React, { useEffect, useState } from "react";
import MenteeCodingProfiles from "./MenteeCodingProfiles";
import { FaUsers, FaTrophy, FaTasks, FaStar, FaChartLine, FaCode, FaFire } from "react-icons/fa";

const MentorDefaultDash = ({ onMentorUpdate }) => {
  const [mentor] = useState(JSON.parse(localStorage.getItem("Mentor")));
  const Level = mentor.Qlevel_count || {};
  const Topic = mentor.topic_count || {};

  const StatCard = ({ title, value, icon: Icon, gradient, iconBg }) => (
    <div className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${gradient} shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-white/20`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-2">{title}</p>
          <h3 className="text-4xl font-extrabold text-white">{value}</h3>
        </div>
        <div className={`${iconBg} p-4 rounded-xl backdrop-blur-sm`}>
          <Icon size={28} className="text-white drop-shadow-lg" />
        </div>
      </div>
      <div className="absolute -right-6 -bottom-6 opacity-10">
        <Icon size={120} className="text-white" />
      </div>
    </div>
  );

  const DifficultyCard = ({ level, count, color, bgColor, textColor }) => (
    <div className={`relative overflow-hidden rounded-xl ${bgColor} p-5 border-l-4 ${color} hover:shadow-lg transition-all duration-300 hover:scale-105`}>
      <div className="flex flex-col items-center justify-center space-y-2">
        <div className={`w-16 h-16 rounded-full ${color.replace('border', 'bg')}/10 flex items-center justify-center`}>
          <span className={`text-3xl font-bold ${textColor}`}>{count || 0}</span>
        </div>
        <span className={`text-sm font-bold ${textColor} uppercase tracking-wide`}>{level}</span>
      </div>
      <div className="absolute top-2 right-2">
        <FaCode className={`${textColor} opacity-20`} size={20} />
      </div>
    </div>
  );

  const TopicBadge = ({ topic, count }) => (
    <div className="group relative inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 rounded-full border border-blue-500/30 hover:border-blue-500/50 transition-all duration-300 cursor-default">
      <FaFire className="text-blue-500 dark:text-blue-400 group-hover:text-purple-500 transition-colors" size={14} />
      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{topic}</span>
      <span className="text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 px-2 py-0.5 rounded-full">{count}</span>
    </div>
  );

  const getTotalProblems = () => {
    return (Level.Easy || 0) + (Level.Medium || 0) + (Level.Hard || 0);
  };

  return (
    <div className="space-y-8 px-2">
      {/* Welcome Header with Enhanced Design */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <FaChartLine className="text-white" size={32} />
            <h1 className="text-4xl font-extrabold text-white">Dashboard Overview</h1>
          </div>
          <p className="text-white/90 text-lg">Monitor your mentorship progress and team performance</p>
        </div>
      </div>

      {/* Overview Section with Enhanced Stats */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Key Metrics</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Questions Assigned" 
            value={mentor?.total_q || 0} 
            icon={FaTasks} 
            gradient="from-red-500 to-orange-500"
            iconBg="bg-white/20"
          />
          <StatCard 
            title="Team Score" 
            value={mentor?.score || 0} 
            icon={FaStar} 
            gradient="from-green-500 to-emerald-500"
            iconBg="bg-white/20"
          />
          <StatCard 
            title="Team Ranking" 
            value={mentor?.Mentorteam?.team_rank || "--"} 
            icon={FaTrophy} 
            gradient="from-blue-500 to-cyan-500"
            iconBg="bg-white/20"
          />
          <StatCard 
            title="Total Mentees" 
            value={mentor?.Mentorteam?.team_members?.length || 0} 
            icon={FaUsers} 
            gradient="from-purple-500 to-pink-500"
            iconBg="bg-white/20"
          />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mentees List with Enhanced Container */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-1">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-t-xl">
              <div className="flex items-center gap-3">
                <FaUsers className="text-blue-600 dark:text-blue-400" size={24} />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Team</h2>
              </div>
            </div>
          </div>
          <div className="p-6">
            <MenteeCodingProfiles mentor={mentor} onMentorUpdate={onMentorUpdate} />
          </div>
        </div>

        {/* Stats Grid with Enhanced Design */}
        <div className="space-y-6">
          {/* Problem Difficulty Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <FaCode className="text-white" size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Problem Difficulty</h2>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400 font-semibold">Total: {getTotalProblems()}</span>
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
          
          {/* Topic Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <FaChartLine className="text-white" size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Topic Distribution</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {Object.entries(Topic).length > 0 ? (
                Object.entries(Topic).map(([key, val]) => (
                  <TopicBadge key={key} topic={key} count={val} />
                ))
              ) : (
                <div className="w-full text-center py-8">
                  <FaCode className="mx-auto text-gray-300 dark:text-gray-600 mb-3" size={48} />
                  <p className="text-gray-500 dark:text-gray-400">No topics assigned yet</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Start by adding problems to your mentees</p>
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
