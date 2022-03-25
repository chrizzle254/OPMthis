import React, { useState } from "react";
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';



const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};


export const Settings = () => {
    const [settings, setSettings] = useState({
        'baseUrl': '',
        'eventAttributes': [''],
        'kafkaSettings': {
            'topic': '',
            'bootstrapServers': '',
        },
        'opmSettings':{
            'eventLogType': '',
            'opmAlgo': '',
            'processNetType': ''
        }
    })
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    React.useEffect(() => {
        fetch("api/config/get").then(res => res.json()).then(data => setSettings(data.response))
    }, [])


    const handler = (field, eventValue) => {
        console.log(field + " settings: " + eventValue)
        if (field == "bootstrapServers" || field == "topic") {
            setSettings({ ...settings['kafkaSettings'], [field]: eventValue
            })
        }
        if (field == "eventAttributes") {
            setSettings({ ...settings, [field]: eventValue.split(";") })
        }
        if (field == "eventLogType" || field == "opmAlgo" || field == "processNetType") {
            setSettings({ ...settings, ['opmSettings']:{
                ...settings['opmSettings'], [field]: eventValue
            }})
        }
        else {
            setSettings({ ...settings, [field]: eventValue })
        }
        console.log("Settings internal: ")
        console.log(settings)
    }


    return (
        <div>
            <IconButton aria-label="delete" onClick={handleOpen}>
                <SettingsIcon sx={{ fontSize: 50 }} />
            </IconButton>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <Box sx={style}>
                        <Typography id="transition-modal-title" variant="h6" component="h2" pb={3}>
                            Edit configurations
                        </Typography>
                        <div key="baseUrlKey">
                            <TextField
                                label="Connected URL"
                                id="outlined-required"
                                onChange={evt => handler('baseUrl', evt.currentTarget.value)}
                                fullWidth
                                value={settings['baseUrl']}
                            />
                        </div>
                        <div key="eventAttributesKey">
                            <TextField
                                label="Event attributes (separate with comma)"
                                id="outlined-required"
                                onChange={evt => handler('eventAttributes', evt.currentTarget.value)}
                                fullWidth
                                value={settings['eventAttributes']}
                            />
                        </div>
                        <div key="kafkaTopicKey">
                            <TextField
                                label="Kafka topic"
                                id="outlined-required"
                                onChange={evt => handler('topic', evt.currentTarget.value)}
                                fullWidth
                                value={settings['kafkaSettings']['topic']}
                            />
                        </div>
                        <div key="kafkaBootstrapServersKey">
                            <TextField
                                label="Kafka bootstrap server"
                                id="outlined-required"
                                onChange={evt => handler('bootstrapServers', evt.currentTarget.value)}
                                fullWidth
                                value={settings['kafkaSettings']['bootstrapServers']}
                            />
                        </div>
                        <div key="opmSettingsEventLogTypeKey">
                            <TextField
                                label="Event log type"
                                id="outlined-required"
                                onChange={evt => handler('eventLogType', evt.currentTarget.value)}
                                fullWidth
                                value={settings['opmSettings']['eventLogType']}
                            />
                        </div>
                        <div key="opmSettingsOpmAlgoKey">
                            <TextField
                                label="OPM algo"
                                id="outlined-required"
                                onChange={evt => handler('opmAlgo', evt.currentTarget.value)}
                                fullWidth
                                value={settings['opmSettings']['opmAlgo']}
                            />
                        </div>
                        <div key="opmSettingsProcessNetTypeKey">
                            <TextField
                                label="Process net type"
                                id="outlined-required"
                                onChange={evt => handler('processNetType', evt.currentTarget.value)}
                                fullWidth
                                value={settings['opmSettings']['processNetType']}
                            />
                        </div>
                        <Button variant="contained" onClick={() => {
                            console.log(settings)
                            fetch("/api/config/post", {
                                'method': 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(settings)
                            })
                        }}>
                            SUBMIT SETTINGS
                        </Button>
                        <Button variant="contained" onClick={() => { fetch("api/config/get").then(res => res.json()).then(data => setSettings(data.response)) }}>
                            RESET
                        </Button>
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
}