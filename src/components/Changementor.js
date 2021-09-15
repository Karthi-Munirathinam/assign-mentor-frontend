import React, { useEffect, useState } from 'react';
import '../App.css';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import axios from './Connection';
import { useFormik } from 'formik';
import { useHistory } from "react-router-dom";
import Loading from './Loading';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

function Changementor() {
    const classes = useStyles();

    const [studentID, setStudentID] = useState('');
    const [students, setStudents] = useState([]);
    const [mentorsList, setMentorsList] = useState([]);
    const [currentMentorID, setCurrentMentorID] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const history = useHistory();

    const formik = useFormik({
        initialValues: {
            student: '',
            checked: ''
        },
        validate: (values) => {
            let errors = {};
            if (!values.student) {
                errors.student = "Required"
            }
            if (!values.checked) {
                errors.checked = "Select atleast one Mentor"
            }
            return errors;
        },
        onSubmit: (values) => {
            setMentorToStudent(values.student);
            history.push('/')
        }

    });

    const setMentorToStudent = async (studentID) => {
        try {
            setIsLoading(true)
            await axios.put(`/assignmentor/${studentID}`, {
                assignedmentor: true,
                mentorId: currentMentorID
            });
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.log(error);
        }
    };

    const handleChange = (event) => {
        setStudentID(event.target.value);
        formik.values.student = event.target.value;
        getCurrentMentor(event.target.value)
    }

    const handleRadioButton = (e) => {
        setCurrentMentorID(e.target.value);
        formik.values.checked = e.target.value;
    }

    const getStudents = async () => {
        let studentData = await axios.get('/getallstudents');
        setStudents(studentData.data);
    }

    const getCurrentMentor = async (studentID) => {
        let mentorData = await axios.get(`/getmentor/${studentID}`);
        setCurrentMentorID(mentorData.data[0]._id)
        console.log(mentorData.data[0]._id);
    }

    useEffect(() => {
        const getMentors = async () => {
            try {
                setIsLoading(true);
                let mentorData = await axios.get('/getmentors');
                setMentorsList(mentorData.data);
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                console.log(error);
            }
        }
        getMentors();
        getStudents();
    }, [])

    return (
        <>
            <div className="container p-4 homepage-container">
                <div className="row">
                    <form className="col-12 mentor-input-container">
                        <p className="mr-3 input-label">Choose a Student</p>
                        <FormControl variant="outlined" className={`${classes.formControl} col-6`} >
                            <InputLabel htmlFor="student">Student</InputLabel>
                            <Select
                                name="student"
                                value={studentID}
                                onChange={(event) => handleChange(event)}
                                label="student"
                            >
                                {
                                    students.map((file) => {
                                        return (<MenuItem key={file._id} name="checked" value={file._id}>{file.name}</MenuItem>)
                                    })
                                }
                            </Select>
                        </FormControl>
                        {formik.errors.student ? <span style={{ color: 'red' }}>{formik.errors.student}</span> : ''}
                    </form>
                </div>
                {
                    isLoading ? <Loading /> : (
                        <form className="row checked-lists" onSubmit={formik.handleSubmit}>
                            <div className="form-check col-12 check-list-container">
                                {formik.errors.checked ? <span style={{ color: 'red' }}>{formik.errors.checked}</span> : ''}
                                {mentorsList.map((mentor, index) => {
                                    return (<div key={mentor._id}>
                                        <div className="pl-5">
                                            <input type="radio" className="form-check-input" name="exampleRadios" id={`exampleRadios${index}`} value={mentor._id} checked={mentor._id === currentMentorID ? true : false} onChange={(e) => handleRadioButton(e)} />
                                            <label className="form-check-label" htmlFor={`exampleRadios${index}`}>{mentor.name}</label>
                                        </div>
                                        <hr className="row" />
                                    </div>
                                    )
                                })
                                }
                            </div>
                            <div className="text-center col-12">
                                <input type="submit" value="Submit" className="btn btn-outline-danger btn-lg col-6" />
                            </div>
                        </form>
                    )
                }

            </div>
        </>
    )
}

export default Changementor
