import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import Button from "@material-ui/core/Button";
import CardDeck from 'react-bootstrap/CardDeck'
import { useRef } from 'react';
import Flippy, { FrontSide, BackSide } from 'react-flippy';
import './Store.css';

export default function Store() {
  const ref = useRef();

  return (
    
    <div className="content">
    <main>
    <section id="store" class="section-store">
    <br/>
    <br/>
    <br/>
    <div class="section-title" >
      <h1>Prizes</h1>
      <br/>
  <div id="container">
    <div class="row">
      <div class="column">{/*for first row*/ }
        {/* first card*/ }
        <div class="card"> 
          <div>
            <img src="https://vlebazaar.in/image/cache/catalog/apple%204s/apple%206psg-550x550h.jpg" style={{height:90 , width:200}}></img>
          </div>
          <div id="one" style={{paddingTop:5}}>
                        <h5>Hurray!You won Rs.150 Discount</h5>
                        <h6>Apple iPhone 6s</h6>
                        <h5>MISSIONEDHX2021</h5>
                        <button class="btn btn-info"><a target="_blank" href="https://www.hxkart.com/smartphones/apple-iphone-6s-silver-64gb-offer" style={{ color:"white" , textDecoration: 'none'}}>Buy</a></button> 
                      </div>
                      </div>

        </div>
        {/* 2 card*/ }
        <div class="column">
       <div class="card">
          <div>
          <img src="https://vlebazaar.in/image/cache/catalog//-Apple-iPhone-7-Black-256-GB-p/-Apple-iPhone-7-Black-256-GB-p-550x550h.jpg" style={{height:90 , width:200}}></img>
 
          </div>
          <div id="second" style={{paddingTop:5}}>
                        <h5>Hurray!You won Rs.150 Discount on</h5>
                        <h6>Apple iPhone 7</h6>
                        <h5>MISSIONEDHX2021</h5>
                        <button class="btn btn-info"><a target="_blank" href="https://www.hxkart.com/smartphones/apple-iphone-7-black-32gb-un" style={{ color:"white" , textDecoration: 'none'}} >Buy</a></button> 
                      </div> 
        </div>
        </div>

        {/* 3 card*/ }
        <div class="column">
        <div class="card">
          <div>
            <img src="https://s3.ap-south-1.amazonaws.com/lowestrate.in/wp-content/uploads/2020/10/08140932/lowest.jpg" style={{height:90 , width:200}}></img>
          </div>
          <div id="third" style={{paddingTop:5}}>
                        <h5>Hurray!You won Rs.150 Discount on</h5>
                        <h6>Apple iPad mini</h6>
                        <h5>MISSIONEDHX2021</h5>
                        <button class="btn btn-info"><a target="_blank" href="https://www.hxkart.com/tablets/apple-ipad-mini-16-gb-7-9-inch-with-wi-fi-only" style={{ color:"white" , textDecoration: 'none'}}>Buy</a></button> 
                      </div>
        </div></div>
        {/* 4 card*/ }
        <div class="column">
        <div class="card">
          <div>
            <img src="https://images-na.ssl-images-amazon.com/images/I/71fJozIQZ3L._SY450_.jpg" style={{height:90 , width:200}}></img>
          </div>
          <div id="four" style={{paddingTop:5}}>
                        <h5>Hurray!You won Rs.150 Discount on</h5>
                        <h6>HUAWEI MediaPad</h6>
                        <h5>MISSIONEDHX2021</h5>
                        <button class="btn btn-info"><a target="_blank" href="https://www.hxkart.com/tablets/huawei-mediapad-t5-tablet-black-10-1-inch-3-32gb-wi-fi-4g-lte-5-mp-rear-camera-5100mah-battery-16-7m-colours-dual-stereo-speakers-children-s-corner-octa-core-processor-bluetooth" style={{ color:"white" , textDecoration: 'none'}}>Buy</a></button> 
                      </div>
        </div>
      </div>
      </div>
      </div>
      {/*for second row*/ }
      <div id="container">
      <div class="row">
      <div class="column">{/*for second row*/ }
        {/* 5 card*/ }
        <div class="card"> 
          <div>
            <img src="https://images-na.ssl-images-amazon.com/images/I/61tuQdl2yLL._SX522_.jpg" style={{height:90 , width:200}}></img>
          </div>
          <div id="five" style={{paddingTop:5}}>
                        <h5>Hurray!You won Rs.150 Discount on</h5>
                        <h6>Apple iPhone 11 Pro Max</h6>
                        <h5>MISSIONEDHX2021</h5>
                        <button class="btn btn-info"><a target="_blank" href="https://www.hxkart.com/smartphones/apple-iphone-11pro-max-spacegrey-64" style={{ color:"white" , textDecoration: 'none'}}>Buy</a></button> 
                      </div>


        </div></div>
        {/* 6 card*/ }
        <div class="column">
        <div class="card">
          <div>
            <img src="https://images-na.ssl-images-amazon.com/images/I/61SJu997CCL._SL1500_.jpg" style={{height:90 , width:200}}></img>
          </div>
          <div id="six" style={{paddingTop:5}}>
                        <h5>Hurray! You won Rs.150 Discount on</h5>
                        <h6>Apple 13" MacBook Pro</h6>
                        <h5>MISSIONEDHX2021</h5>
                        <button class="btn btn-info"><a target="_blank" href="https://www.hxkart.com/laptops/apple-13-macbook-pro" style={{ color:"white" , textDecoration: 'none'}}>Buy</a></button> 
                      </div>
        </div>

        </div>
        {/* 7 card*/ }
        <div class="column">
        <div class="card">
          <div>
            <img src="https://images-na.ssl-images-amazon.com/images/I/61n6Ovq6EdL._SL1500_.jpg" style={{height:90 , width:200}}></img>
          </div>
          <div id="seven" style={{paddingTop:5}}>
                        <h5>Hurray!You won Rs.150 Discount on</h5>
                        <h6>OnePlus 8</h6>
                        <h5>MISSIONEDHX2021</h5>
                        <button class="btn btn-info"><a target="_blank" href="https://www.hxkart.com/smartphones/oneplus-8-glacial-green-8gb-ram-128gb-storage-un" style={{ color:"white" , textDecoration: 'none'}}>Buy</a></button> 
                      </div>
        </div></div>
        {/* 8 card*/ }
        <div class="column">
        <div class="card">
          <div class="card-image">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr754hYTa4nCjDWvVxSma5guEBbKhri2h1mA&usqp=CAU" style={{height:90 , width:200}}></img>
          </div>
          <div id="eight" style={{paddingTop:5}}>
                        <h5>Hurrey!You won Rs.150 Discount on</h5>
                        <h6>APPLE Watch Series 6 </h6>
                        <h5>MISSIONEDHX2021</h5>
                        <button class="btn btn-info"><a target="_blank" href="https://www.hxkart.com/smartwatches/apple-watch-series-6-gps-44-mm-blue-aluminium-case-with-deep-navy-sport-band" style={{ color:"white" , textDecoration: 'none'}}>Buy</a></button> 
                      </div>
        </div>
        </div>



        </div>
    </div></div>
  </section>
  </main></div>
    );}