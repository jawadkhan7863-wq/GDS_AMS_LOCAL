import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const Break = ({ attendanceId: initialAttendanceId }) => {
  const [formData, setFormData] = useState({
    break_type: "Lunch",
    notes: "",
  });
  const [attendanceId, setAttendanceId] = useState(initialAttendanceId || null);
  const [currentBreakId, setCurrentBreakId] = useState(null);
  const [isBreakActive, setIsBreakActive] = useState(false);

  // Check and set the break state from localStorage
  useEffect(() => {
    const storedAttendanceId = localStorage.getItem("attendanceId");
    // const StoredBreakId = localStorage.getItem("breakId");
    const breakActive = localStorage.getItem("is_break_in") === "true";
    const storedBreakId = localStorage.getItem("currentBreakId");

    if (!initialAttendanceId && storedAttendanceId) {
      setAttendanceId(storedAttendanceId);
    }

    if (breakActive) {
      setIsBreakActive(true);
      setCurrentBreakId(storedBreakId);
    }
  }, [initialAttendanceId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!attendanceId) {
      toast.error("Attendance ID is missing. Please log in again.");
      return;
    }

    try {
      const url = isBreakActive
        ? "http://147.93.119.175:5000/end-break"
        : "http://147.93.119.175:5000/start-break";

      const body = isBreakActive
        ? { breakId: currentBreakId }
        : {
          attendanceId,
          break_type: formData.break_type,
          notes: formData.notes,
        };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      if (response.ok) {
        if (isBreakActive) {
          toast.success("Break ended successfully!");
          setIsBreakActive(false);
          setCurrentBreakId(null);
          localStorage.removeItem("is_break_in");
          localStorage.removeItem("currentBreakId");
        } else {
          toast.success("Break started successfully!");
          setIsBreakActive(true);
          setCurrentBreakId(result.breakId);
          localStorage.setItem("is_break_in", "true");
          localStorage.setItem("currentBreakId", result.breakId);
        }
      } else {
        toast.error(`Failed to ${isBreakActive ? "end" : "start"} break: ${result.error}`);
      }
    } catch (error) {
      toast.error(`An error occurred while ${isBreakActive ? "ending" : "starting"} the break.`);
    }
  };

  return (
    <div className="min-h-full bg-gray-800 rounded-lg flex items-center justify-center">
      <div className="max-w-2xl w-full bg-gray-900 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-teal-400 text-center mb-6">
          {isBreakActive ? "End Your Break" : "Take a Break - Provide Details"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Show inputs only for starting a break */}
          {!isBreakActive && (
            <>
              <div>
                <label className="block text-teal-300 font-medium mb-2">
                  Break Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="break_type"
                  value={formData.break_type}
                  onChange={handleChange}
                  className="w-full bg-gray-700 text-teal-200 border border-teal-400 rounded-lg px-4 py-2 outline-none"
                  required
                >
                  <option value="Lunch">Lunch</option>
                  <option value="Rest">Rest</option>
                  <option value="Personal">Personal</option>
                  <option value="Medical">Medical</option>
                </select>
              </div>
              <div>
                <label className="block text-teal-300 font-medium mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full bg-gray-700 text-teal-200 border border-teal-400 rounded-lg px-4 py-2 outline-none resize-none"
                  rows="4"
                />
              </div>
            </>
          )}

          <div className="text-center">
            <button
              type="submit"
              className="bg-teal-500 text-gray-900 font-medium px-6 py-2 rounded-lg hover:bg-teal-400 transition duration-300"
            >
              {isBreakActive ? "End Break" : "Start Break"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Break;