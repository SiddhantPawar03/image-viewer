import React, { Component } from 'react';
import ImageUpload from './imageUpload';

export default class Image extends Component {
    constructor(props){
        super(props);
        this.state = {
            userData: "",
        };
    }
    render() {
        return (
          <div>
            <ImageUpload />
          </div>
          
        )
      }

}
