import React, { useState, useEffect } from 'react';
import { checkLogin }  from '../util/auth'
import './EditAssignment.css';
import { Button, FormGroup, Label, Input } from 'reactstrap';
const axios = require("axios")

export default function EditAssignment(props) {
    const [user, setUser] = useState(null);
    const [Assignment, setAssignment] = useState(null);
    const [Name, setAssignmentName] = useState('')
    const [Description, setAssignmentDesc] = useState('')
    const [Points, setNumPoints] = useState('')
    const [DueDate, setDueDate] = useState('')
    const [Category, setCategory] = useState('')
    const [Closed, setClosed] = useState('')
    useEffect(()=>{
        const params = props.match.params
        let user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : ''
        setUser(user)
        checkLogin(user) //redirect user to homepage if not login
        getAssignment(params.assignmentid)
    },[])
    async function getAssignment(id) {
        const body = JSON.stringify({AssignmentID:id})
        console.log("API Request:", body)
        let res = await axios.post('https://bvr02h55bk.execute-api.us-east-1.amazonaws.com/Prod/getAssignment', body)
        console.log("API Response:", res.data.Item)
        setAssignment(res.data.Item)
    }
    async function click() {
        const body = JSON.stringify({ Name, Description, Points, DueDate, Category, Questions:Assignment.Questions, AssignmentID:Assignment.AssignmentID, CourseID:Assignment.CourseID, Submissions:Assignment.Submissions, Closed:Closed });
        let res = await axios.post("https://bvr02h55bk.execute-api.us-east-1.amazonaws.com/Prod/putAssignment", body)
        window.location.href = "/viewAssignments/".concat(Assignment.CourseID.toString())
    }
    return (
        <div className="App"> 
            <header className="App-header">
                { Assignment ? (
                    <>
                        <h1 id="title">
                                Edit Assignment:
                        </h1>
                        <div className="Form">
                            <FormGroup>
                                <Label for="assignmentName">Assignment Name </Label>
                                <Input type="text" name="name" className="formElement" onChange={(event) => { setAssignmentName(event.target.value) }} id="assignmentName" placeholder={Assignment.Name}/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="assignmentDescription">Assignment Description </Label>
                                <Input type="textarea" name="desc" className="formElement" onChange={(event) => { setAssignmentDesc(event.target.value) }} id="assignmentDesc" placeholder={Assignment.Description}/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="numPoints">Points </Label>
                                <Input type="number" name="points" className="formElement" onChange={(event) => { setNumPoints(event.target.value) }} id="numPoints" placeholder={parseInt(Assignment.Points, 10)}/>
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
                            <Label for="closed">Assignment Closed</Label>
                            <Input type="select" name="Closed" className="formElement dropdown" onChange={(event) => { setClosed(event.target.value) }} id="closed">
                                <option value="" selected disabled hidden>Closed</option>
                                <option>Yes</option>
                                <option>No</option>
                            </Input>
                            <FormGroup check row>
                                <Button onClick={() => { click() }} id="submit">Submit</Button>
                            </FormGroup>
                        </div>
                    </>
                ) : (
                    <div>
                        {'Waiting for API'}
                    </div>
                ) }
            </header>
        </div>
    )
}

