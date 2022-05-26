const fs = require('fs');
const express = require("express");

const app = express();
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.post('/SignUp', (req,
                     res) => {
    console.log("POST /SignUp");

    fs.readFile('./members.json', 'utf8',
        (error, jsonFile) => {
            if (error) return console.log(error);
            const jsonData = JSON.parse(jsonFile); //members.json을 string형으로 변환하여 jsonData에 저장

            const members = jsonData.members; //members.json에서 members를 members변수에 저장
            const {name, password} = req.body;

            for (let idx = 0; idx < members.length; idx++) {
                const member = members[idx];
                if (member.name === name) {
                    console.log("회원가입 실패 - name 중복");
                    return res.status(404).send( "회원가입 실패 - name 중복");
                }
            }

            const data = {
                "members": [
                    {
                        "name": name,
                        "password": password
                    }
                ]
            }

            const stringData = JSON.stringify(data);
            fs.appendFile('./members.json', stringData,
                (error) => {
                    if (error) return console.log(error);
                    console.log(name + " SignUp Success");
                    res.status(200).send("SignUp Success");
                });
        });
});

app.post('/Login', (req,
                    res) => {
    console.log("POST /Login");

    fs.readFile('./members.json', 'utf8',
        (error, jsonFile) => {
            if (error) return console.log(error);
            const jsonData = JSON.parse(jsonFile); //members.json을 string형으로 변환하여 jsonData에 저장

            const members = jsonData.members; //members.json에서 members를 members변수에 저장
            const {name, password} = req.body;

            for (let idx = 0; idx < members.length; idx++) {
                const member = members[idx];
                if (member.name === name) {                //로그인 시 name이 일치하면
                    if (member.password === password) {    //로그인 시 password가 일치하면
                        console.log("Login Success");
                        return res.status(200).send("login success"); //로그인 성공
                    }
                }
            }
            console.log("Login failed");
            res.status(404).send("login failed"); //둘 중 하나라도 틀리면 로그인 실패
        });
});

app.post('/reviews', (req
    ,res )=> {
    console.log("POST /reviews");

    const {id, star_ratings, writer
        , comments} = req.body;
    const data = {
        "id": id,
        "star_ratings": star_ratings,
        "writer": writer,
        "comments": comments
    }

    const stringData = JSON.stringify(data);
    fs.appendFile('./reviews.json', stringData,
        (error) => {
            if (error) return console.log(error);
            res.status(200).send("review upload");
            console.log("review upload");
        });
});

app.get('/reviews', (req,
                     res, next) => {
    console.log("GET /reviews");
    res.status(200).send("GET /reviews");
});

app.listen(3000, () => {
    console.log("starting server at port 3000..");
});