import express from 'express';
import cors from 'cors';
import http from 'http';
import * as fs from "fs";
import moment from 'moment';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.disable('x-powered-by');

app.get('/', (req, res) => {
	res.send("hello world");
});

app.get('/students', (req, res) => {
    fs.readFile('../db.json', 'utf-8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading database');
        } else {
            const json = JSON.parse(data);
            res.send(json['attendanceSheet']['STUDENTS']);
        }
    });
});

app.get('/students/:id', (req, res) => {
    fs.readFile('../db.json', 'utf-8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading database');
        } else {
            const json = JSON.parse(data);
            let studentRes = null;
            json['attendanceSheet']['STUDENTS'].forEach((student: any) => {
                if (student['id'] == req.params.id) {
                    studentRes = student;
                }
            });

            if (studentRes) {
                res.send(studentRes);
            } else {
                res.status(404).send('Student not found');
            }
        }
    });
});

app.post('/students/:id/sign', (req, res) => {
    fs.readFile('../db.json', 'utf-8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading database');
        } else {
            const json = JSON.parse(data);
            let studentRes: any = null;
            json['attendanceSheet']['STUDENTS'].forEach((student: any) => {
                if (student['id'] == req.params.id) {
                    studentRes = student;
                }
            });

            if (studentRes) {
                studentRes['signature'] = req.body.signature;
                studentRes['presenceState'] = true;
                studentRes['signatureTimestamp'] = moment().format('YYYY-MM-DD HH:mm:ss');
                fs.writeFile('../db.json', JSON.stringify(json), (err) => {
                    if (err) {
                        res.status(500).send('Error writing to database');
                    } else {
                        res.send({ message: 'Signature saved' });
                    }
                });
            } else {
                res.status(404).send('Student not found');
            }
        }
    });
});

app.post('/students/:id/absent', (req, res) => {
    fs.readFile('../db.json', 'utf-8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading database');
        } else {
            const json = JSON.parse(data);
            let studentRes: any = null;
            json['attendanceSheet']['STUDENTS'].forEach((student: any) => {
                if (student['id'] == req.params.id) {
                    studentRes = student;
                }
            });

            if (studentRes) {
                studentRes['presenceState'] = false;
                studentRes['signature'] = null;
                fs.writeFile('../db.json', JSON.stringify(json), (err) => {
                    if (err) {
                        res.status(500).send('Error writing to database');
                    } else {
                        res.send({ message: 'Marked as absent' });
                    }
                });
            } else {
                res.status(404).send('Student not found');
            }
        }
    });
});

const port = 3001;

(async () => {
    http.createServer(app).listen(port, () => {
        console.log('Server is running on port 3000');
    });
})();
