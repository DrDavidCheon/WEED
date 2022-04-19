const express = require('express');
const bcrypt = require('bcrypt')
const User = require('../models/user');

const { isLoggedIn } = require('./helpers');
const { Movie } = require('../models');

const router = express.Router();

function isEmptyArr(arr)  {
    if(Array.isArray(arr) && arr.length === 0)  {
      return true;
    }
    return false;
}


router.route('/')
    .get(async (req, res, next) => {//회원가입 페이지를 응답
        try {
            res.render('userRegist');
        } catch (err) {
            console.error(err);
            next(err);
        }
    })
    .post(async (req, res, next) => {//회원 정보 등록
        const { id, password, name, description } = req.body;

        if (!password) return next('비밀번호를 입력하세요.');

        const user = await User.findOne({ where: { id } });
        if (user) {
            next('이미 등록된 사용자 아이디입니다.');
            return;
        }

        try {
            const hash = await bcrypt.hash(password, 12);
            await User.create({
                id,
                password: hash,
                name,
                unregist : false
            });

            res.redirect('/');
        } catch (err) {
            console.error(err);
            next(err);
        }
    });

//로그인한 사용자 정보를 관리하는 페이지를 응답한다.
router.get('/info', isLoggedIn, async (req, res, next) => {
    try {
        res.locals.userId = req.user.id;
        res.render('userInfo');
    } catch (err) {
        console.error(err);
        next(err);
    }
})

//회원 정보를 업데이트한다.
router.post('/update', async (req, res, next) => {
    try {
        const result = await User.update({
            description: req.body.description
        }, {
            where: { id: req.body.id }
        });

        if (result) res.redirect('/');
        else next('Not updated!')
    } catch (err) {
        console.error(err);
        next(err);
    }
});

//회원을 삭제한다. 본인일 경우에만.
router.get('/info/delete/:id', async (req, res, next) => {
    try {
        const result = await User.destroy({
            where: { id: req.params.id }
        });

        if (result) res.redirect('/');
        else next('Not deleted!')
    } catch (err) {
        console.error(err);
        next(err);
    }
});

//영화를 유저의 취향 영화목록에 등록한다. 등록이 돼있다면 취향 영화목록에서 삭제한다.
router.get('/recom/:movieId',isLoggedIn, async (req, res, next) => {
    try{
        const user = await User.findOne({ where: { id: req.user.id } });
        if(user){
            //usermovie행에서 로그인 아이디와 전달받은 영화 아이디를 가진 행이 있는지 찾는다.
            const userMovie = await user.getMovies( { raw: true, where: { id : req.params.movieId } });
            if(isEmptyArr(userMovie)){//없다면 usermovie 테이블에 등록한다. => 취향 영화 등록
                await user.addMovie(parseInt(req.params.movieId, 10));
            }
            else {//이미 존재한다면 usermovie 테이블에서 제거한다.
                await user.removeMovie( req.params.movieId );
            }
            //유저-영화 다대다 중간 테이블에서 위의 영화 코드를 가지고 있는 행의 개수를 가져온다 => 추천 수
            const movieId = await Movie.findOne({ where: { id: req.params.movieId } });
            const recom = await movieId.getUsers({ raw: true, attributes: ['id'] });
            await Movie.update({
                recom: recom.length
            }, {
                where: { id: req.params.movieId }
            });
        }
    } catch (err){
        console.error(err);
        next(err);
    }
    res.redirect(`/movie/detail/${req.params.movieId}`);
});

//내가 추천한 영화 목록 => 취향 영화 목록
router.get('/favor/movies', isLoggedIn, async (req, res, next) => {
    try{
        //받아온 아이디 값 으로 유저 테이블의 행 찾음
        const user = await User.findOne({ where: { id: req.user.id } });
        //usermovie행에서 로그인 아이디와 전달받은 영화 아이디를 가진 행이 있는지 찾는다.
        const userMovie = await user.getMovies({ raw: true });
        
        res.locals.movie = userMovie;
        res.render('userfavor');
    } catch (err){
        console.error(err);
        next(err);
    }
});

module.exports = router;