const express = require('express')
const app = express()
const port = 3000

app.use(express.json())

app.use('/', require('./routers/products'))
app.use('/', require('./routers/categories'))

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})