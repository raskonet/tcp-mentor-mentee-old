import React, { useEffect, useRef, useState } from 'react';
import Modal from 'react-modal';
import MenteesUrlsCard from '../MenteesUrlsCard';
import close from '../../assets/images/cross.svg';
import closelight from '../../assets/images/cross.png';
import { toast } from 'react-toastify';
import { fetchDataFromApi, fetchDataFromApiWithResponse } from '../../utils/api';
import { FaSpinner, FaEdit, FaCheck, FaTimes } from 'react-icons/fa'; // Added Icons

const MenteeCodingProfiles = ({ mentor, mentee, onMenteeUpdate, onMentorUpdate }) => {
  const [menteeData, setMenteeData] = useState();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [teamData, setTeamData] = useState(null);
  
  // States for editing team name
  const [isEditing, setIsEditing] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [isUpdatingName, setIsUpdatingName] = useState(false);

  const inputRef = useRef();

  const fetchData = async () => {
    try {
      const data = await fetchDataFromApi("get-team-mentor", mentor ? mentor?.id : mentee?.mentor_id);
      if (data.status_code == 200) {
        setTeamData(data.team_data);
        
        // Initialize newTeamName with current name
        if (data.team_data && data.team_data.length > 0) {
          setNewTeamName(data.team_data[0].team_name);
        }

        const fetchedTeamData = data.team_data;

        if (mentee && (!mentee.Menteeteam || mentee.Menteeteam.length == 0) && fetchedTeamData) {
          const updatedMentee = {
            ...mentee,
            Menteeteam: fetchedTeamData
          }
          onMenteeUpdate(updatedMentee);
        }

        if (mentor && fetchedTeamData) {
          const updatedMentor = {
            ...mentor,
            Mentorteam: fetchedTeamData[0]
          }
          onMentorUpdate(updatedMentor);
        }
      } else {
        setTeamData(null);
      }

    } catch (error) {
      console.error("Error fetching team data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [mentee]);

  const handleClick = (member) => {
    setMenteeData(member);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  // Logic to update team name
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
        fetchData(); // Refresh data to show new name
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
      toast("Team name cannot be empty!");
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
      if (mentor && !mentor.Mentorteam) {
        const updatedMentor = {
          ...mentor,
          Mentorteam: body
        }
        onMentorUpdate(updatedMentor);
      }

      fetchData();
    }
    else {
      toast.error("Some Error Occured ! Please try again.", {
        theme: "dark",
      });
    }
  };

  return (
    <div>
      <h1 className="text-3xl pt-7 md:pb-4 pb-8 md:text-left text-center text-black dark:text-white font-semibold ">
        {mentor ? "Mentee Profiles" : "Team Members"}
      </h1>

      {loading ?
        <div className="flex items-center justify-center text-black  dark:text-gray-400">
          <FaSpinner className="animate-spin text-4xl mr-2" />
          Loading...
        </div>
        :
        teamData && teamData?.length > 0 ? (
          <>
            <div className="dark:bg-gray-800  overflow-y-auto h-[34.5vh] rounded-lg dark:border-none border">
              
              {/* Header with Edit Functionality */}
              <div className="bg-primary text-white p-2 py-3 flex justify-center items-center gap-2 sticky top-0 z-10">
                {isEditing && mentor ? (
                  <div className="flex items-center gap-2 w-full justify-center">
                    <input 
                      type="text" 
                      value={newTeamName}
                      onChange={(e) => setNewTeamName(e.target.value)}
                      className="text-black px-2 py-1 rounded text-sm w-1/2"
                    />
                    {isUpdatingName ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <>
                        <FaCheck 
                          className="cursor-pointer hover:text-green-300" 
                          onClick={handleUpdateTeamName}
                          title="Save"
                        />
                        <FaTimes 
                          className="cursor-pointer hover:text-red-300" 
                          onClick={() => {
                            setIsEditing(false);
                            setNewTeamName(teamData[0].team_name); // Reset
                          }} 
                          title="Cancel"
                        />
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <h2 className="md:text-2xl text-lg font-semibold text-center">
                      {teamData[0].team_name}
                    </h2>
                    {/* Only show edit icon if user is a Mentor */}
                    {mentor && (
                      <FaEdit 
                        className="cursor-pointer text-sm opacity-80 hover:opacity-100" 
                        onClick={() => setIsEditing(true)}
                        title="Edit Team Name"
                      />
                    )}
                  </div>
                )}
              </div>

              {teamData?.map((team) => (
                <div key={team.id}>
                  {team.team_members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between py-3 px-3 border-b cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => handleClick(member)}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center">
                          <div className="rounded-full overflow-hidden dark:bg-gray-800 w-10 h-10 mr-2">
                            <img
                              className="h-10 w-10 object-cover rounded-full"
                              src={member.image}
                              alt={`${member.name}-dp`}
                            />
                          </div>
                          <h1 className="text-sm md:font-semibold text-black dark:text-white">
                            {member.name}
                          </h1>
                        </div>
                        <div>
                          <h2 className="text-xs dark:text-gray-400 text-gray-600">
                            Score: {member.score}
                          </h2>
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
              className="dark:bg-gray-800 mx-auto mt-8 sm:mt-2 bg-gray-100 p-4"
              style={{
                overlay: {
                  zIndex: 10000,
                },
                content: {
                  width: '90%',
                  maxWidth: '700px',
                  height: '80%',
                },
              }}
            >
              <button onClick={closeModal} className="dark:bg-gray-800 bg-gray-100">
                <img
                  alt="close"
                  src={close}
                  className="w-5 h-5 hidden dark:block"
                />
                <img alt="close" src={closelight} className="w-4 h-4 dark:hidden" />
              </button>
              <div className="flex flex-col items-center justify-center">
                <h1 className="font-bold text-center text-black md:text-2xl text-xl dark:text-white">
                  {menteeData ? menteeData?.name : 'Mentee'}'s Profile
                </h1>
                <div className="team-profile-members overflow-y-scroll w-full h-[80vh] mt-12">
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
          <div className="flex flex-col items-center justify-center px-2 h-[35vh] border dark:border:none">
            <h1 className="dark:text-white text-black mb-4">
              No teams have been created yet
            </h1>
            <input
              type="text"
              ref={inputRef}
              placeholder="Enter the team name to be created"
              className="border w-full  border-gray-300 p-2 rounded-md mb-2 bg-white text-black"
            />
            <button
              onClick={handleTeamCreation}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Create
            </button>
          </div>
        ) : (
          <div className="flex justify-center items-center text-center border h-[35vh] px-8">
            <h1 className="text-sm dark:text-white text-black">
              Looks like your mentor hasn't created a team yet! Please wait for them to create one.
            </h1>
          </div>
        )}
    </div>
  );
};

export default MenteeCodingProfiles;
