import React, {useEffect, useState} from 'react';

function ImageUpload() {

    const [image,setImage] = useState("");
    const [allImage, setAllImage] = useState([]);
    const [email, setEmail] = useState("");

    function convertToBase64(e) {
        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = () => {
            console.log(reader.result);
            // Converted to base64
            setImage(reader.result);
        };
        reader.onerror = error => {
            console.log("Error: " + error);
        };
    }
    useEffect(()=>{
        getImage()
    },[])

    function uploadImage() {
        fetch("http://localhost:3001/upload-image", {
            method: "POST",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                token: window.localStorage.getItem("token"),
                base64: image,
                email: email
            })
        }).then((res) => res.json()).then((data) => console.log(data))
    }

    function getImage() {
        fetch("http://localhost:3001/get-image",{
            method:"GET",
            }).then((res) => res.json()).then((data) => {console.log(data) 
            setAllImage(data.data)}) 
    }

    return (
        <div className="auth-wrapper">
            <div className="auth-inner" style={{width:"auto"}}>
                Upload ImageUpload<br/>
                <input type="file" 
                accept="/image"
                onChange={convertToBase64}
                />
                {/* view uploaded image */}
                {image=="" || image==null ? "" : <img width={100} height={100} src={image}/>}
                <button onClick={uploadImage}>Upload</button>
                <br/><br/><br/>
                {allImage.map(data=>{
                    return(
                        <img width={100} height={100} src={data.image}/>
                    )
                })}
            </div>
        </div>
    )
}

export default ImageUpload;