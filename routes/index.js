const path = require('path');

const express = require('express');
const { User, Pot, PotStatus } = require('../models');
const Sequelize = require('sequelize');
const { isLoggedIn } = require('./helpers');
const { max } = require('../models/user');
const router = express.Router();



router.get('/', async (req, res, next) => {
    try{
        res.render('index');
    } catch (err) {
        console.error(err);
        next(err);
    }
    //맨 처음 장르값이 DB에 없어서 초기 설정을 해준다.
    // try {
    //     var id = 1;
    //     const genre = [
    //         '드라마', '판타지', '서부', '공포',
    //         '로맨스', '모험', '스릴러', '느와르',
    //         '컬트', '다큐멘터리', '코미디', '가족',
    //         '미스터리', '전쟁', '애니메이션', '범죄',
    //         '뮤지컬', 'SF', '액션', '무협', '에로',
    //         '서스펜스', '서사', '블랙코미디'
    //     ];
        
    //     const result = await Genre.findAll({
        
    //     });
    //     if(result.length==0)
    //     {
    //         console.log("장르 테이블에 값 생성");
    //         for(i in genre)
    //         {   
    //             console.log(genre[i]);
    //             await Genre.create({ 
    //                 id,
    //                 name : genre[i] 
    //             });
    //             id = id + 1;
    //         }
    //     }
    //     else 
    //     {
    //         console.log("장르 존재함");
    //     }
        
    //     //전체 영화중에 5개를 랜덤으로 가져온다.
    //     const movies = await Movie.findAll({
    //         order: [Sequelize.fn( 'RAND' ),],
    //         limit: 5,
    //         raw: true,
    //         attributes: ['id', 'title', 'director', 'recom', 'genreId']
    //      });
    //     res.locals.movies = movies;
    //     res.locals.user = req.user;
    //     res.render('index');
    // } catch (err) {
    //     console.error(err);
    //     next(err);
    // }


});
module.exports = router;