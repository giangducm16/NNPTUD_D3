let express = require('express')
let router = express.Router()
let slugify = require('slugify')
let { genID, getCateById } = require('../utils/id_handlers')
let { dataCategories, dataProducts } = require('../data')

// GET all products - Lấy tất cả sản phẩm (không cần truy vấn)
router.get('/api/v1/products', (req, res) => {
    let result = dataProducts.filter(function (e) {
        return !(e.isDeleted)
    })
    res.send(result)
})

// GET product by ID - Lấy sản phẩm theo id
router.get('/api/v1/products/:id', (req, res) => {
    let id = req.params.id;
    let result = dataProducts.filter(function (e) {
        return !(e.isDeleted) && e.id == id
    })
    if (result.length > 0) {
        res.send(result[0])
    } else {
        res.status(404).send({
            message: "ID NOT FOUND"
        })
    }
})

// POST - Tạo sản phẩm mới
router.post('/api/v1/products', (req, res) => {
    let newItem = {
        id: genID(dataProducts) + "",
        title: req.body.title,
        slug: slugify(req.body.title, {
            replacement: '-',
            remove: undefined,
            lower: true,
        }),
        price: req.body.price,
        description: req.body.description,
        images: req.body.images,
        category: getCateById(req.body.category, dataCategories),
        creationAt: new Date(Date.now()),
        updatedAt: new Date(Date.now())
    }
    dataProducts.push(newItem);
    res.send(newItem)
})

// PUT - Cập nhật sản phẩm theo id
router.put('/api/v1/products/:id', (req, res) => {
    let id = req.params.id;
    let getProduct = dataProducts.filter(function (e) {
        return e.id == id && !e.isDeleted
    })
    if (getProduct.length > 0) {
        getProduct = getProduct[0]
        let keys = Object.keys(req.body);
        for (const key of keys) {
            if (getProduct[key] !== undefined) {
                getProduct[key] = req.body[key]
            }
        }
        getProduct.updatedAt = new Date(Date.now())
        res.send(getProduct)
    } else {
        res.status(404).send({
            message: "ID NOT FOUND"
        })
    }
})

// DELETE - Xoá mềm sản phẩm theo id
router.delete('/api/v1/products/:id', (req, res) => {
    let id = req.params.id;
    let getProduct = dataProducts.filter(function (e) {
        return e.id == id && !e.isDeleted
    })
    if (getProduct.length > 0) {
        getProduct = getProduct[0]
        getProduct.isDeleted = true;
        getProduct.updatedAt = new Date(Date.now())
        res.send(getProduct)
    } else {
        res.status(404).send({
            message: "ID NOT FOUND"
        })
    }
})

module.exports = router;