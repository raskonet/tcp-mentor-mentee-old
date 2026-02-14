import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaUser, FaEnvelope, FaPhone, FaLink, FaLock, FaSave, FaPencilAlt, FaSpinner } from "react-icons/fa";
import { fetchDataFromApiWithResponse } from "../../utils/api";

const Profile = ({ mentor, onMentorUpdate }) => {
  const [form, setForm] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [disabledForm, setDisabledForm] = useState(true);
  const [loading, setLoading] = useState(false);

  // Initialize form when mentor prop changes
  useEffect(() => {
    if (mentor) {
      setForm({
        name: mentor.name || "",
        image: mentor.image || "",
        email: mentor.email || "",
        phone: mentor.phone_number || "",
        codechefID: mentor.codechefID || "",
        codeforcesID: mentor.codeforcesID || "",
        gfgID: mentor.gfgID || "",
        linkedinID: mentor.linkedinID || "",
        leetcodeID: mentor.leetcodeID || "",
        hackerrankID: mentor.hackerrankID || "",
        password: "", // Don't pre-fill password for security
      });
    }
  }, [mentor]);

  const handle = (e) => {
    const n = { ...form };
    n[e.target.name] = e.target.value;
    setForm(n);
  };

  const handleDisabledForm = (e) => {
    e.preventDefault();
    setDisabledForm((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const body = {
      name: form.name,
      image: form.image,
      email: form.email,
      phone_number: form.phone,
      codechefID: form.codechefID,
      codeforcesID: form.codeforcesID,
      gfgID: form.gfgID,
      linkedinID: form.linkedinID,
      leetcodeID: form.leetcodeID,
      hackerrankID: form.hackerrankID,
    };

    // Only send password if it was changed
    if(form.password) {
        body.password = form.password;
    }

    const data = await fetchDataFromApiWithResponse(body, "update_mentor");
    
    if (data.status_code === 200) {
      toast.success("Profile Updated Successfully!", { theme: "dark" });
      
      // Update parent state immediately with the form data to reflect changes UI side
      // Use the response data if available, otherwise fallback to form data
      const updatedData = data.user_data || body;
      
      const newMentorState = {
        ...mentor,
        ...updatedData
      };
      
      onMentorUpdate(newMentorState);
      setDisabledForm(true);
      setForm(prev => ({...prev, password: ""})); // Clear password field
    } else {
      toast.error(data.status_message || "Update failed", { theme: "dark" });
    }
    setLoading(false);
  };

  const InputField = ({ label, name, type = "text", icon: Icon, placeholder }) => (
    <div className="flex flex-col">
      <label className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
        {Icon && <Icon className="text-[var(--primary-c)]" />} {label}
      </label>
      <input
        className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-[var(--primary-c)] focus:border-transparent transition-all outline-none disabled:opacity-60 disabled:cursor-not-allowed"
        type={type}
        name={name}
        value={form[name] || ""}
        onChange={handle}
        disabled={disabledForm}
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <div className="w-full max-w-5xl mx-auto pb-10">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Header / Banner */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600 relative"></div>
        
        <div className="px-8 pb-8">
          {/* Profile Image */}
          <div className="relative -mt-16 mb-6 flex justify-between items-end">
            <div className="relative">
              <img
                className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 object-cover shadow-lg bg-gray-200"
                src={form.image || "https://via.placeholder.com/150"}
                alt="Profile"
              />
              {!disabledForm && (
                <div className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full text-white cursor-pointer hover:bg-blue-600 shadow-sm" title="Paste URL in 'Profile Picture URL' field">
                   <FaPencilAlt size={12} />
                </div>
              )}
            </div>
            
            <button
              onClick={handleDisabledForm}
              className={`px-6 py-2 rounded-full font-semibold transition-colors shadow-md flex items-center gap-2 ${
                disabledForm 
                  ? "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600" 
                  : "bg-red-100 text-red-600 hover:bg-red-200"
              }`}
            >
               {disabledForm ? <><FaPencilAlt /> Edit Profile</> : "Cancel Editing"}
            </button>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{form.name}</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">{form.email}</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Full Name" name="name" icon={FaUser} placeholder="John Doe" />
              <InputField label="Phone Number" name="phone" icon={FaPhone} placeholder="+91 9999999999" />
              <InputField label="Profile Picture URL" name="image" icon={FaLink} placeholder="https://..." />
              <div className="flex flex-col relative">
                <label className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <FaLock className="text-[var(--primary-c)]" /> New Password
                </label>
                <input
                    className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-[var(--primary-c)] outline-none disabled:opacity-60"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handle}
                    disabled={disabledForm}
                    placeholder="Leave empty to keep current"
                />
                 <button
                  type="button"
                  className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700 dark:hover:text-gray-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <hr className="border-gray-200 dark:border-gray-700 my-6" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Social & Coding Handles</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <InputField label="LinkedIn URL" name="linkedinID" icon={FaLink} />
               <InputField label="CodeChef Handle" name="codechefID" icon={FaLink} />
               <InputField label="CodeForces Handle" name="codeforcesID" icon={FaLink} />
               <InputField label="LeetCode Handle" name="leetcodeID" icon={FaLink} />
               <InputField label="GeeksForGeeks Handle" name="gfgID" icon={FaLink} />
               <InputField label="HackerRank Handle" name="hackerrankID" icon={FaLink} />
            </div>

            {!disabledForm && (
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[var(--primary-c)] hover:bg-[var(--tertiary-c)] text-white px-8 py-3 rounded-lg font-bold shadow-lg transform hover:-translate-y-1 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <FaSpinner className="animate-spin" /> : <><FaSave /> Save Changes</>}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
