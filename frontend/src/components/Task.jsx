import { useState, useEffect } from "react";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import AttachmentIcon from "@mui/icons-material/Attachment";
import PersonIcon from "@mui/icons-material/Person";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CommentIcon from "@mui/icons-material/Comment";
import EventIcon from "@mui/icons-material/Event";
import { styled } from "@mui/material/styles";
import { autocompleteClasses } from "@mui/material/Autocomplete";
import useAutocomplete from "@mui/material/useAutocomplete";

// ---------- Styled Components ----------
const Root = styled("div")(() => ({
  color: "rgba(0,0,0,0.85)",
  fontSize: "14px",
  position: "relative",
}));

const Label = styled("label")`
  padding: 0 0 6px;
  line-height: 1.5;
  display: block;
  font-weight: 600;
  color: #374151;
  font-size: 0.8rem;
`;

const InputWrapper = styled("div")(() => ({
  width: "100%",
  border: "1.5px solid #e5e7eb",
  backgroundColor: "#f9fafb",
  borderRadius: "8px",
  padding: "6px 10px",
  display: "flex",
  flexWrap: "wrap",
  gap: "3px",
  transition: "all 0.2s ease-in-out",
  minHeight: "42px",
  "&:hover": {
    borderColor: "#9ca3af",
    backgroundColor: "#fff",
  },
  "&.focused": {
    borderColor: "#3b82f6",
    backgroundColor: "#fff",
    boxShadow: "0 0 0 2px rgb(59 130 246 / 0.1)",
  },
  "& input": {
    backgroundColor: "transparent",
    height: "28px",
    padding: "2px 6px",
    flexGrow: 1,
    border: 0,
    outline: 0,
    fontSize: "0.8rem",
    minWidth: "120px",
  },
}));

const Tag = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  height: 24,
  margin: 1,
  backgroundColor: "#3b82f6",
  color: "white",
  border: "1px solid #2563eb",
  borderRadius: "16px",
  padding: "0 6px 0 10px",
  fontSize: "0.7rem",
  fontWeight: 500,
  "& span": {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: "80px",
  },
  "& svg": {
    fontSize: 14,
    cursor: "pointer",
    padding: 1,
    marginLeft: 3,
    borderRadius: "50%",
    backgroundColor: "rgba(255,255,255,0.2)",
  },
}));

const Listbox = styled("ul")(() => ({
  width: "100%",
  margin: "4px 0 0 0",
  padding: 0,
  position: "absolute",
  listStyle: "none",
  backgroundColor: "#fff",
  overflow: "auto",
  maxHeight: "120px",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgb(0 0 0 / 0.15)",
  zIndex: 10,
  border: "1px solid #e5e7eb",
  "& li": {
    padding: "6px 12px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    borderBottom: "1px solid #f3f4f6",
    fontSize: "0.8rem",
    "&:last-child": {
      borderBottom: "none",
    },
    "& span": {
      flexGrow: 1,
    },
  },
  "& li[aria-selected='true']": {
    backgroundColor: "#f0f9ff",
    fontWeight: 600,
    "& svg": {
      color: "#3b82f6",
    },
  },
  [`& li.${autocompleteClasses.focused}`]: {
    backgroundColor: "#f8fafc",
    cursor: "pointer",
  },
}));

// ---------- Main Task Component ----------
const Task = () => {
  const [students, setStudents] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [taskText, setTaskText] = useState("");
  const [remark, setRemark] = useState("");
  const [deadline, setDeadline] = useState("");
  const [attachments, setAttachments] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users`);
        const data = await response.json();
        const sortedData = data.sort((a, b) => a.name.localeCompare(b.name));
        setStudents(sortedData);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
  }, []);

  // ---------- Autocomplete Hook ----------
  const {
    getRootProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    getTagProps,
    groupedOptions,
    value,
    focused,
    setAnchorEl,
  } = useAutocomplete({
    multiple: true,
    options: students,
    value: selectedOptions,
    onChange: (event, newValue) => setSelectedOptions(newValue),
    getOptionLabel: (student) => `${student.name} ${student.lastName}`,
  });

  const handleFileChange = (e) => {
    setAttachments(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!taskText || !remark || !deadline || selectedOptions.length === 0) {
      alert("Please fill all fields");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("assignTask", taskText);
      formData.append("remark", remark);
      formData.append("deadline", deadline);

      const studentIds = selectedOptions.map((s) => s._id).filter(Boolean);
      formData.append("assignedTo", studentIds.join(","));

      for (let i = 0; i < attachments.length; i++) {
        formData.append("attachments", attachments[i]);
      }

      const authData = localStorage.getItem("auth");
      const parsed = authData ? JSON.parse(authData) : null;
      const token = parsed?.token;

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/intern/task`, {
        method: "POST",
        body: formData,
        headers: { auth: token },
      });

      const data = await response.json();
      console.log("Task created:", data);
      alert("Task created successfully!");

      // reset form
      setSelectedOptions([]);
      setTaskText("");
      setRemark("");
      setDeadline("");
      setAttachments([]);
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Failed to create task");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg p-8 shadow-xl rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-2xl mb-4">
            <AssignmentIcon className="text-blue-600 dark:text-blue-400 text-2xl" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Assign Task
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
            Create and assign tasks to students
          </p>
        </div>

        {/* Form Fields Container */}
        <div className="space-y-6">
          {/* Student Autocomplete */}
          <div>
            <Root>
              <div {...getRootProps()}>
              <Label className="flex items-center gap-2 mb-3">
  <PersonIcon fontSize="small" className="flex-shrink-0 text-gray-500 dark:text-gray-200" />
  <span className="text-gray-500 ml-1 dark:text-gray-200">Assign to Students</span>
</Label>

                <InputWrapper ref={setAnchorEl} className={focused ? "focused" : ""}>
                  {value.map((option, index) => (
                    <Tag key={index} {...getTagProps({ index })}>
                      <span>
                        {option.name} {option.lastName}
                      </span>
                      <CloseIcon
                        onClick={getTagProps({ index }).onDelete}
                        fontSize="small"
                      />
                    </Tag>
                  ))}
                  <input {...getInputProps()} placeholder="Search students by name..." />
                </InputWrapper>
              </div>
              {groupedOptions.length > 0 ? (
                <Listbox {...getListboxProps()}>
                  {groupedOptions.map((option, index) => (
                    <li key={option._id} {...getOptionProps({ option, index })}>
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <PersonIcon fontSize="small" className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {option.name} {option.lastName}
                        </div>
                      </div>
                      <CheckIcon fontSize="small" />
                    </li>
                  ))}
                </Listbox>
              ) : null}
            </Root>
          </div>

          {/* Task Description */}
          <div>
            <Label className="flex items-center gap-2 mb-3">
              <AssignmentIcon fontSize="small" className="text-gray-500 dark:text-gray-200" />
              <span className="text-gray-500 dark:text-gray-200 ml-1">Task Description</span>
            </Label>
            <textarea
              rows="4"
              name="task"
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              placeholder="Describe the task in detail..."
              className="block w-full p-4 text-sm border-1.5 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-xl resize-none transition-all focus:border-blue-500 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>

          {/* File Attachment */}
          <div>
            <Label className="flex items-center gap-2 mb-3">
              <AttachmentIcon fontSize="small" className="text-gray-500 dark:text-gray-200" />
              <span className="text-gray-500 ml-1 dark:text-gray-200">Attachments</span>
            </Label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="block w-full p-3 text-sm border-1.5 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all cursor-pointer"
            />
          </div>

          {/* Remark */}
          <div>
            <Label className="flex items-center gap-2 mb-3">
              <CommentIcon fontSize="small" className="text-gray-500 dark:text-gray-200" />
              <span className="text-gray-500 ml-1 dark:text-gray-200">Remarks</span>
            </Label>
            <input
              type="text"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="Add any additional notes or instructions..."
              className="block w-full p-4 text-sm border-1.5 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-xl transition-all focus:border-blue-500 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>

          {/* Deadline */}
          <div>
            <Label className="flex items-center gap-2 mb-3">
              <EventIcon fontSize="small" className="text-gray-500 dark:text-gray-200" />
              <span className="text-gray-500 ml-1 dark:text-gray-200">Deadline</span>
            </Label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="block w-full p-4 text-sm border-1.5 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-white rounded-xl transition-all focus:border-blue-500 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-4 px-6 mt-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 text-base"
        >
          <AddIcon fontSize="medium" className="text-gray-500 dark:text-gray-200" />
          Create Task
        </button>
      </form>
    </div>
  );
};

export default Task;