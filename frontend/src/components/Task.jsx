import React, { useState, useEffect } from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

const Task = () => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [students, setStudents] = useState([]); 

  
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/user/"); // API as Records
        const data = await response.json();
        console.log("Fetched students:", data);

        
        const sortedData = data.sort((a, b) => a.name.localeCompare(b.name));
        setStudents(sortedData);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedOptions(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <div className="mt-[180px]">
      <form className="w-auto max-w-[600px] p-6 bg-gray-50 shadow-xl mx-auto">
        <div>
          <h2 className="text-2xl font-semibold text-center">Assign Tasks</h2>
        </div>

        
        <div className="relative z-0 w-full mb-5 group">
          <FormControl fullWidth className="relative">
            <InputLabel id="multi-select-label">Select Student</InputLabel>
            <Select
              labelId="multi-select-label"
              multiple
              value={selectedOptions}
              onChange={handleChange}
              renderValue={(selected) => selected.join(", ")}
              sx={{
                border: "none",
                borderBottom: "2px solid #ccc",
                borderRadius: 0,
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                backgroundColor: "transparent",
              }}
            >
              {students.map((student) => (
                <MenuItem
                  key={student._id}
                  value={`${student.name} ${student.lastName}`}
                >
                  {student.name} {student.lastName} ({student.email})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

       
        <div className="relative z-0 w-full mb-5 group">
          <textarea
            rows="4"
            type="text"
            name="task"
            id="task"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 
            border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 
            focus:border-blue-600 peer"
            placeholder=" "
            required
          ></textarea>
          <label
            htmlFor="task"
            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 
            transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 
            peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Assign a Task
          </label>
        </div>

       
        <div className="relative z-0 w-full mb-5 group">    
          <input
            type="file"
            name="attachments"
            id="attachments"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 
            border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 
            focus:border-blue-600 peer"
            placeholder=" "
            required
            multiple
          />
          <label
            htmlFor="attachments"
            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 
            transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 
            peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Select Attachments
          </label>
        </div>

        
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            name="remark"
            id="remark"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 
            border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 
            focus:border-blue-600 peer"
            placeholder=" "
            required
          />
          <label
            htmlFor="remark"
            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 
            transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 
            peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Remark
          </label>
        </div>

        
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="date"
            name="deadline"
            id="deadline"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 
            border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 
            focus:border-blue-600 peer"
            placeholder=" "
            required
          />
          <label
            htmlFor="deadline"
            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 
            transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 
            peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Deadline
          </label>
        </div>

       
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none 
          focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 
          text-center"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Task;
