import React, { useEffect, useState } from "react";
import MenteeCodingProfiles from "./MenteeCodingProfiles";
import { FaUsers, FaTrophy, FaTasks, FaStar } from "react-icons/fa";

const MentorDefaultDash = ({ onMentorUpdate }) => {
  const [mentor] = useState(JSON.parse(localStorage.getItem("Mentor")));
  const Level = mentor.Qlevel_count || {};
  const Topic = mentor.topic_count || {};

  const StatCard = ({ title, value, icon: Icon, colorClass }) => (
    <div className={`relative overflow-hidden rounded-xl p-6 shadow-md bg-white dark:bg-gray-800 border-l-4 ${colorClass} transition-transform hover:scale-105`}>
        <div className="flex justify-between items-start">
            <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider">{title}</p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</h3>
            </div>
            <div className={`p-3 rounded-lg opacity-20 ${colorClass.replace('border-', 'bg-')}`}>
                <Icon size={24} className="text-black dark:text-white" />
            </div>
        </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Overview Section */}
      <section>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Overview</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Questions Assigned" 
            value={mentor?.total_q || 0} 
            icon={FaTasks} 
            colorClass="border-red-500" 
          />
          <StatCard 
            title="Team Score" 
            value={mentor?.score || 0} 
            icon={FaStar} 
            colorClass="border-green-500" 
          />
          <StatCard 
            title="Team Ranking" 
            value={mentor?.Mentorteam?.team_rank || "--"} 
            icon={FaTrophy} 
            colorClass="border-blue-500" 
          />
          <StatCard 
            title="Total Mentees" 
            value={mentor?.Mentorteam?.team_members?.length || 0} 
            icon={FaUsers} 
            colorClass="border-violet-500" 
          />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mentees List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
           <MenteeCodingProfiles mentor={mentor} onMentorUpdate={onMentorUpdate} />
        </div>

        {/* Stats Grid */}
        <div className="space-y-8">
             {/* Problem Difficulty Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Problem Difficulty</h2>
                <div className="grid grid-cols-3 gap-4">
                    {['Easy', 'Medium', 'Hard'].map((lvl) => (
                        <div key={lvl} className="flex flex-col items-center p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                            <span className={`text-sm font-bold ${lvl === 'Easy' ? 'text-green-500' : lvl === 'Medium' ? 'text-yellow-500' : 'text-red-500'}`}>{lvl}</span>
                            <span className="text-2xl font-bold dark:text-white">{Level[lvl] || 0}</span>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Topic Stats */}
             <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Topic Distribution</h2>
                <div className="flex flex-wrap gap-2">
                    {Object.entries(Topic).length > 0 ? (
                        Object.entries(Topic).map(([key, val]) => (
                            <div key={key} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-full text-sm">
                                <span className="text-blue-600 dark:text-blue-300 font-medium">{key}: </span>
                                <span className="font-bold dark:text-white">{val}</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No data available yet.</p>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDefaultDash;
