import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {get,getHost} from './utils'

export default function Webpage(){
    var [state,setState] = useState({loaded:false})

	var params = useParams()

    useEffect(() => {
        get(`webpages/${params.id}`).then((data) => {
            setState({
                loaded:true,
                webpage:data.data,
                homepage:homepagedata.data,
            })
        })
    },[params])


    if(state.loaded == false)return <div>loading</div>

    return <div>
        <style>
            {`.documentcontent img{
                max-width:100%;
                height:auto;
            }`}
        </style>

        <div className="row documentcontent" style={{"justifyContent":"center"}}>
            <div className="column" style={{
                "background": `url('${getHost() + state.homepage.attributes.pagebackground.data.attributes.url}')`,
                "color": "black",
                "margin": "10px",
                "padding": "10px",
                "borderRadius": "3px",
                "maxWidth": "65rem",
                "backgroundRepeat": "repeat-y",
                "backgroundSize": "100%",
                "boxShadow": "black 0px 5px 9px 2px"
            }}>
                <h1>{state.webpage.attributes.title}</h1>
                <div className='ck-content' dangerouslySetInnerHTML={{__html:state.webpage.attributes.content}}></div>
            </div>
        </div>
    </div>
}



