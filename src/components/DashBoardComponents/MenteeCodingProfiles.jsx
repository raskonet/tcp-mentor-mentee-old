import React, { useEffect, useRef, useState } from 'react';
import Modal from 'react-modal';
import MenteesUrlsCard from '../MenteesUrlsCard';
import close from '../../assets/images/cross.svg';
import closelight from '../../assets/images/cross.png';
import { toast } from 'react-toastify';
import { fetchDataFromApi, fetchDataFromApiWithResponse } from '../../utils/api';
import { FaSpinner, FaEdit, FaCheck, FaTimes, FaUsers, FaStar } from 'react-icons/fa';

const MenteeCodingProfiles = ({ mentor, mentee, onMenteeUpdate, onMentorUpdate }) => {
  const [menteeData, setMenteeData] = useState();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [teamData, setTeamData] = useState(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [isUpdatingName, setIsUpdatingName] = useState(false);

  const inputRef = useRef();

  const fetchData = async () => {
    setLoading(true);
    try {
      const targetId = mentor ? mentor.id : mentee?.mentor_id;
      
      if (!targetId) {
        setLoading(false);
        return;
      }

      const data = await fetchDataFromApi("get-team-mentor", targetId);
      
      if (data.status_code == 200) {
        setTeamData(data.team_data);
        
        if (data.team_data && data.team_data.length > 0) {
          setNewTeamName(data.team_data[0].team_name);
        }

        const fetchedTeamData = data.team_data;
        const fetchedTeam = fetchedTeamData && fetchedTeamData.length > 0 ? fetchedTeamData[0] : null;

        // Fix Buffering: Only update if data has actually changed
        if (mentee && fetchedTeam) {
          const currentTeamCount = Array.isArray(mentee.Menteeteam) ? mentee.Menteeteam.length : (mentee.Menteeteam ? 1 : 0);
          
          // Only update if there's no team data or it has changed
          if (currentTeamCount === 0 || JSON.stringify(mentee.Menteeteam) !== JSON.stringify(fetchedTeamData)) {
            const updatedMentee = {
              ...mentee,
              Menteeteam: fetchedTeamData 
            }
            if(onMenteeUpdate) onMenteeUpdate(updatedMentee);
          }
        }

        if (mentor && fetchedTeam) {
          // Only update if there's no team data or it has changed
          if (!mentor.Mentorteam || JSON.stringify(mentor.Mentorteam) !== JSON.stringify(fetchedTeam)) {
            const updatedMentor = {
              ...mentor,
              Mentorteam: fetchedTeam
            }
            if(onMentorUpdate) onMentorUpdate(updatedMentor);
          }
        }
      } else {
        setTeamData(null);
      }

    } catch (error) {
      console.error("Error fetching team data:", error.message);
      setTeamData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Only run once on mount

  const handleClick = (member) => {
    setMenteeData(member);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleUpdateTeamName = async () => {
    if (!newTeamName.trim()) {
      toast.warning("Team name cannot be empty");
      return;
    }

    setIsUpdatingName(true);
    try {
      const body = {
        mentorid: mentor.id,
        teamname: newTeamName
      };

      const data = await fetchDataFromApiWithResponse(body, 'updateteam');

      if (data.status_code === 200) {
        toast.success("Team Name Updated!");
        setIsEditing(false);
        fetchData(); 
      } else {
        toast.error(data.status_message || "Failed to update team name");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleTeamCreation = async () => {
    if (!inputRef.current.value.trim()) {
      toast.warning("Team name cannot be empty!");
      return;
    }
    const body = {
      teamname: inputRef.current.value,
      mentorid: mentor?.id
    }
    const data = await fetchDataFromApiWithResponse(body, 'createteam');
    if (data.status_code == 200) {
      toast.success("Team Created Successfully", {
        theme: "dark",
      });
      fetchData();
    }
    else {
      toast.error(data.status_message || "Some Error Occurred!", {
        theme: "dark",
      });
    }
  };

  return (
    <div>
      <h1 className="text-2xl pt-4 pb-4 text-center md:text-left text-black dark:text-white font-bold ">
        {mentor ? "Mentee Profiles" : "Team Members"}
      </h1>
      
      {loading ? 
        <div className="flex items-center justify-center text-black dark:text-gray-400 h-[35vh]">
          <FaSpinner className="animate-spin text-4xl mr-2" />
          <span className="text-lg">Loading team data...</span>
        </div>
      :
      teamData && teamData?.length > 0 ? (
        <>
          <div className="bg-gray-50 dark:bg-gray-900 overflow-y-auto h-[34.5vh] rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-inner">
              
            {/* Header with Edit Functionality */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 py-4 flex justify-center items-center gap-2 sticky top-0 z-10 shadow-lg">
              {isEditing && mentor ? (
                <div className="flex items-center gap-2 w-full justify-center">
                  <input 
                    type="text" 
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    className="text-black px-3 py-2 rounded-lg text-sm w-1/2 border-2 border-white focus:outline-none focus:border-yellow-300"
                    placeholder="Enter team name"
                  />
                  {isUpdatingName ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <>
                      <button 
                        className="p-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
                        onClick={handleUpdateTeamName}
                        title="Save"
                      >
                        <FaCheck />
                      </button>
                      <button 
                        className="p-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                        onClick={() => {
                          setIsEditing(false);
                          if(teamData && teamData.length > 0) {
                            setNewTeamName(teamData[0].team_name);
                          }
                        }} 
                        title="Cancel"
                      >
                        <FaTimes />
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <FaUsers className="text-2xl" />
                  <h2 className="md:text-2xl text-xl font-bold text-center">
                    {teamData[0]?.team_name}
                  </h2>
                  {mentor && (
                    <button
                      className="p-2 hover:bg-white/20 rounded-lg transition-colors" 
                      onClick={() => setIsEditing(true)}
                      title="Edit Team Name"
                    >
                      <FaEdit className="text-sm" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {teamData?.map((team) => (
              <div key={team.id}>
                {team.team_members.map((member, index) => (
                  <div
                    key={member.id}
                    className={`flex items-center justify-between py-4 px-4 ${
                      index !== team.team_members.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''
                    } cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-800 transition-all duration-200 group`}
                    onClick={() => handleClick(member)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="rounded-full overflow-hidden ring-2 ring-blue-500/50 w-12 h-12">
                            <img
                              className="h-12 w-12 object-cover"
                              src={member.image}
                              alt={`${member.name}-dp`}
                            />
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                        </div>
                        <div>
                          <h1 className="text-sm md:text-base font-bold text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {member.name}
                          </h1>
                          <p className="text-xs text-gray-500 dark:text-gray-400">@{member.username || 'student'}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1">
                          <FaStar className="text-yellow-500 text-xs" />
                          <h2 className="text-sm md:text-base font-bold text-gray-700 dark:text-gray-300">
                            {member.score}
                          </h2>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">points</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <Modal
            isOpen={showModal}
            onRequestClose={closeModal}
            className="dark:bg-gray-800 mx-auto mt-8 sm:mt-2 bg-gray-100 p-6 rounded-2xl shadow-2xl"
            style={{
              overlay: {
                zIndex: 10000,
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                backdropFilter: 'blur(4px)'
              },
              content: {
                width: '90%',
                maxWidth: '700px',
                height: '80%',
              },
            }}
          >
            <button 
              onClick={closeModal} 
              className="dark:bg-gray-800 bg-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-full transition-colors float-right"
            >
              <img
                alt="close"
                src={close}
                className="w-5 h-5 hidden dark:block"
              />
              <img alt="close" src={closelight} className="w-4 h-4 dark:hidden" />
            </button>
            <div className="flex flex-col items-center justify-center">
              <h1 className="font-bold text-center text-black md:text-2xl text-xl dark:text-white mb-4">
                {menteeData ? menteeData?.name : 'Mentee'}'s Profile
              </h1>
              <div className="team-profile-members overflow-y-scroll w-full h-[80vh] mt-8">
                {menteeData && (
                  <MenteesUrlsCard
                    image={menteeData.image}
                    name={menteeData.name}
                    codechefID={menteeData.codechefID}
                    codeforcesID={menteeData.codeforcesID}
                    leetcodeID={menteeData.leetcodeID}
                    gfgID={menteeData.gfgID}
                    hackerrankID={menteeData.hackerrankID}
                    points={menteeData.score}
                    solvedQ={menteeData.solvedQ}
                  />
                )}
              </div>
            </div>
          </Modal>
        </>
      ) : mentor ? (
        <div className="flex flex-col items-center justify-center px-4 py-8 h-[35vh] border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900">
          <FaUsers className="text-6xl text-gray-300 dark:text-gray-600 mb-4" />
          <h1 className="dark:text-white text-black mb-4 text-lg font-semibold">
            No teams created yet
          </h1>
          <input
            type="text"
            ref={inputRef}
            placeholder="Enter the team name"
            className="border-2 border-gray-300 dark:border-gray-600 w-full max-w-md p-3 rounded-lg mb-3 bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleTeamCreation}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 font-semibold shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            Create Team
          </button>
        </div>
      ) : (
        <div className="flex justify-center items-center text-center border-2 border-dashed border-gray-300 dark:border-gray-700 h-[35vh] px-8 rounded-xl bg-gray-50 dark:bg-gray-900">
          <div>
            <FaUsers className="text-6xl text-gray-300 dark:text-gray-600 mb-4 mx-auto" />
            <h1 className="text-sm md:text-base dark:text-white text-black">
              Your mentor hasn't created a team yet. Please wait for them to create one.
            </h1>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenteeCodingProfiles;
