import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {get,getCustom,orderUsers} from './utils'

var seasondata = null
export default function Leaderboard(props){


    var [state,setState] = React.useState({loaded:false})
    var [searchdata,setSearchdata] = useState('')
    // var [seasondata,setSeasondata] = useState({data:[]})
    var input = React.createRef()
    var colors = ['gold','silver','#CD7F32']
    

    useEffect(() => {

        Promise.all([
            get('seasons',{}),
            getCustom('getLeaderbordData',{limit:props.limit ?? 16})
        ]).then(([data1,data2]) => {
            seasondata = data1
            setState({
                loaded:true,
                users:data2.users,
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
            <select onChange={async (e) => {
                if(e.target.value == 'current season'){
                    var data = await getCustom('getLeaderbordData',{limit:props.limit ?? 16})
                    setState({
                        loaded:true,
                        users:data.users,
                    })
                }else{
                    seasondata.data[e.target.value].attributes.data.forEach((user,i) => user.rank = i)
                    setState({
                        loaded:true,
                        users:seasondata.data[e.target.value].attributes.data.slice(0,props.limit ?? 16)
                    })
                }
            }}>
                <option>current season</option>
                {(() => {
                    return seasondata.data.map((season,i) => {
                        return <option key={season.id} value={i}>{season.attributes.name}</option>
                    })
                })()}
            </select>
        <style>{
            `td{
                background-color:transparent !important;
            }`    
        }</style>
        <table style={{"margin":"0px", background:'white'}} className={"table table-light table-bordered"  + (props.enableSearch ? '' : 'w-auto')}>
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
                        return <tr style={{background:colors[user.rank]}} key={i}>
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