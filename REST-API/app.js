const fs = require('fs');
const express = require("express");
const {json} = require("express");

const app = express();
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.post('/signup', (req,
                     res) => {
    console.log("POST /signup");

    fs.readFile('./members.json', 'utf8',
        (error, jsonFile) => {
            if (error) return console.log(error);
            const jsonData = JSON.parse(jsonFile); //members.json을 string형으로 변환하여 jsonData에 저장

            const {email, password, identification_number} = req.body;

            for (let i = 0; i < jsonData.length; i++) {
                const member = jsonData[i];
                if ( (identification_number === member.identification_number)
                    || ((member.email === email) && (member.password === password))) {
                    console.log("SignUp Failed - already exists");
                    return res.status(404).send("SignUp Failed - already exists");
                }
            }
            jsonData.push(req.body);

            fs.writeFile('./members.json', JSON.stringify(jsonData, null, 4),
                "utf8", (err) => {

                    if (error) return console.log(error);
                    console.log("SignUp Success");
                    res.status(200).send("SignUp Success");
                });
        });
});

app.post('/login', (req,
                    res) => {
    console.log("POST /login");

    fs.readFile('./members.json', 'utf8',
        (error, jsonFile) => {
            if (error) return console.log(error);
            const jsonData = JSON.parse(jsonFile); //members.json을 string형으로 변환하여 jsonData에 저장

            const {email, password} = req.body;

            for (let i = 0; i < jsonData.length; i++) {
                const member = jsonData[i];
                if ((member.email === email) && (member.password === password)) {
                    console.log("Login Success");

                    const nameData = {
                        email: req.body.email
                    };

                    fs.writeFile('./loginlist.json', JSON.stringify(nameData, null, 4),
                        "utf8", (err) => {

                            if (error) return console.log(error);
                        });

                    return res.status(200).send("Login Success"); //로그인 성공
                }
            }
            console.log("Login failed");
            res.status(404).send("Login failed"); //둘 중 하나라도 틀리면 로그인 실패
        });
});

//아래는 리뷰를 작성하는 코드
app.post('/reviews', (req
    , res) => {
    console.log("POST /reviews");

    fs.readFile('./loginlist.json', 'utf8', (err, loginFile) => {
        if (err) return console.log(err);
        const loginData = JSON.parse(loginFile);

        const email = req.body.email;

        for (let i = 0; i < loginData.length; i++) {
            const loginEmail = loginData[i];
            if (email === loginEmail.email) {
                fs.readFile('./reviews.json', 'utf8',
                    (error, reviewsFile) => {
                        if (error) return console.log(error);

                        const reviewData = JSON.parse(reviewsFile); //members.json을 string형으로 변환하여 jsonData에 저장

                        const newReviewData = {
                            star_ratings: req.body.star_ratings,
                            writer: req.body.writer,
                            comments: req.body.comments
                        };

                        reviewData.push(newReviewData);

                        fs.writeFile('./reviews.json', JSON.stringify(reviewData, null, 4),
                            "utf8", (error) => {

                                if (error) return console.log(error);
                                return res.status(200).send("review upload");
                            });
                    });
            }
            res.status(404).send(" failed");
        }
    });
});
app.get('/reviews', (req,
                     res, next) => {
    console.log("GET /reviews");
    // res.status(200).send("GET /reviews");
    fs.readFile('./reviews.json', 'utf8',
        (error, reviewsFile) => {
            if (error) return console.log(error);

            const reviewData = JSON.parse(reviewsFile);

            res.status(200).send(reviewData);
        });
});

app.listen(3000, () => {
    console.log("starting server at port 3000..");
});