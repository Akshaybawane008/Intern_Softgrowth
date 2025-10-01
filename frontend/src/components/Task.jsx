import { useState, useEffect } from "react";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
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
  padding: 0 0 4px;
  line-height: 1.5;
  display: block;
  font-weight: 500;
`;

const InputWrapper = styled("div")(() => ({
  width: "100%",
  border: "1px solid #d9d9d9",
  backgroundColor: "#fff",
  borderRadius: "4px",
  padding: "2px",
  display: "flex",
  flexWrap: "wrap",
  "&:hover": {
    borderColor: "#40a9ff",
  },
  "&.focused": {
    borderColor: "#40a9ff",
    boxShadow: "0 0 0 2px rgb(24 144 255 / 0.2)",
  },
  "& input": {
    backgroundColor: "#fff",
    height: "30px",
    padding: "4px 6px",
    flexGrow: 1,
    border: 0,
    outline: 0,
  },
}));

const Tag = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  height: 24,
  margin: 2,
  backgroundColor: "#fafafa",
  border: "1px solid #e8e8e8",
  borderRadius: 2,
  padding: "0 4px 0 10px",
  "& span": {
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  "& svg": {
    fontSize: 14,
    cursor: "pointer",
    padding: 2,
  },
}));

const Listbox = styled("ul")(() => ({
  width: "100%",
  margin: 0,
  padding: 0,
  position: "absolute",
  listStyle: "none",
  backgroundColor: "#fff",
  overflow: "auto",
  maxHeight: 200,
  borderRadius: "4px",
  boxShadow: "0 2px 8px rgb(0 0 0 / 0.15)",
  zIndex: 1,
  "& li": {
    padding: "6px 12px",
    display: "flex",
    alignItems: "center",
    "& span": {
      flexGrow: 1,
    },
  },
  "& li[aria-selected='true']": {
    backgroundColor: "#fafafa",
    fontWeight: 600,
    "& svg": {
      color: "#1890ff",
    },
  },
  [`& li.${autocompleteClasses.focused}`]: {
    backgroundColor: "#e6f7ff",
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
        const response = await fetch("http://localhost:4000/api/users");
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
    getOptionLabel: (student) => `${student.name} ${student.lastName}`, // ✅ Suggest by name
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

      const response = await fetch("http://localhost:4000/api/intern/task", {
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
    <div className="min-h-screen flex justify-center items-start bg-gray-100 dark:bg-gray-900 transition-colors p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[600px] p-6 shadow-xl rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
      >
        <h2 className="text-2xl font-semibold text-center mb-5">Assign Tasks</h2>

        {/* ✅ Student Autocomplete */}
        <Root className="mb-5">
          <div {...getRootProps()}>
            <Label>Select Students</Label>
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
              <input {...getInputProps()} placeholder="Type a name..." />
            </InputWrapper>
          </div>
          {groupedOptions.length > 0 ? (
            <Listbox {...getListboxProps()}>
              {groupedOptions.map((option, index) => (
                <li key={option._id} {...getOptionProps({ option, index })}>
                  <span>
                    {option.name} {option.lastName} ({option.email})
                  </span>
                  <CheckIcon fontSize="small" />
                </li>
              ))}
            </Listbox>
          ) : null}
        </Root>

        {/* ✅ Rest of form remains same */}
        <textarea
          rows="4"
          name="task"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          placeholder="Assign a Task"
          className="block w-full mb-5 p-2 border-b-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white transition-colors"
          required
        />

        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="block w-full mb-5 p-2 border-b-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white transition-colors"
        />

        <input
          type="text"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          placeholder="Remark"
          className="block w-full mb-5 p-2 border-b-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white transition-colors"
          required
        />

        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="block w-full mb-5 p-2 border-b-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white transition-colors"
          required
        />

        <button
          type="submit"
          className="text-white bg-blue-700 dark:bg-blue-600 hover:bg-blue-800 dark:hover:bg-blue-700 w-full py-2.5 rounded-lg transition-colors"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Task;
