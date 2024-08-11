class APIFeatures {
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }
    
    search(){
        let keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: 'i'
            }
        }: {};

        this.query.find({...keyword})
        return this
    }

    filter(){
        const queryStrCopy = {...this.queryStr}

        const removeFields = ['keyword', 'limit', 'page']
        removeFields.forEach(field => delete queryStrCopy[field])

        let queryStrPrice = JSON.stringify(queryStrCopy)
        queryStrPrice = queryStrPrice.replace(/\b(gt|gte|lt|lte)/g, match => `$${match}`)

        this.query.find(JSON.parse(queryStrPrice))
        return this
    }

    paginate(resultsPerPage){
        const currentPage = Number(this.queryStr.page) || 1
        const skip = resultsPerPage * (currentPage - 1)
        this.query.limit(resultsPerPage).skip(skip)
        return this
    }
}

module.exports = APIFeatures