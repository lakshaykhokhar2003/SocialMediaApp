const axios = require('axios');
const {faker} = require('@faker-js/faker');
const {Base64} = require('js-base64');
const generateDummyData = async () => {
    const name = faker.person.fullName();
    const mypost = ["-Nm7gDFuGvICvbYAVa7T", "-Nm7gDLXUwjoGMDJodM6"];
    const likedposts = ["-Nm7gDBTzr6xSPqx_Fdx", "-Nm7gDC_pps0AKoACOiZ"];
    const bookmarks = ["-Nm7gDDfEK8bSy2oSg8Q"];
    const avatar = "https://source.unsplash.com/random/?avatar";
    const email = faker.internet.email();
    console.log(email);
    const encodedEmail = Base64.encode(email);
    // Remove '.com' from the email address
    // const formattedEmail = email.replace(/\.com$/, '');

    const newData = {
        name, avatar, email, mypost, likedposts, bookmarks
    };

    try {
        await axios.put(`https://algo-bullls-default-rtdb.asia-southeast1.firebasedatabase.app/user/-Nm7je81ns7AhjF2E0o3/${encodedEmail}.json`, newData);
        console.log("Dummy data created successfully.");
    } catch (error) {
        console.error('Error creating dummy data:', error);
    }
};

generateDummyData();
