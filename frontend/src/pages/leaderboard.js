import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {get,getCustom,orderUsers} from './utils'


export default function Leaderboard(props){


    var [state,setState] = React.useState({loaded:false})
    var [searchdata,setSearchdata] = useState('')
    var input = React.createRef()

    useEffect(() => {

        getCustom('getLeaderbordData',{limit:props.limit ?? 15}).then(data => {
            setState({
                loaded:true,
                users:data.users,
            })
        })
    },[])
    

    if(state.loaded == false)return <div>loading</div>

    return <div style={{"margin":"20px 0 0","overflowX":"auto"}}>
        {(() => {
            if(props.enableSearch){
                return <div style={{margin:'10px'}}>
                    <form className="form-inline">
                        <div>
                            <input value={searchdata} ref={input} onChange={(e) => {
                                setSearchdata(e.target.value)
                            }} name="search" placeholder='search' />
                        </div>
                    </form>
                </div>
            }
        })()}
        
        <table style={{"margin":"0px"}} className={"table table-light table-bordered"  + (props.enableSearch ? '' : 'w-auto')}>
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">tourny wins</th>
                    <th scope="col">wins</th>
                    <th scope="col">losses</th>
                    <th scope="col">win%</th>
                    <th scope="col">country</th>
                    <th scope="col">clan</th>
                </tr>
            </thead>
            <tbody>
                {(() => {
                    var searchlower = searchdata.toLowerCase()
                    return state.users.filter(user => user.username.toLowerCase().includes(searchlower)).map((user,i) => {
                        return <tr key={i}>
                            <td scope="row"><b>{user.rank + 1}</b></td>
                            <td><Link to={`/profile/${user.id}`}>{user.username}</Link></td>
                            <td>{user.tournywins}</td>
                            <td>{user.wins}</td>
                            <td>{user.losses}</td>
                            <td>{+((user.wins / Math.max(user.wins + user.losses,1)) * 100).toFixed(1) }%</td> 
                            <td>{user.country}</td>
                            <td>{user.clan}</td>
                        </tr>
                    })
                })()}
            </tbody>
        </table>
    </div>
}