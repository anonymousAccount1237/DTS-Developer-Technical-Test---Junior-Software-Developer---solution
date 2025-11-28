import { useState } from "react";
import { API } from "../constants";
import styles from "./Home.module.css"

const Home = () => {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("");
    const [dueDate, setDueDate] = useState("")
    const [loading, setLoading] = useState(false);

    const [showModal, setShowModal] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");

    const [modalTitle, setModalTitle] = useState("");
    const [modalDescription, setModalDescription] = useState("");
    const [modalStatus, setModalStatus] = useState("");
    const [modalDueDate, setModalDueDate] = useState("")


    const postTask = async (data) => {
        const response = await fetch(`${API}/api/tasks/create/`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData?.detail || "Failed to create task";
        throw new Error(message);
    }

    const createdTask = await response.json();

    setModalTitle(createdTask.title);
    setModalDescription(createdTask.description);
    setModalStatus(createdTask.status);
    setModalDueDate(createdTask.dueDate);
  };


    const handleSubmit = async () => {
        setLoading(true);

        try {
            const taskData = {
                title,
                description: description || "",
                status,
                dueDate,
            };
            await postTask(taskData);


            // Reset form
            setTitle("");
            setDescription("");
            setStatus("");
            setDueDate("");
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setLoading(false);
            setShowModal(true);
        }
    };


    const closeModal = () => {
        setErrorMessage("")
        setModalTitle("");
        setModalDescription("");
        setModalStatus("");
        setModalDueDate("");
        setShowModal(false);
    }


    return (
        <div className={styles.container}>

             {showModal && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h2>{errorMessage ? "Unable To create task" : "Created task!"}</h2>
            {errorMessage ? errorMessage : 
            <label>
            New Task Created with<br />
            title: {modalTitle}<br />
            description: {modalDescription}<br />
            status: {modalStatus}<br />
            due date: {modalDueDate} </label>}
            <button className={styles.submitButton} onClick={closeModal}>Close</button>
          </div>
        </div>
      )}

        <div className={styles.formBox}>
            <label className={styles.heading}>title</label>
             <input
             className={styles.textInput}
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
            />
            <label className={styles.heading}>{"description (optional)"}</label>
            <textarea
                className={styles.textInput}
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Enter task description"
            />
            <label className={styles.heading}>status</label>
             <input
                className={styles.textInput}
                id="status"
                type="text"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                placeholder="Enter task status"
            />
            <label for="dueDate" className={styles.heading}>due date</label>
             <input
                className={styles.textInput}
                id="dueDate"
                type="date"
                value={dueDate}
                label="due date"
                onChange={(e) => setDueDate(e.target.value)}
            />

            <button
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={loading || !title || !status || !dueDate}
            > {loading ? "loading..." : "create task"} </button>
        </div>
        </div>
    )
}

export default Home;