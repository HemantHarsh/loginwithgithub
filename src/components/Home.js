import React, { useContext, useEffect } from "react";
import { Redirect } from "react-router-dom";
import Styled from "styled-components";
import { AuthContext } from "../App";
import { Octokit } from "@octokit/rest";
// import { accesstoken } from "../server/index";
import axios from "axios";
export default function Home() {
  // const access_token = localStorage.getItem("access_token");
  const { state, dispatch } = useContext(AuthContext);
  let accesstoken = "";
  // console.log(state.user.accesstoken);
  debugger;
  if (state.user != null) {
    accesstoken = state.user.accesstoken;
  }
  let shaKey = "";
  const octokit = new Octokit({
    auth: accesstoken,
  });

  const getData = () => {
    octokit
      .request(
        "GET /repos/anushka-beri/static-site-generator/contents/src/data/menuItems.json",
        {
          owner: "anushka-beri",
          repo: "static-site-generator",
          path: "data/menuItems.json",
        }
      )
      .then((res) => {
        shaKey = res.data.sha;
        let decodedString = JSON.parse(atob(res.data.content));
        console.log(decodedString);
        // setTempArr(decodedString);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getData();
    //get API - gets data frm data/menuItems.js
  }, []);

  if (!state.isLoggedIn) {
    return <Redirect to="/login" />;
  }

  // const { avatar_url, name, public_repos, followers, following } = state.user;
  // console.log(state.user.accesstoken);

  const handleLogout = () => {
    dispatch({
      type: "LOGOUT",
    });
  };

  return (
    <Wrapper>
      <div className="container">
        <button onClick={() => handleLogout()}>Logout</button>
        <div>
          <button onClick={getData}>get api</button>
          {/* <div className="content">
            <img src={avatar_url} alt="Avatar" />
            <span>{name}</span>
            <span>{public_repos} Repos</span>
            <span>{followers} Followers</span>
            <span>{following} Following</span>
            <span>{process.env.REACT_APP_TOKEN} token</span>
          </div> */}
        </div>
      </div>
    </Wrapper>
  );
}

const Wrapper = Styled.section`
.container{
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: Arial;

  button{
    all: unset;
    width: 100px;
    height: 35px;
    margin: 10px 10px 0 0;
    align-self: flex-end;
    background-color: #0041C2;
    color: #fff;
    text-align: center;
    border-radius: 3px;
    border: 1px solid #0041C2;

    &:hover{
      background-color: #fff;
      color: #0041C2;
    }
  }

  >div{
    height: 100%;
    width: 100%;
    display: flex;
    font-size: 18px;
    justify-content: center;
    align-items: center;

    .content{
      display: flex;
      flex-direction: column;
      padding: 20px 100px;    
      box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
      width: auto;
  
      img{
        height: 150px;
        width: 150px;
        border-radius: 50%;
      }
  
      >span:nth-child(2){
        margin-top: 20px;
        font-weight: bold;
      }
  
      >span:not(:nth-child(2)){
        margin-top: 8px;
        font-size: 14px;
      }
  
    }

  }
}
`;
