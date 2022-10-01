const sequelize = require('../lib/database')
const utils = require('../lib/utils')
const multer = require("multer")
const bodyParser = require('body-parser')
const { File } = sequelize.models
const { Router } = require('express')


const upload = multer()
const router = Router()

router.use(bodyParser.json())


router.post('/', upload.single('file'), async (req, res) => {
    console.log(req.file)
    if (!req.file) return res.json({ ok: false, message: 'No files were uploaded!'})

    const fileName = req.file.originalname

    if (fileName.length > 30) return res.json({ ok: false, message: 'File name is too long (max 30)'})

    const token  = utils.tokgen.generate()

    const newFile = File.build({
        key: fileName,
        token: await utils.hashToken(token),
        data: req.file.buffer
    })

    newFile.save()
        .then((item) => {
            res.json({ok: true, message: 'File uploaded successfully', result: {
                key: item.key, token: token
            }})
        })
        .catch(e => {
            res.status(400)
                .json({ok: false, message: 'File name must be unique'})
        })
})

router.param(function(name, fn) {  
    if (fn instanceof RegExp) {
      return function(req, res, next, val) {
        var captures;
        if (captures = fn.exec(String(val))) {
          req.params[name] = captures;
          next();
        } else {
          next('route');
        }
      }
    }
  });

router.param('key', /^.*$/)
router.get('/:key', (req, res) => {
    File.findOne({where: {key: req.params.key[0]} })
        .then(item => {
            res.send(item.data)
        })

        .catch((error) => {
            res.status(404)
                .json({ok: false, message: 'File not found'})
        })
    
    
})


router.param('key', /^.*$/)
router.delete('/:key', (req, res) => {
    File.findOne({where: {key: req.params.key[0]} })
        .then(item => {
            if (!item) {
                return res.status(404)
                    .json({ok: false, message: 'File not found'})
            }

            if (req.body.token) {
                
                if (utils.compareToken(req.body.token, item.token)) {
                    item.destroy()

                    res.json({ok: true, message: 'File deletted successfully'})
                } else {
                    res.status(400)
                        .json({ok: false, message: 'Token invalid'})
                }


            } else {
                res.status(400)
                    .json({ok: false, message: 'Token required'})
            }
        })
})

module.exports = router