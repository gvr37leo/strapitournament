import React from 'react';
import { Link } from 'react-router-dom';
import {get,orderUsers} from './utils'

export default class Leaderboard extends React.Component{


    constructor(){
        super();
        this.state = {
            loaded:false
        }
        this.input = React.createRef()
        this.searchdata = ''
	}

	componentDidMount(){
        this.refetch()
	}

    refetch(){
        Promise.all([get('matches',{populate:'*'}),get('users',{
            filters:{
                username:{
                    $containsi:this.searchdata
                }
            }
        })]).then((res) => {
            var [matches,users] = res
            this.setState({
                loaded:true,
                matches:matches.data,
                users:users,
            })
            console.log(res)
        })
    }

    render(){
        if(this.state.loaded == false)return <div>loading</div>

        orderUsers(this.state.users,this.state.matches)
        return <div>
            <div style={{margin:'10px'}}>
                <form className="form-inline">
                    <div>
                        <input ref={this.input} name="search" />
                        <button onClick={() => {
                            this.searchdata = this.input.current.value
                            this.refetch()
                        }} className="btn btn-primary" type="button">search</button>
                    </div>
                    
                    
                </form>
            </div>

            <table style={{'marginTop':'20px'}} className="table table-light table-bordered">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">tourny wins</th>
                        <th scope="col">wins</th>
                        <th scope="col">losses</th>
                        <th scope="col">country</th>
                        <th scope="col">clan</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.users.map((user,i) => {
                        return <tr key={i}>
                            <td scope="row"><b>{i + 1}</b></td>
                            <td><Link to={`/profile/${user.id}`}>{user.username}</Link></td>
                            <td>{user.tournywins}</td>
                            <td>{user.wins}</td>
                            <td>{user.losses}</td>
                            <td>{user.country}</td>
                            <td>{user.clan}</td>
                        </tr>
                    })}
                </tbody>
            </table>
        </div>
    }
}




