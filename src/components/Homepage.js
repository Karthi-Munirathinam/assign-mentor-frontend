import React, { useEffect, useState } from 'react';
import '../App.css';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import axios from './Connection';
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

function Homepage() {

    const classes = useStyles();
    const [mentorID, setMentorID] = useState('');
    const [mentors, setMentors] = useState([]);
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const getStudents = async (id) => {
        let studentsdata = await axios.get(`/getstudents/${id}`);
        let studentsid = studentsdata.data;
        setStudents(studentsid);
    }

    const handleChange = (event) => {
        setMentorID(event.target.value);
        getStudents(event.target.value);
    }

    useEffect(() => {
        const getMentors = async () => {
            try {
                setIsLoading(true);
                let mentorData = await axios.get('/getmentors');
                setMentors(mentorData.data);
                setIsLoading(false)
            } catch (error) {
                setIsLoading(false);
                console.log(error)
            }
        }
        getMentors();
    }, [])

    return (
        <div className="container p-4 homepage-container">
            <div className="row">
                <div className="col-12 mentor-input-container">
                    <p className="mr-3 input-label">Choose a Mentor</p>
                    <FormControl variant="outlined" className={`${classes.formControl} col-6`}  >
                        <InputLabel htmlFor="mentor">Mentor</InputLabel>
                        <Select
                            name="mentor"
                            value={mentorID}
                            onChange={(event) => handleChange(event)}
                            label="Mentor"
                        >

                            {
                                mentors.map((file) => {
                                    return (<MenuItem key={file._id} value={file._id}>{file.name}</MenuItem>)
                                })
                            }
                        </Select>
                    </FormControl>
                </div>
            </div>
            {
                isLoading ? <Loading /> : (
                    <div className="row p-1">
                        <div className="col-12">
                            <h5 className="pl-5 text-center m-4" style={{ color: "red" }}>Students Name</h5>
                            <div className="studentname-container">
                                {
                                    students.map(obj => {
                                        return (
                                            <div className="col-12 text-center" key={obj._id}>
                                                <h6 className="pl-5">{obj.name}</h6>
                                                <hr className="row" />
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                )
            }

        </div>
    )
}

export default Homepage
