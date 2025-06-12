 document.addEventListener("DOMContentLoaded",function(){
    const searchbutton = document.getElementById("searchbutton");
    const usernameinput = document.getElementById("userinput");
    const statscontainer = document.querySelector(".stats-container");
    const easyprogresscircle = document.querySelector(".easy-prgess");
    const mediumprogresscircle = document.querySelector(".medium-prgess");
    const hardprogresscircle = document.querySelector(".hard-prgess");
    const easylabel = document.getElementById("easylabel");
    const mediumlabel = document.getElementById("mediumlabel");
    const hardlabel= document.getElementById("hardlabel");
    const cardstatscontainer=document.querySelector(".statscards");
    function validateusername(username){
        if(username.trim() ===""){
            alert("username should not be empty");
            return false;
        }
        const regex= /^[a-zA-Z0-9_]{3,16}$/;
        const ismatching = regex.test(username);
        if(!ismatching){
            alert("Invalid Username");
        }
        return ismatching;
    }
    async function fetchuserdetails(username) {
    const proxy = "https://cors-anywhere.herokuapp.com/";
    const url = proxy + "https://leetcode.com/graphql";

    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
            }
          }
        }
      }
    `;

    try {
        searchbutton.textContent = "Searching...";
        searchbutton.disabled = true;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query: query,
                variables: { username: username }
            })
        });

        if (!response.ok) throw new Error("Failed to fetch user");

        const data = await response.json();

        const stats = data.data.matchedUser.submitStatsGlobal.acSubmissionNum;

        const easy = stats.find(d => d.difficulty === "Easy")?.count || 0;
        const medium = stats.find(d => d.difficulty === "Medium")?.count || 0;
        const hard = stats.find(d => d.difficulty === "Hard")?.count || 0;

        statscontainer.innerHTML = `
            <p>Easy: ${easy}</p>
            <p>Medium: ${medium}</p>
            <p>Hard: ${hard}</p>
        `;

    } catch (error) {
        statscontainer.innerHTML = `<p>❌ No data found.</p>`;
        console.error("Error fetching LeetCode data:", error);
    } finally {
        searchbutton.textContent = "Search";
        searchbutton.disabled = false;
    }
}

   
    searchbutton.addEventListener('click',function(){
        const username = usernameinput.value;
        if(validateusername(username)){
            fetchuserdetails(username);
        }
    })
 })
