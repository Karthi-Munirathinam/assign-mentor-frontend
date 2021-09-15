import React, { useEffect, useState } from 'react';
import '../App.css';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import axios from './Connection';
import { useFormik } from 'formik';
import Loading from './Loading';
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

function Assignmentor() {

    const classes = useStyles();
    const [mentorID, setMentorID] = useState('');
    const [mentors, setMentors] = useState([]);
    const [checkedlist, setCheckedList] = useState([])
    const [studentsList, setStudentsList] = useState([]);
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(false);
    const formik = useFormik({
        initialValues: {
            mentor: '',
            checked: []
        },
        validate: (values) => {
            let errors = {};
            if (!values.mentor) {
                errors.mentor = "Required"
            }
            if (values.checked.length <= 0) {
                errors.checked = "Select atleast one Student"
            }
            return errors;
        },
        onSubmit: (values) => {
            const handleformsubmit = () => {
                const SelectedStudents = values.checked.map((pos, index) =>
                    pos ? studentsList[index]._id : ''
                ).filter((item) => item !== '');
                setStudentToMentor(SelectedStudents);
                SelectedStudents.map(objID =>
                    setMentorToStudent(objID)
                )
                setIsLoading(true);
                getStudents();
            }
            handleformsubmit();
            history.push('/');
            setIsLoading(false)
        }

    });
    const setMentorToStudent = async (studentID) => {
        try {
            await axios.put(`/assignmentor/${studentID}`, {
                assignedmentor: true,
                mentorId: `${mentorID}`
            });
        } catch (error) {
            console.log(error);
        }

    };

    const setStudentToMentor = async (selectedStudents) => {
        try {
            await axios.put(`/assignstudent/${mentorID}`, {
                assignedStudents: selectedStudents
            });
        } catch (error) {
            console.log(error);
        }
    }

    const handleChange = (event) => {
        //get mentor id
        setMentorID(event.target.value);
        formik.values.mentor = event.target.value;
    };
    const handleCheckbox = (position) => {

        const updateCheckedList = checkedlist.map((list, index) => {
            return position === index ? !list : list;
        })
        formik.values.checked = updateCheckedList;
        setCheckedList(updateCheckedList);
    }

    const getStudents = async () => {
        let studentData = await axios.get('/getstudents');
        setStudentsList(studentData.data);
        const arr = new Array(studentData.data.length).fill(false)
        setCheckedList(arr);
    }
    useEffect(() => {
        const getMentors = async () => {
            try {
                setIsLoading(true);
                let mentorData = await axios.get('/getmentors');
                setIsLoading(false);
                setMentors(mentorData.data);
            } catch (error) {
                setIsLoading(false);
                console.log(error)
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
                        <p className="mr-3 input-label">Choose a Mentor</p>
                        <FormControl variant="outlined" className={`${classes.formControl} col-6`} >
                            <InputLabel htmlFor="mentor">Mentor</InputLabel>
                            <Select
                                name="mentor"
                                value={mentorID}
                                onChange={(event) => handleChange(event)}
                                label="Mentor"
                            >

                                {
                                    mentors.map((file) => {
                                        return (<MenuItem key={file._id} name="checked" value={file._id}>{file.name}</MenuItem>)
                                    })
                                }
                            </Select>
                        </FormControl>
                        {formik.errors.mentor ? <span style={{ color: 'red' }}>{formik.errors.mentor}</span> : ''}
                    </form>
                </div>
                {
                    isLoading ? <Loading /> : (
                        <form className="row checked-lists" onSubmit={formik.handleSubmit}>
                            <div className="custom-control custom-checkbox col-12 check-list-container">
                                {formik.errors.checked ? <span style={{ color: 'red' }}>{formik.errors.checked}</span> : ''}
                                {studentsList.map((student, index) => {
                                    return (<div key={student._id}>
                                        <div className="pl-5">
                                            <input type="checkbox" className="custom-control-input" onChange={() => handleCheckbox(index, student._id)} checked={checkedlist[index]} id={`customCheck${index}`} />
                                            <label className="custom-control-label" htmlFor={`customCheck${index}`}>{student.name}</label>
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

export default Assignmentor
