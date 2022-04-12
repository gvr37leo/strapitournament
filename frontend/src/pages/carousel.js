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

    useEffect(() => {
        $('#' + props.id).owlCarousel({
            loop:true,
            margin:10,
            items:props.itemcount ?? 1,
            // autoplay:true,
            autoplayTimeout:5000,
            autoplayHoverPause:true,
            nav:false,
        })
    },[])

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