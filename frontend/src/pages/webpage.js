import React from 'react';
import {get,getHost} from './utils'

export default class Webpage extends React.Component{

    constructor(){
        super()
        this.state = {
            loaded:false
        }
    }

    componentDidMount(){
        get(`webpages/${1}`).then((data) => {
            this.setState({
                loaded:true,
                webpage:data.data,
                homepage:homepagedata.data,
            })
        })
    }

    render(){
        if(this.state.loaded == false)return <div>loading</div>
        return <div>
            <style>
                {`.documentcontent img{
                    max-width:100%;
                    height:auto;
                }`}
            </style>

            <div className="row documentcontent" style={{"justifyContent":"center"}}>
                <div className="column" style={{
                "background": `url('${getHost() + this.state.homepage.attributes.pagebackground.data.attributes.url}')`,
                "color": "black",
                "margin": "10px",
                "padding": "10px",
                "borderRadius": "3px",
                "maxWidth": "65rem",
                "backgroundRepeat": "repeat-y",
                "backgroundSize": "100%",
                "boxShadow": "black 0px 5px 9px 2px"
                }}>
                    <h1>{this.state.webpage.attributes.title}</h1>
                    {this.state.webpage.attributes.content}
                </div>
            </div>
        </div>
    }
}



