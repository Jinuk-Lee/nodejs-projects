const fs = require('fs');
const express = require("express");

const app = express();
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));


//localhost:3000/signup
app.post('/signup', (req,
                     res) => {
    console.log("POST /SignUp");

    fs.readFile('./members.json', 'utf8',
        (error, jsonFile) => {
            if (error) return console.log(error);

            const jsonData = JSON.parse(jsonFile); //members.json을 string형으로 변환하여 jsonData에 저장
            //string("") -> json 변경

            const members = jsonData.members; //members.json에서 members를 members변수에 저장
            const {id,email} = req.body;


            for (let idx = 0; idx < members.length; idx++) {
                const member = members[idx];
                if (member.id === id) {             //고유 식별자 중복 검사
                    if(member.email===email)      //email 중복검사
                    console.log("SignUp Failed - already exists id");
                    return res.status(404).send( "SignUp Failed - already exists id");
                }
            }

            members.push(req.body);
            //const newmembers = JSON.stringify(members,null,4);

            fs.writeFile('./members.json', JSON.stringify(members,null,4),
                "utf8", (err) => {

                    if (error) return console.log(error);
                    console.log(" SignUp Success");
                    res.status(200).send("SignUp Success");
                });
        });
});
//localhost:3000/login
app.post('/login', (req,
                    res) => {
    console.log("POST /Login");

    fs.readFile('./members.json', 'utf8',
        (error, jsonFile) => {
            if (error) return console.log(error);
            const jsonData = JSON.parse(jsonFile); //members.json을 string형으로 변환하여 jsonData에 저장

            const members = jsonData.members; //members.json에서 members를 members변수에 저장
            const {id, password} = req.body;

            for (let idx = 0; idx < members.length; idx++) {
                const member = members[idx];
                if (member.id === id) {                //로그인 시 name이 일치하면
                    if (member.password === password) {    //로그인 시 password가 일치하면
                        console.log("Login Success");
                        return res.status(200).send("Login Success"); //로그인 성공
                    }
                }
            }
            console.log("Login failed");
            res.status(404).send("Login failed"); //둘 중 하나라도 틀리면 로그인 실패
        });
});
//localhost:3000/reviews
app.post('/reviews', (req
    ,res )=> {
    console.log("POST /reviews");

    fs.readFile('./reviews.json', 'utf8',
        (error, jsonFile) => {
            if (error) return console.log(error);

            const jsonData = JSON.parse(jsonFile); //members.json을 string형으로 변환하여 jsonData에 저장
            //string("") -> json 변경

            const reviews = jsonData.reviews;

            reviews.push(req.body);


            fs.writeFile('./reviews.json', JSON.stringify(reviews,null, 4),
                "utf8", (error) => {

                    if (error) return console.log(error);
                    console.log("review upload");
                    res.status(200).send("review upload");
                });
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