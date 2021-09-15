import React, { useEffect, useState } from 'react';
import '../App.css';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import axios from './Connection';

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
    const [mentor, setMentor] = useState('');
    const [mentors, setMentors] = useState([]);

    const getStudents = async (id) => {
        let studentsdata = await axios.get(`/getstudents/${id}`);
        console.log(studentsdata.data)
    };

    const handleChange = (event) => {
        setMentor(event.target.value);
        getStudents(event.target.value);
    };

    useEffect(() => {
        const getMentors = async () => {
            let mentorData = await axios.get('/getmentors');
            setMentors(mentorData.data);
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
                            value={mentor}
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
            <div className="row">
                <div className="col-12">
                    hi
                </div>
            </div>
        </div>
    )
}

export default Homepage
