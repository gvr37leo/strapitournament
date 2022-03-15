import React from 'react';
import {get, getHost, isLoggedIn} from '../pages/utils'
import qs from 'qs'

export default class Discord extends React.Component{

    constructor(){
        super();
        this.state = {
            loaded:false
        }
    }


    componentDidMount(){
        // /auth/discord/callback = place where provider sends users back
        // replace it with your own page and use the provided id
        //get id_token
        // send this too /auth/discord/callback&access_token=asdasdasd
        var res = qs.parse(window.location.search)
        console.log(res.raw.access_token)

        fetch(`${getHost()}/api/auth/discord/callback?access_token=${res.raw.access_token}`)
        .then(res => res.json())
        .then(data => {
            var jsondata = JSON.stringify(data)
            if(data?.status >= 300){
                alert(`something went wrong, please leave a message at the turin multiplayer discord. Errormessage ${data}`)
            }else{
                localStorage.setItem('logindata',jsondata)
                location.href = '/'
            }
        })

        this.setState({
            loaded:true,
        })
    }

    render(){
        if(this.state.loaded == false)return <div>loading</div>

        return <div>discord oauth</div>
    }
}
