import { useState } from "react";
import { motion } from "framer-motion";
import { body } from "framer-motion/client";

const teams = ["India", "Australia", "England", "Pakistan", "New Zealand"];
const venues = {
  Countries: ["India", "Australia", "England", "Pakistan", "New Zealand"],
  Cities: ["Mumbai", "Sydney", "London", "Lahore", "Auckland"],
};

export default function App() {
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [tossWinner, setTossWinner] = useState("");
  const [venueType, setVenueType] = useState("Countries");
  const [venue, setVenue] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const fetchPrediction = async () => {
    if (!team1 || !team2 || !tossWinner || !venue) return alert("Please select all fields!");

    setLoading(true);
    setResult(null);

    try {
      // Replace with actual API endpoint
      const body = { team1, team2, toss_winner : tossWinner, venue }
      console.log(body)
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      console.log(data)
      setResult(data);
    } catch (error) {
      console.error("Error fetching prediction:", error);
      setResult({ error: "Failed to fetch prediction. Try again later." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-950 to-black text-white p-6">
      {/* Title */}
      <motion.h1
        className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        🏏 Match Predictor
      </motion.h1>

      <div className="w-[80vw] max-w-3xl lg:max-w-4xl bg-gray-900/80 p-8 rounded-xl shadow-lg shadow-cyan-500/30 backdrop-blur-md">
        {/* Team Selection */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <select
            className="w-full sm:w-1/2 p-3 bg-cyan-700 text-white rounded-md outline-none cursor-pointer hover:bg-cyan-600 transition-all"
            value={team1}
            onChange={(e) => setTeam1(e.target.value)}
          >
            <option value="">Select Team 1</option>
            {teams.map((team, index) => (
              <option key={index} value={team}>
                {team}
              </option>
            ))}
          </select>

          <select
            className="w-full sm:w-1/2 p-3 bg-blue-600 text-white rounded-md outline-none cursor-pointer hover:bg-blue-500 transition-all"
            value={team2}
            onChange={(e) => setTeam2(e.target.value)}
          >
            <option value="">Select Team 2</option>
            {teams
              .filter((t) => t !== team1)
              .map((team, index) => (
                <option key={index} value={team}>
                  {team}
                </option>
              ))}
          </select>
        </motion.div>

        {/* Toss Winner (Appears only when both teams are selected) */}
        {team1 && team2 && (
          <motion.div className="flex flex-col items-center gap-4 mb-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="text-lg font-medium">🏆 Toss Winner:</span>
            <div className="flex space-x-4">
              {[team1, team2].map((team) => (
                <button
                  key={team}
                  className={`p-2 px-6 rounded-md text-white transition-all ${
                    tossWinner === team ? "bg-cyan-500 shadow-lg shadow-cyan-500/30" : "bg-gray-700 hover:bg-gray-600"
                  }`}
                  onClick={() => setTossWinner(team)}
                >
                  {team}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Venue Type Selection */}
        <motion.div className="flex flex-col items-center mb-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="text-lg font-medium">📍 Venue Type:</span>
          <div className="flex space-x-4 mt-3">
            {["Countries", "Cities"].map((type) => (
              <label
                key={type}
                className={`p-2 px-6 rounded-md cursor-pointer transition-all ${
                  venueType === type ? "bg-blue-500 shadow-lg shadow-blue-500/30" : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                <input type="radio" className="hidden" value={type} checked={venueType === type} onChange={(e) => setVenueType(e.target.value)} />
                {type}
              </label>
            ))}
          </div>
        </motion.div>

        {/* Venue Selection */}
        <motion.div className="mb-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <select
            className="w-full p-3 bg-cyan-700 text-white rounded-md outline-none cursor-pointer hover:bg-cyan-600 transition-all"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
          >
            <option value="">Select Venue</option>
            {venues[venueType].map((venue, index) => (
              <option key={index} value={venue}>
                {venue}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Predict Button */}
        <motion.button
          className="w-full p-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold rounded-md shadow-md shadow-blue-500/30 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchPrediction}
        >
          {loading ? "Predicting... 🔄" : "🔮 Predict Match Outcome"}
        </motion.button>

        {/* Result Section */}
        {result && (
          <motion.div className="mt-6 px-4 pb-4 pt-2 bg-gray-800 rounded-lg text-center shadow-md shadow-cyan-500/20" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {result && (
          <motion.div className="mt-6 px-4 pb-4 pt-2 bg-gray-800 rounded-lg text-center shadow-md shadow-cyan-500/20" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {result.error ? (
              <p className="text-red-500">{result.error}</p>
            ) : (
              <>
                <h2 className="text-xl font-bold text-cyan-400">🏆 Predicted Winner: {result.win_probability > 50 ? result.team1 : result.team2}</h2>
                {/* <p className="text-gray-300">Probability: {result.win_probability.toFixed(2)}%</p> */}
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-700 rounded-full h-6 mt-4 overflow-hidden">
                  <motion.div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white text-center text-sm font-bold flex items-center justify-center" initial={{ width: 0 }} animate={{ width: `${result.win_probability}%` }} transition={{ duration: 1 }}>
                    {result.win_probability.toFixed(2)}%
                  </motion.div>
                </div>
              </>
            )}
          </motion.div>
        )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
