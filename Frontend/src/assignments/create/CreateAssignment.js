import React, { useState, useEffect } from 'react';
import { checkLogin } from '../../util/auth'
import './CreateAssignment.css';
import { Button, FormGroup, Label, Input } from 'reactstrap';
const axios = require("axios")

export default function CreateAssignment() {
    const [user, setUser] = useState(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : '');
    useEffect(() => {
        checkLogin(user) //redirect user to homepage if not login
        console.log(user)
    }, [])
    const [Name, setAssignmentName] = useState('')
    const [Description, setAssignmentDesc] = useState('')
    const [Points, setNumPoints] = useState('')
    const [DueDate, setDueDate] = useState('')
    const [Category, setCategory] = useState('')
    const [CourseID, setCourseID] = useState('')
    async function click() {
        const body = JSON.stringify({ Name, Description, Points, DueDate, Category, CourseID, Closed: 1 });
        console.log(user)
        let res = await axios.post("https://bvr02h55bk.execute-api.us-east-1.amazonaws.com/Prod/putAssignment", body)
        console.log(res.data)
    }

    return (
        <div className="App">
            <header className="create-header">
                <div className="Form">
                    <FormGroup>
                        <Label for="assignmentName">Assignment Name </Label>
                        <Input type="text" name="name" className="formElement" onChange={(event) => { setAssignmentName(event.target.value) }} id="assignmentName" placeholder="Name" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="assignmentDescription">Assignment Description </Label>
                        <Input type="textarea" name="desc" className="formElement" onChange={(event) => { setAssignmentDesc(event.target.value) }} id="assignmentDesc" placeholder="Description" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="numPoints">Points </Label>
                        <Input type="number" name="points" className="formElement" onChange={(event) => { setNumPoints(event.target.value) }} id="numPoints" placeholder="Points" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="dueDate">Due Date </Label>
                        <Input type="date" name="due" className="formElement" onChange={(event) => { setDueDate(event.target.value) }} id="dueDate" />
                    </FormGroup>
                    <Label for="category">Category </Label>
                    <Input type="select" name="Category" className="formElement dropdown" onChange={(event) => { setCategory(event.target.value) }} id="category">
                        <option value="" selected disabled hidden>Select Category</option>
                        <option>Lecture</option>
                        <option>Homework</option>
                        <option>Quiz</option>
                        <option>Test</option>
                    </Input>
                    <FormGroup>
                        <Label for="courseID">Course </Label>
                        <Input type="text" name="courseid" className="formElement" onChange={(event) => { setCourseID(event.target.value) }} id="courseid" placeholder="Course" />
                    </FormGroup>
                    <FormGroup check row>
                        <Button onClick={() => { click() }} id="submit">Submit</Button>
                    </FormGroup>
                </div>
            </header>
        </div>
    )
}
