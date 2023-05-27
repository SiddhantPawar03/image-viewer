import React, {Component} from "react";

export default class userDetails extends Component {
constructor(props){
    super(props);
    this.state = {
        userData: "",
    };
}
    componentDidMount() {
    fetch("http://localhost:3001/userData",{
      method:"POST",
      crossDomain:true,
      headers: {
        "Content-Type":"application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body:JSON.stringify({
        token: window.localStorage.getItem("token"),
      }),
    }).then((res)=>res.json())
    .then((data)=>{
      console.log(data, "userData");
      this.setState({userData: data.data});
      if(data.data=="Token Expired"){
        alert("Token Expired Login Again!");
        window.location.href = "./sign-in";
      }
    });
}
logOut=()=>{
    window.localStorage.clear();
    window.location.href = "./sign-in";
}
uploadImage=()=>{
  window.location.href = "./upload-image";
}
    render() {
        return(
            <div>
                Name<h1>{this.state.userData.fname}</h1>
                Email<h1>{this.state.userData.email}</h1><br/>
                <button onClick={this.uploadImage} className="btn btn-primary">Upload-Image</button>
                <button onClick={this.logOut} className="btn btn-primary">Log Out</button>
            </div>
        );
    }
}