import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {get,getCustom,getHost, orderUsers} from './utils'


export default function Carousel(props){

    // props.carouselitems 
    // {
    //     link
    //     title
    //     imageurl
    // }

    // useEffect(() => {
    //     $('#' + props.id).owlCarousel({
    //         loop:true,
    //         margin:10,
    //         items:props.itemcount ?? 1,
    //         // autoplay:true,
    //         autoplayTimeout:5000,
    //         autoplayHoverPause:true,
    //         nav:false,
    //     })
    // },[])

    return <div style={{"boxShadow":"0px 8px 8px 5px #0000006b"}} id={props.id} className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-indicators">
            {
                props.carouselitems.map((item,i) => {
                    return <button key={i} type="button" data-bs-target={'#'+props.id} data-bs-slide-to={i} className={i == 0 ? "active" : ""} aria-current="true" aria-label={"Slide " + i}></button>
                })
            }
        </div>
        <div className="carousel-inner">
            {
                props.carouselitems.map((item,i) => {
                    // "maxHeight":"300px"
                    return <div key={i} style={{}} className={`carousel-item  ${i == 0 ? 'active' : ''}`}>
                        <Link to={item.link}>
                            {/* "maxHeight":"300px" */}
                            <img style={{"objectFit":"cover","borderRadius":"3px"}} src={item.imageurl} className="d-block w-100" alt="..."/>
                            <div className="carousel-caption d-none d-md-block">
                                <h5 style={{"textShadow":"0px 0px 6px #000000"}}>{item.title}</h5>
                            </div>
                        </Link>
                    </div>
                })
            }
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target={'#'+props.id} data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target={'#'+props.id} data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
        </button>
        </div>


    return <div id={props.id} className="owl-carousel owl-theme">
        {props.carouselitems.map((carouselitem,i) => {
            return <div key={i} style={{"maxHeight":"300px"}}>
            <Link to={carouselitem.link}>
                {/* <img style={{"maxHeight":"300px","objectFit":"cover","borderRadius":"3px"}} src={carouselitem.imageurl } className="d-block w-100" alt="..."/> */}
                <img style={{"objectFit":"cover","borderRadius":"3px"}} src={carouselitem.imageurl } className="" alt="..."/>
                <div className="carousel-caption d-none d-md-block">
                    <h5 style={{"textShadow":"0px 0px 6px #000000"}}>{carouselitem.title}</h5>
                </div>
            </Link>
        </div>
        })}
    </div>
}