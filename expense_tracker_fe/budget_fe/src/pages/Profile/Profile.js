import { useState, useEffect } from "react";
import { fetchUserProfile, updateProfile } from "../../api";
import "./Profile.css";

const Profile = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [formData, setFormData] = useState({
      profession: "",
      savings: "",
      income: "",
      image: null,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
  
    // Fetch user profile on page load
    useEffect(() => {
      const getUserProfile = async () => {
        try {
          const data = await fetchUserProfile();
          console.log("Fetched user profile:", data); // Log the fetched data
          setUserProfile(data);
          setFormData({
            profession: data.profession || "",
            savings: data.savings || "",
            income: data.income || "",
            image: null,
          });
        } catch (err) {
          setError("Failed to load user profile.");
        } finally {
          setLoading(false);
        }
      };
  
      getUserProfile();
    }, []);
  
    // Handle form input changes
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    };
  
    // Handle profile image change
    const handleImageChange = (e) => {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        image: file,
      });
    };
  
    // Handle form submission
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await updateProfile(formData); // Call API to update profile
        alert("Profile updated successfully!");
      } catch (err) {
        setError("Failed to update profile.");
      }
    };
  
    // If loading, show a loading message
    if (loading) return <div>Loading...</div>;
  
    // If there's an error, show the error message
    if (error) return <div>{error}</div>;
  
    return (
      <div className="profile-container">
        <h2>My Profile</h2>
        {userProfile && (
          <form onSubmit={handleSubmit}>
            <div className="profile-item">
              <strong>Username:</strong> {userProfile.user?.username || "No Username"}
            </div>
            <div className="profile-item">
              <label htmlFor="profession">Profession:</label>
              <input
                type="text"
                id="profession"
                name="profession"
                value={formData.profession}
                onChange={handleInputChange}
              />
            </div>
            <div className="profile-item">
              <label htmlFor="savings">Savings:</label>
              <input
                type="number"
                id="savings"
                name="savings"
                value={formData.savings}
                onChange={handleInputChange}
              />
            </div>
            <div className="profile-item">
              <label htmlFor="income">Income:</label>
              <input
                type="number"
                id="income"
                name="income"
                value={formData.income}
                onChange={handleInputChange}
              />
            </div>
            <div className="profile-item">
              <label htmlFor="image">Profile Image:</label>
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleImageChange}
              />
            </div>
            <button type="submit">Update Profile</button>
          </form>
        )}
      </div>
    );
  };
  
  export default Profile;