import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import axios from './Connection'
import { useHistory } from 'react-router';


function Createuser() {
    const [role, setRole] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [dob, setDOB] = useState();
    const history = useHistory();
    const handleChange = (event) => {
        setRole(event.target.value);
    };

    const handlesubmit = async (e) => {
        e.preventDefault();
        if (role === "mentor") {
            const obj = {
                name, email,
                DOB: dob
            };
            await axios.post('/savementor', obj)
            history.push('/')
        }
        else if (role === "student") {
            const obj = {
                name, email,
                DOB: dob,
                assignedmentor: false
            };
            await axios.post('/savestudent', obj)
            history.push('/')
        }
    }

    return (
        <div className="container createuser-container">
            <form className="row input-container" onSubmit={(e) => handlesubmit(e)}>
                <TextField id="standard-secondary" value={name} onChange={(e) => setName(e.target.value)} name="name" className="col-md-8 mb-4" label="Name" color="secondary" />
                <TextField id="standard-secondary" value={email} onChange={(e) => setEmail(e.target.value)} name="email" className="col-md-8 mb-4" label="Email" color="secondary" />
                <TextField
                    value={dob}
                    onChange={(e) => setDOB(e.target.value)}
                    id="date"
                    label="Birthday"
                    type="date"
                    name="DOB"
                    className={` col-md-8 mb-4`}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <FormControl className={` col-md-8 mb-4`}>
                    <InputLabel id="demo-simple-select-label" name="role">Role</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={role}
                        onChange={handleChange}
                    >
                        <MenuItem value={"mentor"}>Mentor</MenuItem>
                        <MenuItem value={"student"}>Student</MenuItem>
                    </Select>
                </FormControl>
                <div className="col-12 btn-container">
                    <input type="submit" className="btn btn-danger" value="Submit" />
                </div>
            </form>
        </div>
    )
}

export default Createuser
