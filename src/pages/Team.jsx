import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import tcp from "../assets/images/tcp.png";
import tcplight from "../assets/images/tcpLogo.png";
import { base_url } from "../utils/urls";
import TeamCard from "../components/TeamCard";
import TeamNav from "../components/TeamNav";
import { FaSpinner } from "react-icons/fa";

const Team = () => {
  // Updated year to 2026
  const url = base_url + "team/2026/";
  const [state, setState] = useState({
    data: [],
    loading: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        setState({
          data: data.data || [],
          loading: false,
        });
      } catch (e) {
        console.error(e);
        setState({ data: [], loading: false });
      }
    };
    fetchData();
  }, []);

  const MembersByDesignation = (designation) => {
    const filteredMembers = state?.data
      .filter((member) => member.member_type === designation)
      .sort((a, b) => {
        const domainOrder = [
          "Technical",
          "Design",
          "Video Editing",
          "Documentation",
          "sponsorship",
          "PR & Marketing",
        ];
        return domainOrder.indexOf(a.domain) - domainOrder.indexOf(b.domain);
      });

    return filteredMembers;
  };

  const overAllCoordinaters = MembersByDesignation("OCO");
  const headCoordinators = MembersByDesignation("HCO");
  // Assuming specific logic for Head, modify name if needed for 2026
  const mentorshipHead = state?.data.find(
    (member) => member.member_type === "HCO" && member.domain === "Technical" // Generic fallback
  );
  const managers = MembersByDesignation("MNG");
  const executives = MembersByDesignation("EXC");

  return (
    <>
      <nav className="w-screen fixed z-50 border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
        <TeamNav />
      </nav>
      <div className="text-black relative w-screen min-h-screen flex flex-col items-center text-center dark:bg-gray-900 pt-24 pb-20">
        <div className="flex flex-col md:flex-row justify-center items-center py-8 gap-4 animate-fade-in-down">
          <img
            src={tcp}
            className="w-24 h-24 dark:block hidden"
            alt="tcp-logo"
          />
          <img
            src={tcplight}
            className="w-24 h-24 dark:hidden block"
            alt="tcp-logo"
          />
          <h1 className="font-extrabold md:text-6xl text-4xl ml-0 md:ml-4 dark:text-white tracking-tighter">
            {"<"} Team TCP 2026 {">"}
          </h1>
        </div>
        
        <Link to="/">
          <div className="bg-[var(--primary-c)] flex items-center gap-2 text-lg px-8 py-3 text-white hover:bg-[var(--tertiary-c)] transition-all duration-300 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            <FaArrowLeft />
            <span>Back to Main Page</span>
          </div>
        </Link>

        {state.loading ? (
           <div className="flex h-[50vh] items-center justify-center">
             <FaSpinner className="animate-spin text-4xl text-[var(--primary-c)]" />
           </div>
        ) : (
          <div className="md:p-10 p-4 w-full flex flex-col justify-center items-center space-y-16">
            
            {/* Sections */}
            {[
              { title: "Mentorship Head", data: [mentorshipHead].filter(Boolean) },
              { title: "Overall Coordinators", data: overAllCoordinaters },
              { title: "Head Coordinators", data: headCoordinators },
              { title: "Managers", data: managers },
              { title: "Executives", data: executives },
            ].map((section, idx) => (
               section.data.length > 0 && (
                <div key={idx} className="w-full">
                  <h2 className="md:text-4xl text-2xl font-bold dark:text-white mb-10 relative inline-block">
                    {section.title}
                    <span className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-[var(--primary-c)] rounded-full"></span>
                  </h2>
                  <div className="flex flex-wrap justify-center gap-8">
                    {section.data.map((member, index) => (
                      <TeamCard
                        key={index}
                        email={member.email}
                        img={member.image}
                        name={member.name}
                        position={member.member_type}
                        linkedin={member.linkedin}
                        insta={member.instagram}
                        domain={member.domain}
                      />
                    ))}
                  </div>
                </div>
               )
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Team;
