import express from 'express'
import Advert from '../models/advert'
import formidable from 'formidable'
import config from '../config'
import { basename } from 'path'



const router = express.Router()

router.get('/advert', (req, res, next) => {
  const page = Number.parseInt(req.query.page, 10)
  const pageSize = 5
  Advert.find().skip((page - 1) * pageSize).limit(5).exec((err, adverts) => {
    if (err) {
      return next(err)
    }
    Advert.count((err,count)=>{
      if(err){
        return next(err)
      }
      console.log(count);
      const totalPage = Math.ceil(count / pageSize )
      res.render('advert_list.html', { adverts , totalPage , page })
    })
    })
})

router.get('/advert/add', (req, res, next) => {
  res.render('advert_add.html')
})

router.post('/advert/add', (req, res, next) => {
  const form = formidable({ multiples: true })
  form.uploadDir = config.uploadDir
  form.keepExtensions = true
  form.parse(req, (err, fields, files) => {
    if (err) {
      return next(err)
    }
    const body = fields
    body.image = basename(files.image.path)
    const advert = new Advert({
      title: body.title,
      image: body.image,
      link: body.link,
      start_time: body.start_time,
      end_time: body.end_time,
    })
    advert.save((err, result) => {
      if (err) {
        return next(err)
      }
      res.json({
        err_code: 0
      })
    })
  })
})

router.get('/advert/list', (req, res, next) => {
  Advert.find((err, docs) => {
    if (err) {
      return next(err)
    }
    res.json({
      err_code: 0,
      result: docs
    })
  })
})

router.get('/advert/one/:advertId', (req, res, next) => {
  Advert.findById(req.params.advertId, (err, result) => {
    if (err) {
      return next(err)
    }
    res.json({
      err_code: 0,
      result: result
    })
  })
})

router.post('/advert/edit', (req, res, next) => {
  Advert.findById(req.body.id, (err, advert) => {
    if (err) {
      return next(err)
    }
    const body = req.body
    advert.title = body.title
    advert.image = body.image
    advert.link = body.link
    advert.start_time = body.start_time
    advert.end_time = body.end_time
    advert.last_modified = Date.now()
    advert.save((err, result) => {
      if (err) {
        return next(err)
      }
      res.json({
        err_code: 0,
      })
    })
  })
})

router.get('/advert/remove/:advertId', (req, res, next) => {
  Advert.remove({ _id: req.params.advertId }, err => {
    if (err) {
      return next(err)
    }
    res.json({
      err_code: 0
    })
  })
})

export default router
